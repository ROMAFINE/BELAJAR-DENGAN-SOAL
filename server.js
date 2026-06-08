const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, "data");
const PARTICIPANTS_FILE = path.join(DATA_DIR, "participants.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const sessions = new Map();

const PUBLIC_FILES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".md": "text/markdown; charset=utf-8"
};

ensureDataFile();

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PARTICIPANTS_FILE)) fs.writeFileSync(PARTICIPANTS_FILE, "{}\n");
}

function readParticipants() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(PARTICIPANTS_FILE, "utf8"));
  } catch (error) {
    return {};
  }
}

function writeParticipants(data) {
  ensureDataFile();
  fs.writeFileSync(PARTICIPANTS_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

function normalizeId(name) {
  return String(name || "Peserta")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48) || "peserta";
}

function createSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(String(password), salt, 160000, 32, "sha256").toString("hex");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a), "hex");
  const right = Buffer.from(String(b), "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function timingSafeTextEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function createPasswordRecord(password) {
  const salt = createSalt();
  return {
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt)
  };
}

function verifyPassword(password, record) {
  if (!record?.passwordHash || !record?.passwordSalt) return false;
  const hash = hashPassword(password, record.passwordSalt);
  return timingSafeEqual(hash, record.passwordHash);
}

function verifyAdminPassword(password) {
  if (process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_SALT) {
    return verifyPassword(password, {
      passwordHash: process.env.ADMIN_PASSWORD_HASH,
      passwordSalt: process.env.ADMIN_PASSWORD_SALT
    });
  }

  if (process.env.ADMIN_PASSWORD) {
    return timingSafeTextEqual(password, process.env.ADMIN_PASSWORD);
  }

  return false;
}

function createSession(payload) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    ...payload,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return token;
}

function getSession(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload terlalu besar."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("JSON tidak valid."));
      }
    });
    req.on("error", reject);
  });
}

function defaultProgress() {
  return {
    points: 0,
    streak: 1,
    completed: 0,
    attempts: [],
    skillScores: {},
    currentLevel: "Belum tes",
    learningPath: "Basic",
    placementDone: false,
    latestResult: null
  };
}

function sanitizeProgress(progress) {
  return {
    ...defaultProgress(),
    points: Number(progress.points || 0),
    streak: Number(progress.streak || 1),
    completed: Number(progress.completed || 0),
    attempts: Array.isArray(progress.attempts) ? progress.attempts.slice(0, 100) : [],
    skillScores: progress.skillScores && typeof progress.skillScores === "object" ? progress.skillScores : {},
    currentLevel: String(progress.currentLevel || "Belum tes"),
    learningPath: String(progress.learningPath || "Basic"),
    placementDone: Boolean(progress.placementDone),
    latestResult: progress.latestResult || null
  };
}

async function handleApi(req, res) {
  try {
    if (req.method === "POST" && req.url === "/api/auth/admin") {
      const body = await readJson(req);
      if (!verifyAdminPassword(body.password || "")) {
        return sendJson(res, 401, { error: "Password admin salah atau ADMIN_PASSWORD belum diset di server." });
      }
      const token = createSession({ role: "admin" });
      return sendJson(res, 200, { token, role: "admin" });
    }

    if (req.method === "POST" && req.url === "/api/auth/participant") {
      const body = await readJson(req);
      const name = String(body.name || "Peserta").trim() || "Peserta";
      const password = String(body.password || "");
      if (password.length < 4) return sendJson(res, 400, { error: "Password peserta minimal 4 karakter." });

      const id = normalizeId(name);
      const participants = readParticipants();
      const existing = participants[id];

      if (existing && !verifyPassword(password, existing)) {
        return sendJson(res, 401, { error: "Password peserta salah." });
      }

      if (!existing) {
        participants[id] = {
          id,
          name,
          ...createPasswordRecord(password),
          progress: defaultProgress(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        writeParticipants(participants);
      }

      const token = createSession({ role: "participant", participantId: id });
      return sendJson(res, 200, {
        token,
        participant: { id, name: participants[id].name },
        progress: participants[id].progress || defaultProgress()
      });
    }

    if (req.method === "POST" && req.url === "/api/participant/progress") {
      const session = getSession(req);
      if (session?.role !== "participant") return sendJson(res, 401, { error: "Sesi peserta tidak valid." });

      const body = await readJson(req);
      const participants = readParticipants();
      const participant = participants[session.participantId];
      if (!participant) return sendJson(res, 404, { error: "Peserta tidak ditemukan." });

      participant.progress = sanitizeProgress(body);
      participant.updatedAt = new Date().toISOString();
      writeParticipants(participants);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "GET" && req.url === "/api/participant/progress") {
      const session = getSession(req);
      if (session?.role !== "participant") return sendJson(res, 401, { error: "Sesi peserta tidak valid." });

      const participants = readParticipants();
      const participant = participants[session.participantId];
      if (!participant) return sendJson(res, 404, { error: "Peserta tidak ditemukan." });
      return sendJson(res, 200, { progress: participant.progress || defaultProgress() });
    }

    if (req.method === "GET" && req.url === "/api/leaderboard") {
      const participants = readParticipants();
      const records = Object.values(participants)
        .map((participant) => {
          const progress = participant.progress || defaultProgress();
          const attempts = Array.isArray(progress.attempts) ? progress.attempts : [];
          const correct = attempts.filter((attempt) => attempt.isCorrect).length;
          const accuracy = attempts.length
            ? Math.round((correct / attempts.length) * 100)
            : (progress.latestResult?.score || 0);

          return {
            id: participant.id,
            name: participant.name,
            points: Number(progress.points || 0),
            completed: Number(progress.completed || 0),
            accuracy,
            level: progress.currentLevel || "Belum tes",
            learningPath: progress.learningPath || "Basic"
          };
        })
        .sort((a, b) => b.points - a.points || b.accuracy - a.accuracy)
        .slice(0, 50);
      return sendJson(res, 200, { records });
    }

    return sendJson(res, 404, { error: "Endpoint tidak ditemukan." });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Server error." });
  }
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent(req.url.split("?")[0]);
  const safePath = rawPath === "/" ? "/index.html" : rawPath;
  const filePath = path.normalize(path.join(__dirname, safePath));

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": PUBLIC_FILES[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`LinguaRank server running at http://localhost:${PORT}`);
  if (!process.env.ADMIN_PASSWORD && !(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_SALT)) {
    console.warn("Admin login disabled: set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH + ADMIN_PASSWORD_SALT.");
  }
});

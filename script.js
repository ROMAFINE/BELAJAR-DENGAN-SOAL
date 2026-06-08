const STORAGE_KEY = "linguarank-state-v1";
const ADMIN_MODE_KEY = "linguarank-admin-mode";
const SESSION_KEY = "linguarank-session";
const LEADERBOARD_KEY = "linguarank-global-leaderboard";
const PARTICIPANT_DATA_KEY = "linguarank-participants";
const ADMIN_PASSWORD = "ILOVEYOU";
const UNLOCK_REQUIREMENTS = {
  Foundation: 100,
  IELTS: 260,
  SAT: 260
};

const basicQuestions = [
  {
    id: "q-a0-alphabet-a",
    track: "Basic",
    level: "A0",
    skill: "Pronunciation",
    difficulty: "easy",
    prompt: "Huruf pertama dalam alfabet bahasa Inggris adalah...",
    passage: "A, B, C, D ...",
    options: ["A", "B", "C", "D"],
    answer: 0,
    hint: "Alphabet bahasa Inggris dimulai dari A.",
    explanation: "Jawaban benar adalah A. Di tahap Basic, pengguna mulai dari pengenalan huruf sebelum masuk ke kata dan kalimat.",
    wrongReasons: ["Correct.", "B adalah huruf kedua.", "C adalah huruf ketiga.", "D adalah huruf keempat."]
  },
  {
    id: "q-a0-greeting-hello",
    track: "Basic",
    level: "A0",
    skill: "Vocabulary",
    difficulty: "easy",
    prompt: "Apa arti kata 'hello'?",
    passage: "",
    options: ["Terima kasih", "Halo", "Maaf", "Selamat tinggal"],
    answer: 1,
    hint: "'Hello' dipakai saat menyapa orang.",
    explanation: "'Hello' berarti halo. Ini adalah sapaan paling dasar dalam bahasa Inggris.",
    wrongReasons: ["Terima kasih adalah 'thank you'.", "Correct.", "Maaf adalah 'sorry'.", "Selamat tinggal adalah 'goodbye'."]
  },
  {
    id: "q-a0-introduction-name",
    track: "Basic",
    level: "A0",
    skill: "Vocabulary",
    difficulty: "easy",
    prompt: "Kalimat mana yang benar untuk memperkenalkan nama?",
    passage: "",
    options: ["My name is Roma.", "Name my Roma.", "I Roma name.", "Roma is my from."],
    answer: 0,
    hint: "Pola paling aman: My name is + nama.",
    explanation: "'My name is Roma' berarti 'Nama saya Roma'. Pola ini bisa dipakai oleh pemula untuk memperkenalkan diri.",
    wrongReasons: ["Correct.", "Urutan katanya salah.", "Kalimat tidak lengkap.", "Kalimat tidak sesuai makna."]
  },
  {
    id: "q-a1-i-am-student",
    track: "Basic",
    level: "A1",
    skill: "Grammar",
    difficulty: "easy",
    prompt: "Pilih kalimat yang berarti 'Saya seorang pelajar'.",
    passage: "",
    options: ["I am a student.", "I is a student.", "I are student.", "I student am."],
    answer: 0,
    hint: "Untuk 'I', gunakan 'am'.",
    explanation: "Kalimat yang benar adalah 'I am a student.' Subjek 'I' memakai to be 'am'.",
    wrongReasons: ["Correct.", "'I' tidak memakai 'is'.", "'I' tidak memakai 'are' di sini.", "Urutan katanya salah."]
  },
  {
    id: "q-a1-basic-object-book",
    track: "Basic",
    level: "A1",
    skill: "Vocabulary",
    difficulty: "easy",
    prompt: "Apa arti kata 'book'?",
    passage: "",
    options: ["Meja", "Buku", "Pintu", "Air"],
    answer: 1,
    hint: "Benda ini sering dipakai untuk membaca dan belajar.",
    explanation: "'Book' berarti buku. Kosakata benda harian seperti ini penting sebelum membaca kalimat panjang.",
    wrongReasons: ["Meja adalah 'table'.", "Correct.", "Pintu adalah 'door'.", "Air adalah 'water'."]
  },
  {
    id: "q-a1-like-sentence",
    track: "Basic",
    level: "A1",
    skill: "Grammar",
    difficulty: "easy",
    prompt: "Lengkapi kalimat: I _____ English.",
    passage: "Artinya: Saya suka bahasa Inggris.",
    options: ["like", "likes", "liking", "liked"],
    answer: 0,
    hint: "Untuk subjek 'I' dalam simple present, gunakan verb dasar.",
    explanation: "Jawaban benar adalah 'like'. Kalimat lengkapnya: 'I like English.'",
    wrongReasons: ["Correct.", "'Likes' dipakai untuk he/she/it.", "'Liking' perlu to be.", "'Liked' bentuk lampau."]
  }
];

const starterQuestions = [
  {
    id: "q-a1-grammar-she-goes",
    track: "Foundation",
    level: "A1",
    skill: "Grammar",
    difficulty: "easy",
    prompt: "Choose the correct sentence.",
    passage: "",
    options: [
      "She go to school every day.",
      "She goes to school every day.",
      "She going to school every day.",
      "She gone to school every day."
    ],
    answer: 1,
    hint: "Look at subject-verb agreement for third person singular.",
    explanation: "The subject 'she' needs a verb with -s or -es in simple present. Option A misses the -s. Option C is an incomplete continuous form. Option D is a past participle without an auxiliary.",
    wrongReasons: [
      "The verb 'go' does not agree with 'she'.",
      "Correct.",
      "The form needs an auxiliary such as 'is'.",
      "A past participle cannot stand alone here."
    ]
  },
  {
    id: "q-b1-reading-bus",
    track: "Foundation",
    level: "B1",
    skill: "Reading",
    difficulty: "medium",
    prompt: "Why was Maya late?",
    passage: "Maya missed the bus, so she arrived late.",
    options: ["She forgot school.", "She missed the bus.", "She was sick.", "She walked too fast."],
    answer: 1,
    hint: "The word 'so' connects cause and result.",
    explanation: "The cause is 'missed the bus' and the result is 'arrived late'. The other choices are not supported by the text.",
    wrongReasons: ["Not mentioned.", "Correct.", "Not mentioned.", "Not mentioned."]
  },
  {
    id: "q-b2-vocab-plausible",
    track: "Foundation",
    level: "B2",
    skill: "Vocabulary",
    difficulty: "hard",
    prompt: "What does plausible mean in the sentence?",
    passage: "The researcher's claim was plausible because it was supported by recent data.",
    options: ["impossible", "reasonable", "emotional", "unrelated"],
    answer: 1,
    hint: "Use the context clue after 'because'.",
    explanation: "Plausible means reasonable or believable. The clue is that the claim was supported by recent data.",
    wrongReasons: ["Opposite meaning.", "Correct.", "Not connected to the clue.", "Not connected to the clue."]
  },
  {
    id: "q-ielts-reading-urban-gardens",
    track: "IELTS",
    level: "B2",
    skill: "Reading",
    difficulty: "hard",
    prompt: "Which statement is supported by the passage?",
    passage: "Urban gardens reduce heat and improve local air quality.",
    options: [
      "Urban gardens remove all pollution.",
      "Urban gardens can help improve city environments.",
      "Urban gardens are cheaper than parks.",
      "Urban gardens stop climate change completely."
    ],
    answer: 1,
    hint: "Avoid extreme claims that go beyond the passage.",
    explanation: "Option B is supported by both facts in the passage. Options A and D are too extreme. Option C is not mentioned.",
    wrongReasons: ["Too extreme.", "Correct.", "Not mentioned.", "Too extreme."]
  },
  {
    id: "q-sat-transition-therefore",
    track: "SAT",
    level: "B2",
    skill: "Reasoning",
    difficulty: "hard",
    prompt: "Which transition best fits?",
    passage: "The team collected data for six months; _____, their conclusion was based on a long observation period.",
    options: ["however", "therefore", "for example", "in contrast"],
    answer: 1,
    hint: "The second clause follows logically from the first.",
    explanation: "'Therefore' shows cause and result. 'However' and 'in contrast' show opposition, while 'for example' introduces an example.",
    wrongReasons: ["Shows contrast.", "Correct.", "Adds an example, not a result.", "Shows contrast."]
  },
  {
    id: "q-a2-preposition-school",
    track: "Foundation",
    level: "A2",
    skill: "Grammar",
    difficulty: "medium",
    prompt: "Complete the sentence: We arrived _____ school at 7:30.",
    passage: "",
    options: ["on", "at", "in", "to"],
    answer: 1,
    hint: "Use the preposition commonly used with arrival at a place.",
    explanation: "We usually say 'arrive at school' for a specific place. 'Arrive in' is used for cities or countries.",
    wrongReasons: ["Not used with 'arrived' here.", "Correct.", "Used for cities or countries.", "Not the standard phrase here."]
  },
  {
    id: "q-b1-inference-rain",
    track: "Foundation",
    level: "B1",
    skill: "Reading",
    difficulty: "medium",
    prompt: "What can be inferred?",
    passage: "The sky grew dark, and Lia put her umbrella into her bag before leaving.",
    options: [
      "Lia expected rain.",
      "Lia lost her bag.",
      "The weather was sunny.",
      "Lia stayed at home."
    ],
    answer: 0,
    hint: "Connect the dark sky with the umbrella.",
    explanation: "The umbrella and dark sky suggest Lia expected rain. The other choices add unsupported details.",
    wrongReasons: ["Correct.", "Not supported.", "Opposite of the clue.", "Not supported."]
  },
  {
    id: "q-c1-tone-academic",
    track: "SAT",
    level: "C1",
    skill: "Reasoning",
    difficulty: "hard",
    prompt: "Which choice best describes the author's tone?",
    passage: "Although the proposal has limitations, the early evidence suggests it deserves careful testing rather than immediate rejection.",
    options: ["dismissive", "cautiously supportive", "angry", "unconcerned"],
    answer: 1,
    hint: "Notice the balance between limitation and support.",
    explanation: "The author admits limitations but supports careful testing, so the tone is cautiously supportive.",
    wrongReasons: ["The author does not reject the proposal.", "Correct.", "No anger is shown.", "The author cares about testing it."]
  },
  {
    id: "q-ielts-writing-task2",
    track: "IELTS",
    level: "C1",
    skill: "Writing",
    difficulty: "hard",
    prompt: "Which checklist item is most important for IELTS Writing Task 2 task response?",
    passage: "Some people believe schools should focus more on practical skills than academic subjects. Discuss both views and give your opinion.",
    options: [
      "Use as many rare words as possible.",
      "Address both views and give a clear opinion.",
      "Write only one long paragraph.",
      "Avoid examples completely."
    ],
    answer: 1,
    hint: "Task response checks whether the prompt is fully answered.",
    explanation: "Task 2 requires addressing all parts of the prompt. Rare vocabulary helps only when accurate and natural.",
    wrongReasons: ["Unnatural vocabulary can lower clarity.", "Correct.", "Paragraphing matters.", "Relevant examples strengthen support."]
  },
  {
    id: "q-sat-punctuation",
    track: "SAT",
    level: "B2",
    skill: "Grammar",
    difficulty: "hard",
    prompt: "Which version uses punctuation correctly?",
    passage: "",
    options: [
      "The experiment was simple it produced useful data.",
      "The experiment was simple, it produced useful data.",
      "The experiment was simple; it produced useful data.",
      "The experiment was simple: and it produced useful data."
    ],
    answer: 2,
    hint: "Two independent clauses need correct separation.",
    explanation: "A semicolon can join two closely related independent clauses. Option B creates a comma splice.",
    wrongReasons: ["Run-on sentence.", "Comma splice.", "Correct.", "The colon and 'and' do not work together here."]
  }
];

const placementQuestions = [
  basicQuestions[1],
  basicQuestions[2],
  basicQuestions[5],
  starterQuestions[0],
  starterQuestions[5],
  starterQuestions[6],
  starterQuestions[1],
  starterQuestions[2],
  starterQuestions[4],
  starterQuestions[9]
];

const skillDefaults = {
  Pronunciation: 38,
  Grammar: 62,
  Vocabulary: 68,
  Reading: 58,
  Writing: 42,
  Reasoning: 55
};

const hiddenAssessmentSkills = new Set(["Listening", "Speaking"]);

const schema = [
  ["users", "id, name, email, password_hash, role, created_at"],
  ["questions", "id, level, skill, test_type, prompt, options, answer, explanation, difficulty"],
  ["question_tags", "question_id, tag"],
  ["attempts", "user_id, question_id, selected_answer, is_correct, time_spent"],
  ["skill_scores", "user_id, skill, score, mastery_level, updated_at"],
  ["points_log", "user_id, points, reason, created_at"],
  ["mock_tests", "user_id, test_type, score, duration, created_at"]
];

const ieltsCards = [
  ["Reading", "True/False/Not Given, matching headings, gap fill, inference.", 64],
  ["Writing", "Task 1, Task 2, coherence, vocabulary, grammar, task response.", 48],
  ["Band 5.5 Practice", "Fondasi B1-B2 dengan timing ringan dan review intensif.", 59],
  ["Band 7.0+ Simulation", "Reasoning akademik, writing rubric, dan pressure timer.", 38]
];

const satCards = [
  ["Information and Ideas", "Main idea, detail, inference, command of evidence.", 62],
  ["Craft and Structure", "Vocabulary in context, text structure, purpose, tone.", 58],
  ["Standard English Conventions", "Agreement, punctuation, modifiers, sentence boundaries.", 64],
  ["Expression of Ideas", "Transitions, organization, rhetorical synthesis.", 52]
];

const basicRoadmap = [
  ["1", "A0 Starter", "Huruf, bunyi dasar, angka, warna, salam, dan kata benda harian."],
  ["2", "A0 Survival Words", "Kata yang sering dipakai: I, you, name, school, book, water, eat, go."],
  ["3", "A1 Simple Sentences", "Pola kalimat pendek: I am, I have, I like, This is, There is."],
  ["4", "A1 Daily Questions", "Menjawab pertanyaan: What is your name? Where are you from? What do you like?"],
  ["5", "Bridge to Foundation", "Mulai grammar dasar, vocabulary tambahan, dan reading pendek."]
];

const basicModules = [
  ["Alphabet & Sounds", "Mengenal A-Z, bunyi huruf, spelling nama, dan contoh kata sederhana.", 25],
  ["Daily Vocabulary", "50-100 kata pertama untuk rumah, sekolah, makanan, waktu, dan aktivitas.", 35],
  ["Simple Sentence Builder", "Menyusun kalimat sangat pendek dengan I am, I have, I like, dan this is.", 42],
  ["Mini Dialogue", "Dialog dua baris untuk salam, perkenalan, meminta bantuan, dan bertanya arti kata.", 30],
  ["Grammar Zero", "To be, subject, object, singular-plural, dan kata kerja dasar tanpa istilah berat.", 28],
  ["Bridge Practice", "Latihan campuran A0-A1 sebelum masuk Foundation dan tes penempatan.", 40]
];

let state = loadState();
let session = loadSession();
let isAdmin = session?.role === "admin";
let allQuestions = [...basicQuestions, ...starterQuestions, ...state.customQuestions];
let route = "dashboard";
let placementIndex = 0;
let placementAnswers = Array(placementQuestions.length).fill(null);
let practiceFilter = "all";
let practiceIndex = 0;
let selectedPracticeAnswer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadState() {
  const fallback = {
    points: 0,
    streak: 1,
    completed: 0,
    attempts: [],
    skillScores: { ...skillDefaults },
    currentLevel: "Belum tes",
    learningPath: "Basic",
    placementDone: false,
    customQuestions: [],
    latestResult: null
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...fallback, ...saved, skillScores: { ...skillDefaults, ...saved.skillScores } } : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveParticipantProgress();
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch (error) {
    return null;
  }
}

function saveSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
}

function loadParticipantStore() {
  try {
    return JSON.parse(localStorage.getItem(PARTICIPANT_DATA_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveParticipantStore(store) {
  localStorage.setItem(PARTICIPANT_DATA_KEY, JSON.stringify(store));
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 256);
    });
  }
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fallbackHash(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

async function hashParticipantPassword(password, salt) {
  const input = new TextEncoder().encode(`${salt}:${password}`);
  if (!window.crypto?.subtle) return fallbackHash(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function setParticipantPassword(id, password) {
  const store = loadParticipantStore();
  const existing = store[id] || {};
  const passwordSalt = randomSalt();
  const passwordHash = await hashParticipantPassword(password, passwordSalt);
  store[id] = {
    ...existing,
    id,
    passwordSalt,
    passwordHash,
    updatedAt: new Date().toISOString()
  };
  saveParticipantStore(store);
}

async function verifyParticipantPassword(saved, password) {
  if (!saved?.passwordHash || !saved?.passwordSalt) return "needs-password";
  const hash = await hashParticipantPassword(password, saved.passwordSalt);
  return hash === saved.passwordHash;
}

function participantSnapshot() {
  return {
    points: state.points,
    streak: state.streak,
    completed: state.completed,
    attempts: state.attempts,
    skillScores: state.skillScores,
    currentLevel: state.currentLevel,
    learningPath: state.learningPath,
    placementDone: state.placementDone,
    latestResult: state.latestResult
  };
}

function applyParticipantProgress(progress = {}) {
  state = {
    ...state,
    points: progress.points || 0,
    streak: progress.streak || 1,
    completed: progress.completed || 0,
    attempts: progress.attempts || [],
    skillScores: { ...skillDefaults, ...progress.skillScores },
    currentLevel: progress.currentLevel || "Belum tes",
    learningPath: progress.learningPath || "Basic",
    placementDone: Boolean(progress.placementDone),
    latestResult: progress.latestResult || null
  };
  resetPlacement();
}

function saveParticipantProgress() {
  if (session?.role !== "participant") return;
  const id = session.id || leaderboardIdForName(session.name);
  const store = loadParticipantStore();
  const existing = store[id] || {};
  store[id] = {
    ...existing,
    id,
    name: session.name || "Peserta",
    ...participantSnapshot(),
    updatedAt: new Date().toISOString()
  };
  saveParticipantStore(store);
}

function loadParticipantProgress(id) {
  const store = loadParticipantStore();
  const saved = store[id];
  if (!saved) return false;

  applyParticipantProgress(saved);
  return true;
}

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(records) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(records));
}

function leaderboardIdForName(name) {
  return (name || "Peserta")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48) || "peserta";
}

function updateLeaderboardMemory() {
  if (session?.role !== "participant") return;

  const id = leaderboardIdForName(session.name);
  const records = loadLeaderboard();
  const existing = records.find((record) => record.id === id);
  const correct = state.attempts.filter((attempt) => attempt.isCorrect).length;
  const total = state.attempts.length;
  const accuracy = total ? Math.round((correct / total) * 100) : (state.latestResult?.score || 0);

  const nextRecord = {
    id,
    name: session.name || "Peserta",
    points: Math.max(existing?.points || 0, state.points),
    completed: Math.max(existing?.completed || 0, state.completed),
    accuracy: Math.max(existing?.accuracy || 0, accuracy),
    level: state.currentLevel,
    learningPath: state.learningPath,
    updatedAt: new Date().toISOString()
  };

  const nextRecords = [
    nextRecord,
    ...records.filter((record) => record.id !== id)
  ]
    .sort((a, b) => b.points - a.points || b.accuracy - a.accuracy)
    .slice(0, 30);

  saveLeaderboard(nextRecords);
}

function resetPlacement() {
  placementIndex = 0;
  placementAnswers = Array(placementQuestions.length).fill(null);
}

function resetLearnerProgress() {
  state = {
    ...state,
    points: 0,
    streak: 1,
    completed: 0,
    attempts: [],
    skillScores: { ...skillDefaults },
    currentLevel: "Belum tes",
    learningPath: "Basic",
    placementDone: false,
    latestResult: null
  };
  saveState();
  resetPlacement();
}

function loadAdminMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("admin") === "0") {
    localStorage.removeItem(ADMIN_MODE_KEY);
    return false;
  }
  return false;
}

function syncAdminVisibility() {
  const showAdmin = isAdmin && session?.role === "admin";
  $$("[data-admin-only]").forEach((item) => {
    item.hidden = !showAdmin;
  });
}

function syncAppVisibility() {
  const isLoggedIn = Boolean(session?.role);
  $("#authGate").hidden = isLoggedIn;
  $("#appHeader").hidden = !isLoggedIn;
  $("#appMain").hidden = !isLoggedIn;
  if (isLoggedIn) {
    const label = session.role === "admin" ? "Admin" : `Peserta: ${session.name || "Peserta"}`;
    $("#accountLabel").textContent = label;
  }
  syncAdminVisibility();
}

function setRoute(nextRoute) {
  if (!session?.role) {
    syncAppVisibility();
    return;
  }

  if (nextRoute === "admin" && !(isAdmin && session?.role === "admin")) {
    window.alert("Masuk sebagai admin dulu.");
    nextRoute = "dashboard";
  }
  route = nextRoute;
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === route));
  $$(".nav-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.route === route));
  if (route === "hasil") renderResults();
  if (route === "review") renderReview();
  if (route === "leaderboard") renderLeaderboard();
  window.location.hash = route;
}

function placementPath(score) {
  if (score < 42) return "Basic";
  if (score < 74) return "Foundation";
  return "Academic";
}

function canAccessTrack(track) {
  if (session?.role === "admin") return true;
  if (track === "Basic" || track === "all") return true;
  if (!state.latestResult) return false;
  if (track === "Foundation") {
    return state.learningPath !== "Basic" || state.points >= UNLOCK_REQUIREMENTS.Foundation;
  }
  if (track === "IELTS" || track === "SAT") {
    if (state.learningPath === "Academic") return true;
    return state.points >= UNLOCK_REQUIREMENTS[track];
  }
  return true;
}

function lockedTrackMessage(track) {
  if (!state.latestResult) return "Selesaikan tes singkat dulu agar sistem tahu jalur belajarmu.";
  const needed = UNLOCK_REQUIREMENTS[track] || UNLOCK_REQUIREMENTS.Foundation;
  const remaining = Math.max(0, needed - state.points);
  return `Track ${track} masih terkunci. Kumpulkan ${remaining} poin lagi dari latihan Basic untuk membukanya.`;
}

function accessibleTrackLabel() {
  const tracks = ["Basic", "Foundation", "IELTS", "SAT"].filter((track) => canAccessTrack(track));
  return tracks.join(", ");
}

function renderBasic() {
  $("#basicRoadmap").innerHTML = basicRoadmap.map(([step, title, copy]) => `
    <article class="basic-roadmap-item">
      <span class="basic-step">${step}</span>
      <div>
        <h3>${title}</h3>
        <p>${copy}</p>
      </div>
    </article>
  `).join("");

  $("#basicModules").innerHTML = basicModules.map(([title, copy, readiness]) => `
    <article class="arena-card">
      <span class="tag">English Basic</span>
      <h2>${title}</h2>
      <p>${copy}</p>
      <div>
        <span class="metric-label">Progress awal</span>
        <meter min="0" max="100" value="${readiness}">${readiness}%</meter>
      </div>
      <button class="secondary-action basic-practice-button" type="button">Latihan Basic</button>
    </article>
  `).join("");

  renderBasicUnlockStatus();
}

function renderDashboard() {
  $("#activeLevel").textContent = state.currentLevel;
  $("#pointTotal").textContent = state.points.toLocaleString("id-ID");
  $("#accessStatus").textContent = accessibleTrackLabel();
  $("#accessHint").textContent = state.latestResult
    ? `Jalur: ${state.learningPath}. Poin membuka track lanjutan.`
    : "Peserta perlu menyelesaikan tes singkat dulu.";
  $("#completedTotal").textContent = state.completed.toLocaleString("id-ID");

  const sorted = Object.entries(state.skillScores)
    .filter(([skill]) => !hiddenAssessmentSkills.has(skill))
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
  $("#recommendationList").innerHTML = sorted
    .map(([skill, value]) => `
      <div class="recommendation">
        <strong>${recommendationTitle(skill)}</strong>
        <span>${recommendationCopy(skill, value)}</span>
      </div>
    `)
    .join("");

  renderUnlockPanel();
}

function refreshAccessViews() {
  renderDashboard();
  renderBasicUnlockStatus();
  setActiveSegment();
  renderArena("#ieltsArena", ieltsCards, "IELTS");
  renderArena("#satArena", satCards, "SAT English");
  if (route === "leaderboard") renderLeaderboard();
}

function renderUnlockPanel() {
  const panel = $("#unlockPanel");
  if (!panel) return;

  if (!state.latestResult) {
    panel.classList.add("is-visible");
    panel.innerHTML = `
      <p class="eyebrow">Tes singkat belum selesai</p>
      <h2>Selesaikan Tes Awal untuk menentukan jalur belajar.</h2>
      <p>Tanpa hasil tes, sistem hanya membuka Basic agar peserta tidak langsung masuk soal yang terlalu sulit.</p>
      <div class="score-actions">
        <button class="primary-action" data-route="placement" type="button">Mulai Tes Awal</button>
      </div>
    `;
    return;
  }

  if (!canAccessTrack("Foundation")) {
    const needed = UNLOCK_REQUIREMENTS.Foundation;
    const progress = Math.min(100, Math.round((state.points / needed) * 100));
    panel.classList.add("is-visible");
    panel.innerHTML = `
      <p class="eyebrow">Track lanjutan terkunci</p>
      <h2>Basic terbuka. Foundation butuh ${needed} poin.</h2>
      <p>Hasil tes menunjukkan peserta perlu mulai dari Basic. Kumpulkan poin dari latihan Basic untuk membuka soal Foundation.</p>
      <div class="unlock-meter">
        <div class="bar-shell"><div class="bar-fill" style="width: ${progress}%"></div></div>
        <strong>${state.points}/${needed} poin</strong>
      </div>
    `;
    return;
  }

  if (!canAccessTrack("IELTS") || !canAccessTrack("SAT")) {
    const needed = UNLOCK_REQUIREMENTS.IELTS;
    const progress = Math.min(100, Math.round((state.points / needed) * 100));
    panel.classList.add("is-visible");
    panel.innerHTML = `
      <p class="eyebrow">Academic arena</p>
      <h2>IELTS/SAT terbuka setelah ${needed} poin.</h2>
      <p>Peserta sudah bisa latihan dasar/menengah. Kumpulkan poin lagi untuk membuka arena akademik.</p>
      <div class="unlock-meter">
        <div class="bar-shell"><div class="bar-fill" style="width: ${progress}%"></div></div>
        <strong>${state.points}/${needed} poin</strong>
      </div>
    `;
    return;
  }

  panel.classList.remove("is-visible");
  panel.innerHTML = "";
}

function renderBasicUnlockStatus() {
  const status = $("#basicUnlockStatus");
  if (!status) return;

  if (!state.latestResult) {
    status.textContent = "Tes awal belum selesai. Basic tetap terbuka untuk mulai belajar.";
    return;
  }

  if (canAccessTrack("Foundation")) {
    status.textContent = "Foundation sudah terbuka. Peserta boleh lanjut dari Basic ke latihan berikutnya.";
    return;
  }

  const needed = UNLOCK_REQUIREMENTS.Foundation;
  const remaining = Math.max(0, needed - state.points);
  status.textContent = `Foundation masih terkunci. Butuh ${remaining} poin lagi dari latihan Basic.`;
}

function recommendationTitle(skill) {
  const titles = {
    Pronunciation: "Alphabet & Sounds",
    Grammar: "A2 Grammar Track",
    Vocabulary: "Vocabulary in Context",
    Reading: "B1 Reading Reasoning",
    Writing: "IELTS Writing Checklist",
    Reasoning: "SAT Evidence Practice"
  };
  return titles[skill] || `${skill} Practice`;
}

function recommendationCopy(skill, value) {
  if (value < 50) return `${skill} masih di bawah 50%. Mulai dari fondasi dan ulangi pembahasan setelah salah.`;
  if (value < 65) return `${skill} perlu penguatan agar tidak menahan kenaikan level. Targetkan akurasi 75%.`;
  return `${skill} sudah cukup baik. Naikkan difficulty dan mulai timed practice.`;
}

function renderPlacement() {
  const question = placementQuestions[placementIndex];
  $("#placementCounter").textContent = `${placementIndex + 1} / ${placementQuestions.length}`;
  $("#placementProgress").style.width = `${((placementIndex + 1) / placementQuestions.length) * 100}%`;
  $("#placementEstimate").textContent = estimatePlacementLabel();
  $("#placementLevel").textContent = question.level;
  $("#placementSkill").textContent = question.skill;
  $("#placementPrompt").textContent = question.prompt;

  $("#placementOptions").innerHTML = question.options
    .map((option, index) => `
      <button class="option-button ${placementAnswers[placementIndex] === index ? "is-selected" : ""}" data-placement-answer="${index}" type="button">
        <span class="option-key">${String.fromCharCode(65 + index)}</span>
        <span>${option}</span>
      </button>
    `)
    .join("");

  $("#placementBack").disabled = placementIndex === 0;
  $("#placementNext").textContent = placementIndex === placementQuestions.length - 1 ? "Lihat Hasil" : "Berikutnya";
}

function estimatePlacementLabel() {
  const answered = placementAnswers.filter((answer) => answer !== null).length;
  if (!answered) return "A0-A1";
  const correct = placementAnswers.reduce((sum, answer, index) => {
    return sum + (answer === placementQuestions[index].answer ? 1 : 0);
  }, 0);
  const ratio = correct / answered;
  if (ratio >= 0.86) return "B2-C1";
  if (ratio >= 0.7) return "B1-B2";
  if (ratio >= 0.5) return "A2-B1";
  return "A0-A1";
}

function finishPlacement() {
  const correct = placementAnswers.reduce((sum, answer, index) => {
    return sum + (answer === placementQuestions[index].answer ? 1 : 0);
  }, 0);
  const score = Math.round((correct / placementQuestions.length) * 100);
  const bySkill = {};

  placementQuestions.forEach((question, index) => {
    const record = bySkill[question.skill] || { correct: 0, total: 0 };
    record.total += 1;
    if (placementAnswers[index] === question.answer) record.correct += 1;
    bySkill[question.skill] = record;
  });

  Object.entries(bySkill).forEach(([skill, record]) => {
    const next = Math.round((record.correct / record.total) * 100);
    state.skillScores[skill] = Math.round((state.skillScores[skill] * 0.55) + (next * 0.45));
  });

  state.currentLevel = placementLevel(score);
  state.learningPath = placementPath(score);
  state.placementDone = true;
  state.points += 50;

  const weakest = Object.entries(bySkill)
    .map(([skill, record]) => [skill, Math.round((record.correct / record.total) * 100)])
    .sort((a, b) => a[1] - b[1])[0];

  const strongest = Object.entries(bySkill)
    .map(([skill, record]) => [skill, Math.round((record.correct / record.total) * 100)])
    .sort((a, b) => b[1] - a[1])[0];

  state.latestResult = {
    type: "Tes Penempatan Mini",
    score,
    correct,
    total: placementQuestions.length,
    level: state.currentLevel,
    learningPath: state.learningPath,
    weakestSkill: weakest[0],
    weakestScore: weakest[1],
    strongestSkill: strongest[0],
    strongestScore: strongest[1],
    pointReward: 50,
    completedAt: new Date().toISOString(),
    skillBreakdown: Object.entries(bySkill).map(([skill, record]) => ({
      skill,
      correct: record.correct,
      total: record.total,
      score: Math.round((record.correct / record.total) * 100)
    }))
  };

  saveState();
  updateLeaderboardMemory();
  refreshAccessViews();
  renderResults();
  setRoute("hasil");
}

function placementLevel(score) {
  if (score >= 86) return "C1 Academic";
  if (score >= 74) return "B2 Upper Intermediate";
  if (score >= 60) return "B1 Intermediate";
  if (score >= 42) return "A2 Elementary";
  return "A0 Starter";
}

function renderResults() {
  const result = state.latestResult;
  const target = $("#scoreResult");

  if (!result) {
    target.innerHTML = `
      <article class="score-card">
        <p class="eyebrow">Belum ada penilaian</p>
        <h2>Kerjakan Tes Awal untuk melihat skor.</h2>
        <p class="question-text">Setelah selesai, aplikasi akan otomatis masuk ke halaman Hasil dan menampilkan skor penempatan.</p>
        <div class="score-actions">
          <button class="primary-action" data-route="placement" type="button">Mulai Tes Awal</button>
          <button class="secondary-action" data-route="dashboard" type="button">Kembali Dashboard</button>
        </div>
      </article>
    `;
    return;
  }

  const date = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(result.completedAt));
  const visibleBreakdown = (result.skillBreakdown || [])
    .filter((item) => !hiddenAssessmentSkills.has(item.skill));
  const strongestVisible = visibleBreakdown.length
    ? [...visibleBreakdown].sort((a, b) => b.score - a.score)[0]
    : { skill: result.strongestSkill, score: result.strongestScore };
  const weakestVisible = visibleBreakdown.length
    ? [...visibleBreakdown].sort((a, b) => a.score - b.score)[0]
    : { skill: result.weakestSkill, score: result.weakestScore };

  target.innerHTML = `
    <div class="score-layout">
      <article class="score-card score-hero">
        <div class="score-ring" style="--score: ${result.score}">
          <div class="score-number">
            <strong>${result.score}</strong>
            <span>/ 100</span>
          </div>
        </div>
        <div>
          <p class="eyebrow">${result.type}</p>
          <h2>${scoreMessage(result.score)}</h2>
          <p class="question-text">Diselesaikan ${date}. Skor ini adalah penilaian internal untuk menentukan jalur belajar, bukan skor resmi IELTS atau SAT.</p>
        </div>
        <div class="score-summary">
          <div class="mini-stat"><span>Level awal</span><strong>${result.level}</strong></div>
          <div class="mini-stat"><span>Jawaban benar</span><strong>${result.correct}/${result.total}</strong></div>
          <div class="mini-stat"><span>Skill terkuat</span><strong>${strongestVisible.skill}</strong></div>
          <div class="mini-stat"><span>Reward poin</span><strong>+${result.pointReward}</strong></div>
        </div>
      </article>

      <section class="score-card score-detail" aria-labelledby="score-breakdown-title">
        <div>
          <p class="eyebrow">Breakdown penilaian</p>
          <h2 id="score-breakdown-title">Skor per skill</h2>
        </div>
        <div class="score-breakdown">
          ${visibleBreakdown.map((item) => `
            <div class="score-row">
              <strong>${item.skill}</strong>
              <div class="bar-shell"><div class="bar-fill" style="width: ${item.score}%"></div></div>
              <span>${item.score}%</span>
            </div>
          `).join("")}
        </div>
        <div class="recommendation">
          <strong>Area prioritas: ${weakestVisible.skill}</strong>
          <span>${recommendationCopy(weakestVisible.skill, weakestVisible.score)} Mulai dari ${recommendationTitle(weakestVisible.skill)}.</span>
        </div>
        <div class="result-grid">
          <div class="mini-stat"><span>Readiness</span><strong>${readinessLabel(result.score)}</strong></div>
          <div class="mini-stat"><span>Jalur belajar</span><strong>${result.learningPath || state.learningPath}</strong></div>
          <div class="mini-stat"><span>Track terbuka</span><strong>${accessibleTrackLabel()}</strong></div>
        </div>
        ${!canAccessTrack("Foundation") ? `
          <div class="lock-card">
            <strong>Soal lanjutan dikunci.</strong>
            <p>Peserta diarahkan ke Basic dulu. Foundation terbuka setelah ${UNLOCK_REQUIREMENTS.Foundation} poin.</p>
          </div>
        ` : ""}
        <div class="score-actions">
          <button class="primary-action" data-route="practice" type="button">Lanjut Latihan</button>
          <button class="secondary-action" data-route="placement" type="button">Ulang Tes</button>
          <button class="secondary-action" data-route="dashboard" type="button">Dashboard</button>
        </div>
      </section>
    </div>
  `;
}

function scoreMessage(score) {
  if (score >= 86) return "Siap masuk C1 Academic track.";
  if (score >= 74) return "Fondasi kuat untuk B2 dan latihan akademik.";
  if (score >= 60) return "Cukup untuk mulai B1 Intermediate.";
  if (score >= 42) return "Mulai dari A2 dan perkuat grammar dasar.";
  return "Mulai pelan dari A1 Basic.";
}

function readinessLabel(score) {
  if (score >= 86) return "IELTS/SAT Sim";
  if (score >= 74) return "Academic Ready";
  if (score >= 60) return "Bridge Track";
  if (score >= 42) return "Foundation";
  return "Starter";
}

function filteredQuestions() {
  if (practiceFilter === "all") {
    return allQuestions.filter((question) => canAccessTrack(question.track));
  }
  if (!canAccessTrack(practiceFilter)) return [];
  return allQuestions.filter((question) => question.track === practiceFilter);
}

function renderPractice() {
  const questions = filteredQuestions();
  if (!questions.length) {
    $("#practiceTrack").textContent = practiceFilter === "all" ? "Basic" : practiceFilter;
    $("#practiceLevel").textContent = "Locked";
    $("#practiceSkill").textContent = "Access";
    $("#practicePrompt").textContent = "Track ini masih terkunci.";
    $("#practicePassage").textContent = lockedTrackMessage(practiceFilter === "all" ? "Foundation" : practiceFilter);
    $("#hintBox").hidden = true;
    $("#practiceOptions").innerHTML = `
      <div class="lock-card">
        <strong>Mulai dari Basic dulu.</strong>
        <p>Kumpulkan poin dari latihan Basic untuk membuka soal lanjutan.</p>
      </div>
    `;
    $("#explanationPanel").className = "explanation-panel";
    $("#explanationPanel").innerHTML = `
      <span class="status-label">Akses terkunci</span>
      <h3>Basic tetap terbuka.</h3>
      <p>Gunakan tombol Basic di filter latihan untuk mengumpulkan poin.</p>
      <button class="primary-action" id="goBasicPractice" type="button">Latihan Basic</button>
    `;
    return;
  }
  practiceIndex = practiceIndex % questions.length;
  selectedPracticeAnswer = null;
  const question = questions[practiceIndex];

  $("#practiceTrack").textContent = question.track;
  $("#practiceLevel").textContent = question.level;
  $("#practiceSkill").textContent = question.skill;
  $("#practicePrompt").textContent = question.prompt;
  $("#practicePassage").textContent = question.passage || "";
  $("#hintBox").textContent = question.hint || "No hint available.";
  $("#hintBox").hidden = !$("#hintToggle").checked;

  $("#practiceOptions").innerHTML = question.options
    .map((option, index) => `
      <button class="option-button" data-practice-answer="${index}" type="button">
        <span class="option-key">${String.fromCharCode(65 + index)}</span>
        <span>${option}</span>
      </button>
    `)
    .join("");

  $("#explanationPanel").className = "explanation-panel";
  $("#explanationPanel").innerHTML = `
    <span class="status-label">Pembahasan</span>
    <h3>Pilih jawaban untuk membuka reasoning.</h3>
    <p>Reward poin diberikan untuk jawaban benar dan review pembahasan setelah salah.</p>
  `;
}

function checkPracticeAnswer() {
  const question = filteredQuestions()[practiceIndex];
  if (!question || selectedPracticeAnswer === null) return;
  const isCorrect = selectedPracticeAnswer === question.answer;
  const points = isCorrect ? pointsForDifficulty(question.difficulty) : 0;

  state.points += points;
  state.completed += 1;
  state.attempts.unshift({
    questionId: question.id,
    prompt: question.prompt,
    skill: question.skill,
    level: question.level,
    track: question.track,
    selected: selectedPracticeAnswer,
    answer: question.answer,
    isCorrect,
    explanation: question.explanation,
    createdAt: new Date().toISOString()
  });
  state.attempts = state.attempts.slice(0, 30);
  updateSkillScore(question.skill, isCorrect);
  saveState();
  updateLeaderboardMemory();
  refreshAccessViews();

  $$("#practiceOptions .option-button").forEach((button) => {
    const index = Number(button.dataset.practiceAnswer);
    button.classList.toggle("is-correct", index === question.answer);
    button.classList.toggle("is-wrong", index === selectedPracticeAnswer && !isCorrect);
  });

  $("#explanationPanel").className = `explanation-panel ${isCorrect ? "is-correct" : "is-wrong"}`;
  $("#explanationPanel").innerHTML = `
    <span class="status-label">${isCorrect ? "Benar" : "Perlu review"} - +${points} pts</span>
    <h3>${isCorrect ? "Reasoning sudah tepat." : "Pembahasan dibuka."}</h3>
    <p>${question.explanation}</p>
    <div class="recommendation">
      <strong>Alasan opsi</strong>
      <span>${question.wrongReasons.map((reason, index) => `${String.fromCharCode(65 + index)}. ${reason}`).join(" ")}</span>
    </div>
    <button class="primary-action" id="nextPractice" type="button">Soal Berikutnya</button>
  `;
}

function pointsForDifficulty(difficulty) {
  if (difficulty === "hard") return 12;
  if (difficulty === "medium") return 8;
  return 5;
}

function updateSkillScore(skill, isCorrect) {
  const current = state.skillScores[skill] ?? 50;
  const target = isCorrect ? 100 : 30;
  state.skillScores[skill] = Math.max(20, Math.min(99, Math.round((current * 0.86) + (target * 0.14))));
}

function renderReview() {
  const wrongAttempts = state.attempts.filter((attempt) => !attempt.isCorrect);
  const reviewGrid = $("#reviewGrid");

  if (!wrongAttempts.length) {
    reviewGrid.innerHTML = `
      <article class="review-card">
        <span class="tag">Clean slate</span>
        <h2>Belum ada jawaban salah yang tersimpan.</h2>
        <p>Kerjakan latihan untuk mulai membangun catatan kelemahan.</p>
        <button class="primary-action" data-route="practice" type="button">Buka Practice</button>
      </article>
    `;
    return;
  }

  reviewGrid.innerHTML = wrongAttempts.slice(0, 9).map((attempt) => `
    <article class="review-card">
      <span class="tag">${attempt.track} - ${attempt.level} - ${attempt.skill}</span>
      <h2>${attempt.prompt}</h2>
      <p>${attempt.explanation}</p>
      <button class="secondary-action" data-filter-jump="${attempt.track}" type="button">Latihan track ini</button>
    </article>
  `).join("");
}

function renderArena(target, cards, label) {
  const track = label === "IELTS" ? "IELTS" : "SAT";
  const locked = !canAccessTrack(track);
  $(target).innerHTML = cards.map(([title, copy, readiness]) => `
    <article class="arena-card ${locked ? "is-locked" : ""}">
      <span class="tag">${label}</span>
      <h2>${title}</h2>
      <p>${copy}</p>
      <div>
        <span class="metric-label">Readiness</span>
        <meter min="0" max="100" value="${readiness}">${readiness}%</meter>
      </div>
      ${locked ? `
        <div class="lock-card">
          <strong>Terkunci</strong>
          <p>${lockedTrackMessage(track)}</p>
        </div>
        <button class="secondary-action" disabled type="button">Terkunci</button>
      ` : `
        <button class="secondary-action" data-route="practice" type="button">${readiness >= 60 ? "Timed Practice" : "Build Foundation"}</button>
      `}
    </article>
  `).join("");
}

function renderLeaderboardRows(records, currentId = "") {
  if (!records.length) {
    $("#leaderboardTable").innerHTML = `
      <article class="review-card">
        <span class="tag">Live leaderboard</span>
        <h2>Belum ada peserta tersimpan.</h2>
        <p>Masuk sebagai peserta, selesaikan tes awal, lalu kumpulkan poin dari latihan.</p>
      </article>
    `;
    return;
  }

  $("#leaderboardTable").innerHTML = records.map((record, index) => `
    <div class="leader-row ${record.id === currentId ? "is-user" : ""}">
      <strong>#${index + 1}</strong>
      <strong>${record.name}</strong>
      <span>${record.accuracy}% akurasi</span>
      <span>${record.points.toLocaleString("id-ID")} pts</span>
    </div>
  `).join("");
}

async function renderLeaderboard() {
  const currentId = session?.role === "participant" ? leaderboardIdForName(session.name) : "";

  if (session?.role === "participant") updateLeaderboardMemory();
  const records = loadLeaderboard()
    .sort((a, b) => b.points - a.points || b.accuracy - a.accuracy)
    .slice(0, 20);

  renderLeaderboardRows(records, currentId);
}

function averageMastery() {
  const values = Object.values(state.skillScores);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function renderSchema() {
  $("#schemaList").innerHTML = schema.map(([table, columns]) => `
    <div class="schema-item">
      <strong>${table}</strong>
      <span>${columns}</span>
    </div>
  `).join("");
}

function protectQuestionText() {
  const protectedSelectors = [
    ".question-surface",
    ".explanation-panel",
    ".test-status",
    ".score-card",
    ".review-card",
    ".arena-card",
    ".basic-roadmap",
    ".unlock-panel"
  ].join(",");

  document.addEventListener("copy", (event) => {
    if (event.target.closest("input, textarea, select, .admin-form")) return;
    if (!event.target.closest(protectedSelectors)) return;
    event.preventDefault();
  });

  document.addEventListener("cut", (event) => {
    if (event.target.closest("input, textarea, select, .admin-form")) return;
    if (!event.target.closest(protectedSelectors)) return;
    event.preventDefault();
  });

  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest("input, textarea, select, .admin-form")) return;
    if (!event.target.closest(protectedSelectors)) return;
    event.preventDefault();
  });
}

function wireEvents() {
  $("#participantLogin").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = $("#participantName").value.trim() || "Peserta";
    const password = $("#participantPassword").value;
    if (!password) {
      window.alert("Masukkan password peserta dulu.");
      return;
    }

    const id = leaderboardIdForName(name);
    const store = loadParticipantStore();
    const savedParticipant = store[id];

    if (savedParticipant) {
      const passwordStatus = await verifyParticipantPassword(savedParticipant, password);
      if (passwordStatus === false) {
        window.alert("Password peserta salah.");
        return;
      }
      if (passwordStatus === "needs-password") {
        await setParticipantPassword(id, password);
      }
    }

    session = { role: "participant", name, id };
    saveSession();
    isAdmin = false;
    localStorage.removeItem(ADMIN_MODE_KEY);
    const hasSavedProgress = loadParticipantProgress(id);
    if (!hasSavedProgress) {
      resetLearnerProgress();
      await setParticipantPassword(id, password);
      saveParticipantProgress();
    }
    syncAppVisibility();
    renderPlacement();
    renderResults();
    refreshAccessViews();
    setRoute(state.latestResult ? "dashboard" : "placement");
  });

  $("#adminLogin").addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = $("#adminPasswordInput").value;
    if (password !== ADMIN_PASSWORD) {
      window.alert("Password admin salah.");
      return;
    }

    localStorage.setItem(ADMIN_MODE_KEY, "true");
    isAdmin = true;
    session = { role: "admin", name: "Admin" };
    saveSession();
    syncAppVisibility();
    refreshAccessViews();
    setRoute("admin");
  });

  $("#logoutButton").addEventListener("click", () => {
    localStorage.removeItem(ADMIN_MODE_KEY);
    isAdmin = false;
    clearSession();
    syncAppVisibility();
    window.location.hash = "";
  });

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      setRoute(routeButton.dataset.route);
      return;
    }

    const placementButton = event.target.closest("[data-placement-answer]");
    if (placementButton) {
      placementAnswers[placementIndex] = Number(placementButton.dataset.placementAnswer);
      renderPlacement();
      return;
    }

    const practiceButton = event.target.closest("[data-practice-answer]");
    if (practiceButton) {
      selectedPracticeAnswer = Number(practiceButton.dataset.practiceAnswer);
      $$("#practiceOptions .option-button").forEach((button) => {
        button.classList.toggle("is-selected", button === practiceButton);
      });
      return;
    }

    const nextPractice = event.target.closest("#nextPractice");
    if (nextPractice) {
      practiceIndex += 1;
      renderPractice();
      return;
    }

    const goBasicPractice = event.target.closest("#goBasicPractice");
    if (goBasicPractice) {
      practiceFilter = "Basic";
      practiceIndex = 0;
      setActiveSegment();
      renderPractice();
      return;
    }

    const filterJump = event.target.closest("[data-filter-jump]");
    if (filterJump) {
      practiceFilter = filterJump.dataset.filterJump;
      setActiveSegment();
      renderPractice();
      setRoute("practice");
    }
  });

  $("#placementBack").addEventListener("click", () => {
    placementIndex = Math.max(0, placementIndex - 1);
    renderPlacement();
  });

  $("#placementNext").addEventListener("click", () => {
    if (placementAnswers[placementIndex] === null) return;
    if (placementIndex === placementQuestions.length - 1) {
      finishPlacement();
      return;
    }
    placementIndex += 1;
    renderPlacement();
  });

  $("#checkAnswer").addEventListener("click", checkPracticeAnswer);
  $("#skipQuestion").addEventListener("click", () => {
    practiceIndex += 1;
    renderPractice();
  });

  $("#hintToggle").addEventListener("change", () => {
    $("#hintBox").hidden = !$("#hintToggle").checked;
  });

  $$(".segment").forEach((segment) => {
    segment.addEventListener("click", () => {
      if (segment.disabled) return;
      practiceFilter = segment.dataset.filter;
      practiceIndex = 0;
      setActiveSegment();
      renderPractice();
    });
  });

  $("#confidenceRange").addEventListener("input", (event) => {
    $("#confidenceValue").textContent = `${event.target.value}%`;
  });

  $("#questionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = $("#adminPrompt").value.trim();
    const options = [
      $("#adminOptionA").value.trim(),
      $("#adminOptionB").value.trim(),
      $("#adminOptionC").value.trim(),
      $("#adminOptionD").value.trim()
    ];
    if (!prompt || options.some((option) => !option)) return;

    const answer = Number(document.querySelector('input[name="adminCorrectOption"]:checked').value);

    const question = {
      id: `custom-${Date.now()}`,
      track: $("#adminTrack").value,
      level: $("#adminLevel").value,
      skill: $("#adminSkill").value,
      difficulty: "medium",
      prompt,
      passage: $("#adminPassage").value.trim(),
      options,
      answer,
      hint: $("#adminHint").value.trim() || "Baca pertanyaan dan eliminasi opsi yang tidak sesuai.",
      explanation: $("#adminExplanation").value.trim() || "Pembahasan belum diisi.",
      wrongReasons: options.map((_, index) => {
        return index === answer ? "Correct." : "Cek kembali pembahasan dan bukti pada soal.";
      })
    };

    state.customQuestions.push(question);
    allQuestions = [...basicQuestions, ...starterQuestions, ...state.customQuestions];
    saveState();
    event.target.reset();
    renderPractice();
    alert("Soal lokal ditambahkan ke bank soal prototipe.");
  });

  $("#adminLogout").addEventListener("click", () => {
    localStorage.removeItem(ADMIN_MODE_KEY);
    isAdmin = false;
    clearSession();
    syncAppVisibility();
    window.location.hash = "";
  });

  $("#startBasicPractice").addEventListener("click", () => {
    practiceFilter = "Basic";
    practiceIndex = 0;
    setActiveSegment();
    renderPractice();
    setRoute("practice");
  });

  document.addEventListener("click", (event) => {
    const basicButton = event.target.closest(".basic-practice-button");
    if (!basicButton) return;
    practiceFilter = "Basic";
    practiceIndex = 0;
    setActiveSegment();
    renderPractice();
    setRoute("practice");
  });
}

function setActiveSegment() {
  if (practiceFilter !== "all" && !canAccessTrack(practiceFilter)) {
    practiceFilter = "Basic";
    practiceIndex = 0;
  }
  $$(".segment").forEach((segment) => {
    const track = segment.dataset.filter;
    const locked = track !== "all" && !canAccessTrack(track);
    segment.disabled = locked;
    segment.textContent = locked ? `${track} Locked` : segment.dataset.label || trackLabel(track);
    segment.classList.toggle("is-active", track === practiceFilter);
  });
}

function trackLabel(track) {
  if (track === "all") return "Semua";
  return track;
}

function init() {
  protectQuestionText();
  wireEvents();
  if (session?.role === "admin") {
    session = { role: "admin", name: "Admin" };
    isAdmin = true;
    saveSession();
  }
  if (session?.role === "participant") {
    session = {
      role: "participant",
      name: session.name || "Peserta",
      id: session.id || leaderboardIdForName(session.name)
    };
    saveSession();
    loadParticipantProgress(session.id);
  }
  syncAppVisibility();
  renderBasic();
  renderDashboard();
  renderPlacement();
  renderResults();
  renderPractice();
  renderReview();
  renderArena("#ieltsArena", ieltsCards, "IELTS");
  renderArena("#satArena", satCards, "SAT English");
  renderLeaderboard();
  renderSchema();
  setActiveSegment();

  if (!session?.role) return;

  const initialRoute = window.location.hash.replace("#", "");
  if (session.role === "admin") {
    setRoute(initialRoute && $(`#${initialRoute}`) ? initialRoute : "admin");
    return;
  }
  if (!state.latestResult) {
    setRoute("placement");
    return;
  }
  if (initialRoute && $(`#${initialRoute}`)) setRoute(initialRoute);
}

init();

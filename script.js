let questions = []; // Dynamic now
let currentQuestion = 0;
let score = 0;
let answers = [];
let timeLeft = 1800; // Default 30 min
let timerId;
let quizCompleted = false;
let shuffledQuestions = [];
let originalIndices = [];
let quizConfig = {
  num_questions: 20,
  time_minutes: 30,
  topic: "all",
  level: "easy",
};

const elements = {
  question: document.getElementById("question"),
  hint: document.getElementById("hint"),
  options: document.getElementById("options"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  submitBtn: document.getElementById("submit-btn"),
  timer: document.getElementById("time-left"),
  progress: document.getElementById("current-ques"),
  total: document.getElementById("total-ques"),
  resultModal: document.getElementById("result-modal"),
  finalScore: document.getElementById("final-score"),
  resultMessage: document.getElementById("result-message"),
  restartBtn: document.getElementById("restart-btn"),
  // New AI elements
  numQuestionsSlider: document.getElementById("num-questions-slider"),
  numQuestionsValue: document.getElementById("num-questions-value"),
  timeMinutes: document.getElementById("time-minutes"),
  aiPrompt: document.getElementById("ai-prompt"),
  aiResponse: document.getElementById("ai-response"),
  aiGenerateBtn: document.getElementById("ai-generate-btn"),
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleQuestions() {
  const indices = Array.from({ length: questions.length }, (_, i) => i);
  originalIndices = shuffleArray(indices);
  shuffledQuestions = originalIndices.map((idx) =>
    adaptQuestion(questions[idx]),
  );
}

function adaptQuestion(q) {
  // Backend format {'q':str, 'opts':[], 'ans':int} -> frontend {question, options, answer, hint}
  return {
    question: typeof q.q === "string" ? q.q : q.question,
    options: q.opts || q.options || ["A", "B", "C", "D"],
    answer: q.ans !== undefined ? q.ans : q.answer,
    hint: q.hint || `Petunjuk untuk ${q.q || q.question}`,
  };
}

function init() {
  currentQuestion = 0;
  answers = new Array(shuffledQuestions.length).fill(null);
  timeLeft = quizConfig.time_seconds || quizConfig.time_minutes * 60;
  displayQuestion();
  updateNavigation();
  startTimer();
  elements.total.textContent = shuffledQuestions.length;
  elements.aiResponse.textContent = `Quiz dimulai! ${shuffledQuestions.length} soal, ${Math.floor(timeLeft / 60)} menit.`;
}

function displayQuestion() {
  const q = shuffledQuestions[currentQuestion];
  elements.question.innerHTML = `<strong>Soal ${currentQuestion + 1}:</strong> ${q.question}`;
  elements.hint.textContent = `💡 ${q.hint}`;
  elements.options.innerHTML = "";
  q.options.forEach((option, index) => {
    const div = document.createElement("div");
    div.className = `option ${answers[currentQuestion] === index ? "selected" : ""}`;
    div.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    div.onclick = () => selectOption(index);
    elements.options.appendChild(div);
  });
}

function selectOption(index) {
  answers[currentQuestion] = index;
  displayQuestion();
  updateNavigation();
}

function updateNavigation() {
  elements.prevBtn.disabled = currentQuestion === 0;
  elements.nextBtn.style.display = "block";
  elements.submitBtn.style.display = "none";
  if (currentQuestion === shuffledQuestions.length - 1) {
    elements.nextBtn.style.display = "none";
    if (answers[currentQuestion] !== null) {
      elements.submitBtn.style.display = "block";
    }
  }
  elements.progress.textContent = currentQuestion + 1;
}

function nextQuestion() {
  if (currentQuestion < shuffledQuestions.length - 1) {
    currentQuestion++;
    displayQuestion();
    updateNavigation();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
    updateNavigation();
  }
}

function startTimer() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz() {
  quizCompleted = true;
  clearInterval(timerId);
  let correct = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== null) {
      const origIdx = originalIndices ? originalIndices[i] : i;
      correct +=
        answers[i] ===
        (questions[origIdx]?.ans !== undefined
          ? questions[origIdx].ans
          : questions[origIdx].answer)
          ? 1
          : 0;
    }
  }
  score = correct;
  const percentage = Math.round((score / answers.length) * 100);
  elements.finalScore.textContent = `${score}/${answers.length} (${percentage}%)`;
  elements.resultMessage.textContent =
    percentage >= 80
      ? "Excellent! 🎖️"
      : percentage >= 60
        ? "Baik! 👍"
        : percentage >= 40
          ? "Cukup. Belajar lagi 📚"
          : "Perlu latihan lebih banyak 💪";
  elements.resultModal.classList.add("active");
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answers = [];
  quizCompleted = false;
  timeLeft = quizConfig.time_seconds;
  elements.resultModal.classList.remove("active");
  init();
}

// New AI Generate logic
function parsePrompt(prompt) {
  const match = prompt.match(
    /(\d+(?:\.\d+)?)\s*(soal|question|soals?|questions?)[s ]*(\d+(?:\.\d+)?)\s*(menit|minute|mnt|m)/i,
  );
  if (match) {
    return {
      num_questions: parseInt(match[1]),
      time_minutes: parseInt(match[3]),
    };
  }
  return null;
}

elements.aiGenerateBtn.onclick = async () => {
  const prompt = elements.aiPrompt.value.trim();
  elements.aiResponse.textContent = "🤖 Memuat quiz baru...";
  elements.aiGenerateBtn.disabled = true;

  try {
    // Get config from inputs
    quizConfig.num_questions =
      parseInt(elements.numQuestionsSlider.value) || 20;
    quizConfig.time_minutes = parseInt(elements.timeMinutes.value) || 30;

    // Override from prompt parsing
    const parsed = parsePrompt(prompt);
    if (parsed) {
      quizConfig.num_questions = Math.min(
        58,
        Math.max(1, parsed.num_questions),
      );
      quizConfig.time_minutes = Math.max(5, parsed.time_minutes);
    }

    const payload = {
      num_questions: quizConfig.num_questions,
      time_minutes: quizConfig.time_minutes,
      topic: "all", // simple, expand later
      level: "easy",
    };

    const backendOk = await checkBackend();
    if (!backendOk) {
      elements.aiResponse.textContent = "⚠️ Backend offline, using fallback...";
      generateFallback();
      return;
    }
    const res = await fetch("http://localhost:5000/generate_bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    questions = data.questions;
    quizConfig.time_seconds = data.time_seconds;

    shuffleQuestions();
    init();

    elements.aiResponse.innerHTML = `✅ Quiz berhasil dibuat!<br>
    📊 ${data.total_questions} soal<br>
    ⏱️ ${quizConfig.time_minutes} menit<br>
    Gunakan ← → atau 1-4 untuk jawab!`;
  } catch (err) {
    console.error(err);
    elements.aiResponse.innerHTML = `❌ Error: ${err.message}<br>
    Pastikan server Python berjalan: <code>cd web-ujian-kalkulus-geometri && python ai_quiz_generator.py</code><br>
    Fallback: Gunakan slider/input manual.`;

    // Fallback: generate default
    generateFallback();
  } finally {
    elements.aiGenerateBtn.disabled = false;
  }
};

async function checkBackend() {
  try {
    const res = await fetch("http://localhost:5000/health");
    return res.ok;
  } catch {
    return false;
  }
}

function generateFallback() {
  // FIXED: Generate up to 58 mock questions matching backend format
  const mockTemplates = [
    { q: "2 + 2 = ?", opts: ["3", "4", "5", "6"], ans: 1 },
    { q: "log10 100 = ?", opts: ["1", "2", "10", "0"], ans: 1 },
    { q: "sin 30° = ?", opts: ["1", "0.5", "0", "√3/2"], ans: 1 },
    { q: "x² - 4 = 0?", opts: ["x=2", "x=-2", "x=±2", "x=0"], ans: 2 },
    { q: "Luas lingkaran r=1?", opts: ["π", "2π", "π/2", "4π"], ans: 0 },
    // Add 50+ more unique math q...
  ];
  // Extend to full
  const mockData = [...mockTemplates];
  while (mockData.length < quizConfig.num_questions) {
    mockData.push(...mockTemplates.slice(0, 5)); // duplicate minimally
  }
  questions = mockData.slice(0, quizConfig.num_questions);
  quizConfig.time_seconds = quizConfig.time_minutes * 60;
  shuffleQuestions();
  init();
  elements.aiResponse.innerHTML = `✅ Fallback OK! ${questions.length} soal mock, ${quizConfig.time_minutes} menit.<br>Backend offline - jalankan start.bat`;
}

// UI Event listeners
elements.numQuestionsSlider.oninput = function () {
  const val = this.value;
  elements.numQuestionsValue.textContent = val;
};

elements.restartBtn.onclick = restartQuiz;
elements.prevBtn.onclick = prevQuestion;
elements.nextBtn.onclick = nextQuestion;
elements.submitBtn.onclick = submitQuiz;

// Keyboard
document.addEventListener("keydown", (e) => {
  if (quizCompleted) return;
  if (e.key === "ArrowRight" || e.key === "Enter") {
    if (elements.submitBtn.style.display === "block") submitQuiz();
    else nextQuestion();
  } else if (e.key === "ArrowLeft") prevQuestion();
  else if (e.key >= "1" && e.key <= "4") selectOption(parseInt(e.key) - 1);
});

// Init UI
elements.numQuestionsSlider.oninput();
elements.aiResponse.textContent =
  "Siap generate quiz! Gunakan slider atau ketik prompt seperti '20 soal 30 menit'";

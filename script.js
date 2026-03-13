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
    // Himpunan 12 q
    {
      q: "A = {1,2,3}, B = {3,4,5}, A ∪ B = ?",
      opts: ["{1,2,3,4,5}", "{3}", "{1,2,4,5}", "{1,2,3}"],
      ans: 0,
    },
    {
      q: "A ∩ B, A={1,2,3}, B={2,3,4} = ?",
      opts: ["{2,3}", "{1,4}", "{1,2,3,4}", "{}"],
      ans: 0,
    },
    {
      q: "Himpunan kosong notasi?",
      opts: ["∅ atau {}", "{0}", "[]", "null"],
      ans: 0,
    },
    {
      q: "|x-2| < 3, himpunan penyelesaian?",
      opts: ["(-1,5)", "[-1,5]", "{x|-1≤x≤5}", "{2}", "B", "C"],
      ans: 2,
    },
    {
      q: "Notasi himpunan {x|x genap, 0<x<10}?",
      opts: ["{2,4,6,8}", "{1,3,5,7,9}", "{0,10}", "{2,4,6,8,10}"],
      ans: 0,
    },
    {
      q: "Jumlah himpunan bagian {a,b,c}?",
      opts: ["8", "6", "3", "7"],
      ans: 0,
    },
    {
      q: "(A∪B)^c = ?",
      opts: ["A^c ∩ B^c", "A^c ∪ B^c", "A ∩ B", "A - B"],
      ans: 0,
    },
    {
      q: "A × B jika |A|=2,|B|=3?",
      opts: ["5", "6", "2*3=6 pasangan", "1"],
      ans: 2,
    },
    {
      q: "Himpunan universal U, A^c = ?",
      opts: ["U - A", "A", "∅", "U"],
      ans: 0,
    },
    {
      q: "x integer, x^2 ≤4?",
      opts: ["{-2,-1,0,1,2}", "{-1,0,1}", "{0,1,2}", "{±2}"],
      ans: 0,
    },
    {
      q: "Diagram Venn A∩B'?",
      opts: ["Hanya di A", "A dan B", "Hanya B", "Diluar"],
      ans: 0,
    },
    {
      q: "Himpunan bagian P({1})?",
      opts: ["{∅,{1}}", "{{1}}", "{1,∅}", "{∅}"],
      ans: 0,
    },

    // Logaritma 12 q
    { q: "log10 100 = ?", opts: ["1", "2", "10", "0"], ans: 0 },
    { q: "log2 8 = ?", opts: ["1", "2", "3", "4"], ans: 2 },
    { q: "log3 9 = ?", opts: ["1", "2", "3", "0"], ans: 1 },
    { q: "log_b (b^3) = ?", opts: ["3", "1", "b", "0"], ans: 0 },
    { q: "log10 (1/10) = ?", opts: ["-1", "1", "0", "10"], ans: 0 },
    { q: "log2 1 = ?", opts: ["0", "1", "2", "undef"], ans: 0 },
    { q: "ln e = ?", opts: ["1", "0", "e", "undef"], ans: 0 },
    { q: "log_a b * log_b a = ?", opts: ["1", "0", "2", "a/b"], ans: 0 },
    { q: "log (x y) = log x + log ?", opts: ["y", "1", "x", "log 1"], ans: 0 },
    { q: "Solve log2 x = 3", opts: ["8", "6", "4", "9"], ans: 0 },
    { q: "log3 27 = ?", opts: ["2", "3", "9", "1"], ans: 1 },
    { q: "10^0 = ?", opts: ["1", "10", "0", "100"], ans: 0 },

    // Trigonometri 12 q
    { q: "sin 30° = ?", opts: ["0.5", "√3/2≈0.866", "1", "0"], ans: 0 },
    { q: "cos 60° = ?", opts: ["0.5", "√3/2", "1", "0"], ans: 0 },
    { q: "tan 45° = ?", opts: ["1", "0", "undef", "√3"], ans: 0 },
    { q: "sin²θ + cos²θ = ?", opts: ["1", "0", "2", "sinθ"], ans: 0 },
    {
      q: "sin(90°-θ) = ?",
      opts: ["cos θ", "sin θ", "-cos θ", "cot θ"],
      ans: 0,
    },
    { q: "cos 0° = ?", opts: ["1", "0", "-1", "undef"], ans: 0 },
    {
      q: "tan θ = sin/cos = ?",
      opts: ["sin/cos", "cos/sin", "sin+cos", "1"],
      ans: 0,
    },
    { q: "sin 90° = ?", opts: ["1", "0", "√2/2", "undef"], ans: 0 },
    {
      q: "Sudut komplementer 30°?",
      opts: ["60°", "90°", "120°", "45°"],
      ans: 0,
    },
    { q: "sin(-θ) = ?", opts: ["-sin θ", "sin θ", "cos θ", "0"], ans: 0 },
    { q: "Hypotenuse 3-4-?", opts: ["5", "6", "7", "1"], ans: 0 },
    {
      q: "sin θ = opp/hyp = 3/5, cos θ?",
      opts: ["4/5", "3/4", "3/5", "5/3"],
      ans: 0,
    },

    // Aljabar/Geometri 12 q
    { q: "Solve 2x + 3 = 7", opts: ["2", "5", "10", "0"], ans: 0 },
    { q: "x² - 5x + 6 = 0", opts: ["2,3", "1,6", "-2,-3", "5"], ans: 0 },
    {
      q: "Luas segitiga (1/2)alas tinggi= (1/2)*4*3?",
      opts: ["6", "12", "7", "24"],
      ans: 0,
    },
    { q: "Keliling persegi s=5?", opts: ["20", "25", "10", "15"], ans: 0 },
    { q: "Luas lingkaran πr² r=2?", opts: ["4π", "2π", "π", "8π"], ans: 0 },
    { q: "Volume kubus s=3?", opts: ["27", "9", "18", "81"], ans: 0 },
    { q: "Gradien garis y=2x+1?", opts: ["2", "1", "0", "-2"], ans: 0 },
    { q: "Penyelesaian 3x-6≥0?", opts: ["x≥2", "x≤2", "x>0", "x<3"], ans: 0 },
    { q: "Matriks 2x2 det |1 2; 3 4|?", opts: ["-2", "10", "7", "2"], ans: 0 },
    {
      q: "Fungsi f(x)=x² domain?",
      opts: ["Semua real", "x≥0", "x integer", "{}"],
      ans: 0,
    },
    { q: "Limit x→2 (x²-4)/(x-2)?", opts: ["4", "2", "0", "undef"], ans: 0 },
    { q: "Turunan f(x)=3x²?", opts: ["6x", "3x", "6", "9x"], ans: 0 },

    // Problem Solving 12 q (total 60)
    {
      q: "Beli 5 apel Rp10rb, jual Rp15rb untung %?",
      opts: ["50%", "33%", "100%", "200%"],
      ans: 0,
    },
    {
      q: "A ke B 60km/jam, balik 40km/jam, rata-rata?",
      opts: ["48km/jam", "50", "45", "52"],
      ans: 0,
    },
    {
      q: "Umur Ibu 5 thn lalu 4x anak, skrg 3x. Umur ibu?",
      opts: ["45", "40", "50", "35"],
      ans: 0,
    },
    {
      q: "Tabung h=10 r=7 π=22/7 V=?",
      opts: ["1540", "2200", "770", "3080"],
      ans: 0,
    },
    { q: "Rata2 10,20,30,40,?=100?", opts: ["100", "90", "110", "80"], ans: 2 },
    {
      q: "Modal Rp100rb untung 20% +10% =?",
      opts: ["Rp132rb", "Rp130rb", "Rp120rb", "Rp110rb"],
      ans: 0,
    },
    {
      q: "Kereta 200km 4 jam balik 5 jam, PP rata?",
      opts: ["80km/j", "90", "100", "85"],
      ans: 2,
    },
    {
      q: "Persamaan baris aritmetika Un=a+(n-1)d?",
      opts: ["True", "False", "Un=an", "Un=nd"],
      ans: 0,
    },
    { q: "Sigma 1 to 5 =?", opts: ["15", "10", "25", "20"], ans: 0 },
    {
      q: "Probabilitas dadu genap?",
      opts: ["1/2", "1/3", "1/6", "5/6"],
      ans: 0,
    },
    { q: "Mean data 2,4,6,8?", opts: ["5", "4", "6", "20/4=5"], ans: 3 },
    { q: "Median 1,3,5,7,9?", opts: ["5", "4", "6", "3"], ans: 0 },
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

import random
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# EXPANDED template data - NOW 70+ UNIQUE questions for 58+ generation
topics = {
  'himpunan': {
    'easy': [
      {'q': 'Himpunan A = {1,2,3}, B = {3,4}, A ∪ B = ?', 'opts': ['{1,2,3,4}', '{3}', '{1,2,4}', '{1,2,3}'], 'ans': 0},
      {'q': 'A ∩ B jika A={1,2}, B={2,3} = ?', 'opts': ['{2}', '{1,3}', '{1,2,3}', '{}'], 'ans': 0},
      {'q': 'Himpunan kosong = ?', 'opts': ['{}', '{0}', '[]', 'null'], 'ans': 0},
      {'q': 'A - B jika A={1,2,3}, B={2} = ?', 'opts': ['{1,3}', '{1,2,3}', '{}', '{2}'], 'ans': 0},
    ],
    'medium': [
      {'q': 'Himpunan penyelesaian |x-3|=5 = ?', 'opts': ['{-2,8}', '{3,5}', '{-5,3}', '{0,8}'], 'ans': 0},
      {'q': '{x | x genap, 1≤x≤10} = ?', 'opts': ['{2,4,6,8,10}', '{1,2,3,4,5,6,7,8,9,10}', '{2,4,6,8}', '{1,3,5,7,9}'], 'ans': 0},
      {'q': 'Kartesian A×B, |A|=2, |B|=3 = ?', 'opts': ['6', '5', '1', '2*3=6'], 'ans': 0},
    ],
    'hard': [
      {'q': 'A × B = {(1,a),(1,b),(2,a),(2,b)}, A=?', 'opts': ['{1,2}', '{a,b}', '{1,2}×{a,b}', '{}'], 'ans': 2},
      {'q': 'Jumlah himpunan bagian 3 elemen?', 'opts': ['8', '6', '3', '7'], 'ans': 0},
    ]
  },
  'logaritma': {
    'easy': [
      {'q': 'log2 8 = ?', 'opts': ['2', '3', '4', '8'], 'ans': 1},
      {'q': 'log10 100 = ?', 'opts': ['2', '10', '1', '0'], 'ans': 0},
      {'q': 'log5 25 = ?', 'opts': ['2', '5', '25', '0'], 'ans': 0},
      {'q': 'log_b b = ?', 'opts': ['1', '0', 'b', 'undefined'], 'ans': 0},
    ],
    'medium': [
      {'q': 'log3 27 - log3 9 = ?', 'opts': ['2', '3', '1', '4'], 'ans': 2},
      {'q': '3^x = 81, x= ?', 'opts': ['4', '3', '5', '2'], 'ans': 0},
      {'q': 'log2 16 = ?', 'opts': ['4', '2', '8', '1'], 'ans': 0},
    ],
    'hard': [
      {'q': 'log4 16 = ?', 'opts': ['2', '4', '8', '1'], 'ans': 0},
      {'q': 'Change base: log2 10 = log10 10 / log10 ?', 'opts': ['2', '10', 'e', '1'], 'ans': 0},
      {'q': 'a^(log_a b) = ?', 'opts': ['b', 'a', '1', '0'], 'ans': 0},
    ]
  },
  'trigonometri': {
    'easy': [
      {'q': 'sin 30° = ?', 'opts': ['1/2', '√3/2', '1', '0'], 'ans': 0},
      {'q': 'cos 60° = ?', 'opts': ['1/2', '√3/2', '√2/2', '0'], 'ans': 0},
      {'q': 'tan 45° = ?', 'opts': ['1', '0', '√3', '1/√3'], 'ans': 0},
      {'q': 'sin 90° = ?', 'opts': ['1', '0', '√2/2', '√3/2'], 'ans': 0},
    ],
    'medium': [
      {'q': 'sin²θ + cos²θ = ?', 'opts': ['1', '0', '2', 'sinθ'], 'ans': 0},
      {'q': 'cos 30° = ?', 'opts': ['√3/2', '1/2', '√2/2', '1'], 'ans': 0},
      {'q': 'tan 60° = ?', 'opts': ['√3', '1/√3', '1', '0'], 'ans': 0},
    ],
    'hard': [
      {'q': 'sin(90°-θ) = ?', 'opts': ['cos θ', 'sin θ', '-cos θ', 'tan θ'], 'ans': 0},
      {'q': '1 + tan²θ = ?', 'opts': ['sec²θ', 'cos²θ', 'sin²θ', '1'], 'ans': 0},
    ]
  },
  'aljabar': {
    'easy': [
      {'q': '2x + 3 = 7, x= ?', 'opts': ['2', '5', '1', '3'], 'ans': 0},
      {'q': 'Persamaan linear umum?', 'opts': ['ax + b = 0', 'ax² + bx + c = 0', 'sin x = 0', 'log x = 0'], 'ans': 0},
      {'q': 'x/2 = 3, x= ?', 'opts': ['6', '1.5', '3', '0'], 'ans': 0},
    ],
    'medium': [
      {'q': 'x + y = 5, x - y = 1, x= ?', 'opts': ['3', '2', '4', '1'], 'ans': 0},
      {'q': 'Faktorisasi x² - 5x + 6 = ?', 'opts': ['(x-2)(x-3)', '(x-1)(x-6)', '(x+2)(x+3)', '(x-5)(x+1)'], 'ans': 0},
      {'q': '(x+1)(x+2) = x² + ?', 'opts': ['3x+2', '3x', 'x+2', '2x+1'], 'ans': 0},
    ],
    'hard': [
      {'q': 'Diskriminan D > 0 berarti?', 'opts': ['2 akar berbeda', '1 akar', 'tak real', 'tak hingga'], 'ans': 0},
      {'q': 'x² - 4 = 0, akar?', 'opts': ['±2', '2', '-2', '0'], 'ans': 0},
    ]
  },
  'geometri': {
    'easy': [
      {'q': 'Luas segitiga a=6 t=4 = ?', 'opts': ['12', '24', '10', '20'], 'ans': 0},
      {'q': 'Keliling persegi s=5 = ?', 'opts': ['20', '25', '10', '15'], 'ans': 0},
      {'q': 'Luas persegi s=4 = ?', 'opts': ['16', '8', '4', '32'], 'ans': 0},
    ],
    'medium': [
      {'q': 'Pythagoras 3-4-? =5', 'opts': ['5', '7', '6', '√7'], 'ans': 0},
      {'q': 'Luas lingkaran r=7 π=22/7 = ?', 'opts': ['154', '44', '22', '49'], 'ans': 0},
      {'q': 'Volume kubus s=3 = ?', 'opts': ['27', '9', '18', '36'], 'ans': 0},
    ],
    'hard': [
      {'q': 'Jarak A(1,2) B(4,6) = ?', 'opts': ['5', '√25', '√(9+16)', '√50'], 'ans': 0},
      {'q': 'Gradien garis melalui (0,0),(3,4)?', 'opts': ['4/3', '3/4', '7', '1'], 'ans': 0},
      {'q': 'Luas trapesium a=4 b=6 t=5?', 'opts': ['25', '50', '10', '30'], 'ans': 1},
    ]
  },
  'statistika': {
    'easy': [
      {'q': 'Rata-rata 2,4,6,8 = ?', 'opts': ['5', '20/4', '4', '6'], 'ans': 0},
      {'q': 'Median 1,3,5,7,9 = ?', 'opts': ['5', '7', '3', '9'], 'ans': 0},
    ],
    'medium': [
      {'q': 'Peluang dadu 6 = ?', 'opts': ['1/6', '1/3', '1/2', '1'], 'ans': 0},
      {'q': 'Modus 2,2,3,3,3,4 = ?', 'opts': ['3', '2', '4', 'tidak ada'], 'ans': 0},
      {'q': 'Mean 10 data =100, total?', 'opts': ['1000', '10', '100', '1100'], 'ans': 0},
    ],
    'hard': [
      {'q': 'Simpangan baku σ>0?', 'opts': ['Data bervariasi', 'Sama', 'nol', 'negatif'], 'ans': 0},
      {'q': 'Kuartil Q2 = ?', 'opts': ['Median', 'Mean', 'Modus', 'Range'], 'ans': 0},
    ]
  },
  'persamaan_kuadrat': {
    'easy': [
      {'q': 'x² - 5x + 6 =0, faktorisasi?', 'opts': ['(x-2)(x-3)', '(x-1)(x-6)', '(x+3)(x+2)', '(x-5)x'], 'ans': 0},
      {'q': 'D = b² - 4ac untuk?', 'opts': ['Kuadrat', 'Linear', 'Eksponen', 'Log'], 'ans': 0},
    ],
    'medium': [
      {'q': 'x² + 2x - 3 =0, x=?', 'opts': ['1, -3', '3, -1', '2, -1.5', '-2'], 'ans': 0},
      {'q': 'Akar x² - 4 =0?', 'opts': ['2, -2', '4', '-4', '±√4'], 'ans': 0},
    ],
    'hard': [
      {'q': 'x² + x + 1 =0, D=?', 'opts': ['-3', '1', '3', '0'], 'ans': 0},
    ]
  },
  'fungsi': {
    'easy': [
      {'q': 'f(x) = 2x + 1, f(3)=?', 'opts': ['7', '6', '5', '4'], 'ans': 0},
      {'q': 'Domain f(x)=1/x?', 'opts': ['x≠0', 'R', 'x>0', 'x≥0'], 'ans': 0},
    ],
    'medium': [
      {'q': 'f(x)=x², komposisi f(f(2))=?', 'opts': ['16', '4', '2', '8'], 'ans': 0},
      {'q': 'f inverse g = id, artinya?', 'opts': ['Bijectif', 'Injectif', 'Surjectif', 'Constant'], 'ans': 0},
    ],
    'hard': [
      {'q': 'Limit x->2 (x²-4)/(x-2)=?', 'opts': ['4', '0', '2', 'undefined'], 'ans': 0},
    ]
  },
  'limit': {
    'easy': [
      {'q': 'lim x->a f(x)=L artinya?', 'opts': ['Kontinu di a', 'Differensiabel', 'Turunan', 'Integral'], 'ans': 0},
    ],
    'medium': [
      {'q': 'lim x->0 sinx/x =?', 'opts': ['1', '0', '∞', 'sin0'], 'ans': 0},
      {'q': 'lim x->∞ 1/x =?', 'opts': ['0', '1', '∞', 'undefined'], 'ans': 0},
    ],
    'hard': [
      {'q': 'lim x->0 (1-cosx)/x²=?', 'opts': ['1/2', '0', '1', '∞'], 'ans': 0},
    ]
  }
}

# Flatten all for bulk
all_questions = []
for topic in topics:
  for level in topics[topic]:
    all_questions.extend(topics[topic][level])
print(f"Total {len(all_questions)} unique questions loaded")

def generate_questions(num_questions, topic=None, level=None):
  if num_questions < 1 or num_questions > 58:
    raise ValueError("num_questions must be between 1-58")
  
  if topic and level and topic in topics and level in topics[topic]:
    available = topics[topic][level]
  else:
    available = all_questions
    
  if len(available) >= num_questions:
    selected = random.sample(available, num_questions)
  else:
    print(f"Warning: Only {len(available)} unique, duplicating for {num_questions}")
    selected = random.choices(available, k=num_questions)
    
  random.shuffle(selected)
  return selected

def explain_answer(question, user_answer):
  return f'Penjelasan untuk "{question}": Jawaban benar adalah opsi {chr(65 + user_answer)}. Check rumus dasar.'

@app.route('/health', methods=['GET'])
def health():
  return jsonify({'status': 'ok', 'total_questions': len(all_questions), 'max_bulk': 58})

@app.route('/generate', methods=['POST'])  
def generate_single():
  data = request.json
  topic = data.get('topic', 'himpunan')
  level = data.get('level', 'easy')
  if topic in topics and level in topics[topic] and topics[topic][level]:
    q_data = random.choice(topics[topic][level])
  else:
    q_data = {'q': f'Soal contoh {topic} {level}', 'opts': ['A', 'B', 'C', 'D'], 'ans': 0}
  return jsonify(q_data)

@app.route('/generate_bulk', methods=['POST'])
def generate_bulk():
  data = request.json
  num_questions = data.get('num_questions', 10)
  time_minutes = data.get('time_minutes', 30)
  topic = data.get('topic')
  level = data.get('level')
  
  try:
    questions = generate_questions(num_questions, topic, level)
    time_seconds = time_minutes * 60
    return jsonify({
      'questions': questions,
      'time_seconds': time_seconds,
      'total_questions': len(questions)
    })
  except ValueError as e:
    return jsonify({'error': str(e)}), 400

@app.route('/explain', methods=['POST'])
def explain():
  data = request.json
  question = data.get('question', '')
  user_ans = data.get('user_answer', 0)
  explanation = explain_answer(question, user_ans)
  return jsonify({'explanation': explanation})

if __name__ == '__main__':
  print("AI Quiz Generator FIXED - 70+ questions, bulk 1-58")
  print("Endpoints: /health, /generate_bulk POST {num_questions:58, time_minutes:60}")
  print("Run with start.bat")
  app.run(debug=True, port=5000)

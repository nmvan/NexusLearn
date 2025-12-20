import { Target, Sparkles, X, Brain, Calendar, ChevronRight } from 'lucide-react';

interface AIGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetGoal: (goal: string) => void;
}

const QUIZ_QUESTIONS = [
  {
    question: "Bạn đã từng làm việc với chủ đề này chưa?",
    options: [
      { text: "Chưa bao giờ", score: 0 },
      { text: "Đã từng đọc qua", score: 1 },
      { text: "Đã làm dự án thực tế", score: 2 }
    ]
  },
  {
    question: "Bạn tự tin thế nào về kiến thức nền tảng?",
    options: [
      { text: "Cần học lại từ đầu", score: 0 },
      { text: "Nắm vững cơ bản", score: 1 },
      { text: "Hiểu sâu các khái niệm", score: 2 }
    ]
  },
  {
    question: "Mục tiêu học tập chính của bạn là gì?",
    options: [
      { text: "Tìm hiểu khái niệm mới", score: 0 },
      { text: "Áp dụng vào công việc", score: 1 },
      { text: "Trở thành chuyên gia", score: 2 }
    ]
  }
];

export function AIGoalModal({ isOpen, onClose, onSetGoal }: AIGoalModalProps) {
  const [mode, setMode] = useState<'setup' | 'quiz'>('setup');
  const [goal, setGoal] = useState('');
  const [dailyTime, setDailyTime] = useState(60); // minutes
  const [knowledgeLevel, setKnowledgeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setMode('setup');
      setQuizStep(0);
      setQuizScore(0);
      setRecommendation(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateEndDate = (minutesPerDay: number) => {
    const totalHoursNeeded = 40; // Assuming a standard course length
    const daysNeeded = Math.ceil((totalHoursNeeded * 60) / minutesPerDay);
    const date = new Date();
    date.setDate(date.getDate() + daysNeeded);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' });
  };

  const handleQuizAnswer = (score: number) => {
    const newScore = quizScore + score;
    setQuizScore(newScore);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Finish quiz
      let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      let rec = "Deep-dive (Học kỹ từ đầu)";
      
      if (newScore >= 5) {
        level = 'advanced';
        rec = "Fast-track (Bỏ qua cơ bản)";
      } else if (newScore >= 3) {
        level = 'intermediate';
        rec = "Custom Path (Tập trung thực hành)";
      }
      
      setKnowledgeLevel(level);
      setRecommendation(rec);
      setMode('setup');
    }
  };

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Đánh giá năng lực nhanh</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">Câu {quizStep + 1}/{QUIZ_QUESTIONS.length}</span>
      </div>
      
      <div className="mb-6">
        <h4 className="text-xl text-slate-800 dark:text-slate-200 font-medium mb-6">
          {QUIZ_QUESTIONS[quizStep].question}
        </h4>
        
        <div className="space-y-3">
          {QUIZ_QUESTIONS[quizStep].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(option.score)}
              className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-white">{option.text}</span>
                <ChevronRight className="text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="space-y-6">
      {/* Goal Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mục tiêu học tập của bạn
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Ví dụ: Học React để làm việc, Master Python..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Knowledge Level */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mức độ hiểu biết về chủ đề này
          </label>
          {recommendation && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles size={12} /> Đề xuất: {recommendation}
            </span>
          )}
        </div>
        
        {!recommendation ? (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Brain size={20} />
              </div>
              <div>
                <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Chưa rõ trình độ?</div>
                <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Làm bài test nhanh để AI gợi ý lộ trình tối ưu</div>
              </div>
            </div>
            <button
              onClick={() => setMode('quiz')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Làm Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'beginner', label: 'Beginner', desc: 'Deep-dive' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Practice' },
              { id: 'advanced', label: 'Advanced', desc: 'Fast-track' }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setKnowledgeLevel(level.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  knowledgeLevel === level.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-700 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="text-sm font-medium mb-0.5">{level.label}</div>
                <div className="text-[10px] opacity-70">{level.desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Commitment */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Thời gian rảnh mỗi ngày
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[30, 60, 90, 120].map((time) => (
            <button
              key={time}
              onClick={() => setDailyTime(time)}
              className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${
                dailyTime === time
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-700 dark:text-cyan-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {time}p
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <Calendar size={14} className="text-cyan-600 dark:text-cyan-400" />
          <span>Dự kiến hoàn thành: <span className="text-cyan-700 dark:text-cyan-300 font-medium">{calculateEndDate(dailyTime)}</span></span>
        </div>
      </div>

      <button
        onClick={() => onSetGoal(goal)}
        disabled={!goal.trim()}
        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
      >
        Tạo lộ trình học tập
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          {mode === 'setup' && (
            <>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <Sparkles size={24} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thiết lập mục tiêu</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                AI sẽ cá nhân hóa lộ trình dựa trên năng lực và thời gian của bạn.
              </p>
            </>
          )}

          {mode === 'setup' ? renderSetup() : renderQuiz()}
        </div>
      </div>
    </div>
  );
}

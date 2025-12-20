import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowRight,
    CheckCircle,
    Circle,
    Info,
    RotateCcw,
    Save,
    XCircle
} from 'lucide-react';

type QuizOption = {
    id: string;
    label: string;
    text: string;
};

type QuizQuestion = {
    id: string;
    prompt: string;
    options: QuizOption[];
    answerId: string;
    rationale: string;
    hint: string;
};

type QuestionStatus = 'pending' | 'correct' | 'incorrect';

type QuestionState = {
    selectedOptionId: string | null;
    status: QuestionStatus;
    attempts: number;
};

type DraftPayload = {
    questionStates: QuestionState[];
    currentIndex: number;
    isSummaryVisible: boolean;
    timestamp: string;
};

const QUESTIONS: QuizQuestion[] = [
    {
        id: 'mcq-01',
        prompt: 'Khi làm bài IELTS Reading dạng MCQ, bước khởi động hiệu quả nhất là gì?',
        options: [
            { id: 'a', label: 'A', text: 'Đọc toàn bộ passage thật nhanh để nắm ý chính.' },
            { id: 'b', label: 'B', text: 'Xác định từ khóa trong câu hỏi và đáp án trước.' },
            { id: 'c', label: 'C', text: 'Chọn đáp án có vẻ hợp lý nhất để tiết kiệm thời gian.' },
            { id: 'd', label: 'D', text: 'Bỏ qua câu hỏi đầu tiên và làm các câu dễ hơn.' }
        ],
        answerId: 'b',
        rationale: 'Việc tìm từ khóa trong câu hỏi giúp thu hẹp khu vực cần đọc lại trong passage và hạn chế bị nhiễu bởi các đáp án gây nhiễu.',
        hint: 'Hãy chuẩn bị trước bằng cách phân tích câu hỏi thay vì lao ngay vào passage.'
    },
    {
        id: 'mcq-02',
        prompt: 'Điểm khác biệt lớn giữa MCQ một đáp án và nhiều đáp án là gì?',
        options: [
            { id: 'a', label: 'A', text: 'Thứ tự đáp án xuất hiện theo trật tự đoạn văn.' },
            { id: 'b', label: 'B', text: 'Cần chọn tất cả đáp án đúng được yêu cầu trong câu hỏi.' },
            { id: 'c', label: 'C', text: 'Các câu hỏi luôn yêu cầu suy luận thay vì thông tin trực tiếp.' },
            { id: 'd', label: 'D', text: 'Không cần nhìn lại passage khi đã hiểu câu hỏi.' }
        ],
        answerId: 'b',
        rationale: 'Với dạng nhiều đáp án, đề bài sẽ yêu cầu chọn một số lượng đáp án cụ thể. Nếu thiếu hoặc thừa đáp án đều bị tính sai.',
        hint: 'Hãy đọc kỹ yêu cầu của câu hỏi để biết mình cần chọn bao nhiêu đáp án.'
    },
    {
        id: 'mcq-03',
        prompt: 'Thông tin đáp án đúng của MCQ trong passage thường có đặc điểm nào?',
        options: [
            { id: 'a', label: 'A', text: 'Luôn xuất hiện trong cùng đoạn với câu hỏi ngay sau khi đọc.' },
            { id: 'b', label: 'B', text: 'Được paraphrase nên cần nhận diện bằng từ đồng nghĩa.' },
            { id: 'c', label: 'C', text: 'Giống hệt từ ngữ trong câu hỏi để dễ nhận ra.' },
            { id: 'd', label: 'D', text: 'Nằm ở phần mở đầu passage để tạo bối cảnh.' }
        ],
        answerId: 'b',
        rationale: 'Đáp án thường được diễn đạt lại bằng từ đồng nghĩa hoặc cấu trúc khác, vì vậy kỹ năng nhận diện paraphrase là rất quan trọng.',
        hint: 'Chú ý các từ hoặc cụm từ mang nghĩa tương tự với từ khóa vừa tìm.'
    },
    {
        id: 'mcq-04',
        prompt: 'Chiến lược nào giúp kiểm tra nhanh đáp án trước khi nhấn "Gửi bài"?',
        options: [
            { id: 'a', label: 'A', text: 'Đọc lại toàn bộ passage để đảm bảo không bỏ sót ý.' },
            { id: 'b', label: 'B', text: 'Đối chiếu từng đáp án với bằng chứng cụ thể trong passage.' },
            { id: 'c', label: 'C', text: 'Chọn đáp án có nhiều thông tin nhất.' },
            { id: 'd', label: 'D', text: 'Thay đổi lựa chọn nếu thấy đáp án khác dài hơn.' }
        ],
        answerId: 'b',
        rationale: 'Luôn tìm lại bằng chứng trong passage để xác nhận lựa chọn, tránh bị dụ bởi các đáp án chứa thông tin thừa hoặc sai lệch.',
        hint: 'Không cần đọc lại toàn bộ passage, hãy kiểm tra bằng chứng cho từng đáp án.'
    }
];

const DRAFT_STORAGE_KEY = 'nexuslearn-interactive-quiz-draft';

function buildInitialState(): QuestionState[] {
    return QUESTIONS.map(() => ({ selectedOptionId: null, status: 'pending', attempts: 0 }));
}

export function InteractiveQuiz() {
    const [questionStates, setQuestionStates] = useState<QuestionState[]>(() => buildInitialState());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<QuestionStatus | null>(null);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [draftMessage, setDraftMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<number | null>(null);

    const currentQuestion = QUESTIONS[currentIndex];
    const currentState = questionStates[currentIndex];

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!raw) {
            return;
        }

        try {
            const parsed: DraftPayload = JSON.parse(raw);
            if (Array.isArray(parsed.questionStates) && parsed.questionStates.length === QUESTIONS.length) {
                setQuestionStates(parsed.questionStates);
                setCurrentIndex(Math.min(Math.max(parsed.currentIndex ?? 0, 0), QUESTIONS.length - 1));
                setIsSummaryVisible(Boolean(parsed.isSummaryVisible));
                setFeedback(null);
                showTransientMessage('Đã khôi phục bản nháp gần nhất.');
            }
        } catch {
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                window.clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const score = useMemo(
        () => questionStates.filter(state => state.status === 'correct').length,
        [questionStates]
    );

    const attempted = useMemo(
        () => questionStates.filter(state => state.status !== 'pending').length,
        [questionStates]
    );

    const progressPercent = Math.round((attempted / QUESTIONS.length) * 100);

    const showTransientMessage = (text: string) => {
        setDraftMessage(text);
        if (messageTimeoutRef.current) {
            window.clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = window.setTimeout(() => setDraftMessage(null), 4000);
    };

    const handleSaveDraft = () => {
        if (typeof window === 'undefined') {
            return;
        }

        const payload: DraftPayload = {
            questionStates,
            currentIndex,
            isSummaryVisible,
            timestamp: new Date().toISOString()
        };
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        showTransientMessage('Đã lưu bản nháp để tiếp tục sau.');
    };

    const handleOptionSelect = (optionId: string) => {
        if (currentState.status === 'correct') {
            return;
        }

        setQuestionStates(prev =>
            prev.map((state, index) =>
                index === currentIndex
                    ? { ...state, selectedOptionId: optionId }
                    : state
            )
        );
        setFeedback(null);
    };

    const handleCheckAnswer = () => {
        if (!currentState.selectedOptionId) {
            return;
        }

        const isCorrect = currentState.selectedOptionId === currentQuestion.answerId;

        setQuestionStates(prev =>
            prev.map((state, index) =>
                index === currentIndex
                    ? {
                          ...state,
                          status: isCorrect ? 'correct' : 'incorrect',
                          attempts: state.attempts + 1
                      }
                    : state
            )
        );

        setFeedback(isCorrect ? 'correct' : 'incorrect');
    };

    const handleRetry = () => {
        setQuestionStates(prev =>
            prev.map((state, index) =>
                index === currentIndex
                    ? { ...state, status: 'pending', selectedOptionId: null }
                    : state
            )
        );
        setFeedback(null);
    };

    const handleContinue = () => {
        if (currentIndex === QUESTIONS.length - 1) {
            setIsSummaryVisible(true);
            setFeedback(null);
            return;
        }

        setCurrentIndex(index => Math.min(index + 1, QUESTIONS.length - 1));
        setFeedback(null);
    };

    const handleRestart = () => {
        setQuestionStates(buildInitialState());
        setCurrentIndex(0);
        setFeedback(null);
        setIsSummaryVisible(false);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
    };

    const renderStatusPill = (state: QuestionState, index: number) => {
        const baseClasses = 'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors';
        if (state.status === 'correct') {
            return (
                <span key={QUESTIONS[index].id} className={`${baseClasses} border-emerald-400/40 bg-emerald-500/10 text-emerald-300`}>
                    <CheckCircle size={14} /> Câu {index + 1}
                </span>
            );
        }
        if (state.status === 'incorrect') {
            return (
                <span key={QUESTIONS[index].id} className={`${baseClasses} border-rose-400/40 bg-rose-500/10 text-rose-300`}>
                    <XCircle size={14} /> Câu {index + 1}
                </span>
            );
        }
        return (
            <span key={QUESTIONS[index].id} className={`${baseClasses} border-slate-700 bg-slate-900 text-slate-400`}>
                <Circle size={14} /> Câu {index + 1}
            </span>
        );
    };

    if (isSummaryVisible) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/50">
                <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
                    <div>
                        <h3 className="text-xl font-semibold text-white">Kết quả bài tập</h3>
                        <p className="text-sm text-slate-400">Bạn đã hoàn thành {QUESTIONS.length} câu hỏi tương tác về MCQ.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-3 py-1.5 text-sm font-medium text-slate-300 hover:border-indigo-400/60 hover:text-white"
                    >
                        <Save size={16} /> Lưu nháp
                    </button>
                </div>
                <div className="px-6 py-8 space-y-6">
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Điểm số</p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-white">{score}/{QUESTIONS.length}</span>
                            <span className="text-sm text-slate-400">{Math.round((score / QUESTIONS.length) * 100)}%</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{score === QUESTIONS.length ? 'Tuyệt vời! Bạn đã làm đúng toàn bộ câu hỏi.' : 'Hãy xem lại các câu chưa đúng để hiểu rõ chiến lược làm MCQ.'}</p>
                    </div>
                    <div className="space-y-4">
                        {QUESTIONS.map((question, index) => {
                            const state = questionStates[index];
                            const isCorrect = state.status === 'correct';
                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-xl border px-5 py-4 transition-colors ${
                                        isCorrect
                                            ? 'border-emerald-400/40 bg-emerald-500/10'
                                            : 'border-rose-400/40 bg-rose-500/10'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {isCorrect ? (
                                            <CheckCircle size={20} className="mt-0.5 text-emerald-300" />
                                        ) : (
                                            <XCircle size={20} className="mt-0.5 text-rose-300" />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-white">Câu {index + 1}</p>
                                            <p className="text-sm text-slate-200 mt-1">{question.prompt}</p>
                                            <p className="text-sm text-slate-300 mt-2">
                                                {isCorrect ? question.rationale : question.hint}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-slate-300 hover:border-emerald-400/40 hover:text-emerald-300"
                        >
                            <RotateCcw size={16} /> Làm lại bài tập
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSummaryVisible(false)}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                            Trở lại câu hỏi
                        </button>
                    </div>
                    {draftMessage ? (
                        <div className="rounded-lg border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{draftMessage}</div>
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/50">
            <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Interactive Quiz</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">Thực hành dạng Multiple Choice (MCQ)</h3>
                    <p className="mt-1 text-sm text-slate-400">Kiểm tra nhanh chiến lược làm bài MCQ trong IELTS Reading với phản hồi ngay lập tức.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-3 py-1.5 text-sm font-medium text-slate-300 hover:border-indigo-400/60 hover:text-white"
                    >
                        <Save size={16} /> Lưu nháp
                    </button>
                    <div className="w-40">
                        <div className="h-1.5 rounded-full bg-slate-800">
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <p className="mt-1 text-right text-xs text-slate-500">{progressPercent}% hoàn thành</p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-7 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                        Câu {currentIndex + 1}/{QUESTIONS.length}
                    </span>
                    <span className="text-xs text-slate-500">Lượt thử: {currentState.attempts}</span>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white">{currentQuestion.prompt}</h4>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                        <Info size={16} className="text-indigo-300" /> Chọn đáp án đúng nhất trước khi nhấn "Check Answer".
                    </p>
                </div>
                <div className="space-y-3">
                    {currentQuestion.options.map(option => {
                        const isSelected = currentState.selectedOptionId === option.id;
                        const isDisabled = currentState.status === 'correct';
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleOptionSelect(option.id)}
                                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                                    isSelected
                                        ? 'border-indigo-400 bg-indigo-500/10 text-white'
                                        : 'border-slate-700/80 bg-slate-900 text-slate-200 hover:border-indigo-400/60 hover:text-white'
                                } ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
                                disabled={isDisabled}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 h-6 w-6 rounded-full border border-current text-center text-sm font-semibold leading-5.5">
                                        {option.label}
                                    </span>
                                    <span className="text-sm leading-6">{option.text}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
                {feedback ? (
                    <div
                        className={`rounded-xl border px-4 py-3 ${
                            feedback === 'correct'
                                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                                : 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {feedback === 'correct' ? (
                                <CheckCircle size={20} className="mt-0.5" />
                            ) : (
                                <XCircle size={20} className="mt-0.5" />
                            )}
                            <div>
                                <p className="text-sm font-semibold">
                                    {feedback === 'correct' ? 'Chính xác! Bạn đã chọn đúng.' : 'Chưa chính xác, hãy thử lại.'}
                                </p>
                                <p className="mt-1 text-sm">
                                    {feedback === 'correct' ? currentQuestion.rationale : currentQuestion.hint}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
                <div className="flex flex-wrap gap-3">
                    {feedback === 'correct' ? (
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                            {currentIndex === QUESTIONS.length - 1 ? 'Gửi bài và xem điểm' : 'Tiếp tục'}
                            <ArrowRight size={16} />
                        </button>
                    ) : feedback === 'incorrect' ? (
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 rounded-lg border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-200 hover:border-rose-300"
                        >
                            <RotateCcw size={16} /> Thử lại
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCheckAnswer}
                            disabled={!currentState.selectedOptionId}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                currentState.selectedOptionId
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            Check Answer
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-4 py-2 text-sm font-medium text-slate-300 hover:border-rose-400/40 hover:text-rose-200"
                    >
                        <RotateCcw size={16} /> Làm lại từ đầu
                    </button>
                </div>
                {draftMessage ? (
                    <div className="rounded-lg border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{draftMessage}</div>
                ) : null}
            </div>
            <div className="border-t border-slate-800 px-6 py-4">
                <div className="flex flex-wrap gap-2">
                    {questionStates.map((state, index) => renderStatusPill(state, index))}
                </div>
            </div>
        </div>
    );
}

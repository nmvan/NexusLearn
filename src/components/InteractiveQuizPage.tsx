import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Info, LayoutDashboard, Sparkles } from 'lucide-react';
import { InteractiveQuiz } from './InteractiveQuiz';

export function InteractiveQuizPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50">
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-6xl px-6 py-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/lesson')}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-indigo-400/60 hover:text-white"
                            >
                                <ChevronLeft size={16} /> Back to lesson
                            </button>
                            <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                                Section 2 · Multiple Choice (MCQ)
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Interactive Quiz</p>
                            <p className="text-sm text-slate-400">Responses update instantly • Drafts stay local</p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,_1fr)_320px]">
                        <section className="space-y-6">
                            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Interactive Exercise</p>
                                        <h1 className="mt-2 text-2xl font-bold text-white">Reading MCQ Strategy Drill</h1>
                                        <p className="mt-2 text-sm text-slate-300">
                                            Apply the techniques from the lesson to four scenario-based multiple-choice questions with immediate feedback and retry support.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-indigo-200">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} /> Estimated time · 10 minutes
                                        </div>
                                        <p className="mt-2 text-xs text-indigo-200/80">
                                            Save your progress anytime and continue later. Results remain on this device.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <InteractiveQuiz />
                        </section>

                        <aside className="hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/40 lg:flex lg:flex-col lg:gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Quick Reminders</p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <Sparkles size={16} className="mt-0.5 text-indigo-300" />
                                        Các câu trả lời đúng dựa trên bằng chứng cụ thể trong passage.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Info size={16} className="mt-0.5 text-indigo-300" />
                                        Chọn "Save draft" bất cứ lúc nào để lưu tiến trình ngay trên thiết bị.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <LayoutDashboard size={16} className="mt-0.5 text-indigo-300" />
                                        Bạn có thể trở lại bài giảng và video bằng nút "Back to lesson" phía trên.
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-4 text-sm text-slate-300">
                                <p className="font-semibold text-white">Tip từ giảng viên</p>
                                <p className="mt-2 text-sm text-slate-300">
                                    Khi xem lại đáp án sai, hãy ghi chú lại từ khóa bị nhầm lẫn và tìm câu paraphrase trong passage để củng cố kỹ năng nhận diện.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}

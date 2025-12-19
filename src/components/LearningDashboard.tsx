import { useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { CourseOverview } from './CourseOverview';
import { LessonView } from './LessonView';
import { StudyPlan } from './StudyPlan';
import { AIGoalModal } from './AIGoalModal';
import { Grades } from './Grades';
import { InteractiveQuizPage } from './InteractiveQuizPage';

export function LearningDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  // Check if we are in lesson mode
  const handleSetGoal = (goal: string) => {
    console.log("Goal set:", goal);
    setHasPlan(true);
    setIsGoalModalOpen(false);
    // Optionally navigate to study plan or stay on overview
    if (activeTab === 'overview') {
       // Maybe show a success message or just update the UI
    }
  };

  if (location.pathname.startsWith('/dashboard/lesson')) {
    return (
      <Routes>
        <Route path="lesson" element={<LessonView />} />
        <Route path="lesson/interactive-quiz" element={<InteractiveQuizPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex pt-0">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {activeTab === 'overview' && (
          <CourseOverview 
            onContinue={() => navigate('/dashboard/lesson')} 
            hasPlan={hasPlan}
            onCreatePlan={() => setIsGoalModalOpen(true)}
          />
        )}
        {activeTab === 'study-plan' && (
          <StudyPlan 
            onStartLesson={() => navigate('/dashboard/lesson')} 
            hasPlan={hasPlan}
            onCreatePlan={() => setIsGoalModalOpen(true)}
          />
        )}
        {activeTab === 'grades' && <Grades />}
        {activeTab !== 'overview' && activeTab !== 'study-plan' && activeTab !== 'grades' && (
          <div className="p-8 text-slate-400">
            Content for {activeTab} is under construction.
          </div>
        )}
      </main>

      <AIGoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        onSetGoal={handleSetGoal} 
      />
    </div>
  );
}

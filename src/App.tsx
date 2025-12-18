import { useState } from 'react';
import LearningDashboard from './components/LearningDashboard';
import { LandingPage } from './components/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const handleCourseSelect = (courseId: string) => {
    console.log(`Selected course: ${courseId}`);
    setCurrentView('dashboard');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onCourseSelect={handleCourseSelect} />
      ) : (
        <LearningDashboard />
      )}
    </>
  );
}

export default App;

import React, { createContext, useContext, type ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  matchScore: number;
  lastUpdated: string;
  timeCommitment: string;
  whatYouWillBuild: string[];
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  language?: string;
  techStack?: string[];
  isBeginnerFriendly?: boolean;
  detailedRating?: number;
  price?: number;
}

interface CourseContextType {
  courses: Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode; courses: Course[] }> = ({ children, courses }) => {
  return (
    <CourseContext.Provider value={{ courses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
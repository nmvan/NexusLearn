import React, { createContext, useContext, useState, type ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components

export interface Note {
  id: string;
  title: string;
  timestamp: number;
  content: string;
  createdAt: Date;
  courseId?: string; // Optional: to associate notes with a course
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  editNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([
    // React Mastery: The Complete Guide (course id: '1')
    {
      id: '1',
      title: 'Introduction to React Hooks',
      timestamp: 120,
      content: 'React Hooks allow you to use state and other React features without writing a class. The most common hooks are useState, useEffect, useContext, and useReducer.',
      createdAt: new Date('2024-01-10'),
      courseId: '1',
    },
    {
      id: '2',
      title: 'Advanced State Management',
      timestamp: 200,
      content: 'Context API provides a way to pass data through the component tree without having to pass props down manually at every level.',
      createdAt: new Date('2024-01-11'),
      courseId: '1',
    },
    {
      id: '3',
      title: 'Custom Hooks Implementation',
      timestamp: 400,
      content: 'Custom hooks are JavaScript functions whose names start with "use" and may call other hooks. They allow you to extract component logic into reusable functions.',
      createdAt: new Date('2024-01-12'),
      courseId: '1',
    },
    // React for Professionals (course id: '2')
    {
      id: '4',
      title: 'Enterprise Architecture Patterns',
      timestamp: 240,
      content: 'Micro-frontend architecture allows different teams to work on different parts of the frontend independently, using different technologies if needed.',
      createdAt: new Date('2024-01-08'),
      courseId: '2',
    },
    {
      id: '5',
      title: 'Performance Optimization',
      timestamp: 1500,
      content: 'React.memo prevents unnecessary re-renders by memoizing the component. Use it for components that render often with the same props.',
      createdAt: new Date('2024-01-09'),
      courseId: '2',
    },
    // Complete React Developer in 2023 (course id: '3')
    {
      id: '6',
      title: 'Class Components vs Functional',
      timestamp: 300,
      content: 'Class components use ES6 classes and have lifecycle methods. Functional components are simpler and work with hooks.',
      createdAt: new Date('2024-01-07'),
      courseId: '3',
    },
    {
      id: '7',
      title: 'Redux Fundamentals',
      timestamp: 900,
      content: 'Redux is a predictable state container for JavaScript apps. It helps manage complex state logic in large applications.',
      createdAt: new Date('2024-01-08'),
      courseId: '3',
    },
    {
      id: '8',
      title: 'Context API Basics',
      timestamp: 1200,
      content: 'Context provides a way to pass data through the component tree without having to pass props down manually.',
      createdAt: new Date('2024-01-09'),
      courseId: '3',
    },
    // React.js: Getting Started (course id: '4')
    {
      id: '9',
      title: 'JSX Syntax',
      timestamp: 180,
      content: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files.',
      createdAt: new Date('2024-01-06'),
      courseId: '4',
    },
    {
      id: '10',
      title: 'Component Props',
      timestamp: 600,
      content: 'Props are inputs to a React component. They are passed from parent to child components and are read-only.',
      createdAt: new Date('2024-01-07'),
      courseId: '4',
    },
    // Advanced React Patterns (course id: '5')
    {
      id: '11',
      title: 'Compound Components',
      timestamp: 420,
      content: 'Compound components are a pattern where multiple components work together to form a single cohesive UI component.',
      createdAt: new Date('2024-01-05'),
      courseId: '5',
    },
    {
      id: '12',
      title: 'Render Props Pattern',
      timestamp: 1800,
      content: 'Render props is a technique for sharing code between React components using a prop whose value is a function.',
      createdAt: new Date('2024-01-06'),
      courseId: '5',
    },
    {
      id: '13',
      title: 'Higher-Order Components',
      timestamp: 2700,
      content: 'A higher-order component is a function that takes a component and returns a new component with additional props or behavior.',
      createdAt: new Date('2024-01-07'),
      courseId: '5',
    },
    // Additional courses - let's add some more variety
    {
      id: '14',
      title: 'JavaScript Fundamentals',
      timestamp: 300,
      content: 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.',
      createdAt: new Date('2024-01-04'),
      courseId: '6', // New course
    },
    {
      id: '15',
      title: 'TypeScript Basics',
      timestamp: 450,
      content: 'TypeScript is a superset of JavaScript that adds static typing. It helps catch errors early in development.',
      createdAt: new Date('2024-01-05'),
      courseId: '7', // New course
    },
    {
      id: '16',
      title: 'Node.js Backend Development',
      timestamp: 1200,
      content: 'Node.js allows you to run JavaScript on the server side. It uses an event-driven, non-blocking I/O model.',
      createdAt: new Date('2024-01-06'),
      courseId: '8', // New course
    },
    {
      id: '17',
      title: 'Database Design Principles',
      timestamp: 900,
      content: 'Database normalization is the process of organizing data to minimize redundancy and improve data integrity.',
      createdAt: new Date('2024-01-07'),
      courseId: '9', // New course
    },
    {
      id: '18',
      title: 'API Design Best Practices',
      timestamp: 600,
      content: 'RESTful APIs should use HTTP methods appropriately: GET for reading, POST for creating, PUT for updating, DELETE for removing.',
      createdAt: new Date('2024-01-08'),
      courseId: '10', // New course
    },
  ]);

  const addNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const editNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updatedNote } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

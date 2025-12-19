import React from 'react';
import { LayoutDashboard, PieChart, BookOpen, FileText, User, ChevronDown } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'study-plan', label: 'Study Plan', icon: PieChart },
    { id: 'grades', label: 'Grades', icon: BookOpen },
    { id: 'test-practice', label: 'Practice Projects', icon: FileText },
    { id: 'learning-profile', label: 'Learning Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-slate-950 h-[calc(100vh-4rem)] border-r border-slate-800 flex flex-col sticky top-16">
      <div className="p-6">
        <div className="text-xs text-slate-400 mb-2">Selected Program</div>
        <button className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 transition-colors">
          <span className="font-bold text-slate-100">Frontend Dev</span>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

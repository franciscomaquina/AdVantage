import React from 'react';
import { LayoutDashboard, PenTool, BarChart3, Library, Settings, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Ad', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'library', label: 'Resources', icon: Library },
  ];

  return (
    <div className="w-20 lg:w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-10 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
          AV
        </div>
        <span className="font-bold text-xl text-slate-800 hidden lg:block tracking-tight">AdVantage</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={20} />
          <span className="hidden lg:block">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;

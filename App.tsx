import React, { useState } from 'react';
import Navigation from './components/Navigation';
import AdCreator from './components/AdCreator';
import Dashboard from './components/Dashboard';
import ResourceLibrary from './components/ResourceLibrary';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'create':
        return <AdCreator />;
      case 'analytics':
        return <Dashboard />; // Reusing dashboard for analytics demo
      case 'library':
        return <ResourceLibrary />;
      default:
        return <AdCreator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <header className="sticky top-0 z-0 bg-slate-50/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-200 lg:hidden">
          <div className="font-bold text-xl text-slate-900">AdVantage</div>
        </header>

        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

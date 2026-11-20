import React from 'react';
import { Sprout, Binary, Cpu, History, Leaf, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiOnline, historyCount }) {
  const navItems = [
    { id: 'detect', label: 'Leaf Diagnosis', icon: Leaf, badge: null },
    { id: 'math', label: 'Sets & Relations', icon: Binary, badge: 'Discrete Math' },
    { id: 'model', label: 'ML Architecture', icon: Cpu, badge: 'MobileNetV2' },
    { id: 'history', label: 'Scan History', icon: History, badge: historyCount > 0 ? historyCount : null },
  ];

  return (
    <header className="sticky top-0 z-50 bg-forest-900/90 backdrop-blur-md border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Academic Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('detect')}>
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-900/30">
              <Sprout className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  PlantCare <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  Colab Model v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Leaf Disease Detection via ML & Discrete Mathematics
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Backend Status indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            {apiOnline ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-mono">FastAPI Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-400 font-mono">Connecting...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

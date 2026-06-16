"use client";

import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  KeyRound, 
  ActivitySquare, 
  FileText, 
  BookOpen, 
  Library, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

import { useKeyManager } from '../hooks/useKeyManager';
import { KeyVaultTable } from '../components/KeyVaultTable';
import { QuickKeyGeneration } from '../components/QuickKeyGeneration';
import { DiagnosticHub } from '../components/DiagnosticHub';
import { SanctumAssistant } from '../components/SanctumAssistant';

// --- Anna Mock Types ---
declare global {
  interface Window {
    Anna?: {
      storage: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
      }
    };
  }
}

if (typeof window !== "undefined" && !window.Anna) {
  window.Anna = {
    storage: {
      get: async (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
      set: async (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))
    }
  };
}

export default function KeyManagementHub() {
  const { keys, generateKeys, createSingleKey, revokeKey } = useKeyManager();

  return (
    <div className="flex h-screen bg-[#111625] text-slate-300 font-sans overflow-hidden selection:bg-[#CFB53B]/30">
      
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#161C2D] border-r border-slate-800/50 flex flex-col flex-shrink-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#CFB53B]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-wide leading-tight">SANCTUM</span>
              <span className="text-sm font-semibold text-slate-400 tracking-wider leading-tight">KEYPULSE</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#1E2538] text-[#CFB53B] rounded-lg border border-[#CFB53B]/20 shadow-[inset_4px_0_0_0_#CFB53B] transition-colors">
            <KeyRound className="w-5 h-5" />
            <span className="font-medium text-sm">Key Management Hub</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <ActivitySquare className="w-5 h-5" />
            <span className="font-medium text-sm">Diagnostic Center</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium text-sm">Health Audit Reports</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium text-sm">Onboarding Guides</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <Library className="w-5 h-5" />
            <span className="font-medium text-sm">Documentation</span>
          </a>
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-800/50">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#161C2D] border-b border-slate-800/50 flex-shrink-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-wide">Key Management Hub</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#DC143C] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#161C2D]">8</span>
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-full h-full object-cover" />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="w-px h-6 bg-slate-700/50"></div>
            
            <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
              Global help
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="px-4 py-2 text-sm font-medium text-[#DC143C] border border-[#DC143C]/50 hover:bg-[#DC143C]/10 rounded-md transition-colors">
              Troubleshoot
            </button>
          </div>
        </header>

        {/* Search Bar Placeholder (Actual search moved to KeyVaultTable) */}
        <div className="px-8 py-6 flex-shrink-0">
          <div className="relative w-full opacity-50 cursor-not-allowed">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              disabled
              placeholder="Global search disabled. Use vault search below." 
              className="w-full bg-[#1A2235] border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none transition-colors shadow-inner text-sm"
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
            
            {/* Left Column: Key Vault Table */}
            <KeyVaultTable 
              keys={keys} 
              onRevoke={revokeKey} 
              onCreateSingleKey={createSingleKey} 
            />

            {/* Right Column: Utilities */}
            <div className="flex flex-col gap-6 h-full">
              
              <QuickKeyGeneration onGenerate={generateKeys} />

              {/* Provider Overview Chart */}
              <section className="bg-[#1A2235] border border-slate-800/80 rounded-xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden min-h-[200px]">
                <h2 className="text-base font-bold text-white mb-6">Provider Overview</h2>
                
                <div className="absolute top-16 right-12 flex items-center gap-2 bg-[#1A2235] border border-slate-700/50 px-3 py-1.5 rounded-lg z-10 shadow-lg">
                  <div className="w-3 h-3 bg-[#CFB53B] rounded-sm"></div>
                  <span className="text-xs text-slate-300">Provider Chart</span>
                </div>

                <div className="flex-1 w-full relative mt-4">
                  <svg className="w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#CFB53B" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#CFB53B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,80 Q15,40 30,60 T60,30 T85,55 T100,45 L100,100 L0,100 Z" 
                      fill="url(#goldGradient)"
                      className="animate-pulse"
                    />
                    <path 
                      d="M0,80 Q15,40 30,60 T60,30 T85,55 T100,45" 
                      fill="none" 
                      stroke="#CFB53B" 
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </section>

              <DiagnosticHub />

            </div>
          </div>
        </div>

      </main>

      <SanctumAssistant keys={keys} />

    </div>
  );
}

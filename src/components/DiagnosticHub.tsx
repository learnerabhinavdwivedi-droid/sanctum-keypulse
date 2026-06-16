import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export const DiagnosticHub: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [provider, setProvider] = useState('Google AI Studio');
  
  const handleDiagnostic = async () => {
    setIsRunning(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRunning(false);
      alert(`Diagnostic Results for ${provider}:\nLatency: 45ms\nRate Limits: OK\nReliability: 99.99%`);
    }, 2000);
  };

  return (
    <section className="bg-[#1A2235] border border-slate-800/80 rounded-xl p-6 shadow-xl">
      <h2 className="text-base font-bold text-white mb-6">Active Integrations & Diagnostic Hub</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">API Gateway</label>
          <div className="relative">
            <select 
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full appearance-none bg-[#111625] border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-300 cursor-pointer focus:outline-none focus:border-[#CFB53B]/50"
            >
              <option value="Google AI Studio">Google AI Studio</option>
              <option value="OpenAI Platform">OpenAI Platform</option>
              <option value="Anthropic Console">Anthropic Console</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input Data</label>
          <div className="bg-[#111625] border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-500 font-mono tracking-widest opacity-70">
            ••••••••••••••••
          </div>
        </div>

        <button 
          onClick={handleDiagnostic}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-3 text-sm font-bold text-white bg-[#DC143C] hover:bg-[#B31031] disabled:bg-[#DC143C]/50 disabled:cursor-not-allowed rounded-lg transition-colors tracking-wide shadow-[0_0_15px_rgba(220,20,60,0.2)]"
        >
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isRunning ? 'RUNNING...' : 'RUN DIAGNOSTIC'}
        </button>
      </div>
    </section>
  );
};

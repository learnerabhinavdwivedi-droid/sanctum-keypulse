import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

interface QuickKeyGenerationProps {
  onGenerate: (count: number, prefix: string, provider: string) => void;
}

export const QuickKeyGeneration: React.FC<QuickKeyGenerationProps> = ({ onGenerate }) => {
  const [prefix, setPrefix] = useState('google Key');
  const [count, setCount] = useState(50);
  const [provider, setProvider] = useState('Google');

  return (
    <section className="bg-[#1A2235] border border-slate-800/80 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-white">Quick Key Generation</h2>
        <button 
          onClick={() => onGenerate(count, prefix, provider)}
          className="px-4 py-2 text-xs font-bold text-[#111625] bg-[#CFB53B] hover:bg-[#E0C64C] rounded-lg transition-colors shadow-[0_0_10px_rgba(207,181,59,0.1)]"
        >
          Generate {count} Keys
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center bg-[#111625] border border-slate-700/50 rounded-lg px-3 overflow-hidden">
          <span className="text-xs text-slate-500 whitespace-nowrap mr-2">prefix:</span>
          <input 
            type="text" 
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full bg-transparent border-none text-slate-300 text-sm py-2.5 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex flex-col w-32">
          <span className="text-[10px] text-slate-500 mb-1 ml-1">Permission</span>
          <div className="relative">
            <select 
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full appearance-none bg-[#111625] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-pointer focus:outline-none focus:border-[#CFB53B]/50"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <Info className="w-5 h-5 text-slate-600 mt-5 cursor-pointer hover:text-slate-400" />
      </div>
    </section>
  );
};

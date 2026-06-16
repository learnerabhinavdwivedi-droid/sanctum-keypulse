import React, { useState } from 'react';
import { KeyRecord } from '../hooks/useKeyManager';
import { ArrowUpDown, ChevronLeft, ChevronRight, KeyRound, PenLine, MoreVertical } from 'lucide-react';

interface KeyVaultTableProps {
  keys: KeyRecord[];
  onRevoke: (id: string) => void;
  onCreateSingleKey: () => void;
}

export const KeyVaultTable: React.FC<KeyVaultTableProps> = ({ keys, onRevoke, onCreateSingleKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter keys
  const filteredKeys = keys.filter(k => 
    k.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    k.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.keyValue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <section className="lg:col-span-2 bg-[#1A2235] border border-slate-800/80 rounded-xl flex flex-col shadow-xl overflow-hidden h-full">
      {/* Top Header & Search */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
        <h2 className="text-lg font-bold text-white whitespace-nowrap mr-4">Key Vault</h2>
        
        <div className="flex-1 max-w-md mx-4">
          <input 
            type="text" 
            placeholder="Search vault..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full bg-[#111625] border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2 focus:outline-none focus:border-[#CFB53B]/50 transition-colors shadow-inner text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/50 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            Sorting Keys
          </button>
          <button 
            onClick={onCreateSingleKey}
            className="px-5 py-2 text-sm font-bold text-[#111625] bg-[#CFB53B] hover:bg-[#E0C64C] rounded-lg transition-colors shadow-[0_0_15px_rgba(207,181,59,0.15)]"
          >
            Create Key
          </button>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-end text-xs text-slate-400 gap-4">
        <span>Page {currentPage} of {totalPages || 1}</span>
        <div className="flex gap-1">
          <button onClick={handlePrev} disabled={currentPage === 1} className="p-1 hover:text-white disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={handleNext} disabled={currentPage >= totalPages} className="p-1 hover:text-white disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
        <table className="w-full text-sm text-left relative">
          <thead className="text-xs text-slate-500 bg-[#161C2D]/50 sticky top-0 z-10 border-y border-slate-800/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Label</th>
              <th className="px-6 py-4 font-medium">Key</th>
              <th className="px-6 py-4 font-medium">Provider</th>
              <th className="px-6 py-4 font-medium">Direct Portal URL</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Used</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentKeys.length > 0 ? currentKeys.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4 text-slate-300 font-medium whitespace-nowrap">{row.label}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 tracking-widest text-xs">
                      {row.keyValue.includes('••••') ? row.keyValue : row.keyValue.replace(/.(?=.{4})/g, '•')}
                    </span>
                    <KeyRound className="w-3.5 h-3.5 text-[#CFB53B]/70" />
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400">{row.provider}</td>
                <td className="px-6 py-4">
                  <a href={row.portalUrl} target="_blank" rel="noreferrer" className="text-[#CFB53B] hover:text-[#E0C64C] underline decoration-[#CFB53B]/30 hover:decoration-[#E0C64C] text-xs">
                    {row.portalUrl}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${row.status === 'Revoked' ? 'bg-[#DC143C]/20 text-[#DC143C]' : 'text-slate-400'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{row.lastUsed}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-300">
                    <button className="hover:text-[#CFB53B] transition-colors"><PenLine className="w-4 h-4" /></button>
                    <button 
                      onClick={() => onRevoke(row.id)}
                      className="hover:text-[#DC143C] transition-colors"
                      title="Revoke Key"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No keys found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 bg-[#161C2D]/30">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(1)} className="px-2 py-1 hover:text-white tracking-widest">|&lt;</button>
          <button onClick={handlePrev} className="px-2 py-1 hover:text-white tracking-widest">&lt;</button>
          <span className="font-medium text-slate-400">Page {currentPage} of {totalPages || 1}</span>
          <button onClick={handleNext} className="px-2 py-1 hover:text-white tracking-widest">&gt;</button>
          <button onClick={() => setCurrentPage(totalPages || 1)} className="px-2 py-1 hover:text-white tracking-widest">&gt;|</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#CFB53B]">{filteredKeys.length}</span>
          <span>Total Keys</span>
        </div>
      </div>
    </section>
  );
};

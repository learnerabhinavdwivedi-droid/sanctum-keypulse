import React, { useState } from 'react';
import { KeyRecord } from '../hooks/useKeyManager';
import { ArrowUpDown, KeyRound, MoreVertical, Link as LinkIcon } from 'lucide-react';

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
    k.mask.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <section className="bg-white border-4 border-black rounded-xl flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full">
      {/* Top Header & Search */}
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b-4 border-black bg-[#FFD200] gap-4">
        <h2 className="text-2xl font-black text-black uppercase tracking-widest whitespace-nowrap mr-4">Key Vault</h2>
        
        <div className="flex-1 w-full max-w-md mx-0 md:mx-4">
          <input 
            type="text" 
            placeholder="SEARCH VAULT..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full bg-white border-4 border-black text-black placeholder-gray-500 rounded-none px-4 py-3 font-black uppercase tracking-widest focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-black uppercase tracking-widest bg-white hover:bg-gray-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <ArrowUpDown className="w-5 h-5" />
            Sort
          </button>
          <button 
            onClick={onCreateSingleKey}
            className="flex-1 md:flex-none px-6 py-3 text-sm font-black text-white uppercase tracking-widest bg-[#FF4B91] hover:bg-[#D43F7A] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Create Key
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar min-h-0 bg-white">
        <table className="w-full text-left relative border-collapse">
          <thead className="bg-black text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Label</th>
              <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Key Info</th>
              <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Provider / Portal</th>
              <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Status & Scopes</th>
              <th className="px-4 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black text-center">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {currentKeys.length > 0 ? currentKeys.map((row) => (
              <tr key={row.id} className="hover:bg-[#00E5FF]/10 transition-colors group">
                <td className="px-6 py-5 text-black font-black uppercase tracking-wide border-r-4 border-black">
                  <div className="flex items-center justify-between gap-4">
                    <span>{row.label}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(row.label)}
                      className="p-1.5 border-2 border-black bg-white hover:bg-[#FFD200] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex-shrink-0"
                      title="Copy Env Name"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5 border-r-4 border-black bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-black font-bold tracking-widest text-sm bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {row.mask}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          if (row.rawKey && row.rawKey !== 'ERROR_DECRYPTING') {
                            navigator.clipboard.writeText(row.rawKey);
                          } else {
                            alert('Cannot copy key: ' + row.rawKey);
                          }
                        }}
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#00CD74] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex-shrink-0"
                        title="Copy Raw Key"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                      <KeyRound className="w-5 h-5 text-black flex-shrink-0" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-black font-bold uppercase tracking-wider border-r-4 border-black">
                  <div className="flex flex-col gap-2">
                    <span>{row.provider}</span>
                    {row.directPortalUrl && (
                      <a href={row.directPortalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-black text-white px-2 py-1 max-w-max border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
                        <LinkIcon className="w-3 h-3" />
                        PORTAL
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 border-r-4 border-black">
                  <div className="flex flex-col items-start gap-2">
                    <span className={`inline-block px-3 py-1 border-2 border-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${row.status === 'Revoked' ? 'bg-[#FF4B91] text-white' : 'bg-[#00CD74] text-black'}`}>
                      {row.status}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {row.accessProfile && row.accessProfile.map((scope, idx) => (
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-white ${row.status === 'Revoked' ? 'line-through text-gray-400 border-gray-400' : 'text-black'}`}>
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-center">
                  <button 
                    onClick={() => onRevoke(row.id)}
                    disabled={row.status === 'Revoked'}
                    className="p-1 border-2 border-transparent hover:border-black bg-transparent hover:bg-[#FF4B91] hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-[#FF4B91] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Revoke Key"
                  >
                    <MoreVertical className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-black font-black uppercase tracking-widest text-lg bg-gray-50">
                  No keys found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t-4 border-black bg-[#00E5FF] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">|&lt;</button>
          <button onClick={handlePrev} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&lt;</button>
          <span className="font-black text-black uppercase tracking-widest px-4 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button onClick={handleNext} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&gt;</button>
          <button onClick={() => setCurrentPage(totalPages || 1)} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&gt;|</button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-black text-[#FF4B91]">{filteredKeys.length}</span>
          <span className="font-black uppercase tracking-widest text-sm text-black">Total Keys</span>
        </div>
      </div>
    </section>
  );
};

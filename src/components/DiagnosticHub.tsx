import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { KeyRecord } from '../hooks/useKeyManager';
import { keyDirectory } from '../data/keyDirectory';

interface DiagnosticHubProps {
  keys?: KeyRecord[]; // Make keys optional since we aren't heavily using them here anymore
}

export const DiagnosticHub: React.FC<DiagnosticHubProps> = ({ keys = [] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState('');
  const [inputPayload, setInputPayload] = useState('');
  
  // Initialize selection when keys load
  React.useEffect(() => {
    if (keys.length > 0 && !selectedKeyId) {
      setSelectedKeyId(keys[0].id);
    }
  }, [keys, selectedKeyId]);

  const handleDiagnostic = async () => {
    if (!selectedKeyId) return;
    setIsRunning(true);
    
    try {
      const selectedKey = keys.find(k => k.id === selectedKeyId);
      const keyName = selectedKey ? selectedKey.label : 'Unknown Key';

      const res = await fetch(`/api/diagnostics?keyId=${selectedKeyId}`);
      const data = await res.json();

      if (res.ok) {
        alert(`DIAGNOSTIC RESULTS:\nKey: ${keyName}\nTarget: ${data.target}\nLatency: ${data.latencyMs}ms\nStatus: ${data.httpStatus}\nHealth: ${data.health}`);
      } else {
        alert(`DIAGNOSTIC FAILED:\nError: ${data.error}`);
      }
    } catch (e) {
      alert(`DIAGNOSTIC FAILED:\nNetwork Error`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-1 h-full flex flex-col">
      <h2 className="text-xl font-black text-black uppercase tracking-tight mb-6">Diagnostic Hub</h2>
      
      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">Target Key</label>
          <div className="relative">
            <select 
              value={selectedKeyId}
              onChange={(e) => setSelectedKeyId(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl px-4 py-3 text-sm font-bold text-black uppercase cursor-pointer focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
            >
              <option value="" disabled>Select a Key</option>
              {keys.map(k => (
                <option key={k.id} value={k.id}>{k.label} ({k.provider})</option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-black absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">Input Payload</label>
          <textarea
            value={inputPayload}
            onChange={(e) => setInputPayload(e.target.value)}
            placeholder="Paste your payload here..."
            rows={3}
            className="w-full bg-gray-100 border-2 border-black shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)] rounded-xl px-4 py-3 text-sm text-black font-mono font-bold tracking-widest focus:outline-none focus:bg-white transition-colors resize-none"
          />
        </div>

        <button 
          onClick={handleDiagnostic}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 text-sm font-black text-white uppercase bg-[#FF4B91] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:bg-gray-400 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1 rounded-xl transition-all"
        >
          {isRunning ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : null}
          {isRunning ? 'Running Scan...' : 'Run Full Diagnostic'}
        </button>
      </div>
    </section>
  );
};

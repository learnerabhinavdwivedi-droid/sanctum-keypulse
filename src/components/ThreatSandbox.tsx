import React, { useState } from 'react';
import { annaBridge } from '../lib/annaBridge';
import { KeyRecord } from '../hooks/useKeyManager';
import { ShieldAlert, Terminal, Loader2 } from 'lucide-react';

interface ThreatSandboxProps {
  vaultKeys: KeyRecord[];
}

export const ThreatSandbox: React.FC<ThreatSandboxProps> = ({ vaultKeys }) => {
  const [payload, setPayload] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!payload.trim()) return;
    
    setIsEvaluating(true);
    setReport(null);

    try {
      const activePermissions = vaultKeys
        .filter(k => k.status !== 'Revoked')
        .flatMap(k => k.accessProfile);
        
      const prompt = `You are a strict security evaluator. Analyze the following payload/request snippet:
\`\`\`
${payload}
\`\`\`
The current active vault permissions are: ${activePermissions.join(', ') || 'None'}.
Does this payload violate least-privilege principles or contain threat vectors? Return a short, high-impact breakdown of risks.`;

      const response = await annaBridge.llm.complete(prompt);
      setReport(response);
    } catch {
      setReport("Error: Failed to evaluate payload against threat models.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="mt-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col p-6">
      <div className="flex items-center gap-3 mb-4">
        <Terminal className="w-6 h-6 text-black" />
        <h3 className="text-xl font-black uppercase tracking-widest text-black">Payload Request Sandbox Tester</h3>
      </div>
      
      <p className="font-bold mb-4 text-sm uppercase tracking-wider text-black">
        Paste a mock code block or request path to evaluate against active vault permissions.
      </p>

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder="e.g. GET /api/v1/users/admin"
        className="w-full h-32 bg-gray-100 border-4 border-black p-4 font-mono text-sm focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors mb-4 text-black resize-none"
      />

      <button
        onClick={handleEvaluate}
        disabled={isEvaluating || !payload.trim()}
        className="bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full md:w-auto self-start"
      >
        {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
        {isEvaluating ? 'Evaluating...' : 'Evaluate Request Security'}
      </button>

      {report && (
        <div className="mt-6 bg-[#FF4B91] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
          <h4 className="font-black uppercase tracking-widest flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5" />
            Security Breakdown
          </h4>
          <div className="font-bold text-sm whitespace-pre-wrap leading-relaxed">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};

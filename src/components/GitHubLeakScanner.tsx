import React, { useState } from 'react';
import { useKeyManager } from '../hooks/useKeyManager';
import { Search, Loader2, ShieldAlert, GitBranch, AlertTriangle } from 'lucide-react';
import { annaBridge } from '../lib/annaBridge';

export const GitHubLeakScanner = () => {
  const [repoInput, setRepoInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'parsing' | 'detected' | 'error' | 'clean'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [leakedKeyData, setLeakedKeyData] = useState<Record<string, unknown> | null>(null);
  const { appendKey } = useKeyManager();

  const handleScan = async () => {
    if (!repoInput.trim()) return;

    setStatus('scanning');
    setErrorMessage('');
    setLeakedKeyData(null);

    // Mock scenario handling
    if (repoInput.trim() === 'test/mock-leak') {
      await new Promise(r => setTimeout(r, 1500));
      setStatus('parsing');
      await new Promise(r => setTimeout(r, 1500));
      setLeakedKeyData({
        provider: 'MOCK_STRIPE_API',
        rawKey: 'sk_test_mock_leak_example_999',
        scopes: ['payments:write', 'customers:read', 'invoices:read'],
        fileName: '.env'
      });
      setStatus('detected');
      return;
    }

    try {
      // 1. Extract owner/repo
      let owner = '';
      let repo = '';
      
      try {
        const urlObj = new URL(repoInput);
        if (urlObj.hostname === 'github.com') {
          const parts = urlObj.pathname.split('/').filter(Boolean);
          owner = parts[0];
          repo = parts[1];
        }
      } catch {
        // Not a URL, try shorthand
        const parts = repoInput.split('/');
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        }
      }

      if (!owner || !repo) {
        throw new Error('Invalid input format. Use owner/repo or a full GitHub URL.');
      }

      // 2. Fetch from GitHub API sequentially
      const filesToScan = ['.env', '.env.local', 'config.json'];
      let foundFileText = null;
      let foundFileName = '';

      for (const fileName of filesToScan) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`);
        if (response.ok) {
          const data = await response.json();
          // 3. Decode base64 content
          if (data.content && data.encoding === 'base64') {
            foundFileText = atob(data.content);
            foundFileName = fileName;
            break;
          }
        }
      }

      if (!foundFileText) {
        throw new Error('Repository inaccessible or file target not found.');
      }

      // 4. Anna LLM Processing
      setStatus('parsing');
      const prompt = `You are an automated OSINT credential leak parser. Analyze the following raw configuration file text retrieved from a public repository. 
Extract any active API keys, secret strings, or database passwords. Identify the provider name, mask the raw key signature, and infer 3 access scopes relevant to that token footprint.

Return ONLY a valid, minified JSON object matching this schema:
{
  "provider": "CLEAN_UPPERCASE_PROVIDER_NAME",
  "rawKey": "EXTRACTED_RAW_KEY_OR_SECRET",
  "scopes": ["scope1", "scope2", "scope3"],
  "fileName": "${foundFileName}"
}
If no secrets or credentials are found in the text, return exactly: { "error": "NO_SECRETS_FOUND" }

Text to analyze:
${foundFileText}`;

      const llmResponse = await annaBridge.llm.complete(prompt);
      
      let parsedData;
      try {
        parsedData = JSON.parse(llmResponse.trim().replace(/^```json/, '').replace(/```$/, ''));
      } catch {
        throw new Error('Failed to parse LLM extraction response.');
      }

      if (parsedData.error === "NO_SECRETS_FOUND") {
        setStatus('clean');
        setTimeout(() => setStatus('idle'), 4000);
        return;
      }

      // Found a leak
      setLeakedKeyData(parsedData);
      setStatus('detected');

    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred during the scan.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleIsolateAndSync = async () => {
    if (!leakedKeyData) return;

    let mask = '••••••••••••';
    if (leakedKeyData && typeof leakedKeyData.rawKey === 'string') {
      if (leakedKeyData.rawKey.length > 10) {
        mask = `${leakedKeyData.rawKey.substring(0, 6)}...${leakedKeyData.rawKey.substring(leakedKeyData.rawKey.length - 4)}`;
      } else if (leakedKeyData.rawKey.length > 2) {
        mask = `${leakedKeyData.rawKey.substring(0, 2)}...${leakedKeyData.rawKey.substring(leakedKeyData.rawKey.length - 2)}`;
      }
    }

    const newKey = {
      id: Math.random().toString(36).substring(7),
      label: `LEAKED_${String(leakedKeyData?.provider)}`,
      provider: String(leakedKeyData?.provider),
      mask,
      rawKey: String(leakedKeyData?.rawKey),
      status: 'Revoked', // Force revoked/degraded due to public exposure
      lastUsed: new Date().toISOString().split('T')[0],
      accessProfile: (leakedKeyData?.scopes as string[]) || ['api.read'],
      directPortalUrl: `https://github.com/${repoInput}`,
      quota: 100 // Maximum quota breach for immediate attention
    };

    await appendKey(newKey);
    setLeakedKeyData(null);
    setStatus('idle');
    setRepoInput('');
  };

  return (
    <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
      <div className="p-6 border-b-4 border-black flex items-center justify-between bg-[#FFD200]">
        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-black">
          <GitBranch className="w-6 h-6" />
          GitHub OSINT Leak Scanner
        </h3>
        <ShieldAlert className="w-6 h-6 text-black" />
      </div>

      <div className="p-8 flex flex-col gap-6">
        <p className="font-bold text-sm uppercase tracking-wider text-black">
          Scan public repositories for accidentally committed credentials.
        </p>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Enter public GitHub repo URL or shorthand (e.g., owner/repo)..." 
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            disabled={status !== 'idle' && status !== 'error' && status !== 'clean'}
            className="w-full bg-gray-100 border-4 border-black text-black placeholder-gray-500 px-4 py-3 pl-12 font-bold tracking-widest focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          />
        </div>

        {status === 'idle' || status === 'error' || status === 'clean' ? (
          <button 
            onClick={handleScan}
            disabled={!repoInput.trim()}
            className="bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform disabled:opacity-50 flex items-center justify-center gap-3 w-full"
          >
            <Search className="w-5 h-5" />
            Scan Repository Secrets
          </button>
        ) : null}

        {status === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-black" />
            <h4 className="font-black uppercase tracking-widest">Scanning Repository...</h4>
          </div>
        )}

        {status === 'parsing' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#00E5FF]" />
            <h4 className="font-black uppercase tracking-widest">Parsing Discovered Configurations...</h4>
          </div>
        )}

        {status === 'clean' && (
          <div className="bg-[#00CD74] border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-black uppercase tracking-widest">No Secrets Found in Target.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-[#FF4B91] border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-white uppercase tracking-widest">{errorMessage}</p>
          </div>
        )}

        {status === 'detected' && leakedKeyData && (
          <div className="bg-white border-4 border-[#FF4B91] shadow-[4px_4px_0px_0px_#FF4B91] p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-[#FF4B91] px-4 py-2 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-white" />
              <span className="font-black text-white uppercase tracking-widest">⚠️ EXPOSED IN PUBLIC REPO</span>
            </div>
            
            <div className="mt-12 mb-6">
              <h4 className="font-black text-xl mb-4 text-black uppercase">Critical Compromise Detected</h4>
              <div className="space-y-3 font-bold text-sm bg-gray-100 p-4 border-2 border-black">
                <p><span className="text-gray-500 uppercase">Provider:</span> {String(leakedKeyData.provider)}</p>
                <p><span className="text-gray-500 uppercase">File Origin:</span> {String(leakedKeyData.fileName)}</p>
                <p><span className="text-gray-500 uppercase">Exposed Key:</span> <span className="font-mono text-[#FF4B91]">{String(leakedKeyData.rawKey)}</span></p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {Array.isArray(leakedKeyData.scopes) && leakedKeyData.scopes.map((s: unknown, i: number) => (
                    <span key={i} className="text-[10px] uppercase border-2 border-black px-2 py-1 bg-[#FFD200] text-black">
                      {String(s)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleIsolateAndSync}
              className="w-full bg-[#FF4B91] text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform flex items-center justify-center gap-3"
            >
              <ShieldAlert className="w-5 h-5" />
              Isolate & Sync to Vault
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

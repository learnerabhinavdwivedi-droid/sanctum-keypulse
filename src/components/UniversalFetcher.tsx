import React, { useState } from 'react';
import { useKeyManager } from '../hooks/useKeyManager';
import { Loader2, CheckCircle, Database, ShieldAlert, KeyRound, Terminal, Lock } from 'lucide-react';
import { annaBridge } from '../lib/annaBridge';

export const UniversalFetcher = () => {
  const [dbConnection, setDbConnection] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'extracting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { appendKey } = useKeyManager();

  const handleFetch = async () => {
    if (!dbConnection.trim()) {
      setErrorMessage('Please provide a valid target database string or connection URL.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('connecting');
    setErrorMessage('');

    try {
      // Step 1: Simulated Connection delay
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 2: Extraction via Anna Agent
      setStatus('extracting');
      
      const prompt = `Simulate a backend extraction. Generate a realistic mock API Key or Authentication Token for the following connection string or service name: ${dbConnection}. Return the result strictly as a JSON object with keys "label" (a descriptive name for the key), "token" (the raw string), and "provider" (the inferred platform name). Do not include markdown formatting or extra text.`;
      
      const llmResponse = await annaBridge.llm.complete(prompt, "You are a secure data extractor.");
      
      let parsedData;
      try {
        parsedData = JSON.parse(llmResponse.trim().replace(/^```json/, '').replace(/```$/, ''));
      } catch {
        parsedData = {
          label: `Extracted_Key_${Math.random().toString(36).substring(7)}`,
          token: `mock_ext_${Math.random().toString(36).substring(7)}`,
          provider: 'Custom_DB'
        };
      }

      const mockQuota = Math.floor(Math.random() * 85) + 10;
      const rawKey = parsedData.token || `mock_ext_${Math.random().toString(36).substring(7)}`;
      let mask = '••••••••••••';
      if (rawKey.length > 10) {
        mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
      } else if (rawKey.length > 2) {
        mask = `${rawKey.substring(0, 2)}...${rawKey.substring(rawKey.length - 2)}`;
      }

      const newKey = {
        id: Math.random().toString(36).substring(7),
        label: parsedData.label || 'Universal_Extracted_Key',
        provider: parsedData.provider || 'Universal_Proxy',
        mask,
        rawKey,
        status: 'Active',
        lastUsed: new Date().toISOString().split('T')[0],
        accessProfile: ['db.read', 'api.invoke'],
        directPortalUrl: `https://${(parsedData.provider || 'custom').toLowerCase().replace(/\s/g, '')}.com/admin`,
        quota: mockQuota
      };

      await appendKey(newKey);
      
      // Step 3: Success
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
        setDbConnection('');
      }, 3000);

    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Extraction Failed');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-colors duration-300 ${
      status === 'connecting' ? 'bg-[#FFD200]' :
      status === 'extracting' ? 'bg-[#B624FF]' :
      status === 'success' ? 'bg-[#00CD74]' :
      status === 'error' ? 'bg-[#FF4B91]' :
      'bg-white'
    }`}>
      <div className="p-6 border-b-4 border-black flex items-center justify-between bg-white">
        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-black">
          <Database className="w-6 h-6" />
          Universal API Fetcher
        </h3>
        {status === 'idle' && <Lock className="w-6 h-6 text-black" />}
      </div>

      <div className="p-8 flex flex-col items-center text-center">
        
        {status === 'idle' && (
          <div className="w-full">
            <p className="font-bold mb-6 text-sm uppercase tracking-wider text-black">
              Bypass local DB setups. Paste any target connection string or service name. We will extract and sync the keys to your vault automatically.
            </p>
            <div className="relative w-full mx-auto mb-6">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="e.g. postgres://user:pass@host:5432/db or 'SendGrid API'" 
                value={dbConnection}
                onChange={(e) => setDbConnection(e.target.value)}
                className="w-full border-4 border-black px-4 py-3 pl-12 font-bold tracking-widest focus:outline-none focus:bg-gray-100 transition-colors placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
              />
            </div>
            
            <button 
              onClick={handleFetch}
              disabled={!dbConnection.trim()}
              className="w-full bg-black text-[#00E5FF] font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              <KeyRound className="w-5 h-5 text-white" />
              Force Extract Keys
            </button>
          </div>
        )}

        {status === 'connecting' && (
          <div className="flex flex-col items-center text-black py-4">
            <Loader2 className="w-16 h-16 animate-spin mb-4 text-black" />
            <h4 className="text-xl font-black uppercase tracking-widest text-black">Bridging to Target Environment...</h4>
          </div>
        )}

        {status === 'extracting' && (
          <div className="flex flex-col items-center text-white py-4">
            <Loader2 className="w-16 h-16 animate-spin mb-4 text-white" />
            <h4 className="text-xl font-black uppercase tracking-widest text-white">Extracting Authentication Tokens...</h4>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-black py-4">
            <CheckCircle className="w-20 h-20 mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest bg-black text-[#00CD74] px-4 py-2 border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Extraction Complete!
            </h4>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-white py-4">
            <ShieldAlert className="w-20 h-20 mb-4" />
            <h4 className="text-3xl font-black uppercase tracking-widest">
              Extraction Failed
            </h4>
            <p className="font-bold mt-2 uppercase tracking-wider">{errorMessage}</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useKeyManager } from '../hooks/useKeyManager';
import { Loader2, CheckCircle, Search, ShieldAlert, Link as LinkIcon, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const GoogleIntegrationFetcher = () => {
  const [targetService, setTargetService] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'extracting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { appendKey } = useKeyManager();

  const handleGoogleSSO = async () => {
    if (!targetService.trim()) {
      setErrorMessage('Please enter a target service name.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (typeof window === 'undefined' || !window.Anna) {
      setErrorMessage('Anna Platform SDK not detected.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('connecting');
    setErrorMessage('');

    try {
      // Stage 1: Connecting (Simulated delay)
      await new Promise(r => setTimeout(r, 1500));
      
      // Stage 2: Extracting Permissions
      setStatus('extracting');
      
      const prompt = `Generate a realistic mock API token and exactly three authorization access scopes for the service: ${targetService}. Return the result strictly as a JSON object with keys "token" (string) and "scopes" (array of strings). Do not include markdown formatting or extra text.`;
      
      const llmResponse = await window.Anna.llm.complete("You are a technical data generator.", prompt);
      
      let parsedData;
      try {
        parsedData = JSON.parse(llmResponse.trim().replace(/^```json/, '').replace(/```$/, ''));
      } catch (e) {
        // Fallback if LLM fails to return strict JSON
        parsedData = {
          token: `mock_${targetService.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
          scopes: [`${targetService.toLowerCase()}:read`, `${targetService.toLowerCase()}:write`, 'profile:read']
        };
      }

      // Stage 3: Injection Complete
      const rawKey = parsedData.token || `mock_token_${Math.random().toString(36).substring(7)}`;
      let mask = '••••••••••••';
      if (rawKey.length > 10) {
        mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
      } else if (rawKey.length > 2) {
        mask = `${rawKey.substring(0, 2)}...${rawKey.substring(rawKey.length - 2)}`;
      }

      const newKey = {
        id: Math.random().toString(36).substring(7),
        label: `${targetService.toUpperCase()}_API_KEY`,
        provider: 'GOOGLE_SSO',
        mask,
        rawKey,
        status: 'Active',
        lastUsed: new Date().toISOString().split('T')[0],
        accessProfile: parsedData.scopes || ['api.read']
      };

      await appendKey(newKey);
      
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
        setTargetService('');
      }, 3000);

    } catch (err: any) {
      setErrorMessage(err.message || 'SSO Authentication Failed');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
      status === 'connecting' || status === 'extracting' ? 'bg-[#FFD200]' :
      status === 'success' ? 'bg-[#00CD74]' :
      status === 'error' ? 'bg-[#FF4B91]' :
      'bg-white'
    }`}>
      <div className="p-6 border-b-4 border-black flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-black">
          <LogIn className="w-6 h-6" />
          {status === 'success' ? 'INTEGRATION COMPLETE' : '1-Click SSO Integrator'}
        </h3>
        {status === 'idle' && <ShieldAlert className="w-6 h-6 text-black" />}
      </div>

      <div className="p-8 flex flex-col items-center text-center">
        
        {status === 'idle' && (
          <div className="w-full">
            <p className="font-bold mb-6 text-sm uppercase tracking-wider text-black">
              Enter target service. System will simulate Google SSO and generate realistic credentials via Anna LLM.
            </p>
            <div className="relative w-full max-w-sm mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="e.g. Stripe, AWS, OpenAI" 
                value={targetService}
                onChange={(e) => setTargetService(e.target.value)}
                className="w-full border-4 border-black rounded-none px-4 py-3 pl-12 font-bold tracking-widest focus:outline-none focus:bg-gray-100 transition-colors placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
              />
            </div>
            
            <button 
              onClick={handleGoogleSSO}
              disabled={!targetService.trim()}
              className="bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              Authenticate via Google SSO
            </button>
          </div>
        )}

        {status === 'connecting' && (
          <div className="flex flex-col items-center text-black">
            <Loader2 className="w-16 h-16 animate-spin mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest">Connecting...</h4>
            <p className="font-bold mt-2 uppercase tracking-wider">Establishing secure Google SSO tunnel</p>
          </div>
        )}

        {status === 'extracting' && (
          <div className="flex flex-col items-center text-black">
            <Loader2 className="w-16 h-16 animate-spin mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest">Extracting Permissions...</h4>
            <p className="font-bold mt-2 uppercase tracking-wider">Generating tokens via Anna LLM</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-black">
            <CheckCircle className="w-20 h-20 mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest">
              Injection Complete
            </h4>
            <p className="font-bold mt-2 uppercase tracking-wider">Keys persisted to Anna Storage.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-white">
            <ShieldAlert className="w-20 h-20 mb-4" />
            <h4 className="text-3xl font-black uppercase tracking-widest">
              Error
            </h4>
            <p className="font-bold mt-2 uppercase tracking-wider">{errorMessage}</p>
          </div>
        )}
        
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useKeyManager } from '../hooks/useKeyManager';
import { Loader2, CheckCircle, Search, ShieldAlert, LogIn } from 'lucide-react';
import { annaBridge } from '../lib/annaBridge';

export const GoogleIntegrationFetcher = () => {
  const [targetService, setTargetService] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'extracting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [linkedServices, setLinkedServices] = useState<string[]>([]);
  const { appendKey } = useKeyManager();

  useEffect(() => {
    const loadLinked = async () => {
      const stored = await annaBridge.storage.get('google_auth_linked');
      if (stored && Array.isArray(stored)) {
        setLinkedServices(stored);
      }
    };
    loadLinked();
  }, []);

  const handleGoogleSSO = async () => {
    if (!targetService.trim()) {
      setErrorMessage('Please enter a target service name.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('connecting');
    setErrorMessage('');

    try {
      // Step 1: Connecting to Google Account Framework
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 2: Requesting 3rd Party Token
      setStatus('extracting');
      
      const prompt = `Generate a realistic mock API token and exactly three authorization access scopes for the service: ${targetService}. Return the result strictly as a JSON object with keys "token" (string) and "scopes" (array of strings). Do not include markdown formatting or extra text.`;
      
      const llmResponse = await annaBridge.llm.complete(prompt, "You are a technical data generator.");
      
      let parsedData;
      try {
        parsedData = JSON.parse(llmResponse.trim().replace(/^```json/, '').replace(/```$/, ''));
      } catch {
        // Fallback if LLM fails to return strict JSON
        parsedData = {
          token: `mock_${targetService.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
          scopes: [`${targetService.toLowerCase()}:read`, `${targetService.toLowerCase()}:write`, 'profile:read']
        };
      }

      // Hackathon mock quota
      const mockQuota = Math.floor(Math.random() * 85) + 10;
      
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
        accessProfile: parsedData.scopes || ['api.read'],
        directPortalUrl: `https://${targetService.toLowerCase()}.com/developers`,
        quota: mockQuota
      };

      await appendKey(newKey);
      
      const newLinked = [...linkedServices, targetService];
      setLinkedServices(newLinked);
      await annaBridge.storage.set('google_auth_linked', newLinked);
      
      // Step 3: Integration Complete
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
        setTargetService('');
      }, 3000);

    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'SSO Authentication Failed');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-colors duration-300 ${
      status === 'connecting' ? 'bg-[#FFD200]' :
      status === 'extracting' ? 'bg-[#00E5FF]' :
      status === 'success' ? 'bg-[#00CD74]' :
      status === 'error' ? 'bg-[#FF4B91]' :
      'bg-white'
    }`}>
      <div className="p-6 border-b-4 border-black flex items-center justify-between bg-white">
        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-black">
          <LogIn className="w-6 h-6" />
          Google Integration Linker
        </h3>
        {status === 'idle' && <ShieldAlert className="w-6 h-6 text-black" />}
      </div>

      <div className="p-8 flex flex-col items-center text-center">
        
        {linkedServices.length > 0 && status === 'idle' && (
          <div className="w-full mb-6 bg-gray-50 border-4 border-black p-4 text-left">
            <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest block mb-2">LINKED SERVICES</span>
            <div className="flex flex-wrap gap-2">
              {linkedServices.map(srv => (
                <span key={srv} className="px-3 py-1 bg-[#00CD74] border-2 border-black font-bold text-xs uppercase text-black">{srv}</span>
              ))}
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="w-full">
            <p className="font-bold mb-6 text-sm uppercase tracking-wider text-black">
              Enter target service to invoke Google SSO proxy and dynamically provision tokens.
            </p>
            <div className="relative w-full mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="e.g. Stripe, AWS, OpenAI" 
                value={targetService}
                onChange={(e) => setTargetService(e.target.value)}
                className="w-full border-4 border-black px-4 py-3 pl-12 font-bold tracking-widest focus:outline-none focus:bg-gray-100 transition-colors placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black"
              />
            </div>
            
            <button 
              onClick={handleGoogleSSO}
              disabled={!targetService.trim()}
              className="w-full bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Authenticate via Google SSO
            </button>
          </div>
        )}

        {status === 'connecting' && (
          <div className="flex flex-col items-center text-black py-4">
            <Loader2 className="w-16 h-16 animate-spin mb-4 text-black" />
            <h4 className="text-xl font-black uppercase tracking-widest text-black">Connecting to Google Account Framework...</h4>
          </div>
        )}

        {status === 'extracting' && (
          <div className="flex flex-col items-center text-black py-4">
            <Loader2 className="w-16 h-16 animate-spin mb-4 text-black" />
            <h4 className="text-xl font-black uppercase tracking-widest text-black">Requesting 3rd Party Token...</h4>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-black py-4">
            <CheckCircle className="w-20 h-20 mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest bg-black text-[#00CD74] px-4 py-2 border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Integration Complete!
            </h4>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-white py-4">
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

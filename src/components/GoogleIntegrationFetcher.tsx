import React, { useState, useEffect } from 'react';
import { KeyRecord } from '../hooks/useKeyManager';
import { Loader2, CheckCircle, Search, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface GoogleIntegrationFetcherProps {
  onIntegrationSuccess?: (key: KeyRecord) => void;
}

type FetchStatus = 'idle' | 'redirecting' | 'success' | 'error';

export const GoogleIntegrationFetcher: React.FC<GoogleIntegrationFetcherProps> = ({ onIntegrationSuccess }) => {
  const [targetService, setTargetService] = useState('');
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const integrationState = searchParams.get('integration');
    const errorState = searchParams.get('error');

    if (integrationState === 'success') {
      setStatus('success');
      // In a real app we'd fetch the new key list, but for now we rely on the parent refresh
      setTimeout(() => {
        setStatus('idle');
        router.replace('/'); // clear query params
      }, 4000);
    } else if (errorState) {
      setStatus('error');
      setErrorMessage(errorState);
      setTimeout(() => {
        setStatus('idle');
        router.replace('/'); // clear query params
      }, 4000);
    }
  }, [searchParams, router]);

  const handleFetch = () => {
    if (!targetService.trim()) return;
    
    setStatus('redirecting');
    setErrorMessage('');
    
    // Redirect to real OAuth authorize endpoint
    window.location.href = `/api/auth/authorize?provider=${encodeURIComponent(targetService)}`;
  };

  return (
    <div className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
      status === 'redirecting' ? 'bg-[#FFD200]' :
      status === 'success' ? 'bg-[#00CD74]' :
      status === 'error' ? 'bg-[#FF4B91]' :
      'bg-white'
    }`}>
      <div className="p-6 border-b-4 border-black flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <LinkIcon className="w-6 h-6" />
          {status === 'success' ? 'INTEGRATION ESTABLISHED' : '1-Click API Fetcher'}
        </h3>
        {status === 'idle' && <ShieldAlert className="w-6 h-6" />}
      </div>

      <div className="p-8 flex flex-col items-center text-center">
        
        {status === 'idle' && (
          <div className="w-full">
            <p className="font-bold mb-6 text-sm uppercase tracking-wider">
              Securely connect to external providers to synchronize your API keys into the vault.
            </p>
            <div className="relative w-full max-w-sm mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="e.g. STRIPE, OPENAI, GITHUB" 
                value={targetService}
                onChange={(e) => setTargetService(e.target.value)}
                className="w-full border-4 border-black rounded-none px-4 py-3 pl-12 font-bold uppercase tracking-widest focus:outline-none focus:bg-gray-100 transition-colors placeholder-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            
            <button 
              onClick={handleFetch}
              disabled={!targetService.trim()}
              className="bg-black text-white font-black uppercase tracking-widest px-8 py-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect Provider
            </button>
          </div>
        )}

        {status === 'redirecting' && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-16 h-16 animate-spin mb-4" />
            <h4 className="text-2xl font-black uppercase tracking-widest">Establishing Connection...</h4>
            <p className="font-bold mt-2 uppercase tracking-wider">Negotiating with {targetService} Identity Gateway</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 mb-4 text-black" />
            <h4 className="text-2xl font-black uppercase tracking-widest">
              Key Synced Successfully
            </h4>
            <p className="font-bold mt-2 uppercase tracking-wider">Returning to your secure vault.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <ShieldAlert className="w-20 h-20 mb-4 text-white" />
            <h4 className="text-2xl font-black uppercase tracking-widest text-white">
              Integration Failed
            </h4>
            <p className="font-bold mt-2 uppercase tracking-wider text-white max-w-xs">{errorMessage}</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

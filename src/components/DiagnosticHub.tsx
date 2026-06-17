import React, { useState } from 'react';
import { ChevronDown, Loader2, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { KeyRecord } from '../hooks/useKeyManager';
import { annaBridge } from '../lib/annaBridge';

const GLOBAL_APIS = [
  "Stripe", "OpenAI", "AWS IAM", "GitHub", "Twilio", "SendGrid", "Datadog", "Supabase", "Vercel", "Anthropic",
  "Mailchimp", "Okta", "Auth0", "Plaid", "Slack", "Discord", "Shopify", "Salesforce", "HubSpot", "Zendesk",
  "Google Cloud", "Azure", "DigitalOcean", "Heroku", "Cloudflare", "Fastly", "Netlify", "Firebase", "MongoDB Atlas", "PlanetScale",
  "Redis Cloud", "Neon", "Snowflake", "BigQuery", "Sentry", "New Relic", "Splunk", "PagerDuty", "Postmark", "Resend",
  "Algolia", "Meilisearch", "Pinecone", "Milvus", "Weaviate", "Hugging Face", "Cohere", "Mistral", "ElevenLabs", "Replicate"
];

interface DiagnosticHubProps {
  keys?: KeyRecord[];
}

interface DiagnosticResult {
  keyId: string;
  target: string;
  latencyMs: number;
  httpStatus: number;
  health: string;
  timestamp: string;
}

export const DiagnosticHub: React.FC<DiagnosticHubProps> = ({ keys = [] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedKeyIdState, setSelectedKeyIdState] = useState('');
  const selectedKeyId = selectedKeyIdState || (keys.length > 0 ? keys[0].id : '');
  const setSelectedKeyId = setSelectedKeyIdState;
  const [inputPayload, setInputPayload] = useState('');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');



  const handleDiagnostic = async () => {
    if (!selectedKeyId) return;
    setIsRunning(true);
    setResult(null);
    setError('');

    try {
      await new Promise(r => setTimeout(r, 800));
      
      let provider = 'Unknown API';
      if (selectedKeyId.startsWith('global_')) {
        provider = selectedKeyId.replace('global_', '');
      } else {
        const keyRecord = keys.find(k => k.id === selectedKeyId);
        if (keyRecord) provider = keyRecord.provider;
      }
      
      let httpStatus = 200;
      let latencyMs = Math.floor(Math.random() * 300) + 45;
      const target = `api.${provider.toLowerCase().replace(/\s+/g, '')}.com`;
      let health = 'Optimal';

      if (inputPayload.trim()) {
        const prompt = `Simulate an API diagnostic response for a request to ${provider}. 
The user payload is: ${inputPayload}
If the payload looks malicious or malformed, return HTTP 403 or 400. Otherwise return 200.
Return strictly a JSON object with keys: "httpStatus" (number), "latencyMs" (number), "health" (string: 'Optimal', 'Rate Limited', or 'Degraded'). Do not include markdown.`;
        
        try {
          const llmResponse = await annaBridge.llm.complete(prompt);
          const parsed = JSON.parse(llmResponse.trim().replace(/^```json/, '').replace(/```$/, ''));
          if (parsed.httpStatus) httpStatus = parsed.httpStatus;
          if (parsed.latencyMs) latencyMs = parsed.latencyMs;
          if (parsed.health) health = parsed.health;
        } catch {
          httpStatus = 400;
          health = 'Degraded';
        }
      } else {
        const hash = selectedKeyId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        latencyMs = (hash % 400) + 45;
        const httpStatuses = [200, 200, 200, 200, 201, 429, 503];
        httpStatus = httpStatuses[hash % httpStatuses.length];
        health = httpStatus === 200 || httpStatus === 201 ? 'Optimal' : httpStatus === 429 ? 'Rate Limited' : 'Degraded';
      }

      setResult({
        keyId: selectedKeyId,
        target,
        latencyMs,
        httpStatus,
        health,
        timestamp: new Date().toISOString()
      });
    } catch {
      setError('Network error — could not run local diagnostics.');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status === 200 || status === 201) return 'bg-[#00CD74] text-black';
    if (status === 429) return 'bg-[#FFD200] text-black';
    return 'bg-[#FF4B91] text-white';
  };

  const getHealthIcon = (health: string) => {
    if (health === 'Optimal') return <CheckCircle className="w-5 h-5 text-[#00CD74]" />;
    if (health === 'Rate Limited') return <AlertTriangle className="w-5 h-5 text-[#FFD200]" />;
    return <AlertTriangle className="w-5 h-5 text-[#FF4B91]" />;
  };

  return (
    <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-1 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#FF4B91] border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Diagnostic Hub
        </h2>
        {isRunning && <Loader2 className="w-5 h-5 text-white animate-spin" />}
      </div>

      <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
        {/* Key selector */}
        <div>
          <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">
            Target Key
          </label>
          <div className="relative">
            <select
              value={selectedKeyId}
              onChange={e => setSelectedKeyId(e.target.value)}
              className="w-full appearance-none bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 text-sm font-bold text-black uppercase cursor-pointer focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
            >
              <option value="" disabled>Select a Target API</option>
              {keys.length > 0 && (
                <optgroup label="Your Vault Keys">
                  {keys.map(k => (
                    <option key={k.id} value={k.id}>{k.label} ({k.provider})</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Global Sandbox APIs">
                {GLOBAL_APIS.map(api => (
                  <option key={`global_${api}`} value={`global_${api}`}>{api}</option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-5 h-5 text-black absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payload input */}
        <div>
          <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">
            Input Payload <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={inputPayload}
            onChange={e => setInputPayload(e.target.value)}
            placeholder="Paste your request payload here..."
            rows={3}
            className="w-full bg-gray-100 border-4 border-black px-4 py-3 text-sm text-black font-mono font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleDiagnostic}
          disabled={isRunning || !selectedKeyId}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-black text-white uppercase bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,75,145,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,75,145,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(255,75,145,1)] transition-all"
        >
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {isRunning ? 'Running Diagnostic...' : 'Run Full Diagnostic'}
        </button>

        {/* Error state */}
        {error && (
          <div className="bg-[#FF4B91] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-white uppercase tracking-widest text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="bg-black px-4 py-3 flex items-center gap-2">
              {getHealthIcon(result.health)}
              <span className="font-black text-white uppercase tracking-widest text-sm">Diagnostic Results</span>
            </div>
            <div className="bg-white divide-y-4 divide-black">
              {[
                { label: 'Target Endpoint', value: result.target },
                { label: 'Latency', value: `${result.latencyMs}ms` },
                { label: 'Health', value: result.health },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="font-black uppercase tracking-widest text-xs text-black/60">{row.label}</span>
                  <span className="font-mono font-black text-black">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-black uppercase tracking-widest text-xs text-black/60">HTTP Status</span>
                <span className={`px-3 py-1 border-2 border-black font-black text-xs tracking-widest ${getStatusColor(result.httpStatus)}`}>
                  {result.httpStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !error && !isRunning && !selectedKeyId && (
          <div className="flex-1 flex items-center justify-center border-4 border-dashed border-black p-8 text-center">
            <p className="font-black uppercase tracking-widest text-black/40 text-sm">
              Select an API target to run diagnostics
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Book, ShieldAlert, Zap, Cpu, Key, Activity, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  const [identity, setIdentity] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('core');

  useEffect(() => {
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && window.Anna?.identity?.id) {
        setIdentity(window.Anna.identity.id);
      } else {
        setIdentity('dev-user-local');
      }
    };
    initIdentity();
  }, []);

  const sections = [
    { id: 'core', title: 'THE CORE (VAULT)', icon: <Key className="w-5 h-5" /> },
    { id: 'intel', title: 'THE INTEL (REPORTS)', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 'forge', title: 'THE FORGE (FETCHER)', icon: <Zap className="w-5 h-5" /> },
    { id: 'archive', title: 'THE ARCHIVE (HUB)', icon: <Book className="w-5 h-5" /> },
    { id: 'gateway', title: 'THE GATEWAY (DIAG)', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout identity={identity}>
      <div className="h-full flex gap-8">
        
        {/* Index Sidebar */}
        <div className="w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-black text-white border-4 border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_#00E5FF]">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Operator's Manual
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mt-2">Classified Infrastructure Documentation</p>
          </div>

          <div className="flex-1 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 font-black uppercase text-sm border-2 rounded-lg transition-all ${
                  activeSection === sec.id 
                    ? 'bg-[#FFD200] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-2' 
                    : 'bg-white border-transparent hover:border-black hover:bg-gray-100'
                }`}
              >
                {sec.icon}
                {sec.title}
                {activeSection === sec.id && <ArrowRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            
            {activeSection === 'core' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block bg-black text-white px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest">Chapter 01</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Core: Key Vault Operations</h1>
                
                <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
                  The Key Vault is the hardened nucleus of the KeyPulse architecture. It is built upon bulletproof functional state loops bound directly to the <code className="bg-gray-200 px-2 py-1 rounded text-black font-black">window.Anna.storage</code> operational bridge.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#FAF8F5] border-4 border-black p-6 rounded-xl">
                    <h3 className="text-xl font-black uppercase mb-4 text-[#00CD74]">Access Profiling</h3>
                    <p className="font-bold text-sm">
                      Keys are not just strings; they are deeply permissioned assets. Every generated key is strictly bound to an authorization array (e.g. <span className="font-mono bg-white border-2 border-black px-1">drive.readonly</span>). These are rendered as tactile Deep Blue and Antique Gold pill badges directly in your Vault.
                    </p>
                  </div>
                  <div className="bg-[#FAF8F5] border-4 border-black p-6 rounded-xl">
                    <h3 className="text-xl font-black uppercase mb-4 text-[#FF4B91]">Tactile Revocation</h3>
                    <p className="font-bold text-sm">
                      Revoking a key does not merely delete it. It provides visual, cryptographic proof of termination. Active access pills instantly degrade into a muted grey tone crossed by a harsh strikethrough, confirming that the permissions have been forcefully severed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'intel' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block bg-[#00CD74] text-black px-4 py-1 mb-6 border-2 border-black rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 02</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Intel: Global Reports</h1>
                
                <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
                  The Reports dashboard isn't a static screen—it is a live tactical feed. Upon initialization, it triggers a Brutalist deep scan, visually pulsing through your vault.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 border-l-8 border-[#FFD200] pl-6 py-2">
                    <h3 className="text-2xl font-black uppercase min-w-[200px]">Deterministic Math Engine</h3>
                    <p className="font-bold text-sm">Unlike randomized mocks, our analyzer mathematically hashes your actual key lengths and character codes to generate consistent latency and health metrics. An 80-character AWS key will always yield the exact same specific sub-100ms latency score across renders.</p>
                  </div>
                  <div className="flex items-start gap-4 border-l-8 border-[#B624FF] pl-6 py-2">
                    <h3 className="text-2xl font-black uppercase min-w-[200px]">Anna AI Integration</h3>
                    <p className="font-bold text-sm">The dashboard identifies your absolute worst-performing key constraint and injects the raw telemetry straight into <code className="bg-gray-200 px-2 py-1 rounded text-black font-black">window.Anna.llm.complete</code>. The AI synthesizes this data to generate a brutalist, strategic advisory on how to scale your infrastructure, rendered dynamically at the top of your reports feed.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'forge' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block bg-[#00E5FF] text-black px-4 py-1 mb-6 border-2 border-black rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 03</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Forge: API Fetcher</h1>
                
                <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
                  Located at the <code className="bg-gray-200 px-2 py-1 rounded text-black font-black">/api-fetcher</code> dedicated routing sector, this module simulates real-world SSO authentication flows.
                </p>

                <div className="bg-black text-white border-4 border-white shadow-[8px_8px_0px_0px_#000000] p-8 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-32 h-32" /></div>
                  <h3 className="text-2xl font-black uppercase mb-4 relative z-10 text-[#FFD200]">Cross-Route Injection</h3>
                  <p className="font-bold text-sm relative z-10 mb-4">
                    Type a target service and authorize it via the simulated Google SSO loop. The system manages the multi-stage connection state (Idle → Authorizing → Fetching → Success).
                  </p>
                  <p className="font-bold text-sm relative z-10">
                    Once the cryptographic signature is acquired, it hooks into the <code className="text-[#00E5FF]">useKeyManager</code> loop and silently injects the new token into your vault state. Return to the Dashboard, and your key will be sitting flawlessly in the vault. No reloads. No friction.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'archive' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block bg-[#B624FF] text-white px-4 py-1 mb-6 border-2 border-black rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 04</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Archive: Integrations Hub</h1>
                
                <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
                  The Integrations Hub (`/about-keys`) acts as the directory listing for all premier services available to the Sanctum platform.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {['STRIPE', 'OPENAI', 'AWS', 'GITHUB', 'TWILIO', 'ANTHROPIC'].map(name => (
                    <div key={name} className="border-4 border-black p-4 text-center font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {name}
                    </div>
                  ))}
                </div>
                <p className="font-bold text-sm mt-8">
                  Rendered in Stark White with massive borders and stark black shadows, this grid outlines the specific permission hierarchies controlled by each provider, routing you directly toward the configuration matrix.
                </p>
              </div>
            )}

            {activeSection === 'gateway' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-block bg-[#FF4B91] text-white px-4 py-1 mb-6 border-2 border-black rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 05</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Gateway: Diagnostics</h1>
                
                <p className="text-lg font-bold text-gray-700 mb-8 leading-relaxed">
                  Before routing traffic, the system validates the operational status of over 40 distinct regional APIs and Gateways.
                </p>

                <div className="bg-[#FAF8F5] border-4 border-black p-8 rounded-xl shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <h3 className="text-2xl font-black uppercase mb-4 text-black">Live Telemetry Simulation</h3>
                  <p className="font-bold text-sm text-gray-800">
                    The diagnostics page renders a massive 6-column grid detailing edge endpoints. By simulating network latency loops, it flashes dynamically through Status IDs ranging from 200 OK (Lime Green) to 503 Overload (Crimson Pink). Clicking an endpoint locks it in as the primary global target for your vault requests.
                  </p>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

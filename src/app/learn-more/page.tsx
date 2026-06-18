"use client";

import React from "react";
import { ShieldCheck, Cpu, Key, ShieldAlert, Zap, Book, Activity, ArrowRight } from "lucide-react";

export default function LearnMorePage() {
  const sections = [
    { id: 'core', title: 'THE CORE', desc: 'Key Vault Operations', icon: <Key className="w-4 h-4" /> },
    { id: 'intel', title: 'THE INTEL', desc: 'Global Reports', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'forge', title: 'THE FORGE', desc: 'API Fetcher', icon: <Zap className="w-4 h-4" /> },
    { id: 'archive', title: 'THE ARCHIVE', desc: 'Integrations Hub', icon: <Book className="w-4 h-4" /> },
    { id: 'gateway', title: 'THE GATEWAY', desc: 'Diagnostics', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black font-sans selection:bg-[#FFD200] selection:text-black pb-20">
      
      {/* =======================
          YELLOW NAV BAR
          ======================= */}
      <nav className="w-full bg-[#FFD200] border-b-4 border-black px-6 py-4 flex items-center justify-between z-50 sticky top-0 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <a href="./index.html" className="font-black text-xl tracking-tighter uppercase text-black">Sanctum</a>
            <span className="font-bold text-[10px] tracking-widest uppercase text-black">KeyPulse</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="./index.html#features" className="px-5 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#00E5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Features</a>
          <a href="./index.html#compare" className="px-5 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#FF4B91] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Comparison</a>
          <a href="./index.html" className="px-6 py-2 bg-black text-white border-4 border-black font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Back to Login</a>
        </div>
      </nav>

      {/* =======================
          MAIN CONTENT
          ======================= */}
      <main className="max-w-7xl mx-auto px-6 pt-16 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Table of Contents Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 lg:sticky top-32">
          <div className="bg-black text-white border-4 border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_#00E5FF] mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Operator&apos;s Manual
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mt-2">Classified Infrastructure Documentation</p>
          </div>

          <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-2">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-3 w-full px-4 py-3 font-black uppercase text-xs border-2 border-transparent rounded-lg transition-all hover:border-black hover:bg-gray-100 group"
              >
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                  {sec.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-black group-hover:text-black">{sec.title}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{sec.desc}</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </aside>

        {/* Document Content Flow */}
        <article className="flex-1 space-y-24">
          
          {/* Chapter 01: The Core */}
          <section id="core" className="scroll-mt-32">
            <div className="inline-block bg-black text-white px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest">Chapter 01</div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">The Core:<br/>Key Vault Operations</h1>
            
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-12 leading-relaxed">
              The Key Vault is the hardened nucleus of the KeyPulse architecture. It is built upon bulletproof functional state loops bound directly to the <code className="bg-[#FFD200] border-2 border-black px-2 py-1 rounded text-black font-black text-sm uppercase">window.Anna.storage</code> operational bridge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_#000000]">
                <h3 className="text-2xl font-black uppercase mb-4 text-black border-b-4 border-black pb-4 inline-block">Access Profiling</h3>
                <p className="font-bold text-base leading-relaxed text-gray-700">
                  Keys are not just strings; they are deeply permissioned assets. Every generated key is strictly bound to an authorization array (e.g. <code className="bg-gray-200 border-2 border-black px-1 font-mono text-xs text-black">drive.readonly</code>). These are rendered as tactile Deep Blue and Antique Gold pill badges directly in your Vault.
                </p>
              </div>
              <div className="bg-white border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_#000000]">
                <h3 className="text-2xl font-black uppercase mb-4 text-black border-b-4 border-black pb-4 inline-block">Tactile Revocation</h3>
                <p className="font-bold text-base leading-relaxed text-gray-700">
                  Revoking a key does not merely delete it. It provides visual, cryptographic proof of termination. Active access pills instantly degrade into a muted grey tone crossed by a harsh strikethrough, confirming that the permissions have been forcefully severed.
                </p>
              </div>
            </div>
          </section>

          {/* Chapter 02: The Intel */}
          <section id="intel" className="scroll-mt-32">
            <div className="inline-block bg-[#00CD74] text-black border-2 border-black px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 02</div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">The Intel:<br/>Global Reports</h1>
            
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-12 leading-relaxed">
              The Reports dashboard isn&apos;t a static screen—it is a live tactical feed. Upon initialization, it triggers a Brutalist deep scan, visually pulsing through your vault.
            </p>

            <div className="space-y-8 bg-white border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col md:flex-row items-start gap-6 border-b-4 border-black pb-8">
                <div className="w-16 h-16 shrink-0 bg-[#FFD200] border-4 border-black rounded-full flex items-center justify-center font-black text-xl">1</div>
                <div>
                  <h3 className="text-3xl font-black uppercase mb-4">Deterministic Math Engine</h3>
                  <p className="font-bold text-base text-gray-700 leading-relaxed">Unlike randomized mocks, our analyzer mathematically hashes your actual key lengths and character codes to generate consistent latency and health metrics. An 80-character AWS key will always yield the exact same specific sub-100ms latency score across renders.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6 pt-4">
                <div className="w-16 h-16 shrink-0 bg-[#FF4B91] text-white border-4 border-black rounded-full flex items-center justify-center font-black text-xl">2</div>
                <div>
                  <h3 className="text-3xl font-black uppercase mb-4">Anna AI Integration</h3>
                  <p className="font-bold text-base text-gray-700 leading-relaxed">The dashboard identifies your absolute worst-performing key constraint and injects the raw telemetry straight into <code className="bg-[#00E5FF] px-2 py-1 border-2 border-black rounded text-black font-black text-xs">window.Anna.llm.complete</code>. The AI synthesizes this data to generate a brutalist, strategic advisory on how to scale your infrastructure, rendered dynamically at the top of your reports feed.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 03: The Forge */}
          <section id="forge" className="scroll-mt-32">
            <div className="inline-block bg-[#00E5FF] text-black border-2 border-black px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 03</div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">The Forge:<br/>API Fetcher</h1>
            
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-12 leading-relaxed">
              Located at the <code className="bg-black px-2 py-1 rounded text-white font-black text-sm uppercase">/api-fetcher</code> dedicated routing sector, this module simulates real-world SSO authentication flows.
            </p>

            <div className="bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_#FFD200] p-10 md:p-14 rounded-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12"><Zap className="w-64 h-64 text-[#FFD200]" /></div>
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 relative z-10 text-[#FFD200] tracking-tighter">Cross-Route Injection</h3>
              <p className="font-bold text-lg relative z-10 mb-6 max-w-2xl text-gray-300">
                Type a target service and authorize it via the simulated Google SSO loop. The system manages the multi-stage connection state (Idle → Authorizing → Fetching → Success).
              </p>
              <div className="w-full max-w-2xl h-1 bg-gray-800 my-8 relative z-10"></div>
              <p className="font-bold text-lg relative z-10 max-w-2xl">
                Once the cryptographic signature is acquired, it hooks into the <code className="text-[#00E5FF] bg-white/10 px-2 py-1 rounded">useKeyManager</code> loop and silently injects the new token into your vault state. Return to the Dashboard, and your key will be sitting flawlessly in the vault. No reloads. No friction.
              </p>
            </div>
          </section>

          {/* Chapter 04: The Archive */}
          <section id="archive" className="scroll-mt-32">
            <div className="inline-block bg-[#FF4B91] text-white border-2 border-black px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 04</div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">The Archive:<br/>Integrations Hub</h1>
            
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-12 leading-relaxed max-w-3xl">
              The Integrations Hub <code className="bg-white border-2 border-black text-black px-2 py-1 rounded text-sm uppercase">/about-keys</code> acts as the directory listing for all premier services available to the Sanctum platform.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {['STRIPE', 'OPENAI', 'AWS', 'GITHUB', 'TWILIO', 'ANTHROPIC'].map((name, i) => (
                <div key={name} className={`bg-white border-4 border-black p-6 md:p-8 text-center font-black uppercase text-xl md:text-2xl tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default ${i % 2 === 0 ? 'transform rotate-1' : 'transform -rotate-1'}`}>
                  {name}
                </div>
              ))}
            </div>
            <p className="font-bold text-base md:text-lg text-gray-800 leading-relaxed max-w-3xl p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Rendered in Stark White with massive borders and stark black shadows, this grid outlines the specific permission hierarchies controlled by each provider, routing you directly toward the configuration matrix.
            </p>
          </section>

          {/* Chapter 05: The Gateway */}
          <section id="gateway" className="scroll-mt-32">
            <div className="inline-block bg-[#FFD200] text-black border-2 border-black px-4 py-1 mb-6 rounded-full font-black uppercase text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Chapter 05</div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">The Gateway:<br/>Diagnostics</h1>
            
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-12 leading-relaxed">
              Before routing traffic, the system validates the operational status of over 40 distinct regional APIs and Gateways.
            </p>

            <div className="bg-[#00CD74] border-8 border-black p-10 md:p-14 rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-white border-4 border-black px-4 py-2 inline-block mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black uppercase text-black">Live Telemetry Simulation</h3>
              </div>
              <p className="font-bold text-lg md:text-xl text-black leading-relaxed max-w-3xl">
                The diagnostics page renders a massive 6-column grid detailing edge endpoints. By simulating network latency loops, it flashes dynamically through Status IDs ranging from <span className="bg-black text-[#00CD74] px-2 py-1 mx-1 font-black uppercase rounded text-sm">200 OK (Lime Green)</span> to <span className="bg-black text-[#FF4B91] px-2 py-1 mx-1 font-black uppercase rounded text-sm">503 Overload (Crimson Pink)</span>. Clicking an endpoint locks it in as the primary global target for your vault requests.
              </p>
            </div>
          </section>

        </article>
      </main>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { 
  ShieldCheck, 
  KeyRound, 
  Search, 
  ActivitySquare, 
  BookOpen, 
  FileText, 
  Settings,
  HelpCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function OperatorManualPage() {
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && (window as any).Anna?.identity?.id) {
        setIdentity((window as any).Anna.identity.id);
      } else {
        setIdentity('Anna Platform Dev Session');
      }
    };
    initIdentity();
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-[#FAF8F5] min-h-full pb-12">
        
        {/* Header */}
        <div className="mb-10 border-b-8 border-black pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#00E5FF] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
              <HelpCircle className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-black uppercase tracking-tighter">Operator Manual</h2>
              <p className="text-lg font-bold text-gray-600 uppercase mt-2 tracking-widest">
                Comprehensive KeyPulse Systems Guide
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-12 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#00CD74]" />
            1. System Architecture
          </h3>
          <div className="prose max-w-none text-black font-medium leading-relaxed">
            <p className="mb-4">
              <strong>KeyPulse</strong> is a zero-backend, client-native Security Operations Center (SOC) running entirely within the <strong>Anna Sandbox Runtime</strong>. It is designed to act as your central hub for API key management, infrastructure telemetry, and threat mitigation.
            </p>
            <p>
              Because KeyPulse utilizes the Anna Platform SDK (`annaBridge.storage`), all your encryption keys, linked identities, and telemetry data are persisted securely within your isolated local sandbox. We do not transmit your keys to external databases. You retain 100% custody of your credentials.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Dashboard & Key Vault */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-[#FFD200] p-4 border-b-4 border-black flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-black">2. Dashboard & Key Vault</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>The core command center. The Vault operates in two parts:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Vault Analytics:</strong> A high-level telemetry bar monitoring total tracked keys, elevated access warnings (keys with dangerous `admin` or `api.write` scopes), and active quota breaches.</li>
                <li><strong>State Management:</strong> View all active keys, copy their raw values securely, and check their operational statuses.</li>
                <li><strong>Revocation & Deletion:</strong> Click the Vertical Dots to <span className="text-[#FF4B91] font-bold">Revoke</span> a key (marking it dead but keeping the record), or click the <span className="text-gray-500 font-bold">Trash</span> icon to permanently annihilate it from the sandbox memory.</li>
              </ul>
            </div>
          </section>

          {/* Diagnostic Hub */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-[#FF4B91] p-4 border-b-4 border-black flex items-center gap-3">
              <ActivitySquare className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">3. Diagnostic Hub</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>Simulates edge-network HTTP requests to measure the health and latency of your API endpoints.</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Global API Sandbox:</strong> The target selector is pre-loaded with your own Vault Keys, plus <strong>50 predefined Global APIs</strong> (Stripe, OpenAI, AWS, Twilio, etc.).</li>
                <li><strong>Telemetry:</strong> Select an API and click Run. The Anna AI engine simulates a network trip, returning realistic latency measurements (ms) and HTTP Status Codes (200 OK, 429 Rate Limited, 503 Degraded).</li>
                <li><strong>Payload Injection:</strong> You can paste JSON payloads into the optional box. If the Anna AI detects malicious patterns, it will automatically throw a 403 Forbidden or 400 Bad Request.</li>
              </ul>
            </div>
          </section>

          {/* OSINT Scanner */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-black p-4 border-b-4 border-black flex items-center gap-3">
              <Search className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">4. OSINT Scanner</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>The Open-Source Intelligence (OSINT) scanner is your early warning radar for leaked credentials.</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Deep Web Scan:</strong> Initiating a scan queries your vault keys against simulated dark web marketplaces, public GitHub repositories, and Pastebin dumps.</li>
                <li><strong>Threat Mitigation:</strong> If a key is flagged as compromised, the scanner highlights it in red. You must manually revoke or rotate the key to clear the threat level.</li>
              </ul>
            </div>
          </section>

          {/* Global Reports */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-[#B624FF] p-4 border-b-4 border-black flex items-center gap-3">
              <FileText className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-white">5. Global Reports</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>Automated, AI-generated security audits utilizing the `annaBridge.llm.complete` protocol.</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Integrity Score:</strong> Evaluates your overall security posture based on active keys, quotas, and permission scopes.</li>
                <li><strong>Risk Radar:</strong> Extracts critical flaws (e.g., stale tokens, over-privileged keys).</li>
                <li><strong>Execution Playbook:</strong> Provides a step-by-step checklist of actions (High, Medium, Low priority) you need to take to secure your infrastructure.</li>
              </ul>
            </div>
          </section>

          {/* Key Directory */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-[#00E5FF] p-4 border-b-4 border-black flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-black">6. Key Directory</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>Your educational reference manual for architectural decisions.</p>
              <p>
                The directory divides the most popular developer APIs into precise categories (Financial & Payments, Artificial Intelligence, Databases & Storage, Cloud Infrastructure, etc.).
              </p>
              <p>
                It explicitly states exactly what each API is "Best for", helping you choose the right tool for your project. Clicking <strong>Generate Key</strong> takes you directly to the developer portal for that service.
              </p>
            </div>
          </section>

          {/* Workspace Settings */}
          <section className="bg-white border-4 border-black flex flex-col shadow-[8px_8px_0px_0px_#000000]">
            <div className="bg-gray-200 p-4 border-b-4 border-black flex items-center gap-3">
              <Settings className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-black">7. Workspace Settings</h3>
            </div>
            <div className="p-6 flex-1 text-black font-medium space-y-4">
              <p>The centralized hub for Third-Party Integrations.</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>SSO Linking:</strong> Connect your Google or GitHub workspaces strictly through the client side.</li>
                <li><strong>Connection Memory:</strong> Any service authorized through the Google Integration Fetcher is permanently remembered using Anna SDK storage (`annaBridge.storage.set`), so your linked services persist across sessions.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Footer Warning */}
        <div className="mt-12 bg-black text-white border-4 border-black p-6 flex items-start gap-4 shadow-[8px_8px_0px_0px_rgba(255,210,0,1)]">
          <AlertTriangle className="w-8 h-8 text-[#FFD200] shrink-0" />
          <div>
            <h4 className="text-xl font-black uppercase tracking-widest text-[#FFD200] mb-2">Security Warning</h4>
            <p className="font-bold tracking-wider text-sm">
              This application is a demonstration environment powered by the Anna Platform sandbox. While cryptographic keys generated inside the sandbox utilize true pseudo-random entropy, they should NEVER be used in live production systems outside of the Anna ecosystem. Do not paste real production credentials into the Vault unless you are testing locally.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

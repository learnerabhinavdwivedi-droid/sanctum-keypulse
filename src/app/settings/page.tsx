"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GoogleIntegrationFetcher } from '../../components/GoogleIntegrationFetcher';
import { Settings, GitBranch, Github, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleGithubConnect = () => {
    setGithubLoading(true);
    setTimeout(() => {
      setGithubLoading(false);
      setGithubConnected(true);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12 pb-12">
        
        {/* Header section */}
        <div className="flex items-center gap-4 border-b-8 border-black pb-8">
          <div className="w-16 h-16 bg-[#FFD200] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-center items-center">
            <Settings className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Workspace Settings</h2>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm mt-1">Manage Connections, Security, and Integrations</p>
          </div>
        </div>

        {/* Third-Party Integrations Section */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <h3 className="text-2xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1 inline-block">Third-Party Integrations</h3>
          </div>
          <p className="font-bold text-gray-600 mb-8 max-w-2xl">
            Configure your external identity providers to automatically sync keys and access tokens into the Vault. These connections are strictly client-side via the Anna platform.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Google Integration Card (Imported Component) */}
            <div className="h-full">
              <GoogleIntegrationFetcher />
            </div>

            {/* GitHub Integration Card (Mocked Inline) */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b-4 border-black flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-black">
                  <GitBranch className="w-6 h-6" />
                  GitHub Workspace Link
                </h3>
                {githubConnected ? <CheckCircle2 className="w-6 h-6 text-[#00CD74]" /> : <Lock className="w-6 h-6 text-gray-400" />}
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                {githubConnected ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#00CD74] border-4 border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-black uppercase tracking-widest mb-2">Connected</h4>
                    <p className="font-bold text-gray-600 uppercase tracking-wider text-sm">GitHub Organization synced to Anna Sandbox.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <p className="font-bold mb-8 text-sm uppercase tracking-wider text-black">
                      Connect your GitHub account to automatically scan private repositories for exposed secrets and sync API tokens.
                    </p>
                    <button 
                      onClick={handleGithubConnect}
                      disabled={githubLoading}
                      className="w-full bg-white text-black font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform flex justify-center items-center gap-3 disabled:opacity-50"
                    >
                      {githubLoading ? (
                        <>
                          <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                          Linking...
                        </>
                      ) : (
                        <>
                          <GitBranch className="w-5 h-5" />
                          Connect GitHub SSO
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

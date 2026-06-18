"use client";

import React, { useMemo } from 'react';
import { useKeyManager } from '../../hooks/useKeyManager';
import { ShieldAlert, KeyRound, Activity, Ban } from 'lucide-react';
import { KeyVaultTable } from '../../components/KeyVaultTable';
import { ThreatSandbox } from '../../components/ThreatSandbox';
import { SanctumAssistant } from '../../components/SanctumAssistant';
import { DashboardLayout } from '../../components/DashboardLayout';

export default function KeyVaultPage() {
  const { keys, addKey, revokeKey, deleteKey, validationResults, isValidating, validateKeyById } = useKeyManager();

  const handleCreateKey = () => {
    const label = window.prompt('Enter Key Label (e.g. STRIPE_PROD):');
    if (!label) return;
    const token = window.prompt('Enter Secret Token:');
    if (!token) return;
    addKey(label, token, 'Custom', ['api.read', 'api.write']);
  };

  const analytics = useMemo(() => {
    const total = keys.length;
    const revoked = keys.filter(k => k.status === 'Revoked').length;
    const criticalThreats = keys.filter(k => k.status !== 'Revoked' && (k.accessProfile?.includes('api.write') || k.accessProfile?.includes('admin'))).length;
    const activeBreaches = keys.filter(k => k.quota && k.quota >= 90).length;
    return { total, revoked, criticalThreats, activeBreaches };
  }, [keys]);

  return (
    <>
      <DashboardLayout>
        <div className="flex flex-col gap-8 h-full min-h-[600px]">
          
          {/* Vault Analytics Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#00E5FF] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-[10px] uppercase tracking-widest text-black">Total Tracked</span>
                <KeyRound className="w-6 h-6 text-black" />
              </div>
              <span className="text-4xl font-black text-black">{analytics.total}</span>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-[10px] uppercase tracking-widest text-black">Elevated Access</span>
                <ShieldAlert className="w-6 h-6 text-black" />
              </div>
              <span className="text-4xl font-black text-black">{analytics.criticalThreats}</span>
            </div>

            <div className="bg-[#FF4B91] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-[10px] uppercase tracking-widest text-white">Quota Breaches</span>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black text-white">{analytics.activeBreaches}</span>
            </div>

            <div className="bg-[#FFD200] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-[10px] uppercase tracking-widest text-black">Revoked / Dead</span>
                <Ban className="w-6 h-6 text-black" />
              </div>
              <span className="text-4xl font-black text-black">{analytics.revoked}</span>
            </div>
          </div>

          {/* Main Content - Key Vault & Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            <div className="lg:col-span-2 min-h-[400px]">
              <KeyVaultTable 
                keys={keys} 
                onRevoke={revokeKey} 
                onDelete={deleteKey}
                onCreateSingleKey={handleCreateKey}
                validationResults={validationResults}
                isValidating={isValidating}
                onValidate={validateKeyById}
              />
            </div>
            <div className="lg:col-span-1 flex-shrink-0">
              <ThreatSandbox vaultKeys={keys} />
            </div>
          </div>

        </div>
      </DashboardLayout>

      <SanctumAssistant keys={keys} onRevokeKey={revokeKey} />
    </>
  );
}


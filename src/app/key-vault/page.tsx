"use client";

import React from 'react';
import { useKeyManager } from '../../hooks/useKeyManager';
import { KeyVaultTable } from '../../components/KeyVaultTable';
import { GoogleIntegrationFetcher } from '../../components/GoogleIntegrationFetcher';
import { ThreatSandbox } from '../../components/ThreatSandbox';
import { SanctumAssistant } from '../../components/SanctumAssistant';
import { DashboardLayout } from '../../components/DashboardLayout';

export default function KeyVaultPage() {
  const { keys, revokeKey } = useKeyManager();

  return (
    <>
      <DashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[600px]">
          
          {/* Left Column (2/3 width) - Key Vault & Sandbox */}
          <div className="lg:col-span-2 flex flex-col gap-8 h-full">
            <div className="flex-1 min-h-[400px]">
              <KeyVaultTable 
                keys={keys} 
                onRevoke={revokeKey} 
                onCreateSingleKey={() => {}} 
              />
            </div>
            <div className="flex-shrink-0">
              <ThreatSandbox vaultKeys={keys} />
            </div>
          </div>

          {/* Right Column (1/3 width) - Google SSO */}
          <div className="lg:col-span-1 h-full">
            <GoogleIntegrationFetcher />
          </div>

        </div>
      </DashboardLayout>

      <SanctumAssistant keys={keys} onRevokeKey={revokeKey} />
    </>
  );
}


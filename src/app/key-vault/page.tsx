"use client";

import React from 'react';
import { useKeyManager } from '../../hooks/useKeyManager';
import { KeyVaultTable } from '../../components/KeyVaultTable';

import { SanctumAssistant } from '../../components/SanctumAssistant';
import { DashboardLayout } from '../../components/DashboardLayout';

export default function KeyVaultPage() {
  const { keys, addKey, deleteKey, revokeKey } = useKeyManager();

  return (
    <>
      <DashboardLayout>
        <div className="h-full min-h-[600px]">
          {/* Key Vault Table */}
          <KeyVaultTable 
            keys={keys} 
            onRevoke={revokeKey} 
            onCreateSingleKey={() => {}} 
          />
        </div>
      </DashboardLayout>

      <SanctumAssistant keys={keys} onRevokeKey={revokeKey} />
    </>
  );
}

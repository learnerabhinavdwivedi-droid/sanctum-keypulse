"use client";

import React, { useState, useEffect } from 'react';
import { useKeyManager } from '../../hooks/useKeyManager';
import { DiagnosticHub } from '../../components/DiagnosticHub';
import { SanctumAssistant } from '../../components/SanctumAssistant';
import { DashboardLayout } from '../../components/DashboardLayout';

export default function DiagnosticsPage() {
  const { keys, revokeKey } = useKeyManager();
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    // Anna Identity Passport Implementation
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && window.Anna?.identity?.id) {
        setIdentity(window.Anna.identity.id);
      } else {
        setIdentity('dev-user-local');
      }
    };
    initIdentity();
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto h-[600px]">
          <DiagnosticHub keys={keys} />
        </div>
      </DashboardLayout>

      <SanctumAssistant keys={keys} onRevokeKey={revokeKey} />
    </>
  );
}

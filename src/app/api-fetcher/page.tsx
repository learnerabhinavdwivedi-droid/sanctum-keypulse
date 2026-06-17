"use client";

import React, { Suspense } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useKeyManager } from '../../hooks/useKeyManager';
import { GoogleIntegrationFetcher } from '../../components/GoogleIntegrationFetcher';

export default function ApiFetcherPage() {
  const { appendKey } = useKeyManager();

  return (
    <DashboardLayout>
      <div className="flex justify-center items-start h-full pt-10">
        <div className="w-full max-w-2xl">
          <Suspense fallback={<div>Loading...</div>}>
            <GoogleIntegrationFetcher onIntegrationSuccess={appendKey} />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GitHubLeakScanner } from '../../components/GitHubLeakScanner';

export default function OsintScannerPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">OSINT Leak Scanner</h2>
          <p className="font-bold uppercase tracking-wider text-sm text-gray-600 border-l-4 border-black pl-4">
            Actively monitor and parse public repositories for exposed credential files and automatically isolate threats in your vault.
          </p>
        </div>
        
        <GitHubLeakScanner />
      </div>
    </DashboardLayout>
  );
}

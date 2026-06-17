"use client";

import React from 'react';
import Link from 'next/link';
import { useKeyManager } from '../hooks/useKeyManager';
import { DashboardLayout } from '../components/DashboardLayout';
import { SanctumAssistant } from '../components/SanctumAssistant';
import { KeyRound, ActivitySquare, FileText, AlertTriangle, CheckSquare, Zap } from 'lucide-react';

export default function DashboardHub() {
  const { keys, revokeKey } = useKeyManager();

  const totalKeys = keys.length;
  const activeKeys = keys.filter(k => k.status !== 'Revoked').length;
  const revokedKeys = keys.filter(k => k.status === 'Revoked').length;
  const recentKeys = keys.slice(0, 3);

  return (
    <>
      <DashboardLayout>
        <div className="h-full max-w-7xl mx-auto flex flex-col gap-8 pb-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-8 border-black pb-6 gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black">Operations Center</h1>
              <p className="text-lg font-bold text-black uppercase tracking-widest mt-2">Real-time telemetry and infrastructure overview</p>
            </div>
            <div className="bg-[#00CD74] text-black px-6 py-3 font-black text-sm tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
              <span className="w-3 h-3 bg-black animate-pulse"></span>
              SYSTEM OPTIMAL
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#00E5FF] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-transform flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-widest">Total Keys</h3>
                <KeyRound className="w-8 h-8 text-black" />
              </div>
              <span className="text-7xl font-black tracking-tighter">{totalKeys}</span>
            </div>
            <div className="bg-[#FFD200] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-transform flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-widest">Active Keys</h3>
                <CheckSquare className="w-8 h-8 text-black" />
              </div>
              <span className="text-7xl font-black tracking-tighter">{activeKeys}</span>
            </div>
            <div className="bg-[#FF4B91] text-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-transform flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-widest text-white">Revoked</h3>
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <span className="text-7xl font-black tracking-tighter">{revokedKeys}</span>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            
            {/* Quick Actions */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-black text-white p-4 shadow-[4px_4px_0px_0px_rgba(255,210,0,1)]">
                <Zap className="w-8 h-8 text-[#FFD200]" />
                <h3 className="text-2xl font-black uppercase tracking-widest">Quick Actions</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link href="/key-vault" className="bg-white border-4 border-black p-6 flex items-center justify-between hover:bg-gray-100 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 group">
                  <div className="flex items-center gap-4">
                    <KeyRound className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black uppercase tracking-widest">Manage Key Vault</span>
                  </div>
                  <span className="text-2xl font-black">&rarr;</span>
                </Link>
                <Link href="/diagnostics" className="bg-white border-4 border-black p-6 flex items-center justify-between hover:bg-gray-100 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 group">
                  <div className="flex items-center gap-4">
                    <ActivitySquare className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black uppercase tracking-widest">Run Diagnostics</span>
                  </div>
                  <span className="text-2xl font-black">&rarr;</span>
                </Link>
                <Link href="/reports" className="bg-white border-4 border-black p-6 flex items-center justify-between hover:bg-gray-100 transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 group">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black uppercase tracking-widest">View Global Reports</span>
                  </div>
                  <span className="text-2xl font-black">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-black text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,205,116,1)]">
                <ActivitySquare className="w-8 h-8 text-[#00CD74]" />
                <h3 className="text-2xl font-black uppercase tracking-widest">Recent Keys</h3>
              </div>
              
              <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-4 divide-black">
                {recentKeys.length > 0 ? recentKeys.map(key => (
                  <div key={key.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#00E5FF]/10 transition-colors">
                    <div>
                      <p className="text-lg font-black uppercase tracking-widest">{key.label}</p>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">{key.provider} • {key.mask}</p>
                    </div>
                    <span className={`px-3 py-1 border-2 border-black font-black text-xs tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${key.status === 'Revoked' ? 'bg-[#FF4B91] text-white' : 'bg-[#00CD74] text-black'}`}>
                      {key.status}
                    </span>
                  </div>
                )) : (
                  <div className="p-8 text-center text-lg font-black uppercase tracking-widest text-gray-500">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>

      <SanctumAssistant keys={keys} onRevokeKey={revokeKey} />
    </>
  );
}

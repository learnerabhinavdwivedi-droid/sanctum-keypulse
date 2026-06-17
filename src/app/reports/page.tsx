"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { AlertTriangle, ShieldAlert, CheckSquare, Zap, Activity } from 'lucide-react';

interface ReportPayload {
  overallHealthScore: number;
  criticalRisks: string[];
  actionablePlaybook: { action: string; priority: "HIGH" | "MEDIUM" | "LOW" }[];
}

export default function ReportsPage() {
  const [identity, setIdentity] = useState<string | null>(null);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && window.Anna?.identity?.id) {
        setIdentity(window.Anna.identity.id);
      } else {
        setIdentity('dev-user-local');
      }
    };
    initIdentity();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/reports');
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          setError('Failed to fetch intelligence report.');
        }
      } catch (err) {
        setError('Network error analyzing infrastructure.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-[#00CD74]';
    if (score >= 50) return 'text-[#FFD200]';
    return 'text-[#FF4B91]';
  };

  const getScoreBg = (score: number) => {
    if (score > 80) return 'bg-[#00CD74]';
    if (score >= 50) return 'bg-[#FFD200]';
    return 'bg-[#FF4B91]';
  };

  return (
    <DashboardLayout identity={identity}>
      <div className="max-w-7xl mx-auto h-full flex flex-col pb-12">
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 text-center relative overflow-hidden max-w-2xl w-full">
              
              <div className="relative mb-8 flex justify-center">
                <Activity className="w-24 h-24 text-black animate-pulse" />
              </div>
              
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">
                ANALYZING INFRASTRUCTURE
              </h1>
              <p className="font-bold text-black text-lg uppercase tracking-widest">Anna AI processing telemetry stream</p>
            </div>
          </div>
        ) : error ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 text-center max-w-xl w-full">
               <ShieldAlert className="w-24 h-24 text-[#FF4B91] mx-auto mb-6" />
               <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">CRITICAL FAULT</h2>
               <p className="font-bold text-white text-xl bg-[#FF4B91] border-4 border-black p-4 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{error}</p>
             </div>
           </div>
        ) : report ? (
          <div className="flex-1 overflow-y-auto pr-4 space-y-12">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 border-b-8 border-black pb-4">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Global Audit Report</h1>
              <div className="mt-4 md:mt-0 bg-[#FFD200] text-black px-6 py-3 font-black text-sm tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <span className="w-3 h-3 bg-black"></span>
                Powered by Anna AI
              </div>
            </div>

            {/* The Scorecard */}
            <div className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">Overall Integrity Score</h2>
                <p className="text-lg font-bold text-black uppercase tracking-widest max-w-xl">
                  Based on deep telemetry analysis, permission scope reviews, and rate-limit heuristics evaluated by Anna, our enterprise AI engine.
                </p>
              </div>
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-black flex items-center justify-center ${getScoreBg(report.overallHealthScore)} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="bg-white rounded-full w-3/4 h-3/4 flex items-center justify-center border-4 border-black shadow-inner">
                  <span className={`text-6xl md:text-8xl font-black ${getScoreColor(report.overallHealthScore)} tracking-tighter`}>
                    {report.overallHealthScore}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Risk Radar */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-black text-white p-4 shadow-[4px_4px_0px_0px_rgba(255,75,145,1)]">
                  <ShieldAlert className="w-8 h-8 text-[#FF4B91]" />
                  <h3 className="text-2xl font-black uppercase tracking-widest">Risk Radar</h3>
                </div>
                
                {report.criticalRisks.length === 0 ? (
                  <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center justify-center">
                    <p className="font-black text-black text-lg uppercase tracking-widest">Zero critical risks detected.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {report.criticalRisks.map((risk, idx) => (
                      <div key={idx} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex items-start gap-4 hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                        <AlertTriangle className="w-8 h-8 text-[#FF4B91] shrink-0" />
                        <p className="font-bold text-black text-base uppercase tracking-wider">{risk}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actionable Playbook */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-black text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,229,255,1)]">
                  <Zap className="w-8 h-8 text-[#00E5FF]" />
                  <h3 className="text-2xl font-black uppercase tracking-widest">Execution Playbook</h3>
                </div>
                
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] divide-y-4 divide-black">
                  {report.actionablePlaybook.map((task, idx) => (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start sm:items-center gap-4">
                        <CheckSquare className="w-6 h-6 text-black shrink-0 mt-1 sm:mt-0" />
                        <span className="font-bold text-black text-base uppercase tracking-wider">{task.action}</span>
                      </div>
                      
                      <div className={`px-4 py-2 border-4 border-black font-black text-sm tracking-widest uppercase flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        ${task.priority === 'HIGH' ? 'bg-[#FF4B91] text-white' : 
                          task.priority === 'MEDIUM' ? 'bg-[#FFD200] text-black' : 
                          'bg-gray-200 text-black'}`
                      }>
                        {task.priority === 'HIGH' && <AlertTriangle className="w-4 h-4" />}
                        {task.priority}
                      </div>
                    </div>
                  ))}
                  {report.actionablePlaybook.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="font-black text-black text-lg uppercase tracking-widest">Infrastructure is optimal. No actions required.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

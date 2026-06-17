"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeyManager } from '../hooks/useKeyManager';
import { 
  Bell, 
  HelpCircle, 
  Settings, 
  LayoutDashboard, 
  KeyRound, 
  ActivitySquare, 
  FileText, 
  ShieldCheck,
  UserCheck,
  BookOpen
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  identity?: string | null;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, identity }) => {
  const pathname = usePathname();
  const { keys } = useKeyManager();
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  
  // Track degraded keys
  // For this mock, we assume usage is high if status is 'Revoked' or mock usage condition is met
  const degradedKeys = keys.filter(k => k.status === 'Revoked');
  const hasAlerts = degradedKeys.length > 0;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-black font-sans overflow-hidden selection:bg-[#00E5FF] selection:text-black">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r-8 border-black flex flex-col flex-shrink-0 z-20 shadow-[8px_0px_0px_rgba(0,0,0,1)]">
        <div className="h-24 flex items-center px-6 border-b-8 border-black bg-[#FFD200]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-black tracking-tighter uppercase leading-none">ANNA</span>
              <span className="text-xs font-bold text-black uppercase tracking-widest leading-none mt-1">KEYPULSE</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-4 overflow-y-auto custom-scrollbar">
          <Link href="/" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/') ? 'bg-[#00E5FF] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/key-vault" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/key-vault') ? 'bg-[#FFD200] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <KeyRound className="w-6 h-6" />
            <span className="text-sm">Key Vault</span>
          </Link>
          <Link href="/api-fetcher" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/api-fetcher') ? 'bg-[#00E5FF] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <KeyRound className="w-6 h-6" />
            <span className="text-sm">API Fetcher</span>
          </Link>
          <Link href="/about-keys" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/about-keys') ? 'bg-[#00CD74] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <BookOpen className="w-6 h-6" />
            <span className="text-sm">Directory</span>
          </Link>
          <Link href="/diagnostics" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/diagnostics') ? 'bg-[#FF4B91] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <ActivitySquare className="w-6 h-6" />
            <span className="text-sm">Diagnostics</span>
          </Link>
          <Link href="/reports" className={`flex items-center gap-4 px-4 py-4 font-black uppercase tracking-widest border-4 border-black transition-all ${isActive('/reports') ? 'bg-[#B624FF] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1'}`}>
            <FileText className="w-6 h-6" />
            <span className="text-sm">Reports</span>
          </Link>
        </nav>

        <div className="p-4 border-t-8 border-black bg-white">
          <a href="#" className="flex items-center gap-4 px-4 py-4 bg-white border-4 border-black font-black uppercase tracking-widest hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
            <Settings className="w-6 h-6 text-black" />
            <span className="text-sm text-black">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="h-24 flex items-center justify-between px-8 bg-white border-b-8 border-black flex-shrink-0 z-10">
          <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
            {isActive('/') ? 'SYSTEM DASHBOARD' : isActive('/key-vault') ? 'KEY VAULT' : isActive('/diagnostics') ? 'DIAGNOSTIC HUB' : isActive('/about-keys') ? 'KEY DIRECTORY' : isActive('/reports') ? 'GLOBAL REPORTS' : isActive('/api-fetcher') ? 'API FETCHER' : isActive('/docs') ? 'OPERATOR MANUAL' : 'DASHBOARD'}
          </h1>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div 
                className="w-12 h-12 bg-[#FFD200] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              >
                <Bell className="w-6 h-6 text-black" />
              </div>
              {hasAlerts && (
                <span className="absolute -top-2 -right-2 bg-[#FF4B91] border-2 border-black text-white text-xs font-black w-6 h-6 flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] pointer-events-none">
                  {degradedKeys.length}
                </span>
              )}

              {/* Alert Dropdown Card */}
              {showAlertDropdown && (
                <div className="absolute right-0 top-16 w-80 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] z-50">
                  <div className="p-4 border-b-4 border-black bg-[#FF4B91] text-white">
                    <h4 className="font-black uppercase tracking-widest text-lg">Health Alerts</h4>
                  </div>
                  <div className="p-0 max-h-64 overflow-y-auto">
                    {degradedKeys.length > 0 ? (
                      degradedKeys.map(key => (
                        <div key={key.id} className="p-4 border-b-2 border-black bg-white hover:bg-gray-100 transition-colors">
                          <p className="font-black uppercase tracking-wide text-black">{key.label}</p>
                          <p className="font-bold text-xs uppercase text-[#FF4B91] mt-1">STATUS: {key.status}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white text-center">
                        <p className="font-black uppercase tracking-wide text-gray-500">All Systems Nominal</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Passport Badge (Anna Platform Stand-In) */}
            <div className="flex items-center gap-3 cursor-pointer bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
              <div className="flex flex-col mr-2 text-right">
                <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">Developer</span>
                <span className="text-sm font-bold text-black mt-1">
                  learnerabhinavdwivedi@gmail.com
                </span>
              </div>
              <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="w-1 h-12 bg-black mx-2"></div>
            
            <Link href="/docs" className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-black text-sm font-black uppercase tracking-widest hover:bg-gray-100 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
              <HelpCircle className="w-5 h-5" />
              Help
            </Link>
            
            <button className="px-8 py-3 bg-[#00E5FF] text-black border-4 border-black text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
              Upgrade System
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar bg-[#FAF8F5]">
          {children}
        </div>

      </main>
    </div>
  );
};


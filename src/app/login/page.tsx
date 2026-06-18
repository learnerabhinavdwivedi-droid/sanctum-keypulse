"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Loader2, Key, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { annaBridge } from "../../lib/annaBridge";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("operator@sanctum.hq");

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const identity = await annaBridge.storage.get('anna_identity');
      if (identity) {
        window.location.href = "./key-vault.html";
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const finalEmail = email.trim() || "operator@sanctum.hq";
    
    await new Promise(r => setTimeout(r, 1200)); // Simulate UI delay
    await annaBridge.storage.set('anna_identity', finalEmail);
    window.location.href = "./key-vault.html";
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black font-sans selection:bg-[#FFD200] selection:text-black flex flex-col">
      
      {/* Top Nav (Minimal) */}
      <nav className="w-full px-6 py-4 flex items-center justify-between z-50">
        <a href="./index.html" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFD200] border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter uppercase text-black">Sanctum</span>
          </div>
        </a>
      </nav>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-[#00E5FF] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Key className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Access Vault</h1>
              <p className="font-bold text-gray-500 text-xs tracking-widest uppercase">Zero-Backend Client SOC</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div>
                <label className="block font-black text-[10px] uppercase tracking-widest text-gray-700 mb-2">Workspace Email / ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="operator@sanctum.hq"
                  className="w-full px-4 py-3 bg-gray-50 border-4 border-black font-bold focus:outline-none focus:bg-[#FFD200] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-black text-[10px] uppercase tracking-widest text-gray-700 mb-2">Access Phrase</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border-4 border-black font-bold focus:outline-none focus:bg-[#00E5FF] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg placeholder-gray-400"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#00CD74] border-4 border-black text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-70 disabled:cursor-not-allowed transition-all rounded-lg mt-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initialize Session <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>

          </div>
        </motion.div>
      </main>

    </div>
  );
}

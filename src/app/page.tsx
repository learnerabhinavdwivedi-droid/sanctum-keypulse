"use client";

import React, { useEffect } from "react";
import { ShieldCheck, Play, ArrowRight, Activity, GitBranch, Key, Database, Bot, Zap, CheckCircle2, Lock, Satellite, Rocket, Telescope, Orbit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { annaBridge } from '../lib/annaBridge';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const fadeUpSpring = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatReverseAnimation = {
  animate: {
    y: [0, 15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 } 
  }
};

export default function LandingPage() {
  useEffect(() => {
    annaBridge.window.setTitle('Sanctum KeyPulse — AI Security Vault');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black font-sans overflow-x-hidden selection:bg-[#FFD200] selection:text-black pb-20">
      
      {/* =======================
          1. YELLOW NAV BAR
          ======================= */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full bg-[#FFD200] border-b-4 border-black px-6 py-4 flex items-center justify-between z-50 relative shadow-[0_4px_0_0_rgba(0,0,0,1)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter uppercase text-black">Sanctum</span>
            <span className="font-bold text-[10px] tracking-widest uppercase text-black">KeyPulse</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="#features" className="px-5 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#00E5FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Features</a>
          <a href="#compare" className="px-5 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#FF4B91] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Comparison</a>
          <a href="./learn-more.html" className="px-5 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-widest hover:bg-[#00CD74] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Learn More</a>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 pt-16">
        
        {/* =======================
            2. HERO SECTION
            ======================= */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 mb-24 relative">
          
          {/* Left Text Column */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 z-10"
          >
            <motion.div variants={fadeUpSpring} className="inline-block px-4 py-1.5 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
              <span className="font-bold text-xs uppercase tracking-widest text-gray-700">⚡ KEYPULSE IS LIVE & NATIVE</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpSpring} className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1] mb-6 text-black">
              Build a <span className="inline-block bg-[#00CD74] border-4 border-black px-4 py-1 pb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">Vault,</span><br/>
              audit the keys,<br/>
              and watch the<br/>
              threats stack up.
            </motion.h1>
            
            <motion.p variants={fadeUpSpring} className="text-lg font-medium text-gray-700 mb-10 max-w-lg leading-relaxed">
              A complete client-native SOC workspace. Scan APIs, audit credentials, and trigger remediations strictly within your browser.
            </motion.p>

            <motion.div variants={fadeUpSpring} className="flex flex-wrap items-center gap-4 mb-12">
              <a href="./login.html" className="px-8 py-4 bg-[#00CD74] text-black border-4 border-black font-black uppercase tracking-widest text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
                LOGIN TO WORKSPACE <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Bottom pills */}
            <motion.div variants={fadeUpSpring} className="flex flex-wrap gap-4">
              <div className="px-4 py-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-md min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">State Mgmt</span>
                <span className="font-black text-xs uppercase leading-tight">Draft /<br/>Active /<br/>Revoked</span>
              </div>
              <div className="px-4 py-3 bg-[#00E5FF] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-md min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-black/60 mb-1">Ingestion</span>
                <span className="font-black text-xs uppercase leading-tight">Manual +<br/>OSINT Scan</span>
              </div>
              <div className="px-4 py-3 bg-[#FF4B91] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-md min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-white/70 mb-1">Architecture</span>
                <span className="font-black text-xs uppercase leading-tight">Zero<br/>Backend<br/>Clusters</span>
              </div>
            </motion.div>

            {/* Floating Decorative Object - Satellite */}
            <motion.div
              variants={floatReverseAnimation}
              animate="animate"
              className="absolute -left-12 top-20 w-16 h-16 bg-[#00E5FF] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 hidden lg:flex"
            >
              <Satellite className="w-8 h-8 text-black" />
            </motion.div>
          </motion.div>

          {/* Right Graphics Column */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="flex-1 relative w-full max-w-xl mx-auto h-[500px]"
          >
            {/* The main browser window */}
            <motion.div 
              variants={floatAnimation}
              animate="animate"
              className="absolute inset-0 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden transform rotate-2 z-10 flex flex-col"
            >
              <div className="h-10 border-b-4 border-black flex items-center px-4 gap-2 bg-white">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                <div className="mx-auto px-4 py-1 bg-white border-2 border-black rounded-full font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  keypulse.anna.network
                </div>
              </div>
              <div className="p-10 flex-1 bg-white flex flex-col items-center justify-center text-center">
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-2">Sign in to Application</h3>
                <p className="font-bold text-gray-500 text-sm mb-8">Launch your SOC Workspace securely.</p>
                <div className="flex gap-4 w-full justify-center mb-8">
                  <div className="flex items-center gap-2 px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm rounded-md">
                    <Database className="w-4 h-4" /> Github
                  </div>
                  <div className="flex items-center gap-2 px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm bg-black text-white rounded-md">
                    <Key className="w-4 h-4 text-[#FFD200]" /> SSO Connect
                  </div>
                </div>
                <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full mb-4"></div>
                <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Or Continue as Guest</p>
              </div>
            </motion.div>

            {/* Sticky Notes */}
            <motion.div 
              variants={floatReverseAnimation}
              animate="animate"
              className="absolute -top-6 right-0 bg-[#FFD200] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-[8deg] z-20 w-48"
            >
              <p className="font-black text-xs uppercase leading-snug">Strict Sandbox</p>
              <p className="font-bold text-[10px] mt-1 leading-tight">State is persisted strictly in the browser. Zero exfiltration.</p>
            </motion.div>

            <motion.div 
              variants={floatAnimation}
              animate="animate"
              className="absolute -bottom-6 left-0 bg-[#00CD74] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-[4deg] z-20 w-64"
            >
              <p className="font-black text-sm uppercase leading-snug text-black">✦ Anna LLM Engine</p>
              <p className="font-bold text-[10px] mt-1 text-black">Powered directly by window.Anna.llm for offline-capable logic processing.</p>
            </motion.div>
            
            {/* Blue and Pink shape accents in background */}
            <motion.div 
              variants={floatReverseAnimation}
              animate="animate"
              className="absolute top-1/4 -left-12 w-24 h-40 bg-[#00E5FF] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-12 z-0 rounded-l-xl"
            ></motion.div>
            <motion.div 
              variants={floatAnimation}
              animate="animate"
              className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#FF4B91] border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-0"
            ></motion.div>

            {/* Floating Decorative Object - Rocket */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [45, 50, 45] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-10 w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20"
            >
              <Rocket className="w-10 h-10 text-[#FF4B91]" />
            </motion.div>
          </motion.div>
        </section>

        {/* =======================
            2.5 INFINITE MARQUEE
            ======================= */}
        <section className="mb-24 w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-black border-y-4 border-black overflow-hidden flex items-center h-16">
          <motion.div 
            animate={{ x: [0, -1035] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            className="flex whitespace-nowrap"
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center text-[#FFD200] font-black uppercase tracking-widest text-lg mx-8">
                <span>ZERO TRUST AUDITING</span>
                <span className="mx-6 text-white text-sm">✦</span>
                <span className="text-[#00CD74]">SECURE VAULT</span>
                <span className="mx-6 text-white text-sm">✦</span>
                <span className="text-[#00E5FF]">ANNA AI ENGINE</span>
                <span className="mx-6 text-white text-sm">✦</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* =======================
            3. PINK FEATURE BOX
            ======================= */}
        <motion.section 
          id="features" 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="bg-[#FF4B91] border-4 border-black rounded-3xl p-10 md:p-14 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="mb-12 relative z-10">
              <span className="font-black text-[10px] text-white/70 uppercase tracking-widest mb-4 block">Core Platform Features</span>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight max-w-3xl">
                Sanctum KeyPulse covers the entire credential lifecycle.
              </h2>
              <p className="font-bold text-white mt-4 text-lg max-w-2xl">
                From hunting down exposed GitHub tokens to executing confirmed revocation callbacks, the entire SOC workflow is handled strictly client-side.
              </p>
            </div>

            {/* Floating Decorative Object - Sparkles */}
            <motion.div
              variants={floatReverseAnimation}
              animate="animate"
              className="absolute top-10 right-10 w-14 h-14 bg-[#FFD200] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20"
            >
              <Sparkles className="w-8 h-8 text-black" />
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              
              {/* Card 1 */}
              <motion.div variants={fadeUpSpring} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-[#FFD200] border-2 border-black font-black text-[10px] uppercase tracking-widest rounded-full">BUILDER</span>
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><Database className="w-4 h-4"/></div>
                </div>
                <h3 className="font-black text-xl uppercase leading-none mb-3 tracking-tighter">Universal Extractor</h3>
                <p className="font-bold text-xs text-gray-500 leading-snug">
                  Paste raw config blocks or repo paths. The LLM extracts the credentials and automatically infers scope policies.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div variants={fadeUpSpring} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-[#00E5FF] border-2 border-black font-black text-[10px] uppercase tracking-widest rounded-full">ACCESS</span>
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><GitBranch className="w-4 h-4"/></div>
                </div>
                <h3 className="font-black text-xl uppercase leading-none mb-3 tracking-tighter">OSINT Scanner</h3>
                <p className="font-bold text-xs text-gray-500 leading-snug">
                  Target public GitHub repositories. KeyPulse scans for leaked .env files and immediately quarantines compromised signatures.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div variants={fadeUpSpring} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-[#00CD74] border-2 border-black font-black text-[10px] uppercase tracking-widest rounded-full">SHARING</span>
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><Bot className="w-4 h-4"/></div>
                </div>
                <h3 className="font-black text-xl uppercase leading-none mb-3 tracking-tighter">Anna Agent</h3>
                <p className="font-bold text-xs text-gray-500 leading-snug">
                  Instruct the agent to revoke a token. It parses your intent, stages the tool call, and requires your manual authorization.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div variants={fadeUpSpring} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col rounded-xl hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 bg-[#FF4B91] text-white border-2 border-black font-black text-[10px] uppercase tracking-widest rounded-full">ANALYTICS</span>
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><Activity className="w-4 h-4"/></div>
                </div>
                <h3 className="font-black text-xl uppercase leading-none mb-3 tracking-tighter">Threat Sandbox</h3>
                <p className="font-bold text-xs text-gray-500 leading-snug">
                  Test payloads against active vault permissions. The LLM evaluates request paths for least-privilege violations in real-time.
                </p>
              </motion.div>

            </motion.div>
          </div>
        </motion.section>

        {/* =======================
            4. COMPARISON SECTION
            ======================= */}
        <motion.section 
          id="compare" 
          className="mb-24 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          {/* Floating Decorative Object - Telescope */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [-10, 0, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-6 lg:-left-16 w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20 hidden md:flex"
          >
            <Telescope className="w-10 h-10 text-[#00CD74]" />
          </motion.div>

          <div className="mb-8 pl-0 md:pl-12">
            <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">COMPARISON SECTION</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Built for Zero-Trust Auditing,<br/>not just generic form collection</h2>
            <p className="font-bold text-gray-500 mt-4 max-w-3xl text-sm">
              PulseBoard fundamentally shifts the paradigm by running intelligence natively in the browser via Anna SDK, preventing the exposure of your keys to remote SaaS analysis servers.
            </p>
          </div>

          <div className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-4 border-black">
              <div className="col-span-4 p-6 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center">Feature</div>
              <div className="col-span-4 p-6 bg-[#00CD74] border-l-0 md:border-l-4 md:border-r-4 border-black font-black uppercase tracking-widest text-xs flex items-center text-black">PulseBoard (KeyPulse)</div>
              <div className="col-span-4 p-6 bg-[#e0f2fe] font-black uppercase tracking-widest text-xs flex items-center text-[#3b82f6]">Traditional Options</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-4 border-black text-xs hover:bg-gray-50 transition-colors">
              <div className="col-span-4 p-6 font-black uppercase flex items-center">Data Residency</div>
              <div className="col-span-4 p-6 border-l-0 md:border-l-4 md:border-r-4 border-black font-bold">
                Fully sandboxed client-state. Keys never leave the browser runtime, adhering to <span className="font-black text-[#00CD74]">Zero-Exfil</span> policies.
              </div>
              <div className="col-span-4 p-6 font-bold text-gray-500">
                Pushed to centralized SaaS databases. Heavy reliance on vendor trust and SOC2 compliance.
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-4 border-black text-xs hover:bg-gray-50 transition-colors">
              <div className="col-span-4 p-6 font-black uppercase flex items-center">Intelligence Processing</div>
              <div className="col-span-4 p-6 border-l-0 md:border-l-4 md:border-r-4 border-black font-bold bg-[#FFD200]/20">
                Native offline-capable parsing via <span className="font-black">window.Anna.llm</span>. Immediate inference of scopes and threat vectors.
              </div>
              <div className="col-span-4 p-6 font-bold text-gray-500 bg-[#e0f2fe]/50">
                Requires network round-trips to remote AI clusters, introducing severe latency and security risks.
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b-4 border-black text-xs hover:bg-gray-50 transition-colors">
              <div className="col-span-4 p-6 font-black uppercase flex items-center">Action Automation</div>
              <div className="col-span-4 p-6 border-l-0 md:border-l-4 md:border-r-4 border-black font-bold bg-[#FFD200]/20">
                Agent-driven intent execution wrapped in strict <span className="font-black">Human-in-the-Loop</span> UI gates for revocation.
              </div>
              <div className="col-span-4 p-6 font-bold text-gray-500 bg-[#e0f2fe]/50">
                Opaque background scripts running cron jobs. Hard to trace or intercept automated destructive actions.
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-12 text-xs hover:bg-gray-50 transition-colors">
              <div className="col-span-4 p-6 font-black uppercase flex items-center">Creator Visibility</div>
              <div className="col-span-4 p-6 border-l-0 md:border-l-4 md:border-r-4 border-black font-bold bg-[#FFD200]/20">
                Immediate. Launch the static app and start injecting keys into local storage instantly.
              </div>
              <div className="col-span-4 p-6 font-bold text-[#FF4B91] bg-[#fee2e2]/50">
                Requires complex IAM role provisioning, VPC peering, and extensive Terraform templates.
              </div>
            </div>
          </div>
        </motion.section>

        {/* =======================
            5. BLUE "REAL PRODUCT" BOX
            ======================= */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="bg-[#00E5FF] border-4 border-black rounded-3xl p-10 md:p-14 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="mb-12 relative z-10">
              <span className="font-black text-[10px] text-black/60 uppercase tracking-widest mb-2 block">FROM THE REAL PRODUCT</span>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-4">
                Threat evaluations, scope inferences, and simulations
              </h2>
              <p className="font-bold text-black max-w-2xl text-sm">
                These views are generated entirely via the Anna Platform SDK on the client side, allowing you to debug and trace agent decisions securely.
              </p>
            </div>

            {/* Floating Decorative Object - Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 lg:right-20 w-24 h-24 border-4 border-black border-dashed rounded-full flex items-center justify-center opacity-30 z-0"
            ></motion.div>
            <motion.div
              variants={floatAnimation}
              animate="animate"
              className="absolute top-14 right-14 lg:right-24 w-16 h-16 bg-[#FF4B91] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20"
            >
              <Orbit className="w-8 h-8 text-white" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column Mock UI */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="lg:col-span-7 bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Global Report Output</span>
                  <div className="px-3 py-1 bg-[#FF4B91] border-2 border-black text-white font-black text-[10px] uppercase rounded-full">Live Generation</div>
                </div>
                
                <h3 className="font-black text-xl uppercase tracking-tighter mb-4">Vault metrics in action</h3>
                
                <div className="bg-[#FFD200] border-4 border-black rounded-xl p-6 mb-6">
                  <span className="font-black text-[10px] text-black uppercase tracking-widest block mb-2">SCAN RESULT 01</span>
                  <h3 className="font-black text-lg uppercase tracking-tighter mb-4">Which keys are over-privileged?</h3>
                  
                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-2 border-black p-3 rounded-lg relative flex justify-between items-center z-10 overflow-hidden cursor-default">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} transition={{ duration: 1, delay: 0.2 }} className="absolute left-0 top-0 bottom-0 bg-[#00CD74] opacity-30 -z-10"></motion.div>
                      <span className="font-bold text-sm">Excessive API Scopes</span>
                      <span className="font-black text-sm">112</span>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-2 border-black p-3 rounded-lg relative flex justify-between items-center z-10 overflow-hidden cursor-default">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "50%" }} transition={{ duration: 1, delay: 0.4 }} className="absolute left-0 top-0 bottom-0 bg-blue-400 opacity-30 -z-10"></motion.div>
                      <span className="font-bold text-sm">Exposed to public repo</span>
                      <span className="font-black text-sm">210</span>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-2 border-black p-3 rounded-lg relative flex justify-between items-center z-10 overflow-hidden cursor-default">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "25%" }} transition={{ duration: 1, delay: 0.6 }} className="absolute left-0 top-0 bottom-0 bg-gray-300 -z-10"></motion.div>
                      <span className="font-bold text-sm">Stale credentials (90+ days)</span>
                      <span className="font-black text-sm">122</span>
                    </motion.div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="border-4 border-black p-4 text-center rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 block">Total Keys</span>
                    <span className="font-black text-2xl">124</span>
                  </div>
                  <div className="border-4 border-black p-4 text-center rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 block">Vulnerabilities</span>
                    <span className="font-black text-2xl">6 total</span>
                  </div>
                  <div className="border-4 border-black p-4 text-center rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 block">Avg Health</span>
                    <span className="font-black text-2xl">3.8</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column Stacked UIs */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Top Stack Card */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className="bg-[#FAF8F5] border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest block mb-1">SANDBOX ISOLATION</span>
                      <h3 className="font-black text-lg uppercase tracking-tight">Offline processing layer</h3>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#FF4B91]"></div>
                      <div className="w-2 h-2 rounded-full bg-[#FFD200]"></div>
                      <div className="w-2 h-2 rounded-full bg-[#00CD74]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 border-4 border-black p-3 bg-white rounded-lg">
                      <div className="w-6 h-6 bg-[#00CD74] border-2 border-black rounded-full flex items-center justify-center shrink-0"></div>
                      <span className="font-bold text-[10px] uppercase">All token state is strictly persisted inside your browser vault</span>
                    </div>
                    <div className="flex items-center gap-3 border-4 border-black p-3 bg-white rounded-lg">
                      <div className="w-6 h-6 bg-[#FFD200] border-2 border-black rounded-full flex items-center justify-center font-black text-[10px] shrink-0"></div>
                      <span className="font-bold text-[10px] uppercase">Zero exfiltration: we cannot remotely read your parsed API keys.</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Stack Card */}
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest block mb-1">LOCAL EXPORT & REPORTING</span>
                  <h3 className="font-black text-lg uppercase tracking-tight mb-4">Audit, Revoke, then extract logs</h3>
                  
                  <div className="flex justify-between items-stretch gap-4">
                    <div className="border-4 border-black p-3 rounded-lg bg-gray-50 flex-1 flex flex-col justify-center">
                      <span className="font-black text-[10px] uppercase text-gray-500 block mb-1">AUDIT SUMMARY</span>
                      <span className="font-black text-xs uppercase text-[#00E5FF]">keypulse-audit-report.json</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.section>

        {/* =======================
            6. GREEN FINAL CTA BOX
            ======================= */}
        <motion.section 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="bg-[#00CD74] border-4 border-black rounded-3xl p-10 md:p-14 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-block px-4 py-1.5 bg-white border-2 border-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
                FINAL CTA
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
                Ready to secure your workspace with zero backend compromise?
              </h2>
              <p className="font-bold text-black text-sm mb-8 max-w-md">
                Sign in to create your native SOC workspace. Import your keys via OSINT scanner or Universal fetcher, and let the AI do the rest.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="./login.html" className="px-6 py-3 bg-white text-black border-4 border-black font-black uppercase text-xs tracking-widest rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  INITIALIZE SESSION
                </a>
                <a href="./osint-scanner.html" className="px-6 py-3 bg-[#FFD200] text-black border-4 border-black font-black uppercase text-xs tracking-widest rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  EXPLORE THE FLOW
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.div whileHover={{ x: -10 }} className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative ml-0 cursor-default">
                <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest block mb-1">BENEFIT 01</span>
                <h4 className="font-black text-sm uppercase tracking-tight">Native browser processing with offline capability</h4>
              </motion.div>
              <motion.div whileHover={{ x: -10 }} className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative ml-0 cursor-default">
                <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest block mb-1">BENEFIT 02</span>
                <h4 className="font-black text-sm uppercase tracking-tight">Instant OSINT scanning for leaked credentials</h4>
              </motion.div>
              <div className="grid grid-cols-2 gap-4 bg-transparent border-none shadow-none p-0">
                <motion.div whileHover={{ y: -5 }} className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
                   <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest block mb-1">BENEFIT 03</span>
                   <h4 className="font-black text-sm uppercase tracking-tight">Real-time simulation for payload testing</h4>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-[#FFD200] border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-default">
                   <span className="font-black text-[10px] text-gray-500 uppercase tracking-widest block mb-1">BENEFIT 04</span>
                   <h4 className="font-black text-sm uppercase tracking-tight">Granular controls for token revocation</h4>
                </motion.div>
              </div>
            </div>
            
          </div>
        </motion.section>

      </main>

      {/* =======================
          7. FOOTER
          ======================= */}
      <footer className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-[#111] text-white border-4 border-black rounded-3xl p-10 flex flex-col lg:flex-row justify-between items-start gap-12 shadow-[8px_8px_0px_0px_#FFD200]">
          
          <div className="max-w-md">
             <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest block mb-2">PULSEBOARD ANALYTICS SYSTEM</span>
            <h3 className="font-black text-3xl uppercase tracking-tighter text-white flex items-center gap-3 mb-4">
              PulseBoard
            </h3>
            <p className="font-bold text-gray-300 text-xs leading-relaxed mb-4">
              A complete SOC workspace built strictly for the Anna Platform. Bringing Zero-Trust architecture down to the browser layer. KeyPulse is a fully client-side key auditing architecture.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-end">
              <a href="#features" className="px-5 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-gray-200 transition-colors border-2 border-black">FEATURES</a>
              <a href="#compare" className="px-5 py-2 bg-[#FFD200] text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-yellow-400 transition-colors border-2 border-black">COMPARISON</a>
            </div>
            <div className="flex gap-4 justify-end">
              <a href="./learn-more.html" className="px-5 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-gray-200 transition-colors border-2 border-black">DOCUMENTATION</a>
              <a href="./login.html" className="px-5 py-2 bg-[#FFD200] text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-yellow-400 transition-colors border-2 border-black">ENTER VAULT</a>
            </div>
          </div>
          
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center px-4 mt-6 gap-4">
          <div className="flex gap-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">
            <a href="./index.html">SCAN, AUDIT, SIMULATE, REVOKE.</a>
          </div>
          <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest border border-gray-300 px-3 py-1 rounded-full">
            THANK YOU FOR SECURING YOUR CREDENTIALS.
          </div>
        </div>
      </footer>

    </div>
  );
}

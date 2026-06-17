"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, CheckCircle, Loader2, Link2, ShieldAlert } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useKeyManager } from '../../hooks/useKeyManager';

const INTEGRATION_SERVICES = [
  { id: 'openai', name: 'OpenAI', subtitle: 'AI Model Operations', desc: 'Grants access to text, image, and embedding model inference endpoints.' },
  { id: 'stripe', name: 'Stripe', subtitle: 'Financial Infrastructure', desc: 'Securely processes payments, manages subscriptions, and handles billing logic.' },
  { id: 'aws', name: 'AWS', subtitle: 'Cloud Infrastructure', desc: 'Root IAM permissions for S3, EC2, Lambda, and core cloud provisioning.' },
  { id: 'github', name: 'GitHub', subtitle: 'Version Control', desc: 'Manages repository operations, code scanning, and CI/CD actions.' },
  { id: 'twilio', name: 'Twilio', subtitle: 'Communications API', desc: 'Routes programmatic SMS, voice, and WhatsApp messaging globally.' },
  { id: 'anthropic', name: 'Anthropic', subtitle: 'Claude LLM API', desc: 'Direct integration with Claude 3 Opus and Sonnet intelligence engines.' }
];

type ModalStatus = 'idle' | 'authorizing' | 'fetching' | 'success';

export default function IntegrationsHubPage() {
  const { addKey } = useKeyManager();
  const [identity, setIdentity] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<typeof INTEGRATION_SERVICES[0] | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>('idle');

  useEffect(() => {
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && window.Anna?.identity?.id) {
        setIdentity(window.Anna.identity.id);
      } else {
        setIdentity('Anna Platform Dev Session');
      }
    };
    initIdentity();
  }, []);

  const openModal = (service: typeof INTEGRATION_SERVICES[0]) => {
    setSelectedService(service);
    setModalStatus('idle');
  };

  const closeModal = () => {
    if (modalStatus !== 'authorizing' && modalStatus !== 'fetching') {
      setSelectedService(null);
    }
  };

  const handleConnect = () => {
    if (!selectedService) return;
    
    setModalStatus('authorizing');
    
    setTimeout(() => {
      setModalStatus('fetching');
      
      setTimeout(() => {
        // Success State
        setModalStatus('success');
        
        // Wire Data Injection
        const generatedKeyValue = `sk_live_${Math.random().toString(36).substring(2, 12)}...`;
        addKey(`${selectedService.name} Auto-Integration`, generatedKeyValue);
        
      }, 800);
    }, 800);
  };

  return (
    <>
      <DashboardLayout identity={identity}>
        <div className="bg-[#FAF8F5] min-h-full p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl relative overflow-hidden">
          
          <div className="mb-10 border-b-4 border-black pb-4">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Integrations Hub</h2>
            <p className="text-sm font-bold text-gray-600 uppercase mt-2 tracking-widest">
              1-Click Verified Service Connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INTEGRATION_SERVICES.map((service) => (
              <div key={service.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6 flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000000] transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">{service.name}</h3>
                    <div className="w-10 h-10 border-4 border-black bg-gray-100 flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_#000000]">
                      <Link2 className="w-5 h-5 text-black" />
                    </div>
                  </div>
                  <p className="font-mono text-sm font-bold text-[#B624FF] uppercase tracking-widest mb-4 bg-gray-100 p-2 border-2 border-black inline-block">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-700 font-bold text-sm mb-8 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                
                <button 
                  onClick={() => openModal(service)}
                  className="w-full py-4 bg-[#FFD200] border-4 border-black text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Configure Connection
                </button>
              </div>
            ))}
          </div>

        </div>
      </DashboardLayout>

      {/* Tactile State Machine Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-white/80" onClick={closeModal} />
          
          <div className={`w-full max-w-xl border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10 flex flex-col transition-colors duration-200 ${
            modalStatus === 'fetching' ? 'bg-[#00E5FF]' :
            modalStatus === 'success' ? 'bg-[#00CD74]' :
            'bg-white'
          }`}>
            
            {/* Header */}
            <div className={`p-6 border-b-4 border-black flex justify-between items-center ${
              modalStatus === 'authorizing' ? 'bg-[#FFD200]' : 
              modalStatus === 'fetching' ? 'bg-[#00E5FF]' :
              modalStatus === 'success' ? 'bg-[#00CD74]' :
              'bg-black text-white'
            }`}>
              <h2 className={`text-2xl font-black uppercase tracking-tight ${
                (modalStatus === 'authorizing' || modalStatus === 'fetching' || modalStatus === 'success') ? 'text-black' : 'text-white'
              }`}>
                {serviceNameHeader(selectedService.name, modalStatus)}
              </h2>
              {modalStatus !== 'authorizing' && modalStatus !== 'fetching' && (
                <button 
                  onClick={closeModal}
                  className={`w-10 h-10 border-4 border-black flex items-center justify-center hover:bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    modalStatus === 'success' ? 'bg-white' : 'bg-white'
                  }`}
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
              
              {modalStatus === 'idle' && (
                <div className="w-full flex flex-col items-center">
                  <ShieldAlert className="w-16 h-16 text-black mb-6" />
                  <p className="font-bold text-gray-700 uppercase mb-8">
                    Grant KeyPulse Platform permission to generate and store cryptographic keys for {selectedService.name}.
                  </p>
                  <button 
                    onClick={handleConnect}
                    className="w-full py-5 bg-[#00E5FF] border-4 border-black text-black text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    1-Click Connect & Fetch
                  </button>
                </div>
              )}

              {modalStatus === 'authorizing' && (
                <div className="w-full flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-black animate-spin mb-6" />
                  <p className="font-black text-black text-xl uppercase tracking-widest mb-4">
                    Authorizing as [{identity}]...
                  </p>
                  <div className="w-full h-8 border-4 border-black bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-black animate-[pulse_0.4s_infinite]" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}

              {modalStatus === 'fetching' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-16 h-16 border-8 border-black border-t-white animate-spin rounded-full mb-6"></div>
                  <p className="font-black text-black text-xl uppercase tracking-widest">
                    Generating cryptographic key signatures securely...
                  </p>
                </div>
              )}

              {modalStatus === 'success' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-24 h-24 bg-black border-4 border-white flex items-center justify-center rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] mb-8">
                    <CheckCircle className="w-12 h-12 text-[#00CD74]" />
                  </div>
                  <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
                    Integration Established Successfully!
                  </h3>
                  
                  <Link 
                    href="/"
                    className="w-full py-4 bg-white border-4 border-black text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    ← Return to Operational Core
                  </Link>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}

function serviceNameHeader(name: string, status: ModalStatus) {
  if (status === 'success') return 'VERIFIED CONNECTION';
  if (status === 'fetching') return 'SECURE HANDSHAKE';
  if (status === 'authorizing') return 'AUTHORIZATION REQUIRED';
  return `${name} INTEGRATION`;
}

"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ExternalLink, CreditCard, Cpu, Lock, Database, Cloud, MessageSquare } from 'lucide-react';

export interface ApiProviderMetadata {
  id: string;
  provider: string;
  category: 'AI & Machine Learning' | 'Authentication & Identity' | 'Databases & Storage' | 'Payments & Billing' | 'Communications' | 'DevOps & Infrastructure';
  portalUrl: string;
  examplePattern: string;
}

export const API_METADATA_CATALOG: ApiProviderMetadata[] = [
  { id: 'openai', provider: 'OPENAI', category: 'AI & Machine Learning', portalUrl: 'https://platform.openai.com/api-keys', examplePattern: 'sk-proj-...' },
  { id: 'anthropic', provider: 'ANTHROPIC', category: 'AI & Machine Learning', portalUrl: 'https://console.anthropic.com/settings/keys', examplePattern: 'sk-ant-...' },
  { id: 'cohere', provider: 'COHERE', category: 'AI & Machine Learning', portalUrl: 'https://dashboard.cohere.com/api-keys', examplePattern: 'pk_...' },
  { id: 'huggingface', provider: 'HUGGING FACE', category: 'AI & Machine Learning', portalUrl: 'https://huggingface.co/settings/tokens', examplePattern: 'hf_...' },
  { id: 'replicate', provider: 'REPLICATE', category: 'AI & Machine Learning', portalUrl: 'https://replicate.com/account/api-tokens', examplePattern: 'r8_...' },
  { id: 'groq', provider: 'GROQ', category: 'AI & Machine Learning', portalUrl: 'https://console.groq.com/keys', examplePattern: 'gsk_...' },
  { id: 'googleai', provider: 'GOOGLE AI STUDIO', category: 'AI & Machine Learning', portalUrl: 'https://aistudio.google.com/app/apikey', examplePattern: 'AIzaSy...' },
  { id: 'pinecone', provider: 'PINECONE', category: 'AI & Machine Learning', portalUrl: 'https://app.pinecone.io/', examplePattern: 'pcsk_...' },
  { id: 'mistral', provider: 'MISTRAL AI', category: 'AI & Machine Learning', portalUrl: 'https://console.mistral.ai/api-keys/', examplePattern: 'm_...' },
  { id: 'assemblyai', provider: 'ASSEMBLYAI', category: 'AI & Machine Learning', portalUrl: 'https://www.assemblyai.com/app', examplePattern: 'as_...' },
  { id: 'clerk', provider: 'CLERK', category: 'Authentication & Identity', portalUrl: 'https://dashboard.clerk.com/', examplePattern: 'sk_live_...' },
  { id: 'auth0', provider: 'AUTH0', category: 'Authentication & Identity', portalUrl: 'https://manage.auth0.com/', examplePattern: 'auth0|...' },
  { id: 'firebase', provider: 'FIREBASE', category: 'Authentication & Identity', portalUrl: 'https://console.firebase.google.com/', examplePattern: 'AIzaSy...' },
  { id: 'supabaseauth', provider: 'SUPABASE AUTH', category: 'Authentication & Identity', portalUrl: 'https://supabase.com/dashboard/project/_/settings/api', examplePattern: 'sbp_...' },
  { id: 'stytch', provider: 'STYTCH', category: 'Authentication & Identity', portalUrl: 'https://stytch.com/dashboard', examplePattern: 'project-live-...' },
  { id: 'kinde', provider: 'KINDE', category: 'Authentication & Identity', portalUrl: 'https://kinde.com/', examplePattern: 'kinde_...' },
  { id: 'workos', provider: 'WORKOS', category: 'Authentication & Identity', portalUrl: 'https://dashboard.workos.com/', examplePattern: 'sk_live_...' },
  { id: 'planetscale', provider: 'PLANETSCALE', category: 'Databases & Storage', portalUrl: 'https://database.planetscale.com/', examplePattern: 'pscale_pw_...' },
  { id: 'neon', provider: 'NEON', category: 'Databases & Storage', portalUrl: 'https://console.neon.tech/', examplePattern: 'postgres://...' },
  { id: 'mongodb', provider: 'MONGODB ATLAS', category: 'Databases & Storage', portalUrl: 'https://cloud.mongodb.com/', examplePattern: 'mongodb+srv://...' },
  { id: 'upstash', provider: 'UPSTASH', category: 'Databases & Storage', portalUrl: 'https://console.upstash.com/', examplePattern: 'upstash_...' },
  { id: 'redis', provider: 'REDIS LABS', category: 'Databases & Storage', portalUrl: 'https://app.redislabs.com/', examplePattern: 'redis://...' },
  { id: 'cockroach', provider: 'COCKROACHDB', category: 'Databases & Storage', portalUrl: 'https://cockroachlabs.cloud/', examplePattern: 'ccdb_...' },
  { id: 'turso', provider: 'TURSO', category: 'Databases & Storage', portalUrl: 'https://turso.tech/', examplePattern: 'libsql://...' },
  { id: 'xata', provider: 'XATA', category: 'Databases & Storage', portalUrl: 'https://app.xata.io/', examplePattern: 'xat_...' },
  { id: 'supabasestorage', provider: 'SUPABASE STORAGE', category: 'Databases & Storage', portalUrl: 'https://supabase.com/dashboard/project/_/storage/buckets', examplePattern: 'eyJhbG...' },
  { id: 'stripe', provider: 'STRIPE', category: 'Payments & Billing', portalUrl: 'https://dashboard.stripe.com/apikeys', examplePattern: 'sk_live_...' },
  { id: 'paypal', provider: 'PAYPAL', category: 'Payments & Billing', portalUrl: 'https://developer.paypal.com/dashboard/applications/live', examplePattern: 'A21AA...' },
  { id: 'lemonsqueezy', provider: 'LEMON SQUEEZY', category: 'Payments & Billing', portalUrl: 'https://app.lemonsqueezy.com/settings/api', examplePattern: 'ls_...' },
  { id: 'paddle', provider: 'PADDLE', category: 'Payments & Billing', portalUrl: 'https://vendor.paddle.com/', examplePattern: 'pdl_...' },
  { id: 'razorpay', provider: 'RAZORPAY', category: 'Payments & Billing', portalUrl: 'https://dashboard.razorpay.com/#/app/keys', examplePattern: 'rzp_live_...' },
  { id: 'braintree', provider: 'BRAINTREE', category: 'Payments & Billing', portalUrl: 'https://www.braintreedata.com/', examplePattern: 'bt_...' },
  { id: 'twilio', provider: 'TWILIO', category: 'Communications', portalUrl: 'https://www.twilio.com/console', examplePattern: 'AC...' },
  { id: 'resend', provider: 'RESEND', category: 'Communications', portalUrl: 'https://resend.com/api-keys', examplePattern: 're_...' },
  { id: 'sendgrid', provider: 'SENDGRID', category: 'Communications', portalUrl: 'https://app.sendgrid.com/settings/api_keys', examplePattern: 'SG_...' },
  { id: 'mailgun', provider: 'MAILGUN', category: 'Communications', portalUrl: 'https://app.mailgun.com/app/account/keys', examplePattern: 'key-...' },
  { id: 'postmark', provider: 'POSTMARK', category: 'Communications', portalUrl: 'https://account.postmarkapp.com/', examplePattern: 'server_...' },
  { id: 'plivo', provider: 'PLIVO', category: 'Communications', portalUrl: 'https://console.plivo.com/', examplePattern: 'MA...' },
  { id: 'vonage', provider: 'VONAGE', category: 'Communications', portalUrl: 'https://dashboard.nexmo.com/', examplePattern: 'vn_...' },
  { id: 'aws', provider: 'AWS IAM', category: 'DevOps & Infrastructure', portalUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials', examplePattern: 'AKIA...' },
  { id: 'gcp', provider: 'GOOGLE CLOUD', category: 'DevOps & Infrastructure', portalUrl: 'https://console.cloud.google.com/apis/credentials', examplePattern: 'AIzaSy...' },
  { id: 'vercel', provider: 'VERCEL', category: 'DevOps & Infrastructure', portalUrl: 'https://vercel.com/account/tokens', examplePattern: 'v_...' },
  { id: 'netlify', provider: 'NETLIFY', category: 'DevOps & Infrastructure', portalUrl: 'https://app.netlify.com/user/settings/applications', examplePattern: 'nf_...' },
  { id: 'railway', provider: 'RAILWAY', category: 'DevOps & Infrastructure', portalUrl: 'https://railway.app/dashboard', examplePattern: 'rw_...' },
  { id: 'render', provider: 'RENDER', category: 'DevOps & Infrastructure', portalUrl: 'https://dashboard.render.com/', examplePattern: 'rnd_...' },
  { id: 'github', provider: 'GITHUB', category: 'DevOps & Infrastructure', portalUrl: 'https://github.com/settings/tokens', examplePattern: 'ghp_...' },
  { id: 'gitlab', provider: 'GITLAB', category: 'DevOps & Infrastructure', portalUrl: 'https://gitlab.com/-/profile/personal_access_tokens', examplePattern: 'glpat-...' },
  { id: 'cloudflare', provider: 'CLOUDFLARE', category: 'DevOps & Infrastructure', portalUrl: 'https://dash.cloudflare.com/profile/api-tokens', examplePattern: 'cfl_...' },
  { id: 'digitalocean', provider: 'DIGITALOCEAN', category: 'DevOps & Infrastructure', portalUrl: 'https://cloud.digitalocean.com/account/api/tokens', examplePattern: 'dop_v1_...' },
  { id: 'slack', provider: 'SLACK APPS', category: 'DevOps & Infrastructure', portalUrl: 'https://api.slack.com/apps', examplePattern: 'xoxb-...' }
];

const CATEGORY_MAP = {
  'Payments & Billing': { icon: <CreditCard className="w-8 h-8 text-black" />, color: "bg-[#00CD74]" },
  'AI & Machine Learning': { icon: <Cpu className="w-8 h-8 text-black" />, color: "bg-[#00E5FF]" },
  'Authentication & Identity': { icon: <Lock className="w-8 h-8 text-black" />, color: "bg-[#FFD200]" },
  'Databases & Storage': { icon: <Database className="w-8 h-8 text-white" />, color: "bg-[#FF4B91]" },
  'DevOps & Infrastructure': { icon: <Cloud className="w-8 h-8 text-white" />, color: "bg-black" },
  'Communications': { icon: <MessageSquare className="w-8 h-8 text-black" />, color: "bg-[#FF8A00]" },
};

export default function AboutKeysPage() {
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    const initIdentity = async () => {
      if (typeof window !== 'undefined' && (window as any).Anna?.identity?.id) {
        setIdentity((window as any).Anna.identity.id);
      } else {
        setIdentity('Anna Platform Dev Session');
      }
    };
    initIdentity();
  }, []);

  // Group APIs by category
  const groupedKeys = API_METADATA_CATALOG.reduce((acc, api) => {
    if (!acc[api.category]) {
      acc[api.category] = [];
    }
    acc[api.category].push(api);
    return acc;
  }, {} as Record<string, ApiProviderMetadata[]>);

  // Get unique categories maintaining order
  const categories = Object.keys(groupedKeys) as Array<keyof typeof CATEGORY_MAP>;

  return (
    <DashboardLayout>
      <div className="bg-[#FAF8F5] min-h-full pb-12">
        
        <div className="mb-10 border-b-8 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-black text-black uppercase tracking-tighter">About Keys</h2>
            <p className="text-lg font-bold text-gray-600 uppercase mt-2 tracking-widest max-w-2xl">
              Master API Catalog Reference
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {categories.map((category, idx) => {
            const config = CATEGORY_MAP[category] || { icon: <ExternalLink className="w-8 h-8 text-black" />, color: "bg-gray-200" };
            const services = groupedKeys[category];

            return (
              <div key={idx} className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
                <div className={`${config.color} p-4 border-b-4 border-black flex items-center gap-4`}>
                  {config.icon}
                  <h3 className={`text-2xl font-black uppercase tracking-widest ${config.color === 'bg-black' || config.color === 'bg-[#FF4B91]' ? 'text-white' : 'text-black'}`}>
                    {category}
                  </h3>
                </div>
                
                <div className="divide-y-4 divide-black">
                  {services.map((svc, i) => (
                    <div key={i} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-black uppercase tracking-tighter mb-1">{svc.provider}</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 border-2 border-black">Format: {svc.examplePattern}</span>
                        </div>
                      </div>
                      
                      <a 
                        href={svc.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-4 border-black text-black font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD200] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Developer Portal
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}

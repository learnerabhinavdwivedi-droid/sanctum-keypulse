// src/lib/keyValidator.ts
// Real API key validator — pings each provider's auth endpoint to check
// key validity, scopes, and usage/quota data.
// All calls go direct from the iframe (allowed via manifest external_origins).
// Covers 50 providers across AI, Auth, DB, Payments, Comms, DevOps.

export type ValidationResult = {
  valid: boolean | null; // null = pattern matched only, not live-validated
  provider: string;
  label: string;
  scopes: string[];
  usage: {
    requestsToday?: number;
    quotaLimit?: number;
    rateLimitRemaining?: number;
    rateLimitReset?: string;
    planName?: string;
  };
  accountInfo: Record<string, unknown>;
  risks: string[];
  latencyMs: number;
  error?: string;
  patternMatched?: boolean;
  checkedAt: string;
};

type ProviderDef = {
  name: string;
  detect: (key: string) => boolean;
  validate: (key: string) => Promise<ValidationResult>;
};

const t0 = () => Date.now();

// ── Helper: pattern-only result ───────────────────────────────────────────────
function patternOnly(provider: string, label: string, risks: string[] = []): ValidationResult {
  return {
    valid: null,
    provider,
    label,
    scopes: [],
    usage: {},
    accountInfo: {},
    risks: [
      'Pattern matched — live validation requires server-side proxy',
      ...risks,
    ],
    latencyMs: 0,
    patternMatched: true,
    checkedAt: new Date().toISOString(),
  };
}

// ── Helper: standard GET validate ────────────────────────────────────────────
async function stdGet(
  url: string,
  headers: Record<string, string>,
  start: number,
  provider: string,
  label: string,
  onSuccess: (data: Record<string, unknown>, res: Response) => Partial<ValidationResult>,
): Promise<ValidationResult> {
  try {
    const res = await fetch(url, { headers });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      return {
        valid: false, provider, label, scopes: [], usage: {}, accountInfo: {},
        risks: ['Invalid or expired key'],
        latencyMs, error: `HTTP ${res.status}`, checkedAt: new Date().toISOString(),
      };
    }
    const data = await res.json() as Record<string, unknown>;
    return {
      valid: true, provider, label, scopes: [], usage: {}, accountInfo: {}, risks: [],
      latencyMs, checkedAt: new Date().toISOString(),
      ...onSuccess(data, res),
    };
  } catch (err) {
    return {
      valid: false, provider, label, scopes: [], usage: {}, accountInfo: {}, risks: [],
      latencyMs: Date.now() - start, error: String(err), checkedAt: new Date().toISOString(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI & MACHINE LEARNING
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. Anthropic (must be before OpenAI sk- check) ───────────────────────────
const anthropic: ProviderDef = {
  name: 'Anthropic',
  detect: (k) => k.startsWith('sk-ant-'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.anthropic.com/v1/models',
      { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      start, 'Anthropic', 'Anthropic API Key',
      (data) => {
        const models = ((data.data as Array<{ id: string }>) ?? []).map(m => m.id);
        return {
          scopes: ['models:read'],
          accountInfo: { modelsAvailable: models.length, models: models.slice(0, 5) },
        };
      },
    );
  },
};

// ── 2. OpenAI ─────────────────────────────────────────────────────────────────
const openai: ProviderDef = {
  name: 'OpenAI',
  detect: (k) => k.startsWith('sk-') && !k.startsWith('sk-ant-'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.openai.com/v1/models',
      { Authorization: `Bearer ${key}` },
      start, 'OpenAI', 'OpenAI API Key',
      (data) => {
        const models = ((data.data as Array<{ id: string }>) ?? []).map(m => m.id);
        const hasGpt4 = models.some(m => m.includes('gpt-4'));
        const risks = hasGpt4 ? ['Key has GPT-4 access — use project keys to limit scope'] : [];
        return {
          scopes: hasGpt4 ? ['models:read', 'gpt-4:access'] : ['models:read'],
          accountInfo: { modelsAvailable: models.length, hasGpt4Access: hasGpt4 },
          risks,
        };
      },
    );
  },
};

// ── 3. Cohere ─────────────────────────────────────────────────────────────────
const cohere: ProviderDef = {
  name: 'Cohere',
  detect: (k) => k.startsWith('pk_'),
  async validate(key) {
    const start = t0();
    try {
      const res = await fetch('https://api.cohere.ai/v1/check-api-key', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const latencyMs = Date.now() - start;
      if (!res.ok) {
        return { valid: false, provider: 'Cohere', label: 'Cohere API Key', scopes: [], usage: {}, accountInfo: {}, risks: ['Invalid or expired key'], latencyMs, error: `HTTP ${res.status}`, checkedAt: new Date().toISOString() };
      }
      const data = await res.json() as Record<string, unknown>;
      return {
        valid: true, provider: 'Cohere', label: 'Cohere API Key',
        scopes: ['api:read'],
        usage: {},
        accountInfo: { valid: data.valid },
        risks: [], latencyMs, checkedAt: new Date().toISOString(),
      };
    } catch (err) {
      return { valid: false, provider: 'Cohere', label: 'Cohere API Key', scopes: [], usage: {}, accountInfo: {}, risks: [], latencyMs: Date.now() - start, error: String(err), checkedAt: new Date().toISOString() };
    }
  },
};

// ── 4. HuggingFace ────────────────────────────────────────────────────────────
const huggingface: ProviderDef = {
  name: 'HuggingFace',
  detect: (k) => k.startsWith('hf_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://huggingface.co/api/whoami',
      { Authorization: `Bearer ${key}` },
      start, 'HuggingFace', 'HuggingFace Token',
      (data) => {
        const auth = data.auth as Record<string, unknown> | undefined;
        const accessToken = auth?.accessToken as Record<string, unknown> | undefined;
        const scopes = (accessToken?.fineGrained as Record<string, string[]> | undefined)?.global ?? [];
        return {
          label: `HF · ${data.name}`,
          scopes,
          accountInfo: { name: data.name, fullName: data.fullname, type: data.type },
          risks: scopes.includes('write') ? ['Token has write access — use read-only tokens where possible'] : [],
        };
      },
    );
  },
};

// ── 5. Replicate ──────────────────────────────────────────────────────────────
const replicate: ProviderDef = {
  name: 'Replicate',
  detect: (k) => k.startsWith('r8_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.replicate.com/v1/account',
      { Authorization: `Token ${key}` },
      start, 'Replicate', 'Replicate API Token',
      (data) => ({
        label: `Replicate · ${data.username ?? data.name}`,
        scopes: ['account:read'],
        accountInfo: { username: data.username, name: data.name, type: data.type },
      }),
    );
  },
};

// ── 6. Groq ───────────────────────────────────────────────────────────────────
const groq: ProviderDef = {
  name: 'Groq',
  detect: (k) => k.startsWith('gsk_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.groq.com/openai/v1/models',
      { Authorization: `Bearer ${key}` },
      start, 'Groq', 'Groq API Key',
      (data) => {
        const models = ((data.data as Array<{ id: string }>) ?? []).map(m => m.id);
        return {
          scopes: ['models:read'],
          accountInfo: { modelsAvailable: models.length },
        };
      },
    );
  },
};

// ── 7. Google AI / Firebase / GCP (AIzaSy prefix) ────────────────────────────
const googleAI: ProviderDef = {
  name: 'Google AI',
  detect: (k) => k.startsWith('AIzaSy'),
  async validate(key) {
    const start = t0();
    return stdGet(
      `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(key)}`,
      {},
      start, 'Google AI', 'Google API Key',
      (data) => {
        const models = ((data.models as Array<{ name: string }>) ?? []).map(m => m.name);
        return {
          scopes: ['generativelanguage:read'],
          accountInfo: { modelsAvailable: models.length },
          risks: ['Shared key prefix with Firebase/GCP — confirm scope is intentional'],
        };
      },
    );
  },
};

// ── 8. Pinecone (pattern only — needs host) ───────────────────────────────────
const pinecone: ProviderDef = {
  name: 'Pinecone',
  detect: (k) => k.startsWith('pcsk_'),
  async validate(_key) {
    return patternOnly('Pinecone', 'Pinecone API Key', ['Validation requires a Pinecone host URL — use the Pinecone console to verify']);
  },
};

// ── 9. Mistral ────────────────────────────────────────────────────────────────
// Mistral keys don't have a clean well-known prefix; detect as fallback after others
const mistral: ProviderDef = {
  name: 'Mistral',
  // Mistral API keys are ~32 char alphanumeric, no distinctive prefix
  // We detect them after all other providers have been exhausted — handled in fallback
  detect: (_k) => false, // registered in ordered list as a last-resort validator
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.mistral.ai/v1/models',
      { Authorization: `Bearer ${key}` },
      start, 'Mistral', 'Mistral API Key',
      (data) => {
        const models = ((data.data as Array<{ id: string }>) ?? []).map(m => m.id);
        return {
          scopes: ['models:read'],
          accountInfo: { modelsAvailable: models.length },
        };
      },
    );
  },
};

// ── 10. AssemblyAI (pattern only) ─────────────────────────────────────────────
const assemblyai: ProviderDef = {
  name: 'AssemblyAI',
  detect: (k) => k.startsWith('as_'),
  async validate(_key) {
    return patternOnly('AssemblyAI', 'AssemblyAI API Key');
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION & IDENTITY
// ═══════════════════════════════════════════════════════════════════════════════

// ── 11. Clerk ─────────────────────────────────────────────────────────────────
// Must check before Stripe for sk_live_ / sk_test_ ambiguity
const clerk: ProviderDef = {
  name: 'Clerk',
  detect: (k) => (k.startsWith('sk_live_') || k.startsWith('sk_test_')) && !k.startsWith('sk_live_') || k.includes('_clerk_') || k.startsWith('sk_live_clerk'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.clerk.com/v1/users?limit=1',
      { Authorization: `Bearer ${key}` },
      start, 'Clerk', 'Clerk Secret Key',
      (data) => ({
        scopes: ['users:read'],
        accountInfo: { userCount: Array.isArray(data) ? data.length : 'unknown' },
      }),
    );
  },
};

// ── 12. Supabase service role (sbp_ prefix) ───────────────────────────────────
const supabase: ProviderDef = {
  name: 'Supabase',
  detect: (k) => k.startsWith('sbp_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.supabase.com/v1/projects',
      { Authorization: `Bearer ${key}` },
      start, 'Supabase', 'Supabase Service Key',
      (data) => ({
        scopes: ['projects:read'],
        accountInfo: { projectCount: Array.isArray(data) ? data.length : 'unknown' },
      }),
    );
  },
};

// ── 13. Supabase JWT (eyJhbG prefix) ──────────────────────────────────────────
const supabaseJwt: ProviderDef = {
  name: 'Supabase',
  detect: (k) => k.startsWith('eyJhbG'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.supabase.com/v1/projects',
      { Authorization: `Bearer ${key}` },
      start, 'Supabase', 'Supabase JWT Token',
      (data) => ({
        scopes: ['projects:read'],
        accountInfo: { projectCount: Array.isArray(data) ? data.length : 'unknown' },
        risks: ['JWT token — ensure it is a service-role key, not an anon key stored insecurely'],
      }),
    );
  },
};

// ── 14. Stytch (pattern only) ─────────────────────────────────────────────────
const stytch: ProviderDef = {
  name: 'Stytch',
  detect: (k) => k.startsWith('project-live-') || k.startsWith('project-test-'),
  async validate(_key) {
    return patternOnly('Stytch', 'Stytch Project Key');
  },
};

// ── 15. Kinde (pattern only) ──────────────────────────────────────────────────
const kinde: ProviderDef = {
  name: 'Kinde',
  detect: (k) => k.startsWith('kinde_'),
  async validate(_key) {
    return patternOnly('Kinde', 'Kinde API Key');
  },
};

// ── 16. Auth0 (pattern only — needs domain) ───────────────────────────────────
const auth0: ProviderDef = {
  name: 'Auth0',
  detect: (k) => k.includes('auth0|'),
  async validate(_key) {
    return patternOnly('Auth0', 'Auth0 Token', ['Validation requires Auth0 domain — use Auth0 console to verify']);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASES & STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

// ── 17. PlanetScale ───────────────────────────────────────────────────────────
const planetscale: ProviderDef = {
  name: 'PlanetScale',
  detect: (k) => k.startsWith('pscale_pw_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.planetscale.com/v1/organizations',
      { Authorization: key },
      start, 'PlanetScale', 'PlanetScale Password',
      (data) => ({
        scopes: ['organizations:read'],
        accountInfo: { organizations: Array.isArray(data) ? data.length : 'unknown' },
      }),
    );
  },
};

// ── 18. Xata ──────────────────────────────────────────────────────────────────
const xata: ProviderDef = {
  name: 'Xata',
  detect: (k) => k.startsWith('xat_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.xata.io/user',
      { Authorization: `Bearer ${key}` },
      start, 'Xata', 'Xata API Key',
      (data) => ({
        label: `Xata · ${data.email ?? data.id}`,
        scopes: ['user:read'],
        accountInfo: { id: data.id, email: data.email },
      }),
    );
  },
};

// ── 19. Neon (pattern only — connection string) ───────────────────────────────
const neon: ProviderDef = {
  name: 'Neon',
  detect: (k) => k.startsWith('postgres://') || k.includes('.neon.tech'),
  async validate(_key) {
    return patternOnly('Neon', 'Neon Database URL', ['Connection string — do not expose in client-side code']);
  },
};

// ── 20. MongoDB (pattern only) ────────────────────────────────────────────────
const mongodb: ProviderDef = {
  name: 'MongoDB',
  detect: (k) => k.startsWith('mongodb+srv://') || k.startsWith('mongodb://'),
  async validate(_key) {
    return patternOnly('MongoDB', 'MongoDB Connection String', ['Connection string with credentials — do not expose in client-side code']);
  },
};

// ── 21. Upstash (pattern only) ────────────────────────────────────────────────
const upstash: ProviderDef = {
  name: 'Upstash',
  detect: (k) => k.startsWith('upstash_'),
  async validate(_key) {
    return patternOnly('Upstash', 'Upstash Token');
  },
};

// ── 22. Redis (pattern only) ──────────────────────────────────────────────────
const redis: ProviderDef = {
  name: 'Redis',
  detect: (k) => k.startsWith('redis://') || k.startsWith('rediss://'),
  async validate(_key) {
    return patternOnly('Redis', 'Redis Connection String', ['Connection string — do not expose in client-side code']);
  },
};

// ── 23. CockroachDB (pattern only) ────────────────────────────────────────────
const cockroachdb: ProviderDef = {
  name: 'CockroachDB',
  detect: (k) => k.startsWith('ccdb_'),
  async validate(_key) {
    return patternOnly('CockroachDB', 'CockroachDB Key');
  },
};

// ── 24. Turso (pattern only) ──────────────────────────────────────────────────
const turso: ProviderDef = {
  name: 'Turso',
  detect: (k) => k.startsWith('libsql://'),
  async validate(_key) {
    return patternOnly('Turso', 'Turso Database URL');
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS & BILLING
// ═══════════════════════════════════════════════════════════════════════════════

// ── 25. Stripe ────────────────────────────────────────────────────────────────
const stripe: ProviderDef = {
  name: 'Stripe',
  detect: (k) => k.startsWith('sk_live_') || k.startsWith('sk_test_') || k.startsWith('rk_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.stripe.com/v1/account',
      { Authorization: `Bearer ${key}` },
      start, 'Stripe', 'Stripe Secret Key',
      (data) => {
        const isLive = key.startsWith('sk_live_');
        return {
          label: `Stripe · ${data.display_name ?? data.id}`,
          scopes: isLive ? ['full_access:live'] : ['full_access:test'],
          usage: { planName: String(data.type ?? 'standard') },
          accountInfo: { id: data.id, displayName: data.display_name, country: data.country, email: data.email },
          risks: isLive ? ['LIVE key in vault — consider using restricted keys for non-critical services'] : [],
        };
      },
    );
  },
};

// ── 26. LemonSqueezy ──────────────────────────────────────────────────────────
const lemonsqueezy: ProviderDef = {
  name: 'LemonSqueezy',
  detect: (k) => k.startsWith('ls_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.lemonsqueezy.com/v1/users/me',
      { Authorization: `Bearer ${key}` },
      start, 'LemonSqueezy', 'LemonSqueezy API Key',
      (data) => {
        const attr = (data.data as Record<string, unknown>)?.attributes as Record<string, unknown> | undefined;
        return {
          label: `LS · ${attr?.name ?? attr?.email ?? 'LemonSqueezy'}`,
          scopes: ['user:read'],
          accountInfo: { name: attr?.name, email: attr?.email },
        };
      },
    );
  },
};

// ── 27. Razorpay (pattern only) ───────────────────────────────────────────────
const razorpay: ProviderDef = {
  name: 'Razorpay',
  detect: (k) => k.startsWith('rzp_live_') || k.startsWith('rzp_test_'),
  async validate(key) {
    const isLive = key.startsWith('rzp_live_');
    return {
      ...patternOnly('Razorpay', 'Razorpay API Key', isLive ? ['LIVE Razorpay key — use test keys for non-production environments'] : []),
      risks: ['Pattern matched — Razorpay requires key+secret pair for validation', ...(isLive ? ['LIVE key detected'] : [])],
    };
  },
};

// ── 28. Braintree (pattern only) ──────────────────────────────────────────────
const braintree: ProviderDef = {
  name: 'Braintree',
  detect: (k) => k.startsWith('bt_'),
  async validate(_key) {
    return patternOnly('Braintree', 'Braintree Token');
  },
};

// ── 29. Paddle (pattern only) ─────────────────────────────────────────────────
const paddle: ProviderDef = {
  name: 'Paddle',
  detect: (k) => k.startsWith('pdl_'),
  async validate(_key) {
    return patternOnly('Paddle', 'Paddle API Key');
  },
};

// ── 30. PayPal (pattern only) ─────────────────────────────────────────────────
const paypal: ProviderDef = {
  name: 'PayPal',
  detect: (k) => k.startsWith('A21AA'),
  async validate(_key) {
    return patternOnly('PayPal', 'PayPal Client ID', ['PayPal uses OAuth flow — validate via the PayPal developer console']);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ── 31. Resend ────────────────────────────────────────────────────────────────
const resend: ProviderDef = {
  name: 'Resend',
  detect: (k) => k.startsWith('re_'),
  async validate(key) {
    const start = t0();
    // Resend: a HEAD to /emails returns 200 or 401
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'GET',
        headers: { Authorization: `Bearer ${key}` },
      });
      const latencyMs = Date.now() - start;
      // 200 or 405 both mean the key is valid (405 = method not allowed but auth passed)
      const valid = res.status !== 401 && res.status !== 403;
      return {
        valid, provider: 'Resend', label: 'Resend API Key',
        scopes: valid ? ['emails:read'] : [],
        usage: {}, accountInfo: {},
        risks: [],
        latencyMs, error: !valid ? `HTTP ${res.status}` : undefined,
        checkedAt: new Date().toISOString(),
      };
    } catch (err) {
      return { valid: false, provider: 'Resend', label: 'Resend API Key', scopes: [], usage: {}, accountInfo: {}, risks: [], latencyMs: Date.now() - start, error: String(err), checkedAt: new Date().toISOString() };
    }
  },
};

// ── 32. SendGrid ──────────────────────────────────────────────────────────────
const sendgrid: ProviderDef = {
  name: 'SendGrid',
  detect: (k) => k.startsWith('SG.'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.sendgrid.com/v3/user/profile',
      { Authorization: `Bearer ${key}` },
      start, 'SendGrid', 'SendGrid API Key',
      (data) => ({
        label: `SendGrid · ${data.email ?? data.username}`,
        scopes: ['user:read'],
        accountInfo: { email: data.email, username: data.username, firstName: data.first_name, lastName: data.last_name },
      }),
    );
  },
};

// ── 33. Postmark ──────────────────────────────────────────────────────────────
// Postmark server tokens are UUIDs
const postmark: ProviderDef = {
  name: 'Postmark',
  detect: (k) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.postmarkapp.com/server',
      { 'X-Postmark-Server-Token': key },
      start, 'Postmark', 'Postmark Server Token',
      (data) => ({
        label: `Postmark · ${data.Name ?? 'Server'}`,
        scopes: ['server:read'],
        accountInfo: { id: data.ID, name: data.Name, color: data.Color },
      }),
    );
  },
};

// ── 34. Mailgun (pattern only) ────────────────────────────────────────────────
const mailgun: ProviderDef = {
  name: 'Mailgun',
  detect: (k) => k.startsWith('key-'),
  async validate(_key) {
    return patternOnly('Mailgun', 'Mailgun API Key');
  },
};

// ── 35. Twilio (pattern only — needs SID+token pair) ─────────────────────────
const twilio: ProviderDef = {
  name: 'Twilio',
  detect: (k) => /^AC[a-f0-9]{32}$/i.test(k),
  async validate(_key) {
    return patternOnly('Twilio', 'Twilio Account SID', ['Twilio requires SID+Auth Token pair for validation — use the Twilio console']);
  },
};

// ── 36. Plivo (pattern only) ──────────────────────────────────────────────────
const plivo: ProviderDef = {
  name: 'Plivo',
  detect: (k) => k.startsWith('MA'),
  async validate(_key) {
    return patternOnly('Plivo', 'Plivo Auth ID');
  },
};

// ── 37. Vonage (pattern only) ─────────────────────────────────────────────────
const vonage: ProviderDef = {
  name: 'Vonage',
  detect: (k) => k.startsWith('vn_'),
  async validate(_key) {
    return patternOnly('Vonage', 'Vonage API Key');
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEVOPS & INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

// ── 38. GitHub ────────────────────────────────────────────────────────────────
const github: ProviderDef = {
  name: 'GitHub',
  detect: (k) => k.startsWith('ghp_') || k.startsWith('github_pat_') || k.startsWith('gho_'),
  async validate(key) {
    const start = t0();
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${key}`, 'X-GitHub-Api-Version': '2022-11-28' },
      });
      const latencyMs = Date.now() - start;
      const remaining = parseInt(res.headers.get('x-ratelimit-remaining') ?? '-1');
      const limit = parseInt(res.headers.get('x-ratelimit-limit') ?? '-1');
      const reset = res.headers.get('x-ratelimit-reset');
      const scopes = (res.headers.get('x-oauth-scopes') ?? '').split(',').map(s => s.trim()).filter(Boolean);
      if (!res.ok) {
        return { valid: false, provider: 'GitHub', label: 'GitHub Token', scopes: [], usage: {}, accountInfo: {}, risks: ['Invalid or expired token'], latencyMs, error: `HTTP ${res.status}`, checkedAt: new Date().toISOString() };
      }
      const data = await res.json() as Record<string, unknown>;
      const risks: string[] = [];
      if (scopes.includes('admin:org') || scopes.includes('delete_repo')) risks.push('Overprivileged: has admin or delete scopes');
      if (remaining < 100) risks.push(`Rate limit critical: only ${remaining} requests remaining`);
      return {
        valid: true, provider: 'GitHub', label: `GitHub · ${data.login}`,
        scopes,
        usage: { rateLimitRemaining: remaining, quotaLimit: limit, rateLimitReset: reset ? new Date(parseInt(reset) * 1000).toISOString() : undefined },
        accountInfo: { login: data.login, name: data.name, email: data.email, plan: (data.plan as Record<string, unknown>)?.name },
        risks, latencyMs, checkedAt: new Date().toISOString(),
      };
    } catch (err) {
      return { valid: false, provider: 'GitHub', label: 'GitHub Token', scopes: [], usage: {}, accountInfo: {}, risks: [], latencyMs: Date.now() - start, error: String(err), checkedAt: new Date().toISOString() };
    }
  },
};

// ── 39. GitLab ────────────────────────────────────────────────────────────────
const gitlab: ProviderDef = {
  name: 'GitLab',
  detect: (k) => k.startsWith('glpat-'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://gitlab.com/api/v4/user',
      { 'PRIVATE-TOKEN': key },
      start, 'GitLab', 'GitLab Personal Access Token',
      (data) => ({
        label: `GitLab · ${data.username}`,
        scopes: ['user:read'],
        accountInfo: { username: data.username, name: data.name, email: data.email, id: data.id },
      }),
    );
  },
};

// ── 40. Cloudflare ────────────────────────────────────────────────────────────
const cloudflare: ProviderDef = {
  name: 'Cloudflare',
  detect: (k) => k.startsWith('cfl_') || (/^[A-Za-z0-9_-]{37,40}$/.test(k) && !k.startsWith('hf_')),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.cloudflare.com/client/v4/user/tokens/verify',
      { Authorization: `Bearer ${key}` },
      start, 'Cloudflare', 'Cloudflare API Token',
      (data) => {
        const result = data.result as Record<string, unknown> | undefined;
        return {
          scopes: ['token:verify'],
          accountInfo: { id: result?.id, status: result?.status, name: result?.name },
          risks: result?.status !== 'active' ? ['Token is not active'] : [],
        };
      },
    );
  },
};

// ── 41. DigitalOcean ──────────────────────────────────────────────────────────
const digitalocean: ProviderDef = {
  name: 'DigitalOcean',
  detect: (k) => k.startsWith('dop_v1_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.digitalocean.com/v2/account',
      { Authorization: `Bearer ${key}` },
      start, 'DigitalOcean', 'DigitalOcean API Token',
      (data) => {
        const account = data.account as Record<string, unknown> | undefined;
        return {
          label: `DO · ${account?.email ?? 'DigitalOcean'}`,
          scopes: ['account:read'],
          accountInfo: { email: account?.email, uuid: account?.uuid, status: account?.status, dropletLimit: account?.droplet_limit },
          usage: { planName: String(account?.team?.name ?? 'personal') },
        };
      },
    );
  },
};

// ── 42. Slack ─────────────────────────────────────────────────────────────────
const slack: ProviderDef = {
  name: 'Slack',
  detect: (k) => k.startsWith('xoxb-') || k.startsWith('xoxp-') || k.startsWith('xoxa-'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://slack.com/api/auth.test',
      { Authorization: `Bearer ${key}` },
      start, 'Slack', 'Slack API Token',
      (data) => ({
        label: `Slack · ${data.team} / ${data.user}`,
        scopes: ['auth:test'],
        accountInfo: { team: data.team, teamId: data.team_id, user: data.user, userId: data.user_id, botId: data.bot_id },
        risks: key.startsWith('xoxp-') ? ['User OAuth token — prefer bot tokens (xoxb-) for apps'] : [],
      }),
    );
  },
};

// ── 43. Vercel ────────────────────────────────────────────────────────────────
const vercel: ProviderDef = {
  name: 'Vercel',
  detect: (k) => k.startsWith('v_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.vercel.com/v2/user',
      { Authorization: `Bearer ${key}` },
      start, 'Vercel', 'Vercel API Token',
      (data) => {
        const user = data.user as Record<string, unknown> | undefined;
        return {
          label: `Vercel · ${user?.username ?? user?.email}`,
          scopes: ['user:read'],
          accountInfo: { username: user?.username, email: user?.email, name: user?.name },
        };
      },
    );
  },
};

// ── 44. Netlify ───────────────────────────────────────────────────────────────
const netlify: ProviderDef = {
  name: 'Netlify',
  detect: (k) => k.startsWith('nf_') || k.startsWith('netlify-'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.netlify.com/api/v1/user',
      { Authorization: `Bearer ${key}` },
      start, 'Netlify', 'Netlify API Token',
      (data) => ({
        label: `Netlify · ${data.email ?? data.full_name}`,
        scopes: ['user:read'],
        accountInfo: { id: data.id, email: data.email, fullName: data.full_name, slugifiedName: data.slug },
      }),
    );
  },
};

// ── 45. Railway (pattern only — GraphQL endpoint) ─────────────────────────────
const railway: ProviderDef = {
  name: 'Railway',
  detect: (k) => k.startsWith('rw_'),
  async validate(_key) {
    return patternOnly('Railway', 'Railway API Token', ['Railway uses a GraphQL API — validate via the Railway console']);
  },
};

// ── 46. Render ────────────────────────────────────────────────────────────────
const render: ProviderDef = {
  name: 'Render',
  detect: (k) => k.startsWith('rnd_'),
  async validate(key) {
    const start = t0();
    return stdGet(
      'https://api.render.com/v1/users/me',
      { Authorization: `Bearer ${key}` },
      start, 'Render', 'Render API Key',
      (data) => ({
        label: `Render · ${data.email ?? data.name}`,
        scopes: ['user:read'],
        accountInfo: { id: data.id, email: data.email, name: data.name },
      }),
    );
  },
};

// ── 47. AWS IAM (pattern only — needs key+secret pair) ────────────────────────
const aws: ProviderDef = {
  name: 'AWS',
  detect: (k) => k.startsWith('AKIA') || k.startsWith('ASIA'),
  async validate(_key) {
    return patternOnly('AWS', 'AWS Access Key ID', [
      'AWS IAM keys require a paired Secret Access Key for validation — use AWS CLI or console',
      'Exposed AWS keys are high-severity — rotate immediately if leaked',
    ]);
  },
};

// ── 48. WorkOS (pattern only) ─────────────────────────────────────────────────
const workos: ProviderDef = {
  name: 'WorkOS',
  detect: (k) => k.startsWith('sk_live_') && k.length > 50,
  async validate(_key) {
    return patternOnly('WorkOS', 'WorkOS API Key');
  },
};

// ── 49. Upstash Redis token (pattern only) ────────────────────────────────────
const upstashRedis: ProviderDef = {
  name: 'Upstash',
  detect: (k) => k.startsWith('AX') && k.includes('=='),
  async validate(_key) {
    return patternOnly('Upstash', 'Upstash Redis REST Token');
  },
};

// ── 50. Firebase (AIzaSy — same prefix as Google AI, detected above) ──────────
// Firebase is handled by googleAI provider. Listed here for reference.

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER REGISTRY — ORDER MATTERS
// ═══════════════════════════════════════════════════════════════════════════════

// Detection order is critical — more specific prefixes must come BEFORE generic ones.
const PROVIDERS: ProviderDef[] = [
  // AI & ML
  anthropic,      // sk-ant- (BEFORE openai sk-)
  openai,         // sk- (after anthropic)
  groq,           // gsk_
  replicate,      // r8_
  huggingface,    // hf_
  cohere,         // pk_
  googleAI,       // AIzaSy
  pinecone,       // pcsk_
  assemblyai,     // as_

  // Auth & Identity
  auth0,          // auth0|
  supabaseJwt,    // eyJhbG (JWT)
  stytch,         // project-live- / project-test-
  kinde,          // kinde_
  supabase,       // sbp_
  clerk,          // sk_live_clerk / contains _clerk_

  // Databases
  planetscale,    // pscale_pw_
  xata,           // xat_
  neon,           // postgres:// or .neon.tech
  mongodb,        // mongodb+srv://
  cockroachdb,    // ccdb_
  turso,          // libsql://
  redis,          // redis://
  upstash,        // upstash_
  upstashRedis,   // AX..==

  // Payments
  stripe,         // sk_live_ / sk_test_ / rk_
  lemonsqueezy,   // ls_
  razorpay,       // rzp_live_ / rzp_test_
  braintree,      // bt_
  paddle,         // pdl_
  paypal,         // A21AA

  // Communications
  resend,         // re_
  sendgrid,       // SG.
  postmark,       // UUID
  mailgun,        // key-
  twilio,         // AC + 32 hex chars
  plivo,          // MA
  vonage,         // vn_

  // DevOps
  github,         // ghp_ / github_pat_ / gho_
  gitlab,         // glpat-
  slack,          // xoxb- / xoxp- / xoxa-
  digitalocean,   // dop_v1_
  vercel,         // v_
  netlify,        // nf_ / netlify-
  render,         // rnd_
  railway,        // rw_
  aws,            // AKIA / ASIA
  workos,         // sk_live_ (long)
  cloudflare,     // cfl_ / long hex (last — broad pattern)
];

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

function detectProvider(key: string): ProviderDef | null {
  for (const p of PROVIDERS) {
    if (p.detect(key)) return p;
  }
  return null;
}

export async function validateKey(key: string): Promise<ValidationResult> {
  const provider = detectProvider(key.trim());
  if (!provider) {
    return {
      valid: false,
      provider: 'Unknown',
      label: 'Unknown Provider',
      scopes: [],
      usage: {},
      accountInfo: {},
      risks: ['Provider not recognised — cannot validate automatically. Supported: GitHub, OpenAI, Anthropic, Stripe, HuggingFace, Groq, Replicate, Cohere, Google AI, Supabase, PlanetScale, Xata, Slack, Vercel, Netlify, Render, GitLab, DigitalOcean, Cloudflare, Resend, SendGrid, Postmark, LemonSqueezy and more.'],
      latencyMs: 0,
      error: 'Unknown provider',
      checkedAt: new Date().toISOString(),
    };
  }
  return provider.validate(key.trim());
}

export function guessProvider(key: string): string {
  const p = detectProvider(key.trim());
  return p?.name ?? 'Unknown';
}

export const SUPPORTED_PROVIDERS = [
  // AI & ML
  'Anthropic', 'OpenAI', 'Groq', 'Replicate', 'HuggingFace', 'Cohere', 'Google AI',
  'Pinecone', 'AssemblyAI',
  // Auth
  'Auth0', 'Supabase', 'Stytch', 'Kinde', 'Clerk',
  // DB
  'PlanetScale', 'Xata', 'Neon', 'MongoDB', 'CockroachDB', 'Turso', 'Redis', 'Upstash',
  // Payments
  'Stripe', 'LemonSqueezy', 'Razorpay', 'Braintree', 'Paddle', 'PayPal',
  // Comms
  'Resend', 'SendGrid', 'Postmark', 'Mailgun', 'Twilio', 'Plivo', 'Vonage',
  // DevOps
  'GitHub', 'GitLab', 'Slack', 'DigitalOcean', 'Vercel', 'Netlify', 'Render',
  'Railway', 'AWS', 'WorkOS', 'Cloudflare',
];

export const LIVE_VALIDATION_PROVIDERS = [
  'Anthropic', 'OpenAI', 'Groq', 'Replicate', 'HuggingFace', 'Cohere', 'Google AI',
  'Supabase', 'Clerk', 'PlanetScale', 'Xata',
  'Stripe', 'LemonSqueezy',
  'Resend', 'SendGrid', 'Postmark',
  'GitHub', 'GitLab', 'Slack', 'DigitalOcean', 'Vercel', 'Netlify', 'Render', 'Cloudflare',
];

// src/lib/annaBridge.ts
// Real Anna App SDK bridge — wraps AnnaAppRuntime (postMessage/iframe) with
// a localStorage + mock-LLM fallback for local development.

type AnnaRuntime = {
  windowUuid: string;
  appId: string;
  versionId: string;
  runtimeState: Record<string, unknown>;
  tools: { list(): Promise<unknown>; invoke(args: { tool_id: string; method?: string; args: Record<string, unknown>; timeoutMs?: number }): Promise<{ result: unknown }> };
  storage: { get(args: { key: string }): Promise<{ value: unknown }>; set(args: { key: string; value: unknown }): Promise<{ ok: boolean }>; delete(args: { key: string }): Promise<{ ok: boolean }> };
  chat: { append_artifact(args: Record<string, unknown>): Promise<unknown> };
  agent: {
    'session.create'(args: { submode: 'auto' | 'fixed' }): Promise<{ app_session_uuid: string }>;
    'session.run'(args: { content: string; allowed_tools?: string[] }): AsyncIterable<unknown>;
  };
  window: {
    set_title(args: { title: string }): Promise<unknown>;
    resize(args: { w: number; h: number }): Promise<unknown>;
    close(args: { reason?: string }): Promise<unknown>;
    report_error(args: { message: string; stack?: string }): Promise<unknown>;
  };
  on(event: string, handler: (payload: unknown) => void): () => void;
};

let _runtime: AnnaRuntime | null = null;
let _runtimePromise: Promise<AnnaRuntime | null> | null = null;

/** Returns true when we are running inside the Anna iframe sandbox */
const isAnnaContext = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('wid');

/** Lazy-init the AnnaAppRuntime from the host-injected SDK */
async function getRuntime(): Promise<AnnaRuntime | null> {
  if (_runtime) return _runtime;
  if (_runtimePromise) return _runtimePromise;

  if (!isAnnaContext()) return null;

  _runtimePromise = (async () => {
    try {
      // The SDK is served by the Anna host at this path inside the iframe CSP.
      // Use new Function to bypass Turbopack/Webpack static analysis — this
      // import only ever runs inside the Anna iframe at runtime, never during SSR.
      const dynamicImport = new Function('u', 'return import(u)') as (u: string) => Promise<unknown>;
      const { AnnaAppRuntime } = await dynamicImport(
        '/static/anna-apps/_sdk/latest/index.js'
      ) as { AnnaAppRuntime: { connect(): Promise<AnnaRuntime> } };
      _runtime = await AnnaAppRuntime.connect();
      return _runtime;
    } catch (err) {
      console.warn('[annaBridge] Failed to load AnnaAppRuntime — falling back to dev mode', err);
      return null;
    }
  })();

  return _runtimePromise;
}

// ─── Dev-mode fallback helpers ───────────────────────────────────────────────

const devStorage = {
  async get(key: string): Promise<unknown> {
    try { return JSON.parse(localStorage.getItem(`anna_dev:${key}`) ?? 'null'); }
    catch { return null; }
  },
  async set(key: string, value: unknown): Promise<void> {
    localStorage.setItem(`anna_dev:${key}`, JSON.stringify(value));
  },
};

const DEV_LLM_RESPONSES: Record<string, string> = {
  default: 'Anna Dev Mode: LLM response simulated. Deploy to Anna platform for live AI inference.',
};

async function devLlmComplete(prompt: string): Promise<string> {
  await new Promise(r => setTimeout(r, 600));
  // Try to give a useful canned response based on keywords
  if (prompt.toLowerCase().includes('json')) {
    return JSON.stringify({ result: 'simulated', score: 85, items: ['item_1', 'item_2'] });
  }
  if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('security')) {
    return JSON.stringify({
      overallHealthScore: 78,
      criticalRisks: ['Simulated: Overpermissioned scopes detected', 'Simulated: Stale token in vault'],
      actionablePlaybook: [
        { action: 'Rotate tokens older than 90 days', priority: 'HIGH' },
        { action: 'Review access scopes for all keys', priority: 'MEDIUM' },
      ]
    });
  }
  return DEV_LLM_RESPONSES.default;
}

// ─── Public annaBridge API ────────────────────────────────────────────────────

export const annaBridge = {
  /** True when running inside Anna's iframe sandbox */
  isAnna: isAnnaContext,

  /** Raw runtime — null in dev mode */
  getRuntime,

  storage: {
    async get(key: string): Promise<unknown> {
      const rt = await getRuntime();
      if (rt) {
        const res = await rt.storage.get({ key });
        return res.value ?? null;
      }
      return devStorage.get(key);
    },
    async set(key: string, value: unknown): Promise<void> {
      const rt = await getRuntime();
      if (rt) {
        await rt.storage.set({ key, value });
        return;
      }
      return devStorage.set(key, value);
    },
    async delete(key: string): Promise<void> {
      const rt = await getRuntime();
      if (rt) {
        await rt.storage.delete({ key });
        return;
      }
      localStorage.removeItem(`anna_dev:${key}`);
    },
  },

  llm: {
    /**
     * In Anna context: invokes the bundled `keypulse_llm` Executa tool via
     * `anna.tools.invoke`. In dev mode: returns a canned mock response.
     */
    async complete(prompt: string, systemContext?: string): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        try {
          const { result } = await rt.tools.invoke({
            tool_id: 'required:bundled:keypulse_llm',
            method: 'llm.complete',
            args: { prompt, system_context: systemContext ?? '' },
            timeoutMs: 60_000,
          });
          return typeof result === 'string' ? result : JSON.stringify(result);
        } catch (err) {
          console.warn('[annaBridge] tools.invoke failed', err);
          return '[Anna LLM error — check Executa registration]';
        }
      }
      return devLlmComplete(prompt);
    },
  },

  agent: {
    /**
     * Creates an agent session. In Anna context uses the host agent API;
     * in dev mode returns a fake session ID.
     */
    async start(_config: { context: string }): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        const res = await rt.agent['session.create']({ submode: 'auto' });
        return res.app_session_uuid;
      }
      return `dev-session-${Math.random().toString(36).slice(2)}`;
    },

    async sendMessage(_sessionId: string, message: string): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        // Use LLM tool for now; agent session.run is streaming, keep simple
        return annaBridge.llm.complete(message);
      }
      return devLlmComplete(message);
    },
  },

  chat: {
    async appendArtifact(payload: Record<string, unknown>): Promise<void> {
      const rt = await getRuntime();
      if (rt) {
        await rt.chat.append_artifact(payload);
      }
      // In dev mode: no-op (no chat panel exists)
    },
  },

  window: {
    async setTitle(title: string): Promise<void> {
      const rt = await getRuntime();
      if (rt) await rt.window.set_title({ title });
    },
    async reportError(message: string, stack?: string): Promise<void> {
      const rt = await getRuntime();
      if (rt) await rt.window.report_error({ message, stack });
    },
  },
};

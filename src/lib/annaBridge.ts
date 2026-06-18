// src/lib/annaBridge.ts
// Real Anna App SDK bridge — wraps AnnaAppRuntime (postMessage/iframe) with
// a localStorage + mock-LLM fallback for local development.
//
// AI calls use the HOST AGENT SESSION API (anna.agent.session.create / session.run)
// per the Anna platform architecture — NOT the executor for LLM inference.
// The executor (keypulse_llm) is reserved for deterministic tools only
// (e.g. security scoring, OSINT lookups).

// ─── Runtime type ─────────────────────────────────────────────────────────────

type AgentFrame =
  | { type: 'text_delta'; delta: string }
  | { type: 'tool_call'; name: string; args: unknown }
  | { type: 'tool_result'; name: string; result: unknown }
  | { type: 'done'; run_id: string }
  | { type: 'error'; code: string; message: string };

type AnnaRuntime = {
  windowUuid: string;
  appId: string;
  versionId: string;
  runtimeState: Record<string, unknown>;
  tools: {
    list(): Promise<unknown>;
    invoke(args: {
      tool_id: string;
      method?: string;
      args: Record<string, unknown>;
      timeoutMs?: number;
    }): Promise<{ result: unknown }>;
  };
  storage: {
    get(args: { key: string }): Promise<{ value: unknown }>;
    set(args: { key: string; value: unknown }): Promise<{ ok: boolean }>;
    delete(args: { key: string }): Promise<{ ok: boolean }>;
  };
  chat: { append_artifact(args: Record<string, unknown>): Promise<unknown> };
  agent: {
    'session.create'(args: { submode: 'auto' | 'fixed' }): Promise<{
      app_session_uuid: string;
      session_token: string;
    }>;
    'session.run'(args: {
      content: string;
      allowed_tools?: string[];
    }): Promise<AsyncIterable<AgentFrame>>;
    'session.cancel'(args: { run_id: string }): Promise<void>;
    'session.delete'(): Promise<{ deleted: boolean }>;
  };
  window: {
    set_title(args: { title: string }): Promise<unknown>;
    resize(args: { w: number; h: number }): Promise<unknown>;
    close(args: { reason?: string }): Promise<unknown>;
    report_error(args: { message: string; stack?: string }): Promise<unknown>;
  };
  on(event: string, handler: (payload: unknown) => void): () => void;
};

// ─── Singleton runtime ────────────────────────────────────────────────────────

let _runtime: AnnaRuntime | null = null;
let _runtimePromise: Promise<AnnaRuntime | null> | null = null;

/** True when running inside the Anna iframe sandbox */
const isAnnaContext = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('wid');

/** Lazy-init AnnaAppRuntime from the host-served SDK */
async function getRuntime(): Promise<AnnaRuntime | null> {
  if (_runtime) return _runtime;
  if (_runtimePromise) return _runtimePromise;
  if (!isAnnaContext()) return null;

  _runtimePromise = (async () => {
    try {
      // Use new Function to defer import past Turbopack static analysis.
      // This only runs inside the Anna iframe at browser runtime, never SSR.
      const dynamicImport = new Function('u', 'return import(u)') as (
        u: string
      ) => Promise<unknown>;
      const mod = (await dynamicImport(
        '/static/anna-apps/_sdk/latest/index.js'
      )) as { AnnaAppRuntime: { connect(): Promise<AnnaRuntime> } };
      _runtime = await mod.AnnaAppRuntime.connect();
      return _runtime;
    } catch (err) {
      console.warn(
        '[annaBridge] Failed to load AnnaAppRuntime — dev mode active',
        err
      );
      return null;
    }
  })();

  return _runtimePromise;
}

// ─── Dev-mode fallback helpers ────────────────────────────────────────────────

const devStorage = {
  async get(key: string): Promise<unknown> {
    try {
      return JSON.parse(localStorage.getItem(`anna_dev:${key}`) ?? 'null');
    } catch {
      return null;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    localStorage.setItem(`anna_dev:${key}`, JSON.stringify(value));
  },
};

async function devAgentRun(prompt: string): Promise<string> {
  await new Promise(r => setTimeout(r, 700));
  const p = prompt.toLowerCase();
  if (p.includes('risk') || p.includes('security') || p.includes('audit')) {
    return JSON.stringify({
      overallHealthScore: 72,
      criticalRisks: [
        'Tokens not rotated in 90+ days',
        'Overly broad scopes (api.admin on a read-only service)',
      ],
      actionablePlaybook: [
        { action: 'Rotate all tokens older than 90 days', priority: 'HIGH' },
        { action: 'Restrict admin-scoped tokens to least-privilege', priority: 'HIGH' },
        { action: 'Move shared tokens to service accounts', priority: 'MEDIUM' },
      ],
    });
  }
  if (p.includes('diagnostic') || p.includes('latency') || p.includes('http')) {
    return JSON.stringify({ httpStatus: 200, latencyMs: 43, health: 'Optimal' });
  }
  if (p.includes('json') || p.includes('extract') || p.includes('token')) {
    return JSON.stringify({ result: 'simulated', score: 85, items: ['item_1', 'item_2'] });
  }
  return '[Dev Mode] Anna agent session simulated. Deploy to Anna platform for live multi-turn AI inference.';
}

// ─── Collect all text_delta frames from a streaming agent run ─────────────────

async function consumeAgentRun(
  stream: AsyncIterable<AgentFrame>
): Promise<string> {
  const chunks: string[] = [];
  let lastToolResult = '';
  for await (const frame of stream) {
    if (frame.type === 'text_delta') chunks.push(frame.delta);
    if (frame.type === 'tool_result')
      lastToolResult = JSON.stringify(frame.result);
    if (frame.type === 'error') throw new Error(`[agent] ${frame.message}`);
  }
  return chunks.join('') || lastToolResult || '';
}

// ─── Public annaBridge API ────────────────────────────────────────────────────

export const annaBridge = {
  /** True when running inside Anna's iframe sandbox */
  isAnna: isAnnaContext,

  /** Raw runtime — null in dev mode */
  getRuntime,

  // ── Storage ──────────────────────────────────────────────────────────────────
  storage: {
    async get(key: string): Promise<unknown> {
      const rt = await getRuntime();
      if (rt) return (await rt.storage.get({ key })).value ?? null;
      return devStorage.get(key);
    },
    async set(key: string, value: unknown): Promise<void> {
      const rt = await getRuntime();
      if (rt) { await rt.storage.set({ key, value }); return; }
      return devStorage.set(key, value);
    },
    async delete(key: string): Promise<void> {
      const rt = await getRuntime();
      if (rt) { await rt.storage.delete({ key }); return; }
      localStorage.removeItem(`anna_dev:${key}`);
    },
  },

  // ── LLM — backed by Anna host agent session (not executor) ───────────────────
  llm: {
    /**
     * Sends a single-turn prompt through the Anna host agent session API.
     * Creates a fresh session per call (stateless usage).
     * Falls back to dev mock when running outside Anna.
     */
    async complete(prompt: string, _systemContext?: string): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        try {
          await rt.agent['session.create']({ submode: 'auto' });
          const stream = await rt.agent['session.run']({ content: prompt });
          const text = await consumeAgentRun(stream);
          // Clean up session after single-turn use
          await rt.agent['session.delete']().catch(() => {});
          return text || '[No response from agent]';
        } catch (err) {
          console.warn('[annaBridge] agent session failed', err);
          return '[Anna agent error — check host_api.agent permissions in manifest]';
        }
      }
      return devAgentRun(prompt);
    },
  },

  // ── Agent — stateful multi-turn session ──────────────────────────────────────
  agent: {
    /**
     * Creates a persistent agent session for multi-turn chat.
     * Returns the session UUID. Call sendMessage() with it for each turn.
     */
    async start(_config: { context: string }): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        const { app_session_uuid } = await rt.agent['session.create']({
          submode: 'auto',
        });
        return app_session_uuid;
      }
      return `dev-session-${Math.random().toString(36).slice(2)}`;
    },

    /**
     * Sends a message on an existing session and collects the full streamed reply.
     * The Anna agent maintains conversation context automatically per session UUID.
     */
    async sendMessage(_sessionId: string, message: string): Promise<string> {
      const rt = await getRuntime();
      if (rt) {
        try {
          // session.run uses the currently bound session (created by session.create)
          const stream = await rt.agent['session.run']({ content: message });
          return await consumeAgentRun(stream);
        } catch (err) {
          console.warn('[annaBridge] agent.sendMessage failed', err);
          return '[Anna agent error — check host_api.agent permissions in manifest]';
        }
      }
      return devAgentRun(message);
    },
  },

  // ── Chat artifacts ────────────────────────────────────────────────────────────
  chat: {
    async appendArtifact(payload: Record<string, unknown>): Promise<void> {
      const rt = await getRuntime();
      if (rt) await rt.chat.append_artifact(payload);
      // dev mode: no-op — no chat panel exists outside Anna
    },
  },

  // ── Window controls ───────────────────────────────────────────────────────────
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

  // ── Deterministic tools via Executa (security scoring, OSINT, etc.) ──────────
  tools: {
    async invoke(
      toolId: string,
      method: string,
      args: Record<string, unknown>
    ): Promise<unknown> {
      const rt = await getRuntime();
      if (rt) {
        const { result } = await rt.tools.invoke({
          tool_id: toolId === 'keypulse-llm' ? 'keypulse-llm' : toolId,
          method,
          args,
          timeoutMs: 30_000,
        });
        return result;
      }
      return null; // dev mode: no-op for executor tools
    },
  },
};

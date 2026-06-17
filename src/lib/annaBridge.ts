export const annaBridge = {
  storage: {
    get: async (key: string): Promise<unknown> => {
      if (typeof window !== 'undefined' && window.Anna?.storage) {
        return window.Anna.storage.get(key);
      }
      // Fallback to localStorage when Anna SDK is not present
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(`mock_anna_${key}`);
        if (item) {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
      }
      return null;
    },
    set: async (key: string, value: unknown): Promise<void> => {
      if (typeof window !== 'undefined' && window.Anna?.storage) {
        return window.Anna.storage.set(key, value);
      }
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`mock_anna_${key}`, JSON.stringify(value));
      }
    }
  },

  llm: {
    /**
     * complete(prompt, context?)
     * When Anna SDK is present: calls window.Anna.llm.complete(context || '', prompt)
     * Fallback: returns a typed mock response
     */
    complete: async (prompt: string, context?: string): Promise<string> => {
      if (typeof window !== 'undefined' && window.Anna?.llm) {
        return window.Anna.llm.complete(context || '', prompt);
      }
      // Mock fallback — returns plausible JSON for parseable fields
      await new Promise(r => setTimeout(r, 800));

      if (prompt.includes("Generate a global security report")) {
        return JSON.stringify({
          overallHealthScore: 78,
          criticalRisks: ["Stale tokens detected in production", "Excessive 'admin' scopes on multiple keys"],
          actionablePlaybook: [
            { action: "Revoke stale Stripe tokens", priority: "HIGH" },
            { action: "Downgrade admin scopes to read-only where applicable", priority: "MEDIUM" }
          ]
        });
      }

      // Return a mock that many callers can JSON.parse safely
      const service = prompt.includes('service name:') 
        ? prompt.split('service name:')[1]?.trim().split(' ')[0] || 'Custom' 
        : 'Custom';
      return JSON.stringify({
        label: `${service}_API_KEY`,
        token: `mock_${service.toLowerCase()}_${Math.random().toString(36).substring(2, 10)}`,
        provider: service,
        scopes: [`${service.toLowerCase()}:read`, `${service.toLowerCase()}:write`, 'profile:read'],
        error: null
      });
    }
  },

  agent: {
    start: async (options: { context: string }): Promise<string> => {
      if (typeof window !== 'undefined' && window.Anna?.agent) {
        return window.Anna.agent.start(options);
      }
      return `mock-session-${Date.now()}`;
    },
    sendMessage: async (sessionId: string, message: string): Promise<string> => {
      if (typeof window !== 'undefined' && window.Anna?.agent) {
        return window.Anna.agent.sendMessage(sessionId, message);
      }
      await new Promise(r => setTimeout(r, 900));
      
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('revoke') || lowerMsg.includes('delete') || lowerMsg.includes('remove')) {
          if (lowerMsg.includes('openai')) {
              // The intercept in SanctumAssistant handles 'revoke my openai key' exactly, but for general cases:
              return "THREAT VECTOR DETECTED: Intent to revoke key. Awaiting manual authorization to proceed with revocation protocol.";
          }
          return "I can assist with revoking that key. Please confirm the exact provider and key ID you wish to revoke.";
      }
      if (lowerMsg.includes('scan') || lowerMsg.includes('audit')) {
          return "I can initiate a deep scan of your configured integrations. Please head over to the OSINT Scanner or Diagnostic Hub to proceed.";
      }
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
          return "Hello. I am the Sanctum Security Agent. All systems nominal. How can I assist with your vault security today?";
      }

      return `Understood: "${message.substring(0, 40)}...". As your local Sanctum Agent, I am monitoring all vault parameters locally.`;
    }
  }
};

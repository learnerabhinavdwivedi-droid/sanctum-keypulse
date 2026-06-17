export const annaBridge = {
  storage: {
    get: async (key: string): Promise<any> => {
      if (typeof window !== 'undefined' && window.Anna?.storage) {
        return window.Anna.storage.get(key);
      }
      // Fallback
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(`mock_anna_${key}`);
        if (item) {
          try {
            return JSON.parse(item);
          } catch (e) {
            return item;
          }
        }
      }
      return null;
    },
    set: async (key: string, value: any): Promise<void> => {
      if (typeof window !== 'undefined' && window.Anna?.storage) {
        return window.Anna.storage.set(key, value);
      }
      // Fallback
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`mock_anna_${key}`, JSON.stringify(value));
      }
    }
  },
  llm: {
    complete: async (prompt: string, context?: string): Promise<string> => {
      if (typeof window !== 'undefined' && window.Anna?.llm) {
        return window.Anna.llm.complete(prompt, context || '');
      }
      // Mock Fallback
      await new Promise(r => setTimeout(r, 1000));
      return `Mock LLM Response for: ${prompt.substring(0, 30)}...`;
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
      await new Promise(r => setTimeout(r, 1000));
      return `Mock Agent Response: I received "${message}".`;
    }
  }
};

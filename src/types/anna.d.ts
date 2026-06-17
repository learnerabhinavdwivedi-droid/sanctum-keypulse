declare global {
  interface Window {
    Anna: {
      storage: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
      };
      llm: {
        complete: (systemPrompt: string, userPrompt: string) => Promise<string>;
      };
      agent: {
        start: (config: { context: string }) => Promise<string>;
        sendMessage: (sessionId: string, prompt: string) => Promise<string>;
      };
    };
  }
}

export {};

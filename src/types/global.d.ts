export {};

declare global {
  interface Window {
    Anna?: {
      identity?: {
        id: string;
      };
      storage?: {
        get: (key: string) => Promise<unknown>;
        set: (key: string, value: unknown) => Promise<void>;
      };
      llm?: {
        complete: (promptOrSystem: string, userPrompt?: string) => Promise<string>;
      };
      agent?: {
        start: (config: { context: string }) => Promise<string>;
        sendMessage: (sessionId: string, prompt: string) => Promise<string>;
      };
    };
  }
}

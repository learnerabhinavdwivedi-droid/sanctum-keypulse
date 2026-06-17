export {};

declare global {
  interface Window {
    Anna?: {
      identity?: {
        id: string;
      };
      storage?: any;
      llm?: {
        complete: any;
      };
    };
  }
}

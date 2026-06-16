import { useState, useRef, useEffect } from 'react';
import { KeyRecord } from './useKeyManager';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const useChatAssistant = (keys: KeyRecord[]) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'ai',
      text: 'Welcome to Sanctum KeyPulse. I am your AI assistant, ready to help you manage your keys.'
    }
  ]);

  const simulator = async (input: string) => {
    // Artificial latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    let aiResponse = "I'm analyzing that request, but I don't have a specific answer for it yet.";
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('how many keys')) {
      aiResponse = `You currently have ${keys.length} keys in your vault.`;
    } else if (lowerInput.includes('status')) {
      aiResponse = "All systems optimal. Key vault is secure.";
    } else if (lowerInput.includes('show') || lowerInput.includes('list')) {
      if (keys.length > 0) {
        aiResponse = `Here is your latest key: ${keys[0].label} - ${keys[0].keyValue.substring(0, 8)}...`;
      } else {
        aiResponse = "Your vault is currently empty.";
      }
    }

    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      role: 'ai',
      text: aiResponse
    }]);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message immediately
    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: text
    }]);

    // Trigger simulator
    simulator(text);
  };

  return { chatHistory, sendMessage };
};

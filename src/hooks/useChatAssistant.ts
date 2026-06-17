import { useState, useRef } from 'react';
import { annaBridge } from '../lib/annaBridge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const useChatAssistant = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'ai',
      text: 'Welcome to KeyPulse. I am Anna, your AI assistant.'
    }
  ]);
  const sessionIdRef = useRef<string | null>(null);

  const ensureSession = async () => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = await annaBridge.agent.start({ context: 'KeyPulse SOC assistant' });
    }
    return sessionIdRef.current;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text
    }]);

    setIsTyping(true);
    try {
      const sid = await ensureSession();
      const response = await annaBridge.agent.sendMessage(sid, text);
      setChatHistory(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        role: 'ai',
        text: response
      }]);
    } catch {
      setChatHistory(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        role: 'ai',
        text: 'Error: Unable to process request through AI Engine.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Kept for API compatibility — no-op in the Anna-native version
  const sendToolResult = async (_toolUseId: string, _resultMessage: string) => {
    await sendMessage(_resultMessage);
  };

  const clearChat = () => {
    sessionIdRef.current = null;
    setChatHistory([{
      id: Math.random().toString(36).substring(2, 9),
      role: 'ai',
      text: 'Chat history cleared. How can I help you secure your vault?'
    }]);
  };

  return { chatHistory, sendMessage, sendToolResult, isTyping, clearChat };
};

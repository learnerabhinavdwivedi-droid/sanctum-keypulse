import { useState, useRef, useEffect } from 'react';
import { KeyRecord } from './useKeyManager';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'tool_call';
  text: string;
  toolCall?: {
    id: string;
    name: string;
    input: any;
  };
}

export const useChatAssistant = (keys: KeyRecord[]) => {
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'ai',
      text: 'Welcome to KeyPulse. I am Anna, your AI assistant.'
    }
  ]);

  const sendPayloadToBackend = async (payloadMessage: string | null, toolResult: any = null) => {
    setIsTyping(true);

    try {
      const payloadHistory = chatHistory.map(msg => {
        if (msg.role === 'tool_call' && msg.toolCall) {
          return {
            role: 'assistant',
            content: [
              {
                type: 'tool_use',
                id: msg.toolCall.id,
                name: msg.toolCall.name,
                input: msg.toolCall.input
              }
            ]
          };
        }
        return {
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        };
      });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: payloadMessage, history: payloadHistory, toolResult })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      if (data.message) {
        setChatHistory(prev => [...prev, {
          id: Math.random().toString(36).substring(2, 9),
          role: 'ai',
          text: data.message
        }]);
      }

      if (data.toolCall) {
        setChatHistory(prev => [...prev, {
          id: Math.random().toString(36).substring(2, 9),
          role: 'tool_call',
          text: '',
          toolCall: data.toolCall
        }]);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        role: 'ai',
        text: "Error: Unable to process request through AI Engine."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: text
    }]);

    await sendPayloadToBackend(text);
  };

  const sendToolResult = async (toolUseId: string, resultMessage: string) => {
    await sendPayloadToBackend(null, {
      tool_use_id: toolUseId,
      content: resultMessage
    });
  };

  const clearChat = () => {
    setChatHistory([{
      id: Math.random().toString(36).substring(2, 9),
      role: 'ai',
      text: 'Chat history cleared. How can I help you secure your vault?'
    }]);
  };

  return { chatHistory, sendMessage, sendToolResult, isTyping, clearChat };
};

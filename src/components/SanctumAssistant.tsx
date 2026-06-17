import React, { useState, useRef, useEffect } from 'react';
import { Minus, X, Image as ImageIcon, Smile, Paperclip, Send, ShieldCheck, AlertOctagon } from 'lucide-react';
import { KeyRecord } from '../hooks/useKeyManager';
import { annaBridge } from '../lib/annaBridge';

interface SanctumAssistantProps {
  keys: KeyRecord[];
  onRevokeKey?: (id: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isActionable?: boolean;
}

export const SanctumAssistant: React.FC<SanctumAssistantProps> = ({ keys, onRevokeKey }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { id: 'initial', role: 'ai', text: 'I am the Sanctum Security Agent. My systems are ready.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Anna Agent Session
  useEffect(() => {
    let mounted = true;
    const initAgent = async () => {
      try {
        const id = await annaBridge.agent.start({ context: JSON.stringify(keys) });
        if (mounted) {
          setSessionId(id);
        }
      } catch (e) {
        // Failed to start Anna agent session
      }
    };
    initAgent();
    return () => { mounted = false; };
  }, [keys]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, isChatOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage = inputValue;
    setInputValue('');
    
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // HUMAN-IN-THE-LOOP INTERCEPT
      if (userMessage.toLowerCase().includes('revoke my openai key')) {
        await new Promise(r => setTimeout(r, 1000));
        setChatHistory(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          text: "THREAT VECTOR DETECTED: Intent to revoke OpenAI Key. Awaiting manual authorization to proceed with revocation protocol.",
          isActionable: true
        }]);
      } else if (sessionId) {
        const responseText = await annaBridge.agent.sendMessage(sessionId, userMessage);
        setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: responseText }]);
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: `Anna Platform SDK missing. Fallback response for: "${userMessage}"` }]);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "Error: Failed to process tokens." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAuthorizeAction = () => {
    if (onRevokeKey) {
      // Find openAI key mock id
      const openaiKey = keys.find(k => k.provider.toLowerCase().includes('openai') || k.label.toLowerCase().includes('openai'));
      if (openaiKey) {
        onRevokeKey(openaiKey.id);
        setChatHistory(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          text: "AUTHORIZATION ACCEPTED. Key status updated to REVOKED. Access severed." 
        }]);
      } else {
        setChatHistory(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'ai', 
          text: "ERROR: No active OpenAI key found in Key Vault to revoke." 
        }]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className={`fixed bottom-8 right-8 w-80 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50 transform transition-transform duration-300 ease-out origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Chat Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b-4 border-black bg-[#00E5FF] rounded-t-xl cursor-move">
          <h3 className="text-sm font-black text-black uppercase flex items-center gap-2">
            Sanctum Agent
          </h3>
          <div className="flex items-center gap-2 text-black">
            <button className="text-[10px] font-black uppercase bg-white px-2 py-1 border-2 border-black rounded hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => setChatHistory([{ id: 'initial', role: 'ai', text: 'History Cleared. Systems ready.' }])}>Clear</button>
            <button className="w-6 h-6 flex items-center justify-center bg-white border-2 border-black rounded hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => setIsChatOpen(false)}><Minus className="w-4 h-4" /></button>
            <button className="w-6 h-6 flex items-center justify-center bg-[#FF4B91] text-white border-2 border-black rounded hover:bg-[#D43F7A] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" onClick={() => setIsChatOpen(false)}><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar h-72 flex flex-col gap-4 bg-[#FAF8F5]">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-black" />
                </div>
              )}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : ''} max-w-[80%]`}>
                <span className="text-[10px] font-black text-black uppercase mb-1">{msg.role === 'user' ? 'You' : 'Sanctum'}</span>
                <div className={`text-xs p-3 font-bold leading-relaxed border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  msg.role === 'user' 
                    ? 'bg-[#FFD200] text-black rounded-tl-xl rounded-bl-xl rounded-tr-sm' 
                    : msg.isActionable 
                      ? 'bg-[#FF4B91] text-white rounded-tr-xl rounded-br-xl rounded-tl-sm'
                      : 'bg-white text-black rounded-tr-xl rounded-br-xl rounded-tl-sm'
                }`}>
                  {msg.text}
                  {msg.isActionable && (
                    <button 
                      onClick={handleAuthorizeAction}
                      className="mt-3 w-full bg-black text-[#00CD74] font-black uppercase tracking-widest px-2 py-2 border-2 border-transparent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform flex items-center justify-center gap-2"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      AUTHORIZE ACTION
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <span className="text-[10px] font-black text-black uppercase mb-1">Sanctum</span>
                <div className="text-xs p-3 font-bold leading-relaxed border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black rounded-tr-xl rounded-br-xl rounded-tl-sm flex items-center gap-1 h-10">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t-4 border-black rounded-b-xl">
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder={isTyping ? "PROCESSING TOKENS..." : "ASK ME ANYTHING..."}
              className="w-full bg-gray-100 border-2 border-black text-black font-bold placeholder-gray-500 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all uppercase"
            />
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-3 text-black">
              <button disabled={isTyping} className="hover:text-[#00E5FF] transition-colors disabled:opacity-50"><ImageIcon className="w-5 h-5" /></button>
              <button disabled={isTyping} className="hover:text-[#FFD200] transition-colors disabled:opacity-50"><Smile className="w-5 h-5" /></button>
              <button disabled={isTyping} className="hover:text-[#FF4B91] transition-colors disabled:opacity-50"><Paperclip className="w-5 h-5" /></button>
            </div>
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00CD74] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase rounded-lg hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:bg-gray-400 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Chat Trigger (if closed) */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#00E5FF] border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all z-40"
        >
          <ShieldCheck className="w-8 h-8" />
        </button>
      )}
    </>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Minus, X, Image as ImageIcon, Smile, Paperclip, Send, ShieldCheck } from 'lucide-react';
import { useChatAssistant } from '../hooks/useChatAssistant';
import { KeyRecord } from '../hooks/useKeyManager';

interface SanctumAssistantProps {
  keys: KeyRecord[];
}

export const SanctumAssistant: React.FC<SanctumAssistantProps> = ({ keys }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { chatHistory, sendMessage } = useChatAssistant(keys);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className={`fixed bottom-6 right-8 w-80 bg-[#161C2D] border border-[#CFB53B]/50 rounded-xl shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Chat Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[#CFB53B]/20 bg-[#1A2235] rounded-t-xl cursor-move">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Sanctum AI Assistant
          </h3>
          <div className="flex items-center gap-2 text-slate-500">
            <button className="hover:text-[#CFB53B] transition-colors" onClick={() => setIsChatOpen(false)}><Minus className="w-4 h-4" /></button>
            <button className="hover:text-[#DC143C] transition-colors" onClick={() => setIsChatOpen(false)}><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar h-72 flex flex-col gap-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-[#1A2235] border border-[#CFB53B]/30 flex-shrink-0 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CFB53B]" />
                </div>
              )}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
                <span className="text-[10px] font-bold text-slate-400 mb-1">{msg.role === 'user' ? 'User' : 'AI'}</span>
                <div className={`text-xs p-3 leading-relaxed border border-slate-800/50 ${
                  msg.role === 'user' 
                    ? 'bg-[#1E2A47] text-white rounded-tl-lg rounded-b-lg border-[#CFB53B]/20' 
                    : 'bg-[#1A2235] text-slate-300 rounded-tr-lg rounded-b-lg'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-[#1A2235] border-t border-[#CFB53B]/20 rounded-b-xl">
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your keys..."
              className="w-full bg-[#111625] border border-slate-700/50 text-slate-200 placeholder-slate-600 rounded-lg pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#CFB53B]/50"
            />
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-3 text-[#CFB53B]/70">
              <button className="hover:text-[#CFB53B]"><ImageIcon className="w-4 h-4" /></button>
              <button className="hover:text-[#CFB53B]"><Smile className="w-4 h-4" /></button>
              <button className="hover:text-[#CFB53B]"><Paperclip className="w-4 h-4" /></button>
            </div>
            <button 
              onClick={handleSend}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DC143C] hover:bg-[#B31031] text-white text-xs font-bold rounded-md transition-colors shadow-[0_0_10px_rgba(220,20,60,0.2)]"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Chat Trigger (if closed) */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#1A2235] border border-[#CFB53B]/50 rounded-full shadow-[0_0_20px_rgba(207,181,59,0.2)] flex items-center justify-center text-[#CFB53B] hover:bg-[#CFB53B] hover:text-[#111625] transition-all z-40 group"
        >
          <div className="absolute inset-0 rounded-full bg-[#DC143C]/20 animate-ping group-hover:hidden"></div>
          <ShieldCheck className="w-6 h-6 relative z-10" />
        </button>
      )}
    </>
  );
};

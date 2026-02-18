
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Authentication complete. I am your Senior Tech Architect. How can I assist with your hardware procurement today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await getAIResponse(userText, history);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'No data received.' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-6 w-80 md:w-96 h-[550px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-slate-950 p-6 flex justify-between items-center text-white border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg">⚡</div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest">Tech Architect AI</h3>
                <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Core Status: Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-xl' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-100 flex gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-50 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query tech specs..."
              className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-cyan-500 text-slate-900 p-4 rounded-2xl hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-xl active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-950 hover:bg-cyan-500 text-white hover:text-slate-950 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 group border border-white/5"
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">🤖</span>
      </button>
    </div>
  );
};

export default AIChatBot;

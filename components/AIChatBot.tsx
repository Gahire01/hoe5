import { useState, useRef, useEffect } from "react"; 
import { X, Send, Sparkles, Loader2 } from "lucide-react"; 
import ReactMarkdown from "react-markdown"; 
import { toast } from "react-hot-toast"; 
import { getAIResponse } from "../services/geminiService";


interface Msg { role: "user" | "assistant"; content: string; } 




export const AIChatBot = () => { 
  const [open, setOpen] = useState(false); 
  const [messages, setMessages] = useState<Msg[]>([ 
    { role: "assistant", content: "👋 Hey! I'm your AI shopping assistant. Ask me anything about phones, laptops, audio gear or which device fits your needs!" }, 
  ]); 
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const scrollRef = useRef<HTMLDivElement>(null); 


  useEffect(() => { 
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); 
  }, [messages, loading]); 


  const send = async () => { 
    const text = input.trim(); 
    if (!text || loading) return; 
    const userMsg: Msg = { role: "user", content: text }; 
    setMessages((m) => [...m, userMsg]); 
    setInput(""); 
    setLoading(true); 


    try { 
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await getAIResponse(text, history);
      setMessages((m) => [...m, { role: "assistant", content: responseText || "I could not retrieve that right now. Please try again in a moment." }]); 
    } catch (e) { 
      toast.error(e instanceof Error ? e.message : "AI assistant temporarily unavailable"); 
      setMessages((m) => [...m, { role: "assistant", content: "I am temporarily offline. Please retry your question." }]);
    } finally { 
      setLoading(false); 
    } 
  }; 


  return ( 
    <> 
      {/* Floating button */} 
      <button 
        onClick={() => setOpen(true)} 
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-slate-950 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] grid place-items-center transition-all duration-300 hover:scale-110 animate-pulse ${open ? "scale-0" : ""}`} 
        aria-label="Open AI assistant" 
      > 
        <Sparkles className="h-6 w-6 text-cyan-400" /> 
      </button> 


      {/* Chat window */} 
      {open && ( 
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[600px] bg-white sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"> 
          <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between"> 
            <div className="flex items-center gap-3"> 
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 grid place-items-center border border-cyan-500/30"> 
                <Sparkles className="h-5 w-5 text-cyan-400" /> 
              </div> 
              <div> 
                <p className="font-black text-sm tracking-tight">AI SHOPPING ASSISTANT</p> 
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Protocol Active</p> 
                </div>
              </div> 
            </div> 
            <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl" onClick={() => setOpen(false)}> 
              <X className="h-5 w-5" /> 
            </button> 
          </div> 


          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"> 
            {messages.map((m, i) => ( 
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}> 
                <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-xs font-medium leading-relaxed shadow-sm ${m.role === "user" ? "bg-slate-900 text-white rounded-tr-none" : "bg-white text-slate-600 border border-slate-100 rounded-tl-none"}`}> 
                  {m.role === "assistant" ? ( 
                    <div className="prose prose-sm max-w-none prose-slate [&_p]:m-0 [&_ul]:my-2 [&_li]:m-0"> 
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown> 
                    </div> 
                  ) : m.content} 
                </div> 
              </div> 
            ))} 
            {loading && messages[messages.length - 1]?.role === "user" && ( 
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                </div>
              </div> 
            )} 
          </div> 


          <div className="p-4 bg-white border-t border-slate-100 flex gap-3"> 
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && send()} 
              placeholder="Ask about specs, availability..." 
              className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 text-xs font-bold focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
              disabled={loading} 
            /> 
            <button 
              onClick={send} 
              disabled={!input.trim() || loading} 
              className="bg-slate-950 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            > 
              <Send className="h-4 w-4" /> 
            </button> 
          </div> 
        </div> 
      )} 
    </> 
  ); 
};
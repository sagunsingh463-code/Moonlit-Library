import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  AlertCircle, 
  WifiOff, 
  ExternalLink, 
  BookOpen, 
  Copy, 
  Check, 
  Bot,
  FileText
} from 'lucide-react';
import { sound } from '../../services/audio';
import { authService, getApiBase } from '../../services/auth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  notesReferenced?: number;
}

interface AiStudyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubject?: string;
  libraryNotesCount?: number;
  libraryFilesCount?: number;
}

const STORAGE_KEY = 'moonlit_ai_study_chat_history';

export const AiStudyAssistantModal: React.FC<AiStudyAssistantModalProps> = ({
  isOpen,
  onClose,
  activeSubject,
  libraryNotesCount = 0,
  libraryFilesCount = 0
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignored
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: 'Namaste! Main Luna hoon, aapki Moonlit AI Study Assistant 🌙✨\n\nAap mujhse koi bhi study concept Hindi ya English (ya Hinglish) mein poochh sakte hain. Main concepts ko step-by-step, simple examples aur analogies ke saath explain karungi!\n\nAap apni library ke uploaded notes aur files ke baare mein bhi sawaal poochh sakte hain.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const [configErrorMessage, setConfigErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor online / offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // Ignored
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Check AI backend configuration status
  const checkStatus = async () => {
    try {
      const res = await fetch(`${getApiBase()}/ai/status`);
      if (res.ok) {
        const data = await res.json();
        setApiConfigured(Boolean(data.configured));
        if (!data.configured) {
          setConfigErrorMessage(
            'Online AI Study Assistant requires a free Google Gemini API key (or OpenAI API key). Please configure GEMINI_API_KEY in your .env or Vercel dashboard.'
          );
        } else {
          setConfigErrorMessage(null);
        }
      }
    } catch (err) {
      // Status endpoint may not be reachable if backend is offline
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    sound.playSparkle();
    const initial: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Namaste! Chat history reset ho chuki hai. Aap kya seekhna chahte hain aaj? Ask me any topic in Hindi or English!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    if (!isOnline) {
      sound.playPageTurn();
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Internet Connection Required: Aapka device offline hai. Online AI assistant ko chalane ke liye active internet connection chahiye.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
      setInput('');
      return;
    }

    sound.playPageTurn();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = authService.getToken();
      // Prepare message history to enable follow-up questions
      const apiPayloadMessages = newMessages
        .filter(m => !m.isError)
        .slice(-10) // Send up to last 10 messages for rich conversational context
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch(`${getApiBase()}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          subject: activeSubject
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503 || data.error === 'AI_KEY_NOT_CONFIGURED' || data.configured === false) {
          setApiConfigured(false);
          setConfigErrorMessage(data.message || 'GEMINI_API_KEY is not configured in .env or Vercel Environment Variables.');
          setMessages(prev => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: `🔑 **AI Key Setup Required**\n\nReal Online AI Study Assistant ko chalane ke liye **Google Gemini API Key** configure karni hogi:\n\n1. Visit: [Google AI Studio (Free API Key)](https://aistudio.google.com/app/apikey)\n2. Add to \`.env\` or Vercel Environment Variables:\n\`GEMINI_API_KEY=your_key_here\`\n3. Restart or redeploy the server.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isError: true
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: `⚠️ Error (${res.status}): ${data.error || 'Failed to communicate with AI service. Please try again.'}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isError: true
            }
          ]);
        }
        return;
      }

      sound.playCelestialChime();
      setApiConfigured(true);
      setConfigErrorMessage(null);

      const assistantReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Main aapka sawaal samajh gayi, lekin response generate nahi ho paya. Kripya dubara koshish karein.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notesReferenced: data.retrievedNotesCount
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err: any) {
      sound.playPageTurn();
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Network Error: Could not connect to AI backend endpoint (${err.message || 'Offline'}). Kripya internet connection aur server status check karein.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain WACC formula in simple Hindi & English',
    'Discounted Cash Flow (DCF) step-by-step with example',
    'Help me understand difficult concepts with analogies',
    'What study notes do I have in Corporate Finance?'
  ];

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[450px] max-w-[500px] h-[600px] max-h-[85vh] z-50 rounded-3xl glass-panel-glow border border-lavender-400/40 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-book-open"
      role="dialog"
      aria-label="Online AI Study Assistant"
    >
      {/* Header */}
      <div className="p-3.5 px-4 bg-midnight-950/80 border-b border-lavender-400/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-lavender-600 via-indigo-600 to-stargold-400 flex items-center justify-center text-white shadow-star-glow">
              <Sparkles className="w-4 h-4 text-stargold-200" />
            </div>
            {/* Live Status indicator */}
            <span 
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-midnight-950 ${
                !isOnline 
                  ? 'bg-red-500' 
                  : apiConfigured === false 
                  ? 'bg-amber-400' 
                  : 'bg-emerald-400 animate-pulse'
              }`}
              title={!isOnline ? 'Offline' : apiConfigured === false ? 'API Key Needed' : 'AI Online & Ready'}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm text-white leading-tight">
                Luna • AI Study Mentor
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-lavender-600/40 text-lavender-200 border border-lavender-400/30">
                Online
              </span>
            </div>
            <p className="text-[10px] text-lavender-300/80 leading-tight">
              Bilingual (Hindi & English) • Step-by-Step Concepts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl hover:bg-white/10 text-lavender-300 hover:text-white transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-lavender-300 hover:text-white transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="p-2.5 px-4 bg-red-500/20 border-b border-red-500/40 flex items-center gap-2 text-red-200 text-xs">
          <WifiOff className="w-4 h-4 flex-shrink-0 text-red-300" />
          <p className="text-[11px] leading-tight">
            <strong>No Internet Connection:</strong> Luna requires internet to generate online AI answers.
          </p>
        </div>
      )}

      {/* Unconfigured API Key Banner */}
      {apiConfigured === false && configErrorMessage && (
        <div className="p-2.5 px-4 bg-amber-500/20 border-b border-amber-400/40 flex items-center justify-between gap-2 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-300" />
            <p className="text-[11px] leading-tight">
              <strong>GEMINI_API_KEY</strong> needed in .env or Vercel settings.
            </p>
          </div>
          <button
            onClick={checkStatus}
            className="px-2 py-1 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] hover:bg-amber-500/40 whitespace-nowrap"
          >
            Check Status
          </button>
        </div>
      )}

      {/* Library Context Badge */}
      <div className="py-1 px-4 bg-midnight-950/40 border-b border-lavender-400/10 flex items-center justify-between text-[10px] text-lavender-300/80 font-mono">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-stargold-300" />
          <span>Library Context: {libraryNotesCount} Notes, {libraryFilesCount} Files</span>
        </span>
        {activeSubject && (
          <span className="text-stargold-300/90 truncate max-w-[150px]">
            Subject: {activeSubject}
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-lavender-400">
                <span>{isUser ? 'You' : 'Luna AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.notesReferenced !== undefined && msg.notesReferenced > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-stargold-400/20 text-stargold-300 text-[9px] border border-stargold-400/30 flex items-center gap-0.5">
                    <FileText className="w-2.5 h-2.5" />
                    <span>{msg.notesReferenced} notes used</span>
                  </span>
                )}
              </div>

              <div
                className={`relative group max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isUser
                    ? 'bg-gradient-to-r from-lavender-600 to-indigo-600 text-white rounded-br-xs shadow-md'
                    : msg.isError
                    ? 'bg-red-950/60 border border-red-500/40 text-red-200 rounded-bl-xs'
                    : 'bg-midnight-900/90 border border-lavender-400/20 text-lavender-100 rounded-bl-xs shadow-sm'
                }`}
              >
                {msg.content}

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-black/40 hover:bg-black/60 text-lavender-200 transition-opacity"
                  title="Copy message"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {msg.isError && (
                <button
                  onClick={handleRetryLast}
                  className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 px-1 pt-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry question</span>
                </button>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[10px] font-mono text-lavender-400 px-1">Luna is typing...</span>
            <div className="p-3.5 rounded-2xl bg-midnight-900/90 border border-lavender-400/30 text-lavender-300 rounded-bl-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stargold-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="text-xs font-mono ml-1 text-lavender-300">Explaining step-by-step...</span>
            </div>
          </div>
        )}

        {/* Quick Suggestion Prompts if conversation is short */}
        {messages.length <= 2 && !isLoading && (
          <div className="pt-2 space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-stargold-300/80 px-1">
              Suggested Topics:
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-left p-2 px-3 rounded-xl bg-midnight-900/50 hover:bg-lavender-600/20 border border-lavender-400/20 hover:border-stargold-400/40 text-xs text-lavender-200 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Sparkles className="w-3 h-3 text-lavender-400 group-hover:text-stargold-300 flex-shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-midnight-950/90 border-t border-lavender-400/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !isOnline 
                ? 'Device offline (Internet needed)...' 
                : 'Ask study question in Hindi or English...'
            }
            disabled={isLoading || !isOnline}
            className="flex-1 min-h-[42px] px-3.5 rounded-xl bg-midnight-900/80 border border-lavender-400/30 text-white placeholder-lavender-400/60 text-xs md:text-sm focus:outline-none focus:border-stargold-300 transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isOnline}
            className="min-h-[42px] min-w-[42px] px-3.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-star-glow"
            title="Send Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[9px] text-center text-lavender-400/60 mt-1.5 font-mono">
          Luna explains in simple Hindi & English • Notes & document retrieval active
        </p>
      </div>
    </div>
  );
};

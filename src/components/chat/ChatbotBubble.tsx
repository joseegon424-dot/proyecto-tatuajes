'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function ChatbotBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '¡Hola! Soy el asistente virtual de InkMaster Studio. ¿En qué te puedo asesorar? (Puedes preguntar sobre estilos, precios, cuidados o iniciar reserva)'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Endpoint a crear: /api/chat
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
            });

            if (!res.ok) throw new Error('Error al conectar con OpenAI');

            const data = await res.json();
            const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Error de conexión. Nuestros servidores están saturados temporalmente. Contáctanos vía WhatsApp.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="w-14 h-14 rounded-full bg-gold hover:bg-white text-black shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center p-0 hover:scale-105 group border-0"
                        >
                            <MessageSquare className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] z-50 flex flex-col overflow-hidden bg-black/80 backdrop-blur-2xl border border-white/10 rounded-sm shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                <h3 className="font-black tracking-widest uppercase text-sm text-gold">AI Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-sm p-4 ${message.role === 'user'
                                                ? 'bg-gold text-black ml-auto'
                                                : 'bg-white/5 border border-white/10 text-white/90'
                                            }`}
                                    >
                                        <p className="leading-relaxed tracking-tight">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 rounded-sm p-4 flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <form onSubmit={handleSubmit} className="relative flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="ESCRIBE TU MENSAJE..."
                                    disabled={isLoading}
                                    className="w-full bg-black border border-white/10 p-3 pr-12 text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center text-gold hover:bg-gold/10 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </motion.div >
                )
                }
            </AnimatePresence >
        </>
    );
}

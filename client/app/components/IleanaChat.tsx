import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Close, SmartToy, Grass, Agriculture } from "@mui/icons-material";
import axios from "axios";
// @ts-ignore
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkGfm from "remark-gfm";

interface Message {
    role: "user" | "model";
    text: string;
}

export default function IleanaChat() {
    const [isOpen, setIsOpen] = useState(false);

    const defaultGreeting: Message = {
        role: "model",
        text: "Namaste! 🙏 I'm **Ileana**, your specialized farming assistant. \n\nI can help you with:\n* 🌦️ Weather & Crop advice\n* 🐛 Pest diagnosis & Organic remedies\n* 🌾 Scientific farming methods\n\nAsk me anything in your language! (Telugu, Hindi, English, etc.)",
    };

    const [messages, setMessages] = useState<Message[]>([defaultGreeting]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount (Client-side only)
    useEffect(() => {
        const saved = localStorage.getItem("ileana_chat_history");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever messages change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("ileana_chat_history", JSON.stringify(messages));
        }
    }, [messages, isLoaded]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/chat`,
                {
                    message: input,
                    // Convert history to Gemini format if needed by your backend
                    // Remove the initial welcome message from history as Gemini requires the first message to be from 'user'
                    history: messages.slice(1).map(m => ({
                        role: m.role === "user" ? "user" : "model",
                        parts: [{ text: m.text }]
                    }))
                }
            );

            if (response.data.success) {
                setMessages((prev) => [
                    ...prev,
                    { role: "model", text: response.data.reply },
                ]);
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            let errorMessage = "⚠️ I'm having trouble connecting to the farm server.";

            if (error.response) {
                if (error.response.status === 429) {
                    errorMessage = "⏳ I'm receiving too many requests (Rate Limit). Please wait 1 minute.";
                } else {
                    errorMessage += ` (Status: ${error.response.status})`;
                    if (error.response.data && error.response.data.message) {
                        errorMessage += `\nError: ${error.response.data.message}`;
                    }
                }
            } else if (error.request) {
                errorMessage += " (No Response/Network Error)";
            } else {
                errorMessage += ` (${error.message})`;
            }

            setMessages((prev) => [
                ...prev,
                { role: "model", text: errorMessage },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[600px] h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-green-500/20 flex flex-col z-[9999] overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-800 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Agriculture />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Ileana AI 🌱</h3>
                                    <p className="text-xs text-green-100 opacity-90">Agri-Expert • Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition"
                            >
                                <Close fontSize="small" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/80 scrollbar-thin scrollbar-thumb-green-200">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm overflow-x-auto ${msg.role === "user"
                                            ? "bg-green-600 text-white rounded-tr-none"
                                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                                            }`}
                                    >
                                        {/* Render Markdown for AI responses */}
                                        {msg.role === "model" ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    ul: (props) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                                                    ol: (props) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                                                    strong: (props) => <strong className="font-bold text-green-700 dark:text-green-400" {...props} />,
                                                    a: (props) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                    table: (props) => <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 my-2 text-xs" {...props} />,
                                                    thead: (props) => <thead className="bg-green-100 dark:bg-green-900/30" {...props} />,
                                                    th: (props) => <th className="border border-gray-300 dark:border-gray-600 p-2 text-left font-semibold text-green-800 dark:text-green-300" {...props} />,
                                                    td: (props) => <td className="border border-gray-300 dark:border-gray-600 p-2" {...props} />,
                                                    tr: (props) => <tr className="even:bg-gray-50 dark:even:bg-gray-800/50" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-full border border-transparent focus-within:border-green-500 transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about crops, pests, market..."
                                    className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                                >
                                    <Send fontSize="small" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                Ileana can make mistakes. Consult a local expert for critical decisions.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-[0_8px_30px_rgba(22,163,74,0.4)] flex items-center justify-center z-[9999] hover:shadow-[0_8px_35px_rgba(22,163,74,0.5)] transition-all border-4 border-white/20 backdrop-blur-sm"
            >
                <SmartToy fontSize="medium" />
            </motion.button>
        </>
    );
}

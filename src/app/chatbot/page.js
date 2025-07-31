"use client";
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, X, Edit3, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown"
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hello! I\'m your GitGood AI assistant. How can I help you today? I can help you with GitHub issues, code problems, or any development questions you might have.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [originalMessages, setOriginalMessages] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const components = {
        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold  text-foreground" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold  text-foreground" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold " {...props} />,
        p: ({ node, ...props }) => {
        const align = node?.properties?.align;

        const isImageGroup =
            node?.children?.every?.(child => child.tagName === "img");

        return (
            <p
            className={`my-2 text-base leading-relaxed text-foreground ${
                align === "center" ? "text-center" : ""
            } ${isImageGroup ? "flex flex-wrap justify-center items-center gap-2" : ""}`}
            {...props}
            />
        );
        },
        ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 " {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/50 p-4 rounded-r" {...props} />
        ),
        code: ({ node, ...props }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />
        ),
        pre: ({ node, ...props }) => (
            <pre className="bg-muted dark:bg-foreground/10 text-sm p-2 overflow-x-auto rounded  font-mono" {...props} />
        ),
        a: ({ node, ...props }) => (
            <a
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            />
        ),
        img: ({ node, ...props }) => (
            <img className="inline-block my-4 rounded max-w-full h-auto" alt="" {...props} />
        ),
        strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => (
            <em className="italic text-muted-foreground" {...props} />
        ),
        hr: () => <hr className=" border-t border-border" />,
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleEditMessage = (index) => {
        setInputMessage(messages[index].content);
        setEditIndex(index);
        setOriginalMessages(messages);
        setMessages(prev => prev.slice(0, index + 1));
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCancelEdit = () => {
        if (originalMessages) {
            setMessages(originalMessages);
        }
        setEditIndex(null);
        setInputMessage('');
        setOriginalMessages(null);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isGenerating) return;

        if (editIndex !== null) {
            setMessages(prev => {
                const updated = [...prev];
                updated[editIndex] = {
                    ...updated[editIndex],
                    content: inputMessage.trim(),
                    timestamp: new Date()
                };
                return updated;
            });
            setEditIndex(null);
            setInputMessage('');
            setIsGenerating(true);
        } else {
            const userMessage = {
                id: Date.now(),
                role: 'user',
                content: inputMessage.trim(),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setInputMessage('');
            setIsGenerating(true);
        }

        const controller = new AbortController();
        setAbortController(controller);

        try {
            // await new Promise(resolve => setTimeout(resolve, 3000));
            
            const response = await fetch('/api/ai_api/chatbot', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: inputMessage, messages: messages }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            if(controller.signal.aborted){
                throw new Error('CancelGenerating');
            }

            const data = await response.json();
            
            
            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.response || 'Sorry, I couldn\'t process your request.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            if (error.message === 'CancelGenerating') {
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } finally {
            setIsGenerating(false);
            setAbortController(null);
        }
    };

    const handleCancel = () => {
        if (abortController) {
            abortController.abort();
        }
        setIsGenerating(false);
        setAbortController(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen ">

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((message, idx) => (
                        


                        <div
                            key={message.id}
                            className={` group flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] lg:max-w-[70%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                                <Card className={`${
                                    message.role === 'user'
                                        ? 'bg-primary/90 text-primary-foreground '
                                        : 'bg-card border-border'
                                }`}>
                                    <CardContent className="p-4 ">
                                        <div className="flex items-start space-x-3 ">
                                            <div className={`p-2 rounded-full ${
                                                message.role === 'user' 
                                                    ? 'bg-primary-foreground/20' 
                                                    : 'bg-primary/10'
                                            }`}>
                                                {message.role === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`whitespace-pre-wrap text-sm leading-relaxed `}>
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={remarkGfm} components={components}>
                                                    {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <div className="text-xs opacity-70 mt-2">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                {/* Edit button for user messages */}
                                {message.role === 'user' && !isGenerating && editIndex === null && (
                                    <div className="mt-2 flex justify-end ">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditMessage(idx)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs "
                                        >
                                            <Edit3 className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    ))}
                
                    {/* Loading indicator */}
                    {isGenerating && (
                        <div className="flex justify-start">
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-sm text-muted-foreground">Generating response...</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Container */}
            <div className="border-t border-border p-6 bg-card/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message here... Ask me about GitHub issues, code problems, or anything development-related!"
                                disabled={isGenerating}
                                className="min-h-[60px] max-h-[120px] resize-none pr-12"
                                rows="2"
                            />
                        </div>
                        
                        {isGenerating ? (
                            <Button
                                onClick={handleCancel}
                                variant="destructive"
                                className="px-6 py-3"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        ) : (
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className={`px-6 py-3 ${
                                        editIndex !== null 
                                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                                            : ''
                                    }`}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {editIndex !== null ? 'Update' : 'Send'}
                                </Button>
                                {editIndex !== null && (
                                    <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        className="px-6 py-3"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-muted-foreground">
                            Press Enter to send, Shift+Enter for new line
                        </div>
                        {editIndex !== null && (
                            <Badge variant="secondary" className="text-xs">
                                Editing message
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
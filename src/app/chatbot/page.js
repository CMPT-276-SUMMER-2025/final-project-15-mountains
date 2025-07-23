"use client";
import { useState, useEffect, useRef } from 'react';

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hello! I\'m your GitGood AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [editIndex, setEditIndex] = useState(null); // Track which message is being edited
    const [originalMessages, setOriginalMessages] = useState(null); // Store original messages for cancel
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleEditMessage = (index) => {
        setInputMessage(messages[index].content);
        setEditIndex(index);
        setOriginalMessages(messages); // Save current messages for cancel
        // Remove all messages after the one being edited
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
            // Update the edited message
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
            // Continue to fetch assistant response as if new message
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

        // Create new abort controller for this request
        const controller = new AbortController();
        setAbortController(controller);

        try {
            // Added 3-second delay to test cancel button functionality
            // TODO: Remove this delay when integrating with real API
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // TODO:Simulate API call - replace with our actual API endpoint
            const response = await fetch('/api/ai_api/chatbot', {
                // TODO: implement this when we have the API endpoint
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
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
            if (error.name === 'AbortError') {
              // TODO: change this to a proper error message to show to the user
              // I'm not sure how we could interpret this to the user.
                console.log('Request was cancelled');
            } else {
                console.error('Error:', error);
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
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b border-gray-800">
                <h1 className="text-xl font-semibold">AI Chatbot</h1>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-8 flex justify-center">
                <div className="w-4/5 space-y-4">
                    {messages.map((message, idx) => (
                        <div
                            key={message.id}
                            className={`group flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-3 relative ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-white'
                                }`}
                            >
                                <div className="whitespace-pre-wrap flex items-center">
                                    <span>{message.content}</span>
                                </div>
                                <div className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                            {/* Edit button below, only for user messages, only on hover, only if not editing or generating */}
                            {message.role === 'user' && idx === messages.findLastIndex(m => m.role === 'user') && !isGenerating && editIndex === null && (
                                <div className="mt-1 flex justify-end w-full">
                                    <button
                                        className="inline-flex text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-150 items-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                                        onClick={() => handleEditMessage(idx)}
                                        title="Edit message"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z" /></svg>
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                
                {/* Loading indicator */}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-lg px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-sm text-gray-400">Generating response...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Container */}
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-end space-x-2 justify-center">
                    <div className="w-4/5 relative">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            disabled={isGenerating}
                            className="w-full p-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            rows="2"
                            style={{ minHeight: '88px', maxHeight: '120px' }}
                        />
                    </div>
                    
                    {isGenerating ? (
                        <button
                            onClick={handleCancel}
                            className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                        </button>
                    ) : (
                        <>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className={`px-4 py-3 ${editIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>{editIndex !== null ? 'Update' : 'Send'}</span>
                        </button>
                        {editIndex !== null && (
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 ml-2"
                            >
                                Cancel
                            </button>
                        )}
                        </>
                    )}
                </div>
                
                <div className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
}
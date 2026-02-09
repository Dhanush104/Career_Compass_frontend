import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Send, X, Sparkles, Bot, User,
    Lightbulb, BookOpen, Briefcase, Code, Target,
    Loader, Trash2, Copy, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { config } from '../config';

const AIAssistant = ({ user, onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi ${user?.fullName || user?.username || 'there'}! 👋 I'm your AI Career Assistant. I can help you with:

• Career guidance and planning
• Interview preparation tips
• Resume and profile optimization
• Skill development recommendations
• Goal setting strategies
• Coding challenge hints

What would you like help with today?`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickPrompts = [
        { icon: Briefcase, text: 'Help me prepare for interviews', color: 'blue' },
        { icon: Target, text: 'Suggest career goals', color: 'green' },
        { icon: Code, text: 'Recommend skills to learn', color: 'purple' },
        { icon: BookOpen, text: 'Review my progress', color: 'orange' }
    ];

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Call backend AI API
            const response = await fetch(`${config.endpoints.ai}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversationHistory: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                source: data.source // 'openai' or 'pattern-based'
            }]);

            // Show note if using fallback
            if (data.note) {
                toast(data.note, { icon: 'ℹ️' });
            }
        } catch (error) {
            toast.error('Failed to get AI response');
            console.error('AI Error:', error);

            // Fallback to local pattern-based response
            const aiResponse = generateAIResponse(userMessage.content, user);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
                source: 'local-fallback'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = (query, userData) => {
        const lowerQuery = query.toLowerCase();

        // Interview preparation
        if (lowerQuery.includes('interview')) {
            return `Great! Let me help you prepare for interviews. Based on your profile:

**Technical Interview Tips:**
• Practice coding problems on platforms like LeetCode
• Review data structures and algorithms
• Prepare examples using the STAR method
• Research the company's tech stack

**Your Skills to Highlight:**
${userData?.skills?.slice(0, 3).map(s => `• ${s.name} (${s.level})`).join('\n') || '• Add skills to your profile first!'}

**Mock Interview Practice:**
Go to the Interview Prep section to practice with AI-powered mock interviews.

Would you like specific tips for any particular type of interview?`;
        }

        // Career goals
        if (lowerQuery.includes('goal') || lowerQuery.includes('career')) {
            return `Let's set some meaningful career goals! Here are my recommendations:

**Short-term Goals (1-3 months):**
• Complete 2-3 online courses in your target skills
• Build 1-2 portfolio projects
• Contribute to open-source projects
• Network with 5-10 professionals in your field

**Medium-term Goals (3-6 months):**
• Master advanced concepts in your primary skill
• Prepare and pass technical interviews
• Build a strong GitHub profile
• Create a personal brand on LinkedIn

**Long-term Goals (6-12 months):**
• Land your dream job or promotion
• Mentor junior developers
• Speak at tech meetups or conferences
• Build a side project that generates income

Would you like help creating specific, measurable goals?`;
        }

        // Skills recommendation
        if (lowerQuery.includes('skill') || lowerQuery.includes('learn')) {
            const currentSkills = userData?.skills?.map(s => s.name).join(', ') || 'none listed';
            return `Based on your current skills (${currentSkills}), here are my recommendations:

**High-Demand Skills to Learn:**
• **TypeScript** - Industry standard for large projects
• **Docker & Kubernetes** - Essential for DevOps
• **System Design** - Critical for senior roles
• **Cloud Platforms** (AWS/Azure/GCP) - High market demand
• **GraphQL** - Modern API development

**Learning Path:**
1. Start with fundamentals (if needed)
2. Build small projects to practice
3. Contribute to open-source
4. Document your learning journey
5. Share knowledge through blogs/tutorials

**Resources:**
• Free courses in our platform
• Coding challenges for practice
• Project ideas to build portfolio

Which skill would you like to focus on first?`;
        }

        // Progress review
        if (lowerQuery.includes('progress') || lowerQuery.includes('review')) {
            return `Let me review your progress! 📊

**Your Stats:**
• Level: ${userData?.level || 1}
• Total XP: ${userData?.xp?.toLocaleString() || 0}
• Current Streak: ${userData?.streak || 0} days
• Skills: ${userData?.skills?.length || 0}
• Projects: ${userData?.projects?.length || 0}

**Strengths:**
✅ You're actively using the platform
✅ Building your skill set
✅ Working on projects

**Areas to Improve:**
${userData?.streak < 7 ? '⚠️ Try to maintain a 7-day learning streak' : '✅ Great streak! Keep it up!'}
${userData?.skills?.length < 5 ? '⚠️ Add more skills to your profile' : '✅ Good skill diversity!'}
${userData?.projects?.length < 3 ? '⚠️ Build more portfolio projects' : '✅ Strong project portfolio!'}

**Next Steps:**
1. Set weekly learning goals
2. Complete daily challenges
3. Build one project per month
4. Network with peers

Keep up the great work! 🚀`;
        }

        // Default response
        return `I understand you're asking about "${query}". Here's how I can help:

**I can assist with:**
• 💼 Career planning and guidance
• 📝 Interview preparation strategies
• 🎯 Goal setting and tracking
• 💻 Skill development recommendations
• 📊 Progress analysis and feedback
• 🚀 Project ideas and guidance

**Quick Actions:**
• Ask me specific questions about your career
• Request personalized learning paths
• Get interview tips for specific companies
• Brainstorm project ideas
• Review your profile and suggest improvements

What specific area would you like to explore?`;
    };

    const handleQuickPrompt = (promptText) => {
        setInput(promptText);
        inputRef.current?.focus();
    };

    const copyMessage = (content) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
    };

    const clearChat = () => {
        setMessages([messages[0]]); // Keep welcome message
        toast.success('Chat cleared!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="w-full max-w-4xl h-[80vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-primary-500 to-accent-600">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Career Assistant</h2>
                            <p className="text-sm text-white/80">Powered by AI • Always here to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearChat}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Clear chat"
                        >
                            <Trash2 size={20} className="text-white" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Quick Prompts */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-surface-50 dark:bg-neutral-800/50">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {quickPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickPrompt(prompt.text)}
                                className={`flex items-center gap-2 px-4 py-2 bg-${prompt.color}-100 dark:bg-${prompt.color}-900/30 text-${prompt.color}-700 dark:text-${prompt.color}-300 rounded-lg hover:scale-105 transition-all whitespace-nowrap text-sm font-medium`}
                            >
                                <prompt.icon size={16} />
                                {prompt.text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                                    ? 'bg-gradient-to-br from-primary-500 to-accent-600'
                                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    }`}>
                                    {message.role === 'assistant' ? (
                                        <Bot size={20} className="text-white" />
                                    ) : (
                                        <User size={20} className="text-white" />
                                    )}
                                </div>

                                {/* Message Content */}
                                <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                                    <div className={`max-w-[80%] ${message.role === 'assistant'
                                        ? 'bg-surface-100 dark:bg-neutral-800'
                                        : 'bg-gradient-to-br from-primary-500 to-accent-600 text-white'
                                        } rounded-2xl p-4`}>
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {message.content}
                                        </div>
                                        <div className={`flex items-center justify-between mt-3 pt-3 border-t ${message.role === 'assistant'
                                            ? 'border-neutral-200 dark:border-neutral-700'
                                            : 'border-white/20'
                                            }`}>
                                            <span className={`text-xs ${message.role === 'assistant'
                                                ? 'text-neutral-500 dark:text-neutral-400'
                                                : 'text-white/70'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {message.role === 'assistant' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => copyMessage(message.content)}
                                                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                                                        title="Copy message"
                                                    >
                                                        <Copy size={14} className="text-neutral-500 dark:text-neutral-400" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                                                        title="Helpful"
                                                    >
                                                        <ThumbsUp size={14} className="text-neutral-500 dark:text-neutral-400" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                                                        title="Not helpful"
                                                    >
                                                        <ThumbsDown size={14} className="text-neutral-500 dark:text-neutral-400" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="bg-surface-100 dark:bg-neutral-800 rounded-2xl p-4">
                                <div className="flex items-center gap-2">
                                    <Loader size={16} className="animate-spin text-primary-500" />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">AI is thinking...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-surface-50 dark:bg-neutral-800/50">
                    <div className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything about your career..."
                            className="flex-1 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-neutral-100"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                        >
                            <Send size={20} />
                            Send
                        </button>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                        AI responses are generated based on your profile and may not always be accurate. Use as guidance only.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIAssistant;

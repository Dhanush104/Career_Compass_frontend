import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    MessageCircle, Clock, CheckCircle, Play, Pause, RotateCcw, 
    Lightbulb, Star, BookOpen, Video, Mic, Users, Target,
    TrendingUp, Award, Brain, Code, Database, Shield, Smartphone
} from 'lucide-react';

const InterviewPrep = () => {
    const [selectedCategory, setSelectedCategory] = useState('technical');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const categories = [
        { id: 'technical', name: 'Technical', icon: Code, color: 'primary' },
        { id: 'behavioral', name: 'Behavioral', icon: Users, color: 'accent' },
        { id: 'system-design', name: 'System Design', icon: Database, color: 'success' },
        { id: 'leadership', name: 'Leadership', icon: Target, color: 'warning' },
        { id: 'company-specific', name: 'Company Specific', icon: Award, color: 'info' }
    ];

    const questions = {
        technical: [
            {
                id: 1,
                question: "Explain the difference between let, const, and var in JavaScript.",
                difficulty: "Easy",
                category: "JavaScript",
                tips: [
                    "Discuss scope differences (function vs block)",
                    "Explain hoisting behavior",
                    "Mention temporal dead zone for let/const",
                    "Give practical examples"
                ],
                followUp: "Can you show an example where this difference matters?"
            },
            {
                id: 2,
                question: "How would you optimize a React application for better performance?",
                difficulty: "Medium",
                category: "React",
                tips: [
                    "Mention React.memo and useMemo",
                    "Discuss code splitting and lazy loading",
                    "Talk about virtual DOM optimization",
                    "Explain bundle size reduction techniques"
                ],
                followUp: "What tools would you use to measure performance?"
            },
            {
                id: 3,
                question: "Design a scalable REST API for a social media platform.",
                difficulty: "Hard",
                category: "Backend",
                tips: [
                    "Define clear resource endpoints",
                    "Discuss authentication and authorization",
                    "Consider rate limiting and caching",
                    "Plan for pagination and filtering"
                ],
                followUp: "How would you handle real-time features like notifications?"
            }
        ],
        behavioral: [
            {
                id: 4,
                question: "Tell me about a time when you had to work with a difficult team member.",
                difficulty: "Medium",
                category: "Teamwork",
                tips: [
                    "Use the STAR method (Situation, Task, Action, Result)",
                    "Focus on your actions and communication",
                    "Show empathy and understanding",
                    "Highlight the positive outcome"
                ],
                followUp: "What would you do differently in a similar situation?"
            },
            {
                id: 5,
                question: "Describe a project where you had to learn a new technology quickly.",
                difficulty: "Easy",
                category: "Learning",
                tips: [
                    "Show your learning methodology",
                    "Mention resources you used",
                    "Discuss challenges and how you overcame them",
                    "Quantify the impact of your learning"
                ],
                followUp: "How do you stay updated with new technologies?"
            }
        ],
        'system-design': [
            {
                id: 6,
                question: "Design a URL shortening service like bit.ly",
                difficulty: "Hard",
                category: "System Design",
                tips: [
                    "Start with requirements gathering",
                    "Estimate scale and capacity",
                    "Design database schema",
                    "Discuss caching and CDN strategies"
                ],
                followUp: "How would you handle analytics and click tracking?"
            }
        ],
        leadership: [
            {
                id: 7,
                question: "How do you handle conflicting priorities from different stakeholders?",
                difficulty: "Medium",
                category: "Management",
                tips: [
                    "Discuss communication strategies",
                    "Mention stakeholder alignment techniques",
                    "Show decision-making framework",
                    "Emphasize transparency and documentation"
                ],
                followUp: "Can you give an example from your experience?"
            }
        ],
        'company-specific': [
            {
                id: 8,
                question: "Why do you want to work at our company?",
                difficulty: "Easy",
                category: "Motivation",
                tips: [
                    "Research company values and mission",
                    "Connect your goals with company goals",
                    "Mention specific products or initiatives",
                    "Show genuine enthusiasm"
                ],
                followUp: "What do you know about our recent developments?"
            }
        ]
    };

    const mockInterviews = [
        {
            id: 1,
            title: "FAANG Technical Interview",
            company: "Google",
            duration: "45 min",
            difficulty: "Hard",
            topics: ["Algorithms", "Data Structures", "System Design"],
            participants: 1250
        },
        {
            id: 2,
            title: "Startup Full-Stack Interview",
            company: "Various Startups",
            duration: "60 min",
            difficulty: "Medium",
            topics: ["React", "Node.js", "Database Design"],
            participants: 890
        },
        {
            id: 3,
            title: "Behavioral Interview Practice",
            company: "Fortune 500",
            duration: "30 min",
            difficulty: "Easy",
            topics: ["Leadership", "Teamwork", "Problem Solving"],
            participants: 2100
        }
    ];

    const resources = [
        {
            title: "Cracking the Coding Interview",
            type: "Book",
            rating: 4.8,
            description: "Comprehensive guide to technical interviews with 189 programming questions."
        },
        {
            title: "Behavioral Interview Masterclass",
            type: "Course",
            rating: 4.9,
            description: "Learn the STAR method and practice with real scenarios."
        },
        {
            title: "System Design Interview Guide",
            type: "Video Series",
            rating: 4.7,
            description: "Step-by-step approach to system design problems."
        }
    ];

    const currentQuestions = questions[selectedCategory] || [];
    const currentQ = currentQuestions[currentQuestion];

    const startTimer = () => {
        setIsTimerRunning(true);
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        return interval;
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        setTimer(0);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const nextQuestion = () => {
        if (currentQuestion < currentQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                    Interview Preparation
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Practice interview questions, improve your skills, and land your dream job.
                </p>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setCurrentQuestion(0);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Question Practice */}
                <div className="lg:col-span-2">
                    <div className="card-hover p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                Practice Questions
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {currentQuestion + 1} of {currentQuestions.length}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} className="text-neutral-500" />
                                    <span className="text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                                        {formatTime(timer)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {currentQ && (
                            <div className="space-y-6">
                                {/* Question Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                currentQ.difficulty === 'Easy' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' :
                                                currentQ.difficulty === 'Medium' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300' :
                                                'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
                                            }`}>
                                                {currentQ.difficulty}
                                            </span>
                                            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-xs font-medium">
                                                {currentQ.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                                            {currentQ.question}
                                        </h3>
                                    </div>
                                </div>

                                {/* Timer Controls */}
                                <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                    <button
                                        onClick={isTimerRunning ? stopTimer : startTimer}
                                        className="btn btn-md btn-primary"
                                    >
                                        {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                                        {isTimerRunning ? 'Pause' : 'Start'}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="btn btn-md btn-outline"
                                    >
                                        <RotateCcw size={16} />
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsRecording(!isRecording)}
                                        className={`btn btn-md ${isRecording ? 'btn-error' : 'btn-outline'}`}
                                    >
                                        <Mic size={16} />
                                        {isRecording ? 'Stop Recording' : 'Record Answer'}
                                    </button>
                                </div>

                                {/* Tips */}
                                <div className="p-4 bg-info-50 dark:bg-info-900/20 rounded-xl border border-info-200 dark:border-info-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb size={18} className="text-info-600 dark:text-info-400" />
                                        <h4 className="font-semibold text-info-900 dark:text-info-100">Tips for answering:</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {currentQ.tips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-info-800 dark:text-info-200">
                                                <CheckCircle size={14} className="mt-0.5 text-info-600 dark:text-info-400 flex-shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Follow-up Question */}
                                <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-200 dark:border-accent-800">
                                    <h4 className="font-semibold text-accent-900 dark:text-accent-100 mb-2">Follow-up Question:</h4>
                                    <p className="text-sm text-accent-800 dark:text-accent-200">{currentQ.followUp}</p>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        onClick={prevQuestion}
                                        disabled={currentQuestion === 0}
                                        className="btn btn-md btn-outline disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={nextQuestion}
                                        disabled={currentQuestion === currentQuestions.length - 1}
                                        className="btn btn-md btn-primary disabled:opacity-50"
                                    >
                                        Next Question
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Mock Interviews */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Video size={20} className="text-primary-600" />
                            Mock Interviews
                        </h3>
                        <div className="space-y-4">
                            {mockInterviews.map((interview) => (
                                <div key={interview.id} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                            {interview.title}
                                        </h4>
                                        <span className="text-xs text-neutral-500">{interview.duration}</span>
                                    </div>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{interview.company}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {interview.topics.map((topic) => (
                                            <span key={topic} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded text-xs">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-neutral-500">{interview.participants} participants</span>
                                        <button className="btn btn-sm btn-primary">Join</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-accent-600" />
                            Recommended Resources
                        </h3>
                        <div className="space-y-4">
                            {resources.map((resource, index) => (
                                <div key={index} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                            {resource.title}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-warning-500 fill-current" />
                                            <span className="text-xs text-neutral-600">{resource.rating}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{resource.type}</span>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">{resource.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-success-600" />
                            Your Progress
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-600 dark:text-neutral-400">Questions Practiced</span>
                                    <span className="font-bold text-neutral-900 dark:text-neutral-100">47/100</span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full" style={{ width: '47%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-600 dark:text-neutral-400">Mock Interviews</span>
                                    <span className="font-bold text-neutral-900 dark:text-neutral-100">3/10</span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-accent-500 to-primary-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InterviewPrep;

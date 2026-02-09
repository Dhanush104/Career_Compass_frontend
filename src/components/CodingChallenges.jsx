import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Code, Play, CheckCircle, Clock, Trophy, Star, Filter,
    Zap, Target, Brain, Database, Shield, Smartphone, 
    Search, Award, TrendingUp, Users, BookOpen, ExternalLink
} from 'lucide-react';

const CodingChallenges = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    const difficulties = [
        { id: 'all', name: 'All Levels', color: 'neutral' },
        { id: 'easy', name: 'Easy', color: 'success' },
        { id: 'medium', name: 'Medium', color: 'warning' },
        { id: 'hard', name: 'Hard', color: 'error' }
    ];

    const categories = [
        { id: 'all', name: 'All Categories', icon: Code },
        { id: 'algorithms', name: 'Algorithms', icon: Brain },
        { id: 'data-structures', name: 'Data Structures', icon: Database },
        { id: 'dynamic-programming', name: 'Dynamic Programming', icon: Zap },
        { id: 'system-design', name: 'System Design', icon: Target },
        { id: 'frontend', name: 'Frontend', icon: Code },
        { id: 'backend', name: 'Backend', icon: Shield }
    ];

    const challenges = [
        {
            id: 1,
            title: "Two Sum",
            difficulty: "easy",
            category: "algorithms",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            tags: ["Array", "Hash Table"],
            timeLimit: "30 min",
            points: 100,
            solved: 15420,
            acceptance: 89,
            companies: ["Google", "Amazon", "Microsoft"],
            hints: [
                "Try using a hash map to store complements",
                "Think about the time complexity - can you do it in O(n)?"
            ],
            examples: [
                {
                    input: "nums = [2,7,11,15], target = 9",
                    output: "[0,1]",
                    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
                }
            ]
        },
        {
            id: 2,
            title: "Reverse Linked List",
            difficulty: "easy",
            category: "data-structures",
            description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            tags: ["Linked List", "Recursion"],
            timeLimit: "20 min",
            points: 150,
            solved: 12340,
            acceptance: 76,
            companies: ["Facebook", "Apple", "Netflix"],
            hints: [
                "Consider both iterative and recursive approaches",
                "Keep track of previous, current, and next nodes"
            ],
            examples: [
                {
                    input: "head = [1,2,3,4,5]",
                    output: "[5,4,3,2,1]",
                    explanation: "The linked list is reversed."
                }
            ]
        },
        {
            id: 3,
            title: "Maximum Subarray",
            difficulty: "medium",
            category: "dynamic-programming",
            description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
            tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
            timeLimit: "45 min",
            points: 250,
            solved: 8920,
            acceptance: 68,
            companies: ["Google", "Amazon", "Bloomberg"],
            hints: [
                "Think about Kadane's algorithm",
                "At each position, decide whether to extend the existing subarray or start a new one"
            ],
            examples: [
                {
                    input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                    output: "6",
                    explanation: "The subarray [4,-1,2,1] has the largest sum = 6."
                }
            ]
        },
        {
            id: 4,
            title: "Design URL Shortener",
            difficulty: "hard",
            category: "system-design",
            description: "Design a URL shortening service like bit.ly. Consider scalability, reliability, and performance.",
            tags: ["System Design", "Scalability", "Database Design"],
            timeLimit: "90 min",
            points: 500,
            solved: 2340,
            acceptance: 45,
            companies: ["Google", "Facebook", "Twitter"],
            hints: [
                "Think about the encoding scheme for short URLs",
                "Consider database sharding and caching strategies",
                "Plan for high read/write ratios"
            ],
            examples: [
                {
                    input: "longUrl = 'https://example.com/very/long/url'",
                    output: "shortUrl = 'https://short.ly/abc123'",
                    explanation: "The system should generate a unique short URL for each long URL."
                }
            ]
        },
        {
            id: 5,
            title: "Build a Todo App",
            difficulty: "medium",
            category: "frontend",
            description: "Create a fully functional todo application with add, edit, delete, and filter functionality.",
            tags: ["React", "JavaScript", "CSS", "State Management"],
            timeLimit: "120 min",
            points: 300,
            solved: 5670,
            acceptance: 82,
            companies: ["Airbnb", "Uber", "Spotify"],
            hints: [
                "Focus on component structure and state management",
                "Implement proper error handling and validation",
                "Consider accessibility and responsive design"
            ],
            examples: [
                {
                    input: "User actions: add, edit, delete, filter todos",
                    output: "Functional todo application with persistent state",
                    explanation: "The app should handle all CRUD operations smoothly."
                }
            ]
        }
    ];

    const leaderboard = [
        { rank: 1, name: "Alex Chen", points: 15420, solved: 234, avatar: "AC" },
        { rank: 2, name: "Sarah Johnson", points: 14890, solved: 221, avatar: "SJ" },
        { rank: 3, name: "Mike Rodriguez", points: 13560, solved: 198, avatar: "MR" },
        { rank: 4, name: "Emily Davis", points: 12340, solved: 187, avatar: "ED" },
        { rank: 5, name: "David Kim", points: 11890, solved: 176, avatar: "DK" }
    ];

    const contests = [
        {
            id: 1,
            title: "Weekly Challenge #47",
            startTime: "2024-11-15 10:00 AM",
            duration: "90 minutes",
            participants: 1247,
            prize: "$500",
            status: "upcoming"
        },
        {
            id: 2,
            title: "Algorithm Sprint",
            startTime: "2024-11-18 2:00 PM",
            duration: "120 minutes",
            participants: 892,
            prize: "$1000",
            status: "upcoming"
        },
        {
            id: 3,
            title: "Frontend Masters",
            startTime: "2024-11-12 9:00 AM",
            duration: "180 minutes",
            participants: 2341,
            prize: "$2000",
            status: "completed"
        }
    ];

    const filteredChallenges = challenges.filter(challenge => {
        const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
        const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
        const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDifficulty && matchesCategory && matchesSearch;
    });

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-success-600 bg-success-100 dark:bg-success-900/30 dark:text-success-300';
            case 'medium': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-300';
            case 'hard': return 'text-error-600 bg-error-100 dark:bg-error-900/30 dark:text-error-300';
            default: return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300';
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
                    Coding Challenges
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Sharpen your coding skills with our curated collection of programming challenges.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">47</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Problems Solved</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">1,250</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Points Earned</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">12</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Contest Wins</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">#156</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Global Rank</div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Difficulty Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {difficulties.map((difficulty) => (
                        <button
                            key={difficulty.id}
                            onClick={() => setSelectedDifficulty(difficulty.id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                selectedDifficulty === difficulty.id
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                    : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {difficulty.name}
                        </button>
                    ))}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-accent-500 text-white'
                                        : 'bg-surface-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-surface-300 dark:hover:bg-neutral-600'
                                }`}
                            >
                                <Icon size={14} />
                                {category.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Challenges List */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {filteredChallenges.map((challenge, index) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-hover p-6 cursor-pointer"
                                onClick={() => setSelectedChallenge(challenge)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                {challenge.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                                            {challenge.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {challenge.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-lg font-bold text-success-600 dark:text-success-400 mb-1">
                                            {challenge.points} pts
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {challenge.timeLimit}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {challenge.solved.toLocaleString()} solved
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            {challenge.acceptance}% acceptance
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {challenge.companies.slice(0, 3).map((company) => (
                                            <span key={company} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs">
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Leaderboard */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Trophy size={20} className="text-warning-500" />
                            Leaderboard
                        </h3>
                        <div className="space-y-3">
                            {leaderboard.map((user) => (
                                <div key={user.rank} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        user.rank === 1 ? 'bg-warning-500 text-white' :
                                        user.rank === 2 ? 'bg-neutral-400 text-white' :
                                        user.rank === 3 ? 'bg-amber-600 text-white' :
                                        'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                    }`}>
                                        {user.rank}
                                    </div>
                                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{user.name}</div>
                                        <div className="text-xs text-neutral-500">{user.solved} solved • {user.points.toLocaleString()} pts</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Contests */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-accent-600" />
                            Contests
                        </h3>
                        <div className="space-y-4">
                            {contests.map((contest) => (
                                <div key={contest.id} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                            {contest.title}
                                        </h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            contest.status === 'upcoming' 
                                                ? 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300'
                                                : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                                        }`}>
                                            {contest.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {contest.startTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={12} />
                                            {contest.participants} participants
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Trophy size={12} />
                                            Prize: {contest.prize}
                                        </div>
                                    </div>
                                    {contest.status === 'upcoming' && (
                                        <button className="btn btn-sm btn-primary w-full mt-3">
                                            Register
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Plan */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-success-600" />
                            Study Plan
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Arrays & Strings</span>
                                    <span className="text-xs text-success-600 dark:text-success-400">8/12</span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                                </div>
                            </div>
                            <div className="p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Linked Lists</span>
                                    <span className="text-xs text-warning-600 dark:text-warning-400">3/8</span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-warning-500 to-warning-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                                </div>
                            </div>
                            <div className="p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Trees & Graphs</span>
                                    <span className="text-xs text-error-600 dark:text-error-400">1/15</span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-error-500 to-error-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenge Detail Modal */}
            {selectedChallenge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                        {selectedChallenge.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                                            {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
                                        </span>
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {selectedChallenge.points} points • {selectedChallenge.timeLimit}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedChallenge(null)}
                                    className="btn btn-md btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Problem Description</h3>
                                    <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                                        {selectedChallenge.description}
                                    </p>
                                    
                                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Examples:</h4>
                                    {selectedChallenge.examples.map((example, index) => (
                                        <div key={index} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-lg mb-4">
                                            <div className="mb-2">
                                                <strong className="text-sm text-neutral-700 dark:text-neutral-300">Input:</strong>
                                                <code className="block mt-1 p-2 bg-neutral-100 dark:bg-neutral-700 rounded text-sm">
                                                    {example.input}
                                                </code>
                                            </div>
                                            <div className="mb-2">
                                                <strong className="text-sm text-neutral-700 dark:text-neutral-300">Output:</strong>
                                                <code className="block mt-1 p-2 bg-neutral-100 dark:bg-neutral-700 rounded text-sm">
                                                    {example.output}
                                                </code>
                                            </div>
                                            <div>
                                                <strong className="text-sm text-neutral-700 dark:text-neutral-300">Explanation:</strong>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                    {example.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Hints</h3>
                                    <div className="space-y-3 mb-6">
                                        {selectedChallenge.hints.map((hint, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-info-50 dark:bg-info-900/20 rounded-lg">
                                                <div className="w-6 h-6 bg-info-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <p className="text-sm text-info-800 dark:text-info-200">{hint}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Companies:</h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedChallenge.companies.map((company) => (
                                            <span key={company} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm">
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button className="btn btn-lg btn-primary flex-1">
                                            <Play size={20} />
                                            Start Coding
                                        </button>
                                        <button className="btn btn-lg btn-outline">
                                            <BookOpen size={20} />
                                            Editorial
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CodingChallenges;

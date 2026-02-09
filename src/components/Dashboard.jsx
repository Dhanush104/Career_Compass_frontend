import React, { useState, useEffect, useMemo } from 'react';
import { config } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Compass, Star, RefreshCw, BarChart3, LogOut, Menu, X, TrendingUp,
    Award, User as UserIcon, ExternalLink, FolderKanban, Users,
    PlusCircle, Bell, Calendar, Zap, Search, Filter,
    Trash2, BookMarked, Target, Trophy, Flame, Code, BookOpen, Mic,
    Briefcase, Rocket, ChevronDown, Circle, CheckCircle, PlayCircle, ArrowLeft,
    MessageCircle, FileText, Clock, Activity, Brain
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast'; // You may need to run: npm install react-hot-toast
import UserProfile from './UserProfile.jsx';
import SkillsManager from './SkillsManager.jsx';
import FreeCourses from './FreeCourses.jsx';
import Mentorship from './Mentorship.jsx';
import Placement from './Placement.jsx';
import Podcast from './Podcast.jsx';
import CreatePost from './CreatePost.jsx';
import ReportCard from './ReportCard.jsx';
import AIAssistant from './AIAssistant.jsx';
import AddProjectModal from './AddProjectModal.jsx';
// Add back components one by one to test
import InterviewPrep from './InterviewPrep.jsx';
import ResumeBuilder from './ResumeBuilder.jsx';
import CodingChallenges from './CodingChallenges.jsx';
import GoalTracker from './GoalTracker.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import { EnhancedRoadmap, EnhancedProjects } from './EnhancedComponents';
import { XPProgressChart, SkillsRadarChart, ActivityBarChart, GoalsDonutChart } from './DashboardCharts.jsx';

// --- LoginPage Component (Handles Login UI and Logic) ---


// --- DYNAMIC QUIZ COMPONENT ---
const Quiz = ({ onQuizComplete }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${config.endpoints.roadmap}/quiz`); // Use config
                if (!response.ok) throw new Error('Failed to fetch quiz questions.');
                const data = await response.json();
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const submitAnswers = async (finalAnswers) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.roadmap}/generate`, { // Use config
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ answers: finalAnswers }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate recommendations.');
            onQuizComplete(data.recommendations);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        const currentQuestion = questions[currentQuestionIndex];
        const newAnswer = { questionId: currentQuestion._id, optionText: option.optionText };
        const updatedAnswers = [...selectedAnswers, newAnswer];
        setSelectedAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitAnswers(updatedAnswers);
        }
    };

    if (loading) return <div className="text-center p-12 text-neutral-600 dark:text-neutral-400">Loading Quiz...</div>;
    if (error) return <div className="text-center p-12 text-error-600 dark:text-error-400">Error: {error}</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-surface-200 dark:border-neutral-800">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                        <div className="bg-warning-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">{currentQuestion.questionText}</h2>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className="w-full text-left p-4 rounded-lg border-2 border-surface-200 dark:border-neutral-700 hover:border-warning-400 dark:hover:border-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/10 transition-all"
                        >
                            <span className="text-neutral-800 dark:text-neutral-100 font-medium">{option.optionText}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = ({ onLogout, user }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(user);
    const [userStatus, setUserStatus] = useState('not-taken');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New course available', message: 'React Advanced Patterns is now live!', type: 'info', time: '2 hours ago', read: false },
        { id: 2, title: 'Goal completed', message: 'You completed your weekly coding challenge!', type: 'success', time: '1 day ago', read: false },
        { id: 3, title: 'Streak milestone', message: 'Congratulations on your 7-day streak!', type: 'achievement', time: '2 days ago', read: true }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [quickStats, setQuickStats] = useState({
        todayXP: 150,
        weeklyGoal: 5,
        completedToday: 2,
        upcomingDeadlines: 3
    });
    const [analyticsData, setAnalyticsData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [showAIAssistant, setShowAIAssistant] = useState(false);

    console.log('🔍 Dashboard currentUser:', currentUser);

    // Data states
    const [projects, setProjects] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [recommendedPaths, setRecommendedPaths] = useState([]);
    const [expandedMilestones, setExpandedMilestones] = useState({});

    // Hooks for modals and forms are now inside the components that need them
    const [isAddProjectModalOpen, setAddProjectModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [posts, setPosts] = useState([]);
    const [detailedUser, setDetailedUser] = useState(null);

    // Click outside handler for notifications
    useEffect(() => {
        const handleClickOutside = (event) => {
            try {
                if (showNotifications && !event.target.closest('.notifications-container')) {
                    setShowNotifications(false);
                }
            } catch (error) {
                console.warn('Error in click outside handler:', error);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('🔄 Step 1: fetchData started');
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('❌ Step 2: No token found');
                onLogout();
                return;
            }

            console.log('✅ Step 2: Token exists');

            try {
                console.log('📡 Step 3: Making API calls...');
                const [projectsRes, userProfileRes, analyticsRes, leaderboardRes, tasksRes, deadlinesRes] = await Promise.all([
                    fetch(`${config.endpoints.projects}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${config.endpoints.users}/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${config.endpoints.analytics}/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).catch(() => null),
                    fetch(`${config.endpoints.analytics}/leaderboard?type=xp&limit=5`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).catch(() => null),
                    fetch(`${config.endpoints.goals}/today`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).catch(() => null),
                    fetch(`${config.endpoints.goals}/deadlines`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).catch(() => null)
                ]);

                console.log('📥 Step 4: Responses received');
                console.log('  - Projects status:', projectsRes.status);
                console.log('  - User profile status:', userProfileRes.status);

                // ✅ Only logout if user profile fails (authentication issue)
                if (!userProfileRes.ok) {
                    console.log('❌ Step 5: User profile request failed');
                    toast.error("Session expired. Please log in again.");
                    onLogout();
                    return;
                }

                console.log('✅ Step 5: User profile OK');

                // ✅ Parse responses - handle projects 404 gracefully
                const projectsData = projectsRes.ok
                    ? await projectsRes.json()
                    : { projects: [] }; // Empty array if projects endpoint doesn't exist

                const userProfile = await userProfileRes.json();

                console.log('📦 Step 6: Data parsed');
                console.log('  - Projects:', projectsData);
                console.log('  - User Profile:', userProfile);

                console.log('🎯 Step 7: About to call setCurrentUser');
                setCurrentUser(userProfile);
                console.log('✅ Step 8: setCurrentUser called');

                setProjects(projectsData.projects || []);
                setUserSkills(userProfile.skills || []);
                setStreak(userProfile.streak || 0);
                setLevel(userProfile.level || 1);
                setXp(userProfile.xp || 0);

                // Fetch analytics data
                try {
                    if (analyticsRes && analyticsRes.ok) {
                        const analyticsJson = await analyticsRes.json();
                        if (analyticsJson.success) {
                            setAnalyticsData(analyticsJson.dashboard);
                        }
                    }
                } catch (analyticsError) {
                    console.warn('Analytics data not available:', analyticsError);
                    // Continue without analytics - it's optional
                }

                // Fetch leaderboard data
                try {
                    if (leaderboardRes && leaderboardRes.ok) {
                        const leaderboardJson = await leaderboardRes.json();
                        if (leaderboardJson.success) {
                            setLeaderboard(leaderboardJson.leaderboard);
                        }
                    }
                } catch (leaderboardError) {
                    console.warn('Leaderboard data not available:', leaderboardError);
                    // Continue without leaderboard - it's optional
                }

                // Fetch today's tasks
                try {
                    if (tasksRes && tasksRes.ok) {
                        const tasksJson = await tasksRes.json();
                        if (tasksJson.success) {
                            setTodaysTasks(tasksJson.tasks);
                        }
                    }
                } catch (tasksError) {
                    console.warn('Tasks data not available:', tasksError);
                    // Continue without tasks - it's optional
                }

                // Fetch upcoming deadlines
                try {
                    if (deadlinesRes && deadlinesRes.ok) {
                        const deadlinesJson = await deadlinesRes.json();
                        if (deadlinesJson.success) {
                            setUpcomingDeadlines(deadlinesJson.deadlines);
                        }
                    }
                } catch (deadlinesError) {
                    console.warn('Deadlines data not available:', deadlinesError);
                    // Continue without deadlines - it's optional
                }

                if (userProfile.roadmap && userProfile.roadmap.milestones) {
                    setRecommendedPaths([userProfile.roadmap]);
                    setUserStatus('completed');
                }

                console.log('✅ Step 9: All state updates complete');
            } catch (error) {
                console.error("❌ ERROR in fetchData:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
                console.log('🏁 Step 10: Loading set to false');
            }
        };

        console.log('🚀 useEffect triggered');
        const token = localStorage.getItem('token');

        if (token) {
            fetchData();
        } else {
            console.log('⚠️ No token, redirecting to login');
            onLogout();
        }
    }, [onLogout]); // ✅ Only depend on onLogout, not user


    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
        setUserSkills(updatedUser.skills || []);
        // Update other related states if needed
    };

    const handleQuizComplete = (recommendations) => {
        if (recommendations && recommendations.length > 0) {
            setRecommendedPaths(recommendations);
            setUserStatus('completed');
            setActiveTab('roadmap');
        } else {
            toast.error("Could not generate a roadmap from your answers.");
        }
    };

    const handleRetakeQuiz = () => {
        setUserStatus('not-taken');
        setRecommendedPaths([]);
        setActiveTab('roadmap');
        toast.success("Ready to retake the quiz!");
    };

    /* HIGHLIGHT: ADD THIS NEW FUNCTION INSIDE YOUR DASHBOARD COMPONENT */

    const handleChoosePath = async (careerPathId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.roadmap}/choose`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ careerPathId })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to save the path.");
            }

            // On success, update the UI to show only the chosen path
            toast.success("Roadmap saved to your profile!");
            setRecommendedPaths([data.roadmap]); // The backend returns the newly saved roadmap

        } catch (error) {
            toast.error(error.message);
            console.error("Error choosing path:", error);
        }
    };

    const handleAddProject = async (projectData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.projects}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(projectData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to add project.');
            setProjects(data.projects);
            setAddProjectModalOpen(false); // Close modal on success
            toast.success("Project added successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };



    const filteredProjects = useMemo(() => projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) && (filterStatus === 'all' || p.status === filterStatus)), [projects, searchQuery, filterStatus]);
    const handleToggleMilestone = (pathIndex, milestoneIndex) => {
        const key = `${pathIndex}-${milestoneIndex}`;
        setExpandedMilestones(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Render functions
    const renderRoadmapView = () => (
        userStatus === 'not-taken' ? (
            <div className="w-full max-w-4xl mx-auto py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Discover Your Path</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">Answer a few questions to generate your personalized career roadmap.</p>
                </div>
                <Quiz onQuizComplete={handleQuizComplete} />
            </div>
        ) : (
            <EnhancedRoadmap
                recommendedPaths={recommendedPaths}
                expandedMilestones={expandedMilestones}
                onToggleMilestone={handleToggleMilestone}
                onChoosePath={handleChoosePath}
            />
        )
    );

    const handleDeleteProject = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.projects}/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete project.');
            setProjects(data.projects);
            toast.success("Project deleted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const renderProjectsView = () => (
        <EnhancedProjects
            projects={projects}
            onAddProject={() => setAddProjectModalOpen(true)}
            onDeleteProject={handleDeleteProject}
        />
    );

    const renderDashboardView = () => (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Premium Welcome Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 rounded-3xl p-8 lg:p-10 text-white shadow-2xl">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Welcome Back  {currentUser?.name}
                                <span className="inline-block ml-2 animate-bounce">👋</span>
                            </h1>
                            <p className="text-xl text-primary-100 mb-6 leading-relaxed">
                                {streak > 0
                                    ? `Amazing! You're on a ${streak}-day learning streak! Keep it up! 🔥`
                                    : "Ready to start your learning journey today? Let's make it count! 🚀"
                                }
                            </p>

                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                    <div className="text-2xl font-bold">{xp.toLocaleString()}</div>
                                    <div className="text-sm text-primary-100">Total XP</div>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                    <div className="text-2xl font-bold">{projects.length}</div>
                                    <div className="text-sm text-primary-100">Projects</div>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                                    <div className="text-2xl font-bold">{userSkills.length}</div>
                                    <div className="text-sm text-primary-100">Skills</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                                <div className="text-3xl font-bold mb-2">Level {level}</div>
                                <div className="text-sm text-primary-100 mb-3">Current Level</div>
                                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-white h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${Math.min((xp / (level * 1000)) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="text-xs text-primary-100">
                                    {Math.round((xp / (level * 1000)) * 100)}% to Level {level + 1}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Learning Streak",
                        value: streak,
                        change: "+2 from yesterday",
                        icon: Flame,
                        bgGradient: "from-orange-500/10 to-red-500/10",
                        borderColor: "border-orange-200/50 dark:border-orange-800/50",
                        iconBg: "from-orange-500 to-red-500",
                        accentColor: "text-orange-600 dark:text-orange-400"
                    },
                    {
                        title: "Active Projects",
                        value: projects.length,
                        change: `${projects.length > 0 ? '+1 this week' : 'Start your first'}`,
                        icon: FolderKanban,
                        bgGradient: "from-blue-500/10 to-indigo-500/10",
                        borderColor: "border-blue-200/50 dark:border-blue-800/50",
                        iconBg: "from-blue-500 to-indigo-500",
                        accentColor: "text-blue-600 dark:text-blue-400"
                    },
                    {
                        title: "Skills Mastered",
                        value: userSkills.length,
                        change: `${userSkills.length > 0 ? 'Keep growing!' : 'Add your first'}`,
                        icon: Target,
                        bgGradient: "from-purple-500/10 to-pink-500/10",
                        borderColor: "border-purple-200/50 dark:border-purple-800/50",
                        iconBg: "from-purple-500 to-pink-500",
                        accentColor: "text-purple-600 dark:text-purple-400"
                    },
                    {
                        title: "Experience Level",
                        value: `Level ${level}`,
                        change: `${xp.toLocaleString()} XP earned`,
                        icon: Award,
                        bgGradient: "from-emerald-500/10 to-teal-500/10",
                        borderColor: "border-emerald-200/50 dark:border-emerald-800/50",
                        iconBg: "from-emerald-500 to-teal-500",
                        accentColor: "text-emerald-600 dark:text-emerald-400"
                    }
                ].map((card, index) => (
                    <div
                        key={card.title}
                        className={`group relative bg-white dark:bg-neutral-900 ${card.bgGradient} backdrop-blur-sm p-6 rounded-2xl border ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden`}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-br ${card.iconBg} rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                    <card.icon size={24} className="text-white" />
                                </div>
                                <div className={`px-3 py-1 bg-surface-100 dark:bg-neutral-800 rounded-full text-xs font-medium ${card.accentColor}`}>
                                    {card.change}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:scale-105 transition-transform duration-300">
                                    {card.value}
                                </div>
                                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    {card.title}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Overview Section */}
            {analyticsData && (
                <div className="mb-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-xl border border-surface-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Learning Analytics</h2>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Your performance insights</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame size={20} className="text-orange-600" />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Current Streak</span>
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{analyticsData?.currentStreak || 0}</div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Best: {analyticsData?.longestStreak || 0} days</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target size={20} className="text-green-600" />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Goals Done</span>
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{analyticsData.goals?.completedGoals || 0}</div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{analyticsData.goals?.activeGoals || 0} active</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={20} className="text-blue-600" />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Time Spent</span>
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{Math.round((analyticsData?.totalTimeSpent || 0) / 60)}h</div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{analyticsData?.totalSessions || 0} sessions</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={20} className="text-purple-600" />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Activities</span>
                                </div>
                                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{analyticsData?.totalActivitiesCompleted || 0}</div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Analytics Section - Recent Activity & Skills */}
            {analyticsData && analyticsData.recentActivity && analyticsData.recentActivity.length > 0 && (
                <div className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity Timeline */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-primary-600" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {analyticsData.recentActivity.slice(0, 5).map((activity, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl hover:bg-surface-100 dark:hover:bg-neutral-700 transition-colors">
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400 w-20">
                                                {new Date(activity.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {activity.activitiesCompleted} activities completed
                                                    </div>
                                                    <div className="text-xs text-success-600 dark:text-success-400 font-medium">
                                                        +{activity.xpEarned} XP
                                                    </div>
                                                </div>
                                                <div className="text-xs text-neutral-500">
                                                    {Math.round(activity.timeSpent)} minutes • {activity.sessionsCount} sessions
                                                </div>
                                            </div>
                                            <div className="w-16 h-2 bg-surface-200 dark:bg-neutral-700 rounded-full">
                                                <div
                                                    className="h-2 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full"
                                                    style={{ width: `${Math.min((activity.timeSpent / 120) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Skills & Achievements Sidebar */}
                        <div className="space-y-6">
                            {/* Top Skills */}
                            {analyticsData.topSkills && analyticsData.topSkills.length > 0 && (
                                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                                        <Brain size={20} className="text-primary-600" />
                                        Top Skills
                                    </h3>
                                    <div className="space-y-3">
                                        {analyticsData.topSkills.slice(0, 4).map((skill, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                                        {skill.skillName}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {skill.practiceHours?.toFixed(1) || 0}h practiced
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                                        {skill.currentLevel}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        {skill.progress}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Achievements */}
                            {analyticsData.recentAchievements && analyticsData.recentAchievements.length > 0 && (
                                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                                        <Award size={20} className="text-warning-600" />
                                        Recent Achievements
                                    </h3>
                                    <div className="space-y-3">
                                        {analyticsData.recentAchievements.slice(0, 3).map((achievement, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                                <div className="w-8 h-8 bg-warning-500 rounded-lg flex items-center justify-center">
                                                    <Star size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                                        {achievement.title}
                                                    </div>
                                                    <div className="text-xs text-neutral-500">
                                                        +{achievement.xpReward} XP • {new Date(achievement.unlockedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Data Visualization Charts Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Performance Insights</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Visual analytics of your progress</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* XP Progress Chart */}
                    <XPProgressChart data={analyticsData?.recentActivity?.map(activity => ({
                        date: new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        xp: activity.xpEarned
                    }))} />

                    {/* Skills Radar Chart */}
                    <SkillsRadarChart skills={userSkills} />

                    {/* Activity Bar Chart */}
                    <ActivityBarChart data={analyticsData?.recentActivity?.map(activity => ({
                        day: new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        activities: activity.activitiesCompleted
                    }))} />

                    {/* Goals Donut Chart */}
                    <GoalsDonutChart goalsData={analyticsData?.goals ? [
                        { name: 'Completed', value: analyticsData.goals.completedGoals || 0, color: '#10b981' },
                        { name: 'Active', value: analyticsData.goals.activeGoals || 0, color: '#f59e0b' },
                        { name: 'Pending', value: (analyticsData.goals.totalGoals || 0) - (analyticsData.goals.completedGoals || 0) - (analyticsData.goals.activeGoals || 0), color: '#6b7280' }
                    ] : null} />
                </div>
            </div>

            {/* Enhanced Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column - Recent Activity & Progress */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Enhanced Progress Overview */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Your Progress
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Track your learning journey
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="bg-gradient-to-r from-surface-50 to-surface-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Level {level} Progress</span>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{xp.toLocaleString()}</span>
                                    <span className="text-sm text-neutral-500"> / {(level * 1000).toLocaleString()} XP</span>
                                </div>
                            </div>
                            <div className="relative w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((xp / (level * 1000)) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500 mt-2">
                                <span>Level {level}</span>
                                <span>{Math.round((xp / (level * 1000)) * 100)}% Complete</span>
                                <span>Level {level + 1}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-warning-500 to-orange-500 rounded-lg shadow-lg">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Quick Actions
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Take action on your goals
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'New Goal', icon: Target, action: () => setActiveTab('goalTracker'), color: 'from-emerald-500 to-teal-600' },
                                { label: 'Retake Quiz', icon: RefreshCw, action: handleRetakeQuiz, color: 'from-amber-500 to-orange-600' },
                                { label: 'Practice', icon: Code, action: () => setActiveTab('codingChallenges'), color: 'from-blue-500 to-indigo-600' },
                                { label: 'Learn', icon: BookOpen, action: () => setActiveTab('freeCourses'), color: 'from-purple-500 to-pink-600' },
                                { label: 'Connect', icon: Users, action: () => setActiveTab('mentorship'), color: 'from-orange-500 to-red-600' }
                            ].map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className={`group relative p-4 bg-gradient-to-br ${action.color} text-white rounded-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl min-h-[90px]`}
                                >
                                    <action.icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-sm font-semibold">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Top Skills */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-lg">
                                    <Star size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Top Skills
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Your expertise areas
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('skills')}
                                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-xs font-medium"
                            >
                                Manage
                            </button>
                        </div>
                        <div className="space-y-3">
                            {userSkills.length > 0 ? userSkills.slice(0, 4).map((skill, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg hover:bg-surface-100 dark:hover:bg-neutral-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                                            <Code size={18} className="text-white" />
                                        </div>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{skill.name || `Skill ${i + 1}`}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                            {skill.level || 'Beginner'}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                    <Code size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No skills added yet</p>
                                    <button
                                        onClick={() => setActiveTab('skills')}
                                        className="mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                                    >
                                        Add your first skill
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Premium Widgets */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Today's Focus */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800 hover:shadow-2xl transition-all duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg shadow-lg">
                                    <Calendar size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Today's Focus
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            {todaysTasks.length > 0 && (
                                <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                                    {todaysTasks.length} {todaysTasks.length === 1 ? 'task' : 'tasks'}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            {todaysTasks.length > 0 ? todaysTasks.map((item, index) => (
                                <div key={index} className="p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg hover:bg-surface-100 dark:hover:bg-neutral-700 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.task}</span>
                                        <span className="text-xs text-neutral-500 bg-surface-200 dark:bg-neutral-700 px-2 py-1 rounded-full">{item.time}</span>
                                    </div>
                                    <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-neutral-500">{item.progress}% Complete</span>
                                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Level 1</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                    <Target size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No tasks for today</p>
                                    <button
                                        onClick={() => setActiveTab('goalTracker')}
                                        className="mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                                    >
                                        Create your first goal
                                    </button>
                                </div>
                            )}
                        </div>
                        {todaysTasks.length > 0 && (
                            <button
                                onClick={() => setActiveTab('goalTracker')}
                                className="w-full mt-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            >
                                View All Goals
                            </button>
                        )}
                    </div>

                    {/* Leaderboard Widget */}
                    {leaderboard.length > 0 && (
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800 hover:shadow-2xl transition-all duration-300 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-lg">
                                        <Trophy size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                            Leaderboard
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            Top performers
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {leaderboard.slice(0, 5).map((user, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg hover:bg-surface-100 dark:hover:bg-neutral-700 transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' :
                                                index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                                {user.userId?.fullName || user.userId?.username || 'User'}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {user.totalXP?.toLocaleString() || 0} XP
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Premium Deadlines Tracker */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800 hover:shadow-2xl transition-all duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg">
                                    <Clock size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Upcoming Deadlines
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Stay on track with your goals
                                    </p>
                                </div>
                            </div>
                            {upcomingDeadlines.length > 0 && (
                                <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                                    {upcomingDeadlines.length} pending
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            {upcomingDeadlines.length > 0 ? upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                                <div key={index} className={`p-4 rounded-lg border-l-4 hover:bg-opacity-80 transition-colors ${deadline.urgent
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-warning-500 bg-warning-50 dark:bg-warning-900/20'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{deadline.title}</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${deadline.urgent
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                                            }`}>
                                            {deadline.date}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                    <Clock size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No upcoming deadlines</p>
                                    <button
                                        onClick={() => setActiveTab('goalTracker')}
                                        className="mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                                    >
                                        Set a deadline
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Insights */}
            {analyticsData && analyticsData.learningInsights && (
                <div className="mt-8 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                    <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-info-600" />
                        Learning Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Best Time to Learn</div>
                            <div className="text-info-700 dark:text-info-300">
                                {analyticsData.learningInsights.preferredTimeOfDay || 'Not enough data'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Avg Session Length</div>
                            <div className="text-info-700 dark:text-info-300">
                                {Math.round(analyticsData.learningInsights.averageSessionLength || 0)} minutes
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Most Active Day</div>
                            <div className="text-info-700 dark:text-info-300">
                                {analyticsData.learningInsights.mostActiveDay || 'Not enough data'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Sidebar
    const renderSidebar = () => {
        const NavButton = ({ tabName, icon, label, badge, badgeColor = 'bg-primary-500' }) => (
            <li>
                <button
                    onClick={() => {
                        setActiveTab(tabName);
                        setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-all duration-300 group ${activeTab === tabName
                        ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20 scale-[1.02]'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-[1.02] hover:shadow-md'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-lg transition-all duration-300 ${activeTab === tabName
                            ? 'bg-white/20'
                            : 'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
                            }`}>
                            {icon}
                        </div>
                        <span className="font-medium">{label}</span>
                    </div>
                    {badge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium text-white ${badgeColor} ${activeTab === tabName ? 'bg-white/20' : ''
                            }`}>
                            {badge}
                        </span>
                    )}
                </button>
            </li>
        );

        return (
            <div
                className={`fixed top-0 left-0 h-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-r border-surface-200/50 dark:border-neutral-800/50 w-64 z-40 transform transition-all duration-300 shadow-xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full p-6">
                    <div
                        className="flex items-center space-x-3 mb-8 cursor-pointer group"
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <Compass size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Career Compass</span>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Your Learning Journey</div>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    {currentUser && (
                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-4 mb-6 border border-primary-100 dark:border-primary-800/30">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                                        {currentUser.name || 'User'}
                                    </div>
                                    <div className="text-xs text-primary-600 dark:text-primary-400">
                                        Level {level} • {streak} day streak
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round((xp % 1000) / 10)}%</span>
                                </div>
                                <div className="w-full bg-white dark:bg-neutral-800 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-500 to-accent-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(xp % 1000) / 10}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <nav className="flex-1 overflow-y-auto -mr-4 pr-4">
                        <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Menu</p>
                        <ul className="space-y-2">
                            <NavButton tabName="dashboard" icon={<BarChart3 size={20} />} label="Dashboard" />
                            {recommendedPaths.length > 0 && <NavButton tabName="roadmap" icon={<Rocket size={20} />} label="My Roadmap" />}
                            <NavButton tabName="projects" icon={<FolderKanban size={20} />} label="My Projects" />
                            <NavButton tabName="skills" icon={<Target size={20} />} label="My Skills" />
                            <NavButton tabName="createPost" icon={<PlusCircle size={20} />} label=" Post" />


                        </ul>
                        <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-6 mb-2">Career Tools</p>
                        <ul className="space-y-2">
                            {/* Add back navigation items one by one */}
                            <NavButton tabName="interviewPrep" icon={<MessageCircle size={20} />} label="Interview Prep" />
                            <NavButton tabName="resumeBuilder" icon={<FileText size={20} />} label="Resume Builder" />
                            <NavButton tabName="codingChallenges" icon={<Code size={20} />} label="Coding Challenges" />
                            <NavButton tabName="goalTracker" icon={<Target size={20} />} label="Goal Tracker" />
                            <NavButton tabName="analytics" icon={<BarChart3 size={20} />} label="Analytics" />
                        </ul>
                        <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-6 mb-2">Discover</p>
                        <ul className="space-y-2">

                            <NavButton tabName="freeCourses" icon={<BookOpen size={20} />} label="Free Courses" />


                            <NavButton tabName="podcast" icon={<Mic size={20} />} label="Podcast" />
                            <NavButton tabName="report" icon={<BarChart3 size={20} />} label="Report Card" />
                            <NavButton tabName="profile" icon={<UserIcon size={20} />} label="My Profile" />
                        </ul>
                    </nav>
                    <div className="mt-4 border-t pt-4 border-surface-200 dark:border-neutral-800">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center space-x-3 p-3 text-neutral-500 dark:text-neutral-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                        >
                            <LogOut size={20} /><span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        // ✅ CRITICAL FIX: Wait for data before rendering
        if (loading || !currentUser) {
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                        <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium">Loading your profile...</p>
                    </div>
                </div>
            );
        }

        const tabs = {
            dashboard: renderDashboardView(),
            projects: renderProjectsView(),
            skills: <SkillsManager
                user={currentUser}
                onUpdate={handleUserUpdate}
            />,
            profile: <UserProfile
                user={currentUser}
                onUpdate={handleUserUpdate}
            />,
            roadmap: renderRoadmapView(),
            freeCourses: <FreeCourses />,
            mentorship: <Mentorship user={currentUser} />,
            placement: <Placement user={currentUser} />,
            podcast: <Podcast />,
            report: (
                <div className="w-full h-[calc(100vh-120px)] overflow-y-auto p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-7xl mx-auto"
                    >
                        <ReportCard
                            user={currentUser}
                            onUpdate={handleUserUpdate}
                            onNavigate={(tab) => setActiveTab(tab)}
                        />
                    </motion.div>
                </div>
            ),
            createPost: <CreatePost user={currentUser} onPostCreated={() => setActiveTab('blog')} />,
            // Add back components one by one
            interviewPrep: <InterviewPrep />,
            resumeBuilder: <ResumeBuilder />,
            codingChallenges: <CodingChallenges />,
            goalTracker: <GoalTracker />,
            analytics: (
                <ErrorBoundary>
                    <AnalyticsDashboard />
                </ErrorBoundary>
            )


        };

        return (
            <>
                {tabs[activeTab] || renderDashboardView()}

                {/* AI Assistant Floating Button */}
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAIAssistant(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-primary-500/50 transition-all group"
                    title="AI Career Assistant"
                >
                    <Brain size={28} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>

                {/* AI Assistant Modal */}
                <AnimatePresence>
                    {showAIAssistant && (
                        <AIAssistant
                            user={currentUser}
                            onClose={() => setShowAIAssistant(false)}
                        />
                    )}
                </AnimatePresence>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 text-neutral-800 dark:text-neutral-100 transition-all duration-500">

            {renderSidebar()}
            <div className="relative md:pl-64">
                {/* Enhanced Header */}
                <header className="sticky top-0 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-surface-200/50 dark:border-neutral-800/50 shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-surface-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <Menu size={20} />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:flex items-center gap-2 bg-surface-50 dark:bg-neutral-800 rounded-xl px-4 py-2 min-w-80">
                                <Search size={18} className="text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Search features, goals, or content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none flex-1 text-sm placeholder-neutral-500"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="p-1 hover:bg-surface-200 dark:hover:bg-neutral-700 rounded"
                                    >
                                        <X size={14} className="text-neutral-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Quick Stats */}
                            <div className="hidden lg:flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                    <Zap size={16} className="text-primary-600" />
                                    <span className="font-medium text-primary-700 dark:text-primary-300">+{quickStats.todayXP} XP today</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 dark:bg-success-900/20 rounded-lg">
                                    <Trophy size={16} className="text-success-600" />
                                    <span className="font-medium text-success-700 dark:text-success-300">{quickStats.completedToday}/{quickStats.weeklyGoal} goals</span>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="relative notifications-container">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-surface-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <Bell size={20} />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-surface-200 dark:border-neutral-800 z-[60]">
                                        <div className="p-4 border-b border-surface-200 dark:border-neutral-800">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Notifications</h3>
                                                <button
                                                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-surface-100 dark:border-neutral-800 hover:bg-surface-50 dark:hover:bg-neutral-800 transition-colors ${!notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${notification.type === 'success' ? 'bg-success-100 dark:bg-success-900/30' :
                                                            notification.type === 'achievement' ? 'bg-warning-100 dark:bg-warning-900/30' :
                                                                'bg-info-100 dark:bg-info-900/30'
                                                            }`}>
                                                            {notification.type === 'success' ? <CheckCircle size={16} className="text-success-600" /> :
                                                                notification.type === 'achievement' ? <Trophy size={16} className="text-warning-600" /> :
                                                                    <Bell size={16} className="text-info-600" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-neutral-500 mt-2">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <button className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-surface-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                                <PlusCircle size={20} />
                            </button>
                        </div>
                    </div>
                </header>
                {/* Enhanced Content Area */}
                <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="w-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            {isAddProjectModalOpen && (
                <AddProjectModal
                    isOpen={isAddProjectModalOpen}
                    onClose={() => setAddProjectModalOpen(false)}
                    onAddProject={handleAddProject}
                />
            )}

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--toast-bg, #ffffff)',
                        color: 'var(--toast-text, #000000)',
                        border: '1px solid var(--toast-border, #e5e7eb)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                }}
            />
        </div>
    );
};


export default Dashboard;
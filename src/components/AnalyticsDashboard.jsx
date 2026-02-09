import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Award, Target, Clock, Zap, Star,
    BarChart3, PieChart, Calendar, Trophy, Flame,
    BookOpen, Code, Users, Briefcase, Brain
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { config } from '../config';

const AnalyticsDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchLeaderboard();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.analytics}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDashboardData(data.dashboard);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.analytics}/leaderboard?type=xp&limit=5`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">No analytics data available</p>
            </div>
        );
    }

    const activityCategories = [
        { id: 'interviewPractice', name: 'Interview Practice', icon: Users, color: 'primary' },
        { id: 'codingChallenges', name: 'Coding Challenges', icon: Code, color: 'success' },
        { id: 'resumeBuilding', name: 'Resume Building', icon: Briefcase, color: 'warning' },
        { id: 'goalTracking', name: 'Goal Tracking', icon: Target, color: 'accent' },
        { id: 'courseLearning', name: 'Course Learning', icon: BookOpen, color: 'info' },
        { id: 'networking', name: 'Networking', icon: Users, color: 'error' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                    Analytics Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Track your progress, achievements, and learning insights.
                </p>
            </div>

            {/* Level and XP Section */}
            <div className="mb-8">
                <div className="card-hover p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center">
                                <Trophy size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Level {dashboardData.level}
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {dashboardData.totalXP.toLocaleString()} XP Total
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                Next Level
                            </div>
                            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                {dashboardData.xpToNextLevel} XP
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-primary-500 to-accent-600 h-3 rounded-full transition-all duration-500"
                            style={{
                                width: `${((dashboardData.totalXP % 100) / 100) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-hover p-6 text-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Flame size={24} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {dashboardData.currentStreak}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Day Streak</div>
                    <div className="text-xs text-neutral-500 mt-1">
                        Best: {dashboardData.longestStreak} days
                    </div>
                </div>

                <div className="card-hover p-6 text-center">
                    <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target size={24} className="text-success-600 dark:text-success-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {dashboardData.goals.completedGoals}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Goals Completed</div>
                    <div className="text-xs text-neutral-500 mt-1">
                        {dashboardData.goals.activeGoals} active
                    </div>
                </div>

                <div className="card-hover p-6 text-center">
                    <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock size={24} className="text-warning-600 dark:text-warning-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {Math.round(dashboardData.totalTimeSpent / 60)}h
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Time Spent</div>
                    <div className="text-xs text-neutral-500 mt-1">
                        {dashboardData.totalSessions} sessions
                    </div>
                </div>

                <div className="card-hover p-6 text-center">
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp size={24} className="text-accent-600 dark:text-accent-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {dashboardData.interviews.averageRating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Avg Rating</div>
                    <div className="text-xs text-neutral-500 mt-1">
                        {dashboardData.interviews.totalSessions} interviews
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <div className="lg:col-span-2">
                    <div className="card-hover p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                Activity Overview
                            </h3>
                            <div className="flex gap-2">
                                {['week', 'month'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-surface-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                            }`}
                                    >
                                        {period === 'month' ? 'Last 30 Days' : 'Last 7 Days'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={dashboardData.recentActivity}>
                                    <defs>
                                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#f3f4f6' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="activitiesCompleted" name="Activities" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Area yAxisId="right" type="monotone" dataKey="xpEarned" name="XP Earned" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorXp)" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Top Skills Radar */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Brain size={20} className="text-primary-600" />
                            Skills Analysis
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardData.topSkills}>
                                    <PolarGrid stroke="#374151" opacity={0.2} />
                                    <PolarAngleAxis dataKey="skillName" fontSize={12} tick={{ fill: '#9ca3af' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Proficiency"
                                        dataKey="progress"
                                        stroke="#f59e0b"
                                        fill="#f59e0b"
                                        fillOpacity={0.5}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.75rem', color: '#f3f4f6' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4">
                            {dashboardData.topSkills.slice(0, 3).map((skill, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-secondary-500' : 'bg-accent-500'}`}></div>
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{skill.skillName}</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary-600">{skill.currentLevel}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-warning-600" />
                            Recent Achievements
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.recentAchievements.map((achievement, index) => (
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

                    {/* Leaderboard */}
                    <div className="card-hover p-6">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                            <Trophy size={20} className="text-accent-600" />
                            Leaderboard
                        </h3>
                        <div className="space-y-3">
                            {leaderboard.map((user, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-warning-500 text-white' :
                                        index === 1 ? 'bg-neutral-400 text-white' :
                                            index === 2 ? 'bg-amber-600 text-white' :
                                                'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                                            {user.userId?.fullName || user.userId?.username || 'User'}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {user.totalXP.toLocaleString()} XP
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Learning Insights */}
            {dashboardData.learningInsights && (
                <div className="mt-8 p-6 bg-gradient-to-r from-info-50 to-primary-50 dark:from-info-950/50 dark:to-primary-950/50 rounded-2xl border border-info-200 dark:border-info-800">
                    <h3 className="text-lg font-bold text-info-900 dark:text-info-100 mb-4">Learning Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Best Time to Learn</div>
                            <div className="text-info-700 dark:text-info-300">
                                {dashboardData.learningInsights.preferredTimeOfDay || 'Not enough data'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Avg Session Length</div>
                            <div className="text-info-700 dark:text-info-300">
                                {Math.round(dashboardData.learningInsights.averageSessionLength || 0)} minutes
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-info-800 dark:text-info-200">Most Active Day</div>
                            <div className="text-info-700 dark:text-info-300">
                                {dashboardData.learningInsights.mostActiveDay || 'Not enough data'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AnalyticsDashboard;

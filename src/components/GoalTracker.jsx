import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Target, Plus, CheckCircle, Clock, Calendar, TrendingUp,
    Edit3, Trash2, Star, Award, Zap, BookOpen, Code, Users,
    Briefcase, GraduationCap, Trophy, Flag, BarChart3
} from 'lucide-react';
import { config } from '../config';

const GoalTracker = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [stats, setStats] = useState({
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        averageProgress: 0
    });
    const [loading, setLoading] = useState(true);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: 'career',
        priority: 'medium',
        deadline: '',
        milestones: []
    });

    // Fetch goals on component mount
    useEffect(() => {
        fetchGoals();
        fetchGoalStats();
    }, []);

    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.goals}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setGoals(data.goals);
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
            toast.error('Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const fetchGoalStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.goals}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching goal stats:', error);
        }
    };

    const categories = [
        { id: 'career', name: 'Career', icon: Briefcase, color: 'primary' },
        { id: 'learning', name: 'Learning', icon: BookOpen, color: 'success' },
        { id: 'technical', name: 'Technical', icon: Code, color: 'accent' },
        { id: 'networking', name: 'Networking', icon: Users, color: 'warning' },
        { id: 'personal', name: 'Personal', icon: Star, color: 'info' }
    ];

    const priorities = [
        { id: 'low', name: 'Low', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' },
        { id: 'medium', name: 'Medium', color: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300' },
        { id: 'high', name: 'High', color: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300' }
    ];

    // Goals data is now managed through state and fetched from backend

    const filteredGoals = goals.filter(goal => {
        if (activeTab === 'active') return goal.status === 'active';
        if (activeTab === 'completed') return goal.status === 'completed';
        return true;
    });

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.icon : Target;
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.color : 'primary';
    };

    const getPriorityColor = (priority) => {
        const p = priorities.find(pr => pr.id === priority);
        return p ? p.color : priorities[1].color;
    };

    const addMilestone = () => {
        setNewGoal(prev => ({
            ...prev,
            milestones: [...prev.milestones, {
                id: Date.now(),
                title: '',
                completed: false,
                dueDate: ''
            }]
        }));
    };

    const removeMilestone = (id) => {
        setNewGoal(prev => ({
            ...prev,
            milestones: prev.milestones.filter(m => m.id !== id)
        }));
    };

    const updateMilestone = (id, field, value) => {
        setNewGoal(prev => ({
            ...prev,
            milestones: prev.milestones.map(m =>
                m.id === id ? { ...m, [field]: value } : m
            )
        }));
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editGoalId, setEditGoalId] = useState(null);

    const handleEditGoal = (goal) => {
        setNewGoal({
            title: goal.title,
            description: goal.description,
            category: goal.category,
            priority: goal.priority,
            deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
            milestones: goal.milestones || []
        });
        setEditGoalId(goal._id);
        setIsEditing(true);
        setShowAddGoal(true);
    };

    const handleCloseModal = () => {
        setShowAddGoal(false);
        setIsEditing(false);
        setEditGoalId(null);
        setNewGoal({
            title: '',
            description: '',
            category: 'career',
            priority: 'medium',
            deadline: '',
            milestones: []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = isEditing
                ? `${config.endpoints.goals}/${editGoalId}`
                : `${config.endpoints.goals}`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newGoal)
            });

            const data = await response.json();
            if (data.success) {
                if (isEditing) {
                    setGoals(goals.map(g => g._id === editGoalId ? data.goal : g));
                    toast.success('Goal updated successfully!');
                } else {
                    setGoals([data.goal, ...goals]);
                    toast.success('Goal created successfully!');
                }
                handleCloseModal();
                fetchGoalStats(); // Refresh stats
            } else {
                toast.error(data.error || `Failed to ${isEditing ? 'update' : 'create'} goal`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} goal:`, error);
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} goal`);
        }
    };

    // Kept for backward compatibility with existing code if called elsewhere, calling the internal update logic
    const handleUpdateGoal = async (goalId, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.goals}/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();
            if (data.success) {
                setGoals(goals.map(g => g._id === goalId ? data.goal : g));
                // Only show toast if it's a specific user action (handled by toggleMilestone etc., but good to have fallback)
                fetchGoalStats();
            } else {
                toast.error(data.error || 'Failed to update goal');
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            toast.error('Failed to update goal');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.goals}/${goalId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setGoals(goals.filter(g => g._id !== goalId));
                toast.success('Goal deleted successfully!');
                fetchGoalStats();
            } else {
                toast.error(data.error || 'Failed to delete goal');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            toast.error('Failed to delete goal');
        }
    };

    const handleToggleMilestone = async (goalId, milestoneId, completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.endpoints.goals}/${goalId}/milestones/${milestoneId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed })
            });

            const data = await response.json();
            if (data.success) {
                setGoals(goals.map(g => g._id === goalId ? data.goal : g));
                toast.success(`Milestone ${completed ? 'completed' : 'reopened'}!`);
                fetchGoalStats();
            } else {
                toast.error(data.error || 'Failed to update milestone');
            }
        } catch (error) {
            console.error('Error updating milestone:', error);
            toast.error('Failed to update milestone');
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
                    Goal Tracker
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Set, track, and achieve your career and personal development goals.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stats.totalGoals}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Goals</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">{stats.activeGoals}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Goals</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">{stats.completedGoals}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Completed</div>
                </div>
                <div className="card-hover p-6 text-center">
                    <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">{stats.averageProgress}%</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Avg Progress</div>
                </div>
            </div>

            {/* Tabs and Add Button */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                    {[
                        { id: 'active', name: 'Active Goals', icon: Target },
                        { id: 'completed', name: 'Completed', icon: CheckCircle },
                        { id: 'all', name: 'All Goals', icon: BarChart3 }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                    : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => setShowAddGoal(true)}
                    className="btn btn-lg btn-primary"
                >
                    <Plus size={20} />
                    New Goal
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <>
                    {/* Goals Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredGoals.map((goal, index) => {
                            const Icon = getCategoryIcon(goal.category);
                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card-hover p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 bg-${getCategoryColor(goal.category)}-500 rounded-lg`}>
                                                <Icon size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                                                    {goal.title}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                                    {goal.description}
                                                </p>
                                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    Due: {new Date(goal.deadline).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-neutral-500 dark:text-neutral-400">Progress</span>
                                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{goal.progress || 0}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress || 0}%` }}
                                                        className={`h-full rounded-full ${goal.progress === 100 ? 'bg-success-500' : 'bg-primary-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 mb-4">
                                        <button
                                            onClick={() => handleEditGoal(goal)}
                                            className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                            title="Edit Goal"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGoal(goal._id)}
                                            className="p-1 text-neutral-500 hover:text-error-600"
                                            title="Delete Goal"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        {/* Mark Complete Button */}
                                        {goal.status !== 'completed' && (
                                            <button
                                                onClick={() => handleUpdateGoal(goal._id, { status: 'completed' })}
                                                className="ml-2 p-1 text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300"
                                                title="Mark as Completed"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Milestones */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                            Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {goal.milestones.slice(0, 3).map((milestone) => (
                                                <div key={milestone._id} className="flex items-center gap-3 text-sm">
                                                    <button
                                                        onClick={() => handleToggleMilestone(goal._id, milestone._id, !milestone.completed)}
                                                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${milestone.completed
                                                            ? 'bg-success-500 text-white hover:bg-success-600'
                                                            : 'bg-surface-200 dark:bg-neutral-700 hover:bg-surface-300 dark:hover:bg-neutral-600'
                                                            }`}
                                                    >
                                                        {milestone.completed && <CheckCircle size={12} />}
                                                    </button>
                                                    <span className={`flex-1 ${milestone.completed
                                                        ? 'text-neutral-500 line-through'
                                                        : 'text-neutral-700 dark:text-neutral-300'
                                                        }`}>
                                                        {milestone.title}
                                                    </span>
                                                </div>
                                            ))}
                                            {goal.milestones.length > 3 && (
                                                <div className="text-xs text-neutral-500 ml-7">
                                                    +{goal.milestones.length - 3} more milestones
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {goal.tags.map((tag) => (
                                            <span key={tag} className="px-2 py-1 bg-surface-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )
            }

            {/* Add Goal Modal */}
            {
                showAddGoal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEditing ? 'Edit Goal' : 'Add New Goal'}</h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="btn btn-md btn-ghost"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Goal Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                                        className="input w-full"
                                        placeholder="Enter your goal title..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newGoal.description}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="input w-full resize-none"
                                        placeholder="Describe your goal in detail..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={newGoal.category}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                                            className="input w-full"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={newGoal.priority}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                                            className="input w-full"
                                        >
                                            {priorities.map((priority) => (
                                                <option key={priority.id} value={priority.id}>
                                                    {priority.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={newGoal.deadline}
                                            onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                                            className="input w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                            Milestones
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addMilestone}
                                            className="btn btn-sm btn-outline"
                                        >
                                            <Plus size={14} />
                                            Add Milestone
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {newGoal.milestones.map((milestone) => (
                                            <div key={milestone.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-neutral-800 rounded-lg">
                                                <input
                                                    type="text"
                                                    value={milestone.title}
                                                    onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                                                    className="input flex-1"
                                                    placeholder="Milestone title..."
                                                />
                                                <input
                                                    type="date"
                                                    value={milestone.dueDate}
                                                    onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                                                    className="input w-40"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMilestone(milestone.id)}
                                                    className="text-error-600 hover:text-error-700 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn-md btn-ghost flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-md btn-primary flex-1"
                                    >
                                        {isEditing ? 'Update Goal' : 'Create Goal'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }
        </motion.div >
    );
};

export default GoalTracker;

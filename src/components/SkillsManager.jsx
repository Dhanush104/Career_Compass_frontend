import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
    X, Plus, Save, Code, Palette, Database, Server, Cloud,
    Smartphone, Brain, Users, Zap, TrendingUp, Award, Star,
    Search, Filter, ChevronDown, Edit2, Trash2, Check
} from 'lucide-react';
import { config } from '../config';

const SkillsManager = ({ user, initialSkills, onUpdate }) => {
    const [skills, setSkills] = useState([]);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState(50);
    const [newSkillCategory, setNewSkillCategory] = useState('Programming');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const categories = [
        { name: 'Programming', icon: Code, color: 'blue' },
        { name: 'Design', icon: Palette, color: 'purple' },
        { name: 'Database', icon: Database, color: 'green' },
        { name: 'Backend', icon: Server, color: 'orange' },
        { name: 'Cloud', icon: Cloud, color: 'cyan' },
        { name: 'Mobile', icon: Smartphone, color: 'pink' },
        { name: 'AI/ML', icon: Brain, color: 'indigo' },
        { name: 'Soft Skills', icon: Users, color: 'amber' },
    ];

    // Fetch skills on component mount
    useEffect(() => {
        const fetchSkills = async () => {
            // First try to use skills from user prop
            if (user?.skills && Array.isArray(user.skills) && user.skills.length > 0) {
                setSkills(user.skills);
                return;
            }

            // If no skills in user prop, try initialSkills
            if (initialSkills && Array.isArray(initialSkills) && initialSkills.length > 0) {
                setSkills(initialSkills);
                return;
            }

            // Otherwise fetch from API
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${config.endpoints.users}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (userData.skills && Array.isArray(userData.skills)) {
                        setSkills(userData.skills);
                    }
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, [user, initialSkills]);

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            purple: 'bg-purple-100 text-purple-700 border-purple-200',
            green: 'bg-green-100 text-green-700 border-green-200',
            orange: 'bg-orange-100 text-orange-700 border-orange-200',
            cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
            pink: 'bg-pink-100 text-pink-700 border-pink-200',
            indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            amber: 'bg-amber-100 text-amber-700 border-amber-200',
        };
        return colors[color] || colors.blue;
    };

    const handleAddSkill = () => {
        if (newSkillName.trim() === '') {
            toast.error("Skill name cannot be empty.");
            return;
        }

        // Check if we're editing or adding
        if (editingSkill !== null) {
            const updatedSkills = [...skills];
            updatedSkills[editingSkill] = {
                name: newSkillName.trim(),
                level: newSkillLevel,
                category: newSkillCategory
            };
            setSkills(updatedSkills);
            toast.success('Skill updated!');
            setEditingSkill(null);
        } else {
            if (skills.find(s => s.name?.toLowerCase() === newSkillName.trim().toLowerCase())) {
                toast.error("Skill already exists.");
                return;
            }
            setSkills([...skills, {
                name: newSkillName.trim(),
                level: newSkillLevel,
                category: newSkillCategory
            }]);
            toast.success('Skill added!');
        }

        setNewSkillName('');
        setNewSkillLevel(50);
        setNewSkillCategory('Programming');
        setShowAddModal(false);
    };

    const handleEditSkill = (index) => {
        const skill = skills[index];
        setNewSkillName(skill.name || skill);
        setNewSkillLevel(skill.level || 50);
        setNewSkillCategory(skill.category || 'Programming');
        setEditingSkill(index);
        setShowAddModal(true);
    };

    const handleRemoveSkill = (index) => {
        const skillName = skills[index].name || skills[index];
        setSkills(skills.filter((_, i) => i !== index));
        toast.success(`Removed ${skillName}`);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${config.endpoints.users}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ skills: skills }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save skills');

            toast.success('Skills saved successfully!');

            // Update parent component with new user data
            if (onUpdate && data.user) {
                onUpdate(data.user);
            }

            // Update local state with saved skills
            if (data.user && data.user.skills) {
                setSkills(data.user.skills);
            }
        } catch (error) {
            console.error('Error saving skills:', error);
            toast.error(error.message || 'Failed to save skills');
        } finally {
            setLoading(false);
        }
    };

    const filteredSkills = skills.filter(skill => {
        const skillName = skill.name || skill;
        const skillCategory = skill.category || 'Programming';
        const matchesSearch = skillName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterCategory === 'all' || skillCategory === filterCategory;
        return matchesSearch && matchesFilter;
    });

    const getSkillsByCategory = () => {
        const grouped = {};
        filteredSkills.forEach(skill => {
            const category = skill.category || 'Programming';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(skill);
        });
        return grouped;
    };

    const getProficiencyLabel = (level) => {
        if (level < 30) return 'Beginner';
        if (level < 60) return 'Intermediate';
        if (level < 85) return 'Advanced';
        return 'Expert';
    };

    const getCategoryIcon = (categoryName) => {
        const category = categories.find(c => c.name === categoryName);
        return category ? category.icon : Code;
    };

    const getCategoryColor = (categoryName) => {
        const category = categories.find(c => c.name === categoryName);
        return category ? category.color : 'blue';
    };

    const skillsByCategory = getSkillsByCategory();
    const totalSkills = skills.length;
    const averageLevel = skills.length > 0
        ? Math.round(skills.reduce((sum, s) => sum + (s.level || 50), 0) / skills.length)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            <Toaster position="top-right" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Skills Management</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">Track and showcase your technical and soft skills</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setEditingSkill(null);
                                setNewSkillName('');
                                setNewSkillLevel(50);
                                setNewSkillCategory('Programming');
                                setShowAddModal(true);
                            }}
                            className="btn btn-md btn-primary"
                        >
                            <Plus size={18} />
                            <span>Add Skill</span>
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-success-500 text-white rounded-xl font-medium hover:bg-success-600 transition-colors shadow-lg shadow-success-500/30 disabled:opacity-50 dark:bg-success-600 dark:hover:bg-success-700"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : 'Save All'}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium mb-1">Total Skills</p>
                                <p className="text-3xl font-bold text-blue-900">{totalSkills}</p>
                            </div>
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <Zap size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium mb-1">Average Level</p>
                                <p className="text-3xl font-bold text-purple-900">{averageLevel}%</p>
                            </div>
                            <div className="p-3 bg-purple-500 rounded-lg">
                                <TrendingUp size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-amber-600 font-medium mb-1">Categories</p>
                                <p className="text-3xl font-bold text-amber-900">{Object.keys(skillsByCategory).length}</p>
                            </div>
                            <div className="p-3 bg-amber-500 rounded-lg">
                                <Award size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-warning-500 focus:ring-2 focus:ring-warning-200 dark:focus:ring-warning-900/30 transition-all outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="pl-10 pr-10 py-2.5 bg-white dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:border-warning-500 focus:ring-2 focus:ring-warning-200 dark:focus:ring-warning-900/30 transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                </div>
            </div>

            {/* Skills Grid by Category */}
            {Object.keys(skillsByCategory).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                        const Icon = getCategoryIcon(category);
                        const color = getCategoryColor(category);
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card rounded-2xl shadow-sm overflow-hidden"
                            >
                                <div className={`px-6 py-4 border-b border-surface-200 dark:border-neutral-800 ${getColorClasses(color)} bg-opacity-30`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
                                                <Icon size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{category}</h3>
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                                {categorySkills.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categorySkills.map((skill, index) => {
                                            const skillName = skill.name || skill;
                                            const skillLevel = skill.level || 50;
                                            const globalIndex = skills.findIndex(s => (s.name || s) === skillName);

                                            return (
                                                <motion.div
                                                    key={globalIndex}
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.9, opacity: 0 }}
                                                    className="group relative bg-gradient-to-br from-surface-50 to-surface-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 border border-surface-200 dark:border-neutral-700 hover:border-warning-300 dark:hover:border-warning-600 hover:shadow-md transition-all"
                                                >
                                                    {/* Skill Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate mb-1">{skillName}</h4>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-surface-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                                                                {getProficiencyLabel(skillLevel)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditSkill(globalIndex)}
                                                                className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveSkill(globalIndex)}
                                                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-neutral-600 dark:text-neutral-400 font-medium">Proficiency</span>
                                                            <span className="font-bold text-warning-600 dark:text-warning-400">{skillLevel}%</span>
                                                        </div>
                                                        <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${skillLevel}%` }}
                                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                                className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Star Rating */}
                                                    <div className="flex items-center gap-1 mt-3">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <Star
                                                                key={star}
                                                                size={14}
                                                                className={star <= Math.ceil(skillLevel / 20)
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-gray-300'}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="card rounded-2xl border-dashed p-12 text-center">
                    <Zap size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">No skills yet</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start building your skill portfolio by adding your first skill</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-md btn-primary"
                    >
                        Add Your First Skill
                    </button>
                </div>
            )}

            {/* Add/Edit Skill Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="card rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {editingSkill !== null ? 'Edit Skill' : 'Add New Skill'}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-surface-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-neutral-500 dark:text-neutral-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Skill Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newSkillName}
                                        onChange={(e) => setNewSkillName(e.target.value)}
                                        placeholder="e.g., React, Python, Leadership"
                                        className="w-full px-4 py-2.5 border border-surface-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-warning-500 focus:ring-2 focus:ring-warning-200 dark:focus:ring-warning-900/30 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={newSkillCategory}
                                        onChange={(e) => setNewSkillCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-surface-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-warning-500 focus:ring-2 focus:ring-warning-200 dark:focus:ring-warning-900/30 outline-none transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Proficiency Level: {newSkillLevel}% ({getProficiencyLabel(newSkillLevel)})
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={newSkillLevel}
                                        onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-surface-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-warning-500"
                                    />
                                    <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                        <span>Beginner</span>
                                        <span>Intermediate</span>
                                        <span>Advanced</span>
                                        <span>Expert</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 btn btn-md btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSkill}
                                    className="flex-1 btn btn-md btn-primary flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    {editingSkill !== null ? 'Update' : 'Add Skill'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SkillsManager;
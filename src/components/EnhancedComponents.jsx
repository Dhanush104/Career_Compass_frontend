import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Rocket, ChevronDown, CheckCircle, Circle, Clock, 
    Calendar, Target, Sparkles, TrendingUp, Award,
    Code, ExternalLink, Github, Globe, Play, Edit,
    Trash2, MoreVertical, BookOpen, Zap, Star,
    FolderKanban, PlusCircle, Search, Filter, Eye
} from 'lucide-react';

// Enhanced Roadmap Component
const EnhancedRoadmap = ({ recommendedPaths, expandedMilestones, onToggleMilestone, onChoosePath }) => {
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const hasChosenPath = recommendedPaths.length === 1 && recommendedPaths[0].milestones;

    const getMilestoneProgress = (milestone) => {
        const tasks = milestone.tasks || [];
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
    };

    const getOverallProgress = (path) => {
        const milestones = path.milestones || path.roadmapTemplate || [];
        if (milestones.length === 0) return 0;
        const totalProgress = milestones.reduce((sum, m) => sum + getMilestoneProgress(m), 0);
        return Math.round(totalProgress / milestones.length);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header Section */}
            <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 rounded-3xl p-8 border border-primary-200 dark:border-primary-800 shadow-lg dark:from-primary-950 dark:via-accent-950 dark:to-primary-900">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-lg shadow-primary-500/30">
                                <Rocket className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {hasChosenPath ? "Your Career Roadmap" : "Recommended Paths"}
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                    {hasChosenPath 
                                        ? "Track your progress and achieve your goals" 
                                        : "Choose the path that aligns with your aspirations"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {hasChosenPath && (
                        <div className="card rounded-2xl p-4 shadow-md">
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-1">
                                    {getOverallProgress(recommendedPaths[0])}%
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Overall Progress</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Paths Grid */}
            <div className="space-y-6">
                {recommendedPaths.map((path, pathIndex) => {
                    const milestonesToRender = path.milestones || path.roadmapTemplate || [];
                    const overallProgress = getOverallProgress(path);

                    return (
                        <motion.div
                            key={pathIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: pathIndex * 0.1 }}
                            className="card-hover overflow-hidden"
                        >
                            {/* Path Header */}
                            <div className="bg-gradient-to-r from-surface-50 to-surface-100 dark:from-neutral-800 dark:to-neutral-700 p-6 border-b border-surface-200 dark:border-neutral-700">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-lg shadow-primary-500/30 flex-shrink-0">
                                            <Target className="text-white" size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                                {path.careerPathName || path.name}
                                            </h2>
                                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                {path.description}
                                            </p>
                                            {hasChosenPath && (
                                                <div className="mt-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                                            Path Completion
                                                        </span>
                                                        <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                                                            {overallProgress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-surface-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${overallProgress}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-3 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full shadow-inner"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {!hasChosenPath && (
                                        <button
                                            onClick={() => onChoosePath(path._id)}
                                            className="btn btn-lg btn-primary hover:shadow-glow transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <Sparkles size={20} />
                                            Choose This Path
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Milestones */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <BookOpen className="text-neutral-600 dark:text-neutral-400" size={20} />
                                    <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                                        Milestones ({milestonesToRender.length})
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {milestonesToRender.map((milestone, milestoneIndex) => {
                                        const key = `${pathIndex}-${milestoneIndex}`;
                                        const isExpanded = !!expandedMilestones[key];
                                        const progress = getMilestoneProgress(milestone);
                                        const isCompleted = progress === 100;

                                        return (
                                            <motion.div
                                                key={milestoneIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: milestoneIndex * 0.05 }}
                                                className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                                                    isCompleted 
                                                        ? 'border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-950' 
                                                        : isExpanded 
                                                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-950' 
                                                        : 'border-surface-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-surface-300 dark:hover:border-neutral-700'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => onToggleMilestone(pathIndex, milestoneIndex)}
                                                    className="w-full p-5 flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className={`p-3 rounded-xl transition-all ${
                                                            isCompleted 
                                                                ? 'bg-gradient-to-br from-success-500 to-success-600 shadow-lg shadow-success-500/30' 
                                                                : 'bg-surface-200 dark:bg-neutral-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30'
                                                        }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="text-white" size={24} />
                                                            ) : (
                                                                <Circle className="text-neutral-600 dark:text-neutral-400" size={24} />
                                                            )}
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <h4 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                                                                {milestone.milestoneTitle || milestone.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-neutral-600 dark:text-neutral-400">
                                                                    {milestone.tasks?.length || 0} tasks
                                                                </span>
                                                                <span className={`font-semibold ${
                                                                    isCompleted ? 'text-success-600 dark:text-success-400' : 'text-primary-600 dark:text-primary-400'
                                                                }`}>
                                                                    {progress}% complete
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        size={24}
                                                        className={`text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ${
                                                            isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                                                                <ul className="space-y-3">
                                                                    {(milestone.tasks || []).map((task, taskIndex) => (
                                                                        <motion.li
                                                                            key={taskIndex}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: taskIndex * 0.05 }}
                                                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                                                                task.completed
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-white text-gray-800 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {task.completed ? (
                                                                                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                                                            ) : (
                                                                                <Circle size={20} className="text-gray-400 flex-shrink-0" />
                                                                            )}
                                                                            <span className={`flex-1 font-medium ${
                                                                                task.completed ? 'line-through' : ''
                                                                            }`}>
                                                                                {task.title || task.name}
                                                                            </span>
                                                                            {!task.completed && (
                                                                                <Zap size={16} className="text-amber-500" />
                                                                            )}
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// Enhanced Projects Component
const EnhancedProjects = ({ projects, onAddProject, onDeleteProject }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedProject, setSelectedProject] = useState(null);

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterStatus === 'all' || p.status === filterStatus)
    );

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-700 border-green-200',
            'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
            planning: 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return <CheckCircle size={16} />;
        if (status === 'in-progress') return <Play size={16} />;
        return <Clock size={16} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 dark:from-primary-950 dark:via-accent-950 dark:to-primary-900 rounded-3xl p-8 border border-primary-200 dark:border-primary-800 shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-lg shadow-primary-500/30">
                            <FolderKanban className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">My Projects</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-1">Showcase your work and track progress</p>
                        </div>
                    </div>
                    <button
                        onClick={onAddProject}
                        className="btn btn-lg btn-primary hover:shadow-glow flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        New Project
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="card-hover p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input w-full pl-12"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="planning">Planning</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                        {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                    </span>
                    <div className="flex items-center gap-2">
                        <Award className="text-warning-500" size={18} />
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            {projects.filter(p => p.status === 'completed').length} completed
                        </span>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-hover overflow-hidden group"
                        >
                            {/* Project Header */}
                            <div className="h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600" />
                            
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies?.slice(0, 3).map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full hover:bg-surface-200 dark:hover:bg-neutral-700 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies?.length > 3 && (
                                        <span className="px-3 py-1 bg-surface-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-full">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border ${getStatusColor(project.status)}`}>
                                        {getStatusIcon(project.status)}
                                        {project.status?.replace('-', ' ')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {project.sourceCodeUrl && (
                                            <a
                                                href={project.sourceCodeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-surface-100 dark:hover:bg-neutral-800 rounded-lg transition-all"
                                                title="View Source Code"
                                            >
                                                <Code size={18} />
                                            </a>
                                        )}
                                        {project.liveDemoUrl && (
                                            <a
                                                href={project.liveDemoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                                                title="View Live Demo"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => onDeleteProject(project._id)}
                                            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="card-hover border-2 border-dashed border-neutral-300 dark:border-neutral-600 p-16 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-surface-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FolderKanban size={40} className="text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">No Projects Yet</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Start building your portfolio by adding your first project
                        </p>
                        <button
                            onClick={onAddProject}
                            className="btn btn-lg btn-primary"
                        >
                            <PlusCircle size={20} />
                            Add Your First Project
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// Export both components
export { EnhancedRoadmap, EnhancedProjects };
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Code, ExternalLink, Github } from 'lucide-react';

const AddProjectModal = ({ isOpen, onClose, onAddProject }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: [],
        liveDemoUrl: '',
        sourceCodeUrl: ''
    });
    const [newTech, setNewTech] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addTechnology = () => {
        if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTech.trim()]
            }));
            setNewTech('');
        }
    };

    const removeTechnology = (tech) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onAddProject(formData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                technologies: [],
                liveDemoUrl: '',
                sourceCodeUrl: ''
            });
            onClose();
        } catch (error) {
            console.error('Error adding project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.name !== 'description') {
            e.preventDefault();
            if (e.target === document.querySelector('input[name="newTech"]')) {
                addTechnology();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg">
                                <Code size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Add New Project
                                </h2>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Showcase your work and achievements
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Project Title */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter project title..."
                                className="input w-full"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your project, its features, and what makes it special..."
                                rows={4}
                                className="input w-full resize-none"
                                required
                            />
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                Technologies Used
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    name="newTech"
                                    value={newTech}
                                    onChange={(e) => setNewTech(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add technology (e.g., React, Node.js)..."
                                    className="input flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={addTechnology}
                                    className="btn btn-md btn-outline px-4"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {formData.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTechnology(tech)}
                                                className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    <ExternalLink size={16} className="inline mr-1" />
                                    Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    name="liveDemoUrl"
                                    value={formData.liveDemoUrl}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="https://your-project.com"
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                    <Github size={16} className="inline mr-1" />
                                    Source Code URL
                                </label>
                                <input
                                    type="url"
                                    name="sourceCodeUrl"
                                    value={formData.sourceCodeUrl}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="https://github.com/username/repo"
                                    className="input w-full"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-md btn-ghost flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-md btn-primary flex-1"
                                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                            >
                                {isSubmitting ? 'Adding Project...' : 'Add Project'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddProjectModal;

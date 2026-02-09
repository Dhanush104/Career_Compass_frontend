import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenSquare, Heart, MessageCircle, Share2, Clock, User, TrendingUp } from 'lucide-react';
import { config } from '../config';

const CreatePost = ({ user, onPostCreated }) => {
    const [activeTab, setActiveTab] = useState('feed');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState(new Set());

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await fetch(`${config.endpoints.posts}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const response = await fetch(`${config.endpoints.posts}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                    authorName: user.username
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit post.');
            }

            alert('Post published successfully!');
            setTitle('');
            setContent('');
            setActiveTab('feed');
            fetchPosts();
            if (onPostCreated) onPostCreated();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                    Community Posts
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Share your thoughts and connect with the community.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'feed'
                                ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        <TrendingUp size={18} />
                        Feed
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'create'
                                ? 'bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                : 'bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-surface-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        <PenSquare size={18} />
                        Create Post
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'create' ? (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="card-hover p-8">
                            <form onSubmit={handlePostSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Post Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter an engaging title..."
                                        className="input w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                        Content
                                        <span className="text-neutral-500 dark:text-neutral-400 font-normal ml-2">(Markdown supported)</span>
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={12}
                                        placeholder="Share your thoughts, insights, or questions with the community..."
                                        className="input w-full resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !title || !content}
                                        className="btn btn-lg btn-primary"
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('feed')}
                                        className="btn btn-lg btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="feed"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="card-hover p-12 text-center">
                                <PenSquare size={48} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No posts yet</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 mb-6">Be the first to share something with the community!</p>
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className="btn btn-lg btn-primary"
                                >
                                    Create First Post
                                </button>
                            </div>
                        ) : (
                            posts.map((post, index) => (
                                <motion.div
                                    key={post._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card-hover p-6"
                                >
                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                                            <User size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                {post.authorName || 'Anonymous'}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                <Clock size={14} />
                                                {formatDate(post.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                        {post.content}
                                    </p>

                                    {/* Interaction Buttons */}
                                    <div className="flex items-center gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-error-600 dark:hover:text-error-400 transition-colors group"
                                        >
                                            <Heart
                                                size={20}
                                                className={`transition-all ${likedPosts.has(post._id)
                                                        ? 'fill-error-500 text-error-500'
                                                        : 'group-hover:scale-110'
                                                    }`}
                                            />
                                            <span className="text-sm font-medium">
                                                {(post.likes || 0) + (likedPosts.has(post._id) ? 1 : 0)}
                                            </span>
                                        </button>
                                        <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-info-600 dark:hover:text-info-400 transition-colors">
                                            <MessageCircle size={20} />
                                            <span className="text-sm font-medium">{post.comments || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-success-600 dark:hover:text-success-400 transition-colors ml-auto">
                                            <Share2 size={20} />
                                            <span className="text-sm font-medium">Share</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CreatePost;
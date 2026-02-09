import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, PauseCircle, Clock, Calendar, User, TrendingUp, Briefcase, Brain, Target, Users, Star, Filter, Search } from 'lucide-react';

const Podcast = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const categories = [
        { id: 'all', name: 'All Episodes', icon: PlayCircle },
        { id: 'career-development', name: 'Career Development', icon: TrendingUp },
        { id: 'personal-growth', name: 'Personal Growth', icon: Target },
        { id: 'tech-trends', name: 'Tech Trends', icon: Brain },
        { id: 'leadership', name: 'Leadership', icon: Users },
        { id: 'interviews', name: 'Expert Interviews', icon: User }
    ];

    const episodes = [
        // Tech Trends & Career - Recent Changelog Episodes
        {
            id: 1,
            title: "Agents in the database (Changelog Interviews #671)",
            desc: "Ajay Kulkarni from Tiger Data is on the pod to trace his path to becoming a CEO and discuss agents in the database.",
            category: 'tech-trends',
            duration: "65:00",
            date: "2025-12-18",
            host: "Adam Stacoviak & Jerod Santo",
            guest: "Ajay Kulkarni - CEO of Tiger Data",
            tags: ["Database", "AI Agents", "CEO Journey", "Startup"],
            audio: "https://op3.dev/e/https://cdn.changelog.com/uploads/podcast/671/the-changelog-671.mp3",
            description: "Ajay Kulkarni from Tiger Data (Co-founder/CEO) is on the pod this week with Adam. He asked him to get vulnerable and trace his path to becoming a CEO."
        },
        {
            id: 2,
            title: "The code, prose & pods that shaped 2025",
            desc: "Reviewing the coolest code, best prose & favorite podcasts from the past year.",
            category: 'tech-trends',
            duration: "45:00",
            date: "2025-12-15",
            host: "Jerod Santo",
            guest: "Changelog News",
            tags: ["Review", "2025", "Best of", "Trends"],
            audio: "https://op3.dev/e/https://cdn.changelog.com/uploads/news/174/changelog-news-174.mp3",
            description: "This episodes diverges from traditional fare. Reviewing the 49 previous editions and picking the coolest code, best prose & favorite pods."
        },
        {
            id: 3,
            title: "Down the Linux rabbit hole",
            desc: "Docker vs Podman, building a Kubernetes cluster, ZFS backups with zfs.rent, and more.",
            category: 'career-development',
            duration: "75:00",
            date: "2025-12-12",
            host: "Adam Stacoviak",
            guest: "Alex Kretzschmar",
            tags: ["Linux", "Kubernetes", "DevOps", "Docker"],
            audio: "https://op3.dev/e/https://cdn.changelog.com/uploads/friends/121/changelog--friends-121.mp3",
            description: "Alex Kretzschmar joins Adam for a trip down the Linux rabbit hole -- Docker vs Podman, building a Kubernetes cluster, ZFS backups with zfs.rent."
        },
        {
            id: 4,
            title: "Autonomous drone delivery in a Zip",
            desc: "Zipline is on a mission to build the world’s first logistics system that serves all people equally.",
            category: 'tech-trends',
            duration: "58:00",
            date: "2025-12-10",
            host: "Adam & Jerod",
            guest: "Keenan Wyrobek - CTO Zipline",
            tags: ["Drones", "Logistics", "Engineering", "Future"],
            audio: "https://op3.dev/e/https://cdn.changelog.com/uploads/podcast/670/the-changelog-670.mp3",
            description: "We're joined by Zipline cofounder / CTO, Keenan Wyrobek. Zipline is on a mission to build the world’s first logistics system that serves all people equally."
        },
        {
            id: 5,
            title: "The \"confident idiot\" problem",
            desc: "Why AI needs hard rules (not vibe checks) and what Anthropic's acquisition tells us.",
            category: 'personal-growth',
            duration: "42:00",
            date: "2025-12-08",
            host: "Jerod Santo",
            guest: "Jonah Glover",
            tags: ["AI", "LLMs", "Ethics", "Industry News"],
            audio: "https://op3.dev/e/https://cdn.changelog.com/uploads/news/173/changelog-news-173.mp3",
            description: "Why AI needs hard rules (not vibe checks), what Anthropic's acquisition of Bun's creators tells us about the AI takeover."
        },
    ];

    const filteredEpisodes = episodes.filter(episode => {
        const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
        const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            episode.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            episode.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            episode.guest.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handlePlayPause = (episodeId) => {
        if (currentlyPlaying === episodeId) {
            setCurrentlyPlaying(null);
        } else {
            setCurrentlyPlaying(episodeId);
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
                    Career Compass Podcast
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Listen to insights from industry experts, learn from their journey, and accelerate your career growth with actionable advice.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search episodes, guests, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === category.id
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

            {/* Episodes List */}
            <div className="space-y-6">
                {filteredEpisodes.map((episode, i) => (
                    <motion.div
                        key={episode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-hover p-6 group"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Episode Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {episode.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                                            {episode.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Episode Meta */}
                                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{episode.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>{new Date(episode.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={16} />
                                        <span>{episode.host}</span>
                                    </div>
                                </div>

                                {/* Guest */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        <span className="text-neutral-500 dark:text-neutral-400">Guest: </span>
                                        {episode.guest}
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {episode.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {episode.description}
                                </p>
                            </div>

                            {/* Play Button & Audio */}
                            <div className="lg:w-80 flex flex-col items-center">
                                <button
                                    onClick={() => handlePlayPause(episode.id)}
                                    className="mb-4 p-4 bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all group/play"
                                >
                                    {currentlyPlaying === episode.id ? (
                                        <PauseCircle size={32} className="group-hover/play:scale-110 transition-transform" />
                                    ) : (
                                        <PlayCircle size={32} className="group-hover/play:scale-110 transition-transform" />
                                    )}
                                </button>

                                <audio
                                    controls
                                    className="w-full h-10 rounded-lg"
                                    style={{ filter: 'hue-rotate(200deg)' }}
                                >
                                    <source src={episode.audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredEpisodes.length === 0 && (
                <div className="text-center py-12">
                    <PlayCircle size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No episodes found
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 rounded-2xl border border-primary-200 dark:border-primary-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{episodes.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Episodes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{categories.length - 1}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Categories</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">50+</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Expert Guests</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">Weekly</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">New Episodes</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Podcast;
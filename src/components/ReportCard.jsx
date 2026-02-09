// src/components/ReportCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Github, Linkedin, BarChart2, Loader2, AlertTriangle,
    CheckCircle, ExternalLink, User, Users, Book,
    Star, Clock, Briefcase, Sparkles, ServerCrash,
    ChevronRight, ChevronDown, Zap, Code, GitBranch, GitCommit,
    GitPullRequest, GitMerge, GitCommitHorizontal, GitFork, GitCompareArrows,
    TrendingUp, Award, Trophy, BarChart3, PieChart, LineChart, Shield, Target, Rocket
} from 'lucide-react';

import { config } from '../config';

const ReportCard = ({ user, onUpdate, onNavigate }) => {
    console.log('🔍 ReportCard received user:', user);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('overview'); // overview, github, linkedin, skills

    const { reportCard, githubUrl, linkedInUrl } = user || {};
    const status = reportCard?.status || 'not-generated';

    const handleGenerateReport = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please log in to generate a report');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${config.endpoints.reportCard}/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to start report generation.');

            if (onUpdate) onUpdate(data.user);
            toast.success(data.message || 'Report generation started!');
        } catch (error) {
            toast.error(error.message || 'Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateOverallScore = () => {
        if (status !== 'completed' || !reportCard) return 0;
        const githubScore = reportCard.github?.overallScore || 0;
        const linkedinScore = reportCard.linkedin?.overallScore || 0;
        return Math.round((githubScore + linkedinScore) / 2);
    };

    const overallScore = calculateOverallScore();

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-rose-500';
    };

    if (!user) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-primary-500" /></div>;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'github', label: 'GitHub Analysis', icon: Github },
        { id: 'linkedin', label: 'LinkedIn Insights', icon: Linkedin },
        { id: 'skills', label: 'Skills Radar', icon: Target }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Premium Hero Header */}
            <div className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 lg:p-12 border border-surface-200 dark:border-neutral-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold mb-6"
                        >
                            <Sparkles size={16} />
                            AI-POWERED ANALYSIS
                        </motion.div>
                        <h1 className="text-4xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
                            Your Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-600">DNA</span>
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8 leading-relaxed">
                            A deep-dive analysis of your digital presence, coding patterns, and professional trajectory powered by advanced AI.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button
                                onClick={handleGenerateReport}
                                disabled={isLoading || status === 'pending'}
                                className="group relative px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={20} className="group-hover:text-amber-400" />}
                                    {status === 'completed' ? 'Regenerate Analysis' : 'Start AI Scan'}
                                </span>
                            </button>
                            <button className="px-8 py-4 bg-white dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-2xl font-bold transition-all hover:bg-surface-50 dark:hover:bg-neutral-700 shadow-md">
                                Download PDF
                            </button>
                        </div>
                    </div>

                    <div className="flex-shrink-0 relative">
                        {/* Interactive Score Circle */}
                        <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-8 border-surface-100 dark:border-neutral-800 flex items-center justify-center relative shadow-inner">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%" cy="50%" r="46%"
                                    fill="none" stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-primary-500/20"
                                />
                                <motion.circle
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${overallScore * 2.89} 1000` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="50%" cy="50%" r="46%"
                                    fill="none" stroke="currentColor"
                                    strokeWidth="8" strokeLinecap="round"
                                    className="text-primary-500"
                                />
                            </svg>
                            <div className="text-center">
                                <span className="text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-100">{overallScore}</span>
                                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-1">Global Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-surface-200 dark:border-neutral-800 shadow-lg overflow-x-auto">
                <div className="flex gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeSection === item.id
                                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg'
                                : 'text-neutral-500 hover:bg-surface-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {status === 'completed' ? (
                        activeSection === 'overview' ? <OverviewGrid reportCard={reportCard} /> :
                            activeSection === 'github' ? <GitHubSection data={reportCard.github} /> :
                                activeSection === 'linkedin' ? <LinkedInSection data={reportCard.linkedin} /> :
                                    <SkillsSection data={reportCard.skills} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-dashed border-neutral-300 dark:border-neutral-700">
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-6">
                                <Rocket size={40} className={status === 'pending' ? 'animate-bounce' : ''} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Ready to Launch?</h2>
                            <p className="text-neutral-500 max-w-md mb-8">
                                Connect your profiles and start the AI analysis to unlock your full professional report.
                            </p>
                            <button onClick={handleGenerateReport} className="btn btn-primary px-8 py-3 rounded-xl font-bold">
                                {status === 'pending' ? 'Analyzing...' : 'Generate Now'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Sub-components for sections
const OverviewGrid = ({ reportCard }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
                title="GitHub Excellence"
                score={reportCard.github?.overallScore}
                icon={Github}
                details={`${reportCard.github?.publicRepos || 0} Repositories Analysed`}
                color="from-gray-800 to-black dark:from-neutral-700 dark:to-neutral-900"
            />
            <StatCard
                title="LinkedIn Impact"
                score={reportCard.linkedin?.overallScore}
                icon={Linkedin}
                details={`${reportCard.linkedin?.connections || 0}+ Industry Connections`}
                color="from-blue-600 to-blue-800"
            />
            <div className="sm:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <Rocket className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                <h3 className="text-2xl font-bold mb-2">Growth Milestone</h3>
                <p className="text-indigo-100 mb-6 max-w-lg">
                    You're among the top 5% of active contributors this month. Your project consistency is driving high visibility.
                </p>
                <div className="flex gap-4">
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-sm font-bold backdrop-blur-md">Fast Learner</span>
                    <span className="px-4 py-2 bg-white/20 rounded-lg text-sm font-bold backdrop-blur-md">High Engagement</span>
                </div>
            </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 border border-surface-200 dark:border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target size={20} className="text-primary-500" />
                Action Items
            </h3>
            <ul className="space-y-4">
                {[
                    "Add detailed README to top repos",
                    "Update LinkedIn skills endorsements",
                    "Share your latest project update",
                    "Complete a new certification"
                ].map((task, i) => (
                    <li key={i} className="flex gap-3 items-start group">
                        <div className="mt-1 w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                            <CheckCircle size={12} className="text-transparent group-hover:text-white" />
                        </div>
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors cursor-pointer">
                            {task}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const GitHubSection = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-surface-200 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-900 dark:bg-neutral-100 rounded-2xl flex items-center justify-center text-white dark:text-neutral-900">
                        <Github size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{data?.username || 'Profile'}</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium">{data?.bio || 'Full Stack Architect'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-primary-500">{data?.overallScore}%</div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Code Quality</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-2xl">
                    <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Public Repos</p>
                    <p className="text-2xl font-black">{data?.publicRepos}</p>
                </div>
                <div className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-2xl">
                    <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Followers</p>
                    <p className="text-2xl font-black">{data?.followers}</p>
                </div>
            </div>

            <h4 className="font-bold text-lg mb-4">Code Footprint</h4>
            <div className="space-y-4">
                {data?.pinnedRepos?.slice(0, 3).map((repo, i) => (
                    <motion.a
                        key={i} href={repo.link} target="_blank"
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 rounded-2xl hover:border-primary-500 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 rounded-lg">
                                <Code size={18} />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm">{repo.title}</h5>
                                <p className="text-xs text-neutral-500 line-clamp-1">{repo.description}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-neutral-300" />
                    </motion.a>
                ))}
            </div>
        </div>

        <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <GitBranch className="w-48 h-48 opacity-5 -mr-12 -mt-12" />
            </div>
            <h3 className="text-2xl font-bold mb-8">Language Proficiency</h3>
            <div className="space-y-6 relative z-10">
                {[
                    { lang: 'JavaScript', val: 85, color: 'bg-yellow-400' },
                    { lang: 'Python', val: 70, color: 'bg-blue-400' },
                    { lang: 'TypeScript', val: 60, color: 'bg-blue-600' },
                    { lang: 'CSS', val: 90, color: 'bg-pink-500' }
                ].map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span>{item.lang}</span>
                            <span>{item.val}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.val}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full rounded-full ${item.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const LinkedInSection = ({ data }) => (
    <div className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 lg:p-12 border border-surface-200 dark:border-neutral-800 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Linkedin size={64} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-3xl font-black mb-2">{data?.headline || 'Industry Professional'}</h3>
                            <p className="text-neutral-500 text-lg font-medium">{data?.connections}+ Connections • {data?.location || 'San Francisco Bay Area'}</p>
                        </div>
                        <a href={data?.profileUrl} target="_blank" className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl hover:scale-110 transition-transform">
                            <ExternalLink size={24} />
                        </a>
                    </div>
                    <blockquote className="text-xl italic text-neutral-600 dark:text-neutral-400 border-l-4 border-blue-500 pl-6 py-2">
                        "{data?.summary || 'Building scalable solutions and leading innovative teams across the global technology landscape.'}"
                    </blockquote>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-surface-200 dark:border-neutral-800 shadow-xl">
                <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <Briefcase size={24} className="text-blue-500" />
                    Career Timeline
                </h4>
                <div className="space-y-12 relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-1 before:bg-surface-100 dark:before:bg-neutral-800">
                    {data?.experience?.map((exp, i) => (
                        <div key={i} className="relative pl-20">
                            <div className="absolute left-6 w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-neutral-900 z-10" />
                            <div>
                                <h5 className="text-lg font-bold">{exp.title}</h5>
                                <p className="text-blue-600 font-bold mb-1">{exp.company}</p>
                                <p className="text-sm text-neutral-500 mb-4">{exp.duration}</p>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{exp.description || 'Led cross-functional teams in developing enterprise-grade applications.'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                <h4 className="text-xl font-bold mb-8">Professional Persona</h4>
                <div className="space-y-4">
                    {[
                        { label: 'Strategic Thinking', val: 'High' },
                        { label: 'Team Collaboration', val: 'Exceptional' },
                        { label: 'Technical Vision', val: 'Strong' },
                        { label: 'Market Awareness', val: 'High' }
                    ].map((attr, i) => (
                        <div key={i} className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                            <p className="text-xs text-blue-200 font-bold uppercase mb-1">{attr.label}</p>
                            <p className="text-lg font-black">{attr.val}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-sm text-blue-100 italic">
                        "Your profile radiates leadership and deep domain expertise. Consider highlighting more open-source contributions."
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const SkillsSection = ({ data }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-surface-200 dark:border-neutral-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Skill Ecosystem</h3>
            <p className="text-neutral-500 font-medium">
                A quantitative view of your technical and soft skill proficiency based on project contributions and professional history.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data?.map((skill, i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-3xl border border-surface-200 dark:border-neutral-700 text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                            <Award className="text-amber-500" />
                        </div>
                        <h4 className="font-bold text-sm mb-1">{skill.name}</h4>
                        <div className="text-xs font-black text-primary-500 uppercase">{skill.level}</div>
                    </div>
                </motion.div>
            ))}
            {!data?.length && <div className="col-span-full py-12 text-center text-neutral-400">Generate report to see skill breakdown.</div>}
        </div>
    </div>
);

const StatCard = ({ title, score, icon: Icon, details, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
        <div className="absolute -top-4 -right-4 bg-white/10 p-8 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
        <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Icon size={24} />
                    </div>
                    <div className="text-4xl font-black">{score || 0}%</div>
                </div>
                <h3 className="text-xl font-bold mb-1">{title}</h3>
                <p className="text-white/70 text-sm font-medium">{details}</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full">
                <TrendingUp size={12} />
                Increasing
            </div>
        </div>
    </div>
);

export default ReportCard;
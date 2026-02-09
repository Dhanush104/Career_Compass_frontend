import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Users, Building, ExternalLink, Search, Filter, Briefcase, Code, Database, Brain, Shield, Smartphone } from 'lucide-react';

const Placement = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', name: 'All Jobs', icon: Briefcase },
        { id: 'frontend', name: 'Frontend', icon: Code },
        { id: 'backend', name: 'Backend', icon: Database },
        { id: 'fullstack', name: 'Full Stack', icon: Code },
        { id: 'data-science', name: 'Data Science', icon: Brain },
        { id: 'cybersecurity', name: 'Security', icon: Shield },
        { id: 'mobile', name: 'Mobile', icon: Smartphone }
    ];

    const jobTypes = [
        { id: 'all', name: 'All Types' },
        { id: 'full-time', name: 'Full-time' },
        { id: 'part-time', name: 'Part-time' },
        { id: 'internship', name: 'Internship' },
        { id: 'contract', name: 'Contract' },
        { id: 'remote', name: 'Remote' }
    ];

    const jobs = [
        // Frontend Jobs
        { 
            id: 1,
            title: "Senior Frontend Developer", 
            company: "Google", 
            location: "Bangalore, IN", 
            type: "full-time",
            category: 'frontend',
            salary: "₹25-35 LPA",
            experience: "3-5 years",
            skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
            description: "Join Google's frontend team to build user-facing applications used by millions worldwide.",
            posted: "2 days ago",
            applicants: 245,
            remote: false
        },
        { 
            id: 2,
            title: "React Developer", 
            company: "Microsoft", 
            location: "Hyderabad, IN", 
            type: "full-time",
            category: 'frontend',
            salary: "₹20-28 LPA",
            experience: "2-4 years",
            skills: ["React", "JavaScript", "Redux", "CSS3"],
            description: "Build modern web applications using React and contribute to Microsoft's cloud services.",
            posted: "1 week ago",
            applicants: 189,
            remote: true
        },
        { 
            id: 3,
            title: "Frontend Intern", 
            company: "Flipkart", 
            location: "Bangalore, IN", 
            type: "internship",
            category: 'frontend',
            salary: "₹40k/month",
            experience: "0-1 years",
            skills: ["HTML", "CSS", "JavaScript", "React"],
            description: "6-month internship program with mentorship and hands-on project experience.",
            posted: "3 days ago",
            applicants: 567,
            remote: false
        },

        // Backend Jobs
        { 
            id: 4,
            title: "Backend Engineer", 
            company: "Amazon", 
            location: "Chennai, IN", 
            type: "full-time",
            category: 'backend',
            salary: "₹30-45 LPA",
            experience: "4-6 years",
            skills: ["Java", "Spring Boot", "AWS", "Microservices"],
            description: "Design and develop scalable backend systems for Amazon's e-commerce platform.",
            posted: "5 days ago",
            applicants: 312,
            remote: false
        },
        { 
            id: 5,
            title: "Node.js Developer", 
            company: "Zomato", 
            location: "Gurgaon, IN", 
            type: "full-time",
            category: 'backend',
            salary: "₹18-25 LPA",
            experience: "2-4 years",
            skills: ["Node.js", "Express", "MongoDB", "Redis"],
            description: "Build robust APIs and backend services for Zomato's food delivery platform.",
            posted: "1 week ago",
            applicants: 203,
            remote: true
        },

        // Full Stack Jobs
        { 
            id: 6,
            title: "Full Stack Developer", 
            company: "Paytm", 
            location: "Noida, IN", 
            type: "full-time",
            category: 'fullstack',
            salary: "₹22-32 LPA",
            experience: "3-5 years",
            skills: ["React", "Node.js", "PostgreSQL", "Docker"],
            description: "Work on end-to-end development of Paytm's fintech applications.",
            posted: "4 days ago",
            applicants: 156,
            remote: true
        },

        // Data Science Jobs
        { 
            id: 7,
            title: "Data Scientist", 
            company: "Swiggy", 
            location: "Bangalore, IN", 
            type: "full-time",
            category: 'data-science',
            salary: "₹25-40 LPA",
            experience: "3-6 years",
            skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
            description: "Analyze user behavior and optimize delivery algorithms using machine learning.",
            posted: "6 days ago",
            applicants: 89,
            remote: false
        },

        // Security Jobs
        { 
            id: 8,
            title: "Cybersecurity Analyst", 
            company: "Infosys", 
            location: "Pune, IN", 
            type: "full-time",
            category: 'cybersecurity',
            salary: "₹15-22 LPA",
            experience: "2-4 years",
            skills: ["Network Security", "Penetration Testing", "SIEM", "Incident Response"],
            description: "Protect client infrastructure and investigate security incidents.",
            posted: "1 week ago",
            applicants: 134,
            remote: false
        },

        // Mobile Jobs
        { 
            id: 9,
            title: "Android Developer", 
            company: "PhonePe", 
            location: "Bangalore, IN", 
            type: "full-time",
            category: 'mobile',
            salary: "₹20-30 LPA",
            experience: "3-5 years",
            skills: ["Kotlin", "Android SDK", "MVVM", "Retrofit"],
            description: "Develop and maintain PhonePe's Android application used by millions.",
            posted: "2 days ago",
            applicants: 178,
            remote: false
        },

        // Remote/Contract Jobs
        { 
            id: 10,
            title: "Remote Full Stack Developer", 
            company: "GitLab", 
            location: "Remote", 
            type: "remote",
            category: 'fullstack',
            salary: "$60-80k USD",
            experience: "4-7 years",
            skills: ["Ruby on Rails", "Vue.js", "PostgreSQL", "Kubernetes"],
            description: "Join GitLab's distributed team and work on the world's leading DevOps platform.",
            posted: "3 days ago",
            applicants: 445,
            remote: true
        }
    ];

    const filteredJobs = jobs.filter(job => {
        const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
        const matchesType = selectedType === 'all' || job.type === selectedType || (selectedType === 'remote' && job.remote);
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesType && matchesSearch;
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
                    Placement Assistance
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Find your dream job with our curated list of opportunities from top companies.
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
                                placeholder="Search jobs, companies, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    selectedCategory === category.id
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

                {/* Job Type Filters */}
                <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                selectedType === type.id
                                    ? 'bg-accent-500 text-white'
                                    : 'bg-surface-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-surface-300 dark:hover:bg-neutral-600'
                            }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
                {filteredJobs.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-hover p-6 group"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Building size={16} />
                                                <span className="font-medium">{job.company}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <span>{job.posted}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-success-600 dark:text-success-400 mb-1">
                                            {job.salary}
                                        </div>
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {job.experience}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.map(skill => (
                                        <span 
                                            key={skill} 
                                            className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <Users size={16} />
                                            <span>{job.applicants} applicants</span>
                                        </div>
                                        {job.remote && (
                                            <span className="bg-info-100 dark:bg-info-900/30 text-info-800 dark:text-info-300 px-2 py-1 rounded-full text-xs font-medium">
                                                Remote Friendly
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            job.type === 'full-time' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300' :
                                            job.type === 'internship' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300' :
                                            'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300'
                                        }`}>
                                            {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                                        </span>
                                    </div>
                                    
                                    <button className="btn btn-md btn-primary group/btn">
                                        <span>Apply Now</span>
                                        <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No jobs found
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
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{jobs.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Jobs</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{categories.length - 1}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Categories</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">50+</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Companies</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">Daily</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Updates</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Placement;
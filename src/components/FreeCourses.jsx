import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Database, Brain, Shield, Smartphone, Users, TrendingUp, ExternalLink, Filter } from 'lucide-react';

const FreeCourses = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', name: 'All Courses', icon: BookOpen },
        { id: 'frontend', name: 'Frontend', icon: Code },
        { id: 'backend', name: 'Backend', icon: Database },
        { id: 'data-science', name: 'Data Science', icon: TrendingUp },
        { id: 'ai-ml', name: 'AI/ML', icon: Brain },
        { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield },
        { id: 'mobile', name: 'Mobile Dev', icon: Smartphone },
        { id: 'soft-skills', name: 'Soft Skills', icon: Users }
    ];

    const courses = [
        // Frontend Development
        { 
            title: "Complete HTML & CSS Masterclass", 
            desc: "Master the fundamentals of web development with HTML5 and CSS3. Build responsive, modern websites from scratch.", 
            tags: ["HTML", "CSS", "Beginner"], 
            category: 'frontend',
            provider: 'FreeCodeCamp',
            duration: '12 hours',
            url: 'https://www.freecodecamp.org/learn/responsive-web-design/'
        },
        { 
            title: "JavaScript Complete Course", 
            desc: "From basics to advanced concepts including ES6+, DOM manipulation, and modern JavaScript frameworks.", 
            tags: ["JavaScript", "ES6", "Intermediate"], 
            category: 'frontend',
            provider: 'MDN Web Docs',
            duration: '20 hours',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'
        },
        { 
            title: "React.js Complete Guide", 
            desc: "Build modern, interactive user interfaces with React. Includes hooks, context, and state management.", 
            tags: ["React", "Hooks", "Advanced"], 
            category: 'frontend',
            provider: 'React Official',
            duration: '15 hours',
            url: 'https://react.dev/learn'
        },
        { 
            title: "Vue.js Fundamentals", 
            desc: "Learn Vue.js from the ground up. Build reactive web applications with this progressive framework.", 
            tags: ["Vue.js", "Frontend", "Beginner"], 
            category: 'frontend',
            provider: 'Vue Mastery',
            duration: '10 hours',
            url: 'https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3'
        },
        { 
            title: "Angular Complete Tutorial", 
            desc: "Master Angular framework for building scalable web applications with TypeScript.", 
            tags: ["Angular", "TypeScript", "Advanced"], 
            category: 'frontend',
            provider: 'Angular University',
            duration: '18 hours',
            url: 'https://angular.io/tutorial'
        },

        // Backend Development
        { 
            title: "Node.js & Express Masterclass", 
            desc: "Build robust backend APIs with Node.js and Express. Includes authentication, databases, and deployment.", 
            tags: ["Node.js", "Express", "API"], 
            category: 'backend',
            provider: 'Node.js Foundation',
            duration: '16 hours',
            url: 'https://nodejs.org/en/learn'
        },
        { 
            title: "Python Backend Development", 
            desc: "Learn Python for backend development with Django and Flask frameworks. Build scalable web services.", 
            tags: ["Python", "Django", "Flask"], 
            category: 'backend',
            provider: 'Python.org',
            duration: '14 hours',
            url: 'https://docs.python.org/3/tutorial/'
        },
        { 
            title: "Database Design & SQL", 
            desc: "Master database design principles and SQL queries. Learn MySQL, PostgreSQL, and MongoDB.", 
            tags: ["SQL", "Database", "MongoDB"], 
            category: 'backend',
            provider: 'W3Schools',
            duration: '12 hours',
            url: 'https://www.w3schools.com/sql/'
        },
        { 
            title: "RESTful API Design", 
            desc: "Learn to design and build RESTful APIs following best practices and industry standards.", 
            tags: ["REST", "API", "Design"], 
            category: 'backend',
            provider: 'REST API Tutorial',
            duration: '8 hours',
            url: 'https://restfulapi.net/'
        },

        // Data Science
        { 
            title: "Data Science with Python", 
            desc: "Complete introduction to data science using Python, pandas, numpy, and matplotlib.", 
            tags: ["Python", "Pandas", "Data Analysis"], 
            category: 'data-science',
            provider: 'Kaggle Learn',
            duration: '20 hours',
            url: 'https://www.kaggle.com/learn/python'
        },
        { 
            title: "Statistics for Data Science", 
            desc: "Essential statistics concepts for data science including probability, hypothesis testing, and regression.", 
            tags: ["Statistics", "Probability", "Analysis"], 
            category: 'data-science',
            provider: 'Khan Academy',
            duration: '15 hours',
            url: 'https://www.khanacademy.org/math/statistics-probability'
        },
        { 
            title: "Data Visualization Masterclass", 
            desc: "Create compelling data visualizations using Python (matplotlib, seaborn) and JavaScript (D3.js).", 
            tags: ["Visualization", "D3.js", "Charts"], 
            category: 'data-science',
            provider: 'Observable',
            duration: '12 hours',
            url: 'https://observablehq.com/@d3/learn-d3'
        },

        // AI/ML
        { 
            title: "Machine Learning Fundamentals", 
            desc: "Introduction to machine learning concepts, algorithms, and practical applications using Python.", 
            tags: ["ML", "Python", "Algorithms"], 
            category: 'ai-ml',
            provider: 'Coursera (Andrew Ng)',
            duration: '25 hours',
            url: 'https://www.coursera.org/learn/machine-learning'
        },
        { 
            title: "Deep Learning with TensorFlow", 
            desc: "Build neural networks and deep learning models using TensorFlow and Keras.", 
            tags: ["Deep Learning", "TensorFlow", "Neural Networks"], 
            category: 'ai-ml',
            provider: 'TensorFlow',
            duration: '18 hours',
            url: 'https://www.tensorflow.org/learn'
        },
        { 
            title: "Natural Language Processing", 
            desc: "Learn NLP techniques for text analysis, sentiment analysis, and language models.", 
            tags: ["NLP", "Text Analysis", "AI"], 
            category: 'ai-ml',
            provider: 'Hugging Face',
            duration: '16 hours',
            url: 'https://huggingface.co/course/chapter1/1'
        },

        // Cybersecurity
        { 
            title: "Cybersecurity Fundamentals", 
            desc: "Essential cybersecurity concepts including network security, encryption, and threat analysis.", 
            tags: ["Security", "Network", "Encryption"], 
            category: 'cybersecurity',
            provider: 'Cybrary',
            duration: '14 hours',
            url: 'https://www.cybrary.it/course/comptia-security-plus/'
        },
        { 
            title: "Ethical Hacking & Penetration Testing", 
            desc: "Learn ethical hacking techniques and penetration testing methodologies.", 
            tags: ["Ethical Hacking", "Penetration Testing", "Security"], 
            category: 'cybersecurity',
            provider: 'OWASP',
            duration: '20 hours',
            url: 'https://owasp.org/www-project-web-security-testing-guide/'
        },

        // Mobile Development
        { 
            title: "React Native Complete Course", 
            desc: "Build cross-platform mobile apps using React Native for iOS and Android.", 
            tags: ["React Native", "Mobile", "Cross-platform"], 
            category: 'mobile',
            provider: 'React Native',
            duration: '16 hours',
            url: 'https://reactnative.dev/docs/tutorial'
        },
        { 
            title: "Flutter Development Bootcamp", 
            desc: "Create beautiful mobile apps using Flutter and Dart programming language.", 
            tags: ["Flutter", "Dart", "Mobile"], 
            category: 'mobile',
            provider: 'Flutter',
            duration: '18 hours',
            url: 'https://flutter.dev/learn'
        },
        { 
            title: "iOS Development with Swift", 
            desc: "Learn iOS app development using Swift and Xcode. Build native iOS applications.", 
            tags: ["iOS", "Swift", "Xcode"], 
            category: 'mobile',
            provider: 'Apple Developer',
            duration: '22 hours',
            url: 'https://developer.apple.com/swift/'
        },

        // Soft Skills & Career Development
        { 
            title: "Effective Communication Skills", 
            desc: "Master verbal and written communication skills essential for career success.", 
            tags: ["Communication", "Presentation", "Writing"], 
            category: 'soft-skills',
            provider: 'Coursera',
            duration: '8 hours',
            url: 'https://www.coursera.org/learn/wharton-communication-skills'
        },
        { 
            title: "Leadership & Team Management", 
            desc: "Develop leadership skills and learn effective team management strategies.", 
            tags: ["Leadership", "Management", "Teamwork"], 
            category: 'soft-skills',
            provider: 'edX',
            duration: '10 hours',
            url: 'https://www.edx.org/learn/leadership'
        },
        { 
            title: "Project Management Essentials", 
            desc: "Learn project management methodologies including Agile, Scrum, and traditional approaches.", 
            tags: ["Project Management", "Agile", "Scrum"], 
            category: 'soft-skills',
            provider: 'PMI',
            duration: '12 hours',
            url: 'https://www.pmi.org/learning/training-development'
        },
        { 
            title: "Career Development & Personal Branding", 
            desc: "Build your personal brand and develop strategies for career advancement.", 
            tags: ["Career", "Branding", "Networking"], 
            category: 'soft-skills',
            provider: 'LinkedIn Learning',
            duration: '6 hours',
            url: 'https://www.linkedin.com/learning/'
        },
        { 
            title: "Time Management & Productivity", 
            desc: "Master time management techniques and boost your productivity with proven strategies.", 
            tags: ["Time Management", "Productivity", "Efficiency"], 
            category: 'soft-skills',
            provider: 'Getting Things Done',
            duration: '5 hours',
            url: 'https://gettingthingsdone.com/'
        }
    ];

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
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
                    Free Courses
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Kickstart your learning journey with our comprehensive collection of free courses across all career paths.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search courses, technologies, or skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input w-full"
                        />
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
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-hover p-6 flex flex-col h-full group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {course.title}
                            </h3>
                        </div>
                        
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 flex-grow leading-relaxed">
                            {course.desc}
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {course.tags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-medium">{course.provider}</span>
                                <span>{course.duration}</span>
                            </div>
                            
                            <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-md btn-primary w-full group/btn"
                            >
                                <span>Start Learning</span>
                                <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        No courses found
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
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{courses.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Courses</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{categories.length - 1}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Career Paths</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">100%</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Free Content</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">24/7</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Available</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FreeCourses;
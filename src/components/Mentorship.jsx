import React from 'react';
import { motion } from 'framer-motion';

const Mentorship = () => {
    const mentors = [
        { name: "John Doe", title: "Senior Software Engineer @ Google", expertise: ["System Design", "Algorithms"] },
        { name: "Jane Smith", title: "Frontend Lead @ Vercel", expertise: ["React", "Next.js", "UI/UX"] },
        { name: "Sam Wilson", title: "DevOps Specialist @ AWS", expertise: ["Cloud", "CI/CD"] }
    ];

    return (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">1:1 Mentorship</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">Get personalized guidance from industry experts.</p>
            <div className="space-y-4">
                {mentors.map((mentor, i) => (
                    <div key={i} className="card p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-surface-200 dark:bg-neutral-700 rounded-full"></div>
                            <div>
                                <p className="font-bold text-neutral-800 dark:text-neutral-100">{mentor.name}</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{mentor.title}</p>
                                <div className="flex gap-2 mt-1">{mentor.expertise.map(e => <span key={e} className="text-xs bg-surface-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full">{e}</span>)}</div>
                            </div>
                        </div>
                        <button className="btn btn-md btn-primary shadow-glow">Book Session</button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Mentorship;
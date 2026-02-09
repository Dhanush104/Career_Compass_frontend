import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Eye, Edit3, Plus, Trash2, Save,
    User, Mail, Phone, MapPin, Briefcase, GraduationCap,
    Award, Code, Languages, Heart, Palette, Layout, Loader, CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { config } from '../config';

const ResumeBuilder = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resumeId, setResumeId] = useState(null);
    const resumeRef = useRef(null);

    const [resumeData, setResumeData] = useState({
        title: 'My Resume',
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
    });

    // Fetch User Data & Existing Resume
    useEffect(() => {
        const initData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Fetch User Profile
                const userRes = await fetch(`${config.endpoints.users}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();

                // 2. Fetch Latest Resume (if any)
                const resumeRes = await fetch(`${config.endpoints.resumes}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resumeJson = await resumeRes.json();

                if (resumeJson.success && resumeJson.resumes.length > 0) {
                    // Load existing resume
                    const existing = resumeJson.resumes[0];
                    setResumeId(existing._id);
                    setResumeData(prev => ({
                        ...prev,
                        title: existing.title,
                        personal: existing.personalInfo || prev.personal,
                        experience: existing.experience || [],
                        education: existing.education || [],
                        skills: existing.skills || [],
                        projects: existing.projects || [],
                        certifications: existing.certifications || [],
                        languages: existing.languages || []
                    }));
                    setSelectedTemplate(existing.template || 'modern');
                } else if (userData) {
                    // Pre-fill from User Profile
                    setResumeData(prev => ({
                        ...prev,
                        personal: {
                            ...prev.personal,
                            fullName: userData.fullName || userData.username || '',
                            email: userData.email || '',
                            location: userData.state ? `${userData.state}, ${userData.nationality}` : '',
                            linkedin: userData.linkedInUrl || '',
                            github: userData.githubUrl || '',
                            summary: userData.bio || ''
                        },
                        skills: (userData.skills || []).map(s => ({
                            id: Date.now() + Math.random(),
                            name: s.name,
                            level: s.level || 'Intermediate',
                            category: 'Technical' // Default
                        })),
                        projects: (userData.projects || []).map(p => ({
                            id: Date.now() + Math.random(),
                            title: p.title,
                            description: p.description,
                            technologies: p.technologies || [],
                            url: p.liveDemoUrl || '',
                            github: p.sourceCodeUrl || ''
                        }))
                    }));
                }
            } catch (error) {
                console.error("Error initializing resume builder:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const method = resumeId ? 'PUT' : 'POST';
            const url = resumeId
                ? `${config.endpoints.resumes}/${resumeId}`
                : `${config.endpoints.resumes}`;

            const payload = {
                title: resumeData.title,
                template: selectedTemplate,
                personalInfo: resumeData.personal,
                experience: resumeData.experience,
                education: resumeData.education,
                skills: resumeData.skills,
                projects: resumeData.projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    technologies: Array.isArray(p.technologies) ? p.technologies : [],
                    url: p.url,
                    github: p.github
                })),
                certifications: resumeData.certifications,
                languages: resumeData.languages,
                isDefault: true
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                if (!resumeId) setResumeId(data.resume._id);
                toast.success('Resume saved successfully!');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error(error.message || 'Failed to save resume');
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = () => {
        const element = resumeRef.current;
        const opt = {
            margin: 0, // No margin for full coverage
            filename: `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        toast.promise(
            html2pdf().set(opt).from(element).save(),
            {
                loading: 'Generating PDF...',
                success: 'Resume downloaded!',
                error: 'Failed to generate PDF'
            }
        );
    };

    const templates = [
        {
            id: 'modern',
            name: 'Modern Professional',
            preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
            description: 'Clean, modern design perfect for tech roles'
        },
        {
            id: 'creative',
            name: 'Creative Designer',
            preview: 'bg-gradient-to-br from-purple-50 to-pink-100',
            description: 'Eye-catching design for creative professionals'
        },
        {
            id: 'minimal',
            name: 'Minimal Classic',
            preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
            description: 'Simple, elegant design for any industry'
        },
        {
            id: 'executive',
            name: 'Executive',
            preview: 'bg-gradient-to-br from-emerald-50 to-teal-100',
            description: 'Professional design for senior positions'
        }
    ];

    const sections = [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'experience', name: 'Experience', icon: Briefcase },
        { id: 'education', name: 'Education', icon: GraduationCap },
        { id: 'skills', name: 'Skills', icon: Code },
        { id: 'projects', name: 'Projects', icon: FileText },
        { id: 'certifications', name: 'Certifications', icon: Award },
        { id: 'languages', name: 'Languages', icon: Languages }
    ];

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                achievements: []
            }]
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now(),
                degree: '',
                school: '',
                location: '',
                graduationDate: '',
                gpa: '',
                relevant: ''
            }]
        }));
    };

    const addSkill = () => {
        setResumeData(prev => ({
            ...prev,
            skills: [...prev.skills, {
                id: Date.now(),
                name: '',
                level: 'Intermediate',
                category: 'Technical'
            }]
        }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: Date.now(),
                title: '',
                description: '',
                technologies: [],
                url: '',
                github: ''
            }]
        }));
    };

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personal: {
                ...prev.personal,
                [field]: value
            }
        }));
    };

    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const updateItem = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    // --- RENDER SECTIONS ---

    const renderPersonalSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Full Name *</label>
                    <input type="text" value={resumeData.personal.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="input w-full" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Email *</label>
                    <input type="email" value={resumeData.personal.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="input w-full" placeholder="john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Phone</label>
                    <input type="tel" value={resumeData.personal.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="input w-full" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Location</label>
                    <input type="text" value={resumeData.personal.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} className="input w-full" placeholder="San Francisco, CA" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">LinkedIn</label>
                    <input type="url" value={resumeData.personal.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="input w-full" placeholder="https://linkedin.com/in/johndoe" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">GitHub</label>
                    <input type="url" value={resumeData.personal.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} className="input w-full" placeholder="https://github.com/johndoe" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Professional Summary</label>
                <textarea value={resumeData.personal.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} rows={4} className="input w-full resize-none" placeholder="Write a compelling summary..." />
            </div>
        </div>
    );

    const renderExperienceSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Work Experience</h3>
                <button onClick={addExperience} className="btn btn-md btn-primary"><Plus size={16} /> Add Experience</button>
            </div>
            {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Experience #{index + 1}</h4>
                        <button onClick={() => removeItem('experience', exp.id)} className="text-error-600 hover:text-error-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={exp.title} onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} className="input w-full" placeholder="Job Title" />
                        <input type="text" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} className="input w-full" placeholder="Company Name" />
                        <input type="text" value={exp.location} onChange={(e) => updateItem('experience', exp.id, 'location', e.target.value)} className="input w-full" placeholder="Location" />
                        <div className="flex gap-2">
                            <input type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} className="input flex-1" />
                            <input type="date" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} className="input flex-1" disabled={exp.current} />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 mb-4">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)} className="rounded" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Currently working here</span>
                    </label>
                    <textarea value={exp.description} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} rows={3} className="input w-full resize-none" placeholder="Describe your responsibilities..." />
                </div>
            ))}
        </div>
    );

    const renderProjectsSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Projects</h3>
                <button onClick={addProject} className="btn btn-md btn-primary"><Plus size={16} /> Add Project</button>
            </div>
            {resumeData.projects.map((proj, index) => (
                <div key={proj.id} className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Project #{index + 1}</h4>
                        <button onClick={() => removeItem('projects', proj.id)} className="text-error-600 hover:text-error-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={proj.title} onChange={(e) => updateItem('projects', proj.id, 'title', e.target.value)} className="input w-full" placeholder="Project Title" />
                        <input type="text" value={proj.url} onChange={(e) => updateItem('projects', proj.id, 'url', e.target.value)} className="input w-full" placeholder="Live URL" />
                        <input type="text" value={proj.github} onChange={(e) => updateItem('projects', proj.id, 'github', e.target.value)} className="input w-full" placeholder="GitHub URL" />
                    </div>
                    <textarea value={proj.description} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} rows={3} className="input w-full resize-none" placeholder="Project Description..." />
                </div>
            ))}
        </div>
    );

    const renderEducationSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Education</h3>
                <button onClick={addEducation} className="btn btn-md btn-primary"><Plus size={16} /> Add Education</button>
            </div>
            {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Education #{index + 1}</h4>
                        <button onClick={() => removeItem('education', edu.id)} className="text-error-600 hover:text-error-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={edu.school} onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)} className="input w-full" placeholder="School / University" />
                        <input type="text" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} className="input w-full" placeholder="Degree / Field of Study" />
                        <input type="text" value={edu.location} onChange={(e) => updateItem('education', edu.id, 'location', e.target.value)} className="input w-full" placeholder="Location" />
                        <div className="flex gap-2">
                            <input type="text" value={edu.graduationDate} onChange={(e) => updateItem('education', edu.id, 'graduationDate', e.target.value)} className="input w-full" placeholder="Graduation Year (e.g. 2024)" />
                            <input type="text" value={edu.gpa} onChange={(e) => updateItem('education', edu.id, 'gpa', e.target.value)} className="input w-full" placeholder="GPA (Optional)" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkillsSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Skills</h3>
                <button onClick={addSkill} className="btn btn-md btn-primary"><Plus size={16} /> Add Skill</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                    <div key={skill.id} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700 flex items-center gap-2">
                        <div className="flex-1">
                            <input type="text" value={skill.name} onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)} className="input w-full mb-2" placeholder="Skill Name (e.g. React)" />
                            <select value={skill.level} onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)} className="input w-full text-sm py-1">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <button onClick={() => removeItem('skills', skill.id)} className="text-error-600 hover:text-error-700 p-2"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCertificationsSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Certifications</h3>
                <button onClick={() => setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', date: '' }] }))} className="btn btn-md btn-primary"><Plus size={16} /> Add Certification</button>
            </div>
            {resumeData.certifications.map((cert, index) => (
                <div key={cert.id} className="p-6 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Certification #{index + 1}</h4>
                        <button onClick={() => removeItem('certifications', cert.id)} className="text-error-600 hover:text-error-700 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" value={cert.name} onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)} className="input w-full" placeholder="Certification Name" />
                        <input type="text" value={cert.issuer} onChange={(e) => updateItem('certifications', cert.id, 'issuer', e.target.value)} className="input w-full" placeholder="Issuer (e.g. Google)" />
                        <input type="text" value={cert.date} onChange={(e) => updateItem('certifications', cert.id, 'date', e.target.value)} className="input w-full" placeholder="Date (e.g. 2023)" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderLanguagesSection = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Languages</h3>
                <button onClick={() => setResumeData(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now(), language: '', proficiency: 'Native' }] }))} className="btn btn-md btn-primary"><Plus size={16} /> Add Language</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.languages.map((lang, index) => (
                    <div key={lang.id} className="p-4 bg-surface-50 dark:bg-neutral-800 rounded-xl border border-surface-200 dark:border-neutral-700 flex items-center gap-2">
                        <div className="flex-1">
                            <input type="text" value={lang.language} onChange={(e) => updateItem('languages', lang.id, 'language', e.target.value)} className="input w-full mb-2" placeholder="Language" />
                            <select value={lang.proficiency} onChange={(e) => updateItem('languages', lang.id, 'proficiency', e.target.value)} className="input w-full text-sm py-1">
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </div>
                        <button onClick={() => removeItem('languages', lang.id)} className="text-error-600 hover:text-error-700 p-2"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderData = () => {
        switch (activeSection) {
            case 'personal': return renderPersonalSection();
            case 'experience': return renderExperienceSection();
            case 'projects': return renderProjectsSection();
            case 'education': return renderEducationSection();
            case 'skills': return renderSkillsSection();
            case 'certifications': return renderCertificationsSection();
            case 'languages': return renderLanguagesSection();
            default: return <div className="text-center py-12 text-neutral-500">Select a section to edit</div>;
        }
    };

    // --- TEMPLATE COMPONENTS ---

    // Modern Professional Template (Blue Two-Column)
    const ModernTemplate = () => (
        <div className="bg-white text-black min-h-[297mm] w-full max-w-[210mm] mx-auto flex">
            {/* Left Sidebar */}
            <div className="w-[35%] bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6">
                {/* Profile */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{resumeData.personal.fullName}</h1>
                    <div className="h-1 w-16 bg-blue-300 mb-4"></div>
                </div>

                {/* Contact */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-3 uppercase tracking-wider">Contact</h2>
                    <div className="space-y-2 text-sm">
                        {resumeData.personal.email && (
                            <div className="flex items-center gap-2"><Mail size={12} /> {resumeData.personal.email}</div>
                        )}
                        {resumeData.personal.phone && (
                            <div className="flex items-center gap-2"><Phone size={12} /> {resumeData.personal.phone}</div>
                        )}
                        {resumeData.personal.location && (
                            <div className="flex items-center gap-2"><MapPin size={12} /> {resumeData.personal.location}</div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-3 uppercase tracking-wider">Skills</h2>
                        <div className="space-y-3">
                            {resumeData.skills.map((skill) => (
                                <div key={skill.id}>
                                    <div className="text-sm font-semibold mb-1">{skill.name}</div>
                                    <div className="w-full bg-blue-800 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-300 h-1.5 rounded-full"
                                            style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '50%' : '25%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {resumeData.languages.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold mb-3 uppercase tracking-wider">Languages</h2>
                        <div className="space-y-2 text-sm">
                            {resumeData.languages.map((lang) => (
                                <div key={lang.id}><span className="font-semibold">{lang.language}:</span> {lang.proficiency}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-[65%] p-8">
                {/* Summary */}
                {resumeData.personal.summary && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-wide border-b-2 border-blue-900 pb-1">Profile</h2>
                        <p className="text-sm leading-relaxed text-gray-700">{resumeData.personal.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide border-b-2 border-blue-900 pb-1">Experience</h2>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <span className="text-xs text-gray-500">
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-blue-700 mb-1">{exp.company} | {exp.location}</div>
                                    <p className="text-sm text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide border-b-2 border-blue-900 pb-1">Education</h2>
                        <div className="space-y-3">
                            {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">{edu.degree}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide border-b-2 border-blue-900 pb-1">Projects</h2>
                        <div className="space-y-3">
                            {resumeData.projects.map((proj) => (
                                <div key={proj.id}>
                                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                                    <p className="text-sm text-gray-700">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wide border-b-2 border-blue-900 pb-1">Certifications</h2>
                        <div className="space-y-2">
                            {resumeData.certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between">
                                    <div><span className="font-bold text-sm">{cert.name}</span> {cert.issuer && <span className="text-xs text-gray-600">by {cert.issuer}</span>}</div>
                                    <span className="text-xs text-gray-500">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Creative Designer Template (Gradient Header)
    const CreativeTemplate = () => (
        <div className="bg-white text-black min-h-[297mm] w-full max-w-[210mm] mx-auto">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{resumeData.personal.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                    {resumeData.personal.email && <div className="flex items-center gap-1"><Mail size={12} /> {resumeData.personal.email}</div>}
                    {resumeData.personal.phone && <div className="flex items-center gap-1"><Phone size={12} /> {resumeData.personal.phone}</div>}
                    {resumeData.personal.location && <div className="flex items-center gap-1"><MapPin size={12} /> {resumeData.personal.location}</div>}
                </div>
            </div>

            <div className="p-8">
                {/* Summary */}
                {resumeData.personal.summary && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                            About Me
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700">{resumeData.personal.summary}</p>
                    </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                            Experience
                        </h2>
                        <div className="space-y-4 border-l-2 border-purple-200 pl-6">
                            {resumeData.experience.map((exp) => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[27px] w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <span className="text-xs text-gray-500">
                                            {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-pink-600 mb-1">{exp.company}</div>
                                    <p className="text-sm text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                                <span key={skill.id} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                            Education
                        </h2>
                        <div className="space-y-3">
                            {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects & Certifications in Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {resumeData.projects.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                                Projects
                            </h2>
                            <div className="space-y-2">
                                {resumeData.projects.map((proj) => (
                                    <div key={proj.id}>
                                        <h3 className="font-bold text-sm text-gray-900">{proj.title}</h3>
                                        <p className="text-xs text-gray-700">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {resumeData.certifications.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                                Certifications
                            </h2>
                            <div className="space-y-2">
                                {resumeData.certifications.map((cert) => (
                                    <div key={cert.id}>
                                        <div className="font-bold text-sm text-gray-900">{cert.name}</div>
                                        <div className="text-xs text-gray-600">{cert.issuer} • {cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Minimal Classic Template (ATS-Friendly)
    const MinimalTemplate = () => (
        <div className="bg-white text-black p-8 min-h-[297mm] w-full max-w-[210mm] mx-auto">
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{resumeData.personal.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-3 text-xs text-gray-600">
                    {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                    {resumeData.personal.phone && <span>•</span>}
                    {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                    {resumeData.personal.location && <span>•</span>}
                    {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {resumeData.personal.summary && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b border-gray-200 pb-1">Summary</h2>
                    <p className="text-xs leading-relaxed text-gray-700">{resumeData.personal.summary}</p>
                </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-3 border-b border-gray-200 pb-1">Professional Experience</h2>
                    <div className="space-y-3">
                        {resumeData.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                                    <span className="text-xs text-gray-500">
                                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">{exp.company} | {exp.location}</div>
                                <p className="text-xs text-gray-700 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-3 border-b border-gray-200 pb-1">Education</h2>
                    <div className="space-y-2">
                        {resumeData.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm text-gray-900">{edu.school}</h3>
                                    <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                                </div>
                                <div className="text-xs text-gray-700">{edu.degree}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b border-gray-200 pb-1">Skills</h2>
                    <div className="text-xs text-gray-700">
                        {resumeData.skills.map(s => s.name).join(' • ')}
                    </div>
                </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-3 border-b border-gray-200 pb-1">Projects</h2>
                    <div className="space-y-2">
                        {resumeData.projects.map((proj) => (
                            <div key={proj.id}>
                                <h3 className="font-bold text-sm text-gray-900">{proj.title}</h3>
                                <p className="text-xs text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b border-gray-200 pb-1">Certifications</h2>
                    <div className="space-y-1">
                        {resumeData.certifications.map((cert) => (
                            <div key={cert.id} className="text-xs text-gray-700">
                                <span className="font-semibold">{cert.name}</span> {cert.issuer && `- ${cert.issuer}`} {cert.date && `(${cert.date})`}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b border-gray-200 pb-1">Languages</h2>
                    <div className="text-xs text-gray-700">
                        {resumeData.languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
                    </div>
                </div>
            )}
        </div>
    );

    // Executive Template (Green Two-Column with Right Sidebar)
    const ExecutiveTemplate = () => (
        <div className="bg-white text-black min-h-[297mm] w-full max-w-[210mm] mx-auto flex">
            {/* Left Content */}
            <div className="w-[65%] p-8 pr-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">{resumeData.personal.fullName}</h1>
                    <div className="h-1 w-24 bg-emerald-600 mb-3"></div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        {resumeData.personal.email && <span className="flex items-center gap-1"><Mail size={10} /> {resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span className="flex items-center gap-1"><Phone size={10} /> {resumeData.personal.phone}</span>}
                        {resumeData.personal.location && <span className="flex items-center gap-1"><MapPin size={10} /> {resumeData.personal.location}</span>}
                    </div>
                </div>

                {/* Executive Summary */}
                {resumeData.personal.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-emerald-700 mb-2 uppercase tracking-wide">Executive Summary</h2>
                        <p className="text-sm leading-relaxed text-gray-700 border-l-4 border-emerald-600 pl-3">{resumeData.personal.summary}</p>
                    </div>
                )}

                {/* Professional Experience */}
                {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-emerald-700 mb-3 uppercase tracking-wide">Professional Experience</h2>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                        <span className="text-xs text-gray-500">
                                            {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600 mb-1">{exp.company} • {exp.location}</div>
                                    <p className="text-sm text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-emerald-700 mb-3 uppercase tracking-wide">Education</h2>
                        <div className="space-y-2">
                            {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-emerald-700 mb-3 uppercase tracking-wide">Key Projects</h2>
                        <div className="space-y-3">
                            {resumeData.projects.map((proj) => (
                                <div key={proj.id}>
                                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                                    <p className="text-sm text-gray-700">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <div className="w-[35%] bg-gradient-to-b from-emerald-50 to-teal-50 p-6 border-l-4 border-emerald-600">
                {/* Core Competencies */}
                {resumeData.skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-bold text-emerald-800 mb-3 uppercase tracking-wide">Core Competencies</h2>
                        <div className="space-y-2">
                            {resumeData.skills.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                    <span className="text-sm text-gray-800 font-medium">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-bold text-emerald-800 mb-3 uppercase tracking-wide">Certifications</h2>
                        <div className="space-y-2">
                            {resumeData.certifications.map((cert) => (
                                <div key={cert.id} className="text-sm">
                                    <div className="font-bold text-gray-900">{cert.name}</div>
                                    <div className="text-xs text-gray-600">{cert.issuer} • {cert.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {resumeData.languages.length > 0 && (
                    <div>
                        <h2 className="text-base font-bold text-emerald-800 mb-3 uppercase tracking-wide">Languages</h2>
                        <div className="space-y-2">
                            {resumeData.languages.map((lang) => (
                                <div key={lang.id} className="text-sm text-gray-800">
                                    <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // --- MAIN PREVIEW RENDERER (Dynamic Template Selection) ---
    const ResumePreview = () => {
        const renderTemplate = () => {
            switch (selectedTemplate) {
                case 'modern':
                    return <ModernTemplate />;
                case 'creative':
                    return <CreativeTemplate />;
                case 'minimal':
                    return <MinimalTemplate />;
                case 'executive':
                    return <ExecutiveTemplate />;
                default:
                    return <ModernTemplate />;
            }
        };

        return (
            <div ref={resumeRef} id="resume-preview" className="shadow-2xl">
                {renderTemplate()}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                        Resume Builder
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Craft your professional story. Auto-synced with your profile.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Resume
                    </button>
                    <button
                        onClick={handleDownload}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Template Selector */}
            <div className="mb-8">
                <div className="card-hover p-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Choose Your Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`group relative p-4 rounded-xl border-2 transition-all ${selectedTemplate === template.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                                    : 'border-surface-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                {/* Template Preview */}
                                <div className={`${template.preview} h-32 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden`}>
                                    {selectedTemplate === template.id && (
                                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                            <div className="bg-white dark:bg-neutral-900 rounded-full p-2">
                                                <CheckCircle size={24} className="text-primary-600" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <Palette size={32} className="mx-auto mb-2 text-neutral-600" />
                                        <div className="text-xs font-medium text-neutral-700">Preview</div>
                                    </div>
                                </div>

                                {/* Template Info */}
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">{template.name}</h3>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">{template.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="card-hover p-4 sticky top-6">
                        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2">Sections</h3>
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${activeSection === section.id
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-surface-100 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{section.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="card-hover p-6">
                        {renderData()}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-8">
                    <div className="bg-neutral-800 rounded-2xl p-8 overflow-hidden shadow-2xl border border-neutral-700">
                        <div className="flex items-center justify-between text-neutral-400 mb-4 px-2">
                            <span className="text-sm font-medium uppercase tracking-wider">Live Preview</span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <div className="transform origin-top scale-[0.8] lg:scale-100 transition-transform duration-300">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResumeBuilder;

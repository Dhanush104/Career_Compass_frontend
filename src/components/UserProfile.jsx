import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
    Edit, Save, User, Mail, Phone, Linkedin, Github, Globe,
    MapPin, Cake, Briefcase, Award, Camera, X, Check
} from 'lucide-react';
import { config } from '../config';

const UserProfile = ({ user, onUpdate }) => {
    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium">Loading Profile...</p>
                </div>
            </div>
        );
    }

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${config.endpoints.users}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update');

            toast.success('Profile updated successfully!');
            onUpdate && onUpdate(data.user);
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Update failed');
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // ProfileField kept local as in your file
    const ProfileField = ({ label, name, value, icon: Icon, placeholder, type = 'text', disabled = false }) => (
        <div className="group">
            <label className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                <Icon size={14} className="mr-2 text-neutral-400 dark:text-neutral-300" />
                {label}
            </label>

            {isEditing && !disabled ? (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                    placeholder={placeholder}
                />
            ) : (
                <p className="text-neutral-900 dark:text-neutral-100 text-base font-medium px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-transparent group-hover:border-neutral-200 dark:group-hover:border-neutral-700 transition-all">
                    {value || <span className="text-neutral-400 dark:text-neutral-300">Not set</span>}
                </p>
            )}
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                    >
                        My Profile
                    </motion.h1>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg font-medium transition-colors"
                            >
                                <Edit size={18} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-neutral-600 dark:text-neutral-400 text-lg">
                    Manage your personal information and public profile
                </motion.p>
            </div>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card rounded-3xl shadow-xl overflow-hidden mb-8 hover:shadow-2xl transition-shadow duration-300">
                {/* Cover Photo */}
                <div className="h-40 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
                    <div className="absolute -bottom-20 left-6">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl bg-white dark:bg-neutral-900 p-1.5 shadow-2xl ring-4 ring-white dark:ring-neutral-900">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-inner">
                                    <span className="text-5xl font-bold text-white">{getInitials(formData.fullName || user.name)}</span>
                                </div>
                            </div>

                            {isEditing && (
                                <button className="absolute bottom-2 right-2 p-3 bg-primary-500 rounded-xl text-white hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                                    <Camera size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-24 px-8 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{formData.fullName || user.name || 'Your Name'}</h2>

                            <div className="flex flex-col gap-2">
                                <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                                    <Mail size={18} className="text-primary-500" />
                                    <span className="font-medium">{user.email}</span>
                                </p>

                                {formData.workStatus && (
                                    <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                                        <Briefcase size={18} className="text-accent-500" />
                                        <span className="font-medium">{formData.workStatus}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons (duplicate safe area) */}
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                                        <X size={16} />
                                        <span>Cancel</span>
                                    </button>
                                    <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg">
                                        <Check size={16} />
                                        <span>Save</span>
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                                    <Edit size={16} />
                                    <span>Edit</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-hover rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
                                <User size={22} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            <span>Personal Information</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField label="Full Name" name="fullName" value={formData.fullName} icon={User} placeholder="Enter your full name" />
                            <ProfileField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} icon={Cake} placeholder="YYYY-MM-DD" type="date" />
                            <ProfileField label="Nationality" name="nationality" value={formData.nationality} icon={Globe} placeholder="e.g., Indian" />
                            <ProfileField label="State" name="state" value={formData.state} icon={MapPin} placeholder="e.g., Tamil Nadu" />
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-hover rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/30 rounded-xl">
                                <Phone size={22} className="text-success-600 dark:text-success-400" />
                            </div>
                            <span>Contact Information</span>
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <ProfileField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} icon={Phone} placeholder="+91 XXXXX XXXXX" type="tel" />
                            <ProfileField label="Work/Study Status" name="workStatus" value={formData.workStatus} icon={Briefcase} placeholder="e.g., Student at PSG Tech" />
                            <ProfileField label="Email Address" name="email" value={user.email} icon={Mail} placeholder="Email" disabled />
                        </div>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-hover rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 rounded-xl">
                                <Globe size={22} className="text-accent-600 dark:text-accent-400" />
                            </div>
                            <span>Social Links</span>
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <ProfileField label="LinkedIn Profile" name="linkedInUrl" value={formData.linkedInUrl} icon={Linkedin} placeholder="https://linkedin.com/in/username" type="url" />
                            <ProfileField label="GitHub Profile" name="githubUrl" value={formData.githubUrl} icon={Github} placeholder="https://github.com/username" type="url" />
                        </div>
                    </motion.div>
                </div>

                {/* Right column: stats */}
                <div className="space-y-6">
                    {/* Account Stats (fancy) */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-xl shadow-primary-500/30 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                        <div className="relative z-10">
                            <div className="flex items-center mb-4">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-lg font-bold ml-3">Your Stats</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/90">Level</span>
                                    <span className="text-2xl font-bold">{user.level || 1}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/90">Total XP</span>
                                    <span className="text-2xl font-bold">{user.xp || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/90">Streak</span>
                                    <span className="text-2xl font-bold">{user.streak || 0} 🔥</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Completion */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-hover rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Profile Completion</h3>
                        <div className="space-y-4">
                            {(() => {
                                const fields = [
                                    formData.fullName,
                                    formData.dateOfBirth,
                                    formData.nationality,
                                    formData.state,
                                    formData.mobileNumber,
                                    formData.workStatus,
                                    formData.linkedInUrl,
                                    formData.githubUrl
                                ];
                                const completed = fields.filter(Boolean).length;
                                const total = fields.length;
                                const percentage = Math.round((completed / total) * 100);

                                return (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">{completed} of {total} completed</span>
                                            <span className="text-sm font-bold text-amber-600">{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
                                        </div>
                                        {percentage < 100 && <p className="text-xs text-gray-500 mt-2">Complete your profile to unlock all features!</p>}
                                    </>
                                );
                            })()}
                        </div>
                    </motion.div>

                    {/* Account Info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card-hover rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">Account Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Member Since</p>
                                <p className="text-gray-900 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Status</p>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{user.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;

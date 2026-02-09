import React from 'react';
import {
    LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp, Activity, Target, Zap } from 'lucide-react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-xl border border-surface-200 dark:border-neutral-700">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs text-neutral-600 dark:text-neutral-400">
                        <span style={{ color: entry.color }}>{entry.name}: </span>
                        <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// XP Progress Line Chart
export const XPProgressChart = ({ data }) => {
    // Generate sample data if none provided
    const chartData = data || [
        { date: 'Mon', xp: 120 },
        { date: 'Tue', xp: 250 },
        { date: 'Wed', xp: 180 },
        { date: 'Thu', xp: 320 },
        { date: 'Fri', xp: 280 },
        { date: 'Sat', xp: 400 },
        { date: 'Sun', xp: 350 }
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            XP Progress
                        </h3>
                        <p className="text-xs text-neutral-500">Last 7 days</p>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-700" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="xp"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#xpGradient)"
                        name="XP Earned"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// Skills Radar Chart
export const SkillsRadarChart = ({ skills }) => {
    // Transform skills data for radar chart
    const chartData = skills?.slice(0, 6).map(skill => ({
        skill: skill.name,
        level: skill.level === 'Expert' ? 100 : skill.level === 'Advanced' ? 75 : skill.level === 'Intermediate' ? 50 : 25
    })) || [
            { skill: 'React', level: 85 },
            { skill: 'Node.js', level: 70 },
            { skill: 'Python', level: 60 },
            { skill: 'MongoDB', level: 75 },
            { skill: 'TypeScript', level: 65 },
            { skill: 'Docker', level: 50 }
        ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                        <Zap size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            Skills Overview
                        </h3>
                        <p className="text-xs text-neutral-500">Top 6 skills</p>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData}>
                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-neutral-700" />
                    <PolarAngleAxis
                        dataKey="skill"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        stroke="#9ca3af"
                        style={{ fontSize: '10px' }}
                    />
                    <Radar
                        name="Skill Level"
                        dataKey="level"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.6}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Activity Bar Chart
export const ActivityBarChart = ({ data }) => {
    const chartData = data || [
        { day: 'Mon', activities: 5 },
        { day: 'Tue', activities: 8 },
        { day: 'Wed', activities: 6 },
        { day: 'Thu', activities: 10 },
        { day: 'Fri', activities: 7 },
        { day: 'Sat', activities: 12 },
        { day: 'Sun', activities: 9 }
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                        <Activity size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            Weekly Activity
                        </h3>
                        <p className="text-xs text-neutral-500">Activities completed</p>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-700" />
                    <XAxis
                        dataKey="day"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="activities"
                        fill="url(#activityGradient)"
                        radius={[8, 8, 0, 0]}
                        name="Activities"
                    />
                    <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Goals Donut Chart
export const GoalsDonutChart = ({ goalsData }) => {
    const data = goalsData || [
        { name: 'Completed', value: 12, color: '#10b981' },
        { name: 'In Progress', value: 5, color: '#f59e0b' },
        { name: 'Not Started', value: 3, color: '#6b7280' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-surface-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                        <Target size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                            Goals Status
                        </h3>
                        <p className="text-xs text-neutral-500">Total: {total} goals</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {data.map((item, index) => (
                    <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                {item.name}
                            </span>
                        </div>
                        <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default {
    XPProgressChart,
    SkillsRadarChart,
    ActivityBarChart,
    GoalsDonutChart
};

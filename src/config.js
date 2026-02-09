// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const config = {
    apiUrl: API_URL,
    endpoints: {
        auth: `${API_URL}/api/auth`,
        users: `${API_URL}/api/users`,
        roadmap: `${API_URL}/api/roadmap`,
        goals: `${API_URL}/api/goals`,
        analytics: `${API_URL}/api/analytics`,
        community: `${API_URL}/api/community`,
        resumes: `${API_URL}/api/resumes`,
        codingChallenges: `${API_URL}/api/coding-challenges`,
        interviews: `${API_URL}/api/interviews`,
        mentorship: `${API_URL}/api/mentorship`,
        posts: `${API_URL}/api/posts`,
        reportCard: `${API_URL}/api/report-card`,
        ai: `${API_URL}/api/ai`,
        projects: `${API_URL}/api/projects`,
    },
};

export default config;

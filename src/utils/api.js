// API Helper - Use this to make API calls with centralized configuration
import config from './config';

/**
 * Make an authenticated API request
 * @param {string} endpoint - The API endpoint (e.g., '/api/users/me')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const url = endpoint.startsWith('http')
        ? endpoint
        : `${config.apiUrl}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    return response;
};

/**
 * Get API endpoint URL
 * @param {string} path - The path (e.g., '/api/users/me')
 * @returns {string} Full URL
 */
export const getApiUrl = (path) => {
    return `${config.apiUrl}${path}`;
};

export default { apiRequest, getApiUrl };

// src/services/api.js
const API_BASE_URL = 'https://excel-analytics-8as0.onrender.com/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'An error occurred');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getMe() {
        return this.request('/me', {
            method: 'GET',
        });
    }

    async deleteChart(chartId) {
        if (!chartId) {
            throw new Error('Chart ID is required for deletion');
        }

        return this.request(`/charts/delete/${chartId}`, {
            method: 'DELETE',
        });
    }
}

const apiService = new ApiService();


export const deleteChart = (chartId) => apiService.deleteChart(chartId);
export default apiService;
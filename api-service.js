/**
 * API Configuration
 * API сервери менен байланыш конфигурациясы
 */

const API_CONFIG = {
    // API базалык URL
    BASE_URL: 'http://localhost:5000/api',
    
    // API endpoints
    ENDPOINTS: {
        HEALTH: '/health',
        PROGRAMS: '/programs',
        TEACHERS: '/teachers',
        NEWS: '/news',
        ADMISSION: '/admission',
        SUBMISSIONS: '/submissions',
        STATISTICS: '/statistics'
    },

    // Timeout (миллисекунд)
    TIMEOUT: 10000,

    // Headers
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * API Service Class
 * API менен иштеш класс
 */
class ApiService {
    constructor(config = API_CONFIG) {
        this.config = config;
    }

    /**
     * GET request жолдоо
     */
    async get(endpoint, query = null) {
        let url = `${this.config.BASE_URL}${endpoint}`;
        
        if (query) {
            const queryString = new URLSearchParams(query).toString();
            url += `?${queryString}`;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.config.HEADERS,
                timeout: this.config.TIMEOUT
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('GET сурамчы катасы:', error);
            throw error;
        }
    }

    /**
     * POST request жолдоо
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.config.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.config.HEADERS,
                body: JSON.stringify(data),
                timeout: this.config.TIMEOUT
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('POST сурамчы катасы:', error);
            throw error;
        }
    }

    /**
     * PATCH request жолдоо
     */
    async patch(endpoint, data) {
        try {
            const response = await fetch(`${this.config.BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: this.config.HEADERS,
                body: JSON.stringify(data),
                timeout: this.config.TIMEOUT
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('PATCH сурамчы катасы:', error);
            throw error;
        }
    }

    /**
     * DELETE request жолдоо
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.config.BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.config.HEADERS,
                timeout: this.config.TIMEOUT
            });

            return this._handleResponse(response);
        } catch (error) {
            console.error('DELETE сурамчы катасы:', error);
            throw error;
        }
    }

    /**
     * Response обработка
     */
    async _handleResponse(response) {
        let data;
        
        try {
            data = await response.json();
        } catch (e) {
            data = { error: 'Жаопты JSON формата чекилбеди' };
        }

        if (!response.ok) {
            const error = new Error(data.error || 'Белгисиз ката');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }
}

// Global API сервисин инициализе кыл
const api = new ApiService();

/**
 * API методдарындын удундуктуу функцияларасы
 */
const ApiMethods = {
    // Health check
    checkHealth: () => api.get(API_CONFIG.ENDPOINTS.HEALTH),

    // Programs
    getPrograms: () => api.get(API_CONFIG.ENDPOINTS.PROGRAMS),
    getProgram: (id) => api.get(`${API_CONFIG.ENDPOINTS.PROGRAMS}/${id}`),

    // Teachers
    getTeachers: () => api.get(API_CONFIG.ENDPOINTS.TEACHERS),
    getTeacher: (id) => api.get(`${API_CONFIG.ENDPOINTS.TEACHERS}/${id}`),

    // News
    getNews: (category = null) => {
        const query = category ? { category } : null;
        return api.get(API_CONFIG.ENDPOINTS.NEWS, query);
    },
    getNewsItem: (id) => api.get(`${API_CONFIG.ENDPOINTS.NEWS}/${id}`),

    // Admission
    submitAdmission: (data) => api.post(API_CONFIG.ENDPOINTS.ADMISSION, data),

    // Submissions (Admin)
    getSubmissions: (status = null) => {
        const query = status ? { status } : null;
        return api.get(API_CONFIG.ENDPOINTS.SUBMISSIONS, query);
    },
    getSubmission: (id) => api.get(`${API_CONFIG.ENDPOINTS.SUBMISSIONS}/${id}`),
    updateSubmissionStatus: (id, status) => 
        api.patch(`${API_CONFIG.ENDPOINTS.SUBMISSIONS}/${id}/status`, { status }),

    // Statistics
    getStatistics: () => api.get(API_CONFIG.ENDPOINTS.STATISTICS)
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, api, ApiMethods, API_CONFIG };
}

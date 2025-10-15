// API service for handling HTTP requests
class ApiService {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // User Management
    async getUsers() {
        return this.get('/users');
    }

    async createUser(userData) {
        return this.post('/users', userData);
    }

    async updateUser(userId, userData) {
        return this.put(`/users/${userId}`, userData);
    }

    async deleteUser(userId) {
        return this.delete(`/users/${userId}`);
    }

    // Role Management
    async getRoles() {
        return this.get('/roles');
    }

    async createRole(roleData) {
        return this.post('/roles', roleData);
    }

    // Payment Management
    async getPayments() {
        return this.get('/payments');
    }

    async createPayment(paymentData) {
        return this.post('/payments', paymentData);
    }

    // Institution Management
    async getInstitutions() {
        return this.get('/institutions');
    }

    async createInstitution(institutionData) {
        return this.post('/institutions', institutionData);
    }

    // Change Requests
    async getChangeRequests() {
        return this.get('/change-requests');
    }

    async updateChangeRequest(requestId, status) {
        return this.put(`/change-requests/${requestId}`, { status });
    }

    // Authentication
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async logout() {
        localStorage.removeItem('authToken');
        this.token = null;
    }
}

// Create global API instance
const api = new ApiService('/api');
// src/services/apiClient.js
class ApiService {
  constructor() {
    // Use environment variables for API configuration
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.token = this.getToken();
  }

  // Token Management
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    const token = localStorage.getItem('authToken');
    return token || null;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Helper method for making authenticated requests
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        this.clearToken();
        throw new Error('Authentication expired. Please login again.');
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong with the request');
      }
      
      return result;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication Methods
  async register(email, name, password) {
    const data = await this.request('/auth/register', 'POST', {
      email,
      name,
      password
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', 'POST', {
      email,
      password
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async createGuestUser() {
    const data = await this.request('/auth/guest', 'POST');
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  logout() {
    this.clearToken();
    return { success: true };
  }

  // Message Methods
  async getMessages() {
    return await this.request('/messages');
  }

  async addMessage(message) {
    return await this.request('/messages', 'POST', message);
  }

  async clearMessages() {
    return await this.request('/messages', 'DELETE');
  }

  // Financial Data Methods
  async getFinancialData() {
    return await this.request('/financial-data');
  }

  async saveFinancialData(extractedData) {
    return await this.request('/financial-data/save', 'POST', { extractedData });
  }

  // Goals Methods
  async getGoals() {
    return await this.request('/goals');
  }

  async addGoal(goal) {
    return await this.request('/goals', 'POST', goal);
  }

  async updateGoal(goalId, goalData) {
    return await this.request(`/goals/${goalId}`, 'PUT', goalData);
  }

  async deleteGoal(goalId) {
    return await this.request(`/goals/${goalId}`, 'DELETE');
  }

  // User Goal Methods
  async getUserGoals() {
    return await this.request('/goals/user-goals');
  }

  async setCurrentGoal(goalId) {
    return await this.request(`/goals/set-current/${goalId}`, 'PUT');
  }

  async updateGoalProgress(goalId, progressData) {
    return await this.request(`/goals/progress/${goalId}`, 'PUT', progressData);
  }

  // User Methods
  async updateUser(userData) {
    return await this.request('/users/update', 'PUT', userData);
  }

  // Health Check
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Document Upload (Placeholder - would integrate with actual file upload)
  async uploadDocument(file, goalContext) {
    // In a real implementation, we would use FormData for file uploads
    const formData = new FormData();
    formData.append('document', file);
    if (goalContext) {
      formData.append('goalContext', goalContext);
    }

    const url = `${this.baseURL}/documents/upload`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
        body: formData,
        credentials: 'include',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }
}

export default new ApiService();

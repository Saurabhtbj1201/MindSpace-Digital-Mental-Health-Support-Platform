/**
 * API Utility Functions
 * Centralized API configuration and request utilities to reduce code duplication
 */

/**
 * Get API configuration object
 * @returns {Object} - Returns API configuration with backendApiUrl and mlServiceUrl
 */
function getApiConfig() {
    return window.ENV_CONFIG || {
        backendApiUrl: 'http://localhost:5001',
        mlServiceUrl: 'http://localhost:5000/predict_emotion'
    };
}

/**
 * Get backend API URL
 * @returns {string} - Returns backend API URL
 */
function getBackendApiUrl() {
    const config = getApiConfig();
    return config.backendApiUrl;
}

/**
 * Get ML service URL
 * @returns {string} - Returns ML service URL
 */
function getMlServiceUrl() {
    const config = getApiConfig();
    return config.mlServiceUrl;
}

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/user/profile')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - Returns fetch promise
 */
async function apiRequest(endpoint, options = {}) {
    const authToken = localStorage.getItem('authToken');
    const config = getApiConfig();
    const url = `${config.backendApiUrl}${endpoint}`;
    
    const defaultHeaders = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    };
    
    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };
    
    return fetch(url, fetchOptions);
}

/**
 * Make authenticated GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Response>} - Returns fetch promise
 */
async function apiGet(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * Make authenticated POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<Response>} - Returns fetch promise
 */
async function apiPost(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Make authenticated PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<Response>} - Returns fetch promise
 */
async function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Make authenticated DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Response>} - Returns fetch promise
 */
async function apiDelete(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Handle API response and return JSON or throw error
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} - Returns parsed JSON data
 * @throws {Error} - Throws error if response is not ok
 */
async function handleApiResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    
    return data;
}

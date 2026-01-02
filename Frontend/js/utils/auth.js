/**
 * Authentication Utility Functions
 * Centralized authentication logic to reduce code duplication
 */

/**
 * Check if user is authenticated
 * @returns {boolean} - Returns true if user has valid auth token
 */
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Returns auth token or null
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Get user data from localStorage
 * @returns {Object} - Returns user data object or empty object
 */
function getUserData() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
}

/**
 * Check authentication and redirect to login if not authenticated
 * @param {string} redirectUrl - URL to redirect to if not authenticated (default: 'index.html')
 * @returns {boolean} - Returns true if authenticated, false otherwise
 */
function requireAuth(redirectUrl = 'index.html') {
    const authToken = getAuthToken();
    if (!authToken) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Get headers for API requests with authentication
 * @returns {Object} - Returns headers object with Authorization and Content-Type
 */
function getAuthHeaders() {
    const authToken = getAuthToken();
    return {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    };
}

/**
 * Logout user by clearing authentication data
 * @param {string} redirectUrl - URL to redirect after logout (default: 'index.html')
 * @param {Function} showSuccessCallback - Optional callback to show success message
 */
function logout(redirectUrl = 'index.html', showSuccessCallback = null) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    if (showSuccessCallback && typeof showSuccessCallback === 'function') {
        showSuccessCallback('Logged out successfully!');
    }
    
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1500);
}

/**
 * Setup logout button handler
 * @param {string} buttonId - ID of logout button element
 * @param {Function} showSuccessCallback - Optional callback to show success message
 */
function setupLogoutHandler(buttonId = 'logout-btn', showSuccessCallback = null) {
    const logoutBtn = document.getElementById(buttonId);
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout('index.html', showSuccessCallback);
        });
    }
}

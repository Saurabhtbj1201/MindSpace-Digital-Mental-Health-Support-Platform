/**
 * Response Handler Utility
 * Centralized response handling to reduce code duplication in controllers
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {Object} data - Response data
 * @param {string} message - Optional success message
 */
const sendSuccess = (res, statusCode = 200, data = {}, message = null) => {
    const response = {
        success: true,
        ...data
    };
    
    if (message) {
        response.message = message;
    }
    
    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {Object} additionalData - Optional additional data
 */
const sendError = (res, statusCode = 500, message = 'Server error', additionalData = {}) => {
    const response = {
        success: false,
        message,
        ...additionalData
    };
    
    return res.status(statusCode).json(response);
};

/**
 * Handle error with logging and response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} context - Context description for logging
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleError = (res, error, context = 'Operation', statusCode = 500) => {
    console.error(`Error ${context}:`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return sendError(res, 400, 'Validation Error', { errors });
    }
    
    // Handle mongoose cast errors
    if (error.name === 'CastError') {
        return sendError(res, 400, 'Invalid ID format');
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return sendError(res, 400, `${field} already exists`);
    }
    
    return sendError(res, statusCode, error.message || 'Server error');
};

/**
 * Send created response (201)
 * @param {Object} res - Express response object
 * @param {Object} data - Created resource data
 * @param {string} message - Optional success message
 */
const sendCreated = (res, data = {}, message = 'Resource created successfully') => {
    return sendSuccess(res, 201, data, message);
};

/**
 * Send not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const sendNotFound = (res, message = 'Resource not found') => {
    return sendError(res, 404, message);
};

/**
 * Send unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
    return sendError(res, 401, message);
};

/**
 * Send forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
const sendForbidden = (res, message = 'Forbidden') => {
    return sendError(res, 403, message);
};

/**
 * Send bad request response (400)
 * @param {Object} res - Express response object
 * @param {string} message - Bad request message
 * @param {Object} additionalData - Optional additional data
 */
const sendBadRequest = (res, message = 'Bad request', additionalData = {}) => {
    return sendError(res, 400, message, additionalData);
};

module.exports = {
    sendSuccess,
    sendError,
    handleError,
    sendCreated,
    sendNotFound,
    sendUnauthorized,
    sendForbidden,
    sendBadRequest
};

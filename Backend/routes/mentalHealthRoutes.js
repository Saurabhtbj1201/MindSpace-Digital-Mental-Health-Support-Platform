const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const {
  analyzeMentalHealth,
  getMentalHealthReports,
  getMentalHealthReport,
  emailMentalHealthReport,
  downloadReportPDF,
  saveModuleProgress,
  getModuleProgress,
  clearModuleProgress
} = require('../controllers/mentalHealthController');

const router = express.Router();

// Protect all routes
router.use(protect);

// Rate limiter for report generation — max 3 submissions per user per 10 minutes.
// Keyed on user ID (set by the protect middleware) so it is not bypassable by
// spoofing a different IP or rotating through proxies.
const analyzeRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message:
        'Too many report generation requests. Please wait a few minutes before trying again.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

// @route   POST /api/mental-health/analyze
// @desc    Analyze mental health data and generate report
// @access  Private
router.post('/analyze', analyzeRateLimit, analyzeMentalHealth);

// @route   GET /api/mental-health/reports
// @desc    Get user's mental health reports
// @access  Private
router.get('/reports', getMentalHealthReports);

// @route   GET /api/mental-health/reports/:id
// @desc    Get specific mental health report
// @access  Private
router.get('/reports/:id', getMentalHealthReport);

// @route   POST /api/mental-health/email-report
// @desc    Email mental health report to user
// @access  Private
router.post('/email-report', emailMentalHealthReport);

// @route   GET /api/mental-health/reports/:id/pdf
// @desc    Download mental health report as PDF
// @access  Private
router.get('/reports/:id/pdf', downloadReportPDF);

// @route   GET /api/mental-health/progress
// @desc    Get module progress for user
// @access  Private
router.get('/progress', getModuleProgress);

// @route   POST /api/mental-health/progress
// @desc    Save module progress for user
// @access  Private
router.post('/progress', saveModuleProgress);

// @route   DELETE /api/mental-health/progress/clear
// @desc    Clear all module progress for user
// @access  Private
router.delete('/progress/clear', clearModuleProgress);

module.exports = router;

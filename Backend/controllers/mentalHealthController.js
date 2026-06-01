const MentalHealthReport = require('../models/MentalHealthReport');
const User = require('../models/User');
const Profile = require('../models/Profile');
const sendEmail = require('../utils/emailService');

const SEVERITY_ALIASES = {
  none: 'normal',
  minimal: 'minimal',
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe',
  extreme: 'severe',
  'very severe': 'severe',
  'extremely severe': 'severe'
};

const LIFESTYLE_ALIASES = {
  exerciseFrequency: {
    none: 'never',
    no: 'never',
    weekly: 'sometimes',
    regular: 'often',
    everyday: 'daily'
  },
  smokingStatus: {
    'never smoked': 'never',
    'non smoker': 'never',
    'non-smoker': 'never',
    'ex smoker': 'former',
    'ex-smoker': 'former',
    social: 'occasional',
    'social smoker': 'occasional'
  },
  alcoholConsumption: {
    none: 'never',
    social: 'occasionally',
    socially: 'occasionally',
    often: 'regularly',
    regular: 'regularly',
    everyday: 'daily'
  }
};

const normalizeNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
};

const normalizeEnumValue = (value, allowedValues, aliases = {}) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue) {
    return null;
  }

  const mappedValue = aliases[normalizedValue] || normalizedValue;
  return allowedValues.includes(mappedValue) ? mappedValue : null;
};

const normalizeSeverity = (value, allowedValues) =>
  normalizeEnumValue(value, allowedValues, SEVERITY_ALIASES);

const normalizeLifestyle = (lifestyle = {}) => {
  const normalizedLifestyle = {};
  const allowedEnums = {
    exerciseFrequency: ['never', 'rarely', 'sometimes', 'often', 'daily'],
    smokingStatus: ['never', 'former', 'current', 'occasional'],
    alcoholConsumption: ['never', 'rarely', 'occasionally', 'regularly', 'daily']
  };

  Object.entries(allowedEnums).forEach(([field, allowedValues]) => {
    const normalizedField = normalizeEnumValue(
      lifestyle[field],
      allowedValues,
      LIFESTYLE_ALIASES[field]
    );

    if (normalizedField) {
      normalizedLifestyle[field] = normalizedField;
    }
  });

  const parsedScreenTime = normalizeNumber(lifestyle.screenTime);
  if (parsedScreenTime !== null) {
    normalizedLifestyle.screenTime = parsedScreenTime;
  }

  if (typeof lifestyle.chronicConditions === 'string') {
    normalizedLifestyle.chronicConditions = lifestyle.chronicConditions.trim();
  }

  if (typeof lifestyle.medications === 'string') {
    normalizedLifestyle.medications = lifestyle.medications.trim();
  }

  return normalizedLifestyle;
};

const normalizeAssessmentScore = (assessment, allowedSeverities) => {
  if (!assessment || typeof assessment !== 'object') {
    return null;
  }

  const score = normalizeNumber(assessment.score);
  const severity = normalizeSeverity(assessment.severity, allowedSeverities);

  if (score === null || !severity) {
    return null;
  }

  return { score, severity };
};

// @desc    Analyze mental health data and generate report
// @route   POST /api/mental-health/analyze
// @access  Private
const analyzeMentalHealth = async (req, res) => {
  try {
    const { vitals, lifestyle, dass21, gad7, phq9 } = req.body;
    
    // ── Idempotency check ────────────────────────────────────────────────────
    // Reject if a report was already created for this user in the last 60 s.
    // This is the server-side safety net against duplicate submissions that
    // bypassed the frontend guard (back button, direct API call, race condition).
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentReport = await MentalHealthReport.findOne({
      user: req.user.id,
      createdAt: { $gte: sixtySecondsAgo }
    }).select('_id createdAt').lean();

    if (recentReport) {
      return res.status(409).json({
        success: false,
        message: 'A report was already generated moments ago. Please wait before submitting again.',
        reportId: recentReport._id
      });
    }

    // Validate required data
    if (!vitals || !dass21 || !gad7 || !phq9) {
      return res.status(400).json({
        success: false,
        message: 'Missing required assessment data'
      });
    }
    
    // Validate and normalize vitals data
    let processedVitals = {
      sleepDuration: normalizeNumber(vitals.sleepDuration),
      temperature: normalizeNumber(vitals.temperature)
    };

    if (processedVitals.sleepDuration === null) {
      return res.status(400).json({
        success: false,
        message: 'Missing required vitals data: sleepDuration'
      });
    }

    // Process and validate temperature (convert Fahrenheit to Celsius if needed)
    if (processedVitals.temperature !== null) {
      // If temperature seems to be in Fahrenheit (> 50), convert to Celsius
      if (processedVitals.temperature > 50) {
        processedVitals.temperature = ((processedVitals.temperature - 32) * 5) / 9;
        processedVitals.temperature = Math.round(processedVitals.temperature * 10) / 10; // Round to 1 decimal
      }
      
      // Validate temperature range (now in Celsius)
      if (processedVitals.temperature < 35 || processedVitals.temperature > 42) {
        return res.status(400).json({
          success: false,
          message: 'Temperature value is out of valid range'
        });
      }
    } else {
      delete processedVitals.temperature;
    }

    // Validate and normalize DASS-21 scores
    const normalizedDass21 = {
      depression: normalizeAssessmentScore(dass21.depression, ['normal', 'mild', 'moderate', 'severe']),
      anxiety: normalizeAssessmentScore(dass21.anxiety, ['normal', 'mild', 'moderate', 'severe']),
      stress: normalizeAssessmentScore(dass21.stress, ['normal', 'mild', 'moderate', 'severe'])
    };

    if (!normalizedDass21.depression || !normalizedDass21.anxiety || !normalizedDass21.stress) {
      return res.status(400).json({
        success: false,
        message: 'Invalid DASS-21 assessment data'
      });
    }

    // Validate and normalize GAD-7 scores
    const normalizedGad7 = normalizeAssessmentScore(gad7, ['normal', 'mild', 'moderate', 'severe']);
    if (!normalizedGad7) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GAD-7 assessment data'
      });
    }

    // Validate and normalize PHQ-9 scores
    const normalizedPhq9 = normalizeAssessmentScore(phq9, ['normal', 'minimal', 'mild', 'moderate', 'severe']);
    if (!normalizedPhq9) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PHQ-9 assessment data'
      });
    }

    const normalizedLifestyle = normalizeLifestyle(lifestyle || {});

    // Calculate overall risk level
    const overallRisk = calculateOverallRisk(normalizedDass21, normalizedGad7, normalizedPhq9);
    
    // Generate personalized recommendations
    const recommendations = generateRecommendations(
      normalizedDass21,
      normalizedGad7,
      normalizedPhq9,
      processedVitals,
      normalizedLifestyle
    );
    
    // Create mental health report
    const reportData = {
      user: req.user.id,
      vitals: processedVitals,
      lifestyle: normalizedLifestyle,
      dass21: normalizedDass21,
      gad7: normalizedGad7,
      phq9: normalizedPhq9,
      overallRisk,
      recommendations
    };
    
    console.log('Creating report with data:', JSON.stringify(reportData, null, 2));
    
    const report = await MentalHealthReport.create(reportData);
    
    // Populate user data for response
    await report.populate('user', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: 'Mental health analysis completed successfully',
      data: report
    });
    
  } catch (error) {
    console.error('Error analyzing mental health:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during analysis',
      error: error.message
    });
  }
};

// @desc    Get user's mental health reports
// @route   GET /api/mental-health/reports
// @access  Private
const getMentalHealthReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reports = await MentalHealthReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'firstName lastName email');
    
    const total = await MentalHealthReport.countDocuments({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get specific mental health report
// @route   GET /api/mental-health/reports/:id
// @access  Private
const getMentalHealthReport = async (req, res) => {
  try {
    const report = await MentalHealthReport.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'firstName lastName email');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
    
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Email mental health report
// @route   POST /api/mental-health/email-report
// @access  Private
const emailMentalHealthReport = async (req, res) => {
  try {
    const { reportId } = req.body;
    
    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }
    
    const report = await MentalHealthReport.findOne({
      _id: reportId,
      user: req.user.id
    }).populate('user', 'firstName lastName email');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Generate email content
    const emailContent = generateReportEmailContent(report);
    
    // Send email
    const emailResult = await sendEmail({
      to: report.user.email,
      subject: 'Your MindSpace Mental Health Report',
      html: emailContent
    });
    
    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Report sent to your email successfully'
      });
    } else {
      throw new Error('Failed to send email');
    }
    
  } catch (error) {
    console.error('Error emailing report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
};

// @desc    Save module progress for a user
// @route   POST /api/mental-health/progress
// @access  Private
const saveModuleProgress = async (req, res) => {
  try {
    const { module, data } = req.body;
    
    if (!module || typeof data === 'undefined') {
      return res.status(400).json({ 
        success: false, 
        message: 'Module and data required' 
      });
    }
    
    // Find or create profile document for user
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ 
        user: req.user.id, 
        moduleProgress: {} 
      });
    }
    
    // Initialize moduleProgress if it doesn't exist
    if (!profile.moduleProgress) {
      profile.moduleProgress = {};
    }
    
    // Save the module data
    profile.moduleProgress[module] = data;
    
    // Mark the field as modified (important for nested objects in Mongoose)
    profile.markModified('moduleProgress');
    
    await profile.save();
    
    res.json({ 
      success: true, 
      message: `${module} progress saved successfully`, 
      progress: profile.moduleProgress 
    });
    
  } catch (error) {
    console.error('Error saving module progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving progress',
      error: error.message 
    });
  }
};

// @desc    Get module progress for a user
// @route   GET /api/mental-health/progress
// @access  Private
const getModuleProgress = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    const progress = profile?.moduleProgress || {};
    
    res.json({ 
      success: true, 
      progress: progress 
    });
    
  } catch (error) {
    console.error('Error getting module progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching progress',
      error: error.message 
    });
  }
};

// @desc    Clear all module progress for a user
// @route   DELETE /api/mental-health/progress/clear
// @access  Private
const clearModuleProgress = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      profile.moduleProgress = {};
      profile.markModified('moduleProgress');
      await profile.save();
    }
    
    res.json({ 
      success: true, 
      message: 'Module progress cleared successfully'
    });
    
  } catch (error) {
    console.error('Error clearing module progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing progress',
      error: error.message 
    });
  }
};

// Helper function to calculate overall risk
function calculateOverallRisk(dass21, gad7, phq9) {
  const severeCount = [
    dass21.depression.severity,
    dass21.anxiety.severity,
    dass21.stress.severity,
    gad7.severity,
    phq9.severity
  ].filter(severity => severity === 'severe').length;
  
  const moderateCount = [
    dass21.depression.severity,
    dass21.anxiety.severity,
    dass21.stress.severity,
    gad7.severity,
    phq9.severity
  ].filter(severity => severity === 'moderate').length;
  
  if (severeCount >= 2) return 'severe';
  if (severeCount >= 1 || moderateCount >= 3) return 'high';
  if (moderateCount >= 1) return 'moderate';
  return 'low';
}

// Helper function to generate recommendations
function generateRecommendations(dass21, gad7, phq9, vitals, lifestyle) {
  const recommendations = [];
  
  // Depression recommendations
  if (dass21.depression.severity !== 'normal') {
    recommendations.push({
      category: 'Mental Health',
      title: 'Depression Management',
      description: 'Consider mindfulness meditation, regular exercise, and maintaining social connections. Professional counseling may be beneficial.',
      priority: dass21.depression.severity === 'severe' ? 'high' : 'medium'
    });
  }
  
  // Anxiety recommendations
  if (dass21.anxiety.severity !== 'normal' || gad7.severity !== 'normal') {
    recommendations.push({
      category: 'Mental Health',
      title: 'Anxiety Relief',
      description: 'Practice deep breathing exercises, progressive muscle relaxation, and consider limiting caffeine intake.',
      priority: (dass21.anxiety.severity === 'severe' || gad7.severity === 'severe') ? 'high' : 'medium'
    });
  }
  
  // Stress recommendations
  if (dass21.stress.severity !== 'normal') {
    recommendations.push({
      category: 'Mental Health',
      title: 'Stress Management',
      description: 'Implement time management techniques, take regular breaks, and engage in stress-reducing activities like yoga or nature walks.',
      priority: dass21.stress.severity === 'severe' ? 'high' : 'medium'
    });
  }
  
  // Sleep recommendations
  if (vitals.sleepDuration < 7 || vitals.sleepDuration > 9) {
    recommendations.push({
      category: 'Physical Health',
      title: 'Sleep Optimization',
      description: 'Aim for 7-9 hours of sleep per night. Establish a consistent bedtime routine and limit screen time before bed.',
      priority: 'medium'
    });
  }
  
  // Exercise recommendations
  if (!lifestyle.exerciseFrequency || lifestyle.exerciseFrequency === 'never' || lifestyle.exerciseFrequency === 'rarely') {
    recommendations.push({
      category: 'Physical Health',
      title: 'Physical Activity',
      description: 'Start with 30 minutes of moderate exercise 3-4 times per week. Even light walking can significantly improve mental health.',
      priority: 'medium'
    });
  }
  
  // Substance use recommendations
  if (lifestyle.smokingStatus && lifestyle.smokingStatus !== 'never') {
    recommendations.push({
      category: 'Lifestyle',
      title: 'Smoking Cessation',
      description: 'Consider smoking cessation programs. Quitting smoking can significantly improve both physical and mental health.',
      priority: 'high'
    });
  }
  
  // Screen time recommendations
  if (lifestyle.screenTime && lifestyle.screenTime > 8) {
    recommendations.push({
      category: 'Lifestyle',
      title: 'Digital Wellness',
      description: 'Consider reducing screen time and taking regular breaks. Excessive screen time can impact sleep and mental health.',
      priority: 'low'
    });
  }
  
  // Emergency recommendations for severe cases
  const hasSevereSymptoms = [
    dass21.depression.severity,
    dass21.anxiety.severity,
    dass21.stress.severity,
    gad7.severity,
    phq9.severity
  ].some(severity => severity === 'severe');
  
  if (hasSevereSymptoms) {
    recommendations.unshift({
      category: 'Emergency',
      title: 'Professional Support',
      description: 'Your assessment indicates severe symptoms. Please consider seeking immediate professional mental health support.',
      priority: 'high'
    });
  }
  
  return recommendations;
}

// Helper function to generate comprehensive email content
function generateReportEmailContent(report) {
  const date = new Date(report.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const isEmergency = report.overallRisk === 'severe' || report.overallRisk === 'high';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MindSpace Mental Health Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #242b38;
          background: #edf1f8;
          line-height: 1.5;
          padding: 16px 8px;
        }

        .email-container {
          max-width: 980px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #2350b8;
          box-shadow: 0 14px 34px rgba(11, 22, 44, 0.16);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(90deg, #c60d14 0%, #1e4fb6 100%);
          color: #ffffff;
          text-align: center;
          padding: 22px 16px 16px;
        }

        .header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 42px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .header .logo {
          font-size: 36px;
        }

        .header p {
          margin-top: 8px;
          font-size: 26px;
          font-weight: 500;
          opacity: 0.95;
        }

        .report-meta {
          background: #ece8f5;
          border-top: 1px solid #d8d2ea;
          border-bottom: 1px solid #d8d2ea;
          padding: 18px 20px 20px;
        }

        .report-meta h3 {
          font-size: 34px;
          font-weight: 800;
          color: #d92e2e;
          margin-bottom: 14px;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 24px;
        }

        .meta-item {
          min-height: 54px;
        }

        .meta-label {
          display: block;
          color: #2f66be;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .meta-value {
          color: #303846;
          font-size: 31px;
          font-weight: 500;
          word-break: break-word;
        }

        .meta-value.risk-value {
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 800;
        }

        .emergency-alert {
          background: #ef020b;
          color: #ffffff;
          text-align: center;
          padding: 18px 18px 20px;
          border-bottom: 1px solid #ca0108;
        }

        .emergency-alert h3 {
          font-size: 42px;
          line-height: 1.15;
          font-weight: 800;
        }

        .emergency-alert p {
          margin-top: 10px;
          font-size: 24px;
          line-height: 1.45;
          max-width: 920px;
          margin-left: auto;
          margin-right: auto;
        }

        .emergency-contacts {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .emergency-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          background: #ffffff;
          color: #d8000f;
          border: 1px solid #e5e7eb;
          border-radius: 2px;
          padding: 11px 20px;
          min-width: 235px;
          font-size: 22px;
          font-weight: 700;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }

        .content {
          background: #f5f6fa;
          padding: 14px 10px 8px;
        }

        .section {
          margin-bottom: 16px;
        }

        .section-title {
          color: #9f2051;
          font-size: 40px;
          line-height: 1.2;
          font-weight: 800;
          margin-bottom: 10px;
          padding: 0 10px;
        }

        .scores-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          padding: 0 10px;
        }

        .score-card {
          border-radius: 6px;
          text-align: center;
          color: #ffffff;
          padding: 12px 10px;
          min-height: 128px;
          background: linear-gradient(180deg, #f34545 0%, #e11f26 100%);
          box-shadow: 0 2px 8px rgba(155, 28, 28, 0.24);
        }

        .score-card.normal {
          background: linear-gradient(180deg, #1fb775 0%, #14935d 100%);
        }

        .score-card.minimal,
        .score-card.mild {
          background: linear-gradient(180deg, #f6a428 0%, #d47c00 100%);
        }

        .score-card.moderate {
          background: linear-gradient(180deg, #f88533 0%, #ea5f13 100%);
        }

        .score-card.severe {
          background: linear-gradient(180deg, #f24848 0%, #df1f26 100%);
        }

        .score-value {
          font-size: 51px;
          line-height: 1;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .score-label {
          font-size: 24px;
          line-height: 1.25;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .score-severity {
          font-size: 22px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .vitals-grid,
        .lifestyle-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          padding: 0 10px;
        }

        .vital-item {
          background: #c7d2df;
          border: 1px solid #d19ec8;
          border-radius: 2px;
          padding: 10px 10px;
          min-height: 112px;
        }

        .vital-label {
          color: #d41f8f;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .vital-value {
          color: #1e2533;
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 5px;
          line-height: 1.1;
        }

        .vital-status {
          display: inline-block;
          font-size: 20px;
          line-height: 1;
          font-weight: 800;
          padding: 5px 11px;
          border-radius: 16px;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }

        .vital-status.normal {
          background: #d8f5de;
          color: #1b6b33;
        }

        .vital-status.elevated {
          background: #ffe7ba;
          color: #975a00;
        }

        .vital-status.high {
          background: #ffd6d6;
          color: #982222;
        }

        .lifestyle-item {
          background: #c7e8e9;
          border-radius: 2px;
          padding: 10px;
          min-height: 88px;
        }

        .lifestyle-label {
          display: block;
          color: #d32020;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .lifestyle-value {
          color: #26313d;
          font-size: 30px;
          font-weight: 500;
          line-height: 1.25;
        }

        .recommendations {
          padding: 0 10px;
        }

        .recommendation-item {
          background: #f2f6ff;
          border-left: 4px solid #315fc6;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .recommendation-item.high {
          border-left-color: #de1e1e;
          background: #fff1f1;
        }

        .recommendation-item.medium {
          border-left-color: #df8700;
          background: #fff8eb;
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .recommendation-title {
          color: #253145;
          font-size: 16px;
          font-weight: 700;
        }

        .recommendation-category {
          color: #5f6f89;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 3px;
        }

        .recommendation-item p {
          color: #334155;
          font-size: 14px;
        }

        .priority-badge {
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 4px 8px;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        .priority-badge.high {
          background: #dc2626;
          color: #ffffff;
        }

        .priority-badge.medium {
          background: #f59e0b;
          color: #ffffff;
        }

        .priority-badge.low {
          background: #16a34a;
          color: #ffffff;
        }

        .footer {
          border-top: 1px solid #d6dce8;
          background: #f7f9fd;
          padding: 14px 14px 20px;
          text-align: center;
        }

        .disclaimer {
          border: 1px solid #f4da95;
          background: #fff7df;
          color: #785900;
          border-radius: 5px;
          padding: 10px;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .contact-info {
          color: #4e5c70;
          font-size: 13px;
          line-height: 1.45;
          margin-bottom: 10px;
        }

        .copyright {
          color: #64748b;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .social-links a {
          color: #2f66be;
          font-size: 12px;
          text-decoration: none;
          margin: 0 7px;
        }

        @media (max-width: 900px) {
          .header h1 {
            font-size: 34px;
          }

          .header p {
            font-size: 22px;
          }

          .report-meta h3,
          .section-title {
            font-size: 30px;
          }

          .meta-label {
            font-size: 20px;
          }

          .meta-value {
            font-size: 24px;
          }

          .scores-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .score-value {
            font-size: 40px;
          }

          .score-label {
            font-size: 18px;
          }

          .score-severity {
            font-size: 18px;
          }

          .vitals-grid,
          .lifestyle-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .vital-label,
          .lifestyle-label {
            font-size: 24px;
          }

          .vital-value,
          .lifestyle-value {
            font-size: 30px;
          }

          .vital-status {
            font-size: 16px;
          }
        }

        @media (max-width: 620px) {
          .header h1 {
            font-size: 28px;
            flex-direction: column;
            gap: 4px;
          }

          .header p {
            font-size: 18px;
          }

          .report-meta h3,
          .section-title,
          .emergency-alert h3 {
            font-size: 24px;
          }

          .emergency-alert p {
            font-size: 16px;
          }

          .meta-grid,
          .scores-grid,
          .vitals-grid,
          .lifestyle-grid {
            grid-template-columns: 1fr;
          }

          .meta-label {
            font-size: 17px;
          }

          .meta-value,
          .vital-value,
          .lifestyle-value {
            font-size: 22px;
          }

          .score-value {
            font-size: 36px;
          }

          .score-label {
            font-size: 16px;
          }

          .score-severity {
            font-size: 16px;
          }

          .vital-label,
          .lifestyle-label {
            font-size: 18px;
          }

          .emergency-btn {
            width: 100%;
            min-width: 0;
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>
            <span class="logo">🧠</span>
            MindSpace Mental Health Report
          </h1>
          <p>Comprehensive Mental Wellness Assessment</p>
        </div>
        
        <div class="content">
          <div class="report-meta">
            <h3>📋 Report Information</h3>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Patient Name</span>
                <span class="meta-value">${report.user.firstName} ${report.user.lastName}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Generated On</span>
                <span class="meta-value">${date}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Report ID</span>
                <span class="meta-value">${report._id}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Overall Risk Level</span>
                <span class="meta-value risk-value" style="color: ${getRiskColor(report.overallRisk)};">${report.overallRisk}</span>
              </div>
            </div>
          </div>
          
          ${isEmergency ? `
          <div class="emergency-alert">
            <h3>⚠️ Immediate Professional Support Recommended</h3>
            <p>Your assessment indicates significant mental health concerns that require immediate attention. Please consider reaching out to a mental health professional or crisis support service.</p>
            <div class="emergency-contacts">
              <a href="tel:9152987821" class="emergency-btn">📞 Crisis Helpline: 9152987821</a>
              <a href="tel:112" class="emergency-btn">🚨 Emergency: 112</a>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2 class="section-title">
              🧠 Mental Health Assessment Results
            </h2>
            <div class="scores-grid">
              <div class="score-card ${report.dass21.depression.severity}">
                <div class="score-value">${report.dass21.depression.score}</div>
                <div class="score-label">Depression (DASS-21)</div>
                <div class="score-severity">${report.dass21.depression.severity}</div>
              </div>
              <div class="score-card ${report.dass21.anxiety.severity}">
                <div class="score-value">${report.dass21.anxiety.score}</div>
                <div class="score-label">Anxiety (DASS-21)</div>
                <div class="score-severity">${report.dass21.anxiety.severity}</div>
              </div>
              <div class="score-card ${report.dass21.stress.severity}">
                <div class="score-value">${report.dass21.stress.score}</div>
                <div class="score-label">Stress (DASS-21)</div>
                <div class="score-severity">${report.dass21.stress.severity}</div>
              </div>
              <div class="score-card ${report.gad7.severity}">
                <div class="score-value">${report.gad7.score}</div>
                <div class="score-label">GAD-7 Assessment</div>
                <div class="score-severity">${report.gad7.severity}</div>
              </div>
              <div class="score-card ${report.phq9.severity}">
                <div class="score-value">${report.phq9.score}</div>
                <div class="score-label">PHQ-9 Assessment</div>
                <div class="score-severity">${report.phq9.severity}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">
              ❤️ Health Vitals Analysis
            </h2>
            <div class="vitals-grid">
              <div class="vital-item">
                <div class="vital-label">Blood Pressure</div>
                <div class="vital-value">${report.vitals.systolic}/${report.vitals.diastolic} mmHg</div>
                <span class="vital-status ${getVitalStatusClass('bp', report.vitals.systolic, report.vitals.diastolic)}">
                  ${getVitalStatusText('bp', report.vitals.systolic, report.vitals.diastolic)}
                </span>
              </div>
              <div class="vital-item">
                <div class="vital-label">Heart Rate</div>
                <div class="vital-value">${report.vitals.heartRate} BPM</div>
                <span class="vital-status ${getVitalStatusClass('hr', report.vitals.heartRate)}">
                  ${getVitalStatusText('hr', report.vitals.heartRate)}
                </span>
              </div>
              <div class="vital-item">
                <div class="vital-label">Sleep Duration</div>
                <div class="vital-value">${report.vitals.sleepDuration} hours</div>
                <span class="vital-status ${getVitalStatusClass('sleep', report.vitals.sleepDuration)}">
                  ${getVitalStatusText('sleep', report.vitals.sleepDuration)}
                </span>
              </div>
              ${report.vitals.temperature ? `
              <div class="vital-item">
                <div class="vital-label">Body Temperature</div>
                <div class="vital-value">${report.vitals.temperature}°F</div>
                <span class="vital-status normal">Normal</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          ${report.lifestyle ? `
          <div class="section">
            <h2 class="section-title">
              🏃 Lifestyle Summary
            </h2>
            <div class="lifestyle-grid">
              <div class="lifestyle-item">
                <span class="lifestyle-label">Exercise Frequency</span>
                <span class="lifestyle-value">${formatLifestyleValue(report.lifestyle.exerciseFrequency)}</span>
              </div>
              <div class="lifestyle-item">
                <span class="lifestyle-label">Smoking Status</span>
                <span class="lifestyle-value">${formatLifestyleValue(report.lifestyle.smokingStatus)}</span>
              </div>
              <div class="lifestyle-item">
                <span class="lifestyle-label">Alcohol Consumption</span>
                <span class="lifestyle-value">${formatLifestyleValue(report.lifestyle.alcoholConsumption)}</span>
              </div>
              ${report.lifestyle.screenTime ? `
              <div class="lifestyle-item">
                <span class="lifestyle-label">Daily Screen Time</span>
                <span class="lifestyle-value">${report.lifestyle.screenTime} hours</span>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2 class="section-title">
              💡 Personalized Recommendations
            </h2>
            <div class="recommendations">
              ${report.recommendations && report.recommendations.length > 0 ? 
                report.recommendations.map(rec => `
                  <div class="recommendation-item ${rec.priority}">
                    <div class="recommendation-header">
                      <span class="recommendation-title">${rec.title}</span>
                      <span class="priority-badge ${rec.priority}">${rec.priority} priority</span>
                    </div>
                    <div class="recommendation-category">${rec.category}</div>
                    <p>${rec.description}</p>
                  </div>
                `).join('') : 
                '<p style="text-align: center; color: #64748b; font-style: italic;">No specific recommendations at this time. Continue monitoring your mental health regularly.</p>'
              }
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-content">
            <div class="disclaimer">
              <strong>⚠️ Important Disclaimer:</strong> This report is generated by MindSpace AI system and is for informational purposes only. It should not be considered as a substitute for professional medical advice, diagnosis, or treatment. Please consult with a qualified healthcare professional for proper evaluation and treatment.
            </div>
            
            <div class="contact-info">
              <p><strong>Need Support?</strong></p>
              <p>📧 Email: support@mindspace.edu</p>
              <p>📞 Helpline: 9152987821 (24/7)</p>
              <p>🚨 Emergency: 112</p>
            </div>
            
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} MindSpace. All rights reserved.<br>
              This email was sent to ${report.user.email} as part of your mental health assessment.
            </p>
            
            <div class="social-links">
              <a href="https://www.mindspace.gu-saurabh.site/policy.html">Privacy Policy</a>
              <a href="https://www.mindspace.gu-saurabh.site/terms.html">Terms of Service</a>
              <a href="mailto:support@mindspace.edu?subject=MindSpace%20Email%20Preferences">Email Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper functions for email styling
function getRiskColor(risk) {
  const colors = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#f97316',
    severe: '#ef4444'
  };
  return colors[risk] || '#64748b';
}

function getVitalStatusClass(type, value1, value2) {
  switch (type) {
    case 'bp':
      if (value1 < 120 && value2 < 80) return 'normal';
      if (value1 < 140 && value2 < 90) return 'elevated';
      return 'high';
    case 'hr':
      if (value1 >= 60 && value1 <= 100) return 'normal';
      return 'elevated';
    case 'sleep':
      if (value1 >= 7 && value1 <= 9) return 'normal';
      return 'elevated';
    default:
      return 'normal';
  }
}

function getVitalStatusText(type, value1, value2) {
  switch (type) {
    case 'bp':
      if (value1 < 120 && value2 < 80) return 'Normal';
      if (value1 < 140 && value2 < 90) return 'Elevated';
      return 'High';
    case 'hr':
      if (value1 >= 60 && value1 <= 100) return 'Normal';
      return 'Abnormal';
    case 'sleep':
      if (value1 >= 7 && value1 <= 9) return 'Optimal';
      return 'Poor';
    default:
      return 'Normal';
  }
}

function formatLifestyleValue(value) {
  if (!value) return 'Not specified';
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/([A-Z])/g, ' $1');
}

// @desc    Download mental health report as PDF
// @route   GET /api/mental-health/reports/:id/pdf
// @access  Private
const downloadReportPDF = async (req, res) => {
  try {
    // This endpoint is deprecated - PDF generation is now handled client-side
    // Redirect to get the report data instead
    const report = await MentalHealthReport.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'firstName lastName email');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Return the report data for client-side PDF generation
    res.status(200).json({
      success: true,
      data: report,
      message: 'Report data retrieved for PDF generation'
    });
    
  } catch (error) {
    console.error('Error retrieving report for PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve report data'
    });
  }
};

module.exports = {
  analyzeMentalHealth,
  getMentalHealthReports,
  getMentalHealthReport,
  emailMentalHealthReport,
  downloadReportPDF,
  saveModuleProgress,
  getModuleProgress,
  clearModuleProgress
};

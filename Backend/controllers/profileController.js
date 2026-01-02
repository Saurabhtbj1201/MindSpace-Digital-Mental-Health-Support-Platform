const User = require('../models/User');
const Profile = require('../models/Profile');
const { sendSuccess, sendError, handleError, sendNotFound } = require('../utils/responseHandler');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        // Find profile by user ID
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'firstName lastName email dob');
        
        if (!profile) {
            // If no profile exists, return basic user data
            const user = await User.findById(req.user.id).select('-password');
            return sendSuccess(res, 200, {
                profile: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    dob: user.dob
                }
            }, 'Profile not found, returning basic user data');
        }

        return sendSuccess(res, 200, { profile });
    } catch (error) {
        return handleError(res, error, 'fetching profile');
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const profileData = { ...req.body };
        
        // Remove user field if it exists in the request body
        delete profileData.user;
        
        // Add user ID to profile data
        profileData.user = req.user.id;
        
        // Check if profile exists
        let profile = await Profile.findOne({ user: req.user.id });
        
        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            profile = await Profile.create(profileData);
        }

        // Update user basic info if provided
        const userUpdateData = {};
        if (profileData.firstName) userUpdateData.firstName = profileData.firstName;
        if (profileData.lastName) userUpdateData.lastName = profileData.lastName;
        
        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(req.user.id, userUpdateData);
        }

        return sendSuccess(res, 200, { profile, userData: userUpdateData }, 'Profile updated successfully');
    } catch (error) {
        return handleError(res, error, 'updating profile');
    }
};

// @desc    Delete user profile
// @route   DELETE /api/user/profile
// @access  Private
const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({ user: req.user.id });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get profile completion status
// @route   GET /api/user/profile/completion
// @access  Private
const getProfileCompletion = async (req, res) => {
    try {
        console.log('Checking profile completion for user:', req.user.id);
        
        // Get user and profile data
        const user = await User.findById(req.user.id).select('-password');
        const profile = await Profile.findOne({ user: req.user.id });
        
        if (!user) {
            return sendNotFound(res, 'User not found');
        }

        console.log('User found:', user.email);
        console.log('Profile found:', !!profile);

        // Define required fields for profile completion with proper scoring
        const requiredFields = {
            // Basic user info (from User model) - High priority
            firstName: { value: user.firstName, weight: 2 },
            lastName: { value: user.lastName, weight: 2 },
            email: { value: user.email, weight: 2 },
            dob: { value: user.dob, weight: 2 },
            
            // Essential profile fields (from Profile model) - High priority
            gender: { value: profile?.gender, weight: 2 },
            bloodGroup: { value: profile?.bloodGroup, weight: 1 },
            height: { value: profile?.height, weight: 1 },
            weight: { value: profile?.weight, weight: 1 },
            district: { value: profile?.district, weight: 2 },
            state: { value: profile?.state, weight: 2 },
            
            // Academic fields - Medium priority
            currentStatus: { value: profile?.currentStatus, weight: 2 },
            collegeName: { value: profile?.collegeName, weight: 1 },
            courseName: { value: profile?.courseName, weight: 1 },
            
            // Health fields - High priority for mental health analysis
            sleepPattern: { value: profile?.sleepPattern, weight: 2 },
            exerciseHabit: { value: profile?.exerciseHabit, weight: 1 },
            mentalHealthCondition: { value: profile?.mentalHealthCondition, weight: 2 }
        };

        // Calculate weighted completion
        let totalWeight = 0;
        let completedWeight = 0;
        const missingFields = [];

        Object.keys(requiredFields).forEach(key => {
            const field = requiredFields[key];
            const fieldValue = field.value;
            const weight = field.weight;
            
            totalWeight += weight;
            
            if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
                completedWeight += weight;
            } else {
                missingFields.push(key);
            }
        });

        // Calculate completion percentage
        const completionPercentage = Math.round((completedWeight / totalWeight) * 100);
        
        // Profile is considered complete if 70% or more weighted completion
        const isComplete = completionPercentage >= 70;

        console.log('Profile completion details:', {
            completionPercentage,
            isComplete,
            totalWeight,
            completedWeight,
            missingFields: missingFields.length
        });

        return sendSuccess(res, 200, {
            isComplete,
            completionPercentage,
            completedFields: Object.keys(requiredFields).length - missingFields.length,
            totalFields: Object.keys(requiredFields).length,
            missingFields // For debugging purposes
        }, isComplete ? 'Profile is complete' : 'Profile needs more information');

    } catch (error) {
        return handleError(res, error, 'checking profile completion');
    }
};

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    getProfileCompletion
};
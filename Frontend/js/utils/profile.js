/**
 * Profile Management Utility Functions
 * Centralized profile management logic to reduce code duplication
 */

/**
 * Get user initials from first and last name
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} - Returns initials (e.g., "AB") or "U" as default
 */
function getUserInitials(firstName = '', lastName = '') {
    const initials = ((firstName || '').charAt(0) + (lastName || '').charAt(0)).toUpperCase();
    return initials || 'U';
}

/**
 * Update profile information in header
 * @param {Object} userData - User data object containing firstName, lastName, etc.
 * @param {Object} options - Optional configuration object
 * @param {string} options.usernameElementId - ID of username element (default: 'header-username')
 * @param {string} options.avatarElementId - ID of avatar element (default: 'header-avatar')
 */
function updateProfileInfo(userData, options = {}) {
    const {
        usernameElementId = 'header-username',
        avatarElementId = 'header-avatar'
    } = options;
    
    if (!userData) return;
    
    const firstName = userData.firstName || 'User';
    const initials = getUserInitials(userData.firstName, userData.lastName);
    
    // Update header username
    const usernameElement = document.getElementById(usernameElementId);
    if (usernameElement) {
        usernameElement.textContent = firstName;
    }
    
    // Update header avatar
    const avatarElement = document.getElementById(avatarElementId);
    if (avatarElement) {
        avatarElement.textContent = initials;
    }
}

/**
 * Setup profile dropdown toggle functionality
 * @param {Object} options - Optional configuration object
 * @param {string} options.triggerElementId - ID of trigger element (default: 'profile-trigger')
 * @param {string} options.dropdownElementId - ID of dropdown element (default: 'profile-dropdown')
 */
function setupProfileDropdown(options = {}) {
    const {
        triggerElementId = 'profile-trigger',
        dropdownElementId = 'profile-dropdown'
    } = options;
    
    const profileTrigger = document.getElementById(triggerElementId);
    const profileDropdown = document.getElementById(dropdownElementId);
    
    if (!profileTrigger || !profileDropdown) return;
    
    // Toggle dropdown on click
    profileTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!profileTrigger.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

/**
 * Initialize user profile in header (combines updateProfileInfo and setupProfileDropdown)
 * @param {Object} options - Optional configuration object
 */
function initializeUserProfile(options = {}) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    updateProfileInfo(userData, options);
    setupProfileDropdown(options);
}

/**
 * Mood emoji mapping
 */
const MOOD_EMOJIS = {
    'Angry': '😠',
    'Disgust': '🤢',
    'Fear': '😨',
    'Happy': '😄',
    'Neutral': '😐',
    'Sad': '😢',
    'Surprise': '😲'
};

/**
 * Get mood emoji by mood label
 * @param {string} moodLabel - Mood label (e.g., 'Happy', 'Sad')
 * @param {string} defaultEmoji - Default emoji if mood not found (default: '📊')
 * @returns {string} - Returns emoji for the mood
 */
function getMoodEmoji(moodLabel, defaultEmoji = '📊') {
    return MOOD_EMOJIS[moodLabel] || defaultEmoji;
}

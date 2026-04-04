(function () {
    const LOGIN_REDIRECT_FLAG_KEY = 'mindspace_open_login_dialog';
    const LOGIN_REDIRECT_MESSAGE_KEY = 'mindspace_login_required_message';

    const publicNav = [
        { href: 'index.html', label: 'Home' },
        { href: 'AI-support.html', label: 'AI-Support' },
        { href: 'mental-home.html', label: 'Mental Health' },
        { href: 'appointment.html', label: 'Appointment' },
        { href: 'mood.html', label: 'Mood Tracker' },
        { href: 'resources.html', label: 'Resources' }
    ];

    const privateNav = [
        { href: 'index.html', label: 'Home' },
        { href: 'dashboard.html', label: 'Dashboard' },
        { href: 'AI-support.html', label: 'AI-Support' },
        { href: 'mental-home.html', label: 'Mental Health' },
        { href: 'appointment.html', label: 'Appointment' },
        { href: 'mood.html', label: 'Mood Tracker' },
        { href: 'resources.html', label: 'Resources' }
    ];

    function isLoggedIn() {
        return Boolean(localStorage.getItem('authToken'));
    }

    function currentPageName() {
        const page = window.location.pathname.split('/').pop();
        return page || 'index.html';
    }

    function isActive(href) {
        const current = currentPageName();
        if (href === 'index.html') {
            return current === '' || current === 'index.html';
        }
        return href === current;
    }

    function safeJsonParse(value) {
        try {
            return JSON.parse(value || '{}');
        } catch (error) {
            return {};
        }
    }

    function openLoginPromptModal(message) {
        const promptMessage = message || 'Please login to continue.';
        if (typeof showInfo === 'function') {
            showInfo(promptMessage);
        }

        const hasNativeLoginDialog = document.getElementById('login-dialog') && typeof toggleDialog === 'function';
        if (hasNativeLoginDialog) {
            localStorage.removeItem(LOGIN_REDIRECT_FLAG_KEY);
            localStorage.removeItem(LOGIN_REDIRECT_MESSAGE_KEY);
            toggleDialog('login-dialog', true);
            return;
        }

        localStorage.setItem(LOGIN_REDIRECT_FLAG_KEY, 'true');
        localStorage.setItem(LOGIN_REDIRECT_MESSAGE_KEY, promptMessage);
        window.location.href = 'index.html?openLogin=1';
    }

    function requireAuth(message) {
        if (isLoggedIn()) {
            return true;
        }
        openLoginPromptModal(message || 'Please login to continue.');
        return false;
    }

    function renderNavigation() {
        const navContainer = document.querySelector('.nav-links');
        if (!navContainer) {
            return;
        }

        const links = isLoggedIn() ? privateNav : publicNav;
        navContainer.innerHTML = links
            .map((link) => `<li><a href="${link.href}" ${isActive(link.href) ? 'class="active"' : ''}>${link.label}</a></li>`)
            .join('');
    }

    function updateHeaderAuthState() {
        const authButtonsContainer = document.querySelector('.auth-buttons-container');
        const profileDropdownContainer = document.querySelector('.user-profile-dropdown');

        if (!isLoggedIn()) {
            if (authButtonsContainer) {
                authButtonsContainer.style.display = 'block';
            }
            if (profileDropdownContainer) {
                profileDropdownContainer.style.display = 'none';
            }
            return;
        }

        if (authButtonsContainer) {
            authButtonsContainer.style.display = 'none';
        }
        if (profileDropdownContainer) {
            profileDropdownContainer.style.display = 'block';
        }

        const userData = safeJsonParse(localStorage.getItem('userData'));
        const firstName = (userData.firstName || 'User').trim();
        const lastName = (userData.lastName || '').trim();
        const initials = ((firstName.charAt(0) || 'U') + (lastName.charAt(0) || '')).toUpperCase();

        const headerUsername = document.getElementById('header-username');
        const headerAvatar = document.getElementById('header-avatar');

        if (headerUsername) {
            headerUsername.textContent = firstName || 'User';
        }
        if (headerAvatar) {
            headerAvatar.textContent = initials || 'U';
        }
    }

    function setupHeaderButtons() {
        const loginButton = document.querySelector('.auth-buttons-container .btn-secondary');
        const registerButton = document.querySelector('.auth-buttons-container .btn-primary');
        const moodTrackerButton = document.querySelector('.mood-tracker-btn');

        if (loginButton && loginButton.dataset.bound !== 'true') {
            loginButton.dataset.bound = 'true';
            loginButton.addEventListener('click', function () {
                openLoginPromptModal('Please login to continue.');
            });
        }

        if (registerButton && registerButton.dataset.bound !== 'true') {
            registerButton.dataset.bound = 'true';
            registerButton.addEventListener('click', function () {
                const hasNativeRegisterDialog = document.getElementById('register-dialog') && typeof toggleDialog === 'function';
                if (hasNativeRegisterDialog) {
                    toggleDialog('register-dialog', true);
                    return;
                }
                openLoginPromptModal('Create an account or login to continue.');
            });
        }

        if (moodTrackerButton && moodTrackerButton.dataset.bound !== 'true') {
            moodTrackerButton.dataset.bound = 'true';
            moodTrackerButton.addEventListener('click', function (event) {
                event.preventDefault();
                if (!requireAuth('Please login to use Mood Tracker.')) {
                    return;
                }
                window.location.href = 'mood.html';
            });
        }
    }

    function setupProfileDropdown() {
        const profileTrigger = document.getElementById('profile-trigger');
        const profileDropdown = document.getElementById('profile-dropdown');
        const logoutButton = document.getElementById('logout-btn');

        if (profileTrigger && profileDropdown && profileTrigger.dataset.bound !== 'true') {
            profileTrigger.dataset.bound = 'true';
            profileTrigger.addEventListener('click', function (event) {
                event.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', function (event) {
                if (!profileTrigger.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        if (logoutButton && logoutButton.dataset.bound !== 'true') {
            logoutButton.dataset.bound = 'true';
            logoutButton.addEventListener('click', function (event) {
                event.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('justLoggedIn');
                localStorage.removeItem('ai_conversation_history');

                if (typeof showSuccess === 'function') {
                    showSuccess('Logged out successfully!');
                }

                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 500);
            });
        }
    }

    function initializeCommonHeader() {
        renderNavigation();
        updateHeaderAuthState();
        setupHeaderButtons();
        setupProfileDropdown();
    }

    window.requireAuth = requireAuth;
    window.openLoginPromptModal = openLoginPromptModal;
    window.refreshCommonHeader = initializeCommonHeader;

    document.addEventListener('DOMContentLoaded', initializeCommonHeader);
})();

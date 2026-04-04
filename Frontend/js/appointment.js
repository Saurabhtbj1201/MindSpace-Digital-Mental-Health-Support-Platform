// Globals
let selectedSpecialist = null;
let selectedDate = null;
let selectedTime = null;
let selectedSessionType = 'Video';

function isUserLoggedIn() {
    return Boolean(localStorage.getItem('authToken'));
}

function requireBookingLogin(message) {
    if (isUserLoggedIn()) {
        return true;
    }

    if (typeof window.requireAuth === 'function') {
        window.requireAuth(message || 'Login to continue.');
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    // Load specialists
    loadSpecialists();

    // Set min date to today
    const dateInput = document.getElementById('appointment-date');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.addEventListener('change', (e) => {
            selectedDate = e.target.value;
            checkStep2Completion();
        });
    }

    // Time slot selection
    const timeSlots = document.querySelectorAll('.slot-btn');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedTime = e.target.dataset.time;
            checkStep2Completion();
        });
    });

    // Session type selection
    const sessionRadios = document.querySelectorAll('input[name="sessionType"]');
    sessionRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedSessionType = e.target.value;
            updateSummary();
        });
    });

    // Next step handling
    document.getElementById('btn-to-step-3')?.addEventListener('click', () => {
        populateSummary();
        goToStep(3);
    });

    // Handle form submission
    document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmit);

    // Setup Carousel Buttons
    setupCarousel();

    const authToken = localStorage.getItem('authToken');

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData && userData.firstName) {
        const headerUsername = document.getElementById('header-username');
        const headerAvatar = document.getElementById('header-avatar');
        if (headerUsername) headerUsername.textContent = userData.firstName;
        if (headerAvatar) headerAvatar.textContent = userData.firstName.charAt(0).toUpperCase();
    }

    // Header interactions are managed centrally by common-auth.js.
});

function setupCarousel() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const container = document.getElementById('specialists-container');

    if (prevBtn && nextBtn && container) {
        let scrollAmount = 0;
        const scrollStep = 370; // card width + gap
        
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        });
    }
}

async function loadSpecialists() {
    if (!isUserLoggedIn()) {
        const container = document.getElementById('specialists-container');
        if (container) {
            container.innerHTML = `
                <div class="empty-state" style="width: 100%; text-align: center; padding: 30px;">
                    <i class="fas fa-lock" style="font-size: 28px; margin-bottom: 10px;"></i>
                    <h3>Login Required</h3>
                    <p>Please login to view specialists and book an appointment.</p>
                </div>
            `;
        }
        return;
    }

    try {
        const apiUrl = window.ENV_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/appointments/specialists`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderSpecialists(data.specialists);
        }
    } catch (error) {
        console.error('Error fetching specialists:', error);
    }
}

function renderSpecialists(specialists) {
    const container = document.getElementById('specialists-container');
    if (!container) return;

    container.innerHTML = '';
    
    specialists.forEach(sp => {
        const card = document.createElement('div');
        card.className = 'specialist-card';
        card.innerHTML = `
            <div class="sp-header">
                <img src="${sp.image}" alt="${sp.name}" class="sp-img">
                <div class="sp-info">
                    <h3>${sp.name} <i class="fas fa-check-circle" style="color: #366764; font-size: 0.8rem;"></i></h3>
                    <p>${sp.specialty}</p>
                    <div class="sp-rating">
                        <i class="fas fa-star" style="color: #FFD700;"></i> ${sp.rating} (${sp.reviews} reviews)
                    </div>
                </div>
            </div>
            <p class="sp-desc">"${sp.description}"</p>
            <div class="sp-actions">
                <div class="sp-price">₹${sp.price}<span>/hr</span></div>
                <button class="btn-primary" onclick="selectSpecialist('${sp.id}')">Select Profile</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function selectSpecialist(id) {
    if (!requireBookingLogin('Login to book an appointment.')) {
        return;
    }

    // In a real app, find specialist from cached list
    try {
        const apiUrl = window.ENV_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/appointments/specialists`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const data = await response.json();
        selectedSpecialist = data.specialists.find(s => s.id === id);
        
        if (selectedSpecialist) {
            goToStep(2);
        }
    } catch (error) {
        console.error('Error selecting specialist:', error);
    }
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    
    // Show target step
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update indicators
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    for (let i = 1; i <= step; i++) {
        document.getElementById(`step-${i}-indicator`)?.classList.add('active');
    }
}

function checkStep2Completion() {
    const btn = document.getElementById('btn-to-step-3');
    if (selectedDate && selectedTime && selectedSpecialist) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function populateSummary() {
    updateSummary();
    
    // Pre-fill user data if available
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.firstName || userData.lastName) {
        document.getElementById('patient-name').value = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }
    if (userData.email) {
        document.getElementById('patient-email').value = userData.email;
    }
}

function updateSummary() {
    document.getElementById('summary-therapist').textContent = selectedSpecialist?.name || '--';
    
    let dtStr = '--';
    if (selectedDate && selectedTime) {
        const d = new Date(selectedDate);
        dtStr = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${selectedTime}`;
    }
    document.getElementById('summary-datetime').textContent = dtStr;
    document.getElementById('summary-session').textContent = `${selectedSessionType} Consultation`;
    document.getElementById('summary-price').textContent = `₹${selectedSpecialist?.price || '0'}.00`;
}

async function handleBookingSubmit(e) {
    e.preventDefault();

    if (!requireBookingLogin('Login to confirm and book your appointment.')) {
        return;
    }
    
    const name = document.getElementById('patient-name').value;
    const email = document.getElementById('patient-email').value;
    const concern = document.getElementById('patient-concern').value;
    
    const btn = document.getElementById('confirm-booking');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    const payload = {
        specialistId: selectedSpecialist.id,
        patientName: name,
        patientEmail: email,
        date: selectedDate,
        time: selectedTime,
        sessionType: selectedSessionType,
        concern: concern
    };

    try {
        const apiUrl = window.ENV_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/appointments/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showConfirmation(data.appointment);
        } else {
            alert('Failed to book appointment: ' + data.message);
            btn.disabled = false;
            btn.textContent = 'Confirm and Book';
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('An error occurred during booking.');
        btn.disabled = false;
        btn.textContent = 'Confirm and Book';
    }
}

function showConfirmation(appointment) {
    document.getElementById('booking-flow').style.display = 'none';
    document.getElementById('confirmation-view').style.display = 'block';

    document.getElementById('conf-apt-number').textContent = appointment.appointmentNumber || appointment._id;
    document.getElementById('conf-therapist-img').src = appointment.specialist.image;
    document.getElementById('conf-therapist').textContent = appointment.specialist.name;
    document.getElementById('conf-date').textContent = new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('conf-time').textContent = appointment.time;
    document.getElementById('conf-session-type').textContent = `${appointment.sessionType} Consultation`;
}

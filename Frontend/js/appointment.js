        // Global variables - declared only once
        let specialists = [];
        let selectedSpecialist = null;
        let selectedDate = null;
        let selectedTime = null;
        let selectedCounselingType = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            fetchSpecialists();
            setupEventListeners();
            generateDates();
            fetchAppointments(); // Add this line
        });

        // Fetch specialists from backend
        async function fetchSpecialists() {
            try {
                console.log('Fetching specialists from backend...');
                console.log('Backend URL: http://localhost:5001/api/admin/specialists');

                const response = await fetch('http://localhost:5001/api/admin/specialists', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors'
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data);

                if (data.success && data.specialists) {
                    specialists = data.specialists;
                    console.log('Specialists loaded:', specialists.length);
                    populateSpecialists();
                } else {
                    console.error('Failed to fetch specialists:', data.message);
                    showFallbackSpecialists();
                }
            } catch (error) {
                console.error('Error fetching specialists:', error);
                showFallbackSpecialists();
            }
        }

        // Enhanced fallback function with better sample data

        function populateSpecialists() {
            const grid = document.getElementById('specialistsGrid');

            if (specialists.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-500);">
                        <i class="fas fa-user-md" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No Specialists Available</h3>
                        <p>Please check back later or contact support.</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = specialists.map((specialist, index) => {
                const availableSlots = specialist.availability ?
                    Object.values(specialist.availability).reduce((acc, day) =>
                        acc + day.filter(slot => slot.available).length, 0
                    ) : 0;

                // Create specialty filter attribute
                const specialtyFilter = specialist.specialty.toLowerCase()
                    .replace(/ & /g, ' ')
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z\-]/g, '');

                return `
                    <div class="specialist-card" data-id="${specialist.id}" data-specialty="${specialtyFilter}">
                        <div class="specialist-header">
                            <div class="avatar">${specialist.avatar}</div>
                            <div class="specialist-info">
                                <h3>Dr. ${specialist.name}</h3>
                                <div class="specialist-role">
                                    <i class="fas fa-user-md"></i>
                                    ${specialist.role}
                                </div>
                            </div>
                        </div>
                        <div class="specialist-specialty">${specialist.specialty}</div>
                        <p class="specialist-bio">${specialist.bio}</p>
                        <div class="specialist-stats">
                            <div class="stat-item">
                                <div class="stat-number">${specialist.experience}+</div>
                                <div class="stat-label">Years Exp</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${specialist.rating}</div>
                                <div class="stat-label">Rating</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${specialist.reviews}</div>
                                <div class="stat-label">Reviews</div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem; padding: 0.75rem; background: var(--gray-50); border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-globe" style="color: var(--primary-blue); font-size: 0.9rem;"></i>
                                <span style="font-weight: 600; color: var(--gray-700); font-size: 0.85rem;">Languages:</span>
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.85rem;">${specialist.languages}</div>
                        </div>
                        <div class="availability-badge">
                            <i class="fas fa-calendar-check"></i>
                            ${availableSlots} slots available this week
                        </div>
                    </div>
                `;
            }).join('');
        }

        function generateWeeklyAvailability(specialistId) {
            const availability = {};
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() + 1);

            days.forEach((day, index) => {
                const date = new Date(baseDate);
                date.setDate(baseDate.getDate() + index);
                const dateKey = date.toISOString().split('T')[0];

                const slots = [
                    '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM',
                    '03:30 PM', '05:00 PM', '06:30 PM'
                ];

                availability[dateKey] = slots.map(slot => ({
                    time: slot,
                    date: dateKey,
                    day: day,
                    available: Math.random() > 0.25
                }));
            });

            return availability;
        }

        function setupEventListeners() {
            // Filter functionality
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const filter = this.dataset.filter;
                    filterSpecialists(filter);
                });
            });

            // Specialist selection
            document.getElementById('specialistsGrid').addEventListener('click', function(e) {
                if (e.target.closest('.specialist-card')) {
                    const card = e.target.closest('.specialist-card');
                    const specialistId = parseInt(card.dataset.id);

                    document.querySelectorAll('.specialist-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');

                    selectedSpecialist = specialists.find(s => s.id === specialistId);
                    updateBookingSidebar();
                    updateTimeSlots();
                }
            });

            // Date selection
            document.getElementById('datePicker').addEventListener('change', function(e) {
                selectedDate = e.target.value;
                selectedTime = null;
                updateTimeSlots();
                updateBookingSummary();
            });

            // Counseling type selection
            document.getElementById('counselingType').addEventListener('change', function(e) {
                selectedCounselingType = e.target.value;
                updateBookingSummary();
            });

            // Time slot selection
            document.getElementById('timeSlots').addEventListener('click', function(e) {
                if (e.target.classList.contains('time-slot') && e.target.classList.contains('available')) {
                    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
                    e.target.classList.add('selected');
                    selectedTime = e.target.dataset.time;
                    updateBookingSummary();
                }
            });

            // Book button
            document.getElementById('bookBtn').addEventListener('click', showConfirmationModal);

            // Modal interactions
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('confirmationModal').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });

            document.getElementById('bookingForm').addEventListener('submit', handleBooking);
        }

        function filterSpecialists(filter) {
            const cards = document.querySelectorAll('.specialist-card');
            cards.forEach((card, index) => {
                const specialty = card.dataset.specialty;
                if (filter === 'all' || specialty.includes(filter)) {
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        }

        function generateDates() {
            const datePicker = document.getElementById('datePicker');
            const today = new Date();

            // Add next 7 days
            for (let i = 1; i <= 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dateString = date.toISOString().split('T')[0];
                const dateDisplay = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                const option = document.createElement('option');
                option.value = dateString;
                option.textContent = dateDisplay;
                datePicker.appendChild(option);
            }
        }

        function updateBookingSidebar() {
            const selectedDiv = document.getElementById('selectedSpecialist');
            if (selectedSpecialist) {
                selectedDiv.classList.add('show');
                document.getElementById('selectedAvatar').textContent = selectedSpecialist.avatar;
                document.getElementById('selectedName').textContent = selectedSpecialist.name;
                document.getElementById('selectedRole').innerHTML = `
                    <i class="fas fa-stethoscope" style="color: var(--primary-blue);"></i>
                    ${selectedSpecialist.role}
                `;
                document.getElementById('bookBtn').disabled = false;
            } else {
                selectedDiv.classList.remove('show');
                document.getElementById('bookBtn').disabled = true;
            }
        }

        function updateTimeSlots() {
            const timeSlotsContainer = document.getElementById('timeSlots');
            const datePickerValue = document.getElementById('datePicker').value;

            if (!selectedSpecialist || !datePickerValue) {
                timeSlotsContainer.innerHTML = `
                    <div style="text-align: center; color: var(--gray-400); padding: 2.5rem; font-style: italic;">
                        <i class="fas fa-user-clock" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5; display: block;"></i>
                        <div style="font-size: 0.9rem;">Select a specialist to view available times</div>
                    </div>
                `;
                return;
            }

            const daySlots = selectedSpecialist.availability[datePickerValue] || [];
            timeSlotsContainer.innerHTML = daySlots.map((slot, index) => {
                const isSelected = selectedTime === slot.time;
                let classes = 'time-slot';
                if (!slot.available) classes += ' booked';
                else classes += ' available';
                if (isSelected) classes += ' selected';

                return `
                    <button class="${classes}" data-time="${slot.time}" ${!slot.available ? 'disabled' : ''}
                            style="animation-delay: ${index * 0.1}s;">
                        ${slot.time}
                    </button>
                `;
            }).join('');

            if (daySlots.length === 0) {
                timeSlotsContainer.innerHTML = `
                    <div style="text-align: center; color: var(--gray-400); padding: 2.5rem;">
                        <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5; display: block;"></i>
                        <div style="font-size: 0.9rem;">No Availability</div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">Please select another date</div>
                    </div>
                `;
            }
        }

        function updateBookingSummary() {
            const timeDisplay = document.getElementById('selectedTimeSlot');
            const bookBtn = document.getElementById('bookBtn');

            if (selectedSpecialist && selectedDate && selectedTime && selectedCounselingType) {
                const dateObj = new Date(selectedDate);
                const dateName = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short'
                });
                timeDisplay.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--success-green); margin-right: 0.5rem;"></i>
                    ${selectedTime} • ${dateName} • ${getCounselingTypeLabel(selectedCounselingType)}
                `;
                bookBtn.innerHTML = `
                    <i class="fas fa-lock"></i>
                    Confirm Session - ₹1,500
                `;
                bookBtn.disabled = false;
            } else {
                timeDisplay.innerHTML = `
                    <i class="fas fa-clock" style="color: var(--gray-400); margin-right: 0.5rem;"></i>
                    Select your preferred time and type
                `;
                bookBtn.innerHTML = `
                    <i class="fas fa-calendar-plus"></i>
                    Choose Your Slot
                `;
                bookBtn.disabled = true;
            }
        }

        function getCounselingTypeLabel(type) {
            const types = {
                'video-call': 'Video Call',
                'phone-call': 'Phone Call',
                'in-office': 'In-Office'
            };
            return types[type] || type;
        }

        function showConfirmationModal() {
            if (selectedSpecialist && selectedDate && selectedTime && selectedCounselingType) {
                const modal = document.getElementById('confirmationModal');
                const detailsContainer = document.getElementById('confirmationDetails');

                const dateObj = new Date(selectedDate);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                detailsContainer.innerHTML = `
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-user-md"></i></div>
                        <div class="detail-value">${selectedSpecialist.name}</div>
                        <div class="detail-label">${selectedSpecialist.role}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-calendar-day"></i></div>
                        <div class="detail-value">${formattedDate}</div>
                        <div class="detail-label">Session Date</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-clock"></i></div>
                        <div class="detail-value">${selectedTime}</div>
                        <div class="detail-label">Duration: 60 min</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-video"></i></div>
                        <div class="detail-value">${getCounselingTypeLabel(selectedCounselingType)}</div>
                        <div class="detail-label">Session Type</div>
                    </div>
                `;

                // Clear previous form data
                document.querySelector('input[type="text"]').value = '';
                document.querySelector('input[type="email"]').value = '';
                document.querySelector('input[type="tel"]').value = '';
                document.querySelector('textarea').value = '';
                document.getElementById('terms').checked = false;

                modal.style.display = 'flex';
            }
        }

        function closeModal() {
            document.getElementById('confirmationModal').style.display = 'none';
        }

        function closeSuccessModal() {
            document.getElementById('successModal').style.display = 'none';
        }

        function showSuccessModal(appointmentData) {
            const modal = document.getElementById('successModal');
            const detailsContainer = document.getElementById('successAppointmentDetails');
            const meetingInfoContainer = document.getElementById('successMeetingInfo');

            const formattedDate = new Date(appointmentData.appointmentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Populate appointment details
            detailsContainer.innerHTML = `
                <div class="detail-card">
                    <div class="detail-card-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div class="detail-card-label">Specialist</div>
                    <div class="detail-card-value">Dr. ${appointmentData.specialistName}</div>
                </div>
                <div class="detail-card">
                    <div class="detail-card-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="detail-card-label">Date</div>
                    <div class="detail-card-value">${formattedDate}</div>
                </div>
                <div class="detail-card">
                    <div class="detail-card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="detail-card-label">Time</div>
                    <div class="detail-card-value">${appointmentData.appointmentTime}</div>
                </div>
                <div class="detail-card">
                    <div class="detail-card-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="detail-card-label">Session Type</div>
                    <div class="detail-card-value">${getCounselingTypeLabel(appointmentData.counselingType)}</div>
                </div>
            `;

            // Show meeting info for online sessions
            if (appointmentData.meetingLink || appointmentData.meetingId) {
                meetingInfoContainer.style.display = 'block';
                let meetingContent = `
                    <h4>
                        <i class="fas fa-video"></i>
                        Meeting Information
                    </h4>
                `;

                if (appointmentData.meetingLink) {
                    meetingContent += `
                        <div>
                            <strong>Meeting Link:</strong>
                            <div class="meeting-link">${appointmentData.meetingLink}</div>
                        </div>
                    `;
                }

                if (appointmentData.meetingId) {
                    meetingContent += `
                        <div class="meeting-id">
                            <strong>Meeting ID:</strong> ${appointmentData.meetingId}
                        </div>
                    `;
                }

                meetingInfoContainer.innerHTML = meetingContent;
            } else {
                meetingInfoContainer.style.display = 'none';
            }

            modal.style.display = 'flex';
        }

        async function handleBooking(e) {
            e.preventDefault();

            const submitText = document.getElementById('submitText');
            const loadingSpinner = document.getElementById('loadingSpinner');

            // Show loading
            submitText.style.display = 'none';
            loadingSpinner.style.display = 'inline-block';

            // Get form data
            const formData = {
                patientName: document.querySelector('input[type="text"]').value,
                patientEmail: document.querySelector('input[type="email"]').value,
                patientPhone: document.querySelector('input[type="tel"]').value,
                concerns: document.querySelector('textarea').value,
                specialistId: selectedSpecialist.id.toString(),
                specialistName: selectedSpecialist.name,
                specialistRole: selectedSpecialist.role,
                specialistSpecialty: selectedSpecialist.specialty,
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                counselingType: selectedCounselingType,
                consultationFee: 1500,
                platformFee: 0,
                totalAmount: 1500
            };

            try {
                console.log('Booking appointment with data:', formData);

                const response = await fetch('http://localhost:5001/api/appointments/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                console.log('Booking response:', result);

                if (result.success) {
                    // Close the booking modal
                    closeModal();

                    // Show the success modal with appointment data
                    showSuccessModal(result.appointment);

                    // Reset the booking form
                    resetBooking();
                } else {
                    alert('❌ Booking failed: ' + result.message);
                }

            } catch (error) {
                console.error('Error booking appointment:', error);
                alert('❌ Booking failed: ' + error.message);
            } finally {
                // Reset loading
                submitText.style.display = 'inline';
                loadingSpinner.style.display = 'none';
            }
        }

        // Fetch appointments from backend
        async function fetchAppointments() {
            try {
                console.log('Fetching appointments from backend...');

                const response = await fetch('http://localhost:5001/api/appointments/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Appointments response:', data);

                if (data.success && data.appointments) {
                    console.log('Appointments loaded:', data.appointments.length);
                    populateAppointments(data.appointments);
                } else {
                    console.error('Failed to fetch appointments:', data.message);
                    showNoAppointments();
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                showNoAppointments();
            }
        }

        // Populate appointments grid
        function populateAppointments(appointments) {
            const grid = document.getElementById('appointmentsGrid');

            if (appointments.length === 0) {
                showNoAppointments();
                return;
            }

            grid.innerHTML = appointments.map(appointment => {
                        const appointmentDate = new Date(appointment.appointmentDate);
                        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        });

                        const isUpcoming = new Date() < appointmentDate;
                        const canJoin = appointment.status === 'confirmed' && isUpcoming &&
                            appointment.counselingType !== 'in-office';
                        const canCancel = appointment.status === 'pending' ||
                            (appointment.status === 'confirmed' && isUpcoming);

                        return `
                    <div class="appointment-card ${appointment.status}" data-status="${appointment.status}">
                        <div class="appointment-header">
                            <div class="appointment-specialist">
                                <div class="appointment-avatar">
                                    ${appointment.specialistName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div class="appointment-specialist-info">
                                    <h4>Dr. ${appointment.specialistName}</h4>
                                    <div class="appointment-specialist-role">${appointment.specialistRole}</div>
                                </div>
                            </div>
                            <div class="appointment-status ${appointment.status}">
                                ${appointment.status}
                            </div>
                        </div>

                        <div class="appointment-details">
                            <div class="appointment-detail">
                                <div class="appointment-detail-icon">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                                <div class="appointment-detail-info">
                                    <div class="appointment-detail-label">Date</div>
                                    <div class="appointment-detail-value">${formattedDate}</div>
                                </div>
                            </div>
                            <div class="appointment-detail">
                                <div class="appointment-detail-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="appointment-detail-info">
                                    <div class="appointment-detail-label">Time</div>
                                    <div class="appointment-detail-value">${appointment.appointmentTime}</div>
                                </div>
                            </div>
                            <div class="appointment-detail">
                                <div class="appointment-detail-icon">
                                    <i class="fas fa-video"></i>
                                </div>
                                <div class="appointment-detail-info">
                                    <div class="appointment-detail-label">Type</div>
                                    <div class="appointment-detail-value">${getCounselingTypeLabel(appointment.counselingType)}</div>
                                </div>
                            </div>
                            <div class="appointment-detail">
                                <div class="appointment-detail-icon">
                                    <i class="fas fa-rupee-sign"></i>
                                </div>
                                <div class="appointment-detail-info">
                                    <div class="appointment-detail-label">Amount</div>
                                    <div class="appointment-detail-value">₹${appointment.totalAmount}</div>
                                </div>
                            </div>
                        </div>

                        ${appointment.meetingLink || appointment.meetingId ? `
                            <div class="appointment-meeting-info">
                                <h5><i class="fas fa-video"></i> Meeting Information</h5>
                                ${appointment.meetingLink ? `
                                    <div>Meeting Link:</div>
                                    <div class="appointment-meeting-link">${appointment.meetingLink}</div>
                                ` : ''}
                                ${appointment.meetingId ? `
                                    <div style="margin-top: 0.5rem;"><strong>Meeting ID:</strong> ${appointment.meetingId}</div>
                                ` : ''}
                            </div>
                        ` : ''}

                        <div class="appointment-actions">
                            ${canJoin ? `
                                <button class="appointment-btn appointment-btn-primary" onclick="joinMeeting('${appointment.meetingLink}')">
                                    <i class="fas fa-video"></i> Join Session
                                </button>
                            ` : ''}
                            
                            ${appointment.status === 'confirmed' && appointment.counselingType === 'in-office' ? `
                                <button class="appointment-btn appointment-btn-secondary" onclick="viewDirections()">
                                    <i class="fas fa-map-marker-alt"></i> Get Directions
                                </button>
                            ` : ''}
                            
                            <button class="appointment-btn appointment-btn-secondary" onclick="viewAppointmentDetails('${appointment._id}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            
                            ${canCancel ? `
                                <button class="appointment-btn appointment-btn-danger" onclick="cancelAppointment('${appointment._id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            // Setup filter functionality
            setupAppointmentFilters();
        }

        // Show no appointments message
        function showNoAppointments() {
            const grid = document.getElementById('appointmentsGrid');
            grid.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Appointments Found</h3>
                    <p>You haven't booked any appointments yet. Schedule your first session with our mental health professionals.</p>
                    <button class="btn-primary" onclick="document.querySelector('.booking-section').scrollIntoView({behavior: 'smooth'})">
                        <i class="fas fa-calendar-plus"></i> Book Appointment
                    </button>
                </div>
            `;
        }

        // Setup appointment filter functionality
        function setupAppointmentFilters() {
            document.querySelectorAll('.appointments-filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.appointments-filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.dataset.filter;
                    filterAppointments(filter);
                });
            });
        }

        // Filter appointments by status
        function filterAppointments(filter) {
            const cards = document.querySelectorAll('.appointment-card');
            cards.forEach((card, index) => {
                const status = card.dataset.status;
                if (filter === 'all' || status === filter) {
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        }

        // Join meeting function
        function joinMeeting(meetingLink) {
            if (meetingLink) {
                window.open(meetingLink, '_blank');
            } else {
                alert('Meeting link not available yet. Please check back closer to your appointment time.');
            }
        }

        // View directions function
        function viewDirections() {
            const address = "MindSpace Center, Main Branch";
            const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
            window.open(googleMapsUrl, '_blank');
        }

        // View appointment details function
        function viewAppointmentDetails(appointmentId) {
            alert(`Viewing details for appointment: ${appointmentId}`);
            // This could open a detailed modal or navigate to a detail page
        }

        // Cancel appointment function
        async function cancelAppointment(appointmentId) {
            if (confirm('Are you sure you want to cancel this appointment?')) {
                try {
                    const response = await fetch(`http://localhost:5001/api/appointments/${appointmentId}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: 'cancelled' })
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        alert('✅ Appointment cancelled successfully');
                        fetchAppointments(); // Refresh the appointments list
                    } else {
                        alert('❌ Failed to cancel appointment: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error cancelling appointment:', error);
                    alert('❌ Failed to cancel appointment');
                }
            }
        }

        // ADD: Reset booking state and UI after successful booking
        function resetBooking() {
            // Reset selections
            selectedSpecialist = null;
            selectedDate = null;
            selectedTime = null;
            selectedCounselingType = null;

            // Clear selected cards
            document.querySelectorAll('.specialist-card').forEach(c => c.classList.remove('selected'));

            // Hide selected specialist panel
            const selectedDiv = document.getElementById('selectedSpecialist');
            if (selectedDiv) selectedDiv.classList.remove('show');

            // Reset selects
            const datePicker = document.getElementById('datePicker');
            if (datePicker) datePicker.value = '';
            const counselingType = document.getElementById('counselingType');
            if (counselingType) counselingType.value = '';

            // Restore time slots placeholder
            const timeSlotsContainer = document.getElementById('timeSlots');
            if (timeSlotsContainer) {
                timeSlotsContainer.innerHTML = `
                    <div style="text-align: center; color: var(--gray-400); padding: 2rem; font-style: italic; grid-column: 1 / -1;">
                        <i class="fas fa-user-clock" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5; display: block;"></i>
                        <div style="font-size: 0.9rem;">Select a specialist to view available times</div>
                    </div>
                `;
            }

            // Update sidebar and summary buttons
            if (typeof updateBookingSidebar === 'function') updateBookingSidebar();
            if (typeof updateBookingSummary === 'function') updateBookingSummary();

            // Refresh appointments list to include the newly booked one
            if (typeof fetchAppointments === 'function') fetchAppointments();
        }

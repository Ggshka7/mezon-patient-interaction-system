document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Modal functionality
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeBtn = document.querySelector('.close');

    // Close modal when clicking on X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Show modal with message
    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    // Database simulation for doctors by service
    const doctorsByService = {
        'orthopedics': [
            { id: 'smith', name: 'Андрей Павлович' },
            { id: 'johnson', name: 'Елена Сергеевна' }
        ],
        'orthodontics': [
            { id: 'williams', name: 'Екатерина Александровна' },
            { id: 'brown', name: 'Михаил Петрович' }
        ],
        'therapy': [
            { id: 'jones', name: 'Татьяна Говиндовна' },
            { id: 'miller', name: 'Алексей Иванович' }
        ],
        'surgery': [
            { id: 'davis', name: 'Сергей Николаевич' },
            { id: 'wilson', name: 'Ольга Владимировна' }
        ]
    };

    // Step-by-step form fields
    const serviceSelect = document.getElementById('service');
    const doctorGroup = document.getElementById('doctor-group');
    const doctorSelect = document.getElementById('doctor');
    const dateGroup = document.getElementById('date-group');
    const dateInput = document.getElementById('date');
    const timeGroup = document.getElementById('time-group');
    const timeSelect = document.getElementById('time');

    // Service selection handling
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const service = this.value;
            if (service) {
                // Clear and populate doctor select based on service
                doctorSelect.innerHTML = '<option value="">Выбрать доктора</option>';
                
                if (doctorsByService[service]) {
                    doctorsByService[service].forEach(doctor => {
                        const option = document.createElement('option');
                        option.value = doctor.id;
                        option.textContent = doctor.name;
                        doctorSelect.appendChild(option);
                    });
                }
                
                // Show doctor selection
                doctorGroup.style.display = 'block';
                
                // Hide date and time until doctor is selected
                dateGroup.style.display = 'none';
                timeGroup.style.display = 'none';
            } else {
                // Hide all subsequent fields if service is deselected
                doctorGroup.style.display = 'none';
                dateGroup.style.display = 'none';
                timeGroup.style.display = 'none';
            }
        });
    }

    // Doctor selection handling
    if (doctorSelect) {
        doctorSelect.addEventListener('change', function() {
            if (this.value) {
                // Show date selection
                dateGroup.style.display = 'block';
                
                // Hide time until date is selected
                timeGroup.style.display = 'none';
            } else {
                // Hide date and time if doctor is deselected
                dateGroup.style.display = 'none';
                timeGroup.style.display = 'none';
            }
        });
    }

    // Date selection handling
    if (dateInput) {
        // Set minimum date for appointment to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        dateInput.addEventListener('change', function() {
            if (this.value) {
                // Show time selection
                timeGroup.style.display = 'block';
            } else {
                // Hide time if date is deselected
                timeGroup.style.display = 'none';
            }
        });
    }

    // Function to add a new visit to "My Visits" tab
    function addNewVisit(service, doctor, date, time) {
        const visitsList = document.querySelector('.visits-list');
        if (!visitsList) return;
        
        // Format date for display
        const visitDate = new Date(date);
        const formattedDate = visitDate.getDate() + ' ' + 
                             visitDate.toLocaleString('ru-RU', { month: 'long' }) + ', ' + 
                             visitDate.getFullYear();
        
        // Create new visit card element
        const visitCard = document.createElement('div');
        visitCard.className = 'visit-card upcoming';
        
        visitCard.innerHTML = `
            <h3>Новый визит</h3>
            <p><strong>Дата:</strong> ${formattedDate}</p>
            <p><strong>Время:</strong> ${time}</p>
            <p><strong>Доктор:</strong> ${doctor}</p>
            <p><strong>Услуга:</strong> ${service}</p>
            <div class="visit-actions">
                <button class="reschedule-btn">Перенести</button>
                <button class="cancel-btn">Отменить</button>
                <button class="review-btn">Оставить отзыв</button>
            </div>
        `;
        
        // Add to the beginning of the list
        visitsList.insertBefore(visitCard, visitsList.firstChild);
        
        // Add event listeners to the new buttons
        addVisitCardEventListeners(visitCard);
    }
    
    // Add event listeners to a visit card's buttons
    function addVisitCardEventListeners(visitCard) {
        const rescheduleBtn = visitCard.querySelector('.reschedule-btn');
        const cancelBtn = visitCard.querySelector('.cancel-btn');
        const reviewBtn = visitCard.querySelector('.review-btn');
        
        if (rescheduleBtn) {
            rescheduleBtn.addEventListener('click', function() {
                if (isWithin48Hours(upcomingVisit.date)) {
                    showModal('Экстренный перенос приёма возможен только по телефону. Пожалуйста, позвоните в клинику.');
                } else {
                    showModal('Вы можете перенести ваш приём на другую дату и время');
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                const visitCard = this.closest('.visit-card');
                
                if (isWithin48Hours(upcomingVisit.date)) {
                    showModal('Экстренная отмена приёма возможна только по телефону. Пожалуйста, позвоните в клинику.');
                } else {
                    if (confirm('Вы уверены, что хотите отменить запись?')) {
                        showModal('Ваш приём был успешно отменён');
                        if (visitCard) {
                            visitCard.remove();
                        }
                    }
                }
            });
        }
        
        if (reviewBtn) {
            reviewBtn.addEventListener('click', function() {
                showModal('Форма для отзыва будет доступна здесь. Спасибо за ваше мнение!');
            });
        }
    }

    // Form submission handling
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const service = document.getElementById('service').value;
            const doctorValue = document.getElementById('doctor').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            
            // Get doctor name from select
            const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
            
            // Get service name from select
            const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;

            // Add the new appointment to My Visits tab
            addNewVisit(serviceName, doctorName, date, time);

            // In a real application, this would send data to a server
            // For this demo, we'll just show a modal
            showModal('Прием успешно забронирован!\n\n' +
                      'Услуга: ' + serviceName + '\n' +
                      'Доктор: ' + doctorName + '\n' +
                      'Дата: ' + date + '\n' +
                      'Время: ' + time);

            // Reset form
            appointmentForm.reset();
            
            // Hide additional form groups
            doctorGroup.style.display = 'none';
            dateGroup.style.display = 'none';
            timeGroup.style.display = 'none';
        });
    }

    // Reschedule and cancel button handling
    const rescheduleButtons = document.querySelectorAll('.reschedule-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const reviewButtons = document.querySelectorAll('.review-btn');

    // Check if visit is within 48 hours
    function isWithin48Hours(visitDate) {
        const now = new Date();
        const visitTime = new Date(visitDate);
        const hoursDiff = (visitTime - now) / (1000 * 60 * 60);
        return hoursDiff < 48;
    }

    // Sample visit data (in real app would come from backend)
    const upcomingVisit = {
        date: '2025-06-15',
        time: '10:00'
    };

    // Handle reschedule buttons
    rescheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if visit can be rescheduled
            if (isWithin48Hours(upcomingVisit.date)) {
                showModal('Экстренный перенос приёма возможен только по телефону. Пожалуйста, позвоните в клинику.');
            } else {
                // In a real app, this would open a reschedule form
                showModal('Вы можете перенести ваш приём на другую дату и время');
            }
        });
    });

    // Handle cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get parent visit card element
            const visitCard = this.closest('.visit-card');
            
            // Check if visit can be cancelled
            if (isWithin48Hours(upcomingVisit.date)) {
                showModal('Экстренная отмена приёма возможна только по телефону. Пожалуйста, позвоните в клинику.');
            } else {
                if (confirm('Вы уверены, что хотите отменить запись?')) {
                    showModal('Ваш приём был успешно отменён');
                    // Remove the visit card from DOM
                    if (visitCard) {
                        visitCard.remove();
                    }
                    // In a real app, this would send cancellation to server
                }
            }
        });
    });

    // Handle review buttons
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would open a review form
            showModal('Форма для отзыва будет доступна здесь. Спасибо за ваше мнение!');
        });
    });

    // Logout button handling
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите выйти?')) {
                showModal('Вы успешно вышли из системы!');
                // In a real application, this would redirect to login page
                // window.location.href = 'login.html';
            }
        });
    }
}); 
// Данные о пациентах (в реальном приложении эти данные будут приходить с сервера)
const patientsData = {
    1: {
        name: 'Беззубенков Аркадий Иванович',
        service: 'Ортопедия',
        age: 35,
        phone: '+7 (555) 123-4567',
        lastVisit: '01.03.2025',
        notes: 'Пациент обратился с жалобами на чувствительность зубов',
        history: [
            {
                date: '15.02.2025',
                service: 'Консультация',
                recommendations: 'Рекомендовано провести лечение кариеса и профессиональную чистку'
            },
            {
                date: '10.01.2025',
                service: 'Профессиональная чистка',
                recommendations: 'Рекомендовано использовать зубную нить ежедневно'
            }
        ]
    },
    2: {
        name: 'Петрова Анна Сергеевна',
        service: 'Ортодонтия',
        age: 28,
        phone: '+7 (999) 234-56-78',
        lastVisit: '20.03.2024',
        notes: 'Плановый осмотр, требуется коррекция брекет-системы',
        history: [
            {
                date: '20.02.2024',
                service: 'Коррекция брекет-системы',
                recommendations: 'Избегать твердой пищи, продолжать использовать ирригатор'
            },
            {
                date: '20.01.2024',
                service: 'Коррекция брекет-системы',
                recommendations: 'Коррекция прошла успешно, следующий визит через месяц'
            }
        ]
    },
    3: {
        name: 'Сидоров Петр Николаевич',
        service: 'Терапия',
        age: 42,
        phone: '+7 (999) 345-67-89',
        lastVisit: '25.03.2024',
        notes: 'Лечение кариеса на зубе 2.6',
        history: [
            {
                date: '15.03.2024',
                service: 'Диагностика',
                recommendations: 'Рекомендовано лечение кариеса на зубе 2.6'
            }
        ]
    },
    4: {
        name: 'Козлова Мария Дмитриевна',
        service: 'Профилактический осмотр',
        age: 32,
        phone: '+7 (999) 456-78-90',
        lastVisit: '10.03.2024',
        notes: 'Требуется профессиональная чистка зубов',
        history: [
            {
                date: '10.03.2024',
                service: 'Консультация',
                recommendations: 'Рекомендована профессиональная чистка зубов'
            }
        ]
    }
};

// Форматирование даты
function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Отображение текущей даты
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

document.getElementById('today-date').textContent = formatDate(today);
document.getElementById('tomorrow-date').textContent = formatDate(tomorrow);

// Переключение вкладок
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок и контента
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Добавляем активный класс выбранной кнопке и соответствующему контенту
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Переключение между сегодня и завтра
document.querySelectorAll('.date-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок и контейнеров с записями
        document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.appointments-container').forEach(cont => cont.classList.remove('active'));
        
        // Добавляем активный класс выбранной кнопке и соответствующему контейнеру
        tab.classList.add('active');
        const dateId = tab.getAttribute('data-date');
        document.getElementById(`${dateId}-appointments`).classList.add('active');
    });
});

// Обработка клика по кнопке просмотра данных пациента
document.querySelectorAll('.btn-view-patient').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const patientId = button.closest('.appointment-card').getAttribute('data-patient-id');
        showPatientInfo(patientId);
    });
});

// Обработка клика по карточке приёма (для обратной совместимости)
document.querySelectorAll('.appointment-card').forEach(card => {
    card.addEventListener('click', () => {
        const patientId = card.getAttribute('data-patient-id');
        showPatientInfo(patientId);
    });
});

// Функция для отображения информации о пациенте
function showPatientInfo(patientId) {
    const patient = patientsData[patientId];
    
    // Переключаемся на вкладку с информацией о пациенте
    document.querySelector('[data-tab="patient-info"]').click();
    
    // Отображаем информацию о пациенте
    const patientDetails = document.querySelector('.patient-details');
    
    let historyHTML = '';
    if (patient.history && patient.history.length > 0) {
        historyHTML = `
            <div class="patient-history">
                <h4>История приёмов</h4>
        `;
        
        patient.history.forEach(item => {
            historyHTML += `
                <div class="history-item">
                    <p class="history-date">${item.date} - ${item.service}</p>
                    <p>${item.recommendations}</p>
                </div>
            `;
        });
        
        historyHTML += `</div>`;
    }
    
    patientDetails.innerHTML = `
        <h3>${patient.name}</h3>
        <p><strong>Возраст:</strong> ${patient.age} лет</p>
        <p><strong>Телефон:</strong> ${patient.phone}</p>
        <p><strong>Последний визит:</strong> ${patient.lastVisit}</p>
        <p><strong>Услуга:</strong> ${patient.service}</p>
        <p><strong>Заметки:</strong> ${patient.notes}</p>
        ${historyHTML}
    `;
}

// Обработка кнопки "Вернуться к расписанию"
document.querySelector('.btn-back-to-schedule').addEventListener('click', () => {
    document.querySelector('[data-tab="schedule"]').click();
});

// Обработка отправки формы рекомендаций
document.getElementById('recommendations-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const patientId = document.getElementById('patient-select').value;
    const recommendations = document.getElementById('recommendations-text').value;
    
    if (patientId && recommendations) {
        alert(`Рекомендации успешно отправлены пациенту ${patientsData[patientId].name}!`);
        document.getElementById('recommendations-form').reset();
    }
});

// Обработка кнопок переноса/отмены приема
document.querySelectorAll('.btn-reschedule').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const appointmentCard = button.closest('.appointment-card');
        const patientId = appointmentCard.getAttribute('data-patient-id');
        const patient = patientsData[patientId];
        const timeElement = appointmentCard.querySelector('.appointment-time');
        
        // Заполняем модальное окно
        document.getElementById('reschedule-patient-name').textContent = patient.name;
        document.getElementById('reschedule-current-time').textContent = timeElement.textContent;
        
        // Устанавливаем дату "завтра" как значение по умолчанию
        const dateInput = document.getElementById('new-date');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        
        // Показываем модальное окно
        document.getElementById('reschedule-modal').style.display = 'block';
        
        // Сохраняем ID пациента для дальнейшего использования
        document.getElementById('reschedule-form').setAttribute('data-patient-id', patientId);
    });
});

// Обработка закрытия модального окна
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('reschedule-modal').style.display = 'none';
});

// Закрытие модального окна при клике вне его содержимого
window.addEventListener('click', (event) => {
    const modal = document.getElementById('reschedule-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Обработка переключения радио-кнопок для переноса/отмены
document.querySelectorAll('input[name="action"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const action = document.querySelector('input[name="action"]:checked').value;
        
        if (action === 'reschedule') {
            document.getElementById('reschedule-options').style.display = 'block';
            document.getElementById('cancel-options').style.display = 'none';
        } else {
            document.getElementById('reschedule-options').style.display = 'none';
            document.getElementById('cancel-options').style.display = 'block';
        }
    });
});

// Обработка формы переноса/отмены приема
document.getElementById('reschedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const patientId = e.target.getAttribute('data-patient-id');
    const patient = patientsData[patientId];
    const action = document.querySelector('input[name="action"]:checked').value;
    
    if (action === 'reschedule') {
        const newDate = document.getElementById('new-date').value;
        const newTime = document.getElementById('new-time').value;
        
        // Форматирование даты для отображения
        const dateObj = new Date(newDate);
        const formattedDate = formatDate(dateObj);
        
        alert(`Приём с пациентом ${patient.name} перенесен на ${formattedDate} в ${newTime}`);
    } else {
        const reason = document.getElementById('cancel-reason').value;
        alert(`Приём с пациентом ${patient.name} отменен. Причина: ${reason}`);
    }
    
    // Закрываем модальное окно
    document.getElementById('reschedule-modal').style.display = 'none';
});

// Обработка кнопки выхода
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
        alert('Вы успешно вышли из системы');
        // В реальном приложении здесь будет редирект на страницу входа
    }
}); 
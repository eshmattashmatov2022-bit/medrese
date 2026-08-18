// =====================================================
// МЕДРЕСЕ САЙТЫ - JAVASCRIPT
// =====================================================

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFormSubmission();
    initScrollAnimations();
    initSmoothScroll();
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    // Переключение меню
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ФОРМА КАБЫЛ АЛУУ =====
function initFormSubmission() {
    const form = document.getElementById('admissionForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Проверка формы
        if (!this.checkValidity()) {
            showFormMessage('Пожалуйста, заполните все обязательные поля!', 'error');
            return;
        }

        // Получение данных
        const formData = new FormData(this);
        const data = {
            fullName: formData.get('fullName'),
            age: formData.get('age'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            program: formData.get('program'),
            level: formData.get('level'),
            message: formData.get('message'),
            timestamp: new Date().toLocaleString('ky-KG')
        };

        // Проверка возраста
        const age = parseInt(data.age);
        if (age < 5 || age > 80) {
            showFormMessage('Возраст должен быть от 5 до 80 лет', 'error');
            return;
        }

        // Проверка номера телефона
        if (!isValidPhoneNumber(data.phone)) {
            showFormMessage('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }

        // Проверка email (если указан)
        if (data.email && !isValidEmail(data.email)) {
            showFormMessage('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }

        // Имитация отправки на сервер
        submitForm(data);
    });
}

// Валидация номера телефона
function isValidPhoneNumber(phone) {
    // Простая проверка - должны быть цифры
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.trim());
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Отправка формы
function submitForm(data) {
    const form = document.getElementById('admissionForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Отключение кнопки и показ загрузки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Жиберилүүдө...';

    // API аркылуу жиберүү
    ApiMethods.submitAdmission(data)
        .then(response => {
            // Успешное отправление
            showFormMessage('✓ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');

            // Очистка формы
            form.reset();

            // Возврат кнопки в исходное состояние
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            // Закрытие сообщения через 5 секунд
            setTimeout(() => {
                const message = document.getElementById('formMessage');
                if (message) {
                    message.classList.remove('success');
                    message.textContent = '';
                }
            }, 5000);

            console.log('Форма ийгиликтүү жиберилди:', response);
        })
        .catch(error => {
            console.error('Форма жиберүү катасы:', error);
            const errorMsg = error.data?.errors?.[0]?.msg || 'Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.';
            showFormMessage(errorMsg, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
}

// Показ сообщения формы
function showFormMessage(message, type) {
    const messageEl = document.getElementById('formMessage');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;

    // Автозакрытие ошибок через 5 секунд
    if (type === 'error') {
        setTimeout(() => {
            messageEl.classList.remove('error');
            messageEl.textContent = '';
        }, 5000);
    }
}

// Сохранение данных в localStorage
function saveFormDataLocally(data) {
    let submissions = JSON.parse(localStorage.getItem('medreseSubmissions')) || [];
    submissions.push(data);
    localStorage.setItem('medreseSubmissions', JSON.stringify(submissions));
    console.log('Всего заявок:', submissions.length);
}

// ===== АНИМАЦИЯ ПРИ ПРОКРУТКЕ =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдение за элементами
    document.querySelectorAll('.program-card, .teacher-card, .news-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== ЗАГРУЖЕННАЯ СТРАНИЦА СТАТИСТИКА =====
function logPageStats() {
    const submissions = JSON.parse(localStorage.getItem('medreseSubmissions')) || [];
    console.log(`%c📊 Статистика Сайта`, 'color: #D4AF37; font-size: 16px; font-weight: bold;');
    console.log(`%cВсего заявок: ${submissions.length}`, 'color: #1E3A5F; font-size: 14px;');
    console.log(`%cСайт загружен в: ${new Date().toLocaleTimeString('ky-KG')}`, 'color: #1E3A5F; font-size: 12px;');
}

// Вызов при загрузке
logPageStats();

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Функция для отправки уведомления по email (заглушка)
function sendEmailNotification(email, data) {
    console.log(`Email отправлен на: ${email}`);
    console.log('Содержание:', data);
    // В реальном приложении здесь будет API запрос к серверу
}

// Функция поиска
function searchPrograms(query) {
    const programs = document.querySelectorAll('.program-card');
    const lowerQuery = query.toLowerCase();

    programs.forEach(program => {
        const text = program.textContent.toLowerCase();
        program.style.display = text.includes(lowerQuery) ? 'block' : 'none';
    });
}

// Функция фильтрации учителей по специальности
function filterTeachers(specialty) {
    const teachers = document.querySelectorAll('.teacher-card');

    teachers.forEach(teacher => {
        const teacherSpecialty = teacher.querySelector('.teacher-specialty');
        if (!specialty || teacherSpecialty.textContent.includes(specialty)) {
            teacher.style.display = 'block';
        } else {
            teacher.style.display = 'none';
        }
    });
}

// Функция для увеличения рейтинга
function updateTeacherRating(teacherName, newRating) {
    const teachers = document.querySelectorAll('.teacher-card');
    teachers.forEach(teacher => {
        if (teacher.querySelector('h3').textContent === teacherName) {
            const rating = teacher.querySelector('.teacher-rating');
            rating.textContent = '⭐'.repeat(newRating);
        }
    });
}

// Функция открытия галереи (для будущего расширения)
function openGalleryModal(imagePath) {
    console.log('Открытие изображения:', imagePath);
    // Здесь можно добавить модальное окно
}

// Функция для подписки на новости
function subscribeToNews(email) {
    if (!isValidEmail(email)) {
        console.log('Неверный email');
        return false;
    }
    console.log('Подписано на новости:', email);
    return true;
}

// Функция для печати расписания
function printSchedule() {
    window.print();
    console.log('Расписание отправлено на печать');
}

// ===== ОБРАБОТЧИК ОШИБОК =====
window.addEventListener('error', function(event) {
    console.error('Ошибка страницы:', event.error);
});

// ===== ЗАГРУЗКА СТРАНИЦЫ =====
window.addEventListener('load', function() {
    console.log('✓ Страница полностью загружена');
    document.body.style.opacity = '1';
});

// ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
// Кэширование часто используемых элементов
const cache = {
    hero: document.querySelector('.hero'),
    admission: document.querySelector('.admission'),
    contact: document.querySelector('.contact')
};

// Функция для получения информации о странице
function getPageInfo() {
    return {
        title: document.title,
        url: window.location.href,
        sections: document.querySelectorAll('section').length,
        forms: document.querySelectorAll('form').length,
        images: document.querySelectorAll('img').length
    };
}

// Экспорт функций для использования в консоли
window.medrese = {
    searchPrograms,
    filterTeachers,
    updateTeacherRating,
    openGalleryModal,
    subscribeToNews,
    printSchedule,
    getPageInfo,
    getSubmissions: () => JSON.parse(localStorage.getItem('medreseSubmissions')) || []
};

console.log('%c🕌 Добро пожаловать на сайт Медресе!', 'color: #D4AF37; font-size: 18px; font-weight: bold;');
console.log('%cДоступные команды: window.medrese', 'color: #1E3A5F; font-size: 12px;');

// ===== ЖАҢЫЛЫКТАРДЫ API'ДЕН ЖҮКТӨӨ =====
async function loadNewsFromAPI() {
    try {
        const response = await fetch('/api/news');
        const result = await response.json();
        const newsList = result.data || result || [];

        const newsGrid = document.getElementById('newsGrid');

        if (!newsList.length) {
            newsGrid.innerHTML = '<p>Азырынча жаңылык жок</p>';
            return;
        }

        window.allNewsData = newsList;

        newsGrid.innerHTML = newsList.map((news, index) => {
            const date = new Date(news.date);
            const day = date.getDate().toString().padStart(2, '0');
            const months = ['ЯНВ','ФЕВ','МАРТ','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'];
            const month = months[date.getMonth()] || 'АВГ';

            const imageHtml = news.image
                ? `<img src="${news.image}" alt="${news.title}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;">`
                : '';

            return `
                <article class="news-card">
                    <div class="news-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="news-content">
                        ${imageHtml}
                        <h3>${news.title}</h3>
                        <p>${(news.content || '').substring(0, 200)}...</p>
                        <a href="javascript:void(0)" class="read-more" onclick="openNewsModal(${index})">Көбүрөөк →</a>
                    </div>
                </article>
            `;
        }).join('');

    } catch (error) {
        console.error('Жаңылыктарды жүктөөдө ката:', error);
        document.getElementById('newsGrid').innerHTML = '<p>Жаңылыктарды жүктөө мүмкүн болгон жок</p>';
    }
}

function openNewsModal(index) {
    const news = window.allNewsData[index];
    if (!news) return;

    let modal = document.getElementById('newsDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'newsDetailModal';
        modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);align-items:center;justify-content:center;z-index:9999;padding:20px;';
        modal.innerHTML = `
            <div style="background:white;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;border-radius:10px;padding:25px;position:relative;">
                <button onclick="document.getElementById('newsDetailModal').style.display='none'" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;">×</button>
                <div id="newsModalContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const imageHtml = news.image
        ? `<img src="${news.image}" style="width:100%;border-radius:8px;margin-bottom:15px;">`
        : '';

    document.getElementById('newsModalContent').innerHTML = `
        ${imageHtml}
        <h2 style="margin-bottom:10px;">${news.title}</h2>
        <p style="color:#888;margin-bottom:15px;font-size:14px;">${new Date(news.date).toLocaleDateString('ky-KG')} ${news.category ? '· ' + news.category : ''}</p>
        <p style="line-height:1.6;">${news.content}</p>
    `;

    modal.style.display = 'flex';
}

// Барак жүктөлгөндө жаңылыктарды алуу
document.addEventListener('DOMContentLoaded', loadNewsFromAPI);
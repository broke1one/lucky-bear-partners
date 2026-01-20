// Страница входа в админ-панель
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Проверка, не авторизован ли уже пользователь
    if (localStorage.getItem('adminAuthenticated') === 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Обработка отправки формы
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Проверка логина и пароля
        if (username === 'admin' && password === 'admin') {
            // Сохранение статуса авторизации
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminLoginTime', Date.now().toString());

            // Скрытие ошибки
            errorMessage.classList.remove('show');

            // Перенаправление на админ-панель
            window.location.href = 'index.html';
        } else {
            // Показ ошибки
            errorMessage.classList.add('show');
            usernameInput.focus();
            
            // Очистка поля пароля
            passwordInput.value = '';
        }
    });

    // Скрытие ошибки при вводе
    usernameInput.addEventListener('input', function() {
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
    });

    // Фокус на поле логина при загрузке
    usernameInput.focus();
});

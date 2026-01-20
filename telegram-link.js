// Обновление всех ссылок Telegram на сайте
document.addEventListener('DOMContentLoaded', function() {
    function updateTelegramLinks() {
        const telegramLink = localStorage.getItem('telegramLink') || 'https://t.me/YOUR_TELEGRAM_USERNAME';
        const telegramButtons = document.querySelectorAll('[data-telegram-link]');
        
        telegramButtons.forEach(button => {
            button.href = telegramLink;
        });
    }

    // Обновляем ссылки при загрузке страницы
    updateTelegramLinks();

    // Слушаем изменения в localStorage (если настройки изменены в другой вкладке)
    window.addEventListener('storage', function(e) {
        if (e.key === 'telegramLink') {
            updateTelegramLinks();
        }
    });

    // Также обновляем при фокусе на странице (на случай, если настройки изменены в той же вкладке)
    window.addEventListener('focus', updateTelegramLinks);
});

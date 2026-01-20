// Управление статьями в блоге
document.addEventListener('DOMContentLoaded', function() {
    const articlesGrid = document.getElementById('articlesGrid');

    // Загрузка статей из localStorage
    function loadArticles() {
        const articles = JSON.parse(localStorage.getItem('blogArticles')) || [];
        displayArticles(articles);
    }

    // Отображение статей
    function displayArticles(articles) {
        if (articles.length === 0) {
            articlesGrid.innerHTML = '<p class="no-articles">Статьи пока не добавлены. Добавьте первую статью через админ-панель!</p>';
            return;
        }

        articlesGrid.innerHTML = articles.map((article, index) => {
            // Определяем изображение
            let imageContent = '';
            if (article.image) {
                imageContent = `<img src="${article.image}" alt="${article.title}" class="article-image-content">`;
            } else {
                imageContent = `<div class="article-placeholder">📝</div>`;
            }

            return `
                <article class="article-card" data-index="${index}">
                    <div class="article-image">
                        ${imageContent}
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="article-date">${article.date || 'Дата не указана'}</span>
                            <span class="article-category">${article.category || 'Без категории'}</span>
                        </div>
                        <h2 class="article-title">${article.title || 'Без названия'}</h2>
                        <p class="article-excerpt">${article.excerpt || article.text?.substring(0, 200) + '...' || 'Описание отсутствует'}</p>
                        ${article.text ? `
                            <div class="article-full-text" style="display: none;">
                                ${article.text}
                            </div>
                        ` : ''}
                        <a href="${article.link || '#'}" class="article-link" ${article.link && article.link !== '#' ? 'target="_blank"' : ''}>
                            ${article.text ? 'Читать далее →' : 'Перейти →'}
                        </a>
                    </div>
                </article>
            `;
        }).join('');

        // Добавляем обработчики для показа полного текста
        document.querySelectorAll('.article-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const articleCard = this.closest('.article-card');
                const fullText = articleCard.querySelector('.article-full-text');
                
                if (fullText && this.href === '#') {
                    e.preventDefault();
                    if (fullText.style.display === 'none') {
                        fullText.style.display = 'block';
                        this.textContent = 'Свернуть';
                    } else {
                        fullText.style.display = 'none';
                        this.textContent = 'Читать далее →';
                    }
                }
            });
        });
    }

    // Анимация появления статей
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    // Применяем анимацию к статьям после загрузки
    setTimeout(() => {
        document.querySelectorAll('.article-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);

    // Загружаем статьи при загрузке страницы
    loadArticles();
});

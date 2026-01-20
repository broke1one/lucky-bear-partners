// Админ-панель для управления статьями
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    // Определяем, находимся ли мы в папке admin или в корне
    const isInAdminFolder = window.location.pathname.includes('/admin/');
    const loginPath = isInAdminFolder ? 'login.html' : 'admin/login.html';
    
    if (localStorage.getItem('adminAuthenticated') !== 'true') {
        window.location.href = loginPath;
        return;
    }

    // Настройки Telegram
    const telegramLinkInput = document.getElementById('telegramLink');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const settingsMessage = document.getElementById('settingsMessage');

    // Загрузка сохраненной ссылки Telegram
    function loadTelegramLink() {
        const savedLink = localStorage.getItem('telegramLink') || 'https://t.me/YOUR_TELEGRAM_USERNAME';
        if (telegramLinkInput) {
            telegramLinkInput.value = savedLink;
        }
    }

    // Сохранение ссылки Telegram
    if (saveSettingsBtn && telegramLinkInput) {
        saveSettingsBtn.addEventListener('click', function() {
            const link = telegramLinkInput.value.trim();
            if (!link) {
                showSettingsMessage('Пожалуйста, введите ссылку на Telegram', 'error');
                return;
            }

            // Простая валидация URL
            try {
                new URL(link);
            } catch (e) {
                showSettingsMessage('Пожалуйста, введите корректную ссылку (например: https://t.me/username)', 'error');
                return;
            }

            localStorage.setItem('telegramLink', link);
            showSettingsMessage('Настройки успешно сохранены!', 'success');
        });
    }

    function showSettingsMessage(text, type) {
        if (!settingsMessage) return;
        settingsMessage.textContent = text;
        settingsMessage.className = 'settings-message ' + type;
        settingsMessage.style.display = 'block';
        setTimeout(() => {
            settingsMessage.style.display = 'none';
        }, 3000);
    }

    // Загружаем настройки при загрузке страницы
    loadTelegramLink();

    const articlesList = document.getElementById('articlesList');
    const articleFormSection = document.getElementById('articleFormSection');
    const articleForm = document.getElementById('articleForm');
    const addArticleBtn = document.getElementById('addArticleBtn');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');
    const articleIdInput = document.getElementById('articleId');
    
    // Элементы формы
    const articleTitle = document.getElementById('articleTitle');
    const articleImageUrl = document.getElementById('articleImageUrl');
    const articleImageFile = document.getElementById('articleImageFile');
    const articleText = document.getElementById('articleText');
    const articleExcerpt = document.getElementById('articleExcerpt');
    const articleDate = document.getElementById('articleDate');
    const articleCategory = document.getElementById('articleCategory');
    const articleLink = document.getElementById('articleLink');
    const metaTitle = document.getElementById('metaTitle');
    const metaDescription = document.getElementById('metaDescription');
    const metaKeywords = document.getElementById('metaKeywords');
    const focusKeyword = document.getElementById('focusKeyword');
    const ogTitle = document.getElementById('ogTitle');
    const ogDescription = document.getElementById('ogDescription');
    const ogImage = document.getElementById('ogImage');
    
    // Счетчики символов
    const metaTitleCount = document.getElementById('metaTitleCount');
    const metaDescriptionCount = document.getElementById('metaDescriptionCount');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImageBtn = document.getElementById('removeImageBtn');

    // Установка текущей даты по умолчанию
    if (articleDate && !articleDate.value) {
        const today = new Date().toISOString().split('T')[0];
        articleDate.value = today;
    }

    // Загрузка статей
    function loadArticles() {
        const articles = JSON.parse(localStorage.getItem('blogArticles')) || [];
        displayArticles(articles);
    }

    // Отображение списка статей
    function displayArticles(articles) {
        if (articles.length === 0) {
            articlesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">Статьи пока не добавлены</div>
                    <div class="empty-state-hint">Нажмите "Добавить статью" чтобы создать первую статью</div>
                </div>
            `;
            return;
        }

        articlesList.innerHTML = articles.map((article, index) => `
            <div class="article-item" data-index="${index}">
                <div class="article-item-info">
                    <div class="article-item-title">${article.title}</div>
                    <div class="article-item-meta">
                        <span>📅 ${article.date}</span>
                        <span>🏷️ ${article.category}</span>
                        <span>🔑 ${article.focusKeyword || 'Не указано'}</span>
                    </div>
                </div>
                <div class="article-item-actions">
                    <button class="btn btn-secondary btn-small" onclick="editArticle(${index})">✏️ Редактировать</button>
                    <button class="btn btn-danger btn-small" onclick="deleteArticle(${index})">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
    }

    // Открытие формы добавления
    addArticleBtn.addEventListener('click', function() {
        articleFormSection.style.display = 'block';
        formTitle.textContent = 'Добавить новую статью';
        articleForm.reset();
        articleIdInput.value = '';
        imagePreview.style.display = 'none';
        articleImageUrl.value = '';
        articleImageFile.value = '';
        
        // Установка текущей даты
        const today = new Date().toISOString().split('T')[0];
        articleDate.value = today;
        
        // Прокрутка к форме
        articleFormSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Закрытие формы
    function closeForm() {
        articleFormSection.style.display = 'none';
        articleForm.reset();
        articleIdInput.value = '';
        imagePreview.style.display = 'none';
    }

    closeFormBtn.addEventListener('click', closeForm);
    cancelBtn.addEventListener('click', closeForm);

    // Обработка загрузки изображения
    articleImageFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
                articleImageUrl.value = e.target.result; // Сохраняем как data URL
            };
            reader.readAsDataURL(file);
        }
    });

    articleImageUrl.addEventListener('input', function() {
        if (articleImageUrl.value) {
            previewImg.src = articleImageUrl.value;
            imagePreview.style.display = 'block';
        }
    });

    removeImageBtn.addEventListener('click', function() {
        imagePreview.style.display = 'none';
        articleImageUrl.value = '';
        articleImageFile.value = '';
    });

    // Счетчики символов
    metaTitle.addEventListener('input', function() {
        const length = this.value.length;
        metaTitleCount.textContent = `${length} / 60`;
        metaTitleCount.className = 'char-count';
        if (length > 60) metaTitleCount.classList.add('error');
        else if (length > 50) metaTitleCount.classList.add('warning');
    });

    metaDescription.addEventListener('input', function() {
        const length = this.value.length;
        metaDescriptionCount.textContent = `${length} / 160`;
        metaDescriptionCount.className = 'char-count';
        if (length > 160) metaDescriptionCount.classList.add('error');
        else if (length > 150) metaDescriptionCount.classList.add('warning');
    });

    // Автозаполнение excerpt из текста статьи
    articleText.addEventListener('blur', function() {
        if (!articleExcerpt.value && this.value) {
            const excerpt = this.value.substring(0, 200).trim() + '...';
            articleExcerpt.value = excerpt;
        }
    });

    // Автозаполнение SEO полей из названия
    articleTitle.addEventListener('blur', function() {
        if (!metaTitle.value && this.value) {
            metaTitle.value = this.value;
            metaTitle.dispatchEvent(new Event('input')); // Обновить счетчик
        }
        if (!ogTitle.value && this.value) {
            ogTitle.value = this.value;
        }
    });

    // Обработка отправки формы
    articleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Получение изображения
        let imageUrl = articleImageUrl.value;
        if (!imageUrl && articleImageFile.files[0]) {
            // Если выбрано изображение, но не вставлен URL, используем data URL
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrl = e.target.result;
                saveArticle(imageUrl);
            };
            reader.readAsDataURL(articleImageFile.files[0]);
        } else {
            saveArticle(imageUrl);
        }
    });

    function saveArticle(imageUrl) {
        const article = {
            id: articleIdInput.value || Date.now().toString(),
            title: articleTitle.value,
            image: imageUrl || '',
            text: articleText.value,
            excerpt: articleExcerpt.value || articleText.value.substring(0, 200) + '...',
            date: articleDate.value,
            category: articleCategory.value,
            link: articleLink.value || '#',
            // SEO
            metaTitle: metaTitle.value,
            metaDescription: metaDescription.value,
            metaKeywords: metaKeywords.value,
            focusKeyword: focusKeyword.value,
            ogTitle: ogTitle.value || metaTitle.value,
            ogDescription: ogDescription.value || metaDescription.value,
            ogImage: ogImage.value || imageUrl || ''
        };

        const articles = JSON.parse(localStorage.getItem('blogArticles')) || [];
        
        if (articleIdInput.value) {
            // Редактирование существующей статьи
            const index = articles.findIndex(a => a.id === articleIdInput.value);
            if (index !== -1) {
                articles[index] = article;
            }
        } else {
            // Добавление новой статьи
            articles.unshift(article);
        }

        localStorage.setItem('blogArticles', JSON.stringify(articles));
        
        // Обновление отображения
        loadArticles();
        closeForm();
        
        alert('Статья успешно сохранена!');
    }

    // Глобальные функции для кнопок редактирования и удаления
    window.editArticle = function(index) {
        const articles = JSON.parse(localStorage.getItem('blogArticles')) || [];
        const article = articles[index];
        
        if (!article) return;

        // Заполнение формы
        articleIdInput.value = article.id;
        articleTitle.value = article.title || '';
        articleImageUrl.value = article.image || '';
        articleText.value = article.text || '';
        articleExcerpt.value = article.excerpt || '';
        articleDate.value = article.date || '';
        articleCategory.value = article.category || '';
        articleLink.value = article.link || '';
        metaTitle.value = article.metaTitle || '';
        metaDescription.value = article.metaDescription || '';
        metaKeywords.value = article.metaKeywords || '';
        focusKeyword.value = article.focusKeyword || '';
        ogTitle.value = article.ogTitle || '';
        ogDescription.value = article.ogDescription || '';
        ogImage.value = article.ogImage || '';

        // Обновление счетчиков
        metaTitle.dispatchEvent(new Event('input'));
        metaDescription.dispatchEvent(new Event('input'));

        // Показ превью изображения
        if (article.image) {
            previewImg.src = article.image;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }

        // Открытие формы
        formTitle.textContent = 'Редактировать статью';
        articleFormSection.style.display = 'block';
        articleFormSection.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteArticle = function(index) {
        if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
            return;
        }

        const articles = JSON.parse(localStorage.getItem('blogArticles')) || [];
        articles.splice(index, 1);
        localStorage.setItem('blogArticles', JSON.stringify(articles));
        loadArticles();
        alert('Статья удалена!');
    };

    // Загрузка статей при загрузке страницы
    loadArticles();

    // Обработчик кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти из админ-панели?')) {
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('adminLoginTime');
                window.location.href = 'login.html';
            }
        });
    }
});

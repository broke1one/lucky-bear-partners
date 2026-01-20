#!/bin/bash

# Скрипт автоматического деплоя на REG.RU через FTP/SFTP
# Использование: ./deploy.sh

# ============================================
# НАСТРОЙКИ - ЗАПОЛНИТЕ СВОИ ДАННЫЕ
# ============================================

# FTP данные REG.RU
FTP_HOST="ftp.your-site.ru"  # Замените на ваш FTP хост
FTP_USER="your-username"      # Ваш FTP логин
FTP_PASS="your-password"      # Ваш FTP пароль
FTP_DIR="/public_html"         # Папка на сервере (обычно /public_html или /www)

# Локальная папка проекта
LOCAL_DIR="$(pwd)"

# ============================================
# ФУНКЦИИ
# ============================================

echo "🚀 Начинаю деплой на REG.RU..."

# Проверка наличия lftp
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp не установлен. Устанавливаю..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install lftp
    else
        echo "Установите lftp вручную: sudo apt-get install lftp"
        exit 1
    fi
fi

# Синхронизация файлов через FTP
lftp -c "
set ftp:ssl-allow no
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $FTP_DIR
lcd $LOCAL_DIR
mirror --reverse --delete --verbose --exclude-glob='.git*' --exclude-glob='*.md' --exclude-glob='deploy.sh'
bye
"

if [ $? -eq 0 ]; then
    echo "✅ Деплой успешно завершен!"
else
    echo "❌ Ошибка при деплое!"
    exit 1
fi

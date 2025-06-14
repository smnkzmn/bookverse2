# BookVerse Admin - Руководство по деплою на Reg.ru

## Подготовка к деплою

1. Соберите проект:
```bash
npm run build
```

2. Создайте файл `.env.production`:
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secure-production-secret
DATABASE_URL=your-production-database-url
UPLOAD_DIR=uploads
```

## Файлы для загрузки на хостинг

Загрузите следующие файлы и папки через FTP:

```
├── client/dist/          # Собранные файлы фронтенда
├── server/              # Серверная часть
├── uploads/            # Папка для загруженных файлов
├── .env.production    # Файл с переменными окружения
├── .htaccess         # Файл конфигурации Apache
├── package.json      # Файл зависимостей
└── package-lock.json # Файл блокировки версий
```

## Настройка хостинга

1. В панели управления Reg.ru:
   - Перейдите в раздел "Хостинг"
   - Выберите ваш тарифный план
   - Найдите FTP-доступ и SSH-доступ

2. Настройка Node.js:
   - Убедитесь, что на хостинге установлен Node.js
   - Установите зависимости: `npm install --production`
   - Запустите приложение: `NODE_ENV=production node server/index.js`

3. Настройка домена:
   - В разделе "Домены" настройте DNS-записи
   - Активируйте SSL-сертификат

## Проверка работоспособности

1. Проверьте доступность сайта по домену
2. Проверьте работу API-эндпоинтов
3. Проверьте загрузку статических файлов
4. Проверьте работу аутентификации
5. Проверьте загрузку изображений

## Обновление сайта

1. Внесите изменения в код
2. Соберите проект: `npm run build`
3. Загрузите обновленные файлы через FTP
4. Перезапустите сервер

## Безопасность

1. Убедитесь, что все пароли и секретные ключи надежно защищены
2. Настройте регулярное резервное копирование
3. Настройте мониторинг доступности сайта
4. Настройте логирование ошибок
5. Настройте защиту от DDoS-атак

## Полезные команды для управления

```bash
# Проверка статуса сервера
pm2 status

# Перезапуск сервера
pm2 restart all

# Просмотр логов
pm2 logs

# Мониторинг ресурсов
pm2 monit
```

## Устранение неполадок

1. Проверьте логи сервера
2. Убедитесь, что все переменные окружения установлены правильно
3. Проверьте права доступа к файлам и папкам
4. Проверьте настройки базы данных
5. Проверьте настройки SSL-сертификата 
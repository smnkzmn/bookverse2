# BookVerse Admin - Руководство по локальной разработке

## Требования
- Node.js 18 или выше
- npm 9 или выше
- PostgreSQL (для базы данных)

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd BookVerseAdmin
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории:
```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-development-secret
DATABASE_URL=postgresql://user:password@localhost:5432/bookverse
UPLOAD_DIR=uploads
```

4. Создайте базу данных и примените миграции:
```bash
npm run db:push
```

## Запуск в режиме разработки

1. Запустите сервер разработки:
```bash
npm run dev
```

2. Откройте http://localhost:3000 в браузере

## Доступ к админ-панели

Для доступа к админ-панели используйте следующие учетные данные:
- URL: http://localhost:3000/admin/login
- Username: admin
- Password: admin123

## Структура проекта

```
├── client/             # Фронтенд (React + TypeScript)
│   ├── src/           # Исходный код
│   └── public/        # Статические файлы
├── server/            # Бэкенд (Express + TypeScript)
├── shared/            # Общие типы и утилиты
├── uploads/           # Загруженные файлы
└── package.json       # Зависимости и скрипты
```

## Полезные команды

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка проекта
- `npm run db:push` - Применение миграций базы данных
- `npm run check` - Проверка типов TypeScript

## Разработка

1. Все изменения в коде автоматически применяются благодаря hot-reload
2. Логи сервера отображаются в консоли
3. Ошибки TypeScript проверяются в реальном времени

## Отладка

- Используйте Chrome DevTools для отладки фронтенда
- Логи сервера доступны в консоли
- Для отладки API используйте инструменты вроде Postman или Insomnia 
# 🕌 Медресе Веб-Сайты

Деңгээлүү ислам окуу жайы үчүн заманбап, функционалдуу веб-сайты.

## 📋 Мазмуну

- [Установка](#установка)
- [Колдонуу](#колдонуу)
- [API Документация](#api-документация)
- [Структура](#структура)
- [Булак](#булак)

## 🚀 Установка

### Талабалар
- Node.js 14+ жана npm
- Python 3.6+ (опционалдуу)

### Кадамдар

1. **Репозиториянын клонун түзүңүз:**
```bash
git clone https://github.com/yourusername/medrese-sayt.git
cd medrese-sayt
```

2. **Зависимостиктерди орнотуңуз:**
```bash
npm install
```

3. **.env файлын конфигурацияланыңыз:**
```bash
cp .env.example .env
# Кеңесинде .env файлын чистиңиз
```

4. **Сервердин башталышы:**

Боюнча режимде:
```bash
npm start
```

Өндүрүш режимде (автоматтык перезагрузка):
```bash
npm run dev
```

## 📚 Колдонуу

### Frontend

1. `index.html` файлын браузерде ачыңыз
2. Же локалдык сервер аркылуу:
```bash
python -m http.server 8000
# же
npx http-server
```

### Backend API

Сервер `http://localhost:5000` адресинде иштейт

## 📖 API Документация

Swagger UI аркылуу интерактивдүү документацияны карасыңыз:
```
http://localhost:5000/api-docs
```

### Негизги Endpoints

#### Programs (Программалар)
- `GET /api/programs` - Бардык программаларды алуу
- `GET /api/programs/:id` - Биреи программаны алуу

#### Teachers (Устаздар)
- `GET /api/teachers` - Бардык устаздарды алуу
- `GET /api/teachers/:id` - Биреи устазды алуу

#### News (Жаңылыктар)
- `GET /api/news` - Жаңылыктарды алуу
- `GET /api/news/:id` - Биреи жаңылыктарды алуу

#### Admission (Кабыл алуу)
- `POST /api/admission` - Кабыл алуу формасын жиберүү
- `GET /api/submissions` - Бардык заявкаларды алуу (админ)
- `GET /api/submissions/:id` - Биреи заявканы алуу
- `PATCH /api/submissions/:id/status` - Заявканын абалын өзгөртүү

#### Statistics (Статистика)
- `GET /api/statistics` - Сайтын статистикасы

## 🗂️ Структура

```
medrese-sayt/
├── index.html           # Frontend башкы файлы
├── style.css           # Стилдер
├── script.js           # Frontend JavaScript
├── server.js           # Backend сервери
├── package.json        # Зависимостиктер
├── .env                # Окружение переменнылары
├── .env.example        # Пример .env файлы
└── README.md           # Бул файл
```

## 🔗 API Мисалдары

### Программаларды алуу
```bash
curl http://localhost:5000/api/programs
```

### Кабыл алуу формасын жиберүү
```bash
curl -X POST http://localhost:5000/api/admission \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ахмед Керим",
    "age": 15,
    "phone": "+996555123456",
    "email": "ahmed@example.com",
    "program": "quran",
    "level": "beginner",
    "message": "Куран окугум келет"
  }'
```

### Жаңылыктарды алуу
```bash
curl http://localhost:5000/api/news?category=kabilaluu
```

### Статистиканы алуу
```bash
curl http://localhost:5000/api/statistics
```

## 🛡️ Безопасность

- Форма маалыматтары валидация кылынат
- CORS орнотулган
- Input санитизация
- SQL инъекция коргонусу (параметрделинген sorguler)

## 📝 Лицензия

MIT License - бүтүн корутундулардын өтүлүгүндө вольнослуу колдону сал.

## 👥 Авторлар

Медресе Администрациясы
Email: info@medrese.kg

## 📞 Байланыш

- 📧 Email: info@medrese.kg
- 📱 Телефон: +996 (312) 123-45-67
- 🌐 Веб-сайт: https://medrese.kg

## 🐛 Жыйындарды Иллүстрирүү

Баалуу болсо, [Issues](https://github.com/yourusername/medrese-sayt/issues) ачыңыз.

## 💡 Кошумча Функциялар

Келечекте план кылынган:
- [ ] Аутентификация (JWT)
- [ ] Email уведомление системасы
- [ ] Admin панель
- [ ] Мобилдик приложение
- [ ] Видео окутуу модулу
- [ ] Чатбот асистент

---

**Happy Coding! 🚀**

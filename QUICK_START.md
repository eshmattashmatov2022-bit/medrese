# 🚀 МЕДРЕСЕ САЙТЫ - ТОЛУК ЖҮРГҮЗҮҮЧҮ

Бул документ фронтенд жана бэккенди иштетүүчүсүнүн жүргүзүүчүсүндүү.

## 📋 КАТАЛОГДУН СТРУКТУРАСЫ

```
medrese-sayt/
├── 📄 index.html              # Frontend башкы файл
├── 🎨 style.css              # CSS стилдер
├── ⚙️  script.js              # Frontend JavaScript
├── 📡 api-service.js          # API сервис класс
├── 🔧 server.js              # Backend Express сервери
├── 📦 package.json           # Node.js зависимостиктери
├── 🔐 .env                   # Окружение переменнылары
├── 📖 README.md              # Базалык документация
├── 🧪 API_EXAMPLES.md        # API мисалдары (curl)
├── 📋 openapi.yaml           # Swagger спецификация
└── 🚀 QUICK_START.md         # Бул файл

```

## 🎯 СЫСТЕМЫН АРХИТЕКТУРАСЫ

```
┌─────────────────────┐
│   FRONTEND          │
│  (HTML/CSS/JS)      │
│                     │
│  • index.html      │
│  • style.css       │
│  • script.js       │
│  • api-service.js  │
└──────────┬──────────┘
           │
      (HTTP/REST)
           │
           ▼
┌─────────────────────┐
│   BACKEND (API)     │
│   (Node.js/Express) │
│                     │
│  • server.js        │
│  • SQLite DB        │
│  • Swagger Docs     │
└─────────────────────┘
```

## 💻 ОРНОТУУ КАДАМДАРЫ

### 1️⃣ Зависимостиктерди орнотуу

```bash
# Medrese-sayt папкасына кирүүнү
cd medrese-sayt

# Node.js зависимостиктерін орнотуу
npm install
```

**Орнотулуучу пакеттер:**
- express - веб фреймворк
- cors - кросс-домен сурамчылардын коргонусу
- body-parser - JSON парсер
- swagger-ui-express - API документация UI
- swagger-jsdoc - Swagger генератору
- sqlite3 - база данных
- express-validator - форма валидация
- dotenv - окружение переменнылары
- nodemailer - email жиберүүчүсү
- uuid - уникалдуу ID генератору

### 2️⃣ Конфигурация (.env файл)

Эгерде .env файл жок болсо, аны түзүндүз:

```bash
cp .env.example .env
```

.env файлын ачуп:

```env
PORT=5000                    # Сервердин порту
NODE_ENV=development        # Režimi (development/production)
DATABASE_URL=./medrese.db   # Database файлы
JWT_SECRET=your_secret      # Чекчи (ийгилик үчүн)
EMAIL_HOST=smtp.gmail.com   # Email хосту
EMAIL_PORT=587              # Email порту
EMAIL_USER=your@gmail.com   # Email адресинизи
EMAIL_PASS=password         # Email паролю
```

## 🏃 ИШТЕТҮҮ КАДАМДАРЫ

### ВАРИАНТ 1: Өндүрүш Режиме (Автоматтык перезагрузка)

**Терминал 1 - Backend:**
```bash
npm run dev
```

**Терминал 2 - Frontend (опционалдуу):**
```bash
# Python
python -m http.server 8000

# же Node.js
npx http-server
```

Үндүү браузер:
- **Frontend**: `http://localhost:8000` же `file:///path/to/index.html`
- **Backend**: `http://localhost:5000`
- **API Docs**: `http://localhost:5000/api-docs`

---

### ВАРИАНТ 2: Боюнча Режиме

**Терминал 1 - Backend:**
```bash
npm start
```

---

## 🧪 СЫНАПЧЫЛАР

### 1. Сервердин абалын текшеру

```bash
curl http://localhost:5000/api/health
```

**Жакшы жооп:**
```json
{
  "status": "OK",
  "message": "Сервер иштеп жатат"
}
```

### 2. Программаларды алуу

```bash
curl http://localhost:5000/api/programs
```

### 3. Форма жиберүү (Frontend менен)

1. Браузерде `index.html` ачыңыз
2. "Кабыл алуу" бөлүмүнө жаңыл
3. Форманы толтуруңуз жана "Жиберүү" баскычын басыңыз
4. Ийгилик сообщениесин көрүңүз

### 4. Форма жиберүү (curl аркылуу)

```bash
curl -X POST http://localhost:5000/api/admission \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Асан Байимов",
    "age": 20,
    "phone": "+996777123456",
    "email": "asan@example.com",
    "program": "quran",
    "level": "beginner",
    "message": "Куран окугум келет"
  }'
```

### 5. Swagger документациясын ачуу

```
http://localhost:5000/api-docs
```

Интерактивдүү API документациясын карасыңыз жана сынап көрүңүз!

---

## 🔌 FRONTEND - BACKEND БАЙЛАНЫШЫ

Frontend автоматтык түрдө API менен чалышат:

**api-service.js** файл аркылуу:

```javascript
// Форма жиберүү
ApiMethods.submitAdmission({
    fullName: "Асан",
    age: 20,
    phone: "+996777123456",
    email: "asan@example.com",
    program: "quran",
    level: "beginner",
    message: "Куран окугум келет"
})
.then(response => console.log('Ийгилик:', response))
.catch(error => console.error('Ката:', error));
```

---

## 📊 API ENDPOINTS ЧАЛУЛАРЫ

### Окуу программалары алуу

```javascript
// API через сервис
api.get('/programs')
    .then(programs => console.log(programs))
    .catch(err => console.error(err));

// Же өндүрүшт функция колдону
ApiMethods.getPrograms()
    .then(programs => console.log(programs));
```

### Устаздарды алуу

```javascript
ApiMethods.getTeachers()
    .then(teachers => console.log(teachers));
```

### Жаңылыктарды алуу

```javascript
// Барлык жаңылыктар
ApiMethods.getNews()
    .then(news => console.log(news));

// Категория боюнча чыпкалоо
ApiMethods.getNews('kabilaluu')
    .then(news => console.log(news));
```

### Заявкаларды админ үчүн алуу

```javascript
// Жалпысы
ApiMethods.getSubmissions()
    .then(subs => console.log(subs));

// Абалы боюнча
ApiMethods.getSubmissions('pending')
    .then(subs => console.log(subs));

// Биреи заявка
ApiMethods.getSubmission('submission-id')
    .then(sub => console.log(sub));
```

### Абалын өзгөртүү (админ)

```javascript
ApiMethods.updateSubmissionStatus('submission-id', 'approved')
    .then(response => console.log(response));
```

---

## 🛡️ КАТА ЧЕЧҮҮ

### Ката 1: "Port is already in use"

```bash
# Windows: порту өлтүрүүнүн
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Ката 2: "Cannot find module"

```bash
# Зависимостиктерди кайра орнотуу
rm -rf node_modules package-lock.json
npm install
```

### Ката 3: "CORS ката"

.env файлында конфигурациялаңыз:

```env
CORS_ORIGIN=http://localhost:8000
```

### Ката 4: "Database error"

```bash
# Database файлын өчүрүп кайра түзүүнүң
rm medrese.db
npm start
```

---

## 🔧 ӨНДҮРҮШ РЕЖИМИНДЕГИ СЫНАКТАР

### Postman/Insomnia колдонуу

1. Postman/Insomnia ачыңыз
2. **New Request** түзүңүз
3. **Collection** сактаңыз: `openapi.yaml`
4. API методдарын сынап көрүңүз

### Browser DevTools

1. Browser ачыңыз
2. F12 түйсөңүз (DevTools)
3. Console табын ачыңыз
4. Төмөндөгүлөрдү чалыңыз:

```javascript
// Программалар алуу
ApiMethods.getPrograms().then(console.log);

// Статистика
ApiMethods.getStatistics().then(console.log);

// Жаңылыктар
ApiMethods.getNews().then(console.log);
```

---

## 📊 DATABASE МАЗМУНУ

API автоматтык түрдө төмөндөгүлөр менен толоттуруларын:

### Programs Таблица
- Куран жаттоо
- Шариат жана Фикх
- Араб тили
- Адеп жана Ахлак

### Teachers Таблица
- Шейх Мухаммад Али
- Доктор Фаруқ Исмаил
- Ахмад Сафуллин
- Наталия Исмакова

### News Таблица
- Жаңы окуучулар кабыл алуу башталды
- Раматан жарыягы жана тәндіктігі
- Окуучулардын жетишкендиктери

---

## 📝 ЛОЗГУЛАР ЖА.ШЫ

### Console логдары

Backend өндүрүш логдары:
```
✓ SQLite базасы иштете
🕌 Медресе бэккент сервери 5000 портунда иштеп жатат
📚 Swagger документация: http://localhost:5000/api-docs
🏠 Сагдык сынапчысы: http://localhost:5000/api/health
```

Frontend консольдо:
```javascript
// Баарын байланыш текшеңиз
console.log(window.medrese);
```

---

## 🚀 ПРОДАКШЫНЫ ОРНОТУУ (КОШУМЧА)

### Vercel / Heroku жайлуулацы үчүн

1. **GitHub repo түзүңүз**
```bash
git init
git add .
git commit -m "Медресе сайты"
git push origin main
```

2. **Vercel орнотуу**
```bash
npm install -g vercel
vercel
```

3. **Heroku орнотуу**
```bash
heroku create medrese-app
git push heroku main
```

---

## 📚 ДОПОЛНИТЕЛЬНЫХ РЕСУРСТАР

- **Express документация**: https://expressjs.com
- **Swagger/OpenAPI**: https://swagger.io
- **SQLite документация**: https://www.sqlite.org
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## ❓ ТЕЗ СУРАМЧЫЛАРДЫ ЖООП

**Q: Фронтенд жана бэккенд порттарындын айырмасы?**
A: Frontend: 8000 (өндөрүш), Backend: 5000 (API сервер)

**Q: API документациясын кайда карасам болот?**
A: `http://localhost:5000/api-docs` (Swagger UI)

**Q: Форма маалыматтары кайда сакталган?**
A: SQLite базасында (`:memory:` же `medrese.db`)

**Q: Паролду ойлоп чыкпадым?**
A: `.env.example` ны `.env` кылып өзгөртүңүз

**Q: Production га кантип издекчүмүн?**
A: `NODE_ENV=production` жана сертификатты орнотүңүз

---

## ✅ ЧЕК-ЛИСТ

Иштетүүдөн мурун текшеңиз:

- [ ] Node.js орнотулган (`node -v`)
- [ ] npm орнотулган (`npm -v`)
- [ ] `npm install` чалынды
- [ ] `.env` файл жүргүзүлдү
- [ ] Port 5000 эркин (эгерде начачы, -P)
- [ ] Frontend жана Backend эки терминалда иштеген

---

## 🎉 СОТТУК!

Медресе сайты иштеп жатат! 🕌

Келечек функциялар:
- [ ] Admin панель
- [ ] User аутентификация
- [ ] Email билдирүү
- [ ] Мобилдик приложение
- [ ] Чатбот

---

**Колдонуу үчүн сююл кушадыңыз! 🚀**

Суроолоор болсо: info@medrese.kg


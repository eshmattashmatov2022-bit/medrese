# 🕌 МЕДРЕСЕ API - CURL МИСАЛДАРЫ

## Health Check (Сагдыгын сынапчы)
```bash
curl http://localhost:5000/api/health
```

## PROGRAMS (Программалар)

### 1. Бардык программаларды алуу
```bash
curl http://localhost:5000/api/programs
```

### 2. Биреи программаны алуу
```bash
curl http://localhost:5000/api/programs/{id}
```

**Мисал ответы:**
```json
[
  {
    "id": "1234567",
    "name": "Куран жаттоо",
    "description": "Куранды толугу менен жаттоо программасы. Мөөнөтү 3-4 жыл.",
    "icon": "📖",
    "duration": "3-4 жыл",
    "details": "[\"Аңы-сезүүлүү окутуу\", \"Түжүндүүлүк жана орфография\", \"Таджвид\"]"
  }
]
```

---

## TEACHERS (Устаздар)

### 1. Бардык устаздарды алуу
```bash
curl http://localhost:5000/api/teachers
```

### 2. Биреи устазды алуу
```bash
curl http://localhost:5000/api/teachers/{id}
```

**Мисал ответы:**
```json
{
  "id": "teacher-id-123",
  "name": "Шейх Мухаммад Али",
  "specialty": "Куран жаттоо мугалими",
  "bio": "20 жылдык тажрыйбасы. Алынган орундубу бир нечей окуучулары.",
  "rating": 5,
  "avatar": "شيخ"
}
```

---

## NEWS (Жаңылыктар)

### 1. Жаңылыктарды алуу (бардыгы)
```bash
curl http://localhost:5000/api/news
```

### 2. Жаңылыктарды категория боюнча чыпкалоо
```bash
curl "http://localhost:5000/api/news?category=kabilaluu"
```

**Категориялар:**
- `kabilaluu` - Кабыл алуу
- `ishchara` - Иш-чара
- `jetishkendik` - Жетишкендик

### 3. Биреи жаңылыктарды алуу
```bash
curl http://localhost:5000/api/news/{id}
```

**Мисал ответы:**
```json
{
  "id": "news-id-123",
  "title": "Жаңы окуучулар кабыл алуу башталды",
  "content": "Кыйын мейманкана деңгээлүү ийримдер үчүн кабыл алуу чакыруу чакырат.",
  "date": "2024-08-14",
  "category": "kabilaluu"
}
```

---

## ADMISSION (Кабыл алуу формасы)

### 1. Кабыл алуу формасын жиберүү
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

**Колдонулуучу программалар:**
- `quran` - Куран жаттоо
- `sharia` - Шариат жана Фикх
- `arabic` - Араб тили
- `morality` - Адеп жана Ахлак

**Деңгээлдер:**
- `beginner` - Башталгыч
- `intermediate` - Орто
- `advanced` - Прогрессивдүү

**Мисал ответы:**
```json
{
  "success": true,
  "message": "Форма ийгиликтүү жиберилди",
  "id": "submission-id-123"
}
```

### 2. Ката жооп (Валидация жоопсуздугу)
```json
{
  "errors": [
    {
      "param": "age",
      "msg": "Жашы 5-80 арасында болушу керек"
    }
  ]
}
```

---

## SUBMISSIONS (Заявкалар - АДМИН)

### 1. Бардык заявкаларды алуу
```bash
curl http://localhost:5000/api/submissions
```

### 2. Заявкаларды абалы боюнча чыпкалоо
```bash
curl "http://localhost:5000/api/submissions?status=pending"
```

**Абалдар:**
- `pending` - Караганда жатат
- `approved` - Макул болунду
- `rejected` - Четинен кайтарылды

### 3. Биреи заявканы алуу
```bash
curl http://localhost:5000/api/submissions/{id}
```

### 4. Заявканын абалын өзгөртүү
```bash
curl -X PATCH http://localhost:5000/api/submissions/{id}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

**Мисал ответы:**
```json
{
  "success": true,
  "message": "Абалы өзгөртүлдү"
}
```

---

## STATISTICS (Статистика)

### Сайтын статистикасын алуу
```bash
curl http://localhost:5000/api/statistics
```

**Мисал ответы:**
```json
{
  "totalSubmissions": 42,
  "approvedSubmissions": 38,
  "totalTeachers": 4,
  "totalPrograms": 4
}
```

---

## 🔑 AUTHORIZATION (Авторизация)

Келечекте API уясында:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/submissions
```

---

## 📝 REQUEST BODY МИСАЛДАРЫ

### Жоп берүүчүсүнүң Формасы
```json
{
  "fullName": "Асан Байимов",
  "age": 25,
  "phone": "+996777456123",
  "email": "asan@example.com",
  "program": "sharia",
  "level": "intermediate",
  "message": "Шариат жана Фикхты окугум келет"
}
```

### Абалын өзгөртүү
```json
{
  "status": "approved"
}
```

---

## 🧪 POSTMAN / INSOMNIA КОЛДОНУУ

1. **New Request** түзүңүз
2. **Method** дарди HTTP методун тандаңыз (GET, POST, PATCH)
3. **URL** ди киргизиңиз
4. **Body** секциясында JSON киргизиңиз
5. **Send** баскычын басыңыз

---

## 🐛 Ката Жообдору

### 400 Bad Request
```json
{
  "errors": [
    {
      "param": "phone",
      "msg": "Телефон номери туура эмес"
    }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Маршрут табылган жок"
}
```

### 500 Internal Server Error
```json
{
  "error": "Ички сервер катасы"
}
```

---

## 💡 КЕҢЕШТҮҮЛҮК

1. API документациясын көрүү үчүн: `http://localhost:5000/api-docs`
2. Сервери өндөрүш режимде іске қос: `npm run dev`
3. Жыйындарды console.log() менен текшеңиз
4. Swagger UI ашуу жана мүмкүнчүлүктөрдү сынап көрүңүз

---

**Коо сыналд! 🚀**

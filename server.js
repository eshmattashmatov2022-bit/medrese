/**
 * =====================================================
 * МЕДРЕСЕ БЭККЕНТ API
 * Express.js сервер
 * =====================================================
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
// ===== DATABASE ИНИЦИАЛИЗАЦИЯ =====
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('✓ SQLite базасы иштете');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
    // Admission submissions таблица
    db.run(`
        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY,
            fullName TEXT NOT NULL,
            age INTEGER NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            program TEXT NOT NULL,
            level TEXT NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Programs таблица
    db.run(`
        CREATE TABLE IF NOT EXISTS programs (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            duration TEXT,
            details TEXT
        )
    `);

    // Teachers таблица
    db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            bio TEXT,
            rating INTEGER,
            avatar TEXT
        )
    `);

    // News таблица
    db.run(`
        CREATE TABLE IF NOT EXISTS news (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            date DATETIME,
            category TEXT
        )
    `);

    // Инициализация пример данных
    seedDatabase();
    });
}

function seedDatabase() {
    // Programs
    const programs = [
        {
            id: uuidv4(),
            name: 'Куран жаттоо',
            description: 'Куранды толугу менен жаттоо программасы. Мөөнөтү 3-4 жыл.',
            icon: '📖',
            duration: '3-4 жыл',
            details: JSON.stringify(['Аңы-сезүүлүү окутуу', 'Түжүндүүлүк жана орфография', 'Таджвид'])
        },
        {
            id: uuidv4(),
            name: 'Шариат жана Фикх',
            description: 'Исламдык мыйзамчылык жана практикалык учендиктердин окутуу.',
            icon: '⚖️',
            duration: '2 жыл',
            details: JSON.stringify(['Исламдык мыйзамчылык', 'Адатка туруктуу чыгыштар', 'Ибадат жана этикасы'])
        },
        {
            id: uuidv4(),
            name: 'Араб тили',
            description: 'Араб түнүнүн окутуу, грамматикасы жана адабияты.',
            icon: '🗣️',
            duration: '1.5 жыл',
            details: JSON.stringify(['Араб грамматикасы', 'Макала окушуу', 'Диалог жана сүйлөө'])
        },
        {
            id: uuidv4(),
            name: 'Адеп жана Ахлак',
            description: 'Ырымдуу жана адептүү жашоо образы окутуу.',
            icon: '💚',
            duration: '1 жыл',
            details: JSON.stringify(['Исламдык адебиятты', 'Ахлак жана этика', 'Коомчулук ишмерчилиги'])
        }
    ];

    programs.forEach(prog => {
        db.run(
            `INSERT OR IGNORE INTO programs (id, name, description, icon, duration, details) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [prog.id, prog.name, prog.description, prog.icon, prog.duration, prog.details]
        );
    });

    // Teachers
    const teachers = [
        {
            id: uuidv4(),
            name: 'Шейх Мухаммад Али',
            specialty: 'Куран жаттоо мугалими',
            bio: '20 жылдык тажрыйбасы. Алынган орундубу бир нечей окуучулары.',
            rating: 5,
            avatar: 'شيخ'
        },
        {
            id: uuidv4(),
            name: 'Доктор Фаруқ Исмаил',
            specialty: 'Шариат жана Фикх',
            bio: 'Медина Университетинен окуган, 15 жылдык опыты бар.',
            rating: 5,
            avatar: 'د'
        },
        {
            id: uuidv4(),
            name: 'Ахмад Сафуллин',
            specialty: 'Араб Тили жана Грамматика',
            bio: 'Араб тилинин профессионалы, интерактивдүү окутуу методу.',
            rating: 4,
            avatar: 'أ'
        },
        {
            id: uuidv4(),
            name: 'Наталия Исмакова',
            specialty: 'Адеп жана Психология',
            bio: 'Психолог жана педагог, окуучулардын өндөрүшүндө адистеш.',
            rating: 5,
            avatar: 'ن'
        }
    ];

    teachers.forEach(teacher => {
        db.run(
            `INSERT OR IGNORE INTO teachers (id, name, specialty, bio, rating, avatar) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher.id, teacher.name, teacher.specialty, teacher.bio, teacher.rating, teacher.avatar]
        );
    });

    // News
    const news = [
        {
            id: uuidv4(),
            title: 'Жаңы окуучулар кабыл алуу башталды',
            content: 'Кыйын мейманкана деңгээлүү ийримдер үчүн кабыл алуу чакыруу чакырат. Барлык курстарга орун бар.',
            date: new Date('2024-08-14'),
            category: 'кабыл алуу'
        },
        {
            id: uuidv4(),
            title: 'Раматан жарыягы жана тәндіктігі',
            content: 'Раматан ая куттуу иш-чара 25-августта болот. Бул салтанаттуу сыкта таң-көртүү болмок.',
            date: new Date('2024-08-10'),
            category: 'иш-чара'
        },
        {
            id: uuidv4(),
            title: 'Окуучулардын жетишкендиктери',
            content: 'Биздин 5 окуучу Куранды толугу менен жаттап, сертификат алышты. Аларга ыраажыбыз!',
            date: new Date('2024-08-05'),
            category: 'жетишкендик'
        }
    ];

    news.forEach(n => {
        db.run(
            `INSERT OR IGNORE INTO news (id, title, content, date, category) 
             VALUES (?, ?, ?, ?, ?)`,
            [n.id, n.title, n.content, n.date, n.category]
        );
    });
}

// ===== SWAGGER ДОКУМЕНТАЦИЯ =====
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Медресе API',
            version: '1.0.0',
            description: 'Медресе веб-сайты үчүн REST API документациясы',
            contact: {
                name: 'Медресе Администрация',
                email: 'info@medrese.kg'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Локалдык сервер'
            },
            {
                url: 'https://api.medrese.kg',
                description: 'Боюнча сервер'
            }
        ],
        components: {
            schemas: {
                Submission: {
                    type: 'object',
                    required: ['fullName', 'age', 'phone', 'program', 'level'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Уникалдуу ID'
                        },
                        fullName: {
                            type: 'string',
                            description: 'Толук аты-жөнү'
                        },
                        age: {
                            type: 'integer',
                            description: 'Жашы'
                        },
                        phone: {
                            type: 'string',
                            description: 'Телефон номери'
                        },
                        email: {
                            type: 'string',
                            description: 'Email адреси'
                        },
                        program: {
                            type: 'string',
                            enum: ['quran', 'sharia', 'arabic', 'morality'],
                            description: 'Каалаган программа'
                        },
                        level: {
                            type: 'string',
                            enum: ['beginner', 'intermediate', 'advanced'],
                            description: 'Деңгээл'
                        },
                        message: {
                            type: 'string',
                            description: 'Кошумча маалымат'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected'],
                            description: 'Абалы'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Түзүлгөн убактысы'
                        }
                    }
                },
                Program: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        icon: { type: 'string' },
                        duration: { type: 'string' },
                        details: { type: 'array' }
                    }
                },
                Teacher: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        specialty: { type: 'string' },
                        bio: { type: 'string' },
                        rating: { type: 'integer' },
                        avatar: { type: 'string' }
                    }
                },
                News: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        category: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== API ENDPOINTS =====

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Сервердин абалын текшеру
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервер иштеп жатат
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Сервер иштеп жатат' });
});

/**
 * @swagger
 * /api/programs:
 *   get:
 *     summary: Бардык программаларды алуу
 *     tags: [Programs]
 *     responses:
 *       200:
 *         description: Программалардын тизмеси
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 */
app.get('/api/programs', (req, res) => {
    db.all('SELECT * FROM programs', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/programs/{id}:
 *   get:
 *     summary: Биреи программаны алуу
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Программанын маалыматы
 */
app.get('/api/programs/:id', (req, res) => {
    db.get('SELECT * FROM programs WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Программа табылган жок' });
        }
        res.json(row);
    });
});

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Бардык устаздарды алуу
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Устаздардын тизмеси
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
app.get('/api/teachers', (req, res) => {
    db.all('SELECT * FROM teachers', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Биреи устазды алуу
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
app.get('/api/teachers/:id', (req, res) => {
    db.get('SELECT * FROM teachers WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Устаз табылган жок' });
        }
        res.json(row);
    });
});

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Жаңылыктарды алуу
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Категория боюнча чыпкалоо
 *     responses:
 *       200:
 *         description: Жаңылыктардын тизмеси
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */
app.get('/api/news', (req, res) => {
    let query = 'SELECT * FROM news ORDER BY date DESC';
    let params = [];

    if (req.query.category) {
        query += ' WHERE category = ?';
        params.push(req.query.category);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Биреи жаңылыктарды алуу
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
app.get('/api/news/:id', (req, res) => {
    db.get('SELECT * FROM news WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Жаңылык табылган жок' });
        }
        res.json(row);
    });
});

/**
 * @swagger
 * /api/admission:
 *   post:
 *     summary: Кабыл алуу формасын жиберүү
 *     tags: [Admission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 *     responses:
 *       201:
 *         description: Форма ийгиликтүү жиберилди
 *       400:
 *         description: Жоопсуз маалыматтар
 */
app.post('/api/admission', [
    body('fullName').trim().isLength({ min: 3 }).withMessage('Аты-жөнү кеминде 3 символ болушу керек'),
    body('age').isInt({ min: 5, max: 80 }).withMessage('Жашы 5-80 арасында болушу керек'),
    body('phone').matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
        .withMessage('Телефон номери туура эмес'),
    body('email').optional().isEmail().withMessage('Email туура эмес'),
    body('program').isIn(['quran', 'sharia', 'arabic', 'morality']).withMessage('Программа туура эмес'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Деңгээл туура эмес')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, age, phone, email, program, level, message } = req.body;
    const id = uuidv4();

    db.run(
        `INSERT INTO submissions (id, fullName, age, phone, email, program, level, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, fullName, age, phone, email, program, level, message],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                success: true,
                message: 'Форма ийгиликтүү жиберилди',
                id: id
            });
        }
    );
});

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Бардык кабыл алуу заявкаларын алуу (админ)
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Абалы боюнча чыпкалоо
 *     responses:
 *       200:
 *         description: Заявкалардын тизмеси
 */
app.get('/api/submissions', (req, res) => {
    let query = 'SELECT * FROM submissions ORDER BY createdAt DESC';
    let params = [];

    if (req.query.status) {
        query += ' WHERE status = ?';
        params.push(req.query.status);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/submissions/{id}:
 *   get:
 *     summary: Биреи заявканы алуу
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
app.get('/api/submissions/:id', (req, res) => {
    db.get('SELECT * FROM submissions WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Заявка табылган жок' });
        }
        res.json(row);
    });
});

/**
 * @swagger
 * /api/submissions/{id}/status:
 *   patch:
 *     summary: Заявканын абалын өзгөртүү
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 */
app.patch('/api/submissions/:id/status', (req, res) => {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Абалы туура эмес' });
    }

    db.run(
        'UPDATE submissions SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Заявка табылган жок' });
            }
            res.json({ success: true, message: 'Абалы өзгөртүлдү' });
        }
    );
});

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Сайтын статистикасы
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Статистика маалыматтары
 */
app.get('/api/statistics', (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as total FROM submissions', (err, row) => {
        stats.totalSubmissions = row?.total || 0;

        db.get('SELECT COUNT(*) as approved FROM submissions WHERE status = ?', ['approved'], (err, row) => {
            stats.approvedSubmissions = row?.approved || 0;

            db.get('SELECT COUNT(*) as teachers FROM teachers', (err, row) => {
                stats.totalTeachers = row?.teachers || 0;

                db.get('SELECT COUNT(*) as programs FROM programs', (err, row) => {
                    stats.totalPrograms = row?.programs || 0;

                    res.json(stats);
                });
            });
        });
    });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('Ката:', err);
    res.status(500).json({
        error: 'Ички сервер катасы',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Статикалык файлдарды (HTML, CSS, JS) тейлөө
app.use(express.static(__dirname));

// Баш баракты көрсөтүү
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут табылган жок' });
});

// ===== SERVER START =====
app.listen(PORT, () => {
    console.log(`\n🕌 Медресе бэккент сервери ${PORT} портунда иштеп жатат`);
    console.log(`📚 Swagger документация: http://localhost:${PORT}/api-docs`);
    console.log(`🏠 Сагдык сынапчысы: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;

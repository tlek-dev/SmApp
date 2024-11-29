const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const config = require('./config');
const logger = require('./logger');
const verifyToken = require('./middleware/auth');

const app = express();
const port = 3005;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = new sqlite3.Database(config.DATABASE_PATH);

// Create scores table with additional columns
db.run(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL,
        score INTEGER NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        level INTEGER DEFAULT 1,
        lines_cleared INTEGER DEFAULT 0,
        game_duration INTEGER DEFAULT 0
    )
`);

// Create admin logs table
db.run(`
    CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (username !== config.ADMIN_USERNAME || 
            !(await bcrypt.compare(password, config.ADMIN_PASSWORD))) {
            logger.warn(`Failed login attempt for username: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        logger.info(`Admin logged in: ${username}`);
        res.json({ token });
    } catch (err) {
        logger.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get scores with pagination and filtering
app.get('/api/scores', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || config.PAGE_SIZE;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'score';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const query = `
        SELECT id, nickname, score, datetime(date, 'localtime') as date,
               level, lines_cleared, game_duration
        FROM scores
        WHERE nickname LIKE ?
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
    `;

    const countQuery = `
        SELECT COUNT(*) as total
        FROM scores
        WHERE nickname LIKE ?
    `;

    try {
        db.get(countQuery, [`%${search}%`], (err, row) => {
            if (err) throw err;
            const total = row.total;

            db.all(query, [`%${search}%`, limit, offset], (err, rows) => {
                if (err) throw err;
                res.json({
                    scores: rows,
                    pagination: {
                        total,
                        pages: Math.ceil(total / limit),
                        current: page
                    }
                });
            });
        });
    } catch (err) {
        logger.error('Error fetching scores:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add new score
app.post('/api/scores', (req, res) => {
    const { nickname, score, level, lines_cleared, game_duration } = req.body;
    
    if (!nickname || !score) {
        return res.status(400).json({ error: 'Nickname and score are required' });
    }

    const query = `
        INSERT INTO scores (nickname, score, level, lines_cleared, game_duration)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query,
        [nickname, score, level || 1, lines_cleared || 0, game_duration || 0],
        function(err) {
            if (err) {
                logger.error('Error adding score:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({
                id: this.lastID,
                nickname,
                score,
                level,
                lines_cleared,
                game_duration,
                date: new Date().toISOString()
            });
        }
    );
});

// Protected routes
app.use('/api/admin', verifyToken);

// Delete score (admin only)
app.delete('/api/admin/scores/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM scores WHERE id = ?', id, (err) => {
        if (err) {
            logger.error('Error deleting score:', err);
            return res.status(500).json({ error: err.message });
        }

        // Log the action
        db.run(
            'INSERT INTO admin_logs (action, details) VALUES (?, ?)',
            ['delete_score', `Score ID: ${id}`]
        );

        logger.info(`Score deleted by admin: ${id}`);
        res.json({ message: 'Score deleted successfully' });
    });
});

// Update score (admin only)
app.put('/api/admin/scores/:id', (req, res) => {
    const { id } = req.params;
    const { nickname, score, level, lines_cleared, game_duration } = req.body;

    const query = `
        UPDATE scores
        SET nickname = ?, score = ?, level = ?, lines_cleared = ?, game_duration = ?
        WHERE id = ?
    `;

    db.run(query,
        [nickname, score, level, lines_cleared, game_duration, id],
        (err) => {
            if (err) {
                logger.error('Error updating score:', err);
                return res.status(500).json({ error: err.message });
            }

            // Log the action
            db.run(
                'INSERT INTO admin_logs (action, details) VALUES (?, ?)',
                ['update_score', `Score ID: ${id}`]
            );

            logger.info(`Score updated by admin: ${id}`);
            res.json({ message: 'Score updated successfully' });
        }
    );
});

// Get admin logs (admin only)
app.get('/api/admin/logs', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || config.PAGE_SIZE;
    const offset = (page - 1) * limit;

    const query = `
        SELECT id, action, details, datetime(timestamp, 'localtime') as timestamp
        FROM admin_logs
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
    `;

    db.all(query, [limit, offset], (err, rows) => {
        if (err) {
            logger.error('Error fetching admin logs:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Admin Routes

// Get all users
app.get('/api/admin/users', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        db.all('SELECT id, username, role, status, created_at, last_login FROM users', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } catch (err) {
        logger.error('Error fetching users:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update user status
app.put('/api/admin/users/:id/status', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
        db.run('UPDATE users SET status = ? WHERE id = ?', [status, id], function(err) {
            if (err) throw err;
            
            // Log the action
            db.run('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
                [req.user.id, 'update_user_status', `Updated user ${id} status to ${status}`]);
            
            res.json({ message: 'User status updated' });
        });
    } catch (err) {
        logger.error('Error updating user status:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get game settings
app.get('/api/admin/settings', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        db.all('SELECT * FROM game_settings', (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } catch (err) {
        logger.error('Error fetching settings:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update game settings
app.put('/api/admin/settings/:key', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { key } = req.params;
    const { value } = req.body;

    try {
        db.run('UPDATE game_settings SET value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE key = ?',
            [value, req.user.id, key], function(err) {
                if (err) throw err;
                
                // Log the action
                db.run('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
                    [req.user.id, 'update_setting', `Updated ${key} to ${value}`]);
                
                res.json({ message: 'Setting updated' });
            });
    } catch (err) {
        logger.error('Error updating setting:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get admin logs
app.get('/api/admin/logs', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        db.all(`
            SELECT l.*, u.username 
            FROM admin_logs l 
            JOIN users u ON l.admin_id = u.id 
            ORDER BY l.created_at DESC 
            LIMIT 100
        `, (err, rows) => {
            if (err) throw err;
            res.json(rows);
        });
    } catch (err) {
        logger.error('Error fetching admin logs:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create announcement
app.post('/api/admin/announcements', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { title, content } = req.body;

    try {
        db.run('INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)',
            [title, content, req.user.id], function(err) {
                if (err) throw err;
                
                // Log the action
                db.run('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
                    [req.user.id, 'create_announcement', `Created announcement: ${title}`]);
                
                res.json({ id: this.lastID, message: 'Announcement created' });
            });
    } catch (err) {
        logger.error('Error creating announcement:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});

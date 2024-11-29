module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: '24h',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '$2a$10$b6bbeU/tZ81xGwLCBsP49uFfho1wKyuXeK7WC1BshyzZZAthUGkc.', // admin123
    DATABASE_PATH: './scores.db',
    PAGE_SIZE: 10
};

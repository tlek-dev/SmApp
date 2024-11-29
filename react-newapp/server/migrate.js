const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create database connection
const db = new sqlite3.Database('./scores.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database');
});

// Read and execute migration SQL
const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');

// Run migrations
db.serialize(() => {
    db.exec(migrationSQL, (err) => {
        if (err) {
            console.error('Error running migrations:', err);
            process.exit(1);
        }
        console.log('Migrations completed successfully');
        db.close();
    });
});

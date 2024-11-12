const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Files table
        db.run(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                filename TEXT NOT NULL,
                original_name TEXT NOT NULL,
                mime_type TEXT NOT NULL,
                size INTEGER NOT NULL,
                share_link TEXT UNIQUE,
                position_x INTEGER DEFAULT 0,
                position_y INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Tags table
        db.run(`
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id INTEGER,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (file_id) REFERENCES files (id)
            )
        `);

        // File views table (simplified to track individual views)
        db.run(`
            CREATE TABLE IF NOT EXISTS file_views (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id INTEGER,
                ip_address TEXT,
                viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (file_id) REFERENCES files (id)
            )
        `);

        // Drop the view_count column if it exists (you'll need to handle this carefully if the table already exists)
        db.run(`
            PRAGMA foreign_keys=off;
            
            BEGIN TRANSACTION;
            
            -- Create a new temporary table with the correct structure
            CREATE TABLE IF NOT EXISTS file_views_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id INTEGER,
                ip_address TEXT,
                viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (file_id) REFERENCES files (id)
            );
            
            -- Copy data from the old table to the new one (if the old table exists)
            INSERT OR IGNORE INTO file_views_new (id, file_id, viewed_at)
            SELECT id, file_id, viewed_at FROM file_views;
            
            -- Drop the old table
            DROP TABLE IF EXISTS file_views;
            
            -- Rename the new table to the original name
            ALTER TABLE file_views_new RENAME TO file_views;
            
            COMMIT;
            
            PRAGMA foreign_keys=on;
        `);

        // Create indexes for better performance
        db.run(`CREATE INDEX IF NOT EXISTS idx_file_views_file_id ON file_views(file_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_files_share_link ON files(share_link)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_tags_file_id ON tags(file_id)`);
    });
}

module.exports = db;
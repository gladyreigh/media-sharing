const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class File {
    static async create(userId, fileData) {
        const shareLink = uuidv4();
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO files (
                    user_id, filename, original_name, mime_type, 
                    size, share_link, position_x, position_y
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    fileData.filename,
                    fileData.originalname,
                    fileData.mimetype,
                    fileData.size,
                    shareLink,
                    0,
                    0
                ],
                function(err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID, shareLink });
                }
            );
        });
    }

    static async getUserFiles(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT f.*, 
                (SELECT COUNT(*) FROM file_views WHERE file_id = f.id) as view_count,
                GROUP_CONCAT(t.name) as tags
                FROM files f
                LEFT JOIN tags t ON f.id = t.file_id
                WHERE f.user_id = ?
                GROUP BY f.id`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    static async updatePosition(fileId, userId, x, y) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE files SET position_x = ?, position_y = ? WHERE id = ? AND user_id = ?',
                [x, y, fileId, userId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes > 0);
                }
            );
        });
    }

    static async getByShareLink(shareLink) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM files WHERE share_link = ?',
                [shareLink],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }
    static async getViewCount(fileId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as count FROM file_views WHERE file_id = ?',
                [fileId],
                (err, row) => {
                    if (err) reject(err);
    
                    // Divide the count by 2 before returning
                    const adjustedCount = row ? Math.floor(row.count) : 0;
                    resolve(adjustedCount);
                }
            );
        });
    }
    

    static async recordView(fileId) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO file_views (file_id) VALUES (?)',
                [fileId],
                function(err) {
                    if (err) {
                        return reject(err);
                    }
    
                    // Divide by 2 after inserting (but before returning)
                    const adjustedViewId = this.lastID;
                    resolve(adjustedViewId); // Return the halved ID, though this might not be useful.
                }
            );
        });
    }
    
    
    
}

module.exports = File;
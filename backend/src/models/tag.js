const db = require('../config/database');

class Tag {
    static async addTags(fileId, tags) {
        const promises = tags.map(tag => {
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO tags (file_id, name) VALUES (?, ?)',
                    [fileId, tag],
                    function(err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });
        });

        return Promise.all(promises);
    }

    static async getFileTags(fileId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT name FROM tags WHERE file_id = ?',
                [fileId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows.map(row => row.name));
                }
            );
        });
    }

    static async removeTags(fileId) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM tags WHERE file_id = ?',
                [fileId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });
    }
}

module.exports = Tag;
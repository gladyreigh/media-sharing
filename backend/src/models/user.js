const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [username, hashedPassword],
                    function(err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }

    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, created_at FROM users WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }
}

module.exports = User;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

// Get file statistics
router.get('/file/:id', auth, async (req, res) => {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.get(
                `SELECT 
                    COUNT(*) as total_views,
                    MIN(viewed_at) as first_view,
                    MAX(viewed_at) as last_view
                FROM file_views 
                WHERE file_id = ?`,
                [req.params.id],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's overall statistics
router.get('/user', auth, async (req, res) => {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.get(
                `SELECT 
                    COUNT(DISTINCT f.id) as total_files,
                    COUNT(fv.id) as total_views,
                    COUNT(DISTINCT t.name) as total_tags
                FROM files f
                LEFT JOIN file_views fv ON f.id = fv.file_id
                LEFT JOIN tags t ON f.id = t.file_id
                WHERE f.user_id = ?`,
                [req.user.id],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
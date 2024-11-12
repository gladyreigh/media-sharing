const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const File = require('../models/file');
const Tag = require('../models/tag');

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileData = await File.create(req.user.id, req.file);
        
        if (req.body.tags) {
            const tags = req.body.tags.split(',').map(tag => tag.trim());
            await Tag.addTags(fileData.id, tags);
        }

        res.status(201).json(fileData);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's files
router.get('/', auth, async (req, res) => {
    try {
        const files = await File.getUserFiles(req.user.id);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update file position
router.patch('/:id/position', auth, async (req, res) => {
    try {
        const { x, y } = req.body;
        const updated = await File.updatePosition(req.params.id, req.user.id, x, y);
        
        if (!updated) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get file by share link
router.get('/share/:shareLink', async (req, res) => {
    try {
        const file = await File.getByShareLink(req.params.shareLink);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Record the view (inserting a record in the file_views table)
        await File.recordView(file.id);

        // Get the updated view count
        let viewCount = await File.getViewCount(file.id);

        // Divide the view count by 2 before returning it
        // viewCount = Math.floor(viewCount / 2);
        viewCount = Math.floor(viewCount);

        // Return the file data with adjusted view count
        res.json({
            ...file,
            viewCount
        });

    } catch (error) {
        console.error('Error fetching shared file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
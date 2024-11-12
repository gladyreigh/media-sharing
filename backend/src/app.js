require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const trackFileView = require('./middleware/trackFileView');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(cors());
app.use(express.json());

// Define routes first
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/share', fileRoutes);

// Apply trackFileView middleware before static file serving
app.use(trackFileView);

// Static file serving should be last
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
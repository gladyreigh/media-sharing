const db = require('../config/database');
const File = require('../models/file');
const path = require('path');
const url = require('url');

const trackFileView = async (req, res, next) => {
  try {
    // Get the clean pathname without query parameters and trailing slash
    const pathname = url.parse(req.originalUrl).pathname.toLowerCase().replace(/\/$/, '');

    // Check referer to prevent counting views from dashboard and other admin pages
    const referer = req.headers.referer || '';
    const ignoredRefererPaths = ['/dashboard', '/admin', '/profile', '/settings'];
    
    if (ignoredRefererPaths.some(path => referer.includes(path))) {
      console.log(`Skipping view count - File accessed from ${referer}`);
      return next();
    }

    // Then check if it's an uploads route
    if (!pathname.startsWith('/uploads/')) {
      console.log(`Not an uploads route: ${pathname}`);
      return next();
    }

    // File extension check
    const fileExtensionRegex = /\.(jpg|jpeg|png|gif|pdf|mp4|mp3|doc|docx|txt)$/i;
    if (!fileExtensionRegex.test(pathname)) {
      console.log(`Not a trackable file type: ${pathname}`);
      return next();
    }

    // Extract filename
    const filename = path.basename(pathname);
    console.log(`Processing file view: ${filename}`);

    // Find file in database
    const file = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, filename, original_name FROM files WHERE filename = ?',
        [filename],
        (err, file) => {
          if (err) {
            console.error('Database error:', err);
            resolve(null);
          }
          resolve(file);
        }
      );
    });

    if (!file) {
      console.log(`No database record found for: ${filename}`);
      return next();
    }

    // Record the view
    await File.recordView(file.id);
    const currentViewCount = await File.getViewCount(file.id);
    console.log(`View recorded successfully - File: ${filename}, Count: ${currentViewCount}`);

    return next();

  } catch (error) {
    console.error('Error in trackFileView:', error);
    return next();
  }
};

module.exports = trackFileView;
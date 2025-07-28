const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static('.', {
  extensions: ['html'],
  index: 'index.html'
}));

// Handle form submissions (contact form)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit-contact', async (req, res) => {
  try {
    console.log('Contact form submission:', req.body);
    
    // Here you would typically save to Notion CMS
    // For now, just log and return success
    
    res.json({ 
      success: true, 
      message: 'Thank you for contacting Woods Roofing & Exteriors! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error submitting your request. Please call (513) 320-9436.' 
    });
  }
});

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    site: 'Woods Roofing & Exteriors'
  });
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  // Check if file exists
  const filePath = path.join(__dirname, req.path);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else if (req.path.endsWith('.html') || req.path === '/') {
    // Try to serve the HTML file
    const htmlFile = req.path === '/' ? 'index.html' : req.path.slice(1);
    const htmlPath = path.join(__dirname, htmlFile);
    
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
  } else {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Woods Roofing & Exteriors website is running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏠 Serving files from: ${__dirname}`);
});

module.exports = app; 
const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Webhook state management
let isBuilding = false;
let buildQueue = [];

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

// Notion webhook handler
app.post('/webhook/notion', async (req, res) => {
  try {
    console.log('🔔 Notion webhook received:', new Date().toISOString());
    
    // Trigger rebuild
    await triggerRebuild('Notion content updated');
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed, site rebuilding...' 
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual rebuild endpoint
app.post('/rebuild', async (req, res) => {
  try {
    await triggerRebuild('Manual rebuild requested');
    res.status(200).json({ 
      success: true, 
      message: 'Manual rebuild triggered' 
    });
  } catch (error) {
    console.error('❌ Manual rebuild error:', error);
    res.status(500).json({ error: 'Rebuild failed' });
  }
});

// Build status endpoint
app.get('/status', (req, res) => {
  res.json({
    isBuilding,
    queueLength: buildQueue.length,
    timestamp: new Date().toISOString()
  });
});

// Trigger rebuild with queue management
async function triggerRebuild(reason) {
  if (isBuilding) {
    console.log('⏳ Build already in progress, queuing request...');
    buildQueue.push(reason);
    return;
  }

  isBuilding = true;
  console.log(`🔨 Starting rebuild: ${reason}`);
  
  try {
    await executeBuild();
    console.log('✅ Rebuild completed successfully');
    
    // Process queued builds
    if (buildQueue.length > 0) {
      console.log(`📋 Processing ${buildQueue.length} queued builds...`);
      buildQueue = []; // Clear queue
      setTimeout(() => triggerRebuild('Queued rebuild'), 1000);
    }
  } catch (error) {
    console.error('❌ Rebuild failed:', error);
  } finally {
    isBuilding = false;
  }
}

// Execute the build command
function executeBuild() {
  return new Promise((resolve, reject) => {
    exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error('Build error:', error);
        reject(error);
        return;
      }
      console.log('Build output:', stdout);
      if (stderr) console.error('Build stderr:', stderr);
      resolve();
    });
  });
}

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
    site: 'Woods Roofing & Exteriors',
    webhook: 'enabled'
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
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook/notion`);
  console.log(`🔨 Manual rebuild: http://localhost:${PORT}/rebuild`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏠 Serving files from: ${__dirname}`);
  console.log(`⚡ Ready for real-time Notion updates!`);
});

module.exports = app; 
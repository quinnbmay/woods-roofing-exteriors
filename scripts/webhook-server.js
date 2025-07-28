#!/usr/bin/env node

const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

class WebhookServer {
  constructor() {
    this.isBuilding = false;
    this.buildQueue = [];
  }

  // Notion webhook handler
  async handleNotionWebhook(req, res) {
    try {
      console.log('🔔 Notion webhook received:', new Date().toISOString());
      
      // Verify webhook (if you set up verification)
      // const signature = req.headers['notion-webhook-signature'];
      // if (!this.verifyWebhook(req.body, signature)) {
      //   return res.status(401).json({ error: 'Invalid signature' });
      // }

      // Trigger rebuild
      await this.triggerRebuild('Notion content updated');
      
      res.status(200).json({ 
        success: true, 
        message: 'Webhook processed, site rebuilding...' 
      });
    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Manual rebuild endpoint
  async handleManualRebuild(req, res) {
    try {
      await this.triggerRebuild('Manual rebuild requested');
      res.status(200).json({ 
        success: true, 
        message: 'Manual rebuild triggered' 
      });
    } catch (error) {
      console.error('❌ Manual rebuild error:', error);
      res.status(500).json({ error: 'Rebuild failed' });
    }
  }

  // Trigger rebuild with queue management
  async triggerRebuild(reason) {
    if (this.isBuilding) {
      console.log('⏳ Build already in progress, queuing request...');
      this.buildQueue.push(reason);
      return;
    }

    this.isBuilding = true;
    console.log(`🔨 Starting rebuild: ${reason}`);
    
    try {
      await this.executeBuild();
      console.log('✅ Rebuild completed successfully');
      
      // Process queued builds
      if (this.buildQueue.length > 0) {
        console.log(`📋 Processing ${this.buildQueue.length} queued builds...`);
        this.buildQueue = []; // Clear queue
        setTimeout(() => this.triggerRebuild('Queued rebuild'), 1000);
      }
    } catch (error) {
      console.error('❌ Rebuild failed:', error);
    } finally {
      this.isBuilding = false;
    }
  }

  // Execute the build command
  executeBuild() {
    return new Promise((resolve, reject) => {
      exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error('Build error:', error);
          reject(error);
        } else {
          console.log('Build output:', stdout);
          if (stderr) console.warn('Build warnings:', stderr);
          resolve(stdout);
        }
      });
    });
  }

  // Webhook signature verification (optional)
  verifyWebhook(payload, signature) {
    if (!process.env.NOTION_WEBHOOK_SECRET) return true; // Skip if no secret set
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.NOTION_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  // Status endpoint
  getStatus(req, res) {
    res.json({
      status: 'running',
      isBuilding: this.isBuilding,
      queuedBuilds: this.buildQueue.length,
      lastUpdate: new Date().toISOString(),
      endpoints: {
        webhook: '/webhook/notion',
        manual: '/rebuild',
        status: '/status'
      }
    });
  }

  // Start the server
  start() {
    // Routes
    app.post('/webhook/notion', this.handleNotionWebhook.bind(this));
    app.post('/rebuild', this.handleManualRebuild.bind(this));
    app.get('/status', this.getStatus.bind(this));
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Woods Roofing Webhook Server running on port ${PORT}`);
      console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook/notion`);
      console.log(`🔨 Manual rebuild: http://localhost:${PORT}/rebuild`);
      console.log(`📊 Status: http://localhost:${PORT}/status`);
      console.log('⚡ Ready for real-time Notion updates!');
    });
  }
}

// Run if called directly
if (require.main === module) {
  const server = new WebhookServer();
  server.start();
}

module.exports = WebhookServer; 
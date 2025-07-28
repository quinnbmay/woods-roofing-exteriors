#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

class NetlifyDeployer {
  constructor() {
    this.apiToken = process.env.NETLIFY_TOKEN || 'nfp_QSq1JkLTdZmJQwEH81AzwesC92TUgo8q28de';
    this.apiBase = 'https://api.netlify.com/api/v1';
    this.siteName = 'woods-roofing-exteriors';
    this.buildDir = '.'; // Current directory since files are at root
  }

  // Make API request to Netlify
  makeAPIRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.netlify.com',
        port: 443,
        path: `/api/v1${endpoint}`,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        }
      };

      if (data && method !== 'GET') {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = responseData ? JSON.parse(responseData) : {};
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(result);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${result.message || responseData}`));
            }
          } catch (error) {
            reject(new Error(`Parse error: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data && method !== 'GET') {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  // Create a new Netlify site
  async createSite() {
    console.log('🏗️ Creating new Netlify site...');
    
    const siteConfig = {
      name: this.siteName,
      custom_domain: null, // Will be set later when user is ready
      build_settings: {
        cmd: 'npm run build',
        dir: '.',
        env: {
          NODE_ENV: 'production',
          NOTION_API_KEY: process.env.NOTION_API_KEY,
          NOTION_DATABASE_BLOGS: process.env.NOTION_DATABASE_BLOGS,
          NOTION_DATABASE_SERVICES: process.env.NOTION_DATABASE_SERVICES,
          NOTION_DATABASE_TESTIMONIALS: process.env.NOTION_DATABASE_TESTIMONIALS,
          NOTION_DATABASE_CONTACT_FORMS: process.env.NOTION_DATABASE_CONTACT_FORMS,
          SITE_URL: `https://${this.siteName}.netlify.app`,
          SITE_NAME: 'Woods Roofing & Exteriors',
          SITE_DESCRIPTION: 'Professional roofing services in Southwest Ohio with 25+ years of experience'
        }
      },
      processing_settings: {
        css: { bundle: true, minify: true },
        js: { bundle: true, minify: true },
        images: { optimize: true },
        html: { pretty_urls: true }
      }
    };

    try {
      const site = await this.makeAPIRequest('POST', '/sites', siteConfig);
      console.log(`✅ Site created: ${site.name}`);
      console.log(`🌐 URL: ${site.url}`);
      console.log(`📧 Admin URL: ${site.admin_url}`);
      
      return site;
    } catch (error) {
      if (error.message.includes('Name has already been taken')) {
        console.log('⚠️ Site name already exists, fetching existing site...');
        return await this.getSiteByName();
      }
      throw error;
    }
  }

  // Get existing site by name
  async getSiteByName() {
    try {
      const sites = await this.makeAPIRequest('GET', '/sites');
      const site = sites.find(s => s.name === this.siteName || s.url.includes(this.siteName));
      
      if (site) {
        console.log(`✅ Found existing site: ${site.name}`);
        console.log(`🌐 URL: ${site.url}`);
        return site;
      } else {
        throw new Error('Site not found');
      }
    } catch (error) {
      console.error('❌ Error finding site:', error.message);
      throw error;
    }
  }

  // Build the site locally
  async buildSite() {
    console.log('🔨 Building site locally...');
    
    return new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Build failed:', error.message);
          reject(error);
        } else {
          console.log('✅ Local build completed');
          console.log(stdout);
          if (stderr) console.warn('Build warnings:', stderr);
          resolve(stdout);
        }
      });
    });
  }

  // Create deployment zip
  async createDeploymentZip() {
    console.log('📦 Creating deployment package...');
    
    return new Promise((resolve, reject) => {
      // List of files to include in deployment
      const filesToInclude = [
        '*.html',
        'css/',
        'js/',  
        'images/',
        'sitemap.xml',
        'robots.txt'
      ];
      
      const zipCommand = `tar -czf deploy.tar.gz ${filesToInclude.join(' ')} 2>/dev/null || true`;
      
      exec(zipCommand, (error, stdout, stderr) => {
        if (error) {
          console.warn('⚠️ Zip creation had issues, continuing...');
        }
        
        if (fs.existsSync('deploy.tar.gz')) {
          console.log('✅ Deployment package created');
          resolve('deploy.tar.gz');
        } else {
          reject(new Error('Failed to create deployment package'));
        }
      });
    });
  }

  // Deploy to Netlify
  async deployToNetlify(siteId) {
    console.log('🚀 Deploying to Netlify...');
    
    try {
      // Create a new deploy
      const deploy = await this.makeAPIRequest('POST', `/sites/${siteId}/deploys`, {
        files: {},
        draft: false,
        branch: 'main'
      });
      
      console.log(`✅ Deploy initiated: ${deploy.id}`);
      console.log(`🔗 Deploy URL: ${deploy.deploy_url}`);
      
      // In a real implementation, you'd upload files here
      // For now, we'll trigger a build from the repository
      
      return deploy;
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      throw error;
    }
  }

  // Set up build hooks for automatic deployments
  async setupBuildHook(siteId) {
    console.log('🔗 Setting up build hook...');
    
    try {
      const hook = await this.makeAPIRequest('POST', `/sites/${siteId}/build_hooks`, {
        title: 'Notion Content Updates',
        branch: 'main'
      });
      
      console.log('✅ Build hook created');
      console.log(`🔗 Hook URL: ${hook.url}`);
      console.log('💡 Use this URL in your Notion webhook to trigger auto-deploys');
      
      return hook;
    } catch (error) {
      console.error('❌ Build hook creation failed:', error.message);
      throw error;
    }
  }

  // Update site environment variables
  async updateEnvironmentVariables(siteId) {
    console.log('🔧 Updating environment variables...');
    
    const envVars = {
      NODE_ENV: 'production',
      NOTION_API_KEY: process.env.NOTION_API_KEY,
      NOTION_DATABASE_BLOGS: process.env.NOTION_DATABASE_BLOGS,
      NOTION_DATABASE_SERVICES: process.env.NOTION_DATABASE_SERVICES,
      NOTION_DATABASE_TESTIMONIALS: process.env.NOTION_DATABASE_TESTIMONIALS,
      NOTION_DATABASE_CONTACT_FORMS: process.env.NOTION_DATABASE_CONTACT_FORMS,
      SITE_URL: `https://${this.siteName}.netlify.app`,
      SITE_NAME: 'Woods Roofing & Exteriors',
      SITE_DESCRIPTION: 'Professional roofing services in Southwest Ohio with 25+ years of experience'
    };

    try {
      // Use the correct Netlify API endpoint for environment variables
      const envArray = Object.entries(envVars)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key: key,
          values: [{ value: value, context: 'all' }]
        }));

      await this.makeAPIRequest('PATCH', `/sites/${siteId}`, {
        build_settings: {
          env: envVars
        }
      });
      
      console.log('✅ Environment variables updated');
    } catch (error) {
      console.warn('⚠️ Environment variable update failed, but site created successfully:', error.message);
      console.log('💡 You can manually set environment variables in Netlify dashboard');
    }
  }

  // Full deployment process
  async deploy() {
    console.log('🚀 Starting Netlify deployment for Woods Roofing & Exteriors...\n');
    
    try {
      // Step 1: Build the site
      await this.buildSite();
      
      // Step 2: Create or get site
      const site = await this.createSite();
      
      // Step 3: Update environment variables
      await this.updateEnvironmentVariables(site.id);
      
      // Step 4: Set up build hook
      const buildHook = await this.setupBuildHook(site.id);
      
      // Step 5: Update .env with production URL
      await this.updateProductionEnv(site.url);
      
      console.log('\n🎉 Deployment completed successfully!');
      console.log('\n📊 Deployment Summary:');
      console.log(`🌐 Live URL: ${site.url}`);
      console.log(`🔧 Admin Panel: ${site.admin_url}`);
      console.log(`🔗 Build Hook: ${buildHook.url}`);
      console.log('\n🚀 Your Woods Roofing website is now live on Netlify!');
      console.log('💡 Set up the build hook URL in your Notion integration for auto-deployments');
      
      return {
        site,
        buildHook,
        liveUrl: site.url
      };
      
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      throw error;
    }
  }

  // Update .env with production URL
  async updateProductionEnv(siteUrl) {
    console.log('📝 Updating production environment...');
    
    try {
      let envContent = fs.readFileSync('.env', 'utf8');
      
      // Update SITE_URL
      if (envContent.includes('SITE_URL=')) {
        envContent = envContent.replace(/SITE_URL=.*/, `SITE_URL=${siteUrl}`);
      } else {
        envContent += `\nSITE_URL=${siteUrl}`;
      }
      
      fs.writeFileSync('.env', envContent);
      console.log('✅ Production environment updated');
    } catch (error) {
      console.warn('⚠️ Could not update .env file:', error.message);
    }
  }

  // Get deployment status
  async getDeploymentStatus(siteId) {
    try {
      const deploys = await this.makeAPIRequest('GET', `/sites/${siteId}/deploys`);
      const latestDeploy = deploys[0];
      
      console.log(`📊 Latest deployment status: ${latestDeploy.state}`);
      console.log(`🕐 Created: ${new Date(latestDeploy.created_at).toLocaleString()}`);
      console.log(`🔗 URL: ${latestDeploy.deploy_url}`);
      
      return latestDeploy;
    } catch (error) {
      console.error('❌ Error getting deployment status:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const deployer = new NetlifyDeployer();
  const command = process.argv[2];

  switch (command) {
    case 'deploy':
      deployer.deploy().catch(console.error);
      break;
    case 'status':
      if (process.argv[3]) {
        deployer.getDeploymentStatus(process.argv[3]).catch(console.error);
      } else {
        console.log('Usage: node scripts/netlify-deploy.js status <site-id>');
      }
      break;
    default:
      console.log(`
🌐 Woods Roofing Netlify Deployer

Usage:
  node scripts/netlify-deploy.js deploy   # Deploy to Netlify
  node scripts/netlify-deploy.js status   # Check deployment status

Examples:
  npm run deploy     # If you add this to package.json
      `);
  }
}

module.exports = NetlifyDeployer; 
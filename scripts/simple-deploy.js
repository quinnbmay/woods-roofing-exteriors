#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

class SimpleNetlifyDeploy {
  constructor() {
    this.siteName = 'woods-roofing-exteriors';
  }

  // Install Netlify CLI if needed
  async installNetlifyCLI() {
    console.log('📦 Checking Netlify CLI...');
    
    return new Promise((resolve) => {
      exec('which netlify', (error) => {
        if (error) {
          console.log('⬇️ Installing Netlify CLI...');
          exec('npm install -g netlify-cli', (installError, stdout, stderr) => {
            if (installError) {
              console.error('❌ Failed to install Netlify CLI:', installError.message);
              resolve(false);
            } else {
              console.log('✅ Netlify CLI installed');
              resolve(true);
            }
          });
        } else {
          console.log('✅ Netlify CLI already installed');
          resolve(true);
        }
      });
    });
  }

  // Deploy using Netlify CLI
  async deployWithCLI() {
    console.log('🚀 Deploying with Netlify CLI...');
    
    const deployCommand = `NETLIFY_AUTH_TOKEN=nfp_QSq1JkLTdZmJQwEH81AzwesC92TUgo8q28de netlify deploy --prod --dir=. --site=woods-roofing-exteriors`;
    
    return new Promise((resolve, reject) => {
      exec(deployCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Deployment failed:', error.message);
          reject(error);
        } else {
          console.log('✅ Deployment successful!');
          console.log(stdout);
          if (stderr) console.warn('Deploy warnings:', stderr);
          resolve(stdout);
        }
      });
    });
  }

  // Simple deploy process
  async deploy() {
    console.log('🚀 Simple Netlify Deployment for Woods Roofing...\n');
    
    try {
      // Step 1: Build the site first
      console.log('🔨 Building site...');
      await new Promise((resolve, reject) => {
        exec('npm run build', (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            console.log('✅ Build completed');
            resolve(stdout);
          }
        });
      });

      // Step 2: Install CLI if needed
      const cliReady = await this.installNetlifyCLI();
      if (!cliReady) {
        throw new Error('Netlify CLI installation failed');
      }

      // Step 3: Deploy
      await this.deployWithCLI();
      
      console.log('\n🎉 Deployment completed!');
      console.log('🌐 Your site is live at: https://woods-roofing-exteriors.netlify.app');
      console.log('🔧 Netlify Dashboard: https://app.netlify.com/sites/woods-roofing-exteriors');
      
    } catch (error) {
      console.error('\n❌ Simple deployment failed:', error.message);
      console.log('\n🔄 Trying manual file upload approach...');
      await this.manualDeploy();
    }
  }

  // Manual deployment fallback
  async manualDeploy() {
    console.log('📁 Creating deployment package...');
    
    // Create a zip of all necessary files
    const files = [
      'index.html',
      'about.html', 
      'service.html',
      'blogs.html',
      'contact.html',
      'reviews.html',
      'css/',
      'js/',
      'images/',
      'sitemap.xml',
      'robots.txt'
    ];
    
    const zipCommand = `zip -r deploy.zip ${files.join(' ')} 2>/dev/null`;
    
    return new Promise((resolve, reject) => {
      exec(zipCommand, (error, stdout, stderr) => {
        if (error) {
          console.warn('⚠️ Zip creation issues, but continuing...');
        }
        
        console.log('✅ Deployment package created');
        console.log('\n📋 Manual deployment steps:');
        console.log('1. Go to https://app.netlify.com/sites/woods-roofing-exteriors');
        console.log('2. Click "Deploys" tab');
        console.log('3. Drag and drop these files into the deploy area:');
        console.log('   - All .html files');
        console.log('   - css/ folder');
        console.log('   - js/ folder'); 
        console.log('   - images/ folder');
        console.log('   - sitemap.xml');
        console.log('   - robots.txt');
        console.log('\n🌐 Your site will be live at: https://woods-roofing-exteriors.netlify.app');
        
        resolve();
      });
    });
  }
}

// Run if called directly
if (require.main === module) {
  const deployer = new SimpleNetlifyDeploy();
  deployer.deploy().catch(console.error);
}

module.exports = SimpleNetlifyDeploy; 
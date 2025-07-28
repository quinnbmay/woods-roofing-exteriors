#!/usr/bin/env node

const ContentUpdater = require('./update-content');
const SEOOptimizer = require('./seo-optimizer');
const path = require('path');
const fs = require('fs').promises;

class WebsiteBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
  }

  // Check if environment is properly configured
  async checkEnvironment() {
    console.log('🔍 Checking environment configuration...');
    
    const envPath = path.join(this.rootDir, '.env');
    
    try {
      await fs.access(envPath);
      require('dotenv').config({ path: envPath });
      
      const requiredVars = [
        'NOTION_API_KEY',
        'NOTION_DATABASE_BLOGS',
        'NOTION_DATABASE_SERVICES',
        'NOTION_DATABASE_TESTIMONIALS',
        'NOTION_DATABASE_CONTACT_FORMS'
      ];
      
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.log('⚠️ Missing environment variables:', missingVars.join(', '));
        console.log('📝 Please copy notion.config.example to .env and configure your Notion settings');
        return false;
      }
      
      console.log('✅ Environment configuration is valid');
      return true;
    } catch (error) {
      console.log('❌ .env file not found');
      console.log('📝 Please copy notion.config.example to .env and configure your Notion settings');
      return false;
    }
  }

  // Validate HTML files exist
  async validateFiles() {
    console.log('📄 Validating HTML files...');
    
    const requiredFiles = [
      'index.html',
      'blogs.html',
      'service.html',
      'contact.html',
      'reviews.html'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.rootDir, file);
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error(`❌ Required file missing: ${file}`);
        return false;
      }
    }
    
    console.log('✅ All required HTML files found');
    return true;
  }

  // Generate sitemap
  async generateSitemap() {
    console.log('🗺️ Generating sitemap...');
    
    const baseUrl = process.env.SITE_URL || 'https://woodsroofing.com';
    const pages = [
      { url: '/', priority: '1.0' },
      { url: '/about.html', priority: '0.8' },
      { url: '/service.html', priority: '0.9' },
      { url: '/blogs.html', priority: '0.7' },
      { url: '/contact.html', priority: '0.8' },
      { url: '/reviews.html', priority: '0.6' },
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const sitemapPath = path.join(this.rootDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap, 'utf-8');
    console.log('✅ Sitemap generated');
  }

  // Update meta tags and SEO
  async updateSEO() {
    console.log('🔍 Updating SEO meta tags...');
    
    const siteName = process.env.SITE_NAME || 'Woods Roofing & Exteriors';
    const siteDescription = process.env.SITE_DESCRIPTION || 'Professional roofing services in Southwest Ohio';
    
    // This could be expanded to update meta tags in HTML files
    console.log('✅ SEO optimization complete');
  }

  // Main build process
  async build() {
    console.log('🚀 Starting Woods Roofing website build...\n');
    
    try {
      // Step 1: Check environment
      const envValid = await this.checkEnvironment();
      if (!envValid) {
        console.log('\n❌ Build failed: Environment configuration required');
        process.exit(1);
      }
      
      // Step 2: Validate files
      const filesValid = await this.validateFiles();
      if (!filesValid) {
        console.log('\n❌ Build failed: Missing required files');
        process.exit(1);
      }
      
      // Step 3: Update content from Notion
      console.log('\n📥 Fetching content from Notion CMS...');
      const contentUpdater = new ContentUpdater();
      await contentUpdater.updateAll();
      
      // Step 4: Advanced SEO optimization
      console.log('\n🔍 Applying advanced SEO optimization...');
      const seoOptimizer = new SEOOptimizer();
      
      // Get services for homepage SEO optimization
      const NotionCMS = require('./notion-client');
      const notion = new NotionCMS();
      const services = await notion.getServices();
      const testimonials = await notion.getTestimonials();
      
      // Optimize homepage with full SEO
      await seoOptimizer.optimizeHomepage(services, testimonials);
      console.log('✅ Advanced SEO optimization complete');
      
      // Step 5: Generate sitemap
      await this.generateSitemap();
      
      console.log('\n🎉 Build completed successfully!');
      console.log('🌐 Your website is ready to serve');
      console.log('📡 Tailscale URL: https://maymarketing.tail7fcb21.ts.net/');
      console.log('🏠 Local URL: http://localhost:8000');
      
    } catch (error) {
      console.error('\n❌ Build failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const builder = new WebsiteBuilder();
  builder.build();
}

module.exports = WebsiteBuilder; 
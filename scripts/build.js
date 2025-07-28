#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const NotionCMS = require('./notion-client');
const ContentUpdater = require('./update-content');
const SEOOptimizer = require('./seo-optimizer');

class WebsiteBuilder {
    constructor() {
        this.cms = new NotionCMS();
        this.contentUpdater = new ContentUpdater(this.cms); 
        this.seoOptimizer = new SEOOptimizer();
    }

    async build() {
        try {
            console.log('🚀 Starting Woods Roofing website build...\n');

            // Step 1: Environment validation
            console.log('🔍 Checking environment configuration...');
            await this.validateEnvironment();
            console.log('✅ Environment configuration is valid');

            // Step 2: File validation  
            console.log('📄 Validating HTML files...');
            await this.validateFiles();
            console.log('✅ All required HTML files found\n');

            // Step 3: Content update from Notion
            console.log('📥 Fetching content from Notion CMS...');
            await this.contentUpdater.updateAll();

            // Step 4: Get services data for SEO optimization
            const services = await this.cms.getServices();
            const testimonials = await this.cms.getTestimonials();

            // Step 5: Advanced SEO optimization with API insights
            console.log('🔍 Applying advanced SEO optimization...');
            await this.seoOptimizer.optimizePage('index.html', 'homepage', { 
                services, 
                testimonials 
            });

            // Step 6: Generate sitemap
            await this.generateSitemap();

            console.log('\n🎉 Build completed successfully!');
            console.log('🌐 Website ready for deployment');

        } catch (error) {
            console.error('\n❌ Build failed:', error.message);
            process.exit(1);
        }
    }

    async validateEnvironment() {
        const requiredVars = [
            'NOTION_API_KEY',
            'NOTION_DATABASE_SERVICES', 
            'NOTION_DATABASE_BLOGS',
            'NOTION_DATABASE_TESTIMONIALS',
            'NOTION_DATABASE_CONTACT_FORMS'
        ];

        const missing = requiredVars.filter(varName => !process.env[varName]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    async validateFiles() {
        const requiredFiles = [
            'index.html',
            'about.html', 
            'service.html',
            'blogs.html',
            'contact.html',
            'reviews.html'
        ];

        for (const file of requiredFiles) {
            try {
                await fs.access(file);
            } catch (error) {
                throw new Error(`Required file not found: ${file}`);
            }
        }
    }

    async generateSitemap() {
        const pages = [
            { path: '/', priority: '1.0', changefreq: 'weekly' },
            { path: '/about.html', priority: '0.8', changefreq: 'monthly' },
            { path: '/service.html', priority: '0.9', changefreq: 'weekly' },
            { path: '/blogs.html', priority: '0.7', changefreq: 'weekly' },
            { path: '/contact.html', priority: '0.8', changefreq: 'monthly' },
            { path: '/reviews.html', priority: '0.6', changefreq: 'monthly' }
        ];

        await this.seoOptimizer.generateSitemap(pages);
    }
}

// Run the build if this script is executed directly
if (require.main === module) {
    const builder = new WebsiteBuilder();
    builder.build();
}

module.exports = WebsiteBuilder; 
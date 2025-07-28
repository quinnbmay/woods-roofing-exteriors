#!/usr/bin/env node

const { Client } = require('@notionhq/client');
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
require('dotenv').config();

class SyncService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  // Sync content FROM website TO Notion (reverse sync)
  async syncWebsiteToNotion() {
    console.log('🔄 Starting Website → Notion sync...');
    
    try {
      // This would extract content from HTML and update Notion
      // For now, we'll implement the framework
      await this.extractAndSyncBlogPosts();
      await this.extractAndSyncServices();
      console.log('✅ Website → Notion sync completed');
    } catch (error) {
      console.error('❌ Website → Notion sync failed:', error);
    }
  }

  // Extract blog posts from HTML and sync to Notion
  async extractAndSyncBlogPosts() {
    console.log('📝 Syncing blog posts to Notion...');
    
    try {
      const blogsHtml = await fs.readFile('blogs.html', 'utf8');
      const $ = cheerio.load(blogsHtml);
      
      // Extract blog post data from HTML
      const extractedPosts = [];
      $('.single-blog').each((i, element) => {
        const $post = $(element);
        const title = $post.find('.blog-title').text().trim();
        const excerpt = $post.find('.blog-excerpt').text().trim();
        const category = $post.find('.blog-label').text().trim();
        
        if (title && excerpt) {
          extractedPosts.push({
            title,
            excerpt,
            category: category || 'General',
            published: true
          });
        }
      });

      // Check if these posts exist in Notion, if not create them
      for (const post of extractedPosts) {
        await this.createOrUpdateBlogPost(post);
      }
      
      console.log(`✅ Processed ${extractedPosts.length} blog posts`);
    } catch (error) {
      console.error('❌ Blog post sync error:', error);
    }
  }

  // Extract services from HTML and sync to Notion
  async extractAndSyncServices() {
    console.log('🔧 Syncing services to Notion...');
    
    try {
      const serviceHtml = await fs.readFile('service.html', 'utf8');
      const $ = cheerio.load(serviceHtml);
      
      // Extract service data from HTML
      const extractedServices = [];
      $('.single-service').each((i, element) => {
        const $service = $(element);
        const title = $service.find('.service-title').text().trim();
        const description = $service.find('.service-content').text().trim();
        
        if (title && description) {
          extractedServices.push({
            title,
            description,
            shortDescription: description.substring(0, 150) + '...',
            category: 'General',
            active: true
          });
        }
      });

      // Check if these services exist in Notion, if not create them
      for (const service of extractedServices) {
        await this.createOrUpdateService(service);
      }
      
      console.log(`✅ Processed ${extractedServices.length} services`);
    } catch (error) {
      console.error('❌ Service sync error:', error);
    }
  }

  // Create or update blog post in Notion
  async createOrUpdateBlogPost(postData) {
    try {
      // First check if post already exists
      const existing = await this.findExistingBlogPost(postData.title);
      
      if (existing) {
        console.log(`🔄 Updating existing blog post: ${postData.title}`);
        // Update existing post
        await this.notion.pages.update({
          page_id: existing.id,
          properties: {
            'Excerpt': {
              rich_text: [{ text: { content: postData.excerpt } }]
            },
            'Category': {
              select: { name: postData.category }
            },
            'Published': {
              checkbox: postData.published
            }
          }
        });
      } else {
        console.log(`➕ Creating new blog post: ${postData.title}`);
        // Create new post
        await this.notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_BLOGS,
          },
          properties: {
            'Title': {
              title: [{ text: { content: postData.title } }]
            },
            'Excerpt': {
              rich_text: [{ text: { content: postData.excerpt } }]
            },
            'Category': {
              select: { name: postData.category }
            },
            'Published': {
              checkbox: postData.published
            },
            'Slug': {
              rich_text: [{ text: { content: postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') } }]
            }
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error syncing blog post: ${postData.title}`, error);
    }
  }

  // Create or update service in Notion
  async createOrUpdateService(serviceData) {
    try {
      // First check if service already exists
      const existing = await this.findExistingService(serviceData.title);
      
      if (existing) {
        console.log(`🔄 Updating existing service: ${serviceData.title}`);
        // Update existing service
        await this.notion.pages.update({
          page_id: existing.id,
          properties: {
            'Description': {
              rich_text: [{ text: { content: serviceData.description } }]
            },
            'ShortDescription': {
              rich_text: [{ text: { content: serviceData.shortDescription } }]
            },
            'Active': {
              checkbox: serviceData.active
            }
          }
        });
      } else {
        console.log(`➕ Creating new service: ${serviceData.title}`);
        // Create new service
        await this.notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_SERVICES,
          },
          properties: {
            'Title': {
              title: [{ text: { content: serviceData.title } }]
            },
            'Description': {
              rich_text: [{ text: { content: serviceData.description } }]
            },
            'ShortDescription': {
              rich_text: [{ text: { content: serviceData.shortDescription } }]
            },
            'Category': {
              select: { name: serviceData.category }
            },
            'Active': {
              checkbox: serviceData.active
            },
            'Slug': {
              rich_text: [{ text: { content: serviceData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') } }]
            }
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error syncing service: ${serviceData.title}`, error);
    }
  }

  // Find existing blog post by title
  async findExistingBlogPost(title) {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_DATABASE_BLOGS,
        filter: {
          property: 'Title',
          title: {
            equals: title
          }
        }
      });
      return response.results[0] || null;
    } catch (error) {
      console.error('Error finding blog post:', error);
      return null;
    }
  }

  // Find existing service by title
  async findExistingService(title) {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_DATABASE_SERVICES,
        filter: {
          property: 'Title',
          title: {
            equals: title
          }
        }
      });
      return response.results[0] || null;
    } catch (error) {
      console.error('Error finding service:', error);
      return null;
    }
  }

  // Watch for file changes and auto-sync
  async startFileWatcher() {
    console.log('👀 Starting file watcher for auto-sync...');
    
    const chokidar = require('chokidar');
    
    // Watch HTML files for changes
    const watcher = chokidar.watch(['*.html', '!node_modules/**'], {
      ignored: /node_modules/,
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      console.log(`📁 File changed: ${filePath}`);
      
      // Debounce changes (wait 2 seconds before syncing)
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(async () => {
        console.log('🔄 Auto-syncing due to file changes...');
        await this.syncWebsiteToNotion();
      }, 2000);
    });

    console.log('✅ File watcher started - changes will auto-sync to Notion');
  }

  // Full bi-directional sync
  async fullSync() {
    console.log('🔄 Starting full bi-directional sync...');
    
    try {
      // 1. Sync Notion → Website (existing functionality)
      const { exec } = require('child_process');
      await new Promise((resolve, reject) => {
        exec('npm run build', (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
      
      // 2. Sync Website → Notion (new functionality)
      await this.syncWebsiteToNotion();
      
      console.log('✅ Full bi-directional sync completed!');
    } catch (error) {
      console.error('❌ Full sync failed:', error);
    }
  }
}

// CLI interface
if (require.main === module) {
  const syncService = new SyncService();
  const command = process.argv[2];

  switch (command) {
    case 'to-notion':
      syncService.syncWebsiteToNotion();
      break;
    case 'watch':
      syncService.startFileWatcher();
      break;
    case 'full':
      syncService.fullSync();
      break;
    default:
      console.log(`
🔄 Woods Roofing Sync Service

Usage:
  node scripts/sync-service.js to-notion  # Sync website content to Notion
  node scripts/sync-service.js watch      # Watch files and auto-sync
  node scripts/sync-service.js full       # Full bi-directional sync

Examples:
  npm run sync-to-notion  # If you add these to package.json
  npm run sync-watch
  npm run sync-full
      `);
  }
}

module.exports = SyncService; 
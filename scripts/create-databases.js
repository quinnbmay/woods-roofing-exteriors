#!/usr/bin/env node

const { Client } = require('@notionhq/client');
require('dotenv').config();

class DatabaseCreator {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  // Create Blog Posts Database
  async createBlogDatabase(parentPageId) {
    console.log('📝 Creating Blog Posts database...');
    
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Blog Posts',
            },
          },
        ],
        properties: {
          'Title': {
            title: {}
          },
          'Excerpt': {
            rich_text: {}
          },
          'Category': {
            select: {
              options: [
                { name: 'Roofing', color: 'blue' },
                { name: 'Gutters', color: 'green' },
                { name: 'Siding', color: 'orange' },
                { name: 'Company News', color: 'purple' },
                { name: 'Tips', color: 'yellow' }
              ]
            }
          },
          'Image': {
            files: {}
          },
          'Published': {
            checkbox: {}
          },
          'Slug': {
            rich_text: {}
          },
          'Created': {
            created_time: {}
          }
        },
      });

      console.log('✅ Blog Posts database created!');
      console.log(`   Database ID: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error('❌ Error creating Blog Posts database:', error.message);
      return null;
    }
  }

  // Create Services Database
  async createServicesDatabase(parentPageId) {
    console.log('🔧 Creating Services database...');
    
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Services',
            },
          },
        ],
        properties: {
          'Title': {
            title: {}
          },
          'Description': {
            rich_text: {}
          },
          'ShortDescription': {
            rich_text: {}
          },
          'Category': {
            select: {
              options: [
                { name: 'Roofing', color: 'blue' },
                { name: 'Gutters', color: 'green' },
                { name: 'Siding', color: 'orange' },
                { name: 'Masonry', color: 'red' },
                { name: 'Exterior', color: 'purple' }
              ]
            }
          },
          'Icon': {
            files: {}
          },
          'Image': {
            files: {}
          },
          'Price': {
            rich_text: {}
          },
          'Active': {
            checkbox: {}
          },
          'Slug': {
            rich_text: {}
          }
        },
      });

      console.log('✅ Services database created!');
      console.log(`   Database ID: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error('❌ Error creating Services database:', error.message);
      return null;
    }
  }

  // Create Testimonials Database
  async createTestimonialsDatabase(parentPageId) {
    console.log('⭐ Creating Testimonials database...');
    
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Testimonials',
            },
          },
        ],
        properties: {
          'Name': {
            title: {}
          },
          'Review': {
            rich_text: {}
          },
          'Rating': {
            number: {
              format: 'number'
            }
          },
          'Location': {
            rich_text: {}
          },
          'Service': {
            select: {
              options: [
                { name: 'Roofing', color: 'blue' },
                { name: 'Gutters', color: 'green' },
                { name: 'Siding', color: 'orange' },
                { name: 'Masonry', color: 'red' },
                { name: 'General', color: 'gray' }
              ]
            }
          },
          'Photo': {
            files: {}
          },
          'Date': {
            date: {}
          },
          'Approved': {
            checkbox: {}
          }
        },
      });

      console.log('✅ Testimonials database created!');
      console.log(`   Database ID: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error('❌ Error creating Testimonials database:', error.message);
      return null;
    }
  }

  // Create Contact Forms Database
  async createContactFormsDatabase(parentPageId) {
    console.log('📞 Creating Contact Forms database...');
    
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Contact Forms',
            },
          },
        ],
        properties: {
          'Name': {
            title: {}
          },
          'Email': {
            email: {}
          },
          'Phone': {
            phone_number: {}
          },
          'Message': {
            rich_text: {}
          },
          'Source': {
            select: {
              options: [
                { name: 'Website', color: 'blue' },
                { name: 'Referral', color: 'green' },
                { name: 'Phone', color: 'orange' },
                { name: 'Social Media', color: 'purple' }
              ]
            }
          },
          'Status': {
            select: {
              options: [
                { name: 'New', color: 'red' },
                { name: 'Contacted', color: 'yellow' },
                { name: 'In Progress', color: 'orange' },
                { name: 'Completed', color: 'green' }
              ]
            }
          },
          'Submitted': {
            created_time: {}
          }
        },
      });

      console.log('✅ Contact Forms database created!');
      console.log(`   Database ID: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error('❌ Error creating Contact Forms database:', error.message);
      return null;
    }
  }

  // Main creation function
  async createAllDatabases() {
    console.log('🏠 Woods Roofing & Exteriors - Database Setup');
    console.log('🚀 Creating CMS databases in your Notion workspace...\n');

    // Use the page ID from the URL: 217927ae129880eda379cf6ac88c75c5
    const parentPageId = '217927ae-1298-80ed-a379-cf6ac88c75c5';
    
    const databases = {};
    
    // Create all databases
    databases.blogs = await this.createBlogDatabase(parentPageId);
    databases.services = await this.createServicesDatabase(parentPageId);
    databases.testimonials = await this.createTestimonialsDatabase(parentPageId);
    databases.contactForms = await this.createContactFormsDatabase(parentPageId);

    console.log('\n🎉 Database creation complete!\n');

    // Generate updated .env content
    if (databases.blogs && databases.services && databases.testimonials && databases.contactForms) {
      console.log('📝 Your database IDs:');
      console.log(`NOTION_DATABASE_BLOGS=${databases.blogs}`);
      console.log(`NOTION_DATABASE_SERVICES=${databases.services}`);
      console.log(`NOTION_DATABASE_TESTIMONIALS=${databases.testimonials}`);
      console.log(`NOTION_DATABASE_CONTACT_FORMS=${databases.contactForms}`);
      
      console.log('\n✅ Ready to update your .env file and run: npm run build');
      
      return databases;
    } else {
      console.log('\n❌ Some databases failed to create. Check the errors above.');
      return null;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const creator = new DatabaseCreator();
  creator.createAllDatabases().catch(console.error);
}

module.exports = DatabaseCreator; 
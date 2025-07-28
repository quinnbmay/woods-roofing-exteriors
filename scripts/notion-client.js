const { Client } = require('@notionhq/client');
const MarkdownIt = require('markdown-it');
require('dotenv').config();

class NotionCMS {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    this.markdown = new MarkdownIt();
  }

  // Convert Notion rich text to HTML
  richTextToHtml(richText) {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText.map(text => {
      let content = text.plain_text;
      
      if (text.annotations.bold) content = `<strong>${content}</strong>`;
      if (text.annotations.italic) content = `<em>${content}</em>`;
      if (text.annotations.underline) content = `<u>${content}</u>`;
      if (text.annotations.strikethrough) content = `<s>${content}</s>`;
      if (text.annotations.code) content = `<code>${content}</code>`;
      
      if (text.href) content = `<a href="${text.href}" target="_blank">${content}</a>`;
      
      return content;
    }).join('');
  }

  // Get all blog posts
  async getBlogPosts() {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_DATABASE_BLOGS,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      });

      return response.results.map(page => ({
        id: page.id,
        title: this.richTextToHtml(page.properties.Title?.title || []),
        excerpt: this.richTextToHtml(page.properties.Excerpt?.rich_text || []),
        category: page.properties.Category?.select?.name || 'General',
        image: page.properties.Image?.files?.[0]?.file?.url || page.properties.Image?.files?.[0]?.external?.url || '/images/full-shot-roof.png',
        published: page.properties.Published?.checkbox || false,
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
        created: page.created_time,
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  // Get all services
  async getServices() {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_DATABASE_SERVICES,
        filter: {
          property: 'Active',
          checkbox: {
            equals: true,
          },
        },
      });

      return response.results.map(page => ({
        id: page.id,
        title: this.richTextToHtml(page.properties.Title?.title || []),
        description: this.richTextToHtml(page.properties.Description?.rich_text || []),
        shortDescription: this.richTextToHtml(page.properties.ShortDescription?.rich_text || []),
        icon: page.properties.Icon?.files?.[0]?.file?.url || page.properties.Icon?.files?.[0]?.external?.url || '/images/roofing-1.svg',
        image: page.properties.Image?.files?.[0]?.file?.url || page.properties.Image?.files?.[0]?.external?.url || '/images/full-shot-roof.png',
        category: page.properties.Category?.select?.name || 'Services',
        price: page.properties.Price?.rich_text?.[0]?.plain_text || 'Contact for Quote',
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  // Get testimonials/reviews
  async getTestimonials() {
    try {
      const response = await this.notion.databases.query({
        database_id: process.env.NOTION_DATABASE_TESTIMONIALS,
        filter: {
          property: 'Approved',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Rating',
            direction: 'descending',
          },
        ],
      });

      return response.results.map(page => ({
        id: page.id,
        name: this.richTextToHtml(page.properties.Name?.title || []),
        content: this.richTextToHtml(page.properties.Review?.rich_text || []),
        rating: page.properties.Rating?.number || 5,
        location: this.richTextToHtml(page.properties.Location?.rich_text || []),
        service: page.properties.Service?.select?.name || 'General',
        image: page.properties.Photo?.files?.[0]?.file?.url || page.properties.Photo?.files?.[0]?.external?.url || '/images/Profile12-1.png',
        date: page.properties.Date?.date?.start || page.created_time,
      }));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  // Get page content by ID
  async getPageContent(pageId) {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: pageId,
      });

      return this.blocksToHtml(response.results);
    } catch (error) {
      console.error('Error fetching page content:', error);
      return '';
    }
  }

  // Convert Notion blocks to HTML
  blocksToHtml(blocks) {
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return `<p>${this.richTextToHtml(block.paragraph.rich_text)}</p>`;
        case 'heading_1':
          return `<h1>${this.richTextToHtml(block.heading_1.rich_text)}</h1>`;
        case 'heading_2':
          return `<h2>${this.richTextToHtml(block.heading_2.rich_text)}</h2>`;
        case 'heading_3':
          return `<h3>${this.richTextToHtml(block.heading_3.rich_text)}</h3>`;
        case 'bulleted_list_item':
          return `<li>${this.richTextToHtml(block.bulleted_list_item.rich_text)}</li>`;
        case 'numbered_list_item':
          return `<li>${this.richTextToHtml(block.numbered_list_item.rich_text)}</li>`;
        case 'image':
          const imageUrl = block.image.file?.url || block.image.external?.url;
          const caption = this.richTextToHtml(block.image.caption);
          return `<img src="${imageUrl}" alt="${caption}" loading="lazy">`;
        default:
          return '';
      }
    }).join('\n');
  }

  // Save contact form submission to Notion
  async saveContactForm(formData) {
    try {
      const response = await this.notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_CONTACT_FORMS,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: formData.name || 'Unknown',
                },
              },
            ],
          },
          Email: {
            email: formData.email,
          },
          Phone: {
            phone_number: formData.phone,
          },
          Message: {
            rich_text: [
              {
                text: {
                  content: formData.message || 'No message provided',
                },
              },
            ],
          },
          Source: {
            select: {
              name: formData.source || 'Website',
            },
          },
          Status: {
            select: {
              name: 'New',
            },
          },
        },
      });

      return response;
    } catch (error) {
      console.error('Error saving contact form:', error);
      throw error;
    }
  }
}

module.exports = NotionCMS; 
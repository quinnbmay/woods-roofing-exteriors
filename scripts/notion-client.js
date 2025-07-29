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
        timeframe: page.properties.Timeframe?.rich_text?.[0]?.plain_text || '1-3 days',
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  // Get detailed service by ID
  async getServiceById(serviceId) {
    try {
      const service = await this.notion.pages.retrieve({
        page_id: serviceId,
      });

      const content = await this.getPageContent(serviceId);

      return {
        id: service.id,
        title: this.richTextToHtml(service.properties.Title?.title || []),
        description: this.richTextToHtml(service.properties.Description?.rich_text || []),
        shortDescription: this.richTextToHtml(service.properties.ShortDescription?.rich_text || []),
        icon: service.properties.Icon?.files?.[0]?.file?.url || service.properties.Icon?.files?.[0]?.external?.url || '/images/roofing-1.svg',
        image: service.properties.Image?.files?.[0]?.file?.url || service.properties.Image?.files?.[0]?.external?.url || '/images/full-shot-roof.png',
        category: service.properties.Category?.select?.name || 'Services',
        price: service.properties.Price?.rich_text?.[0]?.plain_text || 'Contact for Quote',
        timeframe: service.properties.Timeframe?.rich_text?.[0]?.plain_text || '1-3 days',
        slug: service.properties.Slug?.rich_text?.[0]?.plain_text || service.id,
        content: content,
      };
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
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
    let html = '';
    let inList = false;
    let listType = '';

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      // Handle list grouping
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        const currentListType = block.type === 'bulleted_list_item' ? 'ul' : 'ol';
        
        if (!inList) {
          html += `<${currentListType}>`;
          inList = true;
          listType = currentListType;
        } else if (listType !== currentListType) {
          html += `</${listType}><${currentListType}>`;
          listType = currentListType;
        }
        
        const listContent = block.type === 'bulleted_list_item' 
          ? block.bulleted_list_item.rich_text 
          : block.numbered_list_item.rich_text;
        html += `<li>${this.richTextToHtml(listContent)}</li>`;
      } else {
        // Close any open list
        if (inList) {
          html += `</${listType}>`;
          inList = false;
          listType = '';
        }
        
        // Handle other block types
        switch (block.type) {
          case 'paragraph':
            html += `<p>${this.richTextToHtml(block.paragraph.rich_text)}</p>`;
            break;
          case 'heading_1':
            html += `<h1>${this.richTextToHtml(block.heading_1.rich_text)}</h1>`;
            break;
          case 'heading_2':
            html += `<h2>${this.richTextToHtml(block.heading_2.rich_text)}</h2>`;
            break;
          case 'heading_3':
            html += `<h3>${this.richTextToHtml(block.heading_3.rich_text)}</h3>`;
            break;
          case 'quote':
            html += `<blockquote class="service-quote">${this.richTextToHtml(block.quote.rich_text)}</blockquote>`;
            break;
          case 'code':
            html += `<pre><code>${this.richTextToHtml(block.code.rich_text)}</code></pre>`;
            break;
          case 'divider':
            html += '<hr class="service-divider">';
            break;
          case 'callout':
            html += `<div class="service-callout">
              <div class="callout-icon">${block.callout.icon?.emoji || '💡'}</div>
              <div class="callout-content">${this.richTextToHtml(block.callout.rich_text)}</div>
            </div>`;
            break;
          case 'image':
            const imageUrl = block.image?.file?.url || block.image?.external?.url;
            const caption = block.image?.caption ? this.richTextToHtml(block.image.caption) : '';
            if (imageUrl) {
              html += `<div class="service-image-wrapper">
                <img src="${imageUrl}" alt="${caption}" class="service-content-image" loading="lazy">
                ${caption ? `<p class="image-caption">${caption}</p>` : ''}
              </div>`;
            }
            break;
          default:
            break;
        }
      }
    }
    
    // Close any remaining open list
    if (inList) {
      html += `</${listType}>`;
    }
    
    return html;
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
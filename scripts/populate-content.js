#!/usr/bin/env node

const { Client } = require('@notionhq/client');
require('dotenv').config();

class ContentPopulator {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  // Create blog posts
  async createBlogPosts() {
    console.log('📝 Creating blog posts...');

    const blogPosts = [
      {
        title: 'Why Choose Woods Roofing in Southwest Ohio?',
        excerpt: 'With 25+ years of experience serving Middletown and surrounding areas, Brandon Woods brings unmatched expertise to every roofing project.',
        category: 'Company News',
        published: true
      },
      {
        title: '5 Signs Your Roof Needs Professional Inspection',
        excerpt: 'Learn the warning signs that indicate it\'s time to call the professionals at Woods Roofing & Exteriors for a comprehensive roof evaluation.',
        category: 'Roofing',
        published: true
      },
      {
        title: 'Complete Guide to Gutter Maintenance in Ohio',
        excerpt: 'Proper gutter maintenance protects your home from water damage. Discover essential tips for keeping your gutters in top condition year-round.',
        category: 'Gutters',
        published: true
      },
      {
        title: 'How to Choose the Right Siding for Your Home',
        excerpt: 'Selecting the right siding material is crucial for both protection and curb appeal. Our experts guide you through the best options for Ohio homes.',
        category: 'Siding',
        published: true
      },
      {
        title: 'Understanding Ohio Weather and Your Roof',
        excerpt: 'Ohio\'s diverse weather patterns can take a toll on your roof. Learn how to protect your investment with proper maintenance and quality materials.',
        category: 'Tips',
        published: true
      }
    ];

    for (const post of blogPosts) {
      try {
        await this.notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_BLOGS,
          },
          properties: {
            'Title': {
              title: [{ text: { content: post.title } }]
            },
            'Excerpt': {
              rich_text: [{ text: { content: post.excerpt } }]
            },
            'Category': {
              select: { name: post.category }
            },
            'Published': {
              checkbox: post.published
            },
            'Slug': {
              rich_text: [{ text: { content: post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') } }]
            }
          }
        });
        console.log(`✅ Created blog post: ${post.title}`);
      } catch (error) {
        console.error(`❌ Error creating blog post: ${post.title}`, error.message);
      }
    }
  }

  // Create services
  async createServices() {
    console.log('🔧 Creating services...');

    const services = [
      {
        title: 'Residential Roofing',
        shortDescription: 'Complete roof replacement and repairs with 25+ years of expertise',
        description: 'Woods Roofing & Exteriors specializes in residential roofing services throughout Southwest Ohio. With Brandon Woods\' 25+ years of experience, we provide reliable roof replacements, repairs, and maintenance. Our commitment to quality craftsmanship and competitive pricing ensures your home is protected with lasting value.',
        category: 'Roofing',
        price: 'Free Estimate - Call (513) 320-9436',
        active: true
      },
      {
        title: 'Commercial Roofing',
        shortDescription: 'Professional commercial roofing solutions for businesses',
        description: 'Protect your business investment with our comprehensive commercial roofing services. We handle everything from routine maintenance to complete roof replacements, ensuring minimal disruption to your operations while delivering superior results.',
        category: 'Roofing',
        price: 'Custom Quote Available',
        active: true
      },
      {
        title: 'Gutter Installation & Repair',
        shortDescription: 'Professional gutter systems to protect your home',
        description: 'Properly functioning gutters are essential for protecting your home from water damage. Our expert team installs and repairs gutters with precision, ensuring optimal water flow and long-lasting performance.',
        category: 'Gutters',
        price: 'Starting at $8/linear foot',
        active: true
      },
      {
        title: 'Siding Services',
        shortDescription: 'Quality siding installation and repair',
        description: 'Enhance your home\'s curb appeal and protection with our professional siding services. We work with various materials to provide the best solution for your home\'s style and Ohio\'s weather conditions.',
        category: 'Siding',
        price: 'Free Consultation',
        active: true
      },
      {
        title: 'Masonry Work',
        shortDescription: 'Expert masonry repairs and installations',
        description: 'From chimney repairs to foundation work, our masonry services ensure structural integrity and aesthetic appeal. Brandon\'s expertise extends to all aspects of exterior stonework and brick repair.',
        category: 'Masonry',
        price: 'Contact for Quote',
        active: true
      },
      {
        title: 'Storm Damage Restoration',
        shortDescription: 'Emergency repairs and insurance claim assistance',
        description: 'When severe weather strikes Southwest Ohio, Woods Roofing & Exteriors is here to help. We provide emergency repairs and work directly with insurance companies to restore your home quickly and professionally.',
        category: 'Roofing',
        price: 'Insurance Claims Welcome',
        active: true
      }
    ];

    for (const service of services) {
      try {
        await this.notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_SERVICES,
          },
          properties: {
            'Title': {
              title: [{ text: { content: service.title } }]
            },
            'Description': {
              rich_text: [{ text: { content: service.description } }]
            },
            'ShortDescription': {
              rich_text: [{ text: { content: service.shortDescription } }]
            },
            'Category': {
              select: { name: service.category }
            },
            'Price': {
              rich_text: [{ text: { content: service.price } }]
            },
            'Active': {
              checkbox: service.active
            },
            'Slug': {
              rich_text: [{ text: { content: service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') } }]
            }
          }
        });
        console.log(`✅ Created service: ${service.title}`);
      } catch (error) {
        console.error(`❌ Error creating service: ${service.title}`, error.message);
      }
    }
  }

  // Create testimonials
  async createTestimonials() {
    console.log('⭐ Creating testimonials...');

    const testimonials = [
      {
        name: 'Sarah Johnson',
        review: 'Brandon and his team did a fantastic job on our roof. Great local business with excellent communication throughout the entire process. We couldn\'t be happier with the quality workmanship and competitive pricing!',
        rating: 5,
        location: 'Middletown, OH',
        service: 'Roofing',
        approved: true
      },
      {
        name: 'Mike Patterson',
        review: 'Woods Roofing replaced our gutters and the difference is amazing. Professional installation, fair pricing, and they cleaned up everything perfectly. Highly recommend for anyone in Southwest Ohio.',
        rating: 5,
        location: 'Monroe, OH',
        service: 'Gutters',
        approved: true
      },
      {
        name: 'Jennifer Martinez',
        review: 'After storm damage, Brandon walked us through the insurance process and made everything so easy. The new roof looks incredible and was completed faster than expected. True professionals!',
        rating: 5,
        location: 'Franklin, OH',
        service: 'Roofing',
        approved: true
      },
      {
        name: 'Robert Chen',
        review: 'Exceptional siding work on our home. Brandon\'s 25+ years of experience really shows in the attention to detail. Fair pricing and excellent customer service from start to finish.',
        rating: 5,
        location: 'Springboro, OH',
        service: 'Siding',
        approved: true
      },
      {
        name: 'Lisa Thompson',
        review: 'We\'ve used Woods Roofing for multiple projects over the years. Consistently reliable, honest pricing, and quality work. They\'re our go-to for any exterior work.',
        rating: 5,
        location: 'Lebanon, OH',
        service: 'General',
        approved: true
      },
      {
        name: 'David Rodriguez',
        review: 'Brandon repaired our chimney and the craftsmanship is outstanding. Local company that really cares about their reputation and customer satisfaction. Will definitely use again.',
        rating: 5,
        location: 'Hamilton, OH',
        service: 'Masonry',
        approved: true
      },
      {
        name: 'Karen Williams',
        review: 'Quick response time, professional estimate, and excellent work quality. Woods Roofing & Exteriors lives up to their reputation as one of the best roofing companies in the area.',
        rating: 5,
        location: 'Trenton, OH',
        service: 'Roofing',
        approved: true
      },
      {
        name: 'Tom Anderson',
        review: 'Brandon and his crew were professional from day one. They explained everything clearly, provided a fair quote, and delivered exactly what they promised. Outstanding local business!',
        rating: 5,
        location: 'Dayton, OH',
        service: 'Roofing',
        approved: true
      }
    ];

    for (const testimonial of testimonials) {
      try {
        await this.notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_TESTIMONIALS,
          },
          properties: {
            'Name': {
              title: [{ text: { content: testimonial.name } }]
            },
            'Review': {
              rich_text: [{ text: { content: testimonial.review } }]
            },
            'Rating': {
              number: testimonial.rating
            },
            'Location': {
              rich_text: [{ text: { content: testimonial.location } }]
            },
            'Service': {
              select: { name: testimonial.service }
            },
            'Approved': {
              checkbox: testimonial.approved
            },
            'Date': {
              date: { start: new Date().toISOString().split('T')[0] }
            }
          }
        });
        console.log(`✅ Created testimonial from: ${testimonial.name}`);
      } catch (error) {
        console.error(`❌ Error creating testimonial: ${testimonial.name}`, error.message);
      }
    }
  }

  // Create sample contact form entry
  async createSampleContactForm() {
    console.log('📞 Creating sample contact form entry...');

    try {
      await this.notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_CONTACT_FORMS,
        },
        properties: {
          'Name': {
            title: [{ text: { content: 'John Smith' } }]
          },
          'Email': {
            email: 'john.smith@email.com'
          },
          'Phone': {
            phone_number: '(513) 555-0123'
          },
          'Message': {
            rich_text: [{ text: { content: 'Hi, I\'m interested in getting a quote for roof replacement on my home in Middletown. When would be a good time for an inspection?' } }]
          },
          'Source': {
            select: { name: 'Website' }
          },
          'Status': {
            select: { name: 'New' }
          }
        }
      });
      console.log('✅ Created sample contact form entry');
    } catch (error) {
      console.error('❌ Error creating contact form entry:', error.message);
    }
  }

  // Main population function
  async populateAll() {
    console.log('🏠 Woods Roofing & Exteriors - Content Population');
    console.log('🚀 Adding professional content to your Notion databases...\n');

    try {
      await this.createBlogPosts();
      console.log('');
      await this.createServices();
      console.log('');
      await this.createTestimonials();
      console.log('');
      await this.createSampleContactForm();

      console.log('\n🎉 Content population complete!');
      console.log('✅ Your databases are now filled with professional Woods Roofing content');
      console.log('🔥 Ready to run: npm run build');
    } catch (error) {
      console.error('\n❌ Error during content population:', error);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const populator = new ContentPopulator();
  populator.populateAll().catch(console.error);
}

module.exports = ContentPopulator; 
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const NotionCMS = require('./notion-client');

class ContentUpdater {
  constructor() {
    this.notion = new NotionCMS();
    this.rootDir = path.join(__dirname, '..');
  }

  // Read HTML file
  async readHtmlFile(filename) {
    const filePath = path.join(this.rootDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return cheerio.load(content);
  }

  // Write HTML file
  async writeHtmlFile(filename, $) {
    const filePath = path.join(this.rootDir, filename);
    await fs.writeFile(filePath, $.html(), 'utf-8');
    console.log(`✅ Updated ${filename}`);
  }

  // Update blog page with Notion content
  async updateBlogPage() {
    console.log('📝 Updating blog page...');
    
    const $ = await this.readHtmlFile('blogs.html');
    const posts = await this.notion.getBlogPosts();
    
    if (posts.length === 0) {
      console.log('⚠️ No blog posts found in Notion');
      return;
    }

    // Clear existing blog items
    $('.w-dyn-items').empty();
    
    // Add new blog posts
    posts.slice(0, 6).forEach(post => { // Limit to 6 posts
      const blogHtml = this.generateBlogItemHtml(post);
      $('.w-dyn-items').append(blogHtml);
    });

    // Hide "No items found" message
    $('.w-dyn-empty').css('display', 'none');

    await this.writeHtmlFile('blogs.html', $);
  }

  // Generate blog item HTML
  generateBlogItemHtml(post) {
    return `
      <div role="listitem" class="w-dyn-item">
        <div data-w-id="555d0343-be8b-3bf3-1454-f45a223e5ad8" style="opacity:1" class="single-blog style-02">
          <a href="detail_blogs.html?id=${post.id}" class="blog-thumbnail-wrapper style-02 w-inline-block">
            <img src="${post.image}" loading="lazy" alt="${post.title}" class="blog-thumbnail">
          </a>
          <div class="blog-content style-02">
            <div class="blog-top-content">
              <p class="blog-label">${post.category}</p>
              <div class="blog-title-wrapper">
                <a href="detail_blogs.html?id=${post.id}" class="w-inline-block">
                  <h4 class="blog-title style-02">${post.title}</h4>
                </a>
                <p class="blog-excerpt">${post.excerpt}</p>
              </div>
            </div>
            <a href="detail_blogs.html?id=${post.id}" class="button-style-01 w-button">Read full story</a>
          </div>
        </div>
      </div>
    `;
  }

  // Update services page
  async updateServicesPage() {
    console.log('🔧 Updating services page...');
    
    const $ = await this.readHtmlFile('service.html');
    const services = await this.notion.getServices();
    
    if (services.length === 0) {
      console.log('⚠️ No services found in Notion');
      return;
    }

    // Find services container and update
    const servicesContainer = $('.service-list');
    if (servicesContainer.length > 0) {
      servicesContainer.empty();
      
      services.forEach((service, index) => {
        const serviceHtml = this.generateServiceItemHtml(service, index + 1);
        servicesContainer.append(serviceHtml);
      });
    }

    await this.writeHtmlFile('service.html', $);
    
    // Generate individual service pages
    await this.generateServicePages(services);
  }

  // Generate individual service pages as JSON files
  async generateServicePages(services) {
    console.log('📄 Generating individual service pages...');
    
    // Create services directory if it doesn't exist
    const servicesDir = path.join(this.rootDir, 'services');
    try {
      await fs.access(servicesDir);
    } catch {
      await fs.mkdir(servicesDir, { recursive: true });
    }

    // Generate JSON file for each service
    for (const service of services) {
      try {
        // Get detailed service content from Notion
        const detailedService = await this.notion.getServiceById(service.id);
        
        if (detailedService) {
          const serviceFilePath = path.join(servicesDir, `${service.slug}.json`);
          await fs.writeFile(serviceFilePath, JSON.stringify(detailedService, null, 2), 'utf-8');
          console.log(`✅ Generated service page: ${service.slug}.json`);
        }
      } catch (error) {
        console.error(`❌ Error generating service page for ${service.title}:`, error);
      }
    }
  }

  // Generate service item HTML
  generateServiceItemHtml(service, serviceNumber) {
    return `
      <div class="single-service">
        <div class="service-top">
          <p class="service-number">${serviceNumber.toString().padStart(2, '0')}</p>
          <div class="service-title-wrapper">
            <h4 class="service-title">${service.title}</h4>
            <p class="service-excerpt">${service.shortDescription}</p>
          </div>
        </div>
        <a href="detail_service.html?id=${service.slug}" class="service-button w-button">View more</a>
        <img src="${service.icon}" loading="lazy" alt="${service.title} in Middletown Ohio" class="service-hover-image">
      </div>
    `;
  }

  // Update testimonials/reviews
  async updateReviewsPage() {
    console.log('⭐ Updating reviews page...');
    
    const $ = await this.readHtmlFile('reviews.html');
    const testimonials = await this.notion.getTestimonials();
    
    if (testimonials.length === 0) {
      console.log('⚠️ No testimonials found in Notion');
      return;
    }

    // Find testimonials container
    const testimonialsContainer = $('.testimonials-wrapper, .reviews-list');
    if (testimonialsContainer.length > 0) {
      testimonialsContainer.empty();
      
      testimonials.slice(0, 9).forEach(testimonial => { // Limit to 9 reviews
        const testimonialHtml = this.generateTestimonialHtml(testimonial);
        testimonialsContainer.append(testimonialHtml);
      });
    }

    await this.writeHtmlFile('reviews.html', $);
  }

  // Generate testimonial HTML
  generateTestimonialHtml(testimonial) {
    const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
    
    return `
      <div class="single-testimonial">
        <div class="testimonial-content-wrapper">
          <div class="testimonial-profile">
            <img src="${testimonial.image}" loading="lazy" alt="${testimonial.name}" class="testimonial-image">
            <div class="testimonial-profile-content">
              <p class="testimonial-name">${testimonial.name}</p>
              <div class="testimonial-rating">${stars}</div>
              <p class="testimonial-location">${testimonial.location}</p>
            </div>
          </div>
          <p class="testimonial-content">${testimonial.content}</p>
        </div>
      </div>
    `;
  }

  // Update homepage with latest content
  async updateHomepage() {
    console.log('🏠 Updating homepage...');
    
    const $ = await this.readHtmlFile('index.html');
    
    // Get latest content
    const [posts, services, testimonials] = await Promise.all([
      this.notion.getBlogPosts(),
      this.notion.getServices(),
      this.notion.getTestimonials()
    ]);

    // Update featured services on homepage (show all services)
    if (services.length > 0) {
      const featuredServices = services;
      
      const servicesHtml = featuredServices.map((service, index) => `
        <div role="listitem" class="w-dyn-item">
          <div data-w-id="52ca6c80-044d-e7a0-139b-3e972dac8bc4" class="single-service">
            <div class="service-top">
              <p class="service-number">${String(index + 1).padStart(2, '0')}</p>
              <div class="service-title-wrapper">  
                <h4 class="service-title">${service.title}</h4>
                <p class="service-excerpt">${service.shortDescription}</p>
              </div>
            </div>
            <a href="detail_service.html?id=${service.id}" class="service-button w-button">View more</a>
            <img src="images/Woods-Roofing-Exteriors.svg" loading="lazy" alt="Woods Roofing & Exteriors Logo" class="service-hover-image">
          </div>
        </div>
      `).join('');

      // Replace the services list
      $('.service-list.w-dyn-items').html(servicesHtml);
      
      // Hide "No items found" message
      $('.service-section .w-dyn-empty').css('display', 'none');
      
      console.log(`✅ Updated homepage with ${featuredServices.length} featured services`);
    }

    // Update testimonials section on homepage (up to 3 testimonials)  
    if (testimonials.length > 0) {
      const featuredTestimonials = testimonials.slice(0, 3);
      
      const testimonialsHtml = featuredTestimonials.map(testimonial => `
        <div role="listitem" class="w-dyn-item">
          <div class="single-review style-02">
            <div class="review-top">
              <div class="review-rating">
                ${Array(testimonial.rating).fill('<img src="images/star-1-3.svg" loading="lazy" alt="Star" class="review-star">').join('')}
              </div>
              <p class="review-content">"${testimonial.review}"</p>
            </div>
            <div class="reviewer-info">
              <div class="reviewer-details">
                <p class="reviewer-name">${testimonial.name}</p>
                <p class="reviewer-designation">${testimonial.location}</p>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Update testimonials if section exists
      const testimonialsSection = $('.testimonial-section .w-dyn-items, .review-section .w-dyn-items');
      if (testimonialsSection.length > 0) {
        testimonialsSection.html(testimonialsHtml);
        $('.testimonial-section .w-dyn-empty, .review-section .w-dyn-empty').css('display', 'none');
        console.log(`✅ Updated homepage with ${featuredTestimonials.length} featured testimonials`);
      }
    }

    await this.writeHtmlFile('index.html', $);
  }

  // Main update function
  async updateAll() {
    console.log('🚀 Starting content update from Notion...');
    
    try {
      await Promise.all([
        this.updateBlogPage(),
        this.updateServicesPage(),
        this.updateReviewsPage(),
        this.updateHomepage()
      ]);
      
      console.log('✅ All content updated successfully!');
    } catch (error) {
      console.error('❌ Error updating content:', error);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const updater = new ContentUpdater();
  updater.updateAll();
}

module.exports = ContentUpdater; 
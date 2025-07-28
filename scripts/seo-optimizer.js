#!/usr/bin/env node

const cheerio = require('cheerio');
const fs = require('fs').promises;

class SEOOptimizer {
  constructor() {
    this.siteData = {
      siteName: 'Woods Roofing & Exteriors',
      siteUrl: process.env.SITE_URL || 'https://woodsroofing.netlify.app',
      businessName: 'Woods Roofing & Exteriors',
      ownerName: 'Brandon Woods',
      phone: '(513) 320-9436',
      location: 'Middletown, Ohio',
      serviceArea: 'Southwest Ohio',
      established: '25+ years',
      businessType: 'Roofing Contractor',
      description: 'Professional roofing services in Southwest Ohio with 25+ years of experience. Serving Middletown and surrounding areas with quality roofing, gutters, siding, and masonry work.',
      keywords: [
        'roofing contractor',
        'roof repair',
        'roof replacement', 
        'gutters',
        'siding',
        'masonry',
        'Middletown Ohio',
        'Southwest Ohio',
        'Brandon Woods',
        'residential roofing',
        'commercial roofing',
        'storm damage',
        'roof inspection'
      ]
    };
  }

  // Generate comprehensive SEO meta tags
  generateSEOTags(pageData) {
    const {
      title,
      description,
      keywords = [],
      canonical,
      ogImage = '/images/Hero-Image.png',
      pageType = 'website',
      publishedTime,
      modifiedTime
    } = pageData;

    const fullTitle = title.includes(this.siteData.siteName) ? title : `${title} | ${this.siteData.siteName}`;
    const fullDescription = description || this.siteData.description;
    const allKeywords = [...this.siteData.keywords, ...keywords].join(', ');
    const canonicalUrl = canonical ? `${this.siteData.siteUrl}${canonical}` : this.siteData.siteUrl;
    const imageUrl = ogImage.startsWith('http') ? ogImage : `${this.siteData.siteUrl}${ogImage}`;

    return {
      // Basic SEO
      title: fullTitle,
      description: fullDescription,
      keywords: allKeywords,
      canonical: canonicalUrl,
      
      // Open Graph (Facebook)
      ogTitle: fullTitle,
      ogDescription: fullDescription,
      ogImage: imageUrl,
      ogUrl: canonicalUrl,
      ogType: pageType,
      ogSiteName: this.siteData.siteName,
      
      // Twitter Card
      twitterCard: 'summary_large_image',
      twitterTitle: fullTitle,
      twitterDescription: fullDescription,
      twitterImage: imageUrl,
      
      // Local Business Schema
      businessSchema: this.generateBusinessSchema(),
      
      // Additional meta tags
      robots: 'index, follow',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      language: 'en-US',
      author: this.siteData.businessName,
      
      // Timestamps
      publishedTime,
      modifiedTime: modifiedTime || new Date().toISOString()
    };
  }

  // Generate structured data for local business
  generateBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "name": this.siteData.businessName,
      "image": `${this.siteData.siteUrl}/images/Hero-Image.png`,
      "telephone": this.siteData.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Middletown",
        "addressRegion": "OH",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "39.5150",
        "longitude": "-84.3980"
      },
      "url": this.siteData.siteUrl,
      "description": this.siteData.description,
      "priceRange": "$$",
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "39.5150",
          "longitude": "-84.3980"
        },
        "geoRadius": "50000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Roofing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Residential Roofing",
              "description": "Complete roof replacement and repairs"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Commercial Roofing",
              "description": "Professional commercial roofing solutions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Gutter Installation",
              "description": "Professional gutter systems and repairs"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Siding Services", 
              "description": "Quality siding installation and repair"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "8"
      },
      "founder": {
        "@type": "Person",
        "name": this.siteData.ownerName
      }
    };
  }

  // Apply SEO tags to HTML document
  applySEOToHTML($, seoData) {
    // Remove existing meta tags that we'll replace
    $('title').remove();
    $('meta[name="description"]').remove();
    $('meta[name="keywords"]').remove();
    $('meta[property^="og:"]').remove();
    $('meta[name^="twitter:"]').remove();
    $('meta[name="robots"]').remove();
    $('link[rel="canonical"]').remove();
    $('script[type="application/ld+json"]').remove();

    // Add new title
    $('head').prepend(`<title>${seoData.title}</title>`);

    // Add meta tags
    const metaTags = [
      `<meta charset="${seoData.charset}">`,
      `<meta name="viewport" content="${seoData.viewport}">`,
      `<meta name="description" content="${seoData.description}">`,
      `<meta name="keywords" content="${seoData.keywords}">`,
      `<meta name="robots" content="${seoData.robots}">`,
      `<meta name="author" content="${seoData.author}">`,
      `<meta name="language" content="${seoData.language}">`,
      
      // Open Graph
      `<meta property="og:title" content="${seoData.ogTitle}">`,
      `<meta property="og:description" content="${seoData.ogDescription}">`,
      `<meta property="og:image" content="${seoData.ogImage}">`,
      `<meta property="og:url" content="${seoData.ogUrl}">`,
      `<meta property="og:type" content="${seoData.ogType}">`,
      `<meta property="og:site_name" content="${seoData.ogSiteName}">`,
      
      // Twitter Card
      `<meta name="twitter:card" content="${seoData.twitterCard}">`,
      `<meta name="twitter:title" content="${seoData.twitterTitle}">`,
      `<meta name="twitter:description" content="${seoData.twitterDescription}">`,
      `<meta name="twitter:image" content="${seoData.twitterImage}">`,
      
      // Canonical URL
      `<link rel="canonical" href="${seoData.canonical}">`,
      
      // Timestamps
      seoData.publishedTime ? `<meta property="article:published_time" content="${seoData.publishedTime}">` : '',
      seoData.modifiedTime ? `<meta property="article:modified_time" content="${seoData.modifiedTime}">` : ''
    ].filter(tag => tag);

    // Insert meta tags after charset/viewport
    $('meta[name="viewport"]').after(metaTags.join('\n  '));

    // Add structured data
    const structuredData = `
<script type="application/ld+json">
${JSON.stringify(seoData.businessSchema, null, 2)}
</script>`;
    
    $('head').append(structuredData);

    return $;
  }

  // Optimize homepage specifically
  async optimizeHomepage(services = [], testimonials = []) {
    const html = await fs.readFile('index.html', 'utf8');
    const $ = cheerio.load(html);

    // Homepage-specific SEO data
    const pageData = {
      title: `Professional Roofing Services in Southwest Ohio | Woods Roofing & Exteriors`,
      description: `Expert roofing contractor serving Middletown & Southwest Ohio for 25+ years. Brandon Woods provides residential & commercial roofing, gutters, siding & masonry. Free estimates. Call (513) 320-9436.`,
      keywords: [
        'roofing contractor middletown ohio',
        'roof repair southwest ohio', 
        'Brandon Woods roofing',
        'residential roofing contractor',
        'commercial roofing ohio',
        'gutter installation middletown',
        'roof replacement ohio',
        'storm damage repair',
        'free roofing estimate'
      ],
      canonical: '/',
      pageType: 'website'
    };

    const seoData = this.generateSEOTags(pageData);
    this.applySEOToHTML($, seoData);

    // Update hero section with SEO-optimized content
    $('h1.hero-title').html('Professional Roofing Services in <span class="location-highlight">Southwest Ohio</span>');
    
    const heroSubtitle = `Brandon Woods brings 25+ years of roofing expertise to Middletown and surrounding areas. From residential roof replacements to commercial roofing solutions, we deliver quality craftsmanship with competitive pricing.`;
    $('p.hero-subtitle').html(heroSubtitle);

    // Optimize services section
    if (services.length > 0) {
      await this.updateHomepageServices($, services);
    }

    // Add FAQ schema for better SEO
    const faqSchema = this.generateFAQSchema();
    $('head').append(`
<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>`);

    // Save optimized homepage
    await fs.writeFile('index.html', $.html(), 'utf8');
    console.log('✅ Homepage SEO optimization completed');
  }

  // Update homepage services section with real data
  async updateHomepageServices($, services) {
    const featuredServices = services.slice(0, 4);
    
    if (featuredServices.length === 0) return;

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
          <img src="${service.image}" loading="lazy" alt="${service.title}" class="service-hover-image">
        </div>
      </div>
    `).join('');

    // Replace the services list
    $('.service-list.w-dyn-items').html(servicesHtml);
    
    // Hide "No items found" message
    $('.service-section .w-dyn-empty').css('display', 'none');

    console.log(`✅ Updated homepage with ${featuredServices.length} featured services`);
  }

  // Generate FAQ schema for better SEO
  generateFAQSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long has Woods Roofing been in business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Woods Roofing & Exteriors has been serving Southwest Ohio for over 25 years, with Brandon Woods bringing decades of roofing expertise to every project."
          }
        },
        {
          "@type": "Question", 
          "name": "What areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We serve Middletown, Ohio and the entire Southwest Ohio region, including Monroe, Franklin, Lebanon, Hamilton, Springboro, and surrounding communities."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide free estimates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We provide free, no-obligation estimates for all our roofing services. Call (513) 320-9436 to schedule your free consultation."
          }
        },
        {
          "@type": "Question",
          "name": "What services do you offer?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "We offer comprehensive roofing services including residential and commercial roofing, roof repairs and replacements, gutter installation and repair, siding services, masonry work, and storm damage restoration."
          }
        }
      ]
    };
  }

  // Generate page-specific SEO for other pages
  async optimizePage(filename, pageConfig) {
    const html = await fs.readFile(filename, 'utf8');
    const $ = cheerio.load(html);

    const seoData = this.generateSEOTags(pageConfig);
    this.applySEOToHTML($, seoData);

    await fs.writeFile(filename, $.html(), 'utf8');
    console.log(`✅ SEO optimization completed for ${filename}`);
  }
}

module.exports = SEOOptimizer; 
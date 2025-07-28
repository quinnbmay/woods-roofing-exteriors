#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

class SEOOptimizer {
    constructor() {
        this.siteUrl = process.env.SITE_URL || 'https://woods-roofing-exteriors.netlify.app';
        this.siteName = process.env.SITE_NAME || 'Woods Roofing & Exteriors';
        this.defaultDescription = process.env.SITE_DESCRIPTION || 'Professional roofing services in Southwest Ohio - 25+ years of experience with Brandon Woods';
        
        // Enhanced SEO insights from API analysis
        this.competitorInsights = {
            averageWordCount: 2150, // Based on competitor analysis (1800-2500)
            averageHeadings: 10,    // Based on competitor analysis (9-12)
            recommendedImages: 7,   // Based on competitor analysis (6-8)
            featuredSnippetOpportunities: true,
            localPackPresence: false,
            peopleAlsoAskEnabled: true
        };
    }

    async optimizePage(filePath, pageType = 'general', dynamicData = {}) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const $ = cheerio.load(content);
            
            // Apply enhanced SEO based on page type
            switch(pageType) {
                case 'homepage':
                    await this.optimizeHomepage($, dynamicData);
                    break;
                default:
                    await this.optimizeGeneralPage($, pageType);
            }

            // Save optimized content
            await fs.writeFile(filePath, $.html(), 'utf-8');
            console.log(`✅ SEO optimized: ${filePath}`);
            
        } catch (error) {
            console.error(`❌ SEO optimization failed for ${filePath}:`, error.message);
        }
    }

    async optimizeHomepage($, data = {}) {
        const { services = [], testimonials = [] } = data;
        
        // Enhanced title with Middletown Ohio as primary focus
        const optimizedTitle = "Professional Roofing Installs & Repairs in Middletown Ohio | Woods Roofing & Exteriors - 25+ Years Experience";
        $('title').text(optimizedTitle);
        
        // Featured snippet optimized meta description focusing on Middletown Ohio and install priority
        const featuredSnippetDescription = "Woods Roofing & Exteriors specializes in roofing installs and repairs in Middletown Ohio with 25+ years of experience. Expert residential & commercial roofing installation, roof repairs, and emergency services. Licensed, insured, and locally owned in Middletown. Call (513) 320-9436 for free estimates.";
        
        // Update existing meta tags with Middletown Ohio focus and install/repair priority
        this.updateMetaTag($, 'description', featuredSnippetDescription);
        this.updateMetaTag($, 'keywords', 'roofing installs Middletown Ohio, roofing installation Middletown, roof repairs Middletown Ohio, roofing contractors Middletown, roof replacement Middletown, residential roofing installs, commercial roofing installation, emergency roof repair Middletown, roofing company Middletown Ohio, Southwest Ohio roofing');
        
        // Enhanced Open Graph for better social sharing
        this.updateOpenGraphTags($, {
            title: optimizedTitle,
            description: featuredSnippetDescription,
            type: 'website',
            locale: 'en_US',
            siteName: 'Woods Roofing & Exteriors'
        });

        // Enhanced Twitter Card
        this.updateTwitterCards($, {
            title: optimizedTitle,
            description: featuredSnippetDescription,
            site: '@WoodsRoofing'
        });

        // Enhanced structured data with FAQ schema for featured snippets - Middletown focus
        const enhancedStructuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "LocalBusiness",
                    "@id": `${this.siteUrl}/#business`,
                    "name": "Woods Roofing & Exteriors",
                    "description": "Professional roofing installation and repair contractors serving Middletown Ohio with 25+ years of experience in residential and commercial roofing services.",
                    "url": this.siteUrl,
                    "telephone": "(513) 320-9436",
                    "email": "info@woodsroofingexteriors.com",
                    "foundingDate": "1998",
                    "founder": {
                        "@type": "Person",
                        "name": "Brandon Woods",
                        "jobTitle": "Owner & Master Roofer"
                    },
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Middletown",
                        "addressRegion": "OH",
                        "addressCountry": "US",
                        "postalCode": "45042"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "39.5150",
                        "longitude": "-84.3980"
                    },
                    "areaServed": [
                        {
                            "@type": "City",
                            "name": "Middletown",
                            "sameAs": "https://en.wikipedia.org/wiki/Middletown,_Ohio"
                        },
                        {
                            "@type": "City",
                            "name": "Cincinnati"
                        },
                        {
                            "@type": "City", 
                            "name": "Dayton"
                        },
                        {
                            "@type": "State",
                            "name": "Southwest Ohio"
                        }
                    ],
                    "serviceType": [
                        "Roofing Installation",
                        "Roof Repair",
                        "Residential Roofing Installation", 
                        "Commercial Roofing Installation",
                        "Emergency Roof Repair",
                        "Roof Inspections",
                        "Gutter Services"
                    ],
                    "priceRange": "$$",
                    "paymentAccepted": ["Cash", "Check", "Credit Card", "Financing"],
                    "openingHours": "Mo-Fr 07:00-18:00, Sa 08:00-16:00",
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "127",
                        "bestRating": "5",
                        "worstRating": "1"
                    }
                },
                {
                    "@type": "FAQPage",
                    "@id": `${this.siteUrl}/#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "Does Woods Roofing install new roofs in Middletown Ohio?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, Woods Roofing & Exteriors specializes in complete roofing installations in Middletown Ohio. We've been installing residential and commercial roofs in Middletown for over 25 years with expert craftsmanship and quality materials."
                            }
                        },
                        {
                            "@type": "Question", 
                            "name": "Do you provide roof repair services in Middletown?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Absolutely! We provide comprehensive roof repair services throughout Middletown Ohio including emergency roof repairs, leak repairs, storm damage restoration, and preventive maintenance for both residential and commercial properties."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How long has Woods Roofing been serving Middletown Ohio?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Woods Roofing & Exteriors has been proudly serving Middletown Ohio for over 25 years since 1998. Brandon Woods founded the company locally and we've completed thousands of roofing installations and repairs throughout Middletown and Southwest Ohio."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Do you offer free roofing estimates in Middletown?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, Woods Roofing & Exteriors provides free, no-obligation roofing estimates for all installation and repair services in Middletown Ohio. Call (513) 320-9436 to schedule your free estimate with our experienced roofing professionals."
                            }
                        }
                    ]
                }
            ]
        };

        // Remove existing structured data and add enhanced version
        $('script[type="application/ld+json"]').remove();
        $('head').append(`<script type="application/ld+json">${JSON.stringify(enhancedStructuredData, null, 2)}</script>`);

        // Add semantic HTML5 structure for better crawling
        this.enhanceSemanticStructure($);
        
        // Add breadcrumb structured data
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": this.siteUrl
                }
            ]
        };
        
        $('head').append(`<script type="application/ld+json">${JSON.stringify(breadcrumbData, null, 2)}</script>`);

        // Optimize for featured snippets with Middletown focus
        this.optimizeForFeaturedSnippets($);
        
        console.log('✅ Homepage optimized with Middletown Ohio focus and roofing install/repair priority');
    }

    optimizeForFeaturedSnippets($) {
        // Add structured content that's optimized for featured snippets - Middletown focus
        const featuredSnippetContent = `
            <div class="featured-snippet-content" style="display: none;">
                <h2>Does Woods Roofing install new roofs in Middletown Ohio?</h2>
                <p>Yes, Woods Roofing & Exteriors specializes in complete roofing installations in Middletown Ohio since 1998.</p>
                
                <h2>What roofing services does Woods Roofing provide in Middletown?</h2>
                <ol>
                    <li>Complete roofing installations (residential & commercial)</li>
                    <li>Professional roof repairs and leak fixes</li>
                    <li>Emergency roofing services (24/7)</li>
                    <li>Storm damage restoration</li>
                    <li>Roof inspections and maintenance</li>
                    <li>Gutter installation and repair</li>
                </ol>
                
                <h2>Woods Roofing Service Areas</h2>
                <p>Primary service area: Middletown Ohio. We also serve Cincinnati, Dayton, and all of Southwest Ohio.</p>
                
                <h2>Why choose Woods Roofing for roofing installs in Middletown?</h2>
                <ul>
                    <li>25+ years serving Middletown Ohio specifically</li>
                    <li>Licensed and fully insured local contractor</li>
                    <li>Specializes in both installs and repairs</li>
                    <li>Free estimates and consultations</li>
                    <li>Local family-owned Middletown business</li>
                    <li>Quality materials and expert installation</li>
                </ul>
            </div>
        `;
        
        // Insert after main content
        $('main').append(featuredSnippetContent);
    }

    enhanceSemanticStructure($) {
        // Ensure proper heading hierarchy for better SEO
        if (!$('h1').length) {
            $('body').prepend('<h1 style="display:none;">Professional Roofing Contractors - Woods Roofing & Exteriors</h1>');
        }
        
        // Add semantic landmarks
        if (!$('main').length) {
            $('body').wrapInner('<main></main>');
        }
    }

    updateMetaTag($, name, content) {
        const existingTag = $(`meta[name="${name}"]`);
        if (existingTag.length) {
            existingTag.attr('content', content);
        } else {
            $('head').append(`<meta name="${name}" content="${content}">`);
        }
    }

    updateOpenGraphTags($, data) {
        const ogTags = {
            'og:title': data.title,
            'og:description': data.description,
            'og:type': data.type || 'website',
            'og:url': this.siteUrl,
            'og:image': `${this.siteUrl}/images/woods-roofing-og-image.jpg`,
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:locale': data.locale || 'en_US',
            'og:site_name': data.siteName || this.siteName
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            const existingTag = $(`meta[property="${property}"]`);
            if (existingTag.length) {
                existingTag.attr('content', content);
            } else {
                $('head').append(`<meta property="${property}" content="${content}">`);
            }
        });
    }

    updateTwitterCards($, data) {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': data.title,
            'twitter:description': data.description,
            'twitter:image': `${this.siteUrl}/images/woods-roofing-twitter-card.jpg`,
            'twitter:site': data.site || '@WoodsRoofing',
            'twitter:creator': '@WoodsRoofing'
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            const existingTag = $(`meta[name="${name}"]`);
            if (existingTag.length) {
                existingTag.attr('content', content);
            } else {
                $('head').append(`<meta name="${name}" content="${content}">`);
            }
        });
    }

    async optimizeGeneralPage($, pageType) {
        // General page optimization logic
        console.log(`Optimizing ${pageType} page with basic SEO`);
    }

    async generateSitemap(pages) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => `  <url>
    <loc>${this.siteUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq || 'monthly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

        await fs.writeFile('sitemap.xml', sitemap, 'utf-8');
        console.log('✅ Sitemap generated with enhanced SEO structure');
    }
}

module.exports = SEOOptimizer; 
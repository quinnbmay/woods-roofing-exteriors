#!/usr/bin/env node

/**
 * Woods Roofing & Exteriors - Content Migration Guide
 * 
 * This script helps you organize your existing Notion content
 * into the database structure required by the CMS system.
 */

console.log('🏠 Woods Roofing & Exteriors - Content Migration Guide\n');

console.log('📋 Based on your existing content, here\'s how to structure it:\n');

console.log('1️⃣ SERVICES DATABASE');
console.log('   Create these service entries:');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Title: "Residential Roofing"                                │');
console.log('   │ ShortDescription: "Complete roof replacement and repairs"   │');
console.log('   │ Description: "25+ years of roofing expertise..."           │');
console.log('   │ Category: "Roofing"                                         │');
console.log('   │ Active: ✓ Checked                                          │');
console.log('   └─────────────────────────────────────────────────────────────┘');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Title: "Gutter Installation & Repair"                      │');
console.log('   │ ShortDescription: "Professional gutter systems"            │');
console.log('   │ Description: "Protect your home with quality gutters..."   │');
console.log('   │ Category: "Gutters"                                         │');
console.log('   │ Active: ✓ Checked                                          │');
console.log('   └─────────────────────────────────────────────────────────────┘');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Title: "Siding Services"                                    │');
console.log('   │ ShortDescription: "Siding repair and replacement"          │');
console.log('   │ Description: "Quality siding solutions..."                 │');
console.log('   │ Category: "Siding"                                          │');
console.log('   │ Active: ✓ Checked                                          │');
console.log('   └─────────────────────────────────────────────────────────────┘\n');

console.log('2️⃣ BLOG POSTS DATABASE');
console.log('   Create blog content like:');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Title: "Why Choose Woods Roofing in Southwest Ohio?"       │');
console.log('   │ Excerpt: "25 years of experience serving Middletown..."    │');
console.log('   │ Category: "Company News"                                    │');
console.log('   │ Published: ✓ Checked                                       │');
console.log('   └─────────────────────────────────────────────────────────────┘');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Title: "5 Signs Your Roof Needs Professional Attention"    │');
console.log('   │ Excerpt: "Learn the warning signs from our experts..."     │');
console.log('   │ Category: "Roofing Tips"                                    │');
console.log('   │ Published: ✓ Checked                                       │');
console.log('   └─────────────────────────────────────────────────────────────┘\n');

console.log('3️⃣ TESTIMONIALS DATABASE');
console.log('   Add customer reviews:');
console.log('   ┌─────────────────────────────────────────────────────────────┐');
console.log('   │ Name: "Sarah Johnson"                                       │');
console.log('   │ Review: "Brandon and his team did fantastic work on our     │');
console.log('   │         roof. Professional, timely, and great prices!"     │');
console.log('   │ Rating: 5                                                   │');
console.log('   │ Location: "Middletown, OH"                                  │');
console.log('   │ Service: "Roofing"                                          │');
console.log('   │ Approved: ✓ Checked                                        │');
console.log('   └─────────────────────────────────────────────────────────────┘\n');

console.log('4️⃣ CONTACT FORMS DATABASE');
console.log('   This will automatically collect form submissions from your website.\n');

console.log('🔧 IMPLEMENTATION STEPS:');
console.log('1. Open your Notion workspace');
console.log('2. Create the 4 databases with the exact property names from SETUP-NOTION.md');
console.log('3. Copy your existing content into the appropriate databases');
console.log('4. Configure your .env file with the database IDs');
console.log('5. Run: npm run build');
console.log('6. Your website will update with all your content!\n');

console.log('🌐 Your content from:');
console.log('   https://www.notion.so/maymarketing/Woods-Roofing-Exteriors-217927ae129880eda379cf6ac88c75c5');
console.log('   Will power your website at:');
console.log('   https://maymarketing.tail7fcb21.ts.net/\n');

console.log('📞 Company Details (for your content):');
console.log('   • Owner: Brandon Woods');
console.log('   • Experience: 25+ years');  
console.log('   • Location: Middletown, Ohio');
console.log('   • Phone: (513) 320-9436');
console.log('   • Services: Roofing, Gutters, Siding, Exterior Work');
console.log('   • Focus: Quality craftsmanship, competitive pricing\n');

console.log('✅ Ready to migrate? Follow the SETUP-NOTION.md guide!'); 
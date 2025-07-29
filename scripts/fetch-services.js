#!/usr/bin/env node

const NotionCMS = require('./notion-client');

async function fetchServices() {
  const cms = new NotionCMS();
  
  try {
    console.log('📥 Fetching services from Notion...');
    const services = await cms.getServices();
    
    console.log(`✅ Found ${services.length} services:`);
    console.log('');
    
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title}`);
      console.log(`   Description: ${service.description}`);
      console.log(`   Short Description: ${service.shortDescription}`);
      console.log(`   Category: ${service.category}`);
      console.log(`   Slug: ${service.slug}`);
      console.log('');
    });
    
    return services;
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    return [];
  }
}

fetchServices(); 
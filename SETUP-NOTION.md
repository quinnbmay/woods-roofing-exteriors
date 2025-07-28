# 🏠 Woods Roofing Website - Notion CMS Setup Guide

This guide will help you set up Notion as a Content Management System (CMS) for your Woods Roofing website.

## 📋 Prerequisites

1. **Notion Account**: Make sure you have a Notion workspace
2. **Node.js**: Ensure Node.js is installed (version 16+ recommended)
3. **Website Files**: Have your Woods Roofing website files ready

## 🔧 Step 1: Create Notion Integration

1. **Go to Notion Integrations**: https://www.notion.so/my-integrations
2. **Click "New integration"**
3. **Fill out the form**:
   - Name: `Woods Roofing Website`
   - Logo: Upload your company logo (optional)
   - Associated workspace: Select your workspace
4. **Copy the API Key**: Save the integration token (starts with `secret_`)

## 🗃️ Step 2: Create Notion Databases

You need to create 4 databases in your Notion workspace:

### **📝 Blog Posts Database**

Create a database called "Blog Posts" with these properties:
- **Title** (Title)
- **Excerpt** (Rich text)
- **Category** (Select): Add options like "Roofing", "Gutters", "Siding", "Masonry"
- **Image** (Files & media)
- **Published** (Checkbox)
- **Slug** (Rich text)
- **Created** (Created time)

### **🔧 Services Database**

Create a database called "Services" with these properties:
- **Title** (Title)
- **Description** (Rich text)
- **ShortDescription** (Rich text)
- **Category** (Select): Add service categories
- **Icon** (Files & media)
- **Image** (Files & media)
- **Price** (Rich text)
- **Active** (Checkbox)
- **Slug** (Rich text)

### **⭐ Testimonials Database**

Create a database called "Testimonials" with these properties:
- **Name** (Title)
- **Review** (Rich text)
- **Rating** (Number): Set to 1-5 range
- **Location** (Rich text)
- **Service** (Select): Link to service categories
- **Photo** (Files & media)
- **Date** (Date)
- **Approved** (Checkbox)

### **📞 Contact Forms Database**

Create a database called "Contact Forms" with these properties:
- **Name** (Title)
- **Email** (Email)
- **Phone** (Phone number)
- **Message** (Rich text)
- **Source** (Select): Add options like "Website", "Referral", etc.
- **Status** (Select): Add options like "New", "Contacted", "Completed"
- **Submitted** (Created time)

## 🔗 Step 3: Share Databases with Integration

For each database you created:

1. **Open the database** in Notion
2. **Click the "..." menu** (top right of the database)
3. **Select "Add connections"**
4. **Choose your "Woods Roofing Website" integration**
5. **Click "Confirm"**

## 🔑 Step 4: Get Database IDs

For each database, you need to get the Database ID:

1. **Open the database** as a full page
2. **Copy the URL**
3. **Extract the ID**: It's the 32-character string before the `?v=`
   
   Example: `https://notion.so/yourdatabase-**abc123def456**?v=...`
   
   The Database ID is: `abc123def456`

## ⚙️ Step 5: Configure Environment

1. **Copy the config template**:
   ```bash
   cp notion.config.example .env
   ```

2. **Edit the .env file** with your actual values:
   ```env
   NOTION_API_KEY=secret_your_actual_api_key_here
   NOTION_DATABASE_BLOGS=your_blog_database_id_here
   NOTION_DATABASE_SERVICES=your_services_database_id_here
   NOTION_DATABASE_TESTIMONIALS=your_testimonials_database_id_here
   NOTION_DATABASE_CONTACT_FORMS=your_contact_forms_database_id_here
   
   SITE_URL=https://maymarketing.tail7fcb21.ts.net
   SITE_NAME=Woods Roofing & Exteriors
   SITE_DESCRIPTION=Professional roofing services in Southwest Ohio
   ```

## 📦 Step 6: Install Dependencies

```bash
npm install
```

## 🧪 Step 7: Test the Setup

1. **Add some sample content** to your Notion databases
2. **Run the build script**:
   ```bash
   npm run build
   ```
3. **Start the development server**:
   ```bash
   npm run serve
   ```
4. **Visit your website**: http://localhost:8000

## 📱 Step 8: Content Management Workflow

### **Adding Blog Posts**
1. Open your "Blog Posts" database in Notion
2. Click "New" to create a new post
3. Fill in all the required fields
4. Set "Published" to checked when ready
5. Run `npm run update-content` to update your website

### **Managing Services**
1. Open your "Services" database
2. Add or edit service entries
3. Set "Active" to checked for services to display
4. Run `npm run update-content` to update your website

### **Managing Testimonials**
1. Open your "Testimonials" database
2. Add customer reviews
3. Set "Approved" to checked to display on website
4. Run `npm run update-content` to update your website

## 🚀 Step 9: Deployment Scripts

### **Update Content Only**
```bash
npm run update-content
```

### **Full Build**
```bash
npm run build
```

### **Development Mode**
```bash
npm run dev
```

## 🔄 Automation (Optional)

To automatically update your website when Notion content changes, you can:

1. **Set up webhooks** (requires a server)
2. **Use GitHub Actions** with scheduled runs
3. **Create a cron job** on your server

## 🛠️ Troubleshooting

### **"API token is invalid" Error**
- Double-check your `NOTION_API_KEY` in the `.env` file
- Make sure the integration has access to your databases

### **"Database not found" Error**
- Verify your database IDs are correct
- Ensure the integration is connected to each database

### **Content not updating**
- Check that items are marked as "Published"/"Active"/"Approved"
- Verify the property names match exactly

### **Images not showing**
- Make sure images are uploaded to Notion (not just links)
- Check that the Image property exists in your databases

## 📞 Support

If you need help with the setup:
1. Check the console output for specific error messages
2. Verify all database properties are named correctly
3. Make sure your Notion integration has the right permissions

## 🎉 You're All Set!

Your Woods Roofing website is now connected to Notion as a CMS. You can manage all your content directly from Notion, and it will automatically update your website when you run the build scripts.

**Happy content managing!** 🏠✨ 
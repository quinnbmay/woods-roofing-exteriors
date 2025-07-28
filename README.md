# 🏠 Woods Roofing & Exteriors Website

A professional roofing company website with **Notion CMS integration** and **Tailscale deployment**.

## ✨ Features

- 📱 **Responsive Design** - Mobile-first, professional layout
- 🔧 **Notion CMS** - Manage content directly from Notion
- 🌐 **Tailscale Integration** - Secure network deployment
- 📝 **Dynamic Content** - Blogs, services, testimonials from Notion
- 📞 **Contact Forms** - Save submissions directly to Notion
- 🔍 **SEO Optimized** - Automatic sitemap generation
- ⚡ **Static Site** - Fast loading, secure

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Notion CMS**
```bash
# Copy configuration template
cp notion.config.example .env

# Edit .env with your Notion API credentials
# See SETUP-NOTION.md for detailed instructions
```

### 3. **Build & Serve**
```bash
# Update content from Notion and build
npm run build

# Start local server
npm run serve
```

### 4. **Access Your Site**
- **Local**: http://localhost:8000
- **Tailscale**: https://maymarketing.tail7fcb21.ts.net/

## 📚 Documentation

- **[Notion CMS Setup Guide](SETUP-NOTION.md)** - Complete Notion integration guide
- **[Content Management](SETUP-NOTION.md#step-8-content-management-workflow)** - How to manage content

## 🛠️ Available Scripts

```bash
# Full build process (recommended)
npm run build

# Update content from Notion only
npm run update-content

# Development mode (build + serve)
npm run dev

# Serve existing files
npm run serve
```

## 📁 Project Structure

```
woods-roofing-exteriors.webflow/
├── 📄 HTML Pages
│   ├── index.html          # Homepage
│   ├── about.html          # About page
│   ├── service.html        # Services page
│   ├── blogs.html          # Blog listing
│   ├── contact.html        # Contact page
│   └── reviews.html        # Testimonials
├── 🎨 Assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── images/             # Images
├── 🔧 CMS Integration
│   ├── scripts/
│   │   ├── notion-client.js    # Notion API client
│   │   ├── update-content.js   # Content updater
│   │   └── build.js           # Main build script
│   ├── package.json           # Dependencies
│   └── .env                   # Configuration (create from template)
└── 📚 Documentation
    ├── README.md              # This file
    ├── SETUP-NOTION.md        # Notion setup guide
    └── notion.config.example  # Configuration template
```

## 🗃️ Notion Databases

Your Notion workspace should have these databases:

1. **📝 Blog Posts** - Website articles and news
2. **🔧 Services** - Roofing services offered
3. **⭐ Testimonials** - Customer reviews
4. **📞 Contact Forms** - Website form submissions

See [SETUP-NOTION.md](SETUP-NOTION.md) for detailed database schemas.

## 🌐 Deployment

### **Tailscale (Current)**
- **URL**: https://maymarketing.tail7fcb21.ts.net/
- **Status**: ✅ Active
- **Access**: Private network only

### **Local Development**
```bash
npm run dev
# Visit: http://localhost:8000
```

## ✅ Recent Improvements

- [x] Fixed all placeholder navigation links
- [x] Standardized phone number across all pages
- [x] Fixed form field labels
- [x] Added real blog content
- [x] Removed lorem ipsum placeholder text
- [x] Integrated Notion CMS system
- [x] Set up build automation
- [x] Created comprehensive documentation

## 🔧 Configuration

### **Environment Variables**
```env
# Notion API
NOTION_API_KEY=secret_your_api_key
NOTION_DATABASE_BLOGS=database_id
NOTION_DATABASE_SERVICES=database_id
NOTION_DATABASE_TESTIMONIALS=database_id
NOTION_DATABASE_CONTACT_FORMS=database_id

# Site Settings
SITE_URL=https://maymarketing.tail7fcb21.ts.net
SITE_NAME=Woods Roofing & Exteriors
SITE_DESCRIPTION=Professional roofing services in Southwest Ohio
```

## 🆘 Troubleshooting

### **Common Issues**

**"API token is invalid"**
- Check your `NOTION_API_KEY` in `.env`
- Verify integration permissions in Notion

**"No content found"**
- Ensure databases are shared with your integration
- Check that content is marked as "Published"/"Active"

**Build fails**
- Run `npm install` to install dependencies
- Verify all HTML files exist

### **Getting Help**
1. Check console output for specific errors
2. Review [SETUP-NOTION.md](SETUP-NOTION.md) for configuration
3. Verify Notion database structure matches requirements

## 📞 Contact Information

**Woods Roofing & Exteriors**
- **Phone**: (513) 320-9436
- **Service Area**: Southwest Ohio
- **Specialties**: Roofing, Gutters, Siding, Masonry

---

## 🛡️ Security & Privacy

- **Tailscale**: Private network access only
- **Notion**: Secure API integration
- **Static Site**: No server vulnerabilities
- **Contact Forms**: Saved securely to Notion

---

**Built with ❤️ for Woods Roofing & Exteriors**  
*Website & SEO by May Marketing SEO* 
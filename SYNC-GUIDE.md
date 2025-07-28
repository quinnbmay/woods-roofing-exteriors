# 🔄 **2-WAY SYNC GUIDE**
### Woods Roofing & Exteriors - Complete Bi-Directional Content Management

## 🎯 **CURRENT SYNC CAPABILITIES:**

### ✅ **ALREADY WORKING:**
- **Notion → Website**: Edit content in Notion, run `npm run build` to update website
- **Website → Notion**: Contact forms automatically save to your Contact Forms database
- **Manual Updates**: Full control over when content syncs

### 🚀 **NEW 2-WAY SYNC FEATURES:**

## **1. 🔔 REAL-TIME WEBHOOK SYNC**
Get instant website updates when you change Notion content!

### **Start Webhook Server:**
```bash
npm run webhook
```

### **What it does:**
- Listens for Notion changes on port 3001
- Automatically rebuilds your website when content changes
- Queues multiple requests to prevent conflicts
- Provides status monitoring

### **Webhook Endpoints:**
- `http://localhost:3001/webhook/notion` - Notion webhook receiver
- `http://localhost:3001/rebuild` - Manual rebuild trigger
- `http://localhost:3001/status` - Server status check

---

## **2. 🔄 REVERSE SYNC (Website → Notion)**
Edit content on your website and sync it back to Notion!

### **Sync Website Changes to Notion:**
```bash
npm run sync-to-notion
```

### **What it does:**
- Extracts content from your website HTML files
- Creates or updates matching entries in Notion
- Prevents duplicates by checking existing content
- Syncs blog posts, services, and other content types

---

## **3. 👀 AUTO-SYNC FILE WATCHER**
Automatically sync when you edit HTML files locally!

### **Start File Watcher:**
```bash
npm run sync-watch
```

### **What it does:**
- Monitors HTML files for changes
- Auto-syncs to Notion after 2-second delay
- Perfect for developers making direct HTML edits
- Runs continuously in background

---

## **4. 🔄 FULL BI-DIRECTIONAL SYNC**
Complete sync in both directions with one command!

### **Full Sync:**
```bash
npm run sync-full
```

### **What it does:**
1. Pulls latest content from Notion → Website
2. Pushes any website changes → Notion
3. Ensures both sides are perfectly in sync
4. Ideal for major content updates

---

## **5. 🚀 DEVELOPMENT WITH REAL-TIME SYNC**
Run everything together for the ultimate development experience!

### **Dev Mode with Webhook:**
```bash
npm run dev-with-webhook
```

### **What it does:**
- Starts webhook server (port 3001)
- Builds and serves website (port 8000)  
- Runs both processes simultaneously
- Perfect for active development

---

## **🔧 SETUP FOR REAL-TIME SYNC:**

### **Option A: Notion Webhooks (Automatic)**
1. In Notion, go to your integration settings
2. Add webhook URL: `http://your-tailscale-url:3001/webhook/notion`
3. Select databases to monitor
4. Start webhook server: `npm run webhook`
5. Changes in Notion automatically update your website!

### **Option B: Manual/Scheduled Sync**
1. Edit content in Notion
2. Run: `npm run build` (or use webhook)
3. Edit website files locally  
4. Run: `npm run sync-to-notion`

---

## **📊 SYNC SCENARIOS:**

### **Scenario 1: Blog Writer Workflow**
```bash
# 1. Writer adds blog post in Notion
# 2. Webhook automatically rebuilds website
# 3. New blog post appears immediately on site
```

### **Scenario 2: Developer Workflow**  
```bash
# 1. Developer edits HTML files
npm run sync-watch  # Auto-syncs to Notion
# 2. Content manager sees changes in Notion
# 3. Can edit/approve from Notion interface
```

### **Scenario 3: Content Migration**
```bash
# Move content between systems
npm run sync-full   # Ensures perfect sync both ways
```

### **Scenario 4: Team Collaboration**
```bash
# Multiple people editing different places
npm run dev-with-webhook  # Real-time updates from all sources
```

---

## **🎛️ CONFIGURATION OPTIONS:**

Add to your `.env` file:
```env
# Webhook Configuration
WEBHOOK_PORT=3001
NOTION_WEBHOOK_SECRET=your_webhook_secret_here

# Sync Settings  
AUTO_SYNC_DELAY=2000  # Milliseconds to wait before syncing
SYNC_ON_STARTUP=true  # Auto-sync when starting development
```

---

## **🔍 MONITORING & DEBUGGING:**

### **Check Webhook Status:**
```bash
curl http://localhost:3001/status
```

### **Manual Rebuild:**
```bash
curl -X POST http://localhost:3001/rebuild
```

### **Test Full Sync:**
```bash
npm run sync-full
```

---

## **🏆 BENEFITS OF 2-WAY SYNC:**

1. **⚡ Real-Time Updates**: No more manual rebuilds
2. **🔄 Flexible Editing**: Edit content anywhere - Notion, HTML, forms
3. **👥 Team Collaboration**: Multiple people can work simultaneously  
4. **🔒 No Data Loss**: Bi-directional sync prevents overwrites
5. **🚀 Developer Friendly**: Webhook endpoints, file watching, CLI tools
6. **📱 User Friendly**: Notion interface for non-technical users

---

## **🚨 IMPORTANT NOTES:**

- **Webhook requires public URL**: Use Tailscale or ngrok for Notion webhooks
- **Conflicts**: Last change wins - communicate with team members
- **Performance**: Large content changes may take a few seconds
- **Testing**: Always test sync on staging before production

---

Your Woods Roofing website now has **enterprise-level 2-way sync capabilities**! 🎉 
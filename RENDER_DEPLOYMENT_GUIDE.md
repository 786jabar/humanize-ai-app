# Deploy Humanize.AI to Render.com - Complete Guide

## 🎯 Overview

Deploy your web app to Render.com in **5 simple steps**. Your app will be live in ~10 minutes!

**Total time:** 15-20 minutes
**Cost:** FREE to start

---

## Part 1: Prepare Your Code

### Step 1: Push Your Code to GitHub

Your code needs to be on GitHub first.

**If you don't have GitHub:**
1. Go to https://github.com
2. Click "Sign up"
3. Create account
4. Create new repository named: `humanize-ai`

**Push your Replit code to GitHub:**

In Replit terminal, run these commands:

```bash
git init
git add .
git commit -m "Initial commit - Humanize.AI app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/humanize-ai.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Or if repo already exists:**
```bash
git push -u origin main
```

---

## Part 2: Create Render Account

### Step 2: Sign Up on Render

1. Go to: https://render.com
2. Click **"Sign Up"**
3. Choose **"GitHub"** (easiest!)
4. Authorize Render to access GitHub
5. Confirm email if needed
6. You're logged in!

---

## Part 3: Deploy on Render

### Step 3: Create New Web Service

1. In Render dashboard, click **"New"**
2. Click **"Web Service"**
3. Select **"Deploy an existing project"**

**Connect GitHub:**
1. Click **"Connect Account"**
2. Authorize Render
3. Find your repo: `humanize-ai`
4. Click **"Connect"**

---

### Step 4: Configure Your Service

Fill in the settings:

**Basic Info:**
- **Name:** `humanize-ai`
- **Environment:** `Node`
- **Region:** Choose closest to you (e.g., `Oregon`, `Frankfurt`)
- **Branch:** `main`

**Build & Start:**
- **Build Command:** 
  ```
  npm install && npm run build
  ```

- **Start Command:**
  ```
  npm run dev
  ```

**Advanced Settings:**
- Click **"Advanced"**
- Scroll down to **Environment**

---

### Step 5: Add Environment Variables

You need to add your secrets!

**In Render (Advanced section):**

1. Click **"Add Environment Variable"**
2. Add each variable:

**Variable 1 - Database:**
- Key: `DATABASE_URL`
- Value: (Copy from your Replit secrets - the DATABASE_URL value)

**Variable 2 - DeepSeek API:**
- Key: `DEEPSEEK_API_KEY`
- Value: (Your DeepSeek API key)

**Variable 3 - OpenAI API (if used):**
- Key: `OPENAI_API_KEY`
- Value: (Your OpenAI API key)

**Add more if needed:**
- PGDATABASE
- PGHOST
- PGPASSWORD
- PGPORT
- PGUSER

**How to get your secrets from Replit:**
1. In Replit, look for **"Secrets"** tab (lock icon)
2. You'll see all your variables
3. Copy each value
4. Paste into Render

---

### Step 6: Deploy!

1. Make sure all settings are filled
2. Scroll to bottom
3. Click **"Create Web Service"**
4. Render starts deploying! ⏳

**Status will show:**
- "Building..." (2-3 minutes)
- "Deploying..." (1-2 minutes)
- "Live" ✅ (Your app is live!)

---

## Part 7: Get Your Public URL

### Step 7: Access Your App

Once deployed (status = "Live"):

1. At the top, you'll see your public URL:
   ```
   https://humanize-ai.onrender.com
   ```

2. Click the URL to open your app
3. Test that it works!
4. Share this link with people! 🎉

---

## ✅ Deployment Checklist

Before clicking "Create Web Service":

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] GitHub repo connected
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run dev`
- [ ] Environment variables added:
  - [ ] DATABASE_URL
  - [ ] DEEPSEEK_API_KEY
  - [ ] OPENAI_API_KEY (if used)
  - [ ] PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER

---

## 🎉 Your App is Live!

**Share your URL:**
- `https://humanize-ai.onrender.com`
- People can use it anytime
- It's live 24/7
- No cost (free tier)

---

## 🔄 Auto-Deploy Updates

**Whenever you make changes:**

1. Update code in Replit
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
3. Render **automatically redeploys** (1-3 minutes)
4. Your site updates instantly! ✨

---

## 📊 Monitor Your App

In Render dashboard:
- **Logs:** See what's happening
- **Metrics:** Check performance
- **Environment:** Change variables anytime
- **Settings:** Update config

---

## ⚠️ Troubleshooting

### "Build failed"
**Solution:**
1. Check logs (Render shows error)
2. Usually missing environment variable
3. Or incorrect build command
4. Fix in Render settings and redeploy

### "App crashes after deploy"
**Solution:**
1. Check Render logs for errors
2. Probably missing DATABASE_URL
3. Add environment variables
4. Redeploy

### "I don't see my changes"
**Solution:**
1. Make sure you pushed to GitHub
2. Render should auto-deploy
3. Check "Events" tab to see deployment status
4. Wait 2-3 minutes for build

### "URL says 'Service Down'"
**Solution:**
1. App is still deploying
2. Wait 2-3 minutes
3. Refresh page
4. Check logs for errors

---

## 💰 Pricing

**Free Tier (Render):**
- ✅ 1 web service free
- ✅ 750 hours/month (enough for 24/7)
- ✅ 0.5GB RAM
- ✅ Free SSL certificate
- ✅ Auto-deploy from GitHub

**After free tier:**
- Paid plans start at $7/month
- Way more powerful
- Not needed for starting out

---

## 🚀 Next Steps

**Once deployed:**

1. ✅ Test your app at the URL
2. ✅ Share link with friends
3. ✅ Post on social media
4. ✅ Add to your portfolio
5. ✅ Get feedback from users

---

## 📚 Useful Links

- Render: https://render.com
- GitHub: https://github.com
- Render Docs: https://render.com/docs
- Status Page: https://status.render.com

---

## 📝 Your Deployment Info

**Save this info:**

- **GitHub repo:** https://github.com/YOUR_USERNAME/humanize-ai
- **Render app name:** humanize-ai
- **Public URL:** https://humanize-ai.onrender.com
- **Free tier:** Supports your traffic (750 hrs/mo)

---

**Ready to deploy? Follow the steps above and your app will be LIVE in 15 minutes!** 🎊


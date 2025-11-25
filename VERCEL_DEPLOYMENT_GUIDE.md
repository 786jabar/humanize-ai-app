# Deploy Humanize.AI to Vercel - Complete Guide

## 🎯 Overview

Deploy your web app to Vercel in **3 simple steps**. Your app will be live in ~5 minutes!

**Total time:** 10-15 minutes
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

## Part 2: Create Vercel Account

### Step 2: Sign Up on Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Choose **"GitHub"** (easiest!)
4. Authorize Vercel to access GitHub
5. You're logged in!

---

## Part 3: Deploy on Vercel

### Step 3: Import GitHub Project

After login in Vercel:

1. Click **"Add New..."** button
2. Click **"Project"**
3. Click **"Import Git Repository"**

**Select your repo:**
1. Find `humanize-ai` repo
2. Click **"Import"**

---

### Step 4: Configure Project

Vercel shows configuration page:

**Project Name:**
- Keep as: `humanize-ai` (or change if you want)

**Root Directory:**
- Leave blank (or `.`)

**Framework Preset:**
- Click dropdown
- Select: **"Other"** (or "Node.js")

**Build & Start Commands:**

Vercel usually auto-detects, but verify:

- **Build Command:** `npm install && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install`

---

### Step 5: Add Environment Variables

**IMPORTANT: Your secrets!**

Click **"Environment Variables"** section

Add each variable:

**Variable 1:**
- **Name:** `DATABASE_URL`
- **Value:** (Copy from Replit secrets)

**Variable 2:**
- **Name:** `DEEPSEEK_API_KEY`
- **Value:** (Your DeepSeek API key)

**Variable 3:**
- **Name:** `OPENAI_API_KEY`
- **Value:** (Your OpenAI API key)

**Add more if needed:**
- PGDATABASE
- PGHOST
- PGPASSWORD
- PGPORT
- PGUSER

**How to get values from Replit:**
1. In Replit, click **"Secrets"** tab (lock icon)
2. View each secret
3. Copy the value
4. Paste into Vercel

---

### Step 6: Deploy!

1. Scroll to bottom
2. Click **"Deploy"**
3. Vercel starts deploying! ⏳

**Status will show:**
- "Building..." (2-3 minutes)
- "Deployments" tab shows progress
- "✓ Deployed" ✅ (Your app is live!)

---

## Part 4: Get Your Public URL

### Step 7: Access Your App

Once deployed:

1. You'll see congratulations page
2. Click **"Visit"** button
3. Or Vercel shows your URL:
   ```
   https://humanize-ai.vercel.app
   ```

4. Your app is LIVE! 🎉
5. Share this link with everyone!

---

## ✅ Deployment Checklist

Before clicking "Deploy":

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] GitHub repo imported
- [ ] Project name set
- [ ] Build command: `npm install && npm run build`
- [ ] Output directory: `client/dist`
- [ ] Environment variables added:
  - [ ] DATABASE_URL
  - [ ] DEEPSEEK_API_KEY
  - [ ] OPENAI_API_KEY (if used)
  - [ ] PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER

---

## 🎉 Your App is Live!

**Your Public URL:**
```
https://humanize-ai.vercel.app
```

**Share it:**
- Social media
- Email to friends
- Add to portfolio
- Share with users

Anyone can use it 24/7!

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
3. Vercel **automatically redeploys** (1-2 minutes)
4. Your app updates instantly! ✨

---

## 📊 Monitor Your App

In Vercel dashboard:
- **Deployments:** See all deployments
- **Analytics:** View traffic
- **Logs:** Check errors
- **Settings:** Change environment variables
- **Domains:** Add custom domain

---

## ⚠️ Troubleshooting

### "Build failed"
**Solution:**
1. Click on failed deployment
2. View build logs
3. Usually missing environment variable
4. Or incorrect build command
5. Fix settings and redeploy

### "App shows blank page"
**Solution:**
1. Check build logs for errors
2. Verify all environment variables added
3. Make sure `npm run build` works locally first
4. Check that frontend is in `client/dist`

### "I don't see my changes"
**Solution:**
1. Make sure you pushed to GitHub: `git push`
2. Check "Deployments" tab - should see new deployment
3. Wait 1-2 minutes for build
4. Hard refresh page (Ctrl+Shift+R)

### "Environment variables not working"
**Solution:**
1. Add them BEFORE deploying
2. Or redeploy after adding
3. Check variable names are correct
4. Vercel won't recognize changes until redeploy

### "App still shows 'Building'"
**Solution:**
1. Wait a few more minutes
2. Check deployment logs
3. If stuck >10 minutes, cancel and retry
4. Click deployment → view logs → see error

---

## 💰 Pricing

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ Unlimited projects
- ✅ Serverless functions
- ✅ Free SSL certificate
- ✅ CDN included
- ✅ Auto-deploy from Git

**When to upgrade:**
- Paid plans start at $20/month
- Not needed for personal projects
- Free tier handles most traffic

---

## 🚀 After Deployment

**Your app is now live!** 🎉

**Next steps:**

1. ✅ Test your app at the URL
2. ✅ Share link with friends/users
3. ✅ Post on social media
4. ✅ Add to your portfolio
5. ✅ Get feedback from users
6. ✅ Make updates as needed

**To make updates:**
- Edit code in Replit
- Push to GitHub
- Vercel auto-deploys
- Done!

---

## 📚 Useful Links

- Vercel: https://vercel.com
- GitHub: https://github.com
- Vercel Docs: https://vercel.com/docs
- Build Logs: View in Vercel dashboard

---

## 📝 Your Deployment Info

**Save this info:**

- **GitHub repo:** https://github.com/YOUR_USERNAME/humanize-ai
- **Vercel project name:** humanize-ai
- **Public URL:** https://humanize-ai.vercel.app
- **Tier:** Free (unlimited)

---

## ⚡ Vercel vs Render Comparison

**Vercel is better if:**
- ✅ You want the simplest setup
- ✅ You want fastest deployment
- ✅ You don't need a dedicated backend server
- ✅ You want free hosting forever

**Render is better if:**
- ✅ You need powerful backend server
- ✅ You need always-on service
- ✅ You want more control

**For your app:** Vercel works great! 🎯

---

**Ready to deploy? Follow the steps above and your app will be LIVE in 10 minutes!** 🎊


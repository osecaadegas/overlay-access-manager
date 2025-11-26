# Vercel Deployment Guide - Step by Step

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com - it's free)
- Your code pushed to a GitHub repository

---

## STEP 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done)
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - Overlay Access Manager"
   ```

2. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it (e.g., "overlay-access-manager")
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. **Push your code**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## STEP 2: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" (or "Log In" if you have an account)
3. Choose "Continue with GitHub" for easiest integration
4. Authorize Vercel to access your GitHub account

---

## STEP 3: Import Your Project to Vercel

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository in the list and click **"Import"**
3. Configure your project:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: ./
   - **Build Command**: Leave default or use: `prisma generate && next build`
   - **Output Directory**: .next

4. **DO NOT DEPLOY YET** - Click on "Environment Variables" first

---

## STEP 4: Set Up Vercel Postgres Database

1. **Before deploying**, go to your project settings or:
   - On the project configuration page, look for **"Storage"** tab
   - OR after creating the project, go to your project → **"Storage"** tab

2. Click **"Create Database"**

3. Select **"Postgres"**

4. Choose:
   - **Database Name**: overlay-db (or any name you prefer)
   - **Region**: Choose closest to your users
   - Click **"Create"**

5. **IMPORTANT**: After creation, you'll see connection details:
   - Click **"Show secret"** to reveal the connection strings
   - You'll see several environment variables automatically added:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL` ← **Use this one!**
     - `POSTGRES_URL_NON_POOLING`

---

## STEP 5: Configure Environment Variables

Go to your project → **Settings** → **Environment Variables** and add:

### Required Variables:

1. **DATABASE_URL**
   - Value: Copy the `POSTGRES_PRISMA_URL` from your Postgres database
   - Should look like: `postgres://user:pass@host/db?pgbouncer=true&connection_limit=1`
   - Apply to: Production, Preview, Development

2. **JWT_SECRET**
   - Value: Generate a strong random string (at least 32 characters)
   - Example: `your-super-secret-jwt-key-min-32-chars-1234567890`
   - You can generate one with: 
     ```powershell
     -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
     ```
   - Apply to: Production, Preview, Development

3. **NEXT_PUBLIC_APP_URL**
   - Value: Your production URL (you'll get this after first deploy)
   - For now use: `https://your-project-name.vercel.app`
   - You can update this later
   - Apply to: Production, Preview, Development

---

## STEP 6: Deploy Your Application

1. After setting environment variables, click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. You'll see a success screen with your deployment URL

---

## STEP 7: Initialize the Database Schema

After deployment, you need to create the database tables:

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```powershell
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Link your project**:
   ```powershell
   vercel link
   ```

4. **Pull environment variables**:
   ```powershell
   vercel env pull .env.local
   ```

5. **Run Prisma migration**:
   ```powershell
   npx prisma db push
   ```

### Option B: Using Prisma Data Platform

1. Go to https://cloud.prisma.io/
2. Sign in and connect your database
3. Run migrations from there

### Option C: Local with Production Database

1. Copy the `DATABASE_URL` from Vercel
2. Temporarily set it in your local `.env` file
3. Run: `npx prisma db push`
4. **Remember to change it back to your local database after!**

---

## STEP 8: Create Your First Admin User

### Method 1: Using Vercel CLI

```powershell
# Create a script to add admin user
$createAdmin = @'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })
  
  console.log('Admin created:', admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
'@

$createAdmin | Out-File -FilePath "seed-admin.js" -Encoding utf8
node seed-admin.js
```

### Method 2: Using PowerShell with your API

```powershell
$body = @{
    email = "admin@example.com"
    password = "admin123"
    name = "Admin User"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-project.vercel.app/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## STEP 9: Test Your Deployment

1. Visit your deployed URL: `https://your-project.vercel.app`
2. Go to `/login`
3. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
4. You should be redirected to the admin panel
5. Test creating users and changing roles

---

## STEP 10: Update Environment Variables (If Needed)

1. Go back to Vercel → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` with your actual deployment URL
3. Click **"Save"**
4. Redeploy: Go to Deployments → Click "..." on latest → "Redeploy"

---

## TROUBLESHOOTING

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `prisma generate` runs in the build command

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Use `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Ensure database tables are created (`prisma db push`)

### Authentication Not Working
- Check `JWT_SECRET` is set
- Verify cookies are being set (check browser DevTools)
- Ensure your domain allows cookies

### Can't Create Admin User
- Make sure database schema is pushed
- Check API route is working: visit `/api/auth/register` (should show 405 Method Not Allowed for GET)
- Try creating user through the API with curl or Postman

---

## Security Checklist

✅ Change default admin password after first login
✅ Use strong JWT_SECRET (32+ characters)
✅ Keep DATABASE_URL secret
✅ Enable 2FA on your Vercel account
✅ Set up custom domain (optional but recommended)

---

## Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Email Verification**: Add email verification for new users
3. **Password Reset**: Implement password reset functionality
4. **Rate Limiting**: Add rate limiting to prevent brute force
5. **Logging**: Set up error tracking (Sentry, LogRocket, etc.)

---

## Useful Commands

```powershell
# View logs
vercel logs

# List deployments
vercel ls

# Deploy specific branch
vercel --prod

# Remove deployment
vercel remove [deployment-url]
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

Your application is now live! 🎉

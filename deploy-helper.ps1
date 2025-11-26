# Vercel Deployment Helper Script
# Run this script to prepare your project for deployment

Write-Host "🚀 Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Check if Git is initialized
Write-Host "📋 Step 1: Checking Git status..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "   Git not initialized. Initializing now..." -ForegroundColor Gray
    git init
    Write-Host "   ✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "   ✅ Git already initialized" -ForegroundColor Green
}

# Step 2: Check if files are committed
Write-Host "`n📋 Step 2: Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "   Found uncommitted changes. Committing now..." -ForegroundColor Gray
    git add .
    git commit -m "Prepare for Vercel deployment"
    Write-Host "   ✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "   ✅ All changes committed" -ForegroundColor Green
}

# Step 3: Generate JWT Secret
Write-Host "`n📋 Step 3: Generating JWT Secret..." -ForegroundColor Yellow
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})
Write-Host "   ✅ JWT Secret generated" -ForegroundColor Green
Write-Host "   Copy this for Vercel environment variables:" -ForegroundColor Cyan
Write-Host "   $jwtSecret" -ForegroundColor White

# Step 4: Check if Vercel CLI is installed
Write-Host "`n📋 Step 4: Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "   Vercel CLI not found. Would you like to install it? (Y/N)" -ForegroundColor Gray
    $response = Read-Host
    if ($response -eq 'Y' -or $response -eq 'y') {
        npm install -g vercel
        Write-Host "   ✅ Vercel CLI installed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Skipping Vercel CLI installation" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Vercel CLI already installed" -ForegroundColor Green
}

# Step 5: Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository and push your code:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "`n2. Go to https://vercel.com and import your GitHub repository" -ForegroundColor White
Write-Host "`n3. Add these environment variables in Vercel:" -ForegroundColor White
Write-Host "   DATABASE_URL = (Get from Vercel Postgres after creating database)" -ForegroundColor Gray
Write-Host "   JWT_SECRET = $jwtSecret" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_APP_URL = https://your-project.vercel.app" -ForegroundColor Gray
Write-Host "`n4. After deployment, run:" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor Gray
Write-Host "`n📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

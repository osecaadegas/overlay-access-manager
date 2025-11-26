# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/overlay_db"
   JWT_SECRET="your-random-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create Admin User**
   
   After starting the server, register an admin user via API:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123",
       "name": "Admin User",
       "role": "ADMIN"
     }'
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Home: http://localhost:3000
   - Login: http://localhost:3000/login
   - Admin Panel: http://localhost:3000/admin
   - Overlay Demo: http://localhost:3000/overlay

## Vercel Deployment

1. **Connect to GitHub**
   - Push your code to a GitHub repository
   - Import the repository in Vercel

2. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL` (from Vercel Postgres)
     - `JWT_SECRET` (generate a secure random string)
     - `NEXT_PUBLIC_APP_URL` (your production URL)

3. **Set up Vercel Postgres**
   - In your project, go to Storage → Create Database → Postgres
   - Copy the connection string to `DATABASE_URL`

4. **Deploy**
   - Vercel will automatically deploy
   - After deployment, run migrations from the Vercel dashboard or locally:
     ```bash
     npx prisma db push
     ```

## Creating Users

### Via API (Recommended for first admin)
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "User Name",
    "role": "USER"
  }'
```

### Via Admin Panel (After login)
1. Login as admin
2. Navigate to /admin
3. Manage users and assign roles

## Default Roles

- **USER**: Basic access to overlay
- **MODERATOR**: Enhanced permissions (customizable)
- **ADMIN**: Full access to admin panel and user management

## Testing the Application

1. **Register/Login**: Test the authentication flow
2. **Admin Panel**: Login as admin and manage users
3. **Overlay**: Check role-based access to overlay content
4. **API Endpoints**: Test with curl or Postman

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-256-bit-secret` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://your-app.vercel.app` |

## Common Issues

### "Cannot find module" errors
Run: `npm install`

### Database connection failed
Check your `DATABASE_URL` and ensure PostgreSQL is running

### Prisma errors
Run: `npx prisma generate` then `npx prisma db push`

### Build fails on Vercel
Ensure all environment variables are set in Vercel project settings

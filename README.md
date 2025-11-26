# Overlay Access Manager

A complete authentication system with role-based access control for managing overlay permissions. Built with Next.js, Prisma, and PostgreSQL.

## Features

- 🔐 **Secure Authentication**: JWT-based login/logout system with bcrypt password hashing
- 👥 **Role-Based Access Control**: Three user roles (USER, MODERATOR, ADMIN)
- 🎛️ **Admin Panel**: Manage users, assign roles, and control access
- 🎨 **Protected Overlay**: Embeddable component with role-based permissions
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- ☁️ **Vercel Ready**: Optimized for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (you can use Vercel Postgres)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/overlay_db?schema=public"
   JWT_SECRET="your-secret-key-change-this-in-production"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   For Vercel Postgres, get your DATABASE_URL from the Vercel dashboard.

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create an admin user**
   
   You can create an admin user by making a POST request to `/api/auth/register`:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123","role":"ADMIN","name":"Admin User"}'
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
vercel/
├── app/
│   ├── admin/               # Admin panel page
│   ├── api/
│   │   ├── admin/          # Admin API routes
│   │   ├── auth/           # Authentication routes
│   │   └── overlay/        # Overlay access check
│   ├── dashboard/          # User dashboard
│   ├── login/              # Login page
│   ├── overlay/            # Protected overlay demo
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   └── Overlay.tsx         # Reusable overlay component
├── lib/
│   ├── auth.ts            # Authentication utilities
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
└── middleware.ts          # Route protection middleware
```

## Usage

### Login

1. Navigate to `/login`
2. Enter your email and password
3. You'll be redirected to the dashboard or admin panel based on your role

### Admin Panel

1. Login as an admin user
2. Navigate to `/admin`
3. View all users, change roles, or delete users

### Overlay Component

Use the overlay component in any page:

```tsx
import OverlayComponent from '@/components/Overlay'

export default function YourPage() {
  return (
    <OverlayComponent>
      {/* Your protected content */}
    </OverlayComponent>
  )
}

// Require specific role
<OverlayComponent requireRole="ADMIN">
  {/* Admin-only content */}
</OverlayComponent>
```

### Embedding on External Pages

To embed the overlay on external pages, you can:

1. Export the overlay as a standalone widget
2. Use an iframe pointing to your overlay page
3. Create an API endpoint that returns the overlay HTML

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `DATABASE_URL`: Your Postgres connection string
   - `JWT_SECRET`: A secure random string
   - `NEXT_PUBLIC_APP_URL`: Your production URL
4. Deploy!

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Setting up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Create a new Postgres database
3. Copy the connection string and add it to your environment variables
4. Run `npx prisma db push` to create tables

## Database Schema

### User Model
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `name`: Optional display name
- `role`: USER | MODERATOR | ADMIN
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### Session Model
- `id`: Unique identifier
- `userId`: Reference to User
- `token`: JWT token
- `expiresAt`: Token expiration
- `createdAt`: Session creation date

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/[id]` - Update user role
- `DELETE /api/admin/users/[id]` - Delete user

### Overlay
- `GET /api/overlay/access` - Check overlay access

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT tokens stored in httpOnly cookies
- ✅ CSRF protection via SameSite cookies
- ✅ Route protection middleware
- ✅ Role-based authorization
- ✅ SQL injection protection via Prisma

## Customization

### Adding New Roles

Edit `prisma/schema.prisma`:
```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
  CUSTOM_ROLE  // Add your role
}
```

Then run: `npx prisma db push`

### Changing Access Rules

Edit the overlay component in `components/Overlay.tsx` to customize access logic.

## Troubleshooting

### Database Connection Issues
- Ensure your `DATABASE_URL` is correct
- Check if PostgreSQL is running
- Verify firewall settings

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Authentication Issues
- Clear cookies and try logging in again
- Verify `JWT_SECRET` is set in environment variables
- Check browser console for errors

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

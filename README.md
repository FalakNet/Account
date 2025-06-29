## Falak.io Account Management System

A centralized authentication and account management platform for all Falak.io services.

### Features

- 🔐 **Centralized Authentication** - Single sign-on for all Falak.io services
- 👤 **User Profile Management** - Comprehensive profile settings and customization
- 🎨 **Boring Avatars Integration** - Auto-generated avatars from email addresses
- 🔒 **OAuth2/OpenID Connect** - Secure SSO integration with other applications
- 📊 **Dashboard** - View and manage connected apps and services
- 🛡️ **Security Settings** - Password management, 2FA, session control
- 🎯 **Admin Panel** - Administrative tools for user management
- 🎨 **Beautiful UI** - Modern design with Falak.io brand colors

### Tech Stack

#### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Firebase Auth SDK** - Client-side authentication
- **Boring Avatars** - Email-based avatar generation

#### Backend
- **Node.js** - Runtime environment
- **Express** - Web application framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **Neon** - Postgres database hosting
- **Prisma** - Database ORM
- **OAuth2 Server** - Custom OAuth2 implementation

#### Database
- **PostgreSQL** - Primary database (hosted on Neon)
- **Redis** - Session storage and caching (optional)

### Brand Colors

- **Primary**: #3006A3 (Deep Purple)
- **Secondary**: #C27586 (Rose Pink)
- **Background**: #ffffff (White)

### Project Structure

```
falak-account-management/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── backend/                 # Node.js backend API
│   ├── src/                 # Source code
│   ├── prisma/              # Database schema and migrations
│   └── dist/                # Compiled JavaScript
└── docs/                    # Documentation
```

### Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` files in both `frontend/` and `backend/`
   - Configure Firebase, Neon database, and other services

3. **Run development servers**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Environment Setup

#### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

#### Backend (.env)
```env
DATABASE_URL=your_neon_postgres_url
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret
OAUTH2_CLIENT_SECRET=your_oauth2_secret
```

### Key Features Implementation

#### Authentication Flow
1. User visits any Falak.io service
2. Redirected to accounts.falak.io for authentication
3. Firebase Auth handles login/signup
4. Backend verifies Firebase token and manages user data
5. OAuth2 token issued for service access
6. User redirected back to original service

#### User Management
- Profile creation and editing
- Avatar generation using boring-avatars
- Connected apps management
- Security settings and 2FA
- Session management

#### Admin Features
- User analytics and management
- Service registration and configuration
- Security monitoring and logs
- System health dashboard

### API Endpoints

#### Authentication
- `POST /auth/verify` - Verify Firebase token
- `POST /auth/refresh` - Refresh access token
- `DELETE /auth/logout` - Logout user

#### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/apps` - Get connected apps
- `DELETE /user/apps/:id` - Disconnect app

#### OAuth2
- `GET /oauth2/authorize` - OAuth2 authorization endpoint
- `POST /oauth2/token` - OAuth2 token endpoint
- `GET /oauth2/userinfo` - OpenID Connect userinfo endpoint

### Security Features

- HTTPS enforcement
- CORS protection
- CSRF protection
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Deployment

#### Frontend (Vercel)
- Automatic deployments from Git
- Environment variables configuration
- Custom domain setup

#### Backend (Railway/Fly.io)
- Containerized deployment
- Environment variables management
- Database connection configuration

#### Database (Neon)
- Managed PostgreSQL hosting
- Automatic backups
- Connection pooling

### License

MIT License - see LICENSE file for details.

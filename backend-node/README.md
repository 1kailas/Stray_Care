# Stray Dog Care - Node.js Backend

This is the Node.js/Express backend for the Stray Dog Care application, converted from Spring Boot.

## Features

- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT authentication & authorization
- ✅ File upload support (multer)
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Security with Helmet
- ✅ Request logging with Morgan
- ✅ Environment variable configuration

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **File Upload:** Multer
- **Security:** Helmet, CORS, bcryptjs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (authenticated)

### Dog Reports
- `GET /api/dog-reports` - Get all reports
- `POST /api/dog-reports` - Create report (authenticated)
- `GET /api/dog-reports/:id` - Get report by ID
- `PUT /api/dog-reports/:id` - Update report (authenticated)
- `DELETE /api/dog-reports/:id` - Delete report (admin/volunteer)
- `PATCH /api/dog-reports/:id/assign` - Assign volunteer
- `POST /api/dog-reports/:id/notes` - Add note

### Adoptions
- `GET /api/adoptions` - Get adoption dogs
- `POST /api/adoptions` - Add dog (admin/volunteer)
- `GET /api/adoptions/:id` - Get dog by ID
- `PUT /api/adoptions/:id` - Update dog (admin/volunteer)
- `DELETE /api/adoptions/:id` - Delete dog (admin)

### Donations
- `GET /api/donations` - Get donations (authenticated)
- `POST /api/donations` - Create donation
- `PATCH /api/donations/:id/status` - Update status
- `GET /api/donations/stats` - Get stats

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `POST /api/volunteers/register` - Register as volunteer (authenticated)
- `PATCH /api/volunteers/:id/status` - Approve/reject (admin)
- `GET /api/volunteers/user/:userId` - Get by user ID

### Forum
- `GET /api/forum` - Get posts
- `POST /api/forum` - Create post (authenticated)
- `POST /api/forum/:id/comments` - Add comment (authenticated)

### Notifications
- `GET /api/notifications` - Get notifications (authenticated)
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats
- `GET /api/dashboard/activity` - Get activity feed
- `GET /api/dashboard/charts/reports` - Get report charts

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend-node
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend-node` directory:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/straydog

JWT_SECRET_KEY=your_secret_key_here
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
```

## Deployment

### Railway Deployment

1. Create `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
```

2. Set environment variables in Railway dashboard

3. Deploy!

### Environment Variables for Production

Required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT
- `CORS_ALLOWED_ORIGINS` - Allowed origins (comma-separated)

Optional:
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `MAX_FILE_SIZE` (default: 10MB)
- `UPLOAD_DIR` (default: ./uploads)

## Migration from Java

This backend maintains API compatibility with the original Spring Boot backend:
- Same endpoint paths
- Same request/response formats
- Same authentication mechanism (JWT)
- Same database schema (MongoDB)

**No frontend changes required!**

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start
```

## Health Check

- `GET /health` - Simple health check
- `GET /actuator/health` - Spring Boot compatible health check

## License

MIT

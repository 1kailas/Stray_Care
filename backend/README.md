# Stray DogCare Backend

# Stray DogCare Backend API

Java 21 + Spring Boot 3.2.0 + MongoDB Atlas

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Dog Reports Management**: Create, update, and track stray dog reports
- **Volunteer Management**: Register and manage volunteers
- **Adoption System**: Handle dog adoption applications
- **Donation Portal**: Process and track donations
- **Community Forum**: Discussion board with posts and comments
- **Notifications**: Real-time notifications for users
- **Vaccination Tracking**: Track vaccination records for rescued dogs
- **Geolocation Support**: Find nearby dog reports

## Tech Stack

- Java 21
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data MongoDB
- MongoDB
- Lombok
- ModelMapper
- Maven

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- MongoDB 6.0+ (running locally or MongoDB Atlas)

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # MongoDB Connection (local or Atlas)
   MONGODB_URI=mongodb://localhost:27017/straydog
   # OR MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/straydog
   
   # JWT Secret (generate with: openssl rand -base64 64)
   JWT_SECRET_KEY=your-secure-secret-key-here
   
   # Server Configuration
   SERVER_PORT=5000
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
   
   📖 **See detailed guides:**
   - `MONGODB_ATLAS_SETUP.md` - Set up free cloud MongoDB
   - `ENV_VARIABLES_GUIDE.md` - Complete environment variables reference

3. **Set up MongoDB**
   
   **Option A: Local MongoDB (Docker)**
   ```bash
   docker-compose up -d mongodb
   ```
   
   **Option B: MongoDB Atlas (Cloud - FREE)**
   Follow the guide in `MONGODB_ATLAS_SETUP.md`

4. **Build the project**
   ```bash
   mvn clean install
   ```

5. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the JAR file:
   ```bash
   java -jar target/stray-dogcare-backend-1.0.0.jar
   ```

The application will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Dog Reports
- `GET /api/dog-reports` - Get all reports (with optional filters)
- `GET /api/dog-reports/{id}` - Get report by ID
- `POST /api/dog-reports` - Create new report
- `PUT /api/dog-reports/{id}` - Update report
- `PATCH /api/dog-reports/{id}/assign` - Assign to volunteer
- `POST /api/dog-reports/{id}/notes` - Add note
- `GET /api/dog-reports/nearby/{lat}/{lng}` - Get nearby reports
- `DELETE /api/dog-reports/{id}` - Delete report

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/{id}` - Get volunteer by ID
- `POST /api/volunteers` - Register volunteer
- `PUT /api/volunteers/{id}` - Update volunteer
- `PATCH /api/volunteers/{id}/status` - Update status
- `DELETE /api/volunteers/{id}` - Delete volunteer

### Adoptions
- `GET /api/adoptions` - Get all adoptions
- `GET /api/adoptions/{id}` - Get adoption by ID
- `POST /api/adoptions` - Create adoption application
- `PATCH /api/adoptions/{id}/status` - Update status
- `DELETE /api/adoptions/{id}` - Delete adoption

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/{id}` - Get donation by ID
- `POST /api/donations` - Create donation
- `PATCH /api/donations/{id}/complete` - Complete donation
- `GET /api/donations/total` - Get total donations

### Forum
- `GET /api/forum` - Get all posts
- `GET /api/forum/{id}` - Get post by ID
- `POST /api/forum` - Create post
- `PUT /api/forum/{id}` - Update post
- `POST /api/forum/{id}/comments` - Add comment
- `PATCH /api/forum/{id}/like` - Like post
- `PATCH /api/forum/{id}/pin` - Toggle pin (admin)
- `PATCH /api/forum/{id}/lock` - Toggle lock (admin)
- `DELETE /api/forum/{id}` - Delete post

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/{id}/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification

### Vaccinations
- `GET /api/vaccinations` - Get all vaccination records
- `GET /api/vaccinations/{id}` - Get vaccination by ID
- `GET /api/vaccinations/dog/{dogReportId}` - Get by dog report
- `POST /api/vaccinations` - Create vaccination record
- `POST /api/vaccinations/{id}/records` - Add vaccination record
- `PUT /api/vaccinations/{id}` - Update vaccination
- `DELETE /api/vaccinations/{id}` - Delete vaccination

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/straydogcare` |
| `JWT_SECRET` | Secret key for JWT tokens | (default key provided) |
| `PORT` | Server port | `5000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173,http://localhost:3000` |
| `MAIL_HOST` | SMTP host for emails | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP username | - |
| `MAIL_PASSWORD` | SMTP password | - |

## Security

- All endpoints except `/api/auth/**` require JWT authentication
- Admin endpoints require ADMIN role
- JWT tokens expire after 24 hours
- Refresh tokens expire after 7 days
- Passwords are encrypted using BCrypt

## Database Schema

### Collections
- `users` - User accounts
- `dog_reports` - Stray dog reports
- `volunteers` - Volunteer registrations
- `adoptions` - Adoption applications
- `donations` - Donation records
- `forum_posts` - Forum posts and comments
- `notifications` - User notifications
- `vaccinations` - Vaccination records

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -DskipTests
```

### Code Style
The project uses Lombok to reduce boilerplate code. Make sure your IDE has Lombok plugin installed.

## MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` environment variable

## CORS Configuration

By default, the API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Update `CORS_ORIGINS` environment variable to add more origins.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

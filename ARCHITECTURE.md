# 🏗️ Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           STRAY DOGCARE APP                             │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                      React + TypeScript + Vite                           │
│                       http://localhost:5173                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Login    │  │  Register  │  │  Dashboard │  │ Report Dog │       │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ View Cases │  │  Adoptions │  │ Volunteers │  │  Donations │       │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │              AuthContext (Global State)                   │          │
│  │  • User info  • JWT token  • Login/Logout methods         │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │              API Utilities (utils/api.js)                 │          │
│  │  • API calls  • Token injection  • Error handling         │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    │ REST API
                                    │ JSON
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
│                          Spring Boot 3.x                                 │
│                       http://localhost:5000                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                    Security Layer                            │       │
│  │  • JWT Authentication Filter                                 │       │
│  │  • CORS Configuration                                        │       │
│  │  • Role-Based Access Control                                 │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Auth     │  │  DogReport │  │  Volunteer │  │  Adoption  │       │
│  │ Controller │  │ Controller │  │ Controller │  │ Controller │       │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Donation  │  │   Forum    │  │Notification│  │Vaccination │       │
│  │ Controller │  │ Controller │  │ Controller │  │ Controller │       │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                     Service Layer                            │       │
│  │  • Business Logic  • Data Validation  • Processing          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                  Repository Layer                            │       │
│  │  • Spring Data MongoDB  • CRUD Operations                    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MongoDB Driver
                                    │ Protocol
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                             DATABASE                                     │
│                          MongoDB 4.4+                                    │
│                      localhost:27017/straydog                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │    users     │  │  dogReports  │  │  volunteers  │                 │
│  │ Collection   │  │  Collection  │  │  Collection  │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │  adoptions   │  │  donations   │  │ vaccinations │                 │
│  │  Collection  │  │  Collection  │  │  Collection  │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐                                    │
│  │forumPosts    │  │notifications │                                    │
│  │ Collection   │  │  Collection  │                                    │
│  └──────────────┘  └──────────────┘                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────┐                                                    ┌─────────┐
│ Browser │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │  1. POST /api/auth/register                                 │
     │  { name, email, password, role }                            │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                    2. Hash password (bcrypt)                │
     │                    3. Save to MongoDB                       │
     │                    4. Generate JWT token                    │
     │                                                              │
     │  5. { user, token }                                         │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │  6. Store token in localStorage                             │
     │  7. Set in AuthContext                                      │
     │                                                              │
     │  8. GET /api/dog-reports                                    │
     │  Authorization: Bearer <token>                              │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                    9. Validate JWT token                    │
     │                    10. Extract user from token              │
     │                    11. Fetch data from MongoDB              │
     │                                                              │
     │  12. { data: [...] }                                        │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

## Data Flow: Report Submission

```
┌─────────┐                                                    ┌─────────┐
│  User   │                                                    │ MongoDB │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │  1. Fill "Report Dog" form                                  │
     │  2. Click "Submit"                                          │
     │                                                              │
     │  ┌────────────────────────────────────┐                    │
     │  │  ReportStrayDog Component          │                    │
     │  │  • Validate form                   │                    │
     │  │  • Call dogReportsAPI.create()     │                    │
     │  └──────────────┬─────────────────────┘                    │
     │                 │                                            │
     │                 │  3. POST /api/dog-reports                 │
     │                 │  { description, condition, location, ... }│
     │                 ├───────────────────────────────────────────>
     │                 │                                            │
     │                 │  ┌────────────────────────────┐           │
     │                 │  │  Spring Boot Backend       │           │
     │                 │  │  • Validate JWT token      │           │
     │                 │  │  • Validate data           │           │
     │                 │  │  • Add reporter info       │           │
     │                 │  │  • Add timestamps          │           │
     │                 │  └──────────┬─────────────────┘           │
     │                 │             │                              │
     │                 │             │  4. Insert document          │
     │                 │             ├─────────────────────────────>│
     │                 │             │                              │
     │                 │             │  5. Document created         │
     │                 │             │<─────────────────────────────┤
     │                 │             │                              │
     │                 │  6. { success: true, data: {...} }        │
     │                 │<────────────┴──────────────────────────────
     │                 │                                            │
     │  7. Show success toast                                      │
     │  8. Reset form                                              │
     │                                                              │
```

## Component Hierarchy

```
App.tsx (Root)
├── AuthProvider (Context)
│   └── AuthContext provides: user, login, register, logout
│
├── Login Component (if not authenticated)
│   └── Form → authAPI.login() → Set user & token
│
├── Register Component (if not authenticated)
│   └── Form → authAPI.register() → Set user & token
│
└── Main App (if authenticated)
    ├── Header
    │   ├── Logo
    │   ├── Navigation Menu
    │   ├── User Profile
    │   └── Logout Button
    │
    └── Content (based on activeTab)
        ├── Dashboard
        │   ├── Statistics Cards (from API)
        │   ├── Charts (from API)
        │   └── Activity Feed
        │
        ├── ReportStrayDog
        │   └── Form → dogReportsAPI.create()
        │
        ├── ViewCases
        │   ├── Filters
        │   ├── Search
        │   └── Table (from dogReportsAPI.getAll())
        │
        ├── AdoptionSection
        │   ├── Filters
        │   ├── Dog Cards (from API)
        │   └── Application Form → adoptionsAPI.create()
        │
        └── ... (other components)
```

## Security Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        Security Layers                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. FRONTEND SECURITY                                         │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  • Token Storage (localStorage)                     │  │
│     │  • Protected Routes (check authentication)          │  │
│     │  • Auto token injection in API calls               │  │
│     │  • Token validation on page load                    │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│  2. NETWORK SECURITY                                          │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  • HTTPS in production                              │  │
│     │  • CORS configured                                  │  │
│     │  • JWT tokens in Authorization header              │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│  3. BACKEND SECURITY                                          │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  • JWT Authentication Filter                        │  │
│     │  • Token signature verification                     │  │
│     │  • Token expiration check                           │  │
│     │  • Spring Security configuration                    │  │
│     │  • Role-based access control                        │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
│  4. DATABASE SECURITY                                         │
│     ┌─────────────────────────────────────────────────────┐  │
│     │  • Password hashing (bcrypt)                        │  │
│     │  • MongoDB authentication                           │  │
│     │  • Connection string in config (not in code)        │  │
│     │  • Data validation before storage                   │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                             │
├─────────────────────────────────────────────────────────────────┤
│  • React 18               - UI Library                          │
│  • TypeScript             - Type Safety                         │
│  • Vite                   - Build Tool                          │
│  • Tailwind CSS           - Styling                             │
│  • Radix UI               - Accessible Components               │
│  • Recharts               - Data Visualization                  │
│  • Lucide Icons           - Icon Library                        │
│  • Sonner                 - Toast Notifications                 │
│  • React Hook Form        - Form Management                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                              │
├─────────────────────────────────────────────────────────────────┤
│  • Spring Boot 3.x        - Application Framework               │
│  • Spring Security        - Authentication & Authorization      │
│  • Spring Data MongoDB    - Database Integration                │
│  • JWT                    - Token-based Auth                    │
│  • Lombok                 - Reduce Boilerplate                  │
│  • Maven                  - Build Tool                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                   │
├─────────────────────────────────────────────────────────────────┤
│  • MongoDB 4.4+           - NoSQL Database                      │
│  • Collections            - users, dogReports, volunteers, etc. │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
                          ┌─────────────────┐
                          │  Load Balancer  │
                          │   (Nginx/AWS)   │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
           ┌────────▼────────┐         ┌─────────▼────────┐
           │   Frontend      │         │    Backend       │
           │  (Vercel/       │         │  (Heroku/        │
           │   Netlify)      │         │   Railway)       │
           │                 │         │                  │
           │  Static Build   │         │  Spring Boot     │
           └─────────────────┘         │  Container       │
                                       └─────────┬────────┘
                                                 │
                                       ┌─────────▼────────┐
                                       │   MongoDB        │
                                       │   Atlas          │
                                       │   (Cloud)        │
                                       └──────────────────┘
```

## File Structure

```
stray-dogcare-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx                 ← Authentication
│   │   │   ├── Register.tsx              ← Registration
│   │   │   ├── Dashboard.tsx             ← Main dashboard
│   │   │   ├── ReportStrayDog.tsx        ← Dog reporting
│   │   │   ├── ViewCases.tsx             ← Case management
│   │   │   ├── AdoptionSection.tsx       ← Adoptions
│   │   │   └── ui/                       ← Reusable UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx           ← Auth state management
│   │   ├── utils/
│   │   │   └── api.js                    ← API utilities
│   │   ├── App.tsx                       ← Main app component
│   │   └── main.tsx                      ← Entry point
│   ├── .env                              ← Environment config
│   ├── package.json                      ← Dependencies
│   └── vite.config.ts                    ← Vite config
│
├── backend/
│   └── src/main/
│       ├── java/com/straydogcare/
│       │   ├── controller/               ← REST endpoints
│       │   │   ├── AuthController.java
│       │   │   ├── DogReportController.java
│       │   │   └── ...
│       │   ├── service/                  ← Business logic
│       │   ├── repository/               ← Data access
│       │   ├── model/                    ← Entity classes
│       │   ├── dto/                      ← Data transfer objects
│       │   └── config/                   ← Configuration
│       │       ├── SecurityConfiguration.java
│       │       └── ApplicationConfiguration.java
│       └── resources/
│           └── application.yml           ← Application config
│
└── documentation/
    ├── README.md                         ← Project overview
    ├── SETUP_GUIDE.md                    ← Setup instructions
    ├── INTEGRATION_SUMMARY.md            ← Changes made
    ├── TROUBLESHOOTING.md                ← Problem solving
    ├── COMMANDS.md                       ← Quick reference
    └── ARCHITECTURE.md                   ← This file
```

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable structure
- ✅ Security at multiple layers
- ✅ Easy to maintain and extend
- ✅ Production-ready design

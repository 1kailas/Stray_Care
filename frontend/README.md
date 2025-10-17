# 🐾 Stray DogCare - Modern Frontend

A completely redesigned, modern frontend for the Stray DogCare platform built with cutting-edge web technologies.

## ✨ Features

### Core Features
- 🔐 **Authentication System** - Secure JWT-based login and registration
- 📊 **Interactive Dashboard** - Real-time statistics and insights
- 🐕 **Dog Report System** - Report and track stray dogs with geolocation
- 📋 **Case Management** - View and manage all reported cases
- ❤️ **Adoption Portal** - Browse and apply for dog adoptions
- 👥 **Volunteer Management** - Register and manage volunteers
- 💰 **Donation System** - Support rescue operations
- 💬 **Community Forum** - Discussion board for community engagement
- 📚 **Education Center** - Resources and guides for dog welfare
- 🗺️ **Interactive Map** - View all reports on an interactive map
- 💉 **Vaccination Tracker** - Track vaccination schedules
- 🔔 **Notifications** - Real-time updates and alerts
- 📱 **Responsive Design** - Works perfectly on all devices

### Admin Features
- 👨‍💼 **Admin Dashboard** - Comprehensive system overview
- 👥 **User Management** - Manage all platform users
- 📊 **Report Management** - Oversee all dog reports
- ✅ **Volunteer Approval** - Review and approve volunteers

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool

### Routing & State
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon library

### Form & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### HTTP & API
- **Axios** - Promise-based HTTP client
- **TypeScript Interfaces** - Type-safe API contracts

### Utilities
- **date-fns** - Modern date utility library
- **clsx & tailwind-merge** - Conditional class names
- **Sonner** - Beautiful toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 5000

### Setup Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Stray DogCare
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🚀 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/       # Reusable components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   └── admin/       # Admin pages
│   ├── lib/             # Utilities and helpers
│   │   ├── api.ts       # API client and functions
│   │   └── utils.ts     # Utility functions
│   ├── store/           # State management (Zustand)
│   │   └── auth.ts      # Auth store
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Trust, reliability
- **Secondary**: Green (#10B981) - Growth, hope
- **Accent**: Orange (#F59E0B) - Warmth, energy

### Typography
- System font stack for optimal performance
- Responsive font sizes
- Clear hierarchy

### Spacing
- Consistent spacing scale (4px base)
- Responsive padding and margins

### Components
- Fully accessible (ARIA compliant)
- Keyboard navigation support
- Screen reader friendly

## 🔐 Authentication Flow

1. User lands on login page
2. Can register or login
3. JWT token stored in localStorage
4. Token sent with all API requests
5. Auto-redirect on auth failure
6. Persistent sessions

## 📡 API Integration

All API calls are centralized in `src/lib/api.ts`:

```typescript
// Example: Fetching dog reports
import { dogReportsApi } from '@/lib/api'

const reports = await dogReportsApi.getAll()
```

API functions handle:
- Authentication headers
- Error handling
- Type safety
- Request/response transformation

## 🎯 Key Features Breakdown

### Dashboard
- Real-time statistics cards
- Recent reports list
- Quick action buttons
- Role-based content

### Report Dog
- Location input with coordinates
- Image upload
- Urgency level selection
- Form validation

### View Cases
- Searchable report list
- Status filters
- Urgency indicators
- Detailed view modal

### Adoption
- Dog profiles
- Application system
- Status tracking

### Volunteer Portal
- Registration form
- Assignment management
- Activity tracking

## 🔧 Configuration

### Vite Config
- Path aliases (`@/` → `src/`)
- Proxy to backend API
- Optimized build settings

### Tailwind Config
- Custom color scheme
- Dark mode support
- Custom animations
- Plugin integrations

### TypeScript Config
- Strict mode enabled
- Path mapping
- ES2020 target

## 🌐 Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Stray DogCare

# Map Integration (Optional)
VITE_MAPBOX_TOKEN=your_token_here
```

## 📱 Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and touch-friendly.

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus indicators
- Color contrast ratios

## 🚀 Performance

- Code splitting by route
- Lazy loading images
- Optimized bundle size
- Tree shaking
- Minification
- Gzip compression

## 🔒 Security

- XSS protection
- CSRF token support
- Secure HTTP headers
- Input sanitization
- JWT token management
- Auto logout on token expiry

## 🐛 Debugging

Development tools:
- React DevTools
- Redux DevTools (Zustand)
- Network inspector
- Console logging
- Source maps

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🆘 Support

For issues or questions:
- Check the troubleshooting guide
- Review the documentation
- Contact the development team

---

**Built with ❤️ for stray dog welfare**

### Recent Updates

- ✅ Complete redesign with modern UI/UX
- ✅ TypeScript for type safety
- ✅ Improved performance and optimization
- ✅ Better accessibility
- ✅ Enhanced mobile experience
- ✅ More intuitive navigation
- ✅ Real-time updates
- ✅ Better error handling

### Coming Soon

- 🔜 Push notifications
- 🔜 Progressive Web App (PWA)
- 🔜 Dark mode toggle
- 🔜 Multi-language support
- 🔜 Advanced search and filters
- 🔜 Real-time chat
- 🔜 Social sharing
- 🔜 Analytics dashboard

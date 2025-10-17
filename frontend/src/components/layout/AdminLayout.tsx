import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Heart, Users, DollarSign, 
  Settings, LogOut, Menu, X, Bell, Search,
  ChevronDown, Shield, Dog, BarChart3, AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

const adminNavigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    name: 'Dog Reports', 
    href: '/admin/dog-reports', 
    icon: AlertCircle,
    description: 'Manage stray dog reports',
    badge: 'pending'
  },
  { 
    name: 'Adoptions', 
    href: '/admin/adoptions', 
    icon: Heart,
    description: 'Review adoption requests',
    badge: 'pending'
  },
  { 
    name: 'Volunteers', 
    href: '/admin/volunteers', 
    icon: Users,
    description: 'Manage volunteer applications',
    badge: 'pending'
  },
  { 
    name: 'Dogs Database', 
    href: '/admin/dogs', 
    icon: Dog,
    description: 'All dogs in system'
  },
  // Commented out until backend support is added
  // { 
  //   name: 'Users', 
  //   href: '/admin/users', 
  //   icon: UserCircle,
  //   description: 'User management'
  // },
  { 
    name: 'Donations', 
    href: '/admin/donations', 
    icon: DollarSign,
    description: 'Financial tracking'
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3,
    description: 'Reports & insights'
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'System configuration'
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-900">Admin Portal</h1>
                <p className="text-xs text-slate-500">Stray DogCare Management</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search reports, adoptions, users..."
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Admin Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-slate-500">{user?.email}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-600">
                      Admin
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white p-4">
            <nav className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        New
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={cn(
            "hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-white transition-all duration-300 overflow-y-auto",
            sidebarOpen ? "w-64" : "w-20"
          )}
        >
          <nav className="p-4 space-y-2">
            {adminNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-700 hover:bg-slate-100",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <div className="flex-1">
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500 font-normal">
                          {item.description}
                        </div>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                          !
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

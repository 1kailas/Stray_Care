import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, AlertCircle, FileText, Heart, Users, DollarSign, 
  MessageSquare, BookOpen, Bell, User, Map, Syringe, 
  Phone, LogOut, Menu
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { AIChatbot } from '@/components/AIChatbot'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Report Dog', href: '/report', icon: AlertCircle },
  { name: 'View Cases', href: '/cases', icon: FileText },
  { name: 'Adoption', href: '/adoption', icon: Heart },
  { name: 'Volunteer', href: '/volunteer', icon: Users },
  { name: 'My Tasks', href: '/volunteer-tasks', icon: FileText },
  { name: 'Donations', href: '/donations', icon: DollarSign },
  { name: 'Forum', href: '/forum', icon: MessageSquare },
  { name: 'Education', href: '/education', icon: BookOpen },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Vaccination', href: '/vaccination', icon: Syringe },
  { name: 'Contact', href: '/contact', icon: Phone },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-2xl">🐾</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Stray DogCare
              </h1>
              <p className="text-xs text-muted-foreground">Rescue & Adoption</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.slice(0, 7).map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
            </Link>

            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background p-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>


      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer with creator name */}
      <footer className="w-full text-center py-4 text-xs text-muted-foreground bg-white/80 border-t">
        Created by <span className="font-semibold text-primary">kailasnath T</span>
      </footer>

      {/* AI Chatbot - Always visible on all pages */}
      <AIChatbot />
    </div>
  )
}

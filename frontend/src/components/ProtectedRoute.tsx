import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'ADMIN' | 'USER'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription className="mt-2">
                You don't have permission to access this page.
                {requiredRole === 'ADMIN' && ' This area is restricted to administrators only.'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Your Role:</strong> {user.role}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Required Role:</strong> {requiredRole}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/">
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

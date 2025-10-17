import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import { Layout } from './components/layout/Layout'
import { AuthLayout } from './components/layout/AuthLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Dashboard } from './pages/Dashboard'
import { ReportDog } from './pages/ReportDog'
import { ViewCases } from './pages/ViewCases'
import { Adoption } from './pages/Adoption'
import { Volunteer } from './pages/Volunteer'
import { VolunteerTasks } from './pages/VolunteerTasks'
import { Donations } from './pages/Donations'
import { Forum } from './pages/Forum'
import { Education } from './pages/Education'
import { Notifications } from './pages/Notifications'
import { Profile } from './pages/Profile'
import { MapView } from './pages/MapView'
import { Vaccination } from './pages/Vaccination'
import { Contact } from './pages/Contact'
import { LoadingScreen } from './components/ui/LoadingScreen'

// Import new admin pages
import {
  AdminOverview,
  AdminDogReports,
  AdminAdoptions,
  AdminVolunteers,
  AdminDogs,
  AdminUsers,
  AdminDonations,
  AdminAnalytics,
  AdminSettings
} from './pages/admin'

function App() {
  const { user, isLoading, checkAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !user) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    )
  }

  // ADMIN USERS - Only show admin dashboard
  if (user.role === 'ADMIN') {
    return (
      <Routes>
        {/* Admin Routes - Full Admin Portal */}
        <Route 
          path="/admin" 
          element={
            <AdminLayout>
              <AdminOverview />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dog-reports" 
          element={
            <AdminLayout>
              <AdminDogReports />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/adoptions" 
          element={
            <AdminLayout>
              <AdminAdoptions />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/volunteers" 
          element={
            <AdminLayout>
              <AdminVolunteers />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/dogs" 
          element={
            <AdminLayout>
              <AdminDogs />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/donations" 
          element={
            <AdminLayout>
              <AdminDonations />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminLayout>
              <AdminAnalytics />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          } 
        />
        
        {/* Redirect admin to admin dashboard for any other routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  // REGULAR USERS - Show user features only (no admin access)
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<ReportDog />} />
        <Route path="/cases" element={<ViewCases />} />
        <Route path="/adoption" element={<Adoption />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/volunteer-tasks" element={<VolunteerTasks />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/education" element={<Education />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/vaccination" element={<Vaccination />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Block access to admin routes for regular users */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App

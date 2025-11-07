import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { Layout } from "./components/layout/Layout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoadingScreen } from "./components/ui/LoadingScreen";

// Eagerly load auth pages for faster initial login
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

// Lazy load user pages
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const ReportDog = lazy(() =>
  import("./pages/ReportDog").then((m) => ({ default: m.ReportDog })),
);
const ViewCases = lazy(() =>
  import("./pages/ViewCases").then((m) => ({ default: m.ViewCases })),
);
const Adoption = lazy(() =>
  import("./pages/Adoption").then((m) => ({ default: m.Adoption })),
);
const Volunteer = lazy(() =>
  import("./pages/Volunteer").then((m) => ({ default: m.Volunteer })),
);
const VolunteerTasks = lazy(() =>
  import("./pages/VolunteerTasks").then((m) => ({ default: m.VolunteerTasks })),
);
const Donations = lazy(() =>
  import("./pages/Donations").then((m) => ({ default: m.Donations })),
);
const Forum = lazy(() =>
  import("./pages/Forum").then((m) => ({ default: m.Forum })),
);
const Education = lazy(() =>
  import("./pages/Education").then((m) => ({ default: m.Education })),
);
const Notifications = lazy(() =>
  import("./pages/Notifications").then((m) => ({ default: m.Notifications })),
);
const Profile = lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.Profile })),
);
const MapView = lazy(() =>
  import("./pages/MapView").then((m) => ({ default: m.MapView })),
);
const Vaccination = lazy(() =>
  import("./pages/Vaccination").then((m) => ({ default: m.Vaccination })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);

// Lazy load admin pages
const AdminOverview = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminOverview })),
);
const AdminDogReports = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminDogReports })),
);
const AdminAdoptions = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminAdoptions })),
);
const AdminVolunteers = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminVolunteers })),
);
const AdminDogs = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminDogs })),
);
const AdminUsers = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminUsers })),
);
const AdminDonations = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminDonations })),
);
const AdminAnalytics = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminAnalytics })),
);
const AdminSettings = lazy(() =>
  import("./pages/admin").then((m) => ({ default: m.AdminSettings })),
);

function App() {
  const { user, isLoading, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen />;
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
    );
  }

  // ADMIN USERS - Only show admin dashboard
  if (user.role === "ADMIN") {
    return (
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    );
  }

  // REGULAR USERS - Show user features only (no admin access)
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </Layout>
  );
}

export default App;

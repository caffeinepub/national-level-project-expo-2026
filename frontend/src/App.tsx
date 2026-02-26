import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { AdminAuthProvider } from './context/AdminAuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationLookupPage from './pages/RegistrationLookupPage';
import ProtectedRoute from './components/ProtectedRoute';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const eventDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/event-details',
  component: EventDetailsPage,
});

const checkRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-registration',
  component: RegistrationLookupPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  eventDetailsRoute,
  checkRegistrationRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}

import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  createHashHistory,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RegistrationPage from './pages/RegistrationPage';
import GalleryPage from './pages/GalleryPage';
import RegistrationLookupPage from './pages/RegistrationLookupPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const hashHistory = createHashHistory();

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <AdminAuthProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AdminAuthProvider>
  ),
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
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

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration',
  component: RegistrationPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const checkRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-registration',
  component: RegistrationLookupPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
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
  homeRoute,
  aboutRoute,
  eventDetailsRoute,
  registrationRoute,
  galleryRoute,
  checkRegistrationRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree, history: hashHistory });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

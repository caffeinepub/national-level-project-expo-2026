import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}

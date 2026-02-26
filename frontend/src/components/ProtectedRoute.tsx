import { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAdminAuth } from '../context/AdminAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}

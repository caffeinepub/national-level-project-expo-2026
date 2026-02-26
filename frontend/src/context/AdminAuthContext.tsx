import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdminAuthenticated: false,
  adminLogin: () => {},
  adminLogout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('adminAuthenticated') === 'true';
    } catch {
      return false;
    }
  });

  const adminLogin = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('adminAuthenticated', 'true');
    } catch {
      // ignore
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('adminAuthenticated');
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

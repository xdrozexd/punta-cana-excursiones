import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/admin/login'
}) => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    // Muestra un spinner mientras se verifica la autenticación
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!auth.isLoggedIn) {
    // Redirige al login si no está autenticado
    return <Navigate to={redirectPath} replace />;
  }

  // Si está autenticado, muestra el contenido protegido
  return <Outlet />;
};

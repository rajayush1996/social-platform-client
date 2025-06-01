import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/videos', '/reels', '/blog'];
  
  // If user is authenticated and tries to access login page, redirect to home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Allow access to public routes without authentication
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // For all other routes, require authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
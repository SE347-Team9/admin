import { Navigate } from 'react-router-dom';
import { authService } from '../api/endpoints/authService';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate home based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/home" replace />;
      case 'staff':
        return <Navigate to="/staff/home" replace />;
      case 'agency':
        return <Navigate to="/agency/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return <>{children}</>;
};

export default RoleBasedRoute;

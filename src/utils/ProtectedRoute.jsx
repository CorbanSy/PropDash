// src/utils/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, requiredUserType }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to home
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Get user type from metadata
  const userType = user.user_metadata?.user_type;

  // Check if user type matches required type
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to correct dashboard
    const correctPath = userType === 'provider' ? '/provider' : '/customer/dashboard';
    
    console.warn(
      `🚫 Access denied: ${userType} tried to access ${requiredUserType} route. Redirecting to ${correctPath}`
    );
    
    return <Navigate to={correctPath} replace />;
  }

  return children;
}
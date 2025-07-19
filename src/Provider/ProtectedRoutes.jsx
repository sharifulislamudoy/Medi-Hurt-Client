import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import RouteChangeSpinner from '../Components/Loading/RouteChangeSpinner';
import { AuthContext } from './AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext)
    const location = useLocation();

    if (loading) {
        return <RouteChangeSpinner />;
    };

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }


    const userRole = user?.role || 'user'; 
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page or home if role doesn't match
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
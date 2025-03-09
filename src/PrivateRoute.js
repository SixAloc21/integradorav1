import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Decodifica el token

    if (!token || !user || !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" />; // Si no tiene permisos, redirige al login
    }

    return children;
};

export default PrivateRoute;

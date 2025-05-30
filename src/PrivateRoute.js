import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('usuario'));

  if (!token || !user || !allowedRoles.includes(user.nombre_rol)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

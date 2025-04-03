import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout'; // 💡 Agregado

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Decodifica el token

  if (!user) {
    return <p>No tienes permisos para ver esta página</p>;
  }

  return (
    <DashboardLayout>
      <h1>Bienvenido, {user.nombre}</h1>
      {user.rol === "Administrador" ? (
        <p>Acceso al Panel de Administración</p>
      ) : (
        <p>Accede a tus productos y servicios.</p>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

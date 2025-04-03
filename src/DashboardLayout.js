// src/DashboardLayout.js
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  if (!user) return <p>No tienes permisos para ver esta página</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Rollase</div>
        <ul style={styles.navList}>
          <li><button onClick={() => navigate('/dashboard')} style={styles.navButton}>Inicio</button></li>
          {user.rol === "Administrador" && (
            <>
              <li><button onClick={() => navigate('/usuarios')} style={styles.navButton}>Gestionar Usuarios</button></li>
              <li><button onClick={() => navigate('/productos')} style={styles.navButton}>Gestionar Productos</button></li>
              <li><button onClick={() => navigate('/ventas')} style={styles.navButton}>Gestionar Ventas</button></li>
              <li><button onClick={() => navigate('/graficas')} style={styles.navButton}>Gestionar Gráficas</button></li>
            </>
          )}
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>Cerrar Sesión</button>
      </aside>

      {/* Contenido dinámico */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '250px',
    background: '#333',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
  },
  navButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '5px 0',
  },
  logoutButton: {
    marginTop: 'auto',
    width: '100%',
    padding: '10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  main: {
    flexGrow: 1,
    padding: '20px',
    backgroundColor: '#f0f0f0',
    overflowY: 'auto',
  },
};

export default DashboardLayout;

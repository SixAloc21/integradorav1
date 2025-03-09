import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Decodifica el token

    if (!user) {
        return <p>No tienes permisos para ver esta página</p>;
    }

    // 🔹 Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token"); // Eliminar token
        navigate('/'); // Redirigir al login
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
                            <li><button onClick={() => navigate('/graficas')} style={styles.navButton}>Gestionar Graficas</button></li>
                            <li><button onClick={() => navigate('/...')} style={styles.navButton}></button></li>
                        </>
                    )}
                </ul>
                <button onClick={handleLogout} style={styles.logoutButton}>Cerrar Sesión</button>
            </aside>

            {/* Contenido Principal */}
            <main style={styles.main}>
                <h1>Bienvenido, {user.nombre}</h1>
                {user.rol === "Administrador" ? (
                    <p>Acceso al Panel de Administración</p>
                ) : (
                    <p>Accede a tus productos y servicios.</p>
                )}
            </main>
        </div>
    );
};

// 🎨 Estilos del Dashboard con Sidebar
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
        transition: 'background-color 0.3s ease',
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
        transition: 'background-color 0.3s ease',
    },
    main: {
        flexGrow: 1,
        padding: '20px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Dashboard;

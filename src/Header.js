import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";

const API_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [saldo, setSaldo] = useState(null);

  // 🔄 Obtener saldo
  useEffect(() => {
    const fetchSaldo = async () => {
      if (!usuario) return;
      try {
        const res = await fetch(`${API_URL}/saldo/${usuario.id_usuario}`);
        const data = await res.json();
        if (res.ok) {
          setSaldo(data.saldo);
        }
      } catch (err) {
        console.error("❌ Error al obtener saldo:", err);
      }
    };

    fetchSaldo();
  }, [usuario]);

  // 🔐 Logout completo (actualiza is_logged_in + limpia storage)
  const handleLogout = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
  
    if (usuario) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: usuario.id_usuario }),
        });
      } catch (err) {
        console.error("❌ Error al cerrar sesión:", err);
      }
    }
  
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    alert("Cerrando sesión...");
    navigate("/");
  };
   
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <Link to="/home" style={styles.logoText}>Rollase</Link>
        </div>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/nuestro-producto" style={styles.navLink}>Nuestro Producto</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/subscriptions" style={styles.navLink}>Suscripciones</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/mis-suscripciones" style={styles.navLink}>Mi Suscripción</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/mis-facturas" style={styles.navLink}>Mis Facturas</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/cart" style={styles.navLink}>🛒 Carrito ({cart.length})</Link>
          </li>
          <li style={{ marginRight: "20px", color: "#fff", fontWeight: "bold" }}>
            🧾 Saldo: ${saldo !== null ? saldo.toFixed(2) : "Cargando..."}
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#00BDD4",
    padding: "15px 20px",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  logo: {
    flexGrow: 1,
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
    textDecoration: "none",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginRight: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
};

export default Header;

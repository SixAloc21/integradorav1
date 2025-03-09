import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import Header from "./Header"; // Se mantiene la navegación

const NuestroProducto = () => {
  const { addToCart } = useContext(CartContext);

  const product = {
    name: "Silla de Ruedas Inteligente",
    price: 599.99,
    image: "/imagenes/silladeruedas.png",
  };

  return (
    <div>
      <Header /> {/* Se mantiene la navegación */}

      <div style={styles.container}>
        <h2 style={styles.title}>Nuestro Producto</h2>
        <p style={styles.description}>
          La <strong>Silla de Ruedas Inteligente Rollase</strong> es un avance revolucionario en movilidad.  
          Equipada con **sensores de proximidad, detección de obstáculos y frenos automáticos**, esta silla  
          permite a los usuarios desplazarse con mayor seguridad y autonomía.  
          Además, incluye un **sistema de navegación inteligente**, control remoto y modos personalizados  
          para distintas necesidades.
        </p>

        {/* Imagen del producto */}
        <img 
          src={product.image} 
          alt="Silla de Ruedas Inteligente"
          style={styles.image} 
        />

        {/* Información de Suscripciones */}
        <div style={styles.subscriptions}>
          <h3 style={styles.subTitle}>📜 Nuestras Suscripciones</h3>
          <p>Elige un plan para acceder a nuestros servicios exclusivos.</p>

          {/* Plan Básico */}
          <div style={styles.card}>
            <h4>🎟️ Plan Básico</h4>
            <p>Funciones esenciales y soporte técnico básico.</p>
            <p><strong>Precio: $9.99/mes</strong></p>
            <button style={styles.button}>Más Información</button>
            <button style={styles.payButton}>Pagar</button>
          </div>

          {/* Plan Premium */}
          <div style={styles.card}>
            <h4>💎 Plan Premium</h4>
            <p>Funciones avanzadas, soporte técnico prioritario y actualizaciones exclusivas.</p>
            <p><strong>Precio: $19.99/mes</strong></p>
            <button style={styles.button}>Más Información</button>
            <button style={styles.payButton}>Pagar</button>
          </div>
        </div>

        {/* Opción de Compra */}
        <div style={styles.purchaseContainer}>
          <h3 style={styles.subTitle}>🛒 Comprar la Silla</h3>
          <p>Adquiere la silla de ruedas inteligente con todas sus características avanzadas.</p>
          <button 
            onClick={() => addToCart(product)}
            style={styles.cartButton}
          >
            🛒 Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 **Estilos Restaurados + Ajustes del Carrito**
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#E3F2FD", 
    color: "#333",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#007bff",
  },
  description: {
    fontSize: "18px",
    maxWidth: "800px",
    margin: "auto",
    lineHeight: "1.6",
  },
  image: {
    width: "80%",
    maxWidth: "400px",
    margin: "20px 0",
    borderRadius: "10px",
  },
  subscriptions: {
    marginTop: "30px",
  },
  subTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#007bff",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    margin: "10px auto",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    width: "300px",
    display: "inline-block",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  payButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  purchaseContainer: {
    marginTop: "30px",
  },
  cartButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default NuestroProducto;

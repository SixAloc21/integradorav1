import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import Header from "./Header";
import axios from "axios";

const NuestroProducto = () => {
  const { addToCart } = useContext(CartContext);
  const [producto, setProducto] = useState(null);
  const [monto, setMonto] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get("http://localhost:5000/productos");
        setProducto(response.data[0]);
      } catch (error) {
        console.error("Error al obtener producto:", error);
      }
    };

    fetchProducto();
  }, []);

  const handleRecarga = async () => {
    if (!monto || parseFloat(monto) <= 0) {
      alert("⚠️ Ingresa un monto válido");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/recargar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: usuario.id_usuario, monto: parseFloat(monto) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setMonto("");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error al recargar:", error);
      alert("Error al procesar recarga");
    }
  };

  return (
    <div>
      <Header />

      <div style={styles.container}>
        {/* 💳 Recarga de Saldo Flotante */}
        <div style={styles.recargaBox}>
          <h4>💰 Recargar Saldo</h4>
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleRecarga} style={styles.recargarBtn}>Recargar</button>
        </div>

        <h2 style={styles.title}>Nuestro Producto</h2>
        <p style={styles.description}>
          La <strong>Silla de Ruedas Inteligente Rollase</strong> es un avance revolucionario en movilidad.  
          Equipada con <strong>sensores de proximidad, detección de obstáculos y frenos automáticos</strong>, esta silla  
          permite a los usuarios desplazarse con mayor seguridad y autonomía.  
          Además, incluye un <strong>sistema de navegación inteligente</strong>, control remoto y modos personalizados  
          para distintas necesidades.
        </p>

        {producto && (
          <>
            <img src={producto.imagen} alt={producto.nombre_producto} style={styles.image} />

            <div style={styles.purchaseContainer}>
              <h3 style={styles.subTitle}>🛒 Comprar la Silla</h3>
              <p>Adquiere la silla de ruedas inteligente con todas sus características avanzadas.</p>
              <button 
                onClick={() => addToCart({
                  id: producto.id_producto,
                  name: producto.nombre_producto,
                  price: parseFloat(producto.precio),
                  image: producto.imagen,
                  quantity: 1
                })}
                style={styles.cartButton}
              >
                🛒 Agregar al Carrito
              </button>
            </div>
          </>
        )}

        {/* 📦 Suscripciones */}
        <div style={styles.subscriptions}>
          <h3 style={styles.subTitle}>📜 Nuestras Suscripciones</h3>
          <p>Elige un plan para acceder a nuestros servicios exclusivos.</p>

          <div style={styles.card}>
            <h4>🎟️ Plan Básico</h4>
            <p>Funciones esenciales y soporte técnico básico.</p>
            <p><strong>Precio: $9.99/mes</strong></p>
            <button style={styles.button}>Más Información</button>
            <button style={styles.payButton}>Pagar</button>
          </div>

          <div style={styles.card}>
            <h4>💎 Plan Premium</h4>
            <p>Funciones avanzadas, soporte técnico prioritario y actualizaciones exclusivas.</p>
            <p><strong>Precio: $19.99/mes</strong></p>
            <button style={styles.button}>Más Información</button>
            <button style={styles.payButton}>Pagar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#E3F2FD",
    color: "#333",
    position: "relative"
  },
  recargaBox: {
    position: "absolute",
    top: "20px",
    right: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    width: "220px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "8px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  recargarBtn: {
    backgroundColor: "#00BDD4",
    color: "#fff",
    border: "none",
    padding: "8px",
    width: "100%",
    borderRadius: "5px",
    cursor: "pointer"
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

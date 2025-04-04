import React from "react";
import Header from "./Header";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const API_URL = process.env.REACT_APP_API_URL;

const Suscription = () => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleSuscripcion = async (nombre_plan, precio) => {
    if (!usuario || !usuario.id_usuario) {
      alert("⚠️ Debes iniciar sesión para suscribirte.");
      return;
    }

    const fecha_inicio = new Date();
    const fecha_vencimiento = new Date();
    fecha_vencimiento.setMonth(fecha_vencimiento.getMonth() + 1);

    try {
      const response = await fetch(`${API_URL}/suscribirse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          nombre_plan,
          precio,
          fecha_inicio,
          fecha_vencimiento,
          renovacion_automatica: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Suscripción realizada con éxito");
        await setDoc(doc(db, "suscripciones", usuario.id_usuario.toString()), {
          id_usuario: usuario.id_usuario,
          nombre_plan,
          precio,
          fecha_inicio: new Date().toISOString(),
          fecha_vencimiento: fecha_vencimiento.toISOString(),
          estado: "Activa",
        });
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Falló la solicitud");
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>🧾 Elige tu Plan</h2>
        <p style={styles.subtitle}>Suscríbete a uno de nuestros planes y disfruta de todos los beneficios.</p>

        <div style={styles.cardWrapper}>
          {/* Plan Básico */}
          <div style={{ ...styles.card, borderTop: "5px solid #007bff" }}>
            <h3>🎟️ Plan Básico</h3>
            <p>Acceso limitado a funciones esenciales.</p>
            <p><strong>$9.99 / mes</strong></p>
            <button onClick={() => handleSuscripcion("Básico", 9.99)} style={styles.btn}>Suscribirme</button>
          </div>

          {/* Plan Premium */}
          <div style={{ ...styles.card, borderTop: "5px solid gold" }}>
            <h3>💎 Plan Premium</h3>
            <p>Acceso completo, soporte prioritario y contenido exclusivo.</p>
            <p><strong>$19.99 / mes</strong></p>
            <button onClick={() => handleSuscripcion("Premium", 19.99)} style={styles.btn}>Suscribirme</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "30px",
  },
  cardWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  card: {
    background: "#fff",
    padding: "20px",
    width: "280px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  btn: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "15px",
  },
};

export default Suscription;

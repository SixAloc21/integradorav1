import React, { useEffect, useState } from "react";
import Header from "./Header";
import { db } from "./firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const API_URL = process.env.REACT_APP_API_URL;

const MisSuscripciones = () => {
  const [suscripcion, setSuscripcion] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [facturasProducto, setFacturasProducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "suscripciones", usuario.id_usuario.toString()),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setSuscripcion(docSnapshot.data());
        } else {
          setSuscripcion(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error al escuchar suscripción en Firestore:", error);
        setLoading(false);
      }
    );

    const fetchFacturas = async () => {
      try {
        const res = await fetch(`${API_URL}/facturas/${usuario.id_usuario}`);
        const data = await res.json();
        if (res.ok) setFacturas(data);
      } catch (err) {
        console.error("❌ Error al obtener facturas:", err);
      }
    };

    const fetchFacturasProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/facturas-productos/${usuario.id_usuario}`);
        const data = await res.json();
        if (res.ok) setFacturasProducto(data);
      } catch (err) {
        console.error("❌ Error al obtener facturas de productos:", err);
      }
    };

    fetchFacturas();
    fetchFacturasProducto();

    return () => unsubscribe();
  }, [usuario.id_usuario]);

  const cancelarSuscripcion = async () => {
    const confirm = window.confirm("¿Estás seguro de que deseas cancelar tu suscripción?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/cancelar-suscripcion/${usuario.id_usuario}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert("❌ Suscripción cancelada.");
        setSuscripcion(null);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error al cancelar:", error);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>📄 Mi Suscripción</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : suscripcion ? (
          <div style={cardStyle}>
            <h3>{suscripcion.nombre_plan}</h3>
            <p>💲 Precio: ${suscripcion.precio}</p>
            <p>📅 Inicio: {new Date(suscripcion.fecha_inicio).toLocaleDateString()}</p>
            <p>📅 Vence: {new Date(suscripcion.fecha_vencimiento).toLocaleDateString()}</p>
            <p>🔁 Renovación automática: {suscripcion.renovacion_automatica ? "Sí" : "No"}</p>
            <p>📌 Estado: {suscripcion.estado}</p>

            <button onClick={cancelarSuscripcion} style={btnStyle}>Cancelar Suscripción</button>
          </div>
        ) : (
          <p>No tienes suscripción activa</p>
        )}

        {facturas.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>🧾 Historial de Facturas de Suscripción</h3>
            {facturas.map((factura, index) => (
              <div key={index} style={cardStyle}>
                <p><strong>Plan:</strong> {factura.nombre_plan}</p>
                <p><strong>Fecha:</strong> {new Date(factura.fecha_emision).toLocaleDateString()}</p>
                <p><strong>Monto:</strong> ${factura.monto}</p>
              </div>
            ))}
          </div>
        )}

        {facturasProducto.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>🛒 Facturas de Compras</h3>
            {facturasProducto.map((factura, index) => (
              <div key={index} style={cardStyle}>
                <p><strong>Producto:</strong> {factura.nombre_producto}</p>
                <p><strong>Fecha:</strong> {new Date(factura.fecha_emision).toLocaleDateString()}</p>
                <p><strong>Monto:</strong> ${factura.monto}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  margin: "10px auto",
  maxWidth: "350px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const btnStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default MisSuscripciones;

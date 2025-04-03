import React, { useEffect, useState } from 'react';
import Header from './Header';

const MisFacturas = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [facturasProductos, setFacturasProductos] = useState([]);
  const [facturasSuscripciones, setFacturasSuscripciones] = useState([]);

  useEffect(() => {
    if (!usuario) return;

    const fetchFacturas = async () => {
      try {
        const res1 = await fetch(`http://localhost:5000/facturas-productos/${usuario.id_usuario}`);
        const data1 = await res1.json();
        setFacturasProductos(data1);

        const res2 = await fetch(`http://localhost:5000/facturas/${usuario.id_usuario}`);
        const data2 = await res2.json();
        setFacturasSuscripciones(data2);
      } catch (error) {
        console.error("❌ Error al obtener facturas:", error);
      }
    };

    fetchFacturas();
  }, [usuario]);

  const generarPDF = async (id_factura, tipo) => {
    const endpoint = tipo === 'producto'
      ? `http://localhost:5000/factura-producto-pdf/${id_factura}`
      : `http://localhost:5000/factura-suscripcion-pdf/${id_factura}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Error al generar PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura_${id_factura}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error al descargar PDF:", error);
      alert("Hubo un error al descargar la factura");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2>🧾 Mis Facturas</h2>

        {/* 🔹 Facturas de Productos */}
        <h3>🛒 Productos</h3>
        {facturasProductos.length === 0 ? (
          <p>No hay facturas de productos registradas</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {facturasProductos.map((f) => (
                <tr key={`p-${f.id_factura}`}>
                  <td>{f.id_factura}</td>
                  <td>{f.nombre_producto}</td>
                  <td>${parseFloat(f.monto).toFixed(2)}</td>
                  <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
                  <td>
                    <button style={styles.btnDescargar} onClick={() => generarPDF(f.id_factura, 'producto')}>
                      📥 Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔹 Facturas de Suscripciones */}
        <h3>📅 Suscripciones</h3>
        {facturasSuscripciones.length === 0 ? (
          <p>No hay facturas de suscripciones registradas</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {facturasSuscripciones.map((f) => (
                <tr key={`s-${f.id_factura}`}>
                  <td>{f.id_factura}</td>
                  <td>{f.nombre_plan}</td>
                  <td>${parseFloat(f.monto).toFixed(2)}</td>
                  <td>{new Date(f.fecha_emision).toLocaleDateString()}</td>
                  <td>
                    <button style={styles.btnDescargar} onClick={() => generarPDF(f.id_factura, 'suscripcion')}>
                      📥 Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  btnDescargar: {
    backgroundColor: '#00BDD4',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default MisFacturas;

import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import moment from 'moment';

const GestionVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVentas = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/todas-las-transacciones');
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error("❌ Error cargando ventas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const verDetalle = (venta) => {
    alert(`Detalle de ${venta.tipo}:\nCliente: ${venta.cliente}\nFecha: ${moment(venta.fecha).format("LLL")}\nTotal: $${venta.total}`);
  };

  const exportarPDF = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/reporte-ventas");
      if (!res.ok) throw new Error("❌ Error al generar el PDF");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte_ventas.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
      alert("Error al generar el PDF");
    }
  };
  

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h2>🧾 Gestión de Ventas</h2>

        <button onClick={exportarPDF} style={styles.btnExportar}>📄 Exportar PDF</button>

        {loading ? (
          <p>Cargando ventas...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v, i) => (
                <tr key={i}>
                  <td>{v.cliente}</td>
                  <td>{moment(v.fecha).format("DD/MM/YYYY")}</td>
                  <td>{v.tipo}</td>
                  <td>${parseFloat(v.total).toFixed(2)}</td>
                  <td>
                    <button onClick={() => verDetalle(v)} style={styles.btnVer}>Ver Detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  btnExportar: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  btnVer: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default GestionVentas;

import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = process.env.REACT_APP_API_URL;

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verSuscriptores, setVerSuscriptores] = useState(false);
  const [verUltimasSuscripciones, setVerUltimasSuscripciones] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      const data = await response.json();
      if (response.ok) setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuariosActivos = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios-activos`);
      const data = await response.json();
      if (response.ok) setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al obtener suscriptores:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUltimasSuscripciones = async () => {
    try {
      const response = await fetch(`${API_URL}/ultima-suscripcion`);
      const data = await response.json();
      if (response.ok) setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al obtener últimas suscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstatus = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}/toggle`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Estatus actualizado");
        if (verUltimasSuscripciones) fetchUltimasSuscripciones();
        else if (verSuscriptores) fetchUsuariosActivos();
        else fetchUsuarios();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error al cambiar estatus:", error);
    }
  };

  useEffect(() => {
    if (verUltimasSuscripciones) fetchUltimasSuscripciones();
    else if (verSuscriptores) fetchUsuariosActivos();
    else fetchUsuarios();
  }, [verSuscriptores, verUltimasSuscripciones]);

  const exportarUsuariosPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Usuarios", 14, 20);

    const filas = usuarios.map((u) => [
      u.id_usuario,
      u.nombre,
      u.correo,
      u.nombre_plan || u.nombre_rol || "N/A",
      u.estatus === 1 ? "Activo" : "Inactivo"
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Nombre", "Correo", "Rol/Suscripción", "Estatus"]],
      body: filas,
    });

    doc.save("reporte_usuarios.pdf");
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h2>👥 Gestión de Usuarios</h2>

        <div style={styles.exportWrapper}>
          <button onClick={exportarUsuariosPDF} style={styles.btnExportar}>📄 Exportar PDF</button>
          <button
            onClick={() => {
              setVerSuscriptores(!verSuscriptores);
              setVerUltimasSuscripciones(false);
            }}
            style={{ ...styles.btnExportar, backgroundColor: "#6c63ff", marginLeft: "10px" }}
          >
            {verSuscriptores ? "👥 Ver Todos" : "🧾 Suscriptores Activos"}
          </button>
          <button
            onClick={() => {
              setVerUltimasSuscripciones(!verUltimasSuscripciones);
              setVerSuscriptores(false);
            }}
            style={{ ...styles.btnExportar, backgroundColor: "#ffa500", marginLeft: "10px" }}
          >
            {verUltimasSuscripciones ? "👥 Ver Todos" : "📆 Última Suscripción"}
          </button>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol/Suscripción</th>
                <th>Estatus</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.nombre_plan || u.nombre_rol || "N/A"}</td>
                  <td style={{ color: u.estatus ? "green" : "red" }}>
                    {u.estatus ? "Activo" : "Inactivo"}
                  </td>
                  <td>
                    <button
                      style={{
                        ...styles.btn,
                        backgroundColor: u.estatus ? "#f44336" : "#4CAF50",
                      }}
                      onClick={() => toggleEstatus(u.id_usuario)}
                    >
                      {u.estatus ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios para mostrar</p>
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
  exportWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  btnExportar: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  btn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};

export default GestionUsuarios;

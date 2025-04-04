import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import DashboardLayout from "./DashboardLayout";

const API_URL = process.env.REACT_APP_API_URL;

const Graficas = () => {
  const [porMes, setPorMes] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/grafica-ventas-${porMes ? "mes" : "dia"}`);
        const data = await res.json();
        setVentas(data);
      } catch (error) {
        console.error("❌ Error cargando ventas:", error);
      }
    };

    fetchVentas();
  }, [porMes]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/frecuencia-clientes`);
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error("❌ Error cargando clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
        
        {/* Gráfica de Ventas */}
        <div style={styles.card}>
          <div style={styles.header}>
            <h2>📊 Reportes de Ventas</h2>
            <label style={styles.toggleLabel}>
              <span>Por Día</span>
              <input
                type="checkbox"
                checked={porMes}
                onChange={(e) => setPorMes(e.target.checked)}
                style={{ margin: "0 10px" }}
              />
              <span>Por Mes</span>
            </label>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={porMes ? "mes" : "fecha"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#00BFFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Clientes */}
        <div style={styles.card}>
          <h2>👥 Clientes más frecuentes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={clientes}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="cliente" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="compras" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
};

export default Graficas;

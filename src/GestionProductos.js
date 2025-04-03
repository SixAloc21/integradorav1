import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion: '',
    precio: '',
    cantidad: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [productoTop, setProductoTop] = useState("");
  const [stockTotal, setStockTotal] = useState(null);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("❌ Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/productos/estadisticas');
      const data = await res.json();
      setProductoTop(data.producto_top || "Sin datos");
      setStockTotal(data.stock_total);
    } catch (err) {
      console.error("❌ Error cargando estadísticas:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchEstadisticas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ nombre_producto: '', descripcion: '', precio: '', cantidad: '' });
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId
        ? `http://localhost:5000/admin/productos/${editandoId}`
        : 'http://localhost:5000/admin/productos';
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);
      limpiarFormulario();
      fetchProductos();
      fetchEstadisticas(); // actualizar estadísticas si se agrega producto
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    }
  };

  const handleEdit = (producto) => {
    setForm({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
    });
    setEditandoId(producto.id_producto);
  };

  const toggleEstatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/productos/${id}/toggle`, {
        method: 'PUT',
      });
      const data = await res.json();
      alert(data.message);
      fetchProductos();
      fetchEstadisticas();
    } catch (err) {
      console.error("❌ Error al cambiar estatus:", err);
    }
  };

  const exportarPDF = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/reporte-productos');
      if (!res.ok) throw new Error('❌ Error al generar el PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte_productos.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
      alert("Hubo un error al generar el PDF");
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h2>📦 Gestión de Productos</h2>

        <div style={styles.statsBox}>
          <p><strong>⭐ Producto más vendido:</strong> {productoTop}</p>
          <p><strong>📦 Stock total:</strong> {stockTotal !== null ? stockTotal : "Cargando..."} unidades</p>
        </div>

        <button onClick={exportarPDF} style={styles.btnExportar}>📄 Exportar PDF</button>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="nombre_producto" value={form.nombre_producto} onChange={handleChange} placeholder="Nombre" required />
          <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
          <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" required />
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="Cantidad" required />
          <button type="submit" style={styles.btnGuardar}>{editandoId ? 'Actualizar' : 'Agregar'}</button>
          {editandoId && <button onClick={limpiarFormulario} style={styles.btnCancelar}>Cancelar</button>}
        </form>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Estatus</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.nombre_producto}</td>
                  <td>{p.descripcion}</td>
                  <td>${p.precio}</td>
                  <td>{p.cantidad}</td>
                  <td style={{ color: p.estatus === 1 ? 'green' : 'red' }}>
                    {p.estatus === 1 ? 'Activo' : 'Inactivo'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={styles.btnEditar}>Editar</button>
                    <button onClick={() => toggleEstatus(p.id_producto)} style={styles.btnEstatus}>
                      {p.estatus === 1 ? 'Desactivar' : 'Activar'}
                    </button>
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
    padding: '2rem',
    textAlign: 'center',
  },
  form: {
    marginBottom: '2rem',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnGuardar: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnCancelar: {
    backgroundColor: '#999',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnEditar: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    marginRight: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnEstatus: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnExportar: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  statsBox: {
    marginBottom: '20px',
    padding: '12px 18px',
    backgroundColor: '#e7f1ff',
    border: '1px solid #d0e3ff',
    borderRadius: '6px',
    width: 'fit-content',
    marginInline: 'auto',
    textAlign: 'left',
  }
};

export default GestionProductos;

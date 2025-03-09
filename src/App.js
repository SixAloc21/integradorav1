import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import Subscriptions from './Subscriptions';
import NuestroProducto from './NuestroProducto';
import Cart from './Cart'; // 🔹 Importamos el Carrito
import { CartProvider } from './CartContext'; // 🔹 Importamos el Contexto del Carrito
import Success from "./Success"; // 🔹 Importa la página de éxito

function App() {
  return (
    <CartProvider> {/* Envolvemos la App con el Contexto del Carrito */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<PrivateRoute allowedRoles={["Cliente"]}><Home /></PrivateRoute>} />
          <Route path="/subscriptions" element={<PrivateRoute allowedRoles={["Cliente"]}><Subscriptions /></PrivateRoute>} />
          <Route path="/nuestro-producto" element={<PrivateRoute allowedRoles={["Cliente"]}><NuestroProducto /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute allowedRoles={["Cliente"]}><Cart /></PrivateRoute>} />

          <Route path="/dashboard" element={<PrivateRoute allowedRoles={["Cliente", "Administrador"]}><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute allowedRoles={["Administrador"]}><Dashboard /></PrivateRoute>} />

          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

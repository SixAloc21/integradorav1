import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css"; // Importamos el CSS externo

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setError("Por favor, completa todos los campos.");
        return;
      }
    } else {
      if (!name.trim() || !registerEmail.trim() || !registerPassword.trim() || !confirmPassword.trim()) {
        setError("Por favor, completa todos los campos.");
        return;
      }
      if (registerPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:5000/login", {
          correo: loginEmail.trim(),
          contrasena: loginPassword.trim(),
        });

        localStorage.setItem("token", response.data.token);
        alert("Inicio de sesión exitoso");

        if (response.data.usuario.nombre_rol === "Administrador") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        const response = await axios.post("http://localhost:5000/register", {
          nombre: name.trim(),
          correo: registerEmail.trim(),
          contrasena: registerPassword.trim(),
        });

        if (response.status === 201) {
          alert("¡Registro exitoso!");
          toggleForm();
        } else {
          setError(response.data.error || "Error al registrar el usuario.");
        }
      }
    } catch (error) {
      console.error("🚨 Error:", error);
      setError(error.response?.data?.error || "Ocurrió un error en la solicitud.");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box" style={{ transform: isLogin ? "translateX(0%)" : "translateX(-50%)" }}>
        {/* LOGIN */}
        <div className="form">
          <h2>Iniciar Sesión</h2>
          {error && isLogin && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="button">Ingresar</button>
          </form>
          <p className="toggle-text">
            ¿No tienes cuenta?{" "}
            <span onClick={toggleForm} className="toggle-link">Regístrate aquí</span>
          </p>
        </div>

        {/* REGISTRO */}
        <div className="form">
          <h2>Registro</h2>
          {error && !isLogin && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input"
            />
            <button type="submit" className="button">Registrarse</button>
          </form>
          <p className="toggle-text">
            ¿Ya tienes cuenta? <span onClick={toggleForm} className="toggle-link">Inicia sesión</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

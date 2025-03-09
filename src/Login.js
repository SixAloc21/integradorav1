import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Iniciar sesión con Email y Contraseña (API Local)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email.trim(), contrasena: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setError("");

        // 🔹 Redirigir según el rol
        if (data.usuario.nombre_rol === "Administrador") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.error || "Error al iniciar sesión.");
      }
    } catch (err) {
      console.error("🚨 Error al conectar con el servidor:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  // 🔹 Iniciar sesión con Google y guardar en base de datos local
  const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("✅ Usuario autenticado con Google:", user);

        // 🔥 Enviar el correo al backend para guardarlo o iniciar sesión
        const response = await axios.post("http://localhost:5000/store-user", {
            correo: user.email,
            nombre: user.displayName
        });

        console.log("📥 Respuesta del backend:", response.data);

        // 🔥 Verificar que la respuesta contiene `token` y `usuario`
        if (response.data.token && response.data.usuario) {
            console.log("✅ Token y usuario recibidos correctamente:", response.data);

            // Guardar el token en localStorage
            localStorage.setItem("token", response.data.token);

            // 🔹 Redirigir según el rol
            if (response.data.usuario.nombre_rol === "Administrador") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } else {
            setError("Error al iniciar sesión con Google. Intenta de nuevo.");
            console.error("🚨 La respuesta del backend no contiene `token` o `usuario`:", response.data);
        }
    } catch (error) {
        console.error("🚨 Error al iniciar sesión con Google:", error);
        setError("Error al iniciar sesión con Google.");
    }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Iniciar Sesión</button>
      </form>

      <p style={styles.linkText}>
        ¿No tienes una cuenta?{" "}
        <Link to="/register" style={styles.link}>Regístrate aquí</Link>
      </p>

      {/* Botón de inicio de sesión con Google */}
      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" 
          alt="Google" 
          style={styles.googleIcon} 
        />
        Iniciar sesión con Google
      </button>
    </div>
  );
};

export default Login;

// 🎨 **Estilos dentro del mismo código**
const styles = {
  container: {
    background: "linear-gradient(135deg, #00BDD4, #0099CC)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    color: "#fff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  error: {
    color: "#f44336",
    marginBottom: "15px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  linkText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#fff",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
    transition: "background-color 0.3s ease",
  },
  googleIcon: {
    width: "20px",
    height: "20px",
    marginRight: "10px",
  },
};

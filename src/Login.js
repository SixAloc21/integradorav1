const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
  }

  try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: email.trim(), contrasena: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
          localStorage.setItem("token", data.token);
          setError("");

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

const handleGoogleLogin = async () => {
  try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("✅ Usuario autenticado con Google:", user);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/store-user`, {
          correo: user.email,
          nombre: user.displayName
      });

      console.log("📥 Respuesta del backend:", response.data);

      if (response.data.token && response.data.usuario) {
          console.log("✅ Token y usuario recibidos correctamente:", response.data);
          localStorage.setItem("token", response.data.token);

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

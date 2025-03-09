import React from 'react';
import Header from './Header';

const Home = () => {
  return (
    <div style={styles.pageContainer}>
      {/* ✅ El header ahora ocupa todo el ancho */}
      <div style={styles.headerWrapper}>
        <Header />
      </div>

      {/* Contenido principal con la información y la imagen */}
      <div style={styles.contentContainer}>
        {/* 📌 Información del producto (izquierda) */}
        <div style={styles.textContainer}>
          <h2 style={styles.title}>Silla de Ruedas Inteligente</h2>
          <p style={styles.description}>
            Nuestra silla de ruedas inteligente está equipada con sensores avanzados que garantizan
            una seguridad excepcional. Gracias a su tecnología de última generación, los usuarios pueden desplazarse con mayor autonomía y confianza.
            <br /><br />
            Este innovador modelo incluye frenos automáticos, un sistema de navegación autónomo
            y detección de obstáculos en tiempo real. Diseñada para mejorar la movilidad de personas con discapacidad, nuestra silla proporciona comodidad, seguridad y un estilo de vida más independiente.
          </p>
        </div>

        {/* 📌 Imagen del producto (derecha) */}
        <div style={styles.imageContainer}>
          <img
            src={process.env.PUBLIC_URL + "/imagenes/silladeruedas.png"}
            alt="Silla de Ruedas Inteligente"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

// 🎨 **Estilos Mejorados**
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #6EB5FF, #00BDD4)", // Fondo degradado azul
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%", // 🔹 Header ocupa todo el ancho
  },
  contentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "1100px",
    width: "100%",
    gap: "40px",
    padding: "60px 20px",
  },
  textContainer: {
    flex: 1,
    textAlign: "left",
    color: "#fff", // Texto en blanco para que resalte con el fondo
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    maxWidth: "450px",
  },
};

export default Home;

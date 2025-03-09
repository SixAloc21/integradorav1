import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import Header from './Header'; // 🔹 Manteniendo tu Header

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Subscriptions = () => {
  const handleSubscription = async (priceId) => {
    try {
        const { data } = await axios.post("http://localhost:5000/create-checkout-session", { priceId });
        window.location.href = data.url;  // Redirigir a la URL correcta de Stripe Checkout
    } catch (error) {
        console.error("🚨 Error al iniciar pago:", error);
    }
};


    return (
        <Elements stripe={stripePromise}>
            <div>
                <Header /> {/* 🔹 Se mantiene el Header */}
                <div style={styles.container}>
                    <h2 style={styles.title}>📜 Nuestras Suscripciones</h2>
                    <p style={styles.subtitle}>Elige el plan que mejor se adapte a ti y disfruta de nuestros beneficios exclusivos.</p>

                    <div style={styles.subscriptionContainer}>
                        <div style={styles.subscriptionCard}>
                            <h3 style={styles.cardTitle}>🎟️ Plan Básico</h3>
                            <p style={styles.cardText}>Accede a contenido limitado con funciones básicas.</p>
                            <p style={styles.price}><strong>$139,00 MXN/mes</strong></p>
                            <button style={styles.payButton} onClick={() => handleSubscription("price_1Qz3JoQ0iwi1aV4HfPZiuEDm")}>Suscribirse</button>
                        </div>

                        <div style={styles.subscriptionCardPremium}>
                            <h3 style={styles.cardTitle}>💎 Plan Premium</h3>
                            <p style={styles.cardText}>Disfruta de acceso ilimitado y funciones exclusivas.</p>
                            <p style={styles.price}><strong>$269,00 MXN/mes</strong></p>
                            <button style={styles.payButton} onClick={() => handleSubscription("price_1Qz7baQ0iwi1aV4HmoYSSY9p")}>Suscribirse</button>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
};

// 🎨 **Estilos**
const styles = {
  container: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#6EB5FF',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '30px',
  },
  subscriptionContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '20px',
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    color: '#333',
    padding: '25px',
    borderRadius: '15px',
    width: '280px',
    textAlign: 'center',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
  },
  subscriptionCardPremium: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '25px',
    borderRadius: '15px',
    width: '280px',
    textAlign: 'center',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '16px',
    marginBottom: '15px',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  payButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Subscriptions;

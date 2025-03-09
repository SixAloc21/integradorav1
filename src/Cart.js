import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import Header from "./Header";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 Tu Carrito</h2>
        
        {cart.length === 0 ? (
          <p style={styles.emptyText}>Tu carrito está vacío.</p>
        ) : (
          <ul style={styles.cartList}>
            {cart.map((product, index) => (
              <li key={index} style={styles.cartItem}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <div style={styles.details}>
                  <p style={styles.productName}>{product.name}</p>
                  <p style={styles.productPrice}>${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(index)}
                    style={styles.removeButton}
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#E3F2FD",
    color: "#333",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#007bff",
  },
  emptyText: {
    fontSize: "18px",
    color: "#666",
  },
  cartList: {
    listStyle: "none",
    padding: 0,
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "10px",
    margin: "10px auto",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    maxWidth: "600px",
  },
  image: {
    width: "80px",
    borderRadius: "10px",
  },
  details: {
    flex: 1,
    marginLeft: "15px",
    textAlign: "left",
  },
  productName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: "14px",
    color: "#007bff",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Cart;

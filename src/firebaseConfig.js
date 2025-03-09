import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase (asegúrate de que las credenciales sean correctas)
const firebaseConfig = {
  apiKey: "AIzaSyD8Qstfy9I0Wm1TMBd6TECyOREA4V3ABRA",
  authDomain: "rollase-5bd39.firebaseapp.com",
  projectId: "rollase-5bd39",
  storageBucket: "rollase-5bd39.appspot.com",
  messagingSenderId: "843094419331",
  appId: "1:843094419331:web:9db0d495eeb194820338b6",
  measurementId: "G-386VQ1HQWM"
};

// 🟢 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// 🔹 Configuración para evitar pop-ups bloqueados
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, googleProvider, analytics };

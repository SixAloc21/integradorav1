require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 **Configuración de CORS** (Permitir solicitudes desde el frontend en Vercel)
const corsOptions = {
    origin: ["https://integradorav1.vercel.app"], // 🔹 Cambia esto por la URL de tu frontend en Vercel
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// 🔹 **Configuración de la base de datos**
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    multipleStatements: true
});

// 🔹 Convertir `db.query` a Promesas para facilitar el uso con async/await
db.query = util.promisify(db.query);

// 🔹 **Conectar a MySQL con reconexión automática**
const connectToDatabase = () => {
    db.connect((err) => {
        if (err) {
            console.error("❌ Error conectando a MySQL:", err);
            setTimeout(connectToDatabase, 5000); // 🔹 Reintentar conexión tras 5s
        } else {
            console.log("✅ Conectado a MySQL en", process.env.DB_HOST);
        }
    });

    db.on('error', (err) => {
        console.error("⚠️ Error en la conexión a MySQL:", err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToDatabase();
        } else {
            throw err;
        }
    });
};

connectToDatabase(); // 🔹 Iniciar conexión

// 🔹 **Middleware de CORS (Alternativo, en caso de que el anterior no funcione)**
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // ⚠️ Puedes cambiarlo por la URL de tu frontend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

// 🔹 **Ruta de prueba para verificar la conexión**
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT 1 + 1 AS result"); // Prueba de consulta a MySQL
        res.json({ message: "🚀 Servidor corriendo y conectado a MySQL", result });
    } catch (error) {
        console.error("🚨 Error en la consulta:", error);
        res.status(500).json({ error: "Error al conectar con MySQL" });
    }
});

// 🔹 **Iniciar el servidor**
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

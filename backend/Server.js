require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const util = require('util');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 **Configuración de CORS** para permitir solicitudes desde el frontend en Vercel
const corsOptions = {
    origin: ["https://tu-backend.vercel.app"], // 🔹 Cambia esto por la URL de tu frontend en Vercel
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// 🔹 **Configuración de la base de datos**
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "test",
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
});

// 🔹 Convertir `db.query` a Promesas
db.query = util.promisify(db.query);

// 🔹 **Conectar a MySQL**
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

// 🔹 **Ruta de prueba de conexión**
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT 1 + 1 AS result"); // Prueba de consulta
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

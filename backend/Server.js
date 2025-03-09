require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // 🔹 Integración de Stripe
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // 🔹 Middleware para Stripe

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rollase'
});

// Convertir `db.query` a Promesas
db.query = util.promisify(db.query);

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// 🔹 **Middleware para autenticar tokens**
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    jwt.verify(token, process.env.JWT_SECRET || "secreto", (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

// 🔹 **Middleware para verificar roles**
const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
        }
        next();
    };
};

// 🔹 **Registro de Usuario**
app.post('/register', async (req, res) => {
    console.log("📥 Datos recibidos en el backend:", req.body);

    let { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const existingUser = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const sql = 'INSERT INTO usuario (nombre, usuario, correo, contrasena, nombre_rol, estatus) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(sql, [nombre, correo, correo, hashedPassword, "Cliente", 1]);

        res.status(201).json({ message: "✅ Usuario registrado exitosamente" });
    } catch (error) {
        console.error("🚨 Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 **Inicio de Sesión**
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    try {
        const results = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

        if (results.length === 0) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        const token = jwt.sign(
            { id_usuario: user.id_usuario, correo: user.correo, rol: user.nombre_rol },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: '1h' }
        );

        res.json({ message: "✅ Inicio de sesión exitoso", token, usuario: user });
    } catch (error) {
        console.error("🚨 Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 **Ruta para almacenar usuarios de Google en la base de datos**
app.post("/store-user", async (req, res) => {
    const { correo, nombre } = req.body;

    if (!correo) {
        return res.status(400).json({ error: "El correo es obligatorio." });
    }

    try {
        const existingUser = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        if (existingUser.length > 0) {
            const user = existingUser[0];

            const token = jwt.sign(
                { id_usuario: user.id_usuario, correo: user.correo, rol: user.nombre_rol },
                process.env.JWT_SECRET || "secreto",
                { expiresIn: "1h" }
            );

            console.log("✅ Usuario ya existente:", { token, usuario: user });

            return res.json({
                message: "✅ Usuario encontrado, iniciando sesión...",
                token,
                usuario: user,
            });
        }

        const sql = "INSERT INTO usuario (correo, nombre, nombre_rol, estatus) VALUES (?, ?, ?, ?)";
        await db.query(sql, [correo, nombre, "Cliente", 1]);

        const newUser = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

        const token = jwt.sign(
            { id_usuario: newUser[0].id_usuario, correo: newUser[0].correo, rol: newUser[0].nombre_rol },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: "1h" }
        );

        console.log("✅ Usuario nuevo registrado:", { token, usuario: newUser[0] });

        res.json({
            message: "✅ Usuario de Google almacenado correctamente.",
            token,
            usuario: newUser[0],
        });

    } catch (error) {
        console.error("🚨 Error al almacenar usuario de Google:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🔹 **Ruta para crear sesión de pago en Stripe**
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { priceId } = req.body;
        console.log("📢 Recibiendo priceId:", priceId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: "http://localhost:3000/success", // ✅ Redirige al éxito
            cancel_url: "http://localhost:3000/cancel",   // ✅ Redirige si cancela
        });

        res.json({ url: session.url }); // 🔹 Asegúrate de devolver la URL
    } catch (error) {
        console.error("🚨 Error en Stripe:", error);
        res.status(500).json({ error: "Error al crear la sesión de checkout" });
    }
});


// 🔹 **Ruta protegida para el Admin**
app.get('/admin', authenticateToken, verifyRole(["Administrador"]), (req, res) => {
    res.json({ message: "Bienvenido al Panel de Administrador", user: req.user });
});

// 🔹 **Ruta protegida para usuarios logueados**
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Bienvenido al Dashboard', user: req.user });
});

// 🔹 **Verificar si el Servidor está Corriendo**
app.get('/', (req, res) => {
    res.send("🚀 Servidor corriendo correctamente");
});

// 🔹 **Iniciar el servidor**
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

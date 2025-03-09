import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                nombre: name.trim(),
                correo: email.trim(),
                contrasena: password.trim(),
            });

            if (response.status === 201) {
                alert('¡Registro exitoso!');
                setError('');
                navigate('/');
            } else {
                setError(response.data.error || 'Ocurrió un error al registrar el usuario.');
            }
        } catch (error) {
            console.error("🚨 Error al registrar usuario:", error);
            setError(error.response?.data?.error || 'Ocurrió un error al registrar el usuario.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ color: '#fff' }}>Registro</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="name" style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingresa tu nombre"
                        style={styles.input}
                    />
                </div>
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
                <div style={styles.inputGroup}>
                    <label htmlFor="confirmPassword" style={styles.label}>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu contraseña"
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
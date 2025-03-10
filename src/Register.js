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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Registro</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar Contraseña" />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Register;

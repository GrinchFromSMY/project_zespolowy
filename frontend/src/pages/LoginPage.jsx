import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Импорт правильный

// Используем правильный URL твоего бэкенда
const API_LOGIN_URL = 'http://127.0.0.1:9000/api/auth/token';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // --- Исправляем имя переменной ---
    const history = useHistory();
    // const { login } = useContext(AuthContext); // Закомментировано, пока нет контекста

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await axios.post(API_LOGIN_URL, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const token = response.data.access_token;

            if (token) {
                localStorage.setItem('accessToken', token);
                console.log('Вход успешен, токен сохранен.');
                // login(token); // Закомментировано
                // --- Исправляем вызов навигации ---
                history.push('/'); // Перенаправление на главную

            } else {
                throw new Error('Токен не получен от сервера');
            }

        } catch (err) {
            console.error('Ошибка входа:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Произошла ошибка при входе.';
            setError(errorMessage);
            localStorage.removeItem('accessToken');
            // logout(); // Закомментировано
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- JSX разметка остается без изменений ---
        <div className="container auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="loginUsername" style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя или Email:</label>
                    <input
                        type="text"
                        id="loginUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="loginPassword" style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
                    <input
                        type="password"
                        id="loginPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                     style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
             <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Нет аккаунта? <a href="/register">Зарегистрироваться</a> {/* Замени на Link, если нужно */}
            </p>
        </div>
    );
}

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// --- Меняем порт на 9000 ---
const API_REGISTER_URL = 'http://127.0.0.1:9000/api/auth/register';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const userData = { username, email, password };

        try {
            // Запрос теперь пойдет на порт 9000
            const response = await axios.post(API_REGISTER_URL, userData, {
                 headers: { 'Content-Type': 'application/json' }
            });

            setSuccess(`Пользователь ${response.data.username} успешно зарегистрирован! Перенаправление на страницу входа...`);
            setUsername('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                history.push('/login');
            }, 2000);

        } catch (err) {
            console.error('Ошибка регистрации:', err);
            // Проверяем, есть ли ответ от сервера вообще (при Network Error его может не быть)
            if (err.response) {
                // Ошибка от API (например, 400 Bad Request)
                const errorMessage = err.response.data?.detail || 'Произошла ошибка при регистрации.';
                setError(errorMessage);
            } else if (err.request) {
                // Запрос был сделан, но ответ не получен (Network Error)
                setError('Не удалось подключиться к серверу. Проверьте соединение или адрес API.');
            } else {
                // Другая ошибка (например, при настройке запроса)
                setError('Произошла непредвиденная ошибка.');
            }
        } finally {
            setLoading(false);
        }
    };

     return (
        // --- JSX разметка остается без изменений ---
        <div className="container auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regUsername" style={{ display: 'block', marginBottom: '5px' }}>Имя пользователя:</label>
                    <input
                        type="text"
                        id="regUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                 <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regEmail" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        id="regEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regPassword" style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
                    <input
                        type="password"
                        id="regPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        disabled={loading}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
             <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Уже есть аккаунт? <a href="/login">Войти</a> {/* Замени на Link, если нужно */}
            </p>
        </div>
    );
}

export default RegisterPage;

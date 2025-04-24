import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Poprawny import

// Używamy poprawnego URL twojego backendu
const API_LOGIN_URL = 'http://127.0.0.1:9000/api/auth/token';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // --- Poprawiamy nazwę zmiennej ---
    const history = useHistory();
    // const { login } = useContext(AuthContext); // Zakomentowane, dopóki nie ma kontekstu

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
                console.log('Logowanie udane, token zapisany.');
                // login(token); // Zakomentowane
                // --- Poprawiamy wywołanie nawigacji ---
                history.push('/'); // Przekierowanie na stronę główną

            } else {
                throw new Error('Token nie został otrzymany z serwera');
            }

        } catch (err) {
            console.error('Błąd logowania:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Wystąpił błąd podczas logowania.';
            setError(errorMessage);
            localStorage.removeItem('accessToken');
            // logout(); // Zakomentowane
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- Struktura JSX pozostaje bez zmian ---
        <div className="container auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="loginUsername" style={{ display: 'block', marginBottom: '5px' }}>Nazwa użytkownika lub Email:</label>
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
                    <label htmlFor="loginPassword" style={{ display: 'block', marginBottom: '5px' }}>Hasło:</label>
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
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>
             <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Nie masz konta? <a href="/register">Zarejestruj się</a> {/* Można zamienić na Link, jeśli potrzeba */}
            </p>
        </div>
    );
}

export default LoginPage;

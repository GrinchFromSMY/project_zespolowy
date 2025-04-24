import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// --- Zmieniamy port na 9000 ---
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
            // Żądanie teraz pójdzie na port 9000
            const response = await axios.post(API_REGISTER_URL, userData, {
                 headers: { 'Content-Type': 'application/json' }
            });

            setSuccess(`Użytkownik ${response.data.username} został pomyślnie zarejestrowany! Przekierowywanie na stronę logowania...`);
            setUsername('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                history.push('/login');
            }, 2000);

        } catch (err) {
            console.error('Błąd rejestracji:', err);
            // Sprawdzamy, czy w ogóle jest odpowiedź od serwera (przy Network Error może jej nie być)
            if (err.response) {
                // Błąd z API (np. 400 Bad Request)
                const errorMessage = err.response.data?.detail || 'Wystąpił błąd podczas rejestracji.';
                setError(errorMessage);
            } else if (err.request) {
                // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi (Network Error)
                setError('Nie udało się połączyć z serwerem. Sprawdź połączenie lub adres API.');
            } else {
                // Inny błąd (np. podczas konfiguracji żądania)
                setError('Wystąpił nieoczekiwany błąd.');
            }
        } finally {
            setLoading(false);
        }
    };

     return (
        // --- Struktura JSX pozostaje bez zmian ---
        <div className="container auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="regUsername" style={{ display: 'block', marginBottom: '5px' }}>Nazwa użytkownika:</label>
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
                    <label htmlFor="regPassword" style={{ display: 'block', marginBottom: '5px' }}>Hasło:</label>
                    <input
                        type="password"
                        id="regPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6} // Warto zostawić walidację długości hasła
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
                    {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                </button>
            </form>
             <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Masz już konto? <a href="/login">Zaloguj się</a> {/* Zamień na Link, jeśli potrzeba */}
            </p>
        </div>
    );
}

export default RegisterPage;

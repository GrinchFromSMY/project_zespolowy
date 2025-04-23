import React, { useEffect, useState, useRef } from 'react'; // Добавляем useRef
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom'; // Добавляем useHistory для выхода

// --- URL API (используем порт 9000) ---
const API_BASE_URL = 'http://127.0.0.1:9000/api';
const API_MOVIES_URL = `${API_BASE_URL}/movies/`;
const API_USER_INFO_URL = `${API_BASE_URL}/auth/users/me`;
const API_AVATAR_UPLOAD_URL = `${API_BASE_URL}/users/me/avatar`; // Убедись, что этот эндпоинт существует на бэкенде

// --- Стили для аватарки ---
const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '2px solid #ccc',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '15px' // Отступ слева
};

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Загрузка фильмов
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Состояния для аутентификации и аватара ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false); // Загрузка файла аватара
  const fileInputRef = useRef(null);
  const history = useHistory(); // Для выхода

  // --- Функция загрузки фильмов ---
  const fetchMovies = async () => {
    // setLoading(true); // Уже устанавливается при инициализации
    setError(null);
    try {
      const response = await axios.get(API_MOVIES_URL);
      setMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Ошибка при загрузке фильмов');
    } finally {
      setLoading(false); // Выключаем общую загрузку здесь
    }
  };

  // --- Функция загрузки данных пользователя ---
   const fetchUserInfo = async (token) => {
        // Не показываем отдельную загрузку для аватара при первой загрузке страницы
        try {
            const response = await axios.get(API_USER_INFO_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Предполагаем поле avatar_url в ответе
            if (response.data.avatar_url) {
                setUserAvatar(response.data.avatar_url);
            } else {
                 setUserAvatar('/img/default-avatar.png'); // Замени на свой путь к дефолтной аватарке
            }
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
             setUserAvatar('/img/default-avatar.png'); // Ставим дефолтную при ошибке
             if (error.response?.status === 401) {
                 handleLogout(); // Разлогиниваем, если токен невалиден
             }
        }
    };

  // --- Загрузка фильмов и проверка статуса входа при монтировании ---
  useEffect(() => {
    setLoading(true); // Включаем общую загрузку
    const token = localStorage.getItem('accessToken');
    if (token) {
        setIsLoggedIn(true);
        // Параллельно загружаем фильмы и информацию о пользователе
        Promise.all([fetchMovies(), fetchUserInfo(token)])
            .catch(err => console.error('Ошибка при параллельной загрузке:', err)) // Ловим общую ошибку, если нужно
            .finally(() => setLoading(false)); // Выключаем общую загрузку после всего
    } else {
        setIsLoggedIn(false);
        setUserAvatar(null);
        fetchMovies(); // Просто загружаем фильмы, если не залогинен
    }
  }, []); // Пустой массив - выполняется один раз

  // --- Обработчик поиска ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Фильтрация фильмов ---
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Обработчик выхода ---
   const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setUserAvatar(null);
        // Можно просто обновить состояние, не перезагружая страницу
        // history.push('/'); // Если нужно перейти на главную
        // Вместо window.location.reload() просто обновляем состояние:
        // Компонент перерисуется сам из-за изменения isLoggedIn
   };

  // --- Обработчик клика по аватарке ---
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- Обработчик выбора файла ---
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение.');
      return;
    }

    setIsLoadingAvatar(true); // Включаем индикатор загрузки аватара
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Нет токена для загрузки аватара');
      setIsLoadingAvatar(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_AVATAR_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }); 
      if (response.data.avatar_url) {
        setUserAvatar(response.data.avatar_url);
        console.log('Аватар успешно обновлен!');
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      alert(`Не удалось загрузить аватар: ${error.response?.data?.detail || error.message}`);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoadingAvatar(false); // Выключаем индикатор загрузки аватара
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  // --- Условный рендеринг для общей загрузки и ошибок ---
  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>;
  }
  // Ошибку загрузки фильмов показываем только если она есть
  if (error && !loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  }

  // --- Основной рендеринг ---
  return (
    <>
      <div className="container">
        {/* --- Search and Auth Section --- */}
        <div className="top-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px', padding: '0 15px' }}>
          {/* --- Search bar --- */}
          <div className="search-bar" style={{ flexGrow: 1, marginRight: '20px' }}>
            <input
              type="text"
              placeholder="Wyszukaj filmy według tytułu..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* --- Auth Section (Avatar or Links) --- */}
          <div className="auth-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLoggedIn ? (
              <>
                {/* Аватарка или индикатор загрузки */}
                {isLoadingAvatar ? (
                  <div style={{ ...avatarStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', cursor: 'default' }}>...</div>
                ) : (
                  <img
                    src={userAvatar || '/img/default-avatar.png'} // Замени путь!
                    alt="Аватар"
                    style={avatarStyle}
                    onClick={handleAvatarClick}
                    onError={(e) => { e.target.src = '/img/default-avatar.png'; }} // Замени путь!
                  />
                )}
                {/* Скрытый input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                {/* Кнопка выхода */}
                <button onClick={handleLogout} style={{ padding: '8px 12px' }}>Wyloguj się</button>
              </>
            ) : (
              <>
                {/* Ссылки Войти/Регистрация */}
                <Link to="/login" style={{ textDecoration: 'none', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
                Zaloguj się
                </Link>
                <Link to="/register" style={{ textDecoration: 'none', padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: '1px solid #007bff', borderRadius: '4px' }}>
                Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Movie grid */}
        <div className="movie-grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>
              {movies.length > 0 ? `По вашему запросу "${searchTerm}" ничего не найдено.` : 'Фильмы не найдены.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;

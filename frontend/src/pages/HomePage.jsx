import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import axios from 'axios'; // For making HTTP requests

const HomePage = () => {
  const [movies, setMovies] = useState([]); // State to store movies
  const [loading, setLoading] = useState(true); // State to display loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  // Function to fetch movies from the API
  const fetchMovies = async () => {
    setLoading(true); // Set loading before request
    setError(null); // Reset error
    try {
      const response = await axios.get('http://localhost:9000/api/movies/'); // Replace URL with your API
      setMovies(response.data); // Save movies to state
    } catch (err) {
      console.error('Error fetching movies:', err); // Log error for debugging
      setError('Ошибка при загрузке фильмов'); // Set error message
    } finally {
      setLoading(false); // Turn off loading indicator in any case (success or error)
    }
  };

  // Use useEffect to load movies when the component is mounted
  useEffect(() => {
    fetchMovies();
  }, []); // Empty dependency array means the effect will run once on mount

  // --- Search handler ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Filter movies ---
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Conditional rendering ---
  if (loading) {
    return <div>Загрузка...</div>; // Display loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  // --- Main rendering ---
  return (
    <>
      <div className="container">
        {/* --- Search bar --- */}
        <div className="search-bar" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Поиск фильмов по названию..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: '10px', width: '50%' }}
          />
        </div>

        {/* Movie grid */}
        <div className="movie-grid">
          {/* --- Render filtered movies --- */}
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            // Message if no movies found
            <p>По вашему запросу &quot;{searchTerm}&quot; ничего не найдено.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;

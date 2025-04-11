import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import axios from 'axios'; // For making HTTP requests

const HomePage = () => {
  const [movies, setMovies] = useState([]); // State to store movies
  const [loading, setLoading] = useState(true); // State to display loading indicator
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch movies from the API
  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/movies/'); // Replace URL with your API
      setMovies(response.data); // Save movies to state
      setLoading(false); // Turn off loading indicator
    } catch (err) {
      setError('Error while loading movies');
      setLoading(false);
    }
  };

  // Use useEffect to load movies when the component is mounted
  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <>
      {/* Movie grid */}
      <div className="container">
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
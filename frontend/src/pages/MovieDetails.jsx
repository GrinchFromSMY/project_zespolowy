import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams(); // Pobieranie ID filmu z URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych o filmie
  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (err) {
      setError('Błąd podczas ładowania danych o filmie');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Film nie znaleziony</div>;
  }

  return (
    <div className="container movie-details">
      <img src={movie.image_url} alt={movie.title} />
      <div className="movie-details-content">
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>
        <p>Ocena: {movie.rating}</p>
        <p>Gatunki: {movie.genres.join(', ')}</p>
        <p>Twórca: {movie.creator}</p>
      </div>
      <div className="movie-actors">
        <h2>Aktorzy:</h2>
        <ul>
          {movie.actors.map((actor, index) => (
            <li key={index}>
              <img src={actor.photo_url} alt={actor.name} />
              <p>{actor.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetails;
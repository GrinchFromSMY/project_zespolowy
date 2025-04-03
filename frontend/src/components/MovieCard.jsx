import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? movie.poster_path
    : `https://via.placeholder.com/300x450?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-card-info">
          <h3>{movie.title}</h3>
          <p>Рейтинг: {movie.vote_average}</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
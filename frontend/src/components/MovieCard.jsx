import React from 'react';
import { Link } from 'react-router-dom';
const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`}>
      <img src={movie.image_url} alt={movie.title} className="movie-poster" />
      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-overview">{movie.overview}</p>
      <p className="movie-release-date">Data: {movie.release_date}</p>
      <p className="movie-vote-average">TMDB: {movie.rating} %</p>
      </Link>
    </div>
  );
};

export default MovieCard;
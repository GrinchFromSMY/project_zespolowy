import React from 'react';
import { useParams } from 'react-router-dom';

// Тестові дані для окремих фільмів
const dummyMovies = {
  1: {
    id: 1,
    title: 'The Beginning After the End (2025)',
    poster_path: 'https://media.themoviedb.org/t/p/w260_and_h390_bestv2/2NogAa2FQmZJkwHJTwiuCHfxIFD.jpg',
    overview: 'После загадочной смерти король Грей снова родился на свет уже в другом мире — на магическом материке Дикатен под именем Артур Лейвин. Впрочем, пусть и запертый в теле младенца, свою мудрость король не растерял. Потихоньку обучаясь в магии и прокладывая путь в светлое будущее, теперь уже Артур вознамерился исправить ошибки, совершённые в прошлой жизни.',
    release_date: '2023-01-01',
    vote_average: 7.5
  },
 2: {
    id: 2,
    title: 'Solo Leveling: Поднятие уровня в одиночку (2024)',
    poster_path: 'https://media.themoviedb.org/t/p/w440_and_h660_face/8u56LKz0An8xa9YaFtkxsDKc5N5.jpg',
    overview: '10 лет назад открылись врата в другой мир, где людям дозволено убивать монстров. Так появились охотники, преследующие и уничтожающие тварей. Но не каждому из них суждено повысить свой уровень и стать сильнее. Сон Джин-у был охотником низшего E-ранга, у которого не было ни единого шанса продвинуться по ранговой лестнице, пока однажды он случайно не очутился в подземелье D-ранга. Чуть не погибнув от рук чудовищ, Джин-у открывает секрет повышения уровня.',
    release_date: '2023-02-01',
    vote_average: 8.2
  },
  3 :{
    id: 3,
    title: 'Игра Престолов',
    poster_path: 'https://media.themoviedb.org/t/p/w440_and_h660_face/tbBQW8jpDH7RpAymMGnBluIsdmH.jpg',
    overview: 'К концу подходит время благоденствия, и лето, длившееся почти десятилетие, угасает. Вокруг средоточия власти Семи Королевств, Железного трона, зреет заговор, и в это непростое время король решает искать поддержки у друга юности Эддарда Старка. В мире, где все — от короля до наёмника — рвутся к власти, плетут интриги и готовы вонзить нож в спину, есть место и благородству, состраданию и любви. Между тем, никто не замечает пробуждение тьмы из легенд далеко на Севере — и лишь Стена защищает живых к югу от неё.',
    release_date: '2023-03-01',
    vote_average: 6.9
  }
};

const MovieDetails = () => {
  const { id } = useParams();
  const movie = dummyMovies[id];

  if (!movie) {
    return <div className="container">Фільм не знайдено</div>;
  }

  return (
    <div className="container movie-details">
      <img src={movie.poster_path} alt={movie.title} />
      <div className="movie-details-content">
        <h1>{movie.title}</h1>
        <p>Рейтинг: {movie.vote_average}</p>
        <p>{movie.overview}</p>
        <p>Дата виходу: {movie.release_date}</p>
      </div>
    </div>
  );
};

export default MovieDetails;
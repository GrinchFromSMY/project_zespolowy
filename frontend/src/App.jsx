import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import TopRatedPage from './pages/TopRatedPage';
import NowPlayingPage from './pages/NowPlayingPage';
import PopularPage from './pages/PopularPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


const App = () => {
  return (
    <Router>
      {/* Передаем информацию о текущем пользователе в Header, если нужно */}
      <Header />
      <Switch> {/* Switch рендерит первый совпавший Route */}
        <Route exact path="/" component={HomePage} />
        <Route path="/movies/:id" component={MovieDetails} />
        <Route path="/top-rated" component={TopRatedPage} />
        <Route path="/now-playing" component={NowPlayingPage} />
        <Route path="/popular" component={PopularPage} />
        {/* --- Добавляем маршруты для входа и регистрации --- */}
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        {/* Можно добавить маршрут для 404 страницы в конце */}
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;

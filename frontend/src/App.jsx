import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import TopRatedPage from './pages/TopRatedPage';
import NowPlayingPage from './pages/NowPlayingPage';
import PopularPage from './pages/PopularPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/movies/:id" component={MovieDetails} />
      <Route path="/top-rated" component={TopRatedPage} />
      <Route path="/now-playing" component={NowPlayingPage} />
      <Route path="/popular" component={PopularPage} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
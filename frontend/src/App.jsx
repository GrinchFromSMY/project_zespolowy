import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/movies/:id" component={MovieDetails} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
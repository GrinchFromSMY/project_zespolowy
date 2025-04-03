import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container">
        <nav>
          <ul className="nav-menu">
            <li>
              <Link to="/">Головна</Link>
            </li>
            <li>
              <Link to="/popular">Популярні</Link>
            </li>
            <li>
              <Link to="/top-rated">Топ рейтингові</Link>
            </li>
            <li>
              <Link to="/upcoming">Скоро</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
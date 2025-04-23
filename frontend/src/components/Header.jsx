import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container">
        <nav>
          <ul className="nav-menu">
            <li>
              <Link to="/">Strona główna</Link>
            </li>
            <li>
              <Link to="/popular">Popularne</Link>
            </li>
            <li>
              <Link to="/top-rated">Najwyżej oceniane</Link>
            </li>
            <li>
              <Link to="/now-playing">Obecnie w kinach</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} My Movie App. Усі права захищено.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
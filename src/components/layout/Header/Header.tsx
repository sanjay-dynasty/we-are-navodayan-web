import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link className="header__brand" to="/">
          We Are Navodayan
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/alumni">Alumni</Link>
          <Link to="/jnv">JNV</Link>
          <Link to="/opportunities">Opportunities</Link>
        </nav>

        <div className="header__actions">
          <Link className="header__profile" to="/profile">
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

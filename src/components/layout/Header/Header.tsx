import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/useAuth';
import './Header.css';

function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

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
          {!isLoading && isAuthenticated ? (
            <>
              <Link className="header__profile" to="/profile">
                {user?.fullName || 'Profile'}
              </Link>
              <button
                className="header__profile"
                type="button"
                onClick={() => void handleLogout()}
              >
                Log out
              </button>
            </>
          ) : !isLoading ? (
            <>
              <Link className="header__profile" to="/login">
                Log in
              </Link>
              <Link className="header__profile" to="/register">
                Register
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;

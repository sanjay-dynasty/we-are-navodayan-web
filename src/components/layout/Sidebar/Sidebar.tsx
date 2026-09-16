import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Alumni', path: '/alumni' },
  { label: 'JNV', path: '/jnv' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Mentorship', path: '/mentorship' },
  { label: 'Events', path: '/events' },
  { label: 'Community', path: '/community' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

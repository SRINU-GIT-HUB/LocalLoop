import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link';

  const roleBadge = {
    ADMIN: { label: 'Admin', color: '#7c3aed' },
    LEADER: { label: 'Leader', color: '#d97706' },
    SERVICE_PROVIDER: { label: 'Provider', color: '#0891b2' },
    USER: null,
  };
  const badge = user ? roleBadge[user.role] : null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🔗</span>
          LocalLoop
        </NavLink>
      </div>

      {/* Hamburger for mobile */}
      <button
        className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      <div className={`nav-body ${menuOpen ? 'nav-body--open' : ''}`}>
        <div className="nav-links">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
            Marketplace
          </NavLink>
          <NavLink to="/services" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>

          {user && (
            <>
              <NavLink to="/sell" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                + List Item
              </NavLink>
              <NavLink to="/inbox" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Inbox
              </NavLink>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          {user?.role === 'LEADER' && (
            <NavLink to="/leader" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              {badge && (
                <span className="role-badge" style={{ backgroundColor: badge.color }}>
                  {badge.label}
                </span>
              )}
              <NavLink to="/profile" className="nav-user-chip" onClick={() => setMenuOpen(false)}>
                <span className="user-avatar-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="user-name-sm">{user.fullName?.split(' ')[0]}</span>
              </NavLink>
              <button onClick={handleLogout} className="btn btn--ghost btn--sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost btn--sm" onClick={() => setMenuOpen(false)}>
                Log In
              </NavLink>
              <NavLink to="/register" className="btn btn--primary btn--sm" onClick={() => setMenuOpen(false)}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

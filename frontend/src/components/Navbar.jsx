import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/book', label: 'Book Appointment' },
    { to: '/appointments', label: 'Appointments' },
  ];

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">🏥</span>
        CareSync
      </NavLink>

      {isAuthenticated && (
        <div className="navbar-nav">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}

          <div className="divider" />

          {/* User avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
            title={user?.email}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

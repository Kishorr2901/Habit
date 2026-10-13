import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="nav-brand" onClick={closeMobileMenu}>
          🌱 HabitGarden
        </Link>

        <button className="mobile-nav-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <li>
                <NavLink to="/dashboard" onClick={closeMobileMenu}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/habits" onClick={closeMobileMenu}>Habits</NavLink>
              </li>
              <li>
                <NavLink to="/garden" onClick={closeMobileMenu}>Garden</NavLink>
              </li>
              <li>
                <NavLink to="/progress" onClick={closeMobileMenu}>Progress</NavLink>
              </li>
              <li>
                <NavLink to="/achievements" onClick={closeMobileMenu}>Achievements</NavLink>
              </li>
              <li>
                <NavLink to="/profile" onClick={closeMobileMenu}>Profile</NavLink>
              </li>
              <li className="nav-user">
                <span className="nav-user-name">Hi, {user.name}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

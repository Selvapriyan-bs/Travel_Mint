import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, handleLogout, menuOpen, setMenuOpen, scrolled, activePage, simple }) {
  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : '';

  if (simple) {
    return (
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/destination" className={activePage === 'destination' ? 'active' : ''}>Destinations</Link></li>
            <li><Link to="/search" className={activePage === 'search' ? 'active' : ''}>Search</Link></li>
            <li><Link to="/Login">Login</Link></li>
          </ul>
          <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
      <div className="container nav">
        <Link to="/" className="logo">
          <i data-lucide="compass"></i> Trip<span>Agent</span>
        </Link>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
          <li><Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/destination" className={activePage === 'destination' ? 'active' : ''}>Destinations</Link></li>
          <li><Link to="/search" className={activePage === 'search' ? 'active' : ''}>Search</Link></li>
          <li><Link to="/blog" className={activePage === 'blog' ? 'active' : ''}>Blog</Link></li>
          <li><Link to="/about" className={activePage === 'about' ? 'active' : ''}>About</Link></li>
          <li><Link to="/contact" className={activePage === 'contact' ? 'active' : ''}>Contact</Link></li>
          {user && user.role === "admin" ? (
            <li><Link to="/admin">Admin Dashboard</Link></li>
          ) : null}
          {user ? (
            <li className="mobile-only-user">
              <span className="user-welcome-text">Hello, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-logout-link">Logout</button>
            </li>
          ) : (
            <li><Link to="/Login">Login</Link></li>
          )}
        </ul>
        {user && (
          <div className="user-profile-banner">
            <div className="user-text-avatar">{initialLetter}</div>
            <div className="user-info-dropdown">
              <span className="user-name">Hi, {user.name.split(' ')[0]}!</span>
              <span className="user-email-sub">{user.email}</span>
              {user.role !== 'admin' && (
                <Link to="/dashboard" className="btn-logout" style={{ textDecoration: 'none', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i data-lucide="layout"></i> Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn-logout"><i data-lucide="log-out"></i> Logout</button>
            </div>
          </div>
        )}
        <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} id="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </header>
  );
}

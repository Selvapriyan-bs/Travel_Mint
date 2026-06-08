import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Safely parse local storage registration data and establish the active logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || (parsedData.email ? parsedData.email.split('@')[0] : "User"),
          email: parsedData.email || ""
        };
      }
    } catch (error) {
      console.error("Failed to parse RegistrationData from localStorage", error);
    }
    return null;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Dynamically load Lucide CDN script to initialize the icons
    const loadLucide = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest';
        script.async = true;
        script.onload = () => {
          if (window.lucide) {
            window.lucide.createIcons();
          }
        };
        document.body.appendChild(script);
      }
    };
    loadLucide();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    navigate('/');
  };

  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  // Guard: If user is not logged in, show a beautiful lock screen
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-dark)', padding: '20px' }}>
        <title>Access Denied — TripAgent</title>
        <div className="card-premium" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '40px 30px', height: 'auto' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 24px auto' }}>
            <i data-lucide="lock" style={{ width: '32px', height: '32px' }}></i>
          </div>
          <h2 className="font-serif" style={{ marginBottom: '12px' }}>Dashboard Locked</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Please log in or register an account to view your travel dashboard, active itineraries, booking requests, and loyalty points.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Log In</Link>
            <Link to="/" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <title>My Dashboard — TripAgent</title>
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            
            <li className="mobile-only-user">
              <span className="user-welcome-text">Hello, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-logout-link">Logout</button>
            </li>
          </ul>

          <div className="nav-cta">
            <Link to="/booking" className="btn btn-primary btn-sm"><i data-lucide="calendar"></i> Book Now</Link>
          </div>
                   
          <div className="user-profile-banner">
            <div className="user-text-avatar">
              {initialLetter}
            </div>
            <div className="user-info-dropdown">
              <span className="user-name">Hi, {user.name.split(' ')[0]}!</span>
              <span className="user-email-sub">{user.email}</span>
              <button onClick={handleLogout} className="btn-logout"><i data-lucide="log-out"></i> Logout</button>
            </div>
          </div>
          
          <div
            className={`nav-toggle ${menuOpen ? 'active' : ''}`}
            id="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '40vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ margin: '0 auto' }}>
          <span className="section-tag" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>Club Explorer Member</span>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '10px' }}>Welcome back, {user.name}!</h1>
          <p style={{ marginTop: '6px' }}>Manage your booked packages, download ticket details, and check your travel points.</p>
        </div>
      </section>

      <main className="container section">
        {/* Stats Row */}
        <div className="grid-3" style={{ gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="plane"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>1</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Booked Itinerary</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="award"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>120</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Travel Reward Points</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="check-square"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>0</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Trips Completed</p>
            </div>
          </div>
        </div>

        {/* Dashboard Layout split */}
        <div className="search-layout" style={{ gridTemplateColumns: '1.3fr 0.7fr' }}>
          {/* Left Column: Bookings table */}
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Active Booking Logs</h2>
            
            <div className="card-premium" style={{ height: 'auto', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px 8px' }}>Booking ID</th>
                    <th style={{ padding: '12px 8px' }}>Destination</th>
                    <th style={{ padding: '12px 8px' }}>Departure Date</th>
                    <th style={{ padding: '12px 8px' }}>Guests</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>BK-8902</td>
                    <td style={{ padding: '16px 8px' }}>Paris Romance Package</td>
                    <td style={{ padding: '16px 8px' }}>Oct 12, 2026</td>
                    <td style={{ padding: '16px 8px' }}>2 Adults</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Approved</span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <Link to="/booking" className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Manage</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <button onClick={() => alert('PDF Ticket download started...')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.82rem' }}>
                  <i data-lucide="download"></i> Download Tickets
                </button>
                <button onClick={() => alert('Please contact support at support@tripagent.com to modify this trip.')} className="btn btn-outline btn-sm" style={{ fontSize: '0.82rem' }}>
                  <i data-lucide="edit"></i> Request Modification
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <h2 className="font-serif" style={{ fontSize: '1.6rem', marginTop: '40px', marginBottom: '16px' }}>Account Information</h2>
            <div className="card-premium" style={{ height: 'auto', padding: '24px' }}>
              <div className="grid-2" style={{ gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Full Name</p>
                  <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Registered Email</p>
                  <strong style={{ fontSize: '1.1rem' }}>{user.email}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Membership Tier</p>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>Club Explorer</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Member Since</p>
                  <strong style={{ fontSize: '1.1rem' }}>June 2026</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <aside>
            <div className="card-premium" style={{ height: 'auto', padding: '24px' }}>
              <h3 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Recommended Journeys</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Based on your interest in culture and relaxing vacations, we recommend these deals:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80" 
                    alt="Bali" 
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}><Link to="/package-detail?id=2" style={{ color: 'inherit', textDecoration: 'none' }}>Bali Tropical Paradise</Link></h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>8 Days &bull; ₹40,320</p>
                    <Link to="/package-detail?id=2" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View Itinerary &rarr;</Link>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=150&q=80" 
                    alt="Kyoto" 
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}><Link to="/package-detail?id=3" style={{ color: 'inherit', textDecoration: 'none' }}>Kyoto Cultural Heritage</Link></h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>7 Days &bull; ₹55,620</p>
                    <Link to="/package-detail?id=3" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View Itinerary &rarr;</Link>
                  </div>
                </div>
              </div>

              <Link to="/search" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Explore All Packages</Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <i data-lucide="compass"></i> Trip<span>Agent</span>
            </Link>
            <p>We are a leading online travel agency focused on curating premium, safe, and stress-free holiday packages for travelers worldwide.</p>
            <div className="social-links">
              <a href="#"><i data-lucide="facebook"></i></a>
              <a href="#"><i data-lucide="instagram"></i></a>
              <a href="#"><i data-lucide="twitter"></i></a>
              <a href="#"><i data-lucide="youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destination">Destinations</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Top Destinations</h3>
            <ul>
              <li><a href="#">Paris, France</a></li>
              <li><a href="#">Bali, Indonesia</a></li>
              <li><a href="#">Kyoto, Japan</a></li>
              <li><a href="#">New York, USA</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Newsletter</h3>
            <p>Subscribe to get our weekly travel guides and exclusive members-only deals.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
              <input type="email" placeholder="Your Email Address" required />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 TripAgent. All rights reserved. Built with love for travel.</p>
          <p>Terms of Service &bull; Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Form fields state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Dynamically load Lucide CDN script to initialize icons
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
    }, [menuOpen]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
    const registrationData = localStorage.getItem('RegistrationData');
        if (registrationData) {
            const { email: registeredEmail, password: registeredPassword } = JSON.parse(registrationData);
            if (email === registeredEmail && password === registeredPassword) {
                alert("Login successful!");
            } else {
                alert("Invalid email or password.");
            }
        } else {
            alert("No registered account found.");
        }
    };

    return (
      <div>
        <title>Login — TripAgent</title>
        <meta name="description" content="Log in to your TripAgent account to manage bookings, explore custom itineraries, and view saved trips." />
        <link rel="stylesheet" href="assets/css/style.css" />
        
        {/* */}
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
              <li><Link to="/Log" className="active">Login</Link></li>
            </ul>
            <div className="nav-cta">
              <Link to="/booking" className="btn btn-primary btn-sm"><i data-lucide="calendar"></i> Book Now</Link>
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

        {/* */}
        <section className="hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')" }}></div>
          <div className="hero-overlay" style={{ opacity: 0.65 }}></div>
          
          {/* */}
          <div className="container animate-fade-in" style={{ zIndex: 2, display: 'flex', justifyContent: 'center', margin: '120px auto 60px auto' }}>
            <div className="card-premium" style={{ width: '100%', maxWidth: '450px', background: 'rgba(255, 255, 255, 0.95)', color: '#111', padding: '40px 30px', border: 'none' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ color: 'var(--color-primary, #0ea5e9)', fontSize: '2.5rem', marginBottom: '10px' }}>
                  <i data-lucide="user-check" style={{ width: '48px', height: '48px' }}></i>
                </div>
                <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#1a1a1a' }}>Welcome Back</h2>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>Log in to access your dashboard and bookings</p>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Email Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="login-email" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Email Address</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="mail" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input 
                      id="login-email"
                      type="email" 
                      placeholder="alex@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="login-password" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="lock" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input 
                      id="login-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                    />
                  </div>
                </div>

                {/* Form Meta Links */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#555' }}>
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    /> Remember me
                  </label>
                  <a href="#forgot" style={{ color: 'var(--color-primary, #0ea5e9)', textDecoration: 'none', fontWeight: '500' }}>Forgot Password?</a>
                </div>

                {/* Action Submit Button */}
                <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '10px' }}>
                  Sign In <i data-lucide="arrow-right" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
                </button>

              </form>

              {/* Sign Up Redirect link */}
              <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#666' }}>
                Don't have an account? <Link to="/Register" style={{ color: 'var(--color-primary, #0ea5e9)', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
              </div>

            </div>
          </div>
        </section>

        {/* */}
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
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Destination() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role,setRole]=useState("");

  // Login input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || parsedData.email.split('@')[0],
          email: parsedData.email,
          role:parsedData.role || 'user',
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };

  // Helper variable to pull the starting letter cleanly
  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";
  return (
    <div>
      <title>Top Destinations — TripAgent</title>
      <meta name="description" content="Explore TripAgent's curated handpicked travel destinations including Paris, Bali, Kyoto, New York, Sydney, and the Swiss Alps." />
      {/* <link rel="stylesheet" href="assets/css/style.css" /> */}

      {/* <!-- Header --> */}
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination" className="active">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {user && user.role === "admin" ? (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
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
          <div className="nav-cta">
            <Link to="/booking" className="btn btn-primary btn-sm"><i data-lucide="calendar"></i> Book Now</Link>
          </div>
          {user && (
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
          )}
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

      {/* <!-- Hero Section --> */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Explore Top Destinations</h1>
          <p>Discover hand-picked places for your next unforgettable adventure, backed by local guides and premium support.</p>
        </div>
      </section>

      {/* <!-- Destinations Grid --> */}
      <main className="section container">
        <div className="grid-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* <!-- Destination 1: Paris --> */}
          <div className="card-premium">
            <div className="card-badge-left">Featured</div>
            <div className="card-badge"><i data-lucide="clock"></i> 6 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" alt="Paris, France" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> France</span>
                <span><i data-lucide="star"></i> 4.9 (1,240 reviews)</span>
              </div>
              <h3>Paris, France</h3>
              <p>Wander down the Seine, visit world-renowned galleries, enjoy fresh croissants at corner bistros, and admire the majestic architecture.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;40,500 <span>/ person</span></div>
                <Link to="/booking?destination=paris" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          {/* <!-- Destination 2: Bali --> */}
          <div className="card-premium">
            <div className="card-badge-left">Best Seller</div>
            <div className="card-badge"><i data-lucide="clock"></i> 8 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" alt="Bali, Indonesia" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> Indonesia</span>
                <span><i data-lucide="star"></i> 4.85 (940 reviews)</span>
              </div>
              <h3>Bali, Indonesia</h3>
              <p>Unwind in private villas nestled in rainforest canopy, surf warm breaks, explore ancient volcanic shrines, and restore body and mind.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;30,654 <span>/ person</span></div>
                <Link to="/booking?destination=bali" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          {/* <!-- Destination 3: Kyoto --> */}
          <div className="card-premium">
            <div className="card-badge-left">Trending</div>
            <div className="card-badge"><i data-lucide="clock"></i> 7 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" alt="Kyoto, Japan" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> Japan</span>
                <span><i data-lucide="star"></i> 4.92 (810 reviews)</span>
              </div>
              <h3>Kyoto, Japan</h3>
              <p>Immerse yourself in Zen rock gardens, golden pavilions, vermilion torii gates, and unforgettable traditional culinary experiences.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;30,450 <span>/ person</span></div>
                <Link to="/booking?destination=kyoto" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          {/* <!-- Destination 4: New York --> */}
          <div className="card-premium">
            <div className="card-badge-left">Seasonal</div>
            <div className="card-badge"><i data-lucide="clock"></i> 5 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" alt="New York, USA" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> USA</span>
                <span><i data-lucide="star"></i> 4.76 (1,050 reviews)</span>
              </div>
              <h3>New York City, USA</h3>
              <p>Catch a Broadway play, walk across the Brooklyn Bridge, shop along Fifth Avenue, and take in the panoramic skyline from top decks.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;64,100 <span>/ person</span></div>
                <Link to="/booking?destination=newyork" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          {/* <!-- Destination 5: Sydney --> */}
          <div className="card-premium">
            <div className="card-badge-left">Explore</div>
            <div className="card-badge"><i data-lucide="clock"></i> 9 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80" alt="Sydney, Australia" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> Australia</span>
                <span><i data-lucide="star"></i> 4.88 (620 reviews)</span>
              </div>
              <h3>Sydney, Australia</h3>
              <p>Sail past the Opera House, sunbathe on Bondi Beach, explore the historic Rocks district, and escape into the Blue Mountains.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;45,850 <span>/ person</span></div>
                <Link to="/booking?destination=sydney" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>

          {/* <!-- Destination 6: Swiss Alps --> */}
          <div className="card-premium">
            <div className="card-badge-left">Luxury</div>
            <div className="card-badge"><i data-lucide="clock"></i> 7 Days</div>
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" alt="Swiss Alps, Switzerland" />
            </div>
            <div className="card-premium-content">
              <div className="card-meta">
                <span><i data-lucide="map-pin"></i> Switzerland</span>
                <span><i data-lucide="star"></i> 4.95 (510 reviews)</span>
              </div>
              <h3>Swiss Alps, Switzerland</h3>
              <p>Breathe the crisp mountain air, ski down world-class runs, relax in thermal baths, and ride scenic glass-domed cog railways.</p>
              <div className="card-footer">
                <div className="card-price">&#8377;32,699 <span>/ person</span></div>
                <Link to="/booking?destination=alps" className="btn btn-outline btn-sm">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Footer --> */}
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

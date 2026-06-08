import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Login input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [role,setRole]=useState("");
  // Safely parse local storage registration data and establish the active logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        // Fallback to extraction from email if name wasn't explicitly saved
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

  // Re-run createIcons when state changes (e.g. mobile menu toggle, user login toggle)
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };

  // Helper variable to pull the starting letter cleanly
  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div>
      <link rel="stylesheet" href="App.css" />
      <title>TripAgent — Explore the World with Confidence</title>
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/" className="active">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
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
            {/* Conditional Authentication Menu Items */}
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

          {/* Desktop Logged-in Banner using Starting Letter Profile Icon */}
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <h1 className="font-serif">Explore the World <br />With Confidence</h1>
          <p>Find the best curated packages, flights, and luxury stays. Crafted meticulously for your unique travel style.</p>
          <Link to="/destination" className="btn btn-secondary btn-lg">Explore Destinations <i data-lucide="arrow-right"></i></Link>
        </div>
      </section>

      {/* Floating Search Widget */}
      <div className="container">
        <div className="search-widget animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form action="search.html" method="GET">
            <div className="form-group-custom">
              <label><i data-lucide="map-pin"></i> Where to?</label>
              <div className="input-with-icon">
                <i data-lucide="search"></i>
                <select name="destination" required defaultValue="">
                  <option value="" disabled>Search destination...</option>
                  <option value="paris">Paris, France</option>
                  <option value="bali">Bali, Indonesia</option>
                  <option value="kyoto">Kyoto, Japan</option>
                  <option value="newyork">New York, USA</option>
                  <option value="sydney">Sydney, Australia</option>
                </select>
              </div>
            </div>
            <div className="form-group-custom">
              <label><i data-lucide="calendar"></i> When?</label>
              <div className="input-with-icon">
                <i data-lucide="calendar-days"></i>
                <input type="date" name="departure" required />
              </div>
            </div>
            <div className="form-group-custom">
              <label><i data-lucide="users"></i> Travel Type</label>
              <div className="input-with-icon">
                <i data-lucide="user-check"></i>
                <select name="type" defaultValue="family">
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family Vacation</option>
                  <option value="group">Group Adventure</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn-submit">
                <i data-lucide="search"></i> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <main>
        {/* Featured Destinations Section */}
        <section className="section container" id="popular-destinations">
          <div className="section-header">
            <h2>Trending Destinations</h2>
            <p>Hand-picked global spots that are currently trending among our premium club members.</p>
          </div>
          <div className="grid-3">
            {/* Destination 1 */}
            <div className="card-premium">
              <div className="card-badge-left">Featured</div>
              <div className="card-badge"><i data-lucide="clock"></i> 6 Days</div>
              <div className="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" alt="Paris, France" />
              </div>
              <div className="card-premium-content">
                <div className="card-meta">
                  <span><i data-lucide="map-pin"></i> France</span>
                  <span><i data-lucide="star"></i> 4.9 (1.2k reviews)</span>
                </div>
                <h3>Paris, France</h3>
                <p>Experience the romantic city of lights, world-class art at the Louvre, café culture, and the iconic Eiffel Tower views.</p>
                <div className="card-footer">
                  <div className="card-price">&#8377;10,299<span>/ person</span></div>
                  <Link to="/booking?destination=paris" className="btn btn-outline btn-sm">Book Trip</Link>
                </div>
              </div>
            </div>

            {/* Destination 2 */}
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
                <p>Indulge in spiritual temples, lush emerald rice terraces, pristine beaches, and luxurious oceanfront resorts.</p>
                <div className="card-footer">
                  <div className="card-price">&#8377;9,490 <span>/ person</span></div>
                  <Link to="/booking?destination=bali" className="btn btn-outline btn-sm">Book Trip</Link>
                </div>
              </div>
            </div>

            {/* Destination 3 */}
            <div className="card-premium">
              <div className="card-badge-left">Recommended</div>
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
                <p>Step back in time through historic wooden temples, quiet bamboo groves, colorful shrines, and traditional tea ceremonies.</p>
                <div className="card-footer">
                  <div className="card-price">&#8377;14,500 <span>/ person</span></div>
                  <Link to="/booking?destination=kyoto" className="btn btn-outline btn-sm">Book Trip</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us / Services Section */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Why Travel With Us?</h2>
              <p>We craft perfect journeys designed to offer safety, excitement, and memory-making luxury.</p>
            </div>
            <div className="grid-3">
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="globe"></i>
                </div>
                <h3>Handpicked Itineraries</h3>
                <p>Every destination package is designed and inspected by local travel specialists to ensure absolute perfection.</p>
              </div>
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="shield-check"></i>
                </div>
                <h3>100% Secure Payments</h3>
                <p>Our payment systems use end-to-end industry leading encryption. Your data and tickets are fully secured.</p>
              </div>
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="headset"></i>
                </div>
                <h3>24/7 Premium Support</h3>
                <p>We are with you every step of the way. Call, chat, or email us anytime, from anywhere in the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section container">
          <div className="section-header">
            <h2>What Our Travelers Say</h2>
            <p>Read inspiring stories from our valued club members about their unforgettable journeys.</p>
          </div>
          <div className="grid-3">
            <div className="testimonial-card">
              <span className="quote-icon">“</span>
              <div className="testimonial-rating">
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
              </div>
              <p className="testimonial-text">"Our trip to Kyoto was flawless! The hotel was stunning, and the private guides recommended by TripAgent were extremely knowledgeable. Highly recommend!"</p>
              <div className="testimonial-user">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Sarah Jenkins" />
                <div className="testimonial-user-info">
                  <h4>Sarah Jenkins</h4>
                  <p>Visited Kyoto, Japan</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <span className="quote-icon">“</span>
              <div className="testimonial-rating">
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
              </div>
              <p className="testimonial-text">"Booking through TripAgent was incredibly smooth. They handled flights, local transport, and hotels. The customer support answered our questions in minutes."</p>
              <div className="testimonial-user">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Marcus Chen" />
                <div className="testimonial-user-info">
                  <h4>Marcus Chen</h4>
                  <p>Visited Bali, Indonesia</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <span className="quote-icon">“</span>
              <div className="testimonial-rating">
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
                <i data-lucide="star"></i>
              </div>
              <p className="testimonial-text">"Perfect itinerary! Paris is beautiful but having everything planned out took away all the stress. We will definitely book our next summer trip here!"</p>
              <div className="testimonial-user">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="Emma Watson" />
                <div className="testimonial-user-info">
                  <h4>Emma Watson</h4>
                  <p>Visited Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </section>
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
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const destinationsData = {
  paris: { name: "Paris, France", price: 1299, days: 6 },
  bali: { name: "Bali, Indonesia", price: 949, days: 8 },
  kyoto: { name: "Kyoto, Japan", price: 1450, days: 7 },
  newyork: { name: "New York, USA", price: 1100, days: 5 },
  sydney: { name: "Sydney, Australia", price: 1850, days: 9 },
  alps: { name: "Swiss Alps, Switzerland", price: 1699, days: 7 }
};

export default function Booking() {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Centralized Form State
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    from: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    guests: "1", // Initialized as string to match dropdown values safely
  });

  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || parsedData.email.split('@')[0],
          email: parsedData.email
        };
      }
    } catch (error) {
      console.error("Failed to parse RegistrationData from localStorage", error);
    }
    return null;
  });

  // Parse query parameter to pre-select destination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destParam = params.get('destination');
    if (destParam && destinationsData[destParam.toLowerCase()]) {
      setDetails(prev => ({
        ...prev,
        destination: destParam.toLowerCase()
      }));
    }
  }, [location]);

  // Fixed the event targets safely
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
  }, [details.destination, details.guests, menuOpen]);

  // Derived Summary calculations
  const selectedDest = destinationsData[details.destination];
  const destName = selectedDest ? selectedDest.name : "—";
  const duration = selectedDest ? `${selectedDest.days} Days` : "—";
  const guestCount = parseInt(details.guests, 10) || 1;
  const pricePerPerson = selectedDest ? selectedDest.price : 0;
  const totalPrice = pricePerPerson * guestCount;

  // Closed this handler block correctly
  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/booking/add", details);
      alert(res.data.message || "Details Received");
    } catch (error) {
      setDetails({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        from: "",
        destination: "",
        departureDate: "",
        returnDate: "",
        guests: "1",
      });
      alert(error.response?.data?.message || "Details storage failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };

  // Helper variable to pull the starting letter cleanly
  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div>
      <title>Book Your Journey — TripAgent</title>

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
            <li><Link to="/booking" className="active">Booking</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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

      {/* */}
      <section className="hero" style={{ minHeight: '40vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Book Your Dream Trip</h1>
          <p>Confirm details in minutes. Our team will coordinate your accommodation, transfers, and activities.</p>
        </div>
      </section>

      {/* */}
      <main className="container section">
        <div className="booking-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* */}
          <section className="booking-form-card">
            <h2>Enter Passenger & Trip Details</h2>
            <form id="bookingForm" onSubmit={handleBookingSubmit}>
              <div className="form-grid">
                <div className="form-col-full">
                  <label htmlFor="firstName"><i data-lucide="user"></i> First Name</label>
                  <div className="row g-3">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={details.firstName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="First name"
                      aria-label="First name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName"><i data-lucide="user"></i> Last Name</label>
                  <div className="row g-3">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={details.lastName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Last name"
                      aria-label="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email"><i data-lucide="mail"></i> Email Address</label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={details.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone"><i data-lucide="phone"></i> Phone Number</label>
                  <div className="input-with-icon">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+(Country code)(number)"
                      value={details.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-col-full">
                  <label htmlFor="from"><i data-lucide="map-pin"></i> From</label>
                  <div className="input-with-icon">
                    <select
                      id="from"
                      name="from"
                      value={details.from}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select From</option>
                      <option value="paris">Paris, France ($1,299)</option>
                      <option value="bali">Bali, Indonesia ($949)</option>
                      <option value="kyoto">Kyoto, Japan ($1,450)</option>
                      <option value="newyork">New York, USA ($1,100)</option>
                      <option value="sydney">Sydney, Australia ($1,850)</option>
                      <option value="alps">Swiss Alps, Switzerland ($1,699)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="destination"><i data-lucide="map-pin"></i> Destination</label>
                  <div className="input-with-icon">
                    <select
                      id="destination"
                      name="destination"
                      value={details.destination}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Destination</option>
                      <option value="paris">Paris, France ($1,299)</option>
                      <option value="bali">Bali, Indonesia ($949)</option>
                      <option value="kyoto">Kyoto, Japan ($1,450)</option>
                      <option value="newyork">New York, USA ($1,100)</option>
                      <option value="sydney">Sydney, Australia ($1,850)</option>
                      <option value="alps">Swiss Alps, Switzerland ($1,699)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="departure"><i data-lucide="calendar"></i> Departure Date</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="departure"
                      name="departureDate"
                      value={details.departureDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="return"><i data-lucide="calendar"></i> Return Date</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      id="return"
                      name="returnDate"
                      value={details.returnDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-col-full">
                  <label htmlFor="guests"><i data-lucide="users"></i> Number of Guests</label>
                  <div className="input-with-icon">
                    <select
                      id="guests"
                      name="guests"
                      value={details.guests}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5">5+ Travelers</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* */}
          <aside className="booking-summary-card">
            <h3>Trip Summary</h3>
            <ul className="summary-list">
              <li>
                <div className="label"><i data-lucide="map"></i> Destination</div>
                <div className="value" id="summaryDestination">{destName}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="clock"></i> Duration</div>
                <div className="value" id="summaryDuration">{duration}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="users"></i> Travelers</div>
                <div className="value" id="summaryGuests">{guestCount} Traveler{guestCount > 1 ? 's' : ''}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="ticket"></i> Inclusions</div>
                <div className="value" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>Flights, Hotels, Tours</div>
              </li>
            </ul>
            <div className="summary-total">
              <div className="total-label">Estimated Total</div>
              <div className="total-price" id="summaryTotal">&#8377;{totalPrice.toLocaleString()}</div>
            </div>
            <button type="submit" form="bookingForm" className="btn btn-book">
              Confirm & Pay <i data-lucide="credit-card"></i>
            </button>
          </aside>
        </div>
      </main>

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
          <div className="container footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destination">Destinations</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/booking">Booking</Link></li>
            </ul>
          </div>
          <div className="container footer-col">
            <h3>Top Destinations</h3>
            <ul>
              <li><a href="#">Paris, France</a></li>
              <li><a href="#">Bali, Indonesia</a></li>
              <li><a href="#">Kyoto, Japan</a></li>
              <li><a href="#">New York, USA</a></li>
            </ul>
          </div>
          <div className="container footer-col">
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
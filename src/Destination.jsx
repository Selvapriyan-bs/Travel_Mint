import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function Destination() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [packages, setPackages] = useState([]);

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
    const fetchData = async () => {
      try {
        const response = await axios.get("https://trip-agent-backend.onrender.com/api/package");
        if (response) {
          let incomingData = response.data;
          if (!Array.isArray(incomingData) && typeof incomingData === 'object') {
            incomingData = incomingData.package || incomingData.packages || incomingData.data || [];
          }
          if (Array.isArray(incomingData)) {
            setPackages(incomingData);
          } else {
            console.error("Data received is not an array:", response.data);
            setPackages([]);
          }
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, packages]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };


  return (
    <div>
      <title>Top Destinations — TripAgent</title>
      <meta name="description" content="Explore TripAgent's curated handpicked travel destinations including Paris, Bali, Kyoto, New York, Sydney, and the Swiss Alps." />
      {/* <link rel="stylesheet" href="assets/css/style.css" /> */}

      {/* <!-- Header --> */}
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="destination" />

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
          {packages.map(pkg => (
            <div className="card-premium" key={pkg.id}>
              {pkg.badge && <div className="card-badge-left">{pkg.badge}</div>}
              <div className="card-badge"><i data-lucide="clock"></i> {pkg.days} Days</div>
              <div className="card-img-wrapper">
                <img src={pkg.image} alt={pkg.destination} />
              </div>
              <div className="card-premium-content">
                <div className="card-meta">
                  <span><i data-lucide="map-pin"></i> {pkg.country}</span>
                  <span><i data-lucide="star"></i> {pkg.rating} ({pkg.reviews} reviews)</span>
                </div>
                <h3>{pkg.title || pkg.destination}</h3>
                <p>{pkg.description}</p>
                <div className="card-footer">
                  <div className="card-price">&#8377;{(pkg.price ?? 0).toLocaleString()} <span>/ person</span></div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-outline btn-sm">Details</Link>
                    <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-outline btn-sm">Book Now</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <i data-lucide="frown" style={{ width: '48px', height: '48px', marginBottom: '16px', color: 'var(--text-muted)' }}></i>
              <p>No destinations available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

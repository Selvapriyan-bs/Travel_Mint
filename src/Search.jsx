import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// const allPackages = [
//   {
//     id: 1,
//     title: "Paris Romance Package",
//     destination: "Paris, France",
//     region: "Europe",
//     country: "France",
//     price: 32050,
//     days: 6,
//     rating: 4.9,
//     reviews: "1.2k",
//     badge: "Featured",
//     description: "Spend six dreamy days walking down historic avenues, cruising the Seine, and visiting magnificent galleries.",
//     image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
//   },
//   {
//     id: 2,
//     title: "Bali Tropical Paradise",
//     destination: "Bali, Indonesia",
//     region: "Asia",
//     country: "Indonesia",
//     price: 40320,
//     days: 8,
//     rating: 4.85,
//     reviews: "940",
//     badge: "Best Seller",
//     description: "Explore lush sacred forests, rest at luxurious private villas, and enjoy world-class beaches and local food.",
//     image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
//   },
//   {
//     id: 3,
//     title: "Kyoto Cultural Heritage",
//     destination: "Kyoto, Japan",
//     region: "Asia",
//     country: "Japan",
//     price: 55620,
//     days: 7,
//     rating: 4.92,
//     reviews: "810",
//     badge: "Trending",
//     description: "Immerse yourself in traditional temples, gorgeous tea houses, and tranquil bamboo trails in historic Kyoto.",
//     image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
//   },
//   {
//     id: 4,
//     title: "New York City Explorer",
//     destination: "New York, USA",
//     region: "Americas",
//     country: "USA",
//     price: 60520,
//     days: 5,
//     rating: 4.76,
//     reviews: "1,050",
//     badge: "Seasonal",
//     description: "Catch a Broadway play, walk across the Brooklyn Bridge, shop along Fifth Avenue, and take in the panoramic skyline from top decks.",
//     image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80"
//   },
//   {
//     id: 5,
//     title: "Sydney Harbour Experience",
//     destination: "Sydney, Australia",
//     region: "Oceania",
//     country: "Australia",
//     price: 56052,
//     days: 9,
//     rating: 4.88,
//     reviews: "620",
//     badge: "Explore",
//     description: "Sail past the Opera House, sunbathe on Bondi Beach, explore the historic Rocks district, and escape into the Blue Mountains.",
//     image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80"
//   },
//   {
//     id: 6,
//     title: "Swiss Alps Luxury Adventure",
//     destination: "Swiss Alps, Switzerland",
//     region: "Europe",
//     country: "Switzerland",
//     price: 69000,
//     days: 7,
//     rating: 4.95,
//     reviews: "510",
//     badge: "Luxury",
//     description: "Breathe the crisp mountain air, ski down world-class runs, relax in thermal baths, and ride scenic glass-domed cog railways.",
//     image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
//   }
// ];


export default function Search() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allPackages, setPackage] = useState([])
  // Login input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const fetchData = async()=>{
      try{
    const response = await axios.get("http://localhost:5000/api/package");
    if (response) {
      setPackage(response.data);
    }
    else {
      alert("error couldn't find the details");
    }
  }
  catch(err){
    console.error("API error:", err);
  }
  };
  fetchData();
},[])
  // Safely parse local storage registration data and establish the active logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        // Fallback to extraction from email if name wasn't explicitly saved
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
  const handleLogout = () => {
    setUser(null);
    // localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };

  // Helper variable to pull the starting letter cleanly
  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState({
    Europe: true,
    Asia: true,
    Americas: true,
    Oceania: true
  });
  const [selectedPrices, setSelectedPrices] = useState({
    under1000: false,
    middle1000to1500: false,
    above1500: false
  });
  const [selectedDurations, setSelectedDurations] = useState({
    short1to5: false,
    medium6to8: false,
    long9plus: false
  });
  const [sortBy, setSortBy] = useState("Most Popular");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Dynamically load Lucide CDN script to initialize icons
    const loadLucide = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      } else {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/lucide@latest";
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
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update icons when search matches/state changes
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [searchQuery, selectedRegions, selectedPrices, selectedDurations, sortBy, menuOpen]);

  // Handle region checkbox changes
  const handleRegionChange = (region) => {
    setSelectedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  // Handle price checkbox changes
  const handlePriceChange = (range) => {
    setSelectedPrices(prev => ({
      ...prev,
      [range]: !prev[range]
    }));
  };

  // Handle duration checkbox changes
  const handleDurationChange = (range) => {
    setSelectedDurations(prev => ({
      ...prev,
      [range]: !prev[range]
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRegions({
      Europe: true,
      Asia: true,
      Americas: true,
      Oceania: true
    });
    setSelectedPrices({
      under1000: false,
      middle1000to1500: false,
      above1500: false
    });
    setSelectedDurations({
      short1to5: false,
      medium6to8: false,
      long9plus: false
    });
    setSortBy("Most Popular");
  };

  // Filtering Logic
  const filteredPackages = allPackages.filter(pkg => {
    // 1. Keyword search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pkg.title.toLowerCase().includes(q);
      const matchDesc = pkg.description.toLowerCase().includes(q);
      const matchDest = pkg.destination.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDest) return false;
    }

    // 2. Region match
    const anyRegionSelected = Object.values(selectedRegions).some(Boolean);
    if (anyRegionSelected && !selectedRegions[pkg.region]) {
      return false;
    }

    // 3. Price match
    const anyPriceSelected = Object.values(selectedPrices).some(Boolean);
    if (anyPriceSelected) {
      let priceMatch = false;

      const currentPrice = Number(pkg.price);

      if (selectedPrices.under1000 && currentPrice< 1000) priceMatch = true;
      if (selectedPrices.middle1000to1500 && currentPrice >= 1000 && currentPrice <= 1500) priceMatch = true;
      if (selectedPrices.above1500 && currentPrice > 1500) priceMatch = true;
      if (!priceMatch) return false;
    }

    // 4. Duration match
    const anyDurationSelected = Object.values(selectedDurations).some(Boolean);
    if (anyDurationSelected) {
      let durationMatch = false;
      const suday= Number(pkg.days)
      if (selectedDurations.short1to5 && suday <= 5) durationMatch = true;
      if (selectedDurations.medium6to8 && suday >= 6 && pkg.days <= 8) durationMatch = true;
      if (selectedDurations.long9plus && suday >= 9) durationMatch = true;
      if (!durationMatch) return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    return a.id - b.id; // Defaults to ID order for Most Popular
  });

  return (
    <div>
      <title>Search Packages — TripAgent</title>

      {/* <!-- Header --> */}
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search" className="active">Search</Link></li>
            <li><Link to="/booking">Booking</Link></li>
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
      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Find Your Perfect Trip</h1>
          <p>Filter by price, duration, and reviews to discover packages designed just for you.</p>
        </div>
      </section>

      {/* <!-- Search Layout Section --> */}
      <main className="container section">
        <div className="search-layout">
          {/* <!-- Left Filters Sidebar --> */}
          <aside className="filter-sidebar animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="filter-section">
              <h4>Keywords <i data-lucide="search" style={{ width: '16px', height: '16px', color: 'var(--primary)' }}></i></h4>
              <div className="input-with-icon">
                <i data-lucide="search"></i>
                <input
                  type="text"
                  placeholder="e.g. beach, temple..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '10px 10px 10px 38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-alt)', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="filter-section">
              <h4>Destinations</h4>
              <div className="filter-checkboxes">
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedRegions.Europe} onChange={() => handleRegionChange("Europe")} />
                  <span>Europe</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedRegions.Asia} onChange={() => handleRegionChange("Asia")} />
                  <span>Asia</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedRegions.Americas} onChange={() => handleRegionChange("Americas")} />
                  <span>Americas</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedRegions.Oceania} onChange={() => handleRegionChange("Oceania")} />
                  <span>Oceania</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Price Budget</h4>
              <div className="filter-checkboxes">
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.under1000} onChange={() => handlePriceChange("under1000")} />
                  <span>Under &#8377;30,000</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.middle1000to1500} onChange={() => handlePriceChange("middle1000to1500")} />
                  <span>&#8377;56,000 - &#8377;45,500</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.above1500} onChange={() => handlePriceChange("above1500")} />
                  <span>Above &#8377;43,500</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Duration</h4>
              <div className="filter-checkboxes">
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedDurations.short1to5} onChange={() => handleDurationChange("short1to5")} />
                  <span>1 - 5 Days</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedDurations.medium6to8} onChange={() => handleDurationChange("medium6to8")} />
                  <span>6 - 8 Days</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedDurations.long9plus} onChange={() => handleDurationChange("long9plus")} />
                  <span>9+ Days</span>
                </label>
              </div>
            </div>

            <button onClick={handleResetFilters} className="btn btn-outline" style={{ width: '100%', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', padding: '10px 16px', marginTop: '10px' }}>
              Reset Filters
            </button>
          </aside>

          {/* <!-- Right Results Area --> */}
          <section className="search-results animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="search-results-info">
              <h3>{sortedPackages.length} Package{sortedPackages.length === 1 ? '' : 's'} Matching Filters</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              {sortedPackages.map(pkg => (
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
                    <h3>{pkg.title}</h3>
                    <p>{pkg.description}</p>
                    <div className="card-footer">
                      <div className="card-price">&#8377;{pkg.price.toLocaleString()} <span>/ person</span></div>
                      <Link to={`/booking?destination=${pkg.id === 1 ? 'paris' : pkg.id === 2 ? 'bali' : pkg.id === 3 ? 'kyoto' : pkg.id === 4 ? 'newyork' : pkg.id === 5 ? 'sydney' : 'alps'}`} className="btn btn-outline btn-sm">Book Deal</Link>
                    </div>
                  </div>
                </div>
              ))}
              {sortedPackages.length === 0 && (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <i data-lucide="frown" style={{ width: '48px', height: '48px', marginBottom: '16px', color: 'var(--text-muted)' }}></i>
                  <p>No holiday packages match your current filter settings. Try adjusting or resetting your filters.</p>
                </div>
              )}
            </div>
          </section>
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
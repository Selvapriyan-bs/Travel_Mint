import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from './Components/SnackbarProvider';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

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
  const showSnackbar = useSnackbar();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allPackages, setPackage] = useState([])
  const [countryShowAll, setCountryShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://trip-agent-backend.onrender.com/api/package");
        if (response) {
          let incomingData = response.data;

          // If the backend wrapped it inside an object property (e.g., { packages: [...] })
          if (!Array.isArray(incomingData) && typeof incomingData === 'object') {
            incomingData = incomingData.package || incomingData.packages || incomingData.data || [];
          }
          if (Array.isArray(incomingData)) {
            setPackage(incomingData);
          } else {
            console.error("Data received is not an array:", response.data);
            setPackage([]); // Safe fallback to avoid UI crash
          }
        }
        else {
          showSnackbar("error couldn't find the details", "error");
        }
      }
      catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, [showSnackbar])
  // Safely parse local storage registration data and establish the active logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        // Fallback to extraction from email if name wasn't explicitly saved
        return {
          name: parsedData.name || (parsedData.email ? parsedData.email.split('@')[0] : "User"),
          email: parsedData.email || "",
            role:parsedData.role || 'user',
        };
      }
    } catch (error) {
      console.error("Failed to parse RegistrationData from localStorage", error);
    }
    return null;
  });
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    // sessionStorage.removeItem('RegistrationData');
  };


  const countries = [...new Set(allPackages.map(p => p.country).filter(Boolean))].sort();
  const displayedCountries = countryShowAll ? countries : countries.slice(0, 5);
  const handleSelectAllCountries = () => {
    const allChecked = Object.values(selectedCountries).every(Boolean);
    const updated = {};
    countries.forEach(c => { updated[c] = !allChecked; });
    setSelectedCountries(updated);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState({});
  useEffect(() => {
    if (countries.length > 0) {
      setSelectedCountries(prev => {
        const next = {};
        countries.forEach(c => { next[c] = true; });
        if (Object.keys(prev).length !== countries.length) return next;
        return prev;
      });
    }
  }, [allPackages]);

  const [selectedPrices, setSelectedPrices] = useState({
    under35000: false,
    middle35000to50000: false,
    middle50000to65000: false,
    above65000: false
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
  }, [searchQuery, selectedCountries, selectedPrices, selectedDurations, sortBy, menuOpen]);

  // Handle country checkbox changes
  const handleCountryChange = (country) => {
    setSelectedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
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
    const allCountries = {};
    countries.forEach(c => { allCountries[c] = true; });
    setSelectedCountries(allCountries);
    setSelectedPrices({
      under35000: false,
      middle35000to50000: false,
      middle50000to65000: false,
      above65000: false
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

    // 2. Country match
    const anyCountrySelected = Object.values(selectedCountries).some(Boolean);
    if (anyCountrySelected && !selectedCountries[pkg.country]) {
      return false;
    }

    // 3. Price match
    const anyPriceSelected = Object.values(selectedPrices).some(Boolean);
    if (anyPriceSelected) {
      let priceMatch = false;

      const currentPrice = Number(pkg.price);

      if (selectedPrices.under35000 && currentPrice < 35000) priceMatch = true;
      if (selectedPrices.middle35000to50000 && currentPrice >= 35000 && currentPrice < 50000) priceMatch = true;
      if (selectedPrices.middle50000to65000 && currentPrice >= 50000 && currentPrice < 65000) priceMatch = true;
      if (selectedPrices.above65000 && currentPrice >= 65000) priceMatch = true;
      if (!priceMatch) return false;
    }

    // 4. Duration match
    const anyDurationSelected = Object.values(selectedDurations).some(Boolean);
    if (anyDurationSelected) {
      let durationMatch = false;
      const suday = Number(pkg.days)
      if (selectedDurations.short1to5 && suday <= 5) durationMatch = true;
      if (selectedDurations.medium6to8 && suday >= 6 && suday <= 8) durationMatch = true;
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
      <title>Search Packages — TravelMint</title>

      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="search" />

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0 }}>Country</h4>
                <button
                  type="button"
                  onClick={handleSelectAllCountries}
                  style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-alt)', cursor: 'pointer', color: 'inherit' }}
                >
                  {Object.values(selectedCountries).every(Boolean) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="filter-checkboxes">
                {displayedCountries.map(country => (
                  <label key={country} className="checkbox-group">
                    <input type="checkbox" checked={selectedCountries[country] ?? true} onChange={() => handleCountryChange(country)} />
                    <span>{country}</span>
                  </label>
                ))}
              </div>
              {countries.length > 5 && (
                <button
                  type="button"
                  onClick={() => setCountryShowAll(!countryShowAll)}
                  style={{ fontSize: '0.8rem', padding: '4px 0', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, marginTop: '8px' }}
                >
                  {countryShowAll ? 'Show Less' : `Show More (${countries.length - 5} more)`}
                </button>
              )}
            </div>

            <div className="filter-section">
              <h4>Price Budget</h4>
              <div className="filter-checkboxes">
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.under35000} onChange={() => handlePriceChange("under35000")} />
                  <span>Under &#8377;35,000</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.middle35000to50000} onChange={() => handlePriceChange("middle35000to50000")} />
                  <span>&#8377;35,000 - &#8377;50,000</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.middle50000to65000} onChange={() => handlePriceChange("middle50000to65000")} />
                  <span>&#8377;50,000 - &#8377;65,000</span>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" checked={selectedPrices.above65000} onChange={() => handlePriceChange("above65000")} />
                  <span>Above &#8377;65,000</span>
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
                      <div className="card-price">&#8377;{(pkg.price ?? 0).toLocaleString()} <span>/ person</span></div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-outline btn-sm">Details</Link>
                        <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-outline btn-sm">Book Deal</Link>
                      </div>
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

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const initialBlogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Paris Only Locals Know About",
    category: "Guides",
    readTime: "5 min read",
    date: "June 2, 2026",
    summary: "Skip the long lines at the Eiffel Tower and explore these quiet secret courtyards, underground canals, and rooftop view bistros.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    featured: true
  },
  {
    id: 2,
    title: "Bali Foodie Guide: Where to Find the Best Local Eats",
    category: "Dining",
    readTime: "4 min read",
    date: "May 28, 2026",
    summary: "From beachside seafood grills in Jimbaran to organic vegan cafés in Ubud, discover the essential culinary spots of Bali.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
    featured: false
  },
  {
    id: 3,
    title: "Kyoto Etiquette: Cultural Mistakes to Avoid as a First-Timer",
    category: "Culture",
    readTime: "6 min read",
    date: "May 15, 2026",
    summary: "Understand bowing customs, temple photography rules, and Ryokan dining manners to ensure a respectful and rewarding trip to Japan.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
    featured: false
  },
  {
    id: 4,
    title: "A Walking Guide Across the Historic Brooklyn Bridge",
    category: "Guides",
    readTime: "3 min read",
    date: "April 30, 2026",
    summary: "Plan the perfect sunset walk across New York's iconic bridge, including historical checkpoints and the best photo locations in DUMBO.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80",
    featured: false
  },
  {
    id: 5,
    title: "Summer in the Swiss Alps: Top Scenic Hiking Trails",
    category: "Guides",
    readTime: "7 min read",
    date: "April 12, 2026",
    summary: "Discover Alpine wildflower valleys, crystal-clear glacial lakes, and panoramic viewpoints accessible via cogwheel trains.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    featured: false
  }
];

export default function Blog() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
  }, [menuOpen, user, searchQuery, activeCategory]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  // Filtering Logic
  const filteredPosts = initialBlogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = initialBlogPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured || activeCategory !== 'All' || searchQuery !== '');

  return (
    <div>
      <title>Travel Guides & Blog — TripAgent</title>
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
            <li><Link to="/blog" className="active">Blog</Link></li>
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
            {user && (
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ marginRight: '10px' }}>
                <i data-lucide="layout-dashboard"></i> My Dashboard
              </Link>
            )}
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
                <Link to="/dashboard" className="btn-logout" style={{ textDecoration: 'none', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i data-lucide="layout"></i> Dashboard
                </Link>
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
      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">TripAgent Travel Blog</h1>
          <p>Read expert packing tips, dining recommendations, and cultural itineraries curated by global destination specialists.</p>
        </div>
      </section>

      {/* Content Section */}
      <main className="container section">
        
        {/* Search & Categories Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Guides', 'Culture', 'Dining'].map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', border: activeCategory === cat ? 'none' : '1px solid var(--border-color)', background: activeCategory === cat ? 'var(--primary)' : 'none', color: 'inherit' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
            <i data-lucide="search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '16px' }}></i>
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
            />
          </div>
        </div>

        {/* Featured Post (Only show if viewing All and search is empty) */}
        {activeCategory === 'All' && searchQuery === '' && featuredPost && (
          <div className="card-premium" style={{ height: 'auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', padding: '30px', marginBottom: '50px', alignItems: 'center' }}>
            <div className="card-img-wrapper" style={{ height: '320px', borderRadius: 'var(--radius-sm)' }}>
              <img src={featuredPost.image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span className="section-tag" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: 'none' }}>Featured Story</span>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '8px 0' }}>
                <span>{featuredPost.date}</span>
                <span>&bull;</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '12px', lineHeight: '1.3' }}>{featuredPost.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>{featuredPost.summary}</p>
              <button onClick={() => alert('Opening full blog content...')} className="btn btn-primary btn-sm">Read Article</button>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Recent Articles</h2>
        <div className="grid-3" style={{ gap: '30px' }}>
          {filteredPosts.map(post => (
            <div className="card-premium" key={post.id} style={{ display: 'flex', flexDirection: 'column', height: '440px', justifyContent: 'space-between' }}>
              <div>
                <div className="card-img-wrapper" style={{ height: '180px' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px 20px 0 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', lineHeight: '1.4', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{post.summary}</p>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px 20px' }}>
                <button onClick={() => alert('Opening full blog content...')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>Read More</button>
              </div>
            </div>
          ))}
          {filteredPosts.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <i data-lucide="search" style={{ width: '48px', height: '48px', marginBottom: '16px' }}></i>
              <p>No blog articles match your current category or search criteria.</p>
            </div>
          )}
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function Blog() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || (parsedData.email ? parsedData.email.split('@')[0] : "User"),
          email: parsedData.email || "",
          role: parsedData.role || 'user',
        };
      }
    } catch (error) {
      console.error("Failed to parse RegistrationData from localStorage", error);
    }
    return null;
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://trip-agent-backend.onrender.com/api/blog");
        if (response && response.data) {
          let data = response.data;
          if (!Array.isArray(data) && typeof data === 'object') {
            data = data.data || data.blogs || [];
          }
          if (Array.isArray(data)) setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    const loadLucide = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest';
        script.async = true;
        script.onload = () => {
          if (window.lucide) window.lucide.createIcons();
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
    if (window.lucide) window.lucide.createIcons();
  }, [menuOpen, user, posts]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const navigate = useNavigate();

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured);

  return (
    <div>
      <title>Travel Guides & Blog — TripAgent</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="blog" />

      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">TripAgent Travel Blog</h1>
          <p>Read expert packing tips, dining recommendations, and cultural itineraries curated by global destination specialists.</p>
        </div>
      </section>

      <main className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Guides', 'Culture', 'Dining'].map((cat, idx) => (
              <button key={idx} onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', border: activeCategory === cat ? 'none' : '1px solid var(--border-color)', background: activeCategory === cat ? 'var(--primary)' : 'none', color: 'inherit' }}
              >{cat}</button>
            ))}
          </div>
          <div style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
            <i data-lucide="search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '16px' }}></i>
            <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }} />
          </div>
        </div>

        {activeCategory === 'All' && searchQuery === '' && featuredPost && (
          <div className="card-premium" style={{ height: 'auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', padding: '30px', marginBottom: '50px', alignItems: 'center' }}>
            <div className="card-img-wrapper" style={{ height: '320px', borderRadius: 'var(--radius-sm)' }}>
              <img src={featuredPost.image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span className="section-tag" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', border: 'none' }}>Featured Story</span>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '8px 0' }}>
                <span>{featuredPost.date}</span><span>&bull;</span><span>{featuredPost.readTime}</span>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '12px', lineHeight: '1.3' }}>{featuredPost.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>{featuredPost.summary}</p>
              <Link to={`/blog/${featuredPost._id || featuredPost.id}`} className="btn btn-primary btn-sm">Read Article</Link>
            </div>
          </div>
        )}

        <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>Recent Articles</h2>
        <div className="grid-3" style={{ gap: '30px' }}>
          {filteredPosts.map(post => (
            <div className="card-premium" key={post._id || post.id} onClick={() => navigate(`/blog/${post._id || post.id}`)} style={{ display: 'flex', flexDirection: 'column', height: '440px', cursor: 'pointer' }}>
              <div style={{ flex: '1' }}>
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

      <Footer />
    </div>
  );
}

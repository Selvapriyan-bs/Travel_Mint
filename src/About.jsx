import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Safely parse local storage registration data and establish the active logged-in user state
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
  };



  return (
    <div>
      <title>About Us — TravelMint</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="about" />

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Our Journey & Mission</h1>
          <p>We believe travel is not just about visiting places, but creating connections, making memories, and exploring safely.</p>
        </div>
      </section>

      <main>
        {/* Story Section */}
        <section className="section container">
          <div className="grid-2" style={{ gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>Crafting Dreams Into Reality</h2>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Founded in 2020, TravelMint emerged from a shared passion for exploration. We wanted to build a modern gateway that takes the anxiety out of travel planning, replacing spreadsheets and endless booking tabs with structured, stress-free, handpicked holiday itineraries.
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Over the years, we have grown from a small group of travel enthusiasts to a global network of local guides, transport experts, and luxury hotel partners. Today, we manage travels in over 50 countries, providing top-tier booking security, round-the-clock live assistance, and curated trips customized for every traveler type.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80"
                alt="Travel Concept"
                style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Our Core Values</h2>
              <p>These values define how we design travel packages and interact with our global community.</p>
            </div>
            <div className="grid-3" style={{ gap: '30px' }}>
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="compass"></i>
                </div>
                <h3>Curious Exploration</h3>
                <p>We actively look for authentic, off-the-beaten-path paths that help travelers connect with local cultures and nature.</p>
              </div>
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="shield-check"></i>
                </div>
                <h3>Absolute Trust</h3>
                <p>We verify every single hotel, route, and local partner to ensure absolute security and premium luxury standards.</p>
              </div>
              <div className="feature-block">
                <div className="feature-icon-wrapper">
                  <i data-lucide="smile"></i>
                </div>
                <h3>Traveler Delight</h3>
                <p>We put you first. Our 24/7 client helpline is staffed by real humans ready to assist you anywhere in the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="section container" style={{ textAlign: 'center' }}>
          <div className="section-header">
            <h2>TravelMint in Numbers</h2>
            <p>Our rapid growth reflects our commitment to quality travel support.</p>
          </div>
          <div className="grid-3" style={{ gap: '30px', marginTop: '20px' }}>
            <div style={{ padding: '24px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '8px' }}>15k+</h3>
              <p style={{ fontWeight: 'bold' }}>Happy Travelers</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Left reviews praising their memorable trips.</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '8px' }}>250+</h3>
              <p style={{ fontWeight: 'bold' }}>Verified Tour Guides</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Local specialists guiding you on the ground.</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '8px' }}>4.92</h3>
              <p style={{ fontWeight: 'bold' }}>Average Rating</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on thousands of transparent guest ratings.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Meet Our Founders</h2>
              <p>The travel specialists and technology leaders steering the TravelMint ship.</p>
            </div>
            <div className="grid-3" style={{ gap: '30px' }}>
              {/* Leader 1 */}
              <div className="card-premium" style={{ height: 'auto' }}>
                <div className="card-img-wrapper" style={{ height: '260px' }}>
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="Elena Rostova" />
                </div>
                <div className="card-premium-content" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3>Elena Rostova</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Co-Founder & CEO</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Former destination researcher with 12 years of experience leading European custom tours.</p>
                </div>
              </div>

              {/* Leader 2 */}
              <div className="card-premium" style={{ height: 'auto' }}>
                <div className="card-img-wrapper" style={{ height: '260px' }}>
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" alt="David Miller" />
                </div>
                <div className="card-premium-content" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3>David Miller</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Co-Founder & CTO</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Software architect who designed our highly secure payment gateways and flight booking APIs.</p>
                </div>
              </div>

              {/* Leader 3 */}
              <div className="card-premium" style={{ height: 'auto' }}>
                <div className="card-img-wrapper" style={{ height: '260px' }}>
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" alt="Nisha Patel" />
                </div>
                <div className="card-premium-content" style={{ textAlign: 'center', padding: '20px' }}>
                  <h3>Nisha Patel</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Head of Operations</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manages our worldwide networks of luxury hoteliers and local guide companies.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

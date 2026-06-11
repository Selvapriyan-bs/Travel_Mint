import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function Homepage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [packages, setPackages] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || parsedData.email.split('@')[0],
          email: parsedData.email,
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
    const fetchData = async () => {
      try {
        const response = await axios.get("https://trip-agent-backend.onrender.com/api/package");
        if (response) {
          let incomingData = response.data;
          if (!Array.isArray(incomingData) && typeof incomingData === 'object') {
            incomingData = incomingData.package || incomingData.packages || incomingData.data || [];
          }
          if (Array.isArray(incomingData)) setPackages(incomingData);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [menuOpen, user, packages]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const trending = packages.slice(0, 3);
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 7);
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const blogPreviews = [
    { id: 1, title: "10 Hidden Gems in Paris Only Locals Know About", category: "Guides", date: "June 2, 2026", summary: "Skip the long lines at the Eiffel Tower and explore these quiet secret courtyards and rooftop view bistros.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Bali Foodie Guide: Where to Find the Best Local Eats", category: "Dining", date: "May 28, 2026", summary: "From beachside seafood grills in Jimbaran to organic vegan cafés in Ubud, discover the essential culinary spots of Bali.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Kyoto Etiquette: Cultural Mistakes to Avoid as a First-Timer", category: "Culture", date: "May 15, 2026", summary: "Understand bowing customs, temple photography rules, and Ryokan dining manners for a respectful trip to Japan.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80" },
  ];

  const [liveBookings] = useState([
    { name: "Arjun", dest: "Bali", ago: "12 min ago" },
    { name: "Priya", dest: "Paris", ago: "28 min ago" },
    { name: "Rahul", dest: "Kyoto", ago: "1 hour ago" },
    { name: "Ananya", dest: "Swiss Alps", ago: "2 hours ago" },
    { name: "Vikram", dest: "New York", ago: "3 hours ago" },
  ]);

  return (
    <div>
      <link rel="stylesheet" href="App.css" />
      <title>TripAgent — Explore the World with Confidence</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="home" />

      {/* Hero Section */}
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80">
          <source src="/homepage_vid.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <h1 className="font-serif">Explore the World <br />With Confidence</h1>
          <p>Find the best curated packages, flights, and luxury stays. Crafted meticulously for your unique travel style.</p>
          <Link to="/destination" className="btn btn-secondary btn-lg">Explore Destinations <i data-lucide="arrow-right"></i></Link>
        </div>
      </section>

      <main>
        {/* Stats Counter */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)', paddingTop: '50px', paddingBottom: '50px' }}>
          <div className="container">
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', textAlign: 'center' }}>
              <div className="feature-block" style={{ padding: '24px 16px' }}>
                <i data-lucide="users" style={{ width: '36px', height: '36px', color: 'var(--primary)', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '4px 0' }}>10,000+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Happy Travelers</p>
              </div>
              <div className="feature-block" style={{ padding: '24px 16px' }}>
                <i data-lucide="map" style={{ width: '36px', height: '36px', color: 'var(--primary)', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '4px 0' }}>50+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Destinations</p>
              </div>
              <div className="feature-block" style={{ padding: '24px 16px' }}>
                <i data-lucide="star" style={{ width: '36px', height: '36px', color: 'var(--primary)', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '4px 0' }}>4.9★</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average Rating</p>
              </div>
              <div className="feature-block" style={{ padding: '24px 16px' }}>
                <i data-lucide="award" style={{ width: '36px', height: '36px', color: 'var(--primary)', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '4px 0' }}>12+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Spotlight Banner */}
        <section className="section container" style={{ paddingTop: '30px', paddingBottom: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: 'var(--radius-md)', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summer Sale</span>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: '12px 0 6px' }}>Up to 30% Off on Summer Escapes</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>Book your dream vacation before the early-bird offers end. Limited spots available.</p>
            </div>
            <Link to="/search" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>View Deals <i data-lucide="arrow-right"></i></Link>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className="section container" id="popular-destinations">
          <div className="section-header">
            <h2>Trending Destinations</h2>
            <p>Hand-picked global spots that are currently trending among our premium club members.</p>
          </div>
          <div className="grid-3">
            {trending.map(pkg => (
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
                      <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-outline btn-sm">Book Trip</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {trending.length === 0 && (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <i data-lucide="frown" style={{ width: '48px', height: '48px', marginBottom: '16px', color: 'var(--text-muted)' }}></i>
                <p>No trending destinations available right now.</p>
              </div>
            )}
          </div>
        </section>

        {/* Travel Categories Grid */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Find Your Travel Style</h2>
              <p>Whether you crave adventure, luxury, solitude, or family fun — we have the perfect trip for you.</p>
            </div>
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { icon: 'mountain', title: 'Adventure', desc: 'Hike, dive, and explore off-the-beaten-path with expert guides.', link: '/search?region=Adventure' },
                { icon: 'gem', title: 'Luxury', desc: 'Five-star resorts, private transfers, and curated fine-dining experiences.', link: '/search?region=Luxury' },
                { icon: 'user', title: 'Solo Travel', desc: 'Empowering solo journeys with safe accommodations and local buddies.', link: '/search?region=Solo' },
                { icon: 'heart', title: 'Family Getaways', desc: 'Kid-friendly itineraries with activities, fun zones, and relaxation.', link: '/search?region=Family' },
              ].map((cat, i) => (
                <Link to={cat.link} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="feature-block" style={{ textAlign: 'center', padding: '32px 20px', cursor: 'pointer', transition: 'transform 0.2s', borderRadius: 'var(--radius-md)' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="feature-icon-wrapper" style={{ margin: '0 auto 16px' }}>
                      <i data-lucide={cat.icon}></i>
                    </div>
                    <h3>{cat.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Special Deals with Countdown */}
        <section className="section container">
          <div className="section-header">
            <h2>Limited Time Deals</h2>
            <p>Grab these exclusive offers before they expire. Hand-picked for maximum value.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', padding: '12px 24px', textAlign: 'center', minWidth: '88px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{String(unit.value).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{unit.label}</div>
              </div>
            ))}
          </div>
          <div className="grid-3">
            {packages.slice(3, 6).map(pkg => (
              <div className="card-premium" key={pkg.id}>
                <div className="card-badge-left" style={{ background: 'var(--primary)' }}>Limited Offer</div>
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
                      <Link to={`/package/${pkg._id || pkg.id}`} className="btn btn-primary btn-sm">Grab Deal</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

        {/* Trusted Partners */}
        <section className="section container" style={{ paddingTop: '30px', paddingBottom: '10px' }}>
          <div className="section-header">
            <h2>Trusted Partners</h2>
            <p>We work with the world's leading travel brands to deliver excellence.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.6 }}>
            {['Emirates', 'Qatar Airways', 'Marriott', 'Hilton', 'Booking.com', 'Delta'].map((brand, i) => (
              <div key={i} style={{ background: 'var(--surface-alt)', padding: '16px 28px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-muted)', letterSpacing: '0.5px', border: '1px solid var(--border-color)' }}>
                {brand}
              </div>
            ))}
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
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
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
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
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
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
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

        {/* Blog Preview */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container">
            <div className="section-header">
              <h2>Latest from Our Blog</h2>
              <p>Travel tips, destination guides, and cultural insights from our global team.</p>
            </div>
            <div className="grid-3">
              {blogPreviews.map(post => (
                <div className="card-premium" key={post.id} style={{ display: 'flex', flexDirection: 'column', height: '400px', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-img-wrapper" style={{ height: '180px' }}>
                      <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '20px 20px 30px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', lineHeight: '1.4', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{post.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{post.summary}</p>
                    </div>
                  </div>
                  <div style={{ padding: '20px 20px 30px 20px' }}>
                    <Link to="/blog" className="btn btn-outline btn-sm" style={{ width: '100%' }}>Read More</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/blog" className="btn btn-primary">View All Articles <i data-lucide="arrow-right"></i></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

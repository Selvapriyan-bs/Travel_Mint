import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Contact form state
  const [name, setName] = useState('');
  const [emailField, setEmailField] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [role, setRole] = useState("");
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "What is TripAgent's cancellation and refund policy?",
      answer: "Refund policies vary depending on the destination and how close the cancellation is to the departure date. Generally, cancellations made more than 30 days before departure are eligible for a 90% refund, while cancellations within 7 days receive a 20% refund. You can request a cancellation directly from your Dashboard."
    },
    {
      question: "Are flights and hotel accommodation included in the package price?",
      answer: "Yes, our custom travel packages typically include premium 4 or 5-star hotel accommodations, daily breakfast, airport transfers, and select local sightseeing tours. Flight pricing can be bundled dynamically upon request during the booking process."
    },
    {
      question: "Can I customize the day-by-day itineraries of featured deals?",
      answer: "Absolutely! TripAgent specializes in customized travel. Once you match with an expert travel agent or select a package, you can request adjustments to hotels, add free days, or include custom excursions."
    },
    {
      question: "Do you offer international travel insurance coverage?",
      answer: "We offer comprehensive travel insurance add-ons for all bookings. This covers medical emergencies, trip interruptions, baggage delays, and cancellation coverage. You can select this option on the Checkout/Booking form."
    }
  ];

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

  // Dynamic Document Title Management
  useEffect(() => {
    document.title = "Contact Us — TripAgent";
  }, []);

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

  // Rerender Lucide icons whenever state changes cause structural DOM mutations
  useEffect(() => {
    if (window.lucide) {
      // Small timeout ensures the DOM has finished painting the target conditions
      const timer = setTimeout(() => {
        window.lucide.createIcons();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [menuOpen, user, activeFaq, isSubmitted]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setName('');
    setEmailField('');
    setSubject('');
    setMessage('');
  };

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div>
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
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact" className="active">Contact</Link></li>
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
            {user && user.role === "user"?(
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ marginRight: '10px' }}>
                <i data-lucide="layout-dashboard"></i> My Dashboard
              </Link>
            ): null }
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
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Contact & Support</h1>
          <p>Have questions about a holiday package or need help customizing an itinerary? Get in touch with our team.</p>
        </div>
      </section>

      <main>
        {/* Contact Layout */}
        <section className="section container">
          <div className="grid-2" style={{ gap: '50px' }}>
            {/* Form Column */}
            <div className="card-premium" style={{ height: 'auto', padding: '30px' }}>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Fill out this form and our support agents will respond to your email within 12 hours.</p>

              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <i data-lucide="badge-check" style={{ width: '48px', height: '48px', color: '#22c55e', marginBottom: '16px' }}></i>
                  <h3 style={{ color: '#22c55e', marginBottom: '8px' }}>Message Sent Successfully!</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thank you for reaching out. We have logged your request and sent a confirmation email to your address.</p>
                  <button onClick={() => setIsSubmitted(false)} className="btn btn-primary btn-sm" style={{ marginTop: '20px' }}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group-custom" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
                    />
                  </div>
                  <div className="form-group-custom" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      required
                      value={emailField}
                      onChange={(e) => setEmailField(e.target.value)}
                      style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
                    />
                  </div>
                  <div className="form-group-custom" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g. Custom itinerary request"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
                    />
                  </div>
                  <div className="form-group-custom" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Your Message *</label>
                    <textarea
                      rows="5"
                      placeholder="Type details about your holiday plans, target travel dates, or any special support needs here..."
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit', resize: 'vertical', fontFamily: 'inherit' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    <i data-lucide="send"></i> Submit Message
                  </button>
                </form>
              )}
            </div>

            {/* Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Direct Info */}
              <div className="card-premium" style={{ height: 'auto', padding: '30px' }}>
                <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Agency Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '50%', display: 'flex' }}>
                      <i data-lucide="phone"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Call Center Support</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 98765 43210 (24/7 Helpline)</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 44 2345 6789 (Office Desk)</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '50%', display: 'flex' }}>
                      <i data-lucide="mail"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Email Channels</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>support@tripagent.com (Helpdesk)</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>bookings@tripagent.com (Reservations)</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '50%', display: 'flex' }}>
                      <i data-lucide="map-pin"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Corporate Headquarters</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        123, Ocean Heights Tower, 8th Floor,<br />
                        Mahatma Gandhi Road, Chennai, Tamil Nadu - 600001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="card-premium" style={{ height: '230px', position: 'relative', overflow: 'hidden', padding: 0 }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4) grayscale(0.5)'
                  }}
                ></div>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.1)' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 2 }}>
                  <i data-lucide="map-pin" style={{ width: '40px', height: '40px', color: '#ff4b4b', filter: 'drop-shadow(0 0 8px rgba(255,75,75,0.7))' }}></i>
                  <h4 style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', marginTop: '8px' }}>TripAgent Chennai Office</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Click to open in Google Maps</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ position: 'absolute', inset: 0, zIndex: 3 }}
                ></a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-header" style={{ textAlign: 'center' }}>
              <h2>Frequently Asked Questions</h2>
              <p>Get answers to common queries regarding tour packages, booking requests, and cancellations.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    color: 'black',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'inherit',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}
                  >
                    <span>{faq.question}</span>
                    <i class="img_toggle"
                      data-lucide={activeFaq === index ? "chevron-up" : "chevron-down"}
                      style={{ color: 'var(--primary)', transition: 'transform 0.3s ease', }}
                    ></i>
                  </button>
                  {activeFaq === index && (
                    <div
                      style={{
                        padding: '0 24px 24px 24px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        animation: 'fadeIn 0.4s ease'
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
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
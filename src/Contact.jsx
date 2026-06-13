import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import "./Assets/Css/Contact.css";

export default function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Contact form state
  const [name, setName] = useState('');
  const [emailField, setEmailField] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "What is TravelMint's cancellation and refund policy?",
      answer: "Refund policies vary depending on the destination and how close the cancellation is to the departure date. Generally, cancellations made more than 30 days before departure are eligible for a 90% refund, while cancellations within 7 days receive a 20% refund. You can request a cancellation directly from your Dashboard."
    },
    {
      question: "Are flights and hotel accommodation included in the package price?",
      answer: "Yes, our custom travel packages typically include premium 4 or 5-star hotel accommodations, daily breakfast, airport transfers, and select local sightseeing tours. Flight pricing can be bundled dynamically upon request during the booking process."
    },
    {
      question: "Can I customize the day-by-day itineraries of featured deals?",
      answer: "Absolutely! TravelMint specializes in customized travel. Once you match with an expert travel agent or select a package, you can request adjustments to hotels, add free days, or include custom excursions."
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
    document.title = "Contact Us — TravelMint";
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
  }, [menuOpen, user, activeFaq, isSubmitted, contactPhone]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMsg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name, email: emailField, phone: contactPhone, subject, message,
      date: new Date().toISOString(),
      read: false
    };
    const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    existing.unshift(newMsg);
    localStorage.setItem('contactMessages', JSON.stringify(existing));
    try {
      await axios.post("https://trip-agent-backend.onrender.com/api/contact", { name, email: emailField, phone: contactPhone, subject, message });
    } catch (_) {}
    setIsSubmitted(true);
    setName('');
    setEmailField('');
    setContactPhone('');
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



  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="contact" />

      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Contact & Support</h1>
          <p>Have questions about a holiday package or need help customizing an itinerary? Get in touch with our team.</p>
        </div>
      </section>

      <main>
        <section className="section container">
          <div className="grid-2" style={{ gap: '50px' }}>

            <div className="card-premium contact-form-section" style={{ height: 'auto', padding: '30px' }}>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill out this form and our support agents will respond to your email within 12 hours.</p>

              {isSubmitted ? (
                <div className="contact-success">
                  <i data-lucide="badge-check" style={{ width: '48px', height: '48px', color: '#22c55e', marginBottom: '16px' }}></i>
                  <h3>Message Sent Successfully!</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thank you for reaching out. We have logged your request and sent a confirmation email to your address.</p>
                  <button onClick={() => setIsSubmitted(false)} className="btn btn-primary btn-sm" style={{ marginTop: '20px' }}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group-custom">
                    <label>Full Name *</label>
                    <input type="text" placeholder="e.g. John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="form-group-custom">
                    <label>Email Address *</label>
                    <input type="email" placeholder="e.g. john@example.com" required value={emailField} onChange={(e) => setEmailField(e.target.value)} />
                  </div>
                  <div className="form-group-custom">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="e.g. +91 98765 43210" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div className="form-group-custom">
                    <label>Subject *</label>
                    <input type="text" placeholder="e.g. Custom itinerary request" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                  <div className="form-group-custom">
                    <label>Your Message *</label>
                    <textarea rows="5" placeholder="Type details about your holiday plans, target travel dates, or any special support needs here..." required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    <i data-lucide="send"></i> Submit Message
                  </button>
                </form>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="card-premium" style={{ height: 'auto', padding: '30px' }}>
                <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Agency Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="contact-info-item">
                    <div className="contact-icon-circle"><i data-lucide="phone"></i></div>
                    <div>
                      <h4>Call Center Support</h4>
                      <p>+91 98765 43210 (24/7 Helpline)</p>
                      <p>+91 44 2345 6789 (Office Desk)</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-icon-circle"><i data-lucide="mail"></i></div>
                    <div>
                      <h4>Email Channels</h4>
                      <p>support@tripagent.com (Helpdesk)</p>
                      <p>bookings@tripagent.com (Reservations)</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-icon-circle"><i data-lucide="map-pin"></i></div>
                    <div>
                      <h4>Corporate Headquarters</h4>
                      <p>10/21-11 Sundarapuram Main Road,<br />Near Kurumbapalayam Pirivu Madukkarai,Market,<br />Madukkarai,-Coimbatore, Tamil Nadu 641105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium contact-map">
                <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.4) grayscale(0.5)' }}></div>
                <div className="contact-map-overlay"></div>
                <div className="contact-map-content">
                  <i data-lucide="map-pin" style={{ width: '40px', height: '40px', color: '#ff4b4b', filter: 'drop-shadow(0 0 8px rgba(255,75,75,0.7))' }}></i>
                  <h4>TravelMint Coimbatore Office</h4>
                  <p>Click to open in Google Maps</p>
                </div>
                <a href="https://maps.app.goo.gl/WzzMzRumgACS4cvU8" target="_blank" rel="noreferrer" className="contact-map-link"></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-header" style={{ textAlign: 'center' }}>
              <h2>Frequently Asked Questions</h2>
              <p>Get answers to common queries regarding tour packages, booking requests, and cancellations.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
              {faqs.map((faq, index) => (
                <div key={index} className="contact-faq-item">
                  <button onClick={() => toggleFaq(index)} className="contact-faq-btn">
                    <span>{faq.question}</span>
                    <i className={`img_toggle ${activeFaq === index ? 'rotated' : ''}`} data-lucide="chevron-down" style={{ color: 'var(--primary)' }}></i>
                  </button>
                  {activeFaq === index && (
                    <div className="contact-faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

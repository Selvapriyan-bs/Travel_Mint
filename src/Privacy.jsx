import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function Privacy() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('RegistrationData');
      if (data) {
        const parsed = JSON.parse(data);
        return { name: parsed.name || parsed.email?.split('@')[0], email: parsed.email, role: parsed.role || 'user' };
      }
    } catch (e) { console.error(e); }
    return null;
  });

  useEffect(() => {
    document.title = "Privacy Policy — TravelMint";
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const loadLucide = () => {
      if (window.lucide) { window.lucide.createIcons(); }
      else {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/lucide@latest';
        s.async = true;
        s.onload = () => window.lucide?.createIcons();
        document.body.appendChild(s);
      }
    };
    loadLucide();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [menuOpen]);

  const handleLogout = () => { setUser(null); localStorage.removeItem('RegistrationData'); };

  return (
    <div>
      <title>Privacy Policy — TravelMint</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />

      <section className="hero" style={{ minHeight: '35vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Privacy Policy</h1>
          <p>How we collect, use, and protect your personal information</p>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Last updated: June 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Information We Collect</h3>
              <p>We collect personal information you provide during registration including your name, email address, phone number, and payment details necessary for booking travel packages. We also collect information about your travel preferences and search history to personalize your experience.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>2. How We Use Your Data</h3>
              <p>Your data is used to process bookings, send trip confirmations and updates, personalize travel recommendations, and improve our services. We may send occasional promotional communications if you have opted in. We do not sell your personal data to third parties.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>3. Data Security</h3>
              <p>We implement industry-standard encryption (SSL/TLS) and security measures to protect your personal information during transmission and storage. Payment data is processed directly by Razorpay and is never stored on our servers. We regularly review our security practices to maintain a high level of data protection.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>4. Cookies</h3>
              <p>Our platform uses essential cookies for authentication and core functionality. We may use analytics cookies to understand usage patterns and improve user experience. You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>5. Your Rights</h3>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team. You have the right to withdraw consent for data processing and request a copy of the data we hold about you in a portable format.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>6. Third-Party Services</h3>
              <p>Our platform integrates with trusted third-party services including Razorpay (payment processing), Google Maps (location services), and email delivery providers. These services operate under their own privacy policies and data processing agreements. We only share the minimum data necessary for these services to function.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>7. Data Retention</h3>
              <p>We retain your personal data for as long as your account is active or as needed to provide you with services. After account deletion, we may retain anonymized data for analytical purposes. Financial transaction records are retained for the period required by applicable tax laws.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>8. Contact Us</h3>
              <p>For questions about this policy or to exercise your data rights, please email <a href="mailto:privacy@tripagent.com" style={{ color: 'var(--primary)' }}>privacy@tripagent.com</a> or write to our corporate headquarters in Chennai, India. We aim to respond to all inquiries within 48 hours.</p>
            </div>
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>Ready to explore?</p>
            <Link to="/register" className="btn btn-primary">Create an Account</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

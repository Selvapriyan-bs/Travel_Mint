import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function Terms() {
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
    document.title = "Terms of Service — TripAgent";
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
      <title>Terms of Service — TripAgent</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />

      <section className="hero" style={{ minHeight: '35vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">Terms of Service</h1>
          <p>Rules, guidelines, and policies for using TripAgent</p>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Last updated: June 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Acceptance of Terms</h3>
              <p>By creating an account, accessing, or using TripAgent's platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you may not use our services. We recommend reviewing these terms periodically, as they may be updated.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>2. Account Registration</h3>
              <p>You must provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>3. Booking & Payments</h3>
              <p>All tour package bookings are subject to availability and confirmation. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Payments are processed securely through Razorpay. A booking is confirmed only after successful payment and receipt of a confirmation email.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>4. Cancellation & Refunds</h3>
              <p>Cancellation policies vary by package and are clearly stated at the time of booking. As a general guideline: cancellations made 30 or more days before departure receive a 90% refund; 15–29 days receive 50%; within 14 days receive 20%. Refunds are processed within 10 business days. No-shows are non-refundable.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>5. User Conduct</h3>
              <p>You agree not to misuse the platform for any unlawful purpose, engage in fraudulent activity, impersonate others, or violate any applicable local, national, or international laws. TripAgent reserves the right to suspend or terminate accounts found violating these terms without prior notice.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>6. Limitation of Liability</h3>
              <p>TripAgent acts as a booking intermediary and is not liable for issues arising from third-party services including airlines, hotels, transport operators, or tour guides beyond our reasonable control. Our total liability is limited to the amount paid for the specific booking giving rise to the claim.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>7. Intellectual Property</h3>
              <p>All content on the TripAgent platform — including text, images, logos, and software — is our property or that of our licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>8. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Continued use of the platform after changes constitutes acceptance of the updated terms. We will notify registered users of material changes via email.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>9. Governing Law</h3>
              <p>These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>10. Contact</h3>
              <p>For questions about these terms, please contact us at <a href="mailto:support@tripagent.com" style={{ color: 'var(--primary)' }}>support@tripagent.com</a> or through our <Link to="/contact" style={{ color: 'var(--primary)' }}>Contact page</Link>.</p>
            </div>
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>Ready to explore the world?</p>
            <Link to="/register" className="btn btn-primary">Create an Account</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from './Components/SnackbarProvider';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function ForgotPassword() {
  const showSnackbar = useSnackbar();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [isSubmitted, menuOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Placeholder for your backend forgot-password endpoint
      await axios.post("https://trip-agent-backend.onrender.com/api/user/forgot-password", { email });
      setIsSubmitted(true);
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to send reset link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <title>Reset Password — TripAgent</title>
      
      <Navbar simple menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} />

      <section className="hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay" style={{ opacity: 0.65 }}></div>

        <div className="container animate-fade-in" style={{ zIndex: 2, display: 'flex', justifyContent: 'center', margin: '120px auto 60px auto' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '450px', color: '#111', padding: '40px 30px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ color: 'var(--color-primary, #0ea5e9)', fontSize: '2.5rem', marginBottom: '10px' }}>
                <i data-lucide="key-round" style={{ width: '48px', height: '48px' }}></i>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#1a1a1a' }}>Forgot Password?</h2>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                {isSubmitted 
                  ? "Check your email for the reset link." 
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="reset-email" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Email Address</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="mail" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '14px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>
                  {loading ? "Sending..." : "Send Reset Link"} <i data-lucide="send" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-outline" style={{ width: '100%' }}>
                  Try another email
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              Remember your password? <Link to="/Login" style={{ color: 'var(--color-primary, #0ea5e9)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

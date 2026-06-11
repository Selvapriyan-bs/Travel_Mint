import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Footer from './Components/Footer';

export default function Register() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Track inputs here
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Track an active authenticated user separately from registration input fields
  const [activeUser, setActiveUser] = useState(null);

  // Sync window browser title dynamically
  useEffect(() => {
    document.title = "Create Account — TripAgent";
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Optimized CDN initialization logic check
    const loadLucide = () => {
      if (window.lucide) {
        window.lucide.createIcons();
        return;
      }
      
      // Look for existing script element before appending a new one
      let script = document.querySelector("script[src*='lucide']");
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest';
        script.async = true;
        document.body.appendChild(script);
      }

      const triggerIcons = () => { if (window.lucide) window.lucide.createIcons(); };
      script.addEventListener('load', triggerIcons);
      
      return () => script.removeEventListener('load', triggerIcons);
    };
    
    loadLucide();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sync visual updates for menu transformations
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, activeUser]); // Hook updates to include active user profile lifecycle mutations

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!agreeTerms) {
        toast.error("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }
      
      const res = await axios.post("https://trip-agent-backend.onrender.com/api/user/signup", form);
      toast.success(res.data.message || "Account created successfully!");
      
      // Set the active authenticated dashboard context block
      setActiveUser({
        fullName: form.fullName,
        email: form.email
      });

      // Persist authentic context
      localStorage.setItem('RegistrationData', JSON.stringify(form));

      // Flush current form inputs state
      setForm({
        fullName: "",
        email: "",
        password: "",
      });
      setAgreeTerms(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('RegistrationData');
    sessionStorage.removeItem('RegistrationData');
  };

  // Safely grab visual profile letters
  const initialLetter = activeUser && activeUser.fullName ? activeUser.fullName.charAt(0).toUpperCase() : "";

  return (
    <div>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      {/* Header element markup link configurations */}
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        {/* <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul> */}

          {/* Fixed: Only displays when user registration completes successfully */}
          {/* {activeUser && (
            <div className="user-profile-banner">
              <div className="user-text-avatar">
                {initialLetter}
              </div>
              <div className="user-info-dropdown">
                <span className="user-name">Hi, {activeUser.fullName.split(' ')[0]}!</span>
                <span className="user-email-sub">{activeUser.email}</span>
                <button onClick={handleLogout} className="btn-logout"><i data-lucide="log-out"></i> Logout</button>
              </div>
            </div>
          )} */}

          {/* <div
            className={`nav-toggle ${menuOpen ? 'active' : ''}`}
            id="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div> */}
      </header>

      {/* Main Container Hero Display Wrapper */}
      <section className="hero" style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay" style={{ opacity: 0.65 }}></div>

        <div className="container animate-fade-in" style={{ zIndex: 2, display: 'flex', justifyContent: 'center', margin: '120px auto 60px auto' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '480px', color: '#111', padding: '40px 30px' }}>

            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ color: 'var(--color-primary, #0ea5e9)', fontSize: '2.5rem', marginBottom: '10px' }}>
                <i data-lucide="user-plus" style={{ width: '48px', height: '48px' }}></i>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#f4f2f2' }}>Join TripAgent</h2>
              <p style={{ color: '#adaaaa', fontSize: '0.95rem' }}>Sign up to access tailored deals and tracking tools</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Full Name Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reg-name" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#adaaaa' }}>Full Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <i data-lucide="user" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                  <input
                    id="reg-name"
                    type="text"
                    name="fullName"
                    placeholder="Alex Mercer"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reg-email" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#adaaaa' }}>Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <i data-lucide="mail" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reg-password" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#adaaaa' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <i data-lucide="lock" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                  />
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="reg-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="reg-terms" style={{ cursor: 'pointer', color: '#adaaaa', lineHeight: '1.4' }}>
                  I agree to the <Link to="/terms" style={{ color: 'var(--color-primary, #0ea5e9)', textDecoration: 'none' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--color-primary, #0ea5e9)', textDecoration: 'none' }}>Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Action Button */}
              <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '10px' }}>
                Create Account <i data-lucide="user-check" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
              </button>

            </form>

            {/* Back to Login Redirect Link */}
            <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#bebbbb' }}>
              Already have an account? <Link to="/Login" style={{ color: 'var(--color-primary, #0ea5e9)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

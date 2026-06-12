import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Footer from './Components/Footer';
export default function Login() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [userDetails, setuserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  // Parse local storage on component mount to retrieve authenticated session profiles
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("RegistrationData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
  }, [menuOpen, currentUser]);

  const handleChange = (e) => {
    setuserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://trip-agent-backend.onrender.com/api/user/login", {
        email: userDetails.email,
        password: userDetails.password
      }, { timeout: 30000 });

      if (response.data && response.data.data) {
        const userData = response.data.data;

        localStorage.setItem("RegistrationData", JSON.stringify(userData));
        toast.success(response.data.message || "Login successful!");
          navigate("/");
        window.location.reload();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong during login.";
      toast.error(errorMessage);
      setuserDetails({
        name: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      <title>Login — TripAgent</title>
      <meta name="description" content="Log in to your TripAgent account to manage bookings, explore custom itineraries, and view saved trips." />

      {/* <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li> */}

      {/* STRICT SYSTEM EVALUATION: Renders ONLY if the active token profile explicitly states 'admin' */}
      {/* {currentUser && currentUser.role === "admin" ? (
              <li>
                <Link to="/admin" style={{ color: '#e11d48', fontWeight: '700', border: '1px dashed #e11d48', padding: '4px 8px', borderRadius: '4px' }}>
                  Admin Dashboard
                </Link>
              </li>
            ) : null}

            <li><Link to="/Login" className="active">Login</Link></li>
          </ul>
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
      </header> */}

      <section className="hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay" style={{ opacity: 0.65 }}></div>

        <div className="container animate-fade-in" style={{ zIndex: 2, display: 'flex', justifyContent: 'center', margin: '120px auto 60px auto' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '450px', color: '#111', padding: '40px 30px' }}>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ color: 'var(--color-primary, #0ea5e9)', fontSize: '2.5rem', marginBottom: '10px' }}>
                <i data-lucide="user-check" style={{ width: '48px', height: '48px' }}></i>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#e2dfdf' }}>Welcome Back</h2>
              <p style={{ color: '#bbb9b9', fontSize: '0.95rem' }}>Log in to access your dashboard and bookings</p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Email Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="login-email" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#bbb9b9' }}>Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <i data-lucide="mail" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="alex@example.com"
                    value={userDetails.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="login-password" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#bbb9b9' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <i data-lucide="lock" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={userDetails.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                  />
                </div>
              </div>

              {/* Checkboxes / Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#bbb9b9' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  /> Remember me
                </label>
                <Link to="/forgot-password" style={{ color: 'var(--color-primary, #0ea5e9)', textDecoration: 'none', fontWeight: '500' }}>Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '10px' }}>
                Sign In <i data-lucide="arrow-right" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
              </button>

            </form>

            {/* Context link below main button forms */}

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#bbb9b9', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              Don't have an account? <Link to="/Register" style={{ color: 'var(--color-primary, #0ea5e9)', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

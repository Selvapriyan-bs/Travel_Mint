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
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
  }, [step, menuOpen, isSuccess]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://trip-agent-backend.onrender.com/api/user/forgot-password", { email },  { timeout: 15000 });
      setStep(2);
      showSnackbar("OTP sent to your email", "success");
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to send OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://trip-agent-backend.onrender.com/api/user/reset-password", { email, otp, newPassword }, { timeout: 15000 });
      setIsSuccess(true);
      showSnackbar("Password reset successfully", "success");
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to reset password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <title>Reset Password — TravelMint</title>

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
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#abaaaa' }}>
                {isSuccess ? "Password Reset!" : step === 1 ? "Forgot Password?" : "Enter OTP"}
              </h2>
              <p style={{ color: '#abaaaa', fontSize: '0.95rem' }}>
                {isSuccess
                  ? "Your password has been reset successfully."
                  : step === 1
                    ? "Enter your email and we'll send you an OTP to reset your password."
                    : `Enter the 6-digit OTP sent to ${email}`}
              </p>
            </div>

            {isSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <Link to="/Login">
                  <button className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>
                    Sign In with New Password <i data-lucide="log-in" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
                  </button>
                </Link>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="reset-email" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#abaaaa' }}>Email Address</label>
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
                  {loading ? "Sending..." : "Send OTP"} <i data-lucide="send" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="otp" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>OTP</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="shield" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000', letterSpacing: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="new-password" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="lock" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="confirm-password" style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333' }}>Confirm Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <i data-lucide="lock" style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#999' }}></i>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', background: '#fff', color: '#000' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '14px', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>
                  {loading ? "Resetting..." : "Reset Password"} <i data-lucide="check-circle" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}></i>
                </button>

                <button type="button" onClick={() => { setStep(1); setOtp(""); setNewPassword(""); setConfirmPassword(""); }} className="btn btn-outline" style={{ width: '100%', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Try another email
                </button>
              </form>
            )}

            {!isSuccess && (
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                Remember your password? <Link to="/Login" style={{ color: 'var(--color-primary, #0ea5e9)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
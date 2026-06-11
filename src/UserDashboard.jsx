import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from './Components/SnackbarProvider';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
export default function UserDashboard() {
  const showSnackbar = useSnackbar();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const navigate = useNavigate();

  // Safely parse local storage registration data and establish the active logged-in user state
  const [user, setUser] = useState(() => {
    try {
      const registrationData = localStorage.getItem('RegistrationData');
      if (registrationData) {
        const parsedData = JSON.parse(registrationData);
        return {
          name: parsedData.name || (parsedData.email ? parsedData.email.split('@')[0] : "User"),
          email: parsedData.email || ""
        };
      }
    } catch (error) {
      console.error("Failed to parse RegistrationData from localStorage", error);
    }
    return null;
  });

  const fetchUserBookings = async (email) => {
    setBookingLoading(true);
    try {
      const res = await axios.get("https://trip-agent-backend.onrender.com/api/booking");
      if (res && res.data) {
        let data = res.data;
        if (!Array.isArray(data) && typeof data === 'object') data = data.data || data.bookings || [];
        if (Array.isArray(data)) {
          const userBookings = data.filter(b => b.email === email);
          setBookings(userBookings);
        }
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

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
    if (user && user.email) fetchUserBookings(user.email);
  }, [user]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, user, bookings]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
    navigate('/');
  };

  const activeBookings = bookings.filter(b => !['done', 'cancelled'].includes(b.status));
  const completedTrips = bookings.filter(b => b.status === 'done').length;
  const rewardPoints = completedTrips * 50 + activeBookings.length * 20;
  const memberSince = bookings.length > 0
    ? new Date(Math.min(...bookings.map(b => new Date(b.createdAt || b.date || b.departureDate || Date.now()).getTime()))).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  // Guard: If user is not logged in, show a beautiful lock screen
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-dark)', padding: '20px' }}>
        <title>Access Denied — TripAgent</title>
        <div className="card-premium" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '40px 30px', height: 'auto' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 24px auto' }}>
            <i data-lucide="lock" style={{ width: '32px', height: '32px' }}></i>
          </div>
          <h2 className="font-serif" style={{ marginBottom: '12px' }}>Dashboard Locked</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Please log in or register an account to view your travel dashboard, active itineraries, booking requests, and loyalty points.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Log In</Link>
            <Link to="/" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <title>My Dashboard — TripAgent</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '40vh' }}>
        <div className="hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ margin: '0 auto' }}>
          <span className="section-tag" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>Club Explorer Member</span>
          <h1 className="font-serif" style={{ fontSize: '2.5rem', marginTop: '10px' }}>Welcome back, {user.name}!</h1>
          <p style={{ marginTop: '6px' }}>Manage your booked packages, download ticket details, and check your travel points.</p>
        </div>
      </section>

      <main className="container section">
        {/* Stats Row */}
        <div className="grid-3" style={{ gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="plane"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{bookingLoading ? "..." : activeBookings.length}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Active Itineraries</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="award"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{bookingLoading ? "..." : rewardPoints}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Travel Reward Points</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'grid', placeItems: 'center' }}>
              <i data-lucide="check-square"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{bookingLoading ? "..." : completedTrips}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Trips Completed</p>
            </div>
          </div>
        </div>

        {/* Dashboard Layout split */}
        <div className="search-layout" style={{ gridTemplateColumns: '1.3fr 0.7fr' }}>
          {/* Left Column: Bookings table */}
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Active Booking Logs</h2>

            <div className="card-premium" style={{ height: 'auto', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px 8px' }}>Booking ID</th>
                    <th style={{ padding: '12px 8px' }}>Destination</th>
                    <th style={{ padding: '12px 8px' }}>Departure Date</th>
                    <th style={{ padding: '12px 8px' }}>Guests</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingLoading ? (
                    <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your bookings...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet. Start planning your next trip!</td></tr>
                  ) : bookings.map((item) => {
                    const statusColor = item.status === 'booked' ? '#f59e0b' :
                      item.status === 'contacted' ? '#6366f1' :
                      item.status === 'on-trip' ? '#06b6d4' :
                      item.status === 'done' ? '#22c55e' : '#888';
                    return (
                      <tr key={item._id || item.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{(item._id || item.id || "").slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '16px 8px' }}>{item.destination || "—"}</td>
                        <td style={{ padding: '16px 8px' }}>{item.departureDate ? new Date(item.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}</td>
                        <td style={{ padding: '16px 8px' }}>{item.pax || item.guests || 1} {(item.pax || item.guests || 1) === 1 ? 'Guest' : 'Guests'}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ background: `${statusColor}1a`, color: statusColor, padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {item.status === 'on-trip' ? 'On Trip' : item.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <Link to="/booking" className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>Manage</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <button onClick={() => showSnackbar('PDF Ticket download started...', 'info')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.82rem' }}>
                  <i data-lucide="download"></i> Download Tickets
                </button>
                <button onClick={() => showSnackbar('Please contact support at support@tripagent.com to modify this trip.', 'info')} className="btn btn-outline btn-sm" style={{ fontSize: '0.82rem' }}>
                  <i data-lucide="edit"></i> Request Modification
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <h2 className="font-serif" style={{ fontSize: '1.6rem', marginTop: '40px', marginBottom: '16px' }}>Account Information</h2>
            <div className="card-premium" style={{ height: 'auto', padding: '24px' }}>
              <div className="grid-2" style={{ gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Full Name</p>
                  <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Registered Email</p>
                  <strong style={{ fontSize: '1.1rem' }}>{user.email}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Membership Tier</p>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{completedTrips >= 5 ? 'Travel Elite' : completedTrips >= 2 ? 'Adventurer' : 'Club Explorer'}</strong>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Member Since</p>
                  <strong style={{ fontSize: '1.1rem' }}>{memberSince || 'Just Joined'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <aside>
            <div className="card-premium" style={{ height: 'auto', padding: '24px' }}>
              <h3 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Recommended Journeys</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Based on your interest in culture and relaxing vacations, we recommend these deals:</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80"
                    alt="Bali"
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}><Link to="/package-detail?id=2" style={{ color: 'inherit', textDecoration: 'none' }}>Bali Tropical Paradise</Link></h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>8 Days &bull; ₹40,320</p>
                    <Link to="/package-detail?id=2" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View Itinerary &rarr;</Link>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=150&q=80"
                    alt="Kyoto"
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}><Link to="/package-detail?id=3" style={{ color: 'inherit', textDecoration: 'none' }}>Kyoto Cultural Heritage</Link></h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>7 Days &bull; ₹55,620</p>
                    <Link to="/package-detail?id=3" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View Itinerary &rarr;</Link>
                  </div>
                </div>
              </div>

              <Link to="/search" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Explore All Packages</Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

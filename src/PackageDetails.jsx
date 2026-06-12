import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { useSnackbar } from './Components/SnackbarProvider';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('RegistrationData');
      if (data) {
        const parsed = JSON.parse(data);
        return { name: parsed.name || parsed.email.split('@')[0], email: parsed.email, role: parsed.role || 'user' };
      }
    } catch (e) { console.error(e); }
    return null;
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`https://trip-agent-backend.onrender.com/api/package/${id}`);
        if (res.data) {
          const d = res.data.data || res.data;
          setPkg(d);
          if (d.itinerary && d.itinerary.length > 0) setActiveDay(d.itinerary[0].day);
        }
      } catch (err) {
        console.error("Error fetching package:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

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

  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [menuOpen, activeDay, pkg]);

  const handleLogout = () => { setUser(null); localStorage.removeItem('RegistrationData'); };

  const handleBookNow = () => {
    if (!user) {
      showSnackbar("Login first to book a package", "error");
      navigate("/login");
    } else {
      navigate(`/booking?packageId=${pkg._id || pkg.id}`);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>Loading package details...</div>;
  }

  if (!pkg) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>Package not found.</div>;
  }

  const itinerary = pkg.itinerary || [];
  const currentDay = itinerary.find(d => d.day === activeDay) || itinerary[0];

  return (
    <div>
      <title>{pkg.title || 'Package Details'} — TripAgent</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />

      {/* Hero */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: `url('${pkg.image}')` }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">{pkg.title}</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>{pkg.description}</p>
        </div>
      </section>

      {/* Package Summary */}
      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px', padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Destination</span><div style={{ fontWeight: 600 }}>{pkg.destination}</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Country</span><div style={{ fontWeight: 600 }}>{pkg.country}</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Duration</span><div style={{ fontWeight: 600 }}>{pkg.days} Days</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Rating</span><div style={{ fontWeight: 600 }}>{pkg.rating} ★ ({pkg.reviews})</div></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Price</span><div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>&#8377;{(pkg.price ?? 0).toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ person</span></div></div>
          </div>
          <button onClick={handleBookNow} className="btn btn-primary btn-lg">
            Book Now <i data-lucide="arrow-right"></i>
          </button>
        </div>

        {/* Itinerary */}
        {itinerary.length > 0 && (
          <>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Day-by-Day Itinerary</h2>
            <div style={{ display: 'flex', gap: '24px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              {/* Day selector */}
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '100px' }}>
                  {itinerary.map(d => (
                    <button key={d.day} onClick={() => setActiveDay(d.day)}
                      style={{
                        padding: '12px 16px', textAlign: 'left', borderRadius: 'var(--radius-sm)',
                        background: activeDay === d.day ? 'var(--primary)' : 'var(--surface-alt)',
                        color: activeDay === d.day ? '#fff' : 'var(--text)',
                        border: activeDay === d.day ? 'none' : '1px solid var(--border-color)',
                        cursor: 'pointer', fontWeight: activeDay === d.day ? 600 : 400, fontSize: '0.9rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      Day {d.day}: {d.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day detail */}
              {currentDay && (
                <div style={{ flex: 1, padding: '28px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Day {currentDay.day}: {currentDay.title}</h3>
                    <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 600 }}>Day {currentDay.day} of {itinerary.length}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>{currentDay.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    {currentDay.hotel && (
                      <div style={{ padding: '14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Hotel</div>
                        <div style={{ fontWeight: 600 }}><i data-lucide="building" style={{ width: '16px', height: '16px', marginRight: '6px' }}></i>{currentDay.hotel}</div>
                      </div>
                    )}
                    {currentDay.startPlace && (
                      <div style={{ padding: '14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Start</div>
                        <div style={{ fontWeight: 600 }}><i data-lucide="map-pin" style={{ width: '16px', height: '16px', marginRight: '6px' }}></i>{currentDay.startPlace}</div>
                      </div>
                    )}
                    {currentDay.endPlace && (
                      <div style={{ padding: '14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>End</div>
                        <div style={{ fontWeight: 600 }}><i data-lucide="flag" style={{ width: '16px', height: '16px', marginRight: '6px' }}></i>{currentDay.endPlace}</div>
                      </div>
                    )}
                  </div>

                  {currentDay.activities && currentDay.activities.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text)' }}>Activities</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {currentDay.activities.map((act, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                            <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ fontSize: '0.9rem' }}>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {itinerary.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <i data-lucide="map" style={{ width: '48px', height: '48px', marginBottom: '16px' }}></i>
            <p>Detailed itinerary for this package is being prepared. Check back soon!</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

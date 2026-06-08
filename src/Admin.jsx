import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // IMPORT PORTAL MECHANISM
import { Link } from 'react-router-dom';
import "./Assets/Css/Admin.css"
import axios from 'axios';
import {
  Compass,
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Settings,
  ExternalLink,
  ChevronsUpDown,
  Menu,
  Bell,
  RefreshCw,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';

const fallbackAdminDestinations = [
  { id: 1, name: "Paris", country: "France", badge: "Featured", price: 1299, description: "Experience the romance of the City of Light.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" }
];

export default function Admin() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal State Section with Debugging Effects
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Modal State:", isModalOpen);
  }, [isModalOpen]);

  const openFormModal = () => {
    console.log("Add Destination clicked");
    setActiveView("destinations");
    setIsModalOpen(true);
  };

  // Dynamic States for API Data
  const [destinations, setDestinations] = useState([]);
  const [destLoading, setDestLoading] = useState(true);

  // Form Input States
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    region: '',
    country: '',
    price: '',
    days: '',
    rating: '5',
    reviews: '0 reviews',
    badge: 'New',
    description: '',
    image: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [bookings] = useState([
    { id: "BK-1042", customer: "Alice Johnson", email: "alice@example.com", destination: "Paris, France", dates: "Oct 12 - Oct 18", pax: 2, total: "67,598", status: "approved", date: "2026-05-28" },
    { id: "BK-1041", customer: "John Doe", email: "john@example.com", destination: "Tokyo, Japan", dates: "Nov 05 - Nov 12", pax: 1, total: "54,850", status: "pending", date: "2026-05-30" },
    { id: "BK-1040", customer: "Sarah Smith", email: "sarah@example.com", destination: "Bali, Indonesia", dates: "Dec 01 - Dec 10", pax: 4, total: "56,200", status: "completed", date: "2026-05-25" },
  ]);

  const fetchDestinations = async () => {
    setDestLoading(true);
    try {
      const response = await axios.get("https://trip-agent-backend.onrender.com/api/package");
      if (response && response.data) {
        let incomingData = response.data;

        if (!Array.isArray(incomingData) && typeof incomingData === 'object') {
          incomingData = incomingData.package || incomingData.packages || incomingData.data || [];
        }

        if (incomingData.length > 0) {
          const structuredData = incomingData.map(p => ({
            id: p._id || p.id,
            name: p.title || p.destination || "Unknown Destination",
            country: p.country || p.region || "Global",
            badge: p.badge || "New",
            price: p.price || 0,
            desc: p.description || "No description provided.",
            image: p.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
          }));
          setDestinations(structuredData);
        } else {
          setDestinations(fallbackAdminDestinations);
        }
      }
    } catch (err) {
      console.error("Admin portal API error fetching packages:", err);
      setDestinations(fallbackAdminDestinations);
    } finally {
      setDestLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDestinationSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Title and Price are required fields.");
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await axios.post("https://trip-agent-backend.onrender.com/api/package/post", {
        title: formData.title,
        destination: formData.destination || formData.title,
        region: formData.region,
        country: formData.country,
        price: Number(formData.price),
        days: Number(formData.days) || 1,
        rating: Number(formData.rating) || 5,
        reviews: formData.reviews || "0 reviews",
        badge: formData.badge,
        description: formData.description,
        image: formData.image
      });

      if (response.status === 201 || response.data) {
        alert("Destination Package added successfully!");
        setIsModalOpen(false);
        setFormData({
          title: '', destination: '', region: '', country: '',
          price: '', days: '', rating: '5', reviews: '0 reviews',
          badge: 'New', description: '', image: ''
        });
        fetchDestinations();
      }
    } catch (error) {
      console.error("Error creating new destination item:", error);
      alert(error.response?.data?.message || "Submission failed.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* Sidebar */}
      <aside className="admin-sidebar" id="adminSidebar">
        <div className="sidebar-brand">
          <div className="brand-logo"><Compass size={20} /></div>
          <span className="brand-text">Trip<span>Agent</span></span>
          <span className="sidebar-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Main</p>
          <div className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div className={`nav-item ${activeView === 'bookings' ? 'active' : ''}`} onClick={() => setActiveView('bookings')}>
            <CalendarCheck size={18} /> Bookings
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </div>
          <div className={`nav-item ${activeView === 'destinations' ? 'active' : ''}`} onClick={() => { setActiveView('destinations'); fetchDestinations(); }}>
            <MapPin size={18} /> Destinations
          </div>
          <p className="nav-section-title">System</p>
          <Link to="/" className="nav-item" target="_blank" rel="noreferrer">
            <ExternalLink size={18} /> View Website
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Super Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <div>
              <div className="page-title" style={{ textTransform: 'capitalize' }}>{activeView}</div>
              <div className="page-subtitle">Overview of TripAgent {activeView}</div>
            </div>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" title="Notifications">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>
            <button className="topbar-btn" title="Refresh" onClick={() => fetchDestinations()}>
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
              className="topbar-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                openFormModal();
              }}
            >
              <Plus size={18} />
              Add Destination
            </button>
          </div>
        </header>

        <div className="admin-content">
          {activeView === 'dashboard' && (
            <div className="view-panel active">
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-card-header">
                    <div className="stat-icon blue"><CalendarCheck size={20} /></div>
                    <div className="stat-trend up"><TrendingUp size={14} /> +12%</div>
                  </div>
                  <div className="stat-value">{bookings.length}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-card-header">
                    <div className="stat-icon green"><DollarSign size={20} /></div>
                    <div className="stat-trend up"><TrendingUp size={14} /> +8.4%</div>
                  </div>
                  <div className="stat-value">&#8377;7,648</div>
                  <div className="stat-label">Est. Revenue</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-card-header">
                    <div className="stat-icon orange"><MapPin size={20} /></div>
                    <div className="stat-trend up"><TrendingUp size={14} /> Live</div>
                  </div>
                  <div className="stat-value">{destLoading ? "..." : destinations.length}</div>
                  <div className="stat-label">Active Destinations</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-card-header">
                    <div className="stat-icon purple"><Clock size={20} /></div>
                    <div className="stat-trend down"><TrendingDown size={14} /> -3</div>
                  </div>
                  <div className="stat-value">{pendingCount}</div>
                  <div className="stat-label">Pending Requests</div>
                </div>
              </div>

              <div className="recent-card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                  <div>
                    <h3>Recent Bookings</h3>
                    <div className="card-header-meta">Latest customer booking requests</div>
                  </div>
                  <button className="topbar-btn-primary" style={{ fontSize: '0.83rem', padding: '8px 14px' }} onClick={() => setActiveView('bookings')}>
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Destination</th>
                        <th>Pax</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map((item) => (
                        <tr key={item.id}>
                          <td>{item.customer}</td>
                          <td>{item.destination}</td>
                          <td>{item.pax}</td>
                          <td>&#8377;{item.total}</td>
                          <td><span className={`badge status-${item.status}`}>{item.status}</span></td>
                          <td>{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'bookings' && (
            <div className="view-panel active">
              <div className="section-head">
                <div>
                  <h2>Booking Requests</h2>
                  <p>Review and manage incoming customer tour reservations</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge status-pending" style={{ padding: '6px 12px', borderRadius: '20px' }}>
                    {pendingCount} Awaiting Review
                  </span>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
                <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
                  <input
                    type="text"
                    placeholder="Search customer or destination..."
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <select className="filter-select" style={{ minWidth: '160px' }}>
                  <option value="all">All Bookings</option>
                  <option value="pending">Awaiting Action</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Bookings Table Context Layout */}
              <div className="recent-card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Tour Package</th>
                        <th>Travel Dates</th>
                        <th>Guests</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((item) => (
                        <tr key={item.id} style={{ background: item.status === 'pending' ? 'rgba(245, 158, 11, 0.03)' : 'transparent' }}>
                          <td style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{item.id}</td>
                          <td>
                            <div style={{ fontWeight: '500' }}>{item.customer}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.email}</div>
                          </td>
                          <td>{item.destination}</td>
                          <td>{item.dates}</td>
                          <td>{item.pax} {item.pax === 1 ? 'Pax' : 'People'}</td>
                          <td style={{ fontWeight: '600' }}>&#8377;{item.total}</td>
                          <td>
                            <span className={`badge status-${item.status}`}>
                              {item.status === 'pending' ? '⏳ pending' : item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {item.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => alert(`Approving ${item.id}`)}
                                  style={{ padding: '6px 12px', background: 'var(--color-completed)', border: 'none', color: '#000', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => alert(`Rejecting ${item.id}`)}
                                  style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--color-cancelled)', color: 'var(--color-cancelled)', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No actions required</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'destinations' && (
            <div className="view-panel active">
              <div className="section-head">
                <div>
                  <h2>Destinations Catalog</h2>
                  <p>Synchronized directly with the live trip package database</p>
                </div>

                <button
                  type="button"
                  className="btn-add"
                  onClick={(e) => {
                    e.preventDefault();
                    openFormModal();
                  }}
                >
                  <Plus size={18} />
                  Add Destination
                </button>
              </div>

              {destLoading ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
                  <p style={{ fontSize: '0.9rem' }}>Updating destinations map grid...</p>
                </div>
              ) : (
                <div className="dest-grid">
                  {destinations.map((dest) => (
                    <div className="dest-card" key={dest.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem' }}>{dest.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>{dest.country}</p>
                        <p style={{ fontSize: '0.85rem', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '38px' }}>{dest.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                          <span><strong>&#8377;{Number(dest.price).toLocaleString()}</strong></span>
                          {dest.badge && <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{dest.badge}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'settings' && (
            <div className="view-panel active">
              {/* Settings context */}
            </div>
          )}
        </div>
      </main>

      {/* REACT PORTAL: Escapes CSS layout boxes and mounts form layout safely straight to document.body */}
      {isModalOpen && createPortal(
        <div
          className="modal-portal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2147483647 // Maximum absolute z-index value allowed by browsers
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-window"
            style={{
              background: '#1e1e24',
              padding: '28px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '555px',
              maxHeight: '85vh',
              overflowY: 'auto',
              border: '1px solid #444',
              color: '#fff',
              boxShadow: '0px 24px 50px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '600', color: '#fff' }}>Create Travel Package</h2>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDestinationSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Package Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Luxury Escape to Paris" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Destination City</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="Paris" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="France" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Region / Continent</label>
                    <input type="text" name="region" value={formData.region} onChange={handleInputChange} placeholder="Europe" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Duration (Days)</label>
                    <input type="number" name="days" value={formData.days} onChange={handleInputChange} placeholder="6" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Price (INR) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="24999" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Display Badge</label>
                    <select name="badge" value={formData.badge} onChange={handleInputChange} style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }}>
                      <option value="New">New</option>
                      <option value="Featured">Featured</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Limited Offer">Limited Offer</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Rating (1 - 5)</label>
                    <input type="number" name="rating" min="1" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} placeholder="4.8" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Reviews Count</label>
                    <input type="text" name="reviews" value={formData.reviews} onChange={handleInputChange} placeholder="120 reviews" style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Image URL</label>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '500' }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Provide package itinerary highlights..." style={{ padding: '10px 12px', background: '#121214', border: '1px solid #444', borderRadius: '6px', color: '#fff', resize: 'vertical', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}></textarea>
                </div>

              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #333' }}>
                <button type="button" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={formSubmitting} style={{ padding: '10px 20px', background: '#e11d48', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', opacity: formSubmitting ? 0.6 : 1 }}>
                  {formSubmitting ? "Saving..." : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body // Mounts overlay layout cleanly right onto root DOM body level!
      )}
    </div>
  );
}
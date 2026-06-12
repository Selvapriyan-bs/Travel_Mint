import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // IMPORT PORTAL MECHANISM
import { Link, useNavigate } from 'react-router-dom';
import "./Assets/Css/Admin.css"
import axios from 'axios';
import { useSnackbar } from './Components/SnackbarProvider';
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
  X,
  Pencil,
  Trash2,
  Star,
  Mail,
  Phone,
  LogOut
} from 'lucide-react';

const fallbackAdminDestinations = [
  { id: 1, name: "Paris", country: "France", badge: "Featured", price: 1299, description: "Experience the romance of the City of Light.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" }
];

export default function Admin() {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
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

  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', category: 'Guides', readTime: '', date: '', summary: '', image: '', featured: false, content: ''
  });
  const [blogSubmitting, setBlogSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setBlogLoading(true);
    try {
      const response = await axios.get("https://trip-agent-backend.onrender.com/api/blog");
      if (response && response.data) {
        let data = response.data;
        if (!Array.isArray(data) && typeof data === 'object') data = data.data || data.blogs || [];
        if (Array.isArray(data)) setBlogs(data);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setBlogLoading(false);
    }
  };

  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [bookingSearch, setBookingSearch] = useState("");

  const fetchBookings = async () => {
    setBookingLoading(true);
    try {
      const response = await axios.get("https://trip-agent-backend.onrender.com/api/booking");
      if (response && response.data) {
        let data = response.data;
        if (!Array.isArray(data) && typeof data === "object") data = data.data || data.bookings || [];
        if (Array.isArray(data)) setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Delete this destination package?")) return;
    try {
      await axios.delete(`https://trip-agent-backend.onrender.com/api/package/${id}`);
      fetchDestinations();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to delete package", "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await axios.delete(`https://trip-agent-backend.onrender.com/api/blog/${id}`);
      fetchBlogs();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to delete blog post", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('RegistrationData');
    navigate('/login');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = bookingFilter === "all" || b.status === bookingFilter;
    const q = bookingSearch.toLowerCase();
    const matchesSearch = !q ||
      (b.customer || b.name || "").toLowerCase().includes(q) ||
      (b.destination || "").toLowerCase().includes(q) ||
      (b.email || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(String(b.total || b.price || 0).replace(/,/g, '')) || 0), 0);
  const bookedCount = bookings.filter(b => b.status === 'booked').length;
  const doneCount = bookings.filter(b => b.status === 'done').length;
  const completionRate = totalBookings > 0 ? Math.round((doneCount / totalBookings) * 100) : 0;

  const [contactMessages, setContactMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('contactMessages') || '[]'); }
    catch { return []; }
  });
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [phoneRevealed, setPhoneRevealed] = useState(null);
  const unreadContactCount = contactMessages.filter(m => !m.read).length;
  const avgRevenue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
  const pendingPercent = totalBookings > 0 ? Math.round((bookedCount / totalBookings) * 100) : 0;

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
      showSnackbar("Title and Price are required fields.", "warning");
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
          showSnackbar("Destination Package added successfully!", "success");
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
      showSnackbar(error.response?.data?.message || "Submission failed.", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

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
            {bookedCount > 0 && <span className="nav-badge">{bookedCount}</span>}
          </div>
          <div className={`nav-item ${activeView === 'destinations' ? 'active' : ''}`} onClick={() => { setActiveView('destinations'); fetchDestinations(); }}>
            <MapPin size={18} /> Destinations
          </div>
          <div className={`nav-item ${activeView === 'blogs' ? 'active' : ''}`} onClick={() => { setActiveView('blogs'); fetchBlogs(); }}>
            <MapPin size={18} /> Blog Posts
          </div>
          <div className={`nav-item ${activeView === 'messages' ? 'active' : ''}`} onClick={() => setActiveView('messages')}>
            <Bell size={18} /> Messages
            {unreadContactCount > 0 && <span className="nav-badge">{unreadContactCount}</span>}
          </div>
          <p className="nav-section-title">System</p>
          <Link to="/" className="nav-item" target="_blank" rel="noreferrer">
            <ExternalLink size={18} /> View Website
          </Link>
           <Link to="/">
          <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogOut size={18} /> Logout
          </div>
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
              {(bookedCount > 0 || unreadContactCount > 0) && <span className="notif-dot"></span>}
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
                    <div className={`stat-trend ${completionRate >= 50 ? 'up' : 'down'}`}>
                      {completionRate >= 50 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {completionRate}% completed
                    </div>
                  </div>
                  <div className="stat-value">{bookingLoading ? "..." : totalBookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-card-header">
                    <div className="stat-icon green"><DollarSign size={20} /></div>
                    <div className="stat-trend up"><TrendingUp size={14} /> avg &#8377;{avgRevenue.toLocaleString()}</div>
                  </div>
                  <div className="stat-value">&#8377;{totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Est. Revenue</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-card-header">
                    <div className="stat-icon orange"><MapPin size={20} /></div>
                    <div className="stat-trend up"><TrendingUp size={14} /> {destLoading ? "..." : "Active"}</div>
                  </div>
                  <div className="stat-value">{destLoading ? "..." : destinations.length}</div>
                  <div className="stat-label">Active Destinations</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-card-header">
                    <div className="stat-icon purple"><Clock size={20} /></div>
                    <div className={`stat-trend ${pendingPercent <= 20 ? 'up' : 'down'}`}>
                      {pendingPercent <= 20 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {pendingPercent}% of total
                    </div>
                  </div>
                  <div className="stat-value">{bookingLoading ? "..." : bookedCount}</div>
                  <div className="stat-label">New Bookings</div>
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
                      {bookingLoading ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading bookings...</td></tr>
                      ) : filteredBookings.slice(0, 3).map((item) => (
                        <tr key={item._id || item.id}>
                          <td>{item.customer || item.name || "—"}</td>
                          <td>{item.destination || "—"}</td>
                          <td>{item.pax || item.guests || 1}</td>
                          <td>&#8377;{Number(item.total || item.price || 0).toLocaleString()}</td>
                          <td><span className={`badge status-${item.status || 'pending'}`}>{item.status === 'on-trip' ? 'On Trip' : item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'}</span></td>
                          <td>{item.date || item.createdAt?.slice(0, 10) || "—"}</td>
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
                    {bookedCount} Awaiting Action
                  </span>
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
                  <input
                    type="text"
                    placeholder="Search customer or destination..."
                    className="search-input"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="filter-tabs">
                  {['all', 'assign agent', 'booked', 'contacted', 'on-trip', 'done'].map(s => (
                    <button key={s} onClick={() => setBookingFilter(s)}
                      className={`filter-tab ${bookingFilter === s ? 'active' : ''}`}
                    >
                      {s === 'all' ? 'All' : s === 'on-trip' ? 'On Trip' : s === 'assign agent' ? 'Assign Agent' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
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
                      {bookingLoading ? (
                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading bookings...</td></tr>
                      ) : filteredBookings.length === 0 ? (
                        <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
                      ) : filteredBookings.map((item) => (
                        <tr key={item._id || item.id} style={{ background: item.status === 'pending' ? 'rgba(245, 158, 11, 0.03)' : 'transparent' }}>
                          <td style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{item._id?.slice(-6) || item.id || "—"}</td>
                          <td>
                            <div style={{ fontWeight: '500' }}>{item.customer || item.name || "—"}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.email || "—"}</div>
                          </td>
                          <td>{item.destination || "—"}</td>
                          <td>{item.dates || (item.departureDate ? `${item.departureDate?.slice(0,10)} - ${item.returnDate?.slice(0,10)}` : "—")}</td>
                          <td>{item.pax || item.guests || 1} {(item.pax || item.guests || 1) === 1 ? 'Pax' : 'People'}</td>
                          <td style={{ fontWeight: '600' }}>&#8377;{Number(item.total || item.price || 0).toLocaleString()}</td>
                          <td>
                            <span className={`badge status-${item.status || 'assign agent'}`}>
                              {item.status === 'on-trip' ? 'On Trip' : item.status === 'assign agent' ? 'Assign Agent' : item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Assign Agent'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <select value={item.status || 'assign agent'} onChange={async (e) => {
                              const newStatus = e.target.value;
                              if (newStatus === item.status) return;
                              try {
                                await axios.put(`https://trip-agent-backend.onrender.com/api/booking/${item._id || item.id}`, { status: newStatus });
                                fetchBookings();
                              } catch (err) { showSnackbar("Failed to update status", "error"); }
                            }} className="status-select" style={{
                              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--primary)',
                              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                              background: 'var(--primary)', color: '#fff',
                              outline: 'none'
                            }}>
                              {['assign agent', 'booked', 'contacted', 'on-trip', 'done'].map(s => (
                                <option key={s} value={s} style={{ background: '#fff', color: 'var(--primary)' }}>
                                  {s === 'on-trip' ? 'On Trip' : s === 'assign agent' ? 'Assign Agent' : s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
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
                    <div className="dest-admin-card" key={dest.id}>
                      <div className="dest-img-wrap">
                        <img src={dest.image} alt={dest.name} />
                        <div className="dest-img-overlay"></div>
                        <div className="dest-img-actions">
                          <button className="dest-edit-btn" onClick={() => { setFormData({
                            title: dest.name, destination: dest.name, country: dest.country,
                            price: String(dest.price), description: dest.desc, image: dest.image,
                            badge: dest.badge || 'New'
                          }); setIsModalOpen(true); }}>
                            <Pencil size={14} />
                          </button>
                          <button className="dest-delete-btn" onClick={() => handleDeletePackage(dest.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {dest.badge && <span className="dest-img-badge">{dest.badge}</span>}
                      </div>
                      <div className="dest-card-body">
                        <div className="dest-card-meta">
                          <span className="dest-country"><MapPin size={12} /> {dest.country}</span>
                          {dest.rating && <span className="dest-rating"><Star size={12} fill="#f59e0b" /> {dest.rating}</span>}
                        </div>
                        <div className="dest-card-name">{dest.name}</div>
                        <div className="dest-card-desc">{dest.desc}</div>
                        <div className="dest-card-footer">
                          <div className="dest-price">&#8377;{Number(dest.price).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'blogs' && (
            <div className="view-panel active">
              <div className="section-head">
                <div>
                  <h2>Blog Posts</h2>
                  <p>Manage travel blog articles</p>
                </div>
                <button type="button" className="btn-add"
                  onClick={() => {
                    setBlogForm({ title: '', category: 'Guides', readTime: '', date: '', summary: '', image: '', featured: false, content: '' });
                    setIsBlogModalOpen(true);
                  }}>
                  <Plus size={18} /> Add Blog Post
                </button>
              </div>

              {blogLoading ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
                  <p>Loading blog posts...</p>
                </div>
              ) : (
                <div className="dest-grid">
                  {blogs.map(blog => (
                    <div className="dest-admin-card" key={blog._id || blog.id}>
                      <div className="dest-img-wrap" style={{ paddingTop: '45%' }}>
                        <img src={blog.image} alt={blog.title} />
                        <div className="dest-img-overlay"></div>
                        <div className="dest-img-actions">
                          <button className="dest-edit-btn" onClick={() => { setBlogForm({
                            title: blog.title, category: blog.category, readTime: blog.readTime || '',
                            date: blog.date || '', summary: blog.summary || '', image: blog.image || '',
                            featured: blog.featured || false, content: blog.content || ''
                          }); setIsBlogModalOpen(true); }}>
                            <Pencil size={14} />
                          </button>
                          <button className="dest-delete-btn" onClick={() => handleDeleteBlog(blog._id || blog.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {blog.featured && <span className="dest-img-badge" style={{ background: 'var(--primary)' }}>Featured</span>}
                        {blog.category && <span className="dest-img-badge" style={{ left: 'auto', right: '12px', top: 'auto', bottom: '12px', background: 'rgba(255,255,255,0.15)' }}>{blog.category}</span>}
                      </div>
                      <div className="dest-card-body">
                        <div className="dest-card-name" style={{ fontSize: '0.95rem' }}>{blog.title}</div>
                        <div className="dest-card-desc">{blog.summary}</div>
                        <div className="dest-card-footer" style={{ border: 'none', paddingTop: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{blog.date}</span>
                          {blog.readTime && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{blog.readTime}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {blogs.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                      <p>No blog posts yet. Click "Add Blog Post" to create one.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeView === 'messages' && (
            <div className="view-panel active">
              <div className="panel-header">
                <h3>Contact Messages</h3>
                <div className="panel-actions">
                  {selectMode ? (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelectMode(false); setSelectedIds([]); }}>Cancel</button>
                      {selectedIds.length > 0 && (
                        <button className="btn btn-danger btn-sm" onClick={() => {
                          const updated = contactMessages.filter(m => !selectedIds.includes(m.id));
                          localStorage.setItem('contactMessages', JSON.stringify(updated));
                          setContactMessages(updated);
                          setSelectedIds([]);
                          setSelectMode(false);
                        }}>Delete ({selectedIds.length})</button>
                      )}
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        const updated = contactMessages.map(m => ({ ...m, read: true }));
                        localStorage.setItem('contactMessages', JSON.stringify(updated));
                        setContactMessages(updated);
                      }}>Mark All Read</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectMode(true)}>Select</button>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        const updated = contactMessages.map(m => ({ ...m, read: true }));
                        localStorage.setItem('contactMessages', JSON.stringify(updated));
                        setContactMessages(updated);
                      }}>Mark All Read</button>
                    </>
                  )}
                </div>
              </div>
              {contactMessages.length === 0 ? (
                <div className="empty-state">
                  <Mail size={48} />
                  <p>No messages yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        {selectMode && <th className="checkbox-cell"><input type="checkbox" onChange={(e) => {
                          if (e.target.checked) setSelectedIds(contactMessages.map(m => m.id));
                          else setSelectedIds([]);
                        }} checked={selectedIds.length === contactMessages.length} /></th>}
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map(msg => {
                        const isSelected = selectedIds.includes(msg.id);
                        const isPhoneVisible = phoneRevealed === msg.id;
                        return (
                          <React.Fragment key={msg.id}>
                            <tr onClick={(e) => {
                              if (e.target.closest('input, button, .action-btn')) return;
                              if (!msg.read) {
                                const updated = contactMessages.map(m =>
                                  m.id === msg.id ? { ...m, read: true } : m
                                );
                                localStorage.setItem('contactMessages', JSON.stringify(updated));
                                setContactMessages(updated);
                              }
                            }} style={{ cursor: 'pointer', background: msg.read ? 'transparent' : 'rgba(99,102,241,0.05)' }}>
                              {selectMode && (
                                <td className="checkbox-cell">
                                  <input type="checkbox" checked={isSelected} onChange={() => {
                                    setSelectedIds(prev =>
                                      prev.includes(msg.id) ? prev.filter(id => id !== msg.id) : [...prev, msg.id]
                                    );
                                  }} />
                                </td>
                              )}
                              <td><strong>{msg.name}</strong></td>
                              <td>{msg.email}</td>
                              <td>{msg.subject}</td>
                              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</td>
                              <td>{new Date(msg.date).toLocaleDateString()}</td>
                              <td>{msg.read ? <span style={{ color: 'var(--text-secondary)' }}>Read</span> : <span className="status-badge pending">New</span>}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button className="action-btn action-btn-danger" title="Delete message" onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = contactMessages.filter(m => m.id !== msg.id);
                                    localStorage.setItem('contactMessages', JSON.stringify(updated));
                                    setContactMessages(updated);
                                  }}><Trash2 size={15} /></button>
                                  <button className="action-btn action-btn-phone" title="Show phone number" onClick={(e) => {
                                    e.stopPropagation();
                                    setPhoneRevealed(isPhoneVisible ? null : msg.id);
                                  }}><Phone size={15} /></button>
                                </div>
                              </td>
                            </tr>
                            {isPhoneVisible && (
                              <tr className="phone-reveal-row">
                                <td colSpan={selectMode ? 8 : 7}>
                                  <div className="phone-reveal">
                                    <Phone size={14} />
                                    {msg.phone ? (
                                      <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                                    ) : (
                                      <span style={{ color: 'var(--text-secondary)' }}>No phone number provided</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
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
        <div className="modal-portal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Travel Package</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDestinationSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Package Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Luxury Escape to Paris" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Destination City</label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="Paris" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="France" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Region / Continent</label>
                    <input type="text" name="region" value={formData.region} onChange={handleInputChange} placeholder="Europe" />
                  </div>
                  <div className="form-group">
                    <label>Duration (Days)</label>
                    <input type="number" name="days" value={formData.days} onChange={handleInputChange} placeholder="6" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (INR) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="24999" />
                  </div>
                  <div className="form-group">
                    <label>Display Badge</label>
                    <select name="badge" value={formData.badge} onChange={handleInputChange}>
                      <option value="New">New</option>
                      <option value="Featured">Featured</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Limited Offer">Limited Offer</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating (1 - 5)</label>
                    <input type="number" name="rating" min="1" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} placeholder="4.8" />
                  </div>
                  <div className="form-group">
                    <label>Reviews Count</label>
                    <input type="text" name="reviews" value={formData.reviews} onChange={handleInputChange} placeholder="120 reviews" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Provide package itinerary highlights..."></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Saving..." : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Blog Creation Modal */}
      {isBlogModalOpen && createPortal(
        <div className="modal-portal-overlay" onClick={() => setIsBlogModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Blog Post</h2>
              <button type="button" onClick={() => setIsBlogModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!blogForm.title) { showSnackbar("Title is required", "warning"); return; }
              setBlogSubmitting(true);
              try {
                const res = await axios.post("https://trip-agent-backend.onrender.com/api/blog/post", blogForm);
                if (res.data) {
                  showSnackbar("Blog post created!", "success");
                  setIsBlogModalOpen(false);
                  setBlogForm({ title: '', category: 'Guides', readTime: '', date: '', summary: '', image: '', featured: false, content: '' });
                  fetchBlogs();
                }
              } catch (err) {
                showSnackbar(err.response?.data?.message || "Failed to create blog post", "error");
              } finally {
                setBlogSubmitting(false);
              }
            }}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} required placeholder="10 Hidden Gems in Paris" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={blogForm.category} onChange={e => setBlogForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="Guides">Guides</option>
                      <option value="Dining">Dining</option>
                      <option value="Culture">Culture</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Read Time</label>
                    <input type="text" value={blogForm.readTime} onChange={e => setBlogForm(p => ({ ...p, readTime: e.target.value }))} placeholder="5 min read" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="text" value={blogForm.date} onChange={e => setBlogForm(p => ({ ...p, date: e.target.value }))} placeholder="June 2, 2026" />
                  </div>
                  <div className="form-group">
                    <label>Featured</label>
                    <select value={blogForm.featured} onChange={e => setBlogForm(p => ({ ...p, featured: e.target.value === 'true' }))}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="url" value={blogForm.image} onChange={e => setBlogForm(p => ({ ...p, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="form-group">
                  <label>Summary</label>
                  <textarea value={blogForm.summary} onChange={e => setBlogForm(p => ({ ...p, summary: e.target.value }))} rows="3" placeholder="Brief summary..."></textarea>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} rows="5" placeholder="Full article content..."></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsBlogModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={blogSubmitting}>
                  {blogSubmitting ? "Saving..." : "Save Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

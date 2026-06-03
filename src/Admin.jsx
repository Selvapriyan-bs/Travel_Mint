import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
// Note: If you're using lucide-react package, it's better to import icons directly:
// import { Compass, LayoutDashboard, CalendarCheck, MapPin, Settings, ExternalLink, ... } from 'lucide-react';

export default function Admin() {
  // 1. Manage Active View Panel State ("dashboard", "bookings", "destinations", "settings")
  const [activeView, setActiveView] = useState('dashboard');
  
  // 2. Manage Sidebar Toggle State (Mobile responsiveness)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 3. Manage Form / Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Sample Mock Data (Replace with your actual API fetch requests)
  const [bookings, setBookings] = useState([
    { id: "BK-1042", customer: "Alice Johnson", email: "alice@example.com", destination: "Paris, France", dates: "Oct 12 - Oct 18", pax: 2, total: "$2,598", status: "approved", date: "2026-05-28" },
    { id: "BK-1041", customer: "John Doe", email: "john@example.com", destination: "Tokyo, Japan", dates: "Nov 05 - Nov 12", pax: 1, total: "$1,850", status: "pending", date: "2026-05-30" },
    { id: "BK-1040", customer: "Sarah Smith", email: "sarah@example.com", destination: "Bali, Indonesia", dates: "Dec 01 - Dec 10", pax: 4, total: "$3,200", status: "completed", date: "2026-05-25" },
  ]);

  const [destinations, setDestinations] = useState([
    { id: 1, name: "Paris", country: "France", badge: "Featured", price: 1299, days: 6, rating: 4.8, reviews: 500, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", desc: "Experience the romance of the City of Light." }
  ]);

  // 5. Initialize Lucide Icons on Mount/View Changes
  useEffect(() => {
    // If you are using the global window script bundle from your original code:
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeView, isModalOpen]); // Re-run when view switches or modal opens to bind icons

  // Helper calculation for pending badge
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* ═══════════════════════════════════════
           Sidebar
      ════════════════════════════════════════ */}
      <aside className="admin-sidebar" id="adminSidebar">
        <div className="sidebar-brand">
          <div className="brand-logo"><i data-lucide="compass"></i></div>
          <span className="brand-text">Trip<span>Agent</span></span>
          <span className="sidebar-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Main</p>

          <div 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveView('dashboard')}
          >
            <i data-lucide="layout-dashboard"></i> Dashboard
          </div>

          <div 
            className={`nav-item ${activeView === 'bookings' ? 'active' : ''}`} 
            onClick={() => setActiveView('bookings')}
          >
            <i data-lucide="calendar-check"></i> Bookings
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </div>

          <div 
            className={`nav-item ${activeView === 'destinations' ? 'active' : ''}`} 
            onClick={() => setActiveView('destinations')}
          >
            <i data-lucide="map-pin"></i> Destinations
          </div>

          <p className="nav-section-title">System</p>

          <div 
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveView('settings')}
          >
            <i data-lucide="settings"></i> Settings
          </div>

          <Link to="/" className="nav-item" target="_blank" rel="noreferrer">
            <i data-lucide="external-link"></i> View Website
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Super Administrator</div>
            </div>
            <i data-lucide="chevrons-up-down" className="user-chevron"></i>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
           Main Panel Header & Content Wrap
      ════════════════════════════════════════ */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i data-lucide="menu"></i>
            </button>
            <div>
              <div className="page-title" style={{ textTransform: 'capitalize' }}>{activeView}</div>
              <div className="page-subtitle">Overview of TripAgent {activeView}</div>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" title="Notifications">
              <i data-lucide="bell"></i>
              <span className="notif-dot"></span>
            </button>
            <button className="topbar-btn" title="Refresh" onClick={() => window.location.reload()}>
              <i data-lucide="refresh-cw"></i>
            </button>
            {activeView === 'destinations' && (
              <button className="topbar-btn-primary" onClick={() => setIsModalOpen(true)}>
                <i data-lucide="plus"></i> Add Destination
              </button>
            )}
          </div>
        </header>

        <div className="admin-content">
          
          {/* ══════════════════════════════════
               DASHBOARD VIEW
          ═══════════════════════════════════ */}
          {activeView === 'dashboard' && (
            <div className="view-panel active">
              {/* Stats Row */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-card-header">
                    <div className="stat-icon blue"><i data-lucide="calendar-check"></i></div>
                    <div className="stat-trend up"><i data-lucide="trending-up"></i> +12%</div>
                  </div>
                  <div className="stat-value">{bookings.length}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-card-header">
                    <div className="stat-icon green"><i data-lucide="dollar-sign"></i></div>
                    <div className="stat-trend up"><i data-lucide="trending-up"></i> +8.4%</div>
                  </div>
                  <div className="stat-value">$7,648</div>
                  <div className="stat-label">Est. Revenue</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-card-header">
                    <div className="stat-icon orange"><i data-lucide="map-pin"></i></div>
                    <div className="stat-trend up"><i data-lucide="trending-up"></i> +2</div>
                  </div>
                  <div className="stat-value">{destinations.length}</div>
                  <div className="stat-label">Active Destinations</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-card-header">
                    <div className="stat-icon purple"><i data-lucide="clock"></i></div>
                    <div className="stat-trend down"><i data-lucide="trending-down"></i> -3</div>
                  </div>
                  <div className="stat-value">{pendingCount}</div>
                  <div className="stat-label">Pending Requests</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="dashboard-row">
                <div className="card">
                  <div className="card-header">
                    <h3>Monthly Booking Trends</h3>
                    <div className="card-header-meta">Bookings per month (last 6 months)</div>
                  </div>
                  <div className="card-body">
                    <div className="bar-chart">
                      {/* You would cleanly hook up a React Chart charting library component here like <Bar data={...} /> */}
                      <p style={{ color: 'var(--text-secondary)' }}>[Chart Placeholder]</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Booking Status</h3>
                    <div className="card-header-meta">Distribution by status</div>
                  </div>
                  <div className="card-body">
                    <div className="donut-wrapper">
                      <div className="donut-svg-container">
                        <svg width="120" height="120" viewBox="0 0 120 120"></svg>
                        <div className="donut-center-text">
                          <div className="donut-num">{bookings.length}</div>
                          <div className="donut-sub">Total</div>
                        </div>
                      </div>
                      <div className="donut-legend">
                        <div className="donut-legend-item">
                          <div className="donut-legend-dot" style={{ background: '#22c55e' }}></div>
                          <span className="donut-legend-label">Completed</span>
                          <span className="donut-legend-value">{bookings.filter(b => b.status === 'completed').length}</span>
                        </div>
                        <div className="donut-legend-item">
                          <div className="donut-legend-dot" style={{ background: '#0ea5e9' }}></div>
                          <span className="donut-legend-label">Approved</span>
                          <span className="donut-legend-value">{bookings.filter(b => b.status === 'approved').length}</span>
                        </div>
                        <div className="donut-legend-item">
                          <div className="donut-legend-dot" style={{ background: '#f59e0b' }}></div>
                          <span className="donut-legend-label">Pending</span>
                          <span className="donut-legend-value">{pendingCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table Loop */}
              <div className="recent-card">
                <div className="card-header">
                  <div>
                    <h3>Recent Bookings</h3>
                    <div className="card-header-meta">Latest customer booking requests</div>
                  </div>
                  <button className="topbar-btn-primary" style={{ fontSize: '0.83rem', padding: '8px 14px' }} onClick={() => setActiveView('bookings')}>
                    View All <i data-lucide="arrow-right"></i>
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
                          <td>{item.total}</td>
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

          {/* ══════════════════════════════════
               BOOKINGS VIEW
          ═══════════════════════════════════ */}
          {activeView === 'bookings' && (
            <div className="view-panel active">
              <div className="section-head">
                <h2>All Bookings</h2>
                <p>Manage and update all customer booking requests</p>
              </div>

              <div className="filters-bar">
                <div className="search-input-wrapper">
                  <i data-lucide="search"></i>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search by name, email, destination…" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-select" 
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="bookings-table-wrap">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Destination & Dates</th>
                        <th>Pax</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Booked On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings
                        .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                        .filter(b => b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || b.destination.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                              <div><strong>{item.customer}</strong></div>
                              <small style={{ color: 'var(--text-secondary)' }}>{item.email}</small>
                            </td>
                            <td>
                              <div>{item.destination}</div>
                              <small style={{ color: 'var(--text-secondary)' }}>{item.dates}</small>
                            </td>
                            <td>{item.pax}</td>
                            <td>{item.total}</td>
                            <td><span className={`badge status-${item.status}`}>{item.status}</span></td>
                            <td>{item.date}</td>
                            <td>
                              <button className="topbar-btn" title="Approve"><i data-lucide="check"></i></button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
               DESTINATIONS VIEW
          ═══════════════════════════════════ */}
          {activeView === 'destinations' && (
            <div className="view-panel active">
              <div className="section-head">
                <div>
                  <h2>Destinations</h2>
                  <p>Add, edit, or remove travel packages from the catalog</p>
                </div>
                <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                  <i data-lucide="plus"></i> Add Destination
                </button>
              </div>

              <div className="dest-grid">
                {destinations.map((dest) => (
                  <div className="dest-card" key={dest.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <h3>{dest.name}, {dest.country}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dest.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', alignItems: 'center' }}>
                        <span><strong>${dest.price}</strong> / pax</span>
                        <span className="badge">{dest.badge}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
               SETTINGS VIEW
          ═══════════════════════════════════ */}
          {activeView === 'settings' && (
            <div className="view-panel active">
              <div className="section-head">
                <h2>Settings</h2>
                <p>Manage admin account and system preferences</p>
              </div>
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>Admin Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" defaultValue="Admin User" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" defaultValue="admin@tripagent.com" />
                    </div>
                    <button className="modal-btn-save" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ══════════════════════════════════
           MODAL WINDOW (CONDITIONAL RENDERING)
      ═══════════════════════════════════ */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Destination</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><i data-lucide="x"></i></button>
            </div>
            <div className="modal-body">
              <form id="destForm" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid-2">
                  <div className="form-group full">
                    <label className="form-label" htmlFor="fieldName">Destination Name *</label>
                    <input type="text" className="form-input" id="fieldName" placeholder="e.g. Paris, France" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fieldCountry">Country *</label>
                    <input type="text" className="form-input" id="fieldCountry" placeholder="e.g. France" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fieldBadge">Badge Label</label>
                    <select className="form-select" id="fieldBadge" defaultValue="Featured">
                      <option value="Featured">Featured</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Recommended">Recommended</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fieldPrice">Price *</label>
                    <input type="number" className="form-input" id="fieldPrice" placeholder="e.g. 1299" required />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="modal-btn-save" onClick={() => setIsModalOpen(false)}>Save Destination</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="toast-container" id="toastContainer"></div>
    </div>
  );
}
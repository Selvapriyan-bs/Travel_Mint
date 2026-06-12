import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from './Components/SnackbarProvider';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
// import favicon from './assets/favicon.ico';
// import {img} from "../public/favicon.ico"

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Booking() {
  const showSnackbar = useSnackbar("");
  const [searchParams] = useSearchParams("");
  const packageId = searchParams.get('packageId');

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [pkg, setPkg] = useState(null);
  const [pkgLoading, setPkgLoading] = useState(!!packageId);

  const [details, setDetails] = useState({
    firstName: "", lastName: "", email: "", phone: "", from: "", guests: "1",
  });

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [departure, setDeparture] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('RegistrationData');
      if (data) {
        const parsed = JSON.parse(data);
        return { name: parsed.name || parsed.email.split('@')[0], email: parsed.email, role: parsed.role || 'user' };
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    if (!packageId) { setPkgLoading(false); return; }
    (async () => {
      try {
        const res = await axios.get(`https://trip-agent-backend.onrender.com/api/package/${packageId}`);
        if (res.data) {
          const d = res.data.data || res.data;
          setPkg(d);
        }
      } catch (err) {
        console.error("Failed to load package", err);
      } finally {
        setPkgLoading(false);
      }
    })();
  }, [packageId]);

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

  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [menuOpen, calMonth, calYear, departure, details.guests, paymentLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  const packageDays = (pkg && pkg.days > 0) ? pkg.days : 1;
  const returnDate = departure ? new Date(departure) : null;
  if (returnDate) returnDate.setDate(returnDate.getDate() + packageDays - 1);

  const formatDate = (d) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const displayDate = (d) => {
    if (!d) return '—';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const handleDayClick = (day) => {
    const clicked = new Date(calYear, calMonth, day);
    clicked.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (clicked < now) return;
    setDeparture(clicked);
  };

  const isInRange = (day) => {
    if (!departure || !returnDate) return false;
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    return d > departure && d < returnDate;
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  const quickSelect = (label) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let d = new Date(now);
    const dayOfWeek = d.getDay();
    switch (label) {
      case 'weekend':
        d.setDate(d.getDate() + (6 - dayOfWeek + 7) % 7 + 1);
        break;
      case 'nextweek':
        d.setDate(d.getDate() + (8 - dayOfWeek) % 7 + 1);
        break;
      case 'nextmonth':
        d = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default: return;
    }
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
    setDeparture(d);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => { console.error('Failed to load Razorpay SDK'); resolve(false); };
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = (amount, bookingData) => {
    const options = {
      key: "rzp_test_T0DZh4Na6BlOyI",
      amount: amount * 100,
      currency: "INR",
      name: "TripAgent",
      description: `Booking for ${pkg?.title || destName}`,
      image:  <img src="/favicon.ico" alt="favicon" /> || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80",
      prefill: { name: `${details.firstName} ${details.lastName}`, email: details.email, contact: details.phone },
      notes: bookingData,
      theme: { color: "#f97316" },
      handler: async function (response) {
        try {
          await axios.post("https://trip-agent-backend.onrender.com/api/booking/add", {
            ...bookingData, paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id, signature: response.razorpay_signature,
          });
          showSnackbar(`Payment successful! Payment ID: ${response.razorpay_payment_id}`, "success");
          setDetails({ firstName: "", lastName: "", email: "", phone: "", from: "", guests: "1" });
          setDeparture(null);
        } catch (error) {
          showSnackbar("Booking saved but payment verification pending. Contact support.", "warning");
        }
        setPaymentLoading(false);
      },
      modal: { ondismiss: () => { setPaymentLoading(false); showSnackbar("Payment cancelled.", "info"); } },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) { showSnackbar(`Payment failed: ${response.error.description}`, "error"); setPaymentLoading(false); });
    rzp.open();
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!departure) { showSnackbar("Please select a departure date from the calendar.", "warning"); return; }
    setPaymentLoading(true);
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) { showSnackbar("Payment gateway failed to load. Please try again.", "error"); setPaymentLoading(false); return; }
    const guestCount = parseInt(details.guests, 10) || 1;
    const totalPrice = (pkg?.price ?? 0) * guestCount;
    const bookingData = {
      ...details,
      destination: pkg?.destination || destName,
      packageTitle: pkg?.title || '',
      departureDate: formatDate(departure),
      returnDate: formatDate(returnDate),
    };
    openRazorpayCheckout(totalPrice, bookingData);
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('RegistrationData'); };
  const destName = pkg?.destination || (packageId ? 'Selected Package' : '—');

  const guestCount = parseInt(details.guests, 10) || 1;
  const pricePerPerson = pkg?.price ?? 0;
  const totalPrice = pricePerPerson * guestCount;

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  if (pkgLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>Loading package details...</div>;
  }

  return (
    <div>
      <title>{pkg ? `Book ${pkg.title}` : 'Book Your Journey'} — TripAgent</title>

      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />

      <section className="hero" style={{ minHeight: '40vh' }}>
        <div className="hero-bg" style={{ backgroundImage: `url('${pkg?.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80'}')` }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <h1 className="font-serif">{pkg ? `Book ${pkg.title}` : 'Book Your Dream Trip'}</h1>
          <p>{pkg ? `Secure your spot for this ${pkg.days}-day adventure` : 'Confirm details in minutes. Our team will coordinate your accommodation, transfers, and activities.'}</p>
        </div>
      </section>

      <main className="container section">
        <div className="booking-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>

          {/* Left Column — Calendar + Form */}
          <section className="booking-form-card">
            <h2>Select Your Travel Dates</h2>

            {/* Calendar */}
            <div className="calendar-container">
              <div className="calendar-header">
                <button type="button" onClick={prevMonth} className="cal-nav-btn"><i data-lucide="chevron-left"></i></button>
                <span className="cal-month-label">{MONTHS[calMonth]} {calYear}</span>
                <button type="button" onClick={nextMonth} className="cal-nav-btn"><i data-lucide="chevron-right"></i></button>
              </div>
              <div className="calendar-grid">
                {DAYS.map(d => <div className="cal-day-header" key={d}>{d}</div>)}
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`e${i}`} className="cal-day empty"></div>;
                  const date = new Date(calYear, calMonth, day);
                  date.setHours(0, 0, 0, 0);
                  const now = new Date(); now.setHours(0, 0, 0, 0);
                  const isPast = date < now;
                  const isDeparture = departure && isSameDay(date, departure);
                  const isReturn = returnDate && isSameDay(date, returnDate);
                  const inRange = isInRange(day);
                  const isToday = isSameDay(date, now);
                  let cls = 'cal-day';
                  if (isPast) cls += ' disabled';
                  if (isToday) cls += ' today';
                  if (isDeparture) cls += ' departure';
                  if (isReturn) cls += ' return';
                  if (inRange) cls += ' in-range';
                  return (
                    <div key={day} className={cls} onClick={() => !isPast && handleDayClick(day)}>
                      <span>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick select chips */}
            <div className="quick-select-chips">
              <button type="button" onClick={() => quickSelect('weekend')} className="chip">This Weekend</button>
              <button type="button" onClick={() => quickSelect('nextweek')} className="chip">Next Week</button>
              <button type="button" onClick={() => quickSelect('nextmonth')} className="chip">Next Month</button>
            </div>

            {/* Selected dates display */}
            <div className="selected-dates-bar">
              <div className="date-box">
                <span className="date-label">Departure</span>
                <span className="date-value">{departure ? displayDate(departure) : 'Not selected'}</span>
              </div>
              <i data-lucide="arrow-right" className="date-arrow"></i>
              <div className="date-box">
                <span className="date-label">Return</span>
                <span className="date-value">{returnDate ? displayDate(returnDate) : '—'}</span>
                {returnDate && <span className="date-duration">{packageDays} days</span>}
              </div>
            </div>

            {/* Passenger details */}
            <h2 style={{ marginTop: '32px' }}>Passenger Details</h2>
            <form id="bookingForm" onSubmit={handleBookingSubmit}>
              <div className="form-grid">
                <div>
                  <label><i data-lucide="user"></i> First Name</label>
                  <input type="text" name="firstName" value={details.firstName} onChange={handleChange} required placeholder="John" />
                </div>
                <div>
                  <label><i data-lucide="user"></i> Last Name</label>
                  <input type="text" name="lastName" value={details.lastName} onChange={handleChange} required placeholder="Doe" />
                </div>
                <div>
                  <label><i data-lucide="mail"></i> Email</label>
                  <input type="email" name="email" value={details.email} onChange={handleChange} required placeholder="john@example.com" />
                </div>
                <div>
                  <label><i data-lucide="phone"></i> Phone</label>
                  <input type="tel" name="phone" value={details.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label><i data-lucide="map-pin"></i> From (City)</label>
                  <input type="text" name="from" value={details.from} onChange={handleChange} required placeholder="Mumbai" />
                </div>
                <div>
                  <label><i data-lucide="users"></i> Guests</label>
                  <select name="guests" value={details.guests} onChange={handleChange}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
            </form>
          </section>

          {/* Right Column — Summary */}
          <aside className="booking-summary-card">
            {pkg?.image && (
              <div className="package-thumb" style={{ backgroundImage: `url('${pkg.image}')` }}></div>
            )}
            <h3>Trip Summary</h3>
            <ul className="summary-list">
              <li>
                <div className="label"><i data-lucide="map"></i> Destination</div>
                <div className="value">{destName}</div>
              </li>
              {pkg && (
                <li>
                  <div className="label"><i data-lucide="clock"></i> Duration</div>
                  <div className="value">{pkg.days} Days</div>
                </li>
              )}
              <li>
                <div className="label"><i data-lucide="calendar"></i> Departure</div>
                <div className="value">{departure ? displayDate(departure) : '—'}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="calendar-check"></i> Return</div>
                <div className="value">{returnDate ? displayDate(returnDate) : '—'}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="users"></i> Travelers</div>
                <div className="value">{guestCount} Guest{guestCount > 1 ? 's' : ''}</div>
              </li>
              <li>
                <div className="label"><i data-lucide="ticket"></i> Inclusions</div>
                <div className="value" style={{ fontSize: '0.85rem', opacity: 0.7, textAlign: 'right' }}>Flights, Hotels, Tours</div>
              </li>
            </ul>
            <div className="summary-total">
              <div className="total-label">Total</div>
              <div className="total-price">&#8377;{totalPrice.toLocaleString()}</div>
            </div>
            <button type="submit" form="bookingForm" className="btn btn-book" disabled={paymentLoading}>
              {paymentLoading ? "Processing..." : "Confirm & Pay"} <i data-lucide="credit-card"></i>
            </button>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

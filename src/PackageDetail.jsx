import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// Static fallback details for the 6 core packages to prevent UI failures if the database is empty or offline
const fallbackPackages = [
  {
    id: 1,
    title: "Paris Romance Package",
    destination: "Paris, France",
    region: "Europe",
    country: "France",
    price: 32050,
    days: 6,
    rating: 4.9,
    reviews: "1.2k",
    badge: "Featured",
    description: "Spend six dreamy days walking down historic avenues, cruising the Seine, and visiting magnificent galleries.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: 1, title: "Arrival & Seine Dinner Cruise", desc: "Land in Charles de Gaulle airport, transfer to a boutique hotel in the Latin Quarter, and enjoy a candlelight dinner cruise along the Seine." },
      { day: 2, title: "Eiffel Tower & Louvre Tour", desc: "Skip-the-line access to the Louvre museum in the morning, followed by an afternoon summit climb of the Eiffel Tower with local guides." },
      { day: 3, title: "Montmartre Artist Walk", desc: "Stroll the cobblestone paths of Montmartre, visit the Sacré-Cœur Basilica, and have your portrait sketched by painters at Place du Tertre." },
      { day: 4, title: "Day Trip to Palace of Versailles", desc: "Embark on a train journey to Versailles. Tour the magnificent Hall of Mirrors, Marie Antoinette's estate, and the sprawling gardens." },
      { day: 5, title: "Champs-Élysées Shopping & Tasting", desc: "Enjoy luxury shopping, visit the Arc de Triomphe, and participate in an exclusive French macaron baking class in Saint-Germain." },
      { day: 6, title: "Au Revoir Paris", desc: "Savor a final warm croissant at a corner bistro, wrap up souvenir shopping, and take your private transfer back to the airport." }
    ],
    inclusions: ["4-Star Boutique Hotel (5 Nights)", "Daily Buffet Breakfast", "All Museum Entry Tickets & Skip-Line Passes", "Seine River Dinner Cruise Ticket", "Private Airport Transfers"],
    exclusions: ["International Flights", "Lunch & Dinner (except cruise dinner)", "Personal Souvenirs & Shopping Expenses", "Local Gratuities / Tips"]
  },
  {
    id: 2,
    title: "Bali Tropical Paradise",
    destination: "Bali, Indonesia",
    region: "Asia",
    country: "Indonesia",
    price: 40320,
    days: 8,
    rating: 4.85,
    reviews: "940",
    badge: "Best Seller",
    description: "Explore lush sacred forests, rest at luxurious private villas, and enjoy world-class beaches and local food.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: 1, title: "Ubud Arrival & Canopy Check-in", desc: "Arrive in Denpasar, transfer to a cliffside rainforest resort in Ubud, and relax with a welcome flower bath." },
      { day: 2, title: "Sacred Monkey Forest & Rice Terraces", desc: "Walk through the sacred monkey forest sanctuary and explore the iconic emerald steps of Tegallalang Rice Terraces." },
      { day: 3, title: "Mount Batur Sunrise Trek", desc: "A guided early morning hike up Mount Batur volcano. Savor breakfast cooked on volcanic steam while watching the sunrise." },
      { day: 4, title: "Temple Pilgrimage (Tirta Empul)", desc: "Participate in a traditional purification ritual at the sacred springs of Tirta Empul and visit Goa Gajah cave." },
      { day: 5, title: "Transfer to Seminyak Beach Resort", desc: "Move from Ubud to a coastal resort in Seminyak. Spend the afternoon lounging poolside or walking the golden sands." },
      { day: 6, title: "Nusa Penida Island Speedboat Day", desc: "Take a fast boat to Nusa Penida. Visit the famous T-Rex cliff at Kelingking Beach and snorkel with manta rays at Crystal Bay." },
      { day: 7, title: "Tanah Lot Sunset & Seafood Feast", desc: "Tour the dramatic offshore temple of Tanah Lot and enjoy a grilled lobster dinner on the sands of Jimbaran Bay." },
      { day: 8, title: "Departure", desc: "Squeeze in one last Balinese spa massage before packing and transferring to the airport for your flight home." }
    ],
    inclusions: ["5-Star Rainforest Villa & Beachfront Resort", "Daily Breakfast & Jimbaran Beach Seafood Dinner", "Speedboat to Nusa Penida + Snorkeling Gear", "Private Dedicated English-speaking Driver", "Mount Batur Sunrise Hike Guided Tour"],
    exclusions: ["International Flights", "Lunches & Daily Dinners (except Jimbaran)", "Local Temple Donations", "Spa Treatments (Optional add-on)"]
  },
  {
    id: 3,
    title: "Kyoto Cultural Heritage",
    destination: "Kyoto, Japan",
    region: "Asia",
    country: "Japan",
    price: 55620,
    days: 7,
    rating: 4.92,
    reviews: "810",
    badge: "Trending",
    description: "Immerse yourself in traditional temples, gorgeous tea houses, and tranquil bamboo trails in historic Kyoto.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    itinerary: [
      { day: 1, title: "Kyoto Ryokan Arrival", desc: "Check into a traditional Ryokan hotel, experience sleeping on tatami mats, and enjoy an elaborate multi-course Kaiseki dinner." },
      { day: 2, title: "Fushimi Inari & Golden Pavilion", desc: "Hike through the thousands of vermilion torii gates at Fushimi Inari Shrine, followed by a visit to Kinkaku-ji (Golden Pavilion)." },
      { day: 3, title: "Arashiyama Bamboo Grove & Monkey Park", desc: "Walk the towering bamboo paths of Arashiyama, feed macaque monkeys on the mountaintop, and cross the historic Togetsukyo Bridge." },
      { day: 4, title: "Traditional Tea Ceremony & Gisha Walk", desc: "Attend a private tea ceremony led by a tea master, followed by an evening walking tour of the Gion district." },
      { day: 5, title: "Nara Day Trip (Deers & Giant Buddha)", desc: "Take the train to Nara. Feed bow-trained deer at Nara Park and stand in awe of the giant bronze Buddha statue at Todai-ji Temple." },
      { day: 6, title: "Zen Meditation & Kiyomizu-dera", desc: "Participate in a guided Zen meditation session in a quiet temple, and admire panoramic wooden stage views at Kiyomizu-dera Temple." },
      { day: 7, title: "Sayonara Japan", desc: "Purchase matcha sweets at Kyoto Station and board the Shinkansen bullet train back to Tokyo/Airport." }
    ],
    inclusions: ["Authentic Ryokan Stay (2 Nights) + Boutique Hotel (4 Nights)", "Kaiseki Dinner (Night 1) & Daily Breakfast", "All Temple Admission & Tea Ceremony Tickets", "Local Railway Pass (Kyoto-Nara-Osaka area)", "Local English-speaking Historian Guide"],
    exclusions: ["International Flights & Bullet Train Tickets", "Lunches & Dinners (except Ryokan Kaiseki)", "Kimono Rental Fees (Optional)", "Travel Insurance"]
  }
];

export default function PackageDetail() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetPackage, setTargetPackage] = useState(null);

  // URL Parameter parsing
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const activeId = paramId || queryId || "1";

  // Review System local state
  const [reviewsList, setReviewsList] = useState([
    { author: "Sarah Connor", rating: 5, date: "May 25, 2026", content: "This was the absolute highlight of our year! The organization was seamless, and the tour guides on day 2 and 4 were incredibly helpful. Highly recommend." },
    { author: "Liam Neeson", rating: 4, date: "April 18, 2026", content: "Very well structured. Accommodation exceeded expectations. I would suggest adding one more free day, but overall an excellent package." }
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch details
    const fetchPackageDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/package");
        if (response && response.data) {
          let incomingData = response.data;
          if (!Array.isArray(incomingData) && typeof incomingData === 'object') {
            incomingData = incomingData.package || incomingData.packages || incomingData.data || [];
          }
          
          const found = incomingData.find(p => String(p.id) === String(activeId) || String(p._id) === String(activeId));
          if (found) {
            // Merge with fallback itineraries if not present in DB
            const fb = fallbackPackages.find(f => String(f.id) === String(found.id)) || fallbackPackages[0];
            setTargetPackage({
              ...fb,
              ...found
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("API error fetching detail, falling back to mock details:", err);
      }

      // Fallback
      const fallback = fallbackPackages.find(f => String(f.id) === String(activeId)) || fallbackPackages[0];
      setTargetPackage(fallback);
      setLoading(false);
    };

    fetchPackageDetail();

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
  }, [activeId]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen, user, loading, reviewsList, reviewSuccess]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('RegistrationData');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newRev = {
      author: newAuthor || "Anonymous Traveler",
      rating: Number(newRating),
      date: dateStr,
      content: newContent
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewAuthor('');
    setNewRating(5);
    setNewContent('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const initialLetter = user && user.name ? user.name.charAt(0).toUpperCase() : "";

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Retrieving tour package information...</p>
        </div>
      </div>
    );
  }

  const destinationSlug = targetPackage.title.toLowerCase().includes('paris') ? 'paris' : 
                          targetPackage.title.toLowerCase().includes('bali') ? 'bali' : 
                          targetPackage.title.toLowerCase().includes('kyoto') ? 'kyoto' : 
                          targetPackage.title.toLowerCase().includes('new york') ? 'newyork' : 
                          targetPackage.title.toLowerCase().includes('sydney') ? 'sydney' : 'alps';

  return (
    <div>
      <title>{targetPackage.title} — TripAgent</title>
      <header className={`site-header hero-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <Link to="/" className="logo">
            <i data-lucide="compass"></i> Trip<span>Agent</span>
          </Link>
          
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            
            {user ? (
              <li className="mobile-only-user">
                <span className="user-welcome-text">Hello, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-logout-link">Logout</button>
              </li>
            ) : (
              <li><Link to="/Login">Login</Link></li>
            )}
          </ul>

          <div className="nav-cta">
            {user && (
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ marginRight: '10px' }}>
                <i data-lucide="layout-dashboard"></i> My Dashboard
              </Link>
            )}
            <Link to="/booking" className="btn btn-primary btn-sm"><i data-lucide="calendar"></i> Book Now</Link>
          </div>
                   
          {user && (
            <div className="user-profile-banner">
              <div className="user-text-avatar">
                {initialLetter}
              </div>
              <div className="user-info-dropdown">
                <span className="user-name">Hi, {user.name.split(' ')[0]}!</span>
                <span className="user-email-sub">{user.email}</span>
                <Link to="/dashboard" className="btn-logout" style={{ textDecoration: 'none', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i data-lucide="layout"></i> Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-logout"><i data-lucide="log-out"></i> Logout</button>
              </div>
            </div>
          )}
          
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
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '55vh' }}>
        <div className="hero-bg" style={{ backgroundImage: `url(${targetPackage.image})` }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ margin: '0 auto' }}>
          {targetPackage.badge && <span className="section-tag" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>{targetPackage.badge}</span>}
          <h1 className="font-serif" style={{ fontSize: '3rem', marginTop: '10px' }}>{targetPackage.title}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem' }}><i data-lucide="map-pin" style={{ color: 'var(--primary)', width: '18px' }}></i> {targetPackage.destination}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem' }}><i data-lucide="clock" style={{ color: 'var(--primary)', width: '18px' }}></i> {targetPackage.days} Days</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', color: 'var(--accent)' }}><i data-lucide="star" style={{ color: 'var(--accent)', width: '18px' }}></i> {targetPackage.rating} ({targetPackage.reviews} reviews)</span>
          </div>
        </div>
      </section>

      {/* Details Container */}
      <main className="container section">
        <div className="search-layout" style={{ gridTemplateColumns: '1.4fr 0.6fr' }}>
          {/* Main Details Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Overview */}
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Trip Overview</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>{targetPackage.description}</p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Day-by-Day Itinerary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid var(--border-color)', paddingLeft: '24px', marginLeft: '12px' }}>
                {targetPackage.itinerary?.map((day, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: '-33px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid var(--bg-dark)', boxShadow: '0 0 10px rgba(99,102,241,0.5)' }}></div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Day {day.day}: {day.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px', lineHeight: '1.5' }}>{day.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid-2" style={{ gap: '30px' }}>
              <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#22c55e', fontSize: '1.25rem' }}>
                  <i data-lucide="check-circle" style={{ width: '20px' }}></i> What's Included
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                  {targetPackage.inclusions?.map((inc, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <i data-lucide="check" style={{ color: '#22c55e', width: '16px', flexShrink: 0 }}></i>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ef4444', fontSize: '1.25rem' }}>
                  <i data-lucide="x-circle" style={{ width: '20px' }}></i> What's Excluded
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                  {targetPackage.exclusions?.map((exc, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <i data-lucide="x" style={{ color: '#ef4444', width: '16px', flexShrink: 0 }}></i>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Review Section */}
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Traveler Reviews</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Form to submit review */}
                <div className="card-premium" style={{ height: 'auto', padding: '24px' }}>
                  <h4>Share Your Experience</h4>
                  {reviewSuccess && (
                    <div style={{ background: 'rgba(34,197,94,0.05)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i data-lucide="smile"></i> Review posted! Thank you for sharing your feedback.
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    <div className="grid-2" style={{ gap: '16px' }}>
                      <input 
                        type="text" 
                        placeholder="Your Name (e.g. Emily Smith)" 
                        required 
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
                      />
                      <select 
                        value={newRating} 
                        onChange={(e) => setNewRating(e.target.value)}
                        style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit' }}
                      >
                        <option value="5">5 Stars (Excellent)</option>
                        <option value="4">4 Stars (Very Good)</option>
                        <option value="3">3 Stars (Average)</option>
                        <option value="2">2 Stars (Poor)</option>
                        <option value="1">1 Star (Terrible)</option>
                      </select>
                    </div>
                    <textarea 
                      rows="3" 
                      placeholder="Write your detailed review about the tour hotels, transport guides, and activities here..." 
                      required 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface-alt)', color: 'inherit', resize: 'vertical' }}
                    ></textarea>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>Post Review</button>
                  </form>
                </div>

                {/* Review Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewsList.map((rev, idx) => (
                    <div key={idx} style={{ padding: '20px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>{rev.author}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--accent)', marginBottom: '10px' }}>
                        {[...Array(5)].map((_, starIdx) => (
                          <i key={starIdx} data-lucide="star" style={{ width: '14px', fill: starIdx < rev.rating ? 'var(--accent)' : 'none', strokeWidth: 1.5 }}></i>
                        ))}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <aside>
            <div className="card-premium" style={{ height: 'auto', position: 'sticky', top: '7.5rem', padding: '24px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Starting Package Price</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 16px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>&#8377;{targetPackage.price.toLocaleString()}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ person</span>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Duration</span>
                  <strong>{targetPackage.days} Days / {targetPackage.days - 1} Nights</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Accommodation</span>
                  <strong>Included (Boutique Stay)</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tours & Guides</span>
                  <strong>Included (All Cities)</strong>
                </li>
              </ul>

              <Link 
                to={`/booking?destination=${destinationSlug}`} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '12px', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <i data-lucide="calendar"></i> Book This Deal
              </Link>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px' }}>
                Instant confirmation. Free cancellation up to 30 days prior.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <i data-lucide="compass"></i> Trip<span>Agent</span>
            </Link>
            <p>We are a leading online travel agency focused on curating premium, safe, and stress-free holiday packages for travelers worldwide.</p>
            <div className="social-links">
              <a href="#"><i data-lucide="facebook"></i></a>
              <a href="#"><i data-lucide="instagram"></i></a>
              <a href="#"><i data-lucide="twitter"></i></a>
              <a href="#"><i data-lucide="youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destination">Destinations</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Top Destinations</h3>
            <ul>
              <li><a href="#">Paris, France</a></li>
              <li><a href="#">Bali, Indonesia</a></li>
              <li><a href="#">Kyoto, Japan</a></li>
              <li><a href="#">New York, USA</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Newsletter</h3>
            <p>Subscribe to get our weekly travel guides and exclusive members-only deals.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
              <input type="email" placeholder="Your Email Address" required />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 TripAgent. All rights reserved. Built with love for travel.</p>
          <p>Terms of Service &bull; Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}

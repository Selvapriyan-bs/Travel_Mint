import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useSnackbar } from './SnackbarProvider';
import axios from 'axios';

const fallbackTop = ["Paris, France", "Bali, Indonesia", "Kyoto, Japan", "New York, USA"];

export default function Footer() {
  const showSnackbar = useSnackbar();
  const [topDestinations, setTopDestinations] = useState(fallbackTop);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://trip-agent-backend.onrender.com/api/booking");
        let data = res.data;
        if (!Array.isArray(data) && typeof data === "object") data = data.data || data.bookings || [];
        if (Array.isArray(data) && data.length > 0) {
          const freq = {};
          data.forEach(b => {
            const dest = b.destination || b.name || "";
            if (dest) freq[dest] = (freq[dest] || 0) + 1;
          });
          const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name]) => name);
          if (sorted.length > 0) setTopDestinations(sorted);
        }
      } catch (_) {}
    })();
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <i data-lucide="compass"></i> Travel<span>Mint</span>
          </Link>
          <p>We are a leading online travel agency focused on curating premium, safe, and stress-free holiday packages for travelers worldwide.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" aria-label="X (Twitter)"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="#" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destination">Destinations</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Top Destinations</h3>
          <ul>
            {topDestinations.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h3>Newsletter</h3>
          <p>Subscribe to get our weekly travel guides and exclusive members-only deals.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showSnackbar('Thank you for subscribing!', 'success'); }}>
            <input type="email" placeholder="Your Email Address" required />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2026 TravelMint. All rights reserved. Built with love for travel.</p>
        <p>Terms of Service &bull; Privacy Policy</p>
      </div>
    </footer>
  );
}

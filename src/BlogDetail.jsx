import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('RegistrationData');
      if (data) {
        const parsed = JSON.parse(data);
        return { name: parsed.name || parsed.email?.split('@')[0], email: parsed.email, role: parsed.role || 'user' };
      }
    } catch (e) { console.error(e); }
    return null;
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://trip-agent-backend.onrender.com/api/blog/${id}`);
        if (res.data) {
          const d = res.data.data || res.data;
          setPost(d);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
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

  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [menuOpen, post]);

  const handleLogout = () => { setUser(null); localStorage.removeItem('RegistrationData'); };

  function generateSampleContent(article) {
    const cat = (article.category || '').toLowerCase();
    const title = article.title || 'Travel Article';

    const intros = [
      `When it comes to ${cat === 'dining' ? 'culinary travel' : cat === 'culture' ? 'cultural exploration' : 'travel'}, few places capture the imagination quite like the destinations we feature here at TravelMint.`,
      `There's something magical about discovering new places, and ${title} is no exception.`,
      `Travel enthusiasts around the world have been talking about ${title}, and for good reason.`,
    ];

    const bodyGuides = [
      `Planning your visit requires careful consideration of timing, accommodation, and local customs. We recommend starting your research at least three months in advance to secure the best options. The peak season typically runs from late spring through early autumn, but the shoulder months offer a wonderful balance of pleasant weather and smaller crowds.`,
      `Getting around is easier than you might expect. Most major cities have reliable public transportation networks, and ride-sharing services are widely available. For those looking to venture off the beaten path, renting a car gives you the freedom to explore at your own pace.`,
      `Accommodation options range from luxury resorts to charming boutique hotels and budget-friendly hostels. Each offers a unique perspective on local life. We particularly recommend staying in neighborhoods slightly away from the main tourist hubs, where you'll find more authentic experiences and better value.`,
      `One of the highlights of any visit is the local cuisine. From street food stalls to Michelin-starred restaurants, the food scene is incredibly diverse. Don't miss the opportunity to take a cooking class — it's a fantastic way to bring a piece of your journey home with you.`,
    ];

    const bodyCulture = [
      `Immersing yourself in the local culture is the heart of any meaningful travel experience. The traditions, festivals, and daily rhythms of life offer insights that no guidebook can fully capture.`,
      `Art and architecture enthusiasts will find themselves spoiled for choice. From ancient temples and historic landmarks to cutting-edge contemporary galleries, the creative spirit of the region is on full display around every corner.`,
      `Music and performing arts play a central role in community life. Whether it's a traditional folk performance, a classical concert, or a vibrant street festival, these experiences create lasting memories and deep connections to the places we visit.`,
    ];

    const bodyDining = [
      `The culinary landscape here is a testament to centuries of trade, migration, and innovation. Each dish tells a story of cultural exchange and local ingenuity, using ingredients that have been cultivated and perfected over generations.`,
      `Street food is where some of the most exciting flavors can be found. Wander through local markets and follow the aromas — the busiest stalls are usually the best ones. Don't be afraid to try something unfamiliar; that's where the real adventure begins.`,
      `For a more formal dining experience, the city boasts an impressive array of restaurants helmed by talented chefs who are redefining traditional cuisine with modern techniques. Many offer tasting menus that showcase the very best of regional produce.`,
    ];

    const bodyDefault = [
      `This destination offers something for every type of traveler. Whether you're seeking adventure, relaxation, or cultural enrichment, you'll find it here in abundance.`,
      `The warm hospitality of the locals is immediately noticeable. Visitors often remark on how welcome they feel, and this genuine friendliness adds an extra dimension to the travel experience.`,
    ];

    const conclusions = [
      `Whether you're a seasoned traveler or planning your first big adventure, ${title} deserves a place on your bucket list. Start planning your trip today, and discover why this remarkable destination continues to captivate visitors from around the globe.`,
      `As with any journey, the memories you'll make in ${title} will stay with you long after you've returned home. The sights, sounds, and flavors become part of your own story — and that's the true magic of travel.`,
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pickMany = (arr, n) => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n);
    };

    const intro = pick(intros);
    let body;
    if (cat.includes('guide')) {
      body = pickMany(bodyGuides, 3).join('\n\n');
    } else if (cat.includes('culture')) {
      body = pickMany(bodyCulture, 2).join('\n\n');
    } else if (cat.includes('dine') || cat.includes('food') || cat.includes('restaurant')) {
      body = pickMany(bodyDining, 2).join('\n\n');
    } else {
      body = pickMany(bodyDefault, 1).join('\n\n');
    }
    const conclusion = pick(conclusions);

    const sample = `Introduction\n\n${intro}\n\n${body}\n\n${conclusion}`;
    return sample;
  }

  if (loading) {
    return (
      <div>
        <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
          Loading article...
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="" />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-muted)', textAlign: 'center', gap: '16px' }}>
          <i data-lucide="file-text" style={{ width: '48px', height: '48px', opacity: 0.4 }}></i>
          <p>Article not found.</p>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <title>{post.title || 'Blog Post'} — TravelMint</title>
      <Navbar user={user} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrolled={scrolled} activePage="blog" />

      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: `url('${post.image}')` }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in" style={{ textAlign: 'center', margin: '0 auto' }}>
          <span style={{ background: 'var(--primary)', color: '#fff', padding: '6px 16px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>{post.category}</span>
          <h1 className="font-serif">{post.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>
            {post.date && <span>{post.date}</span>}
            {post.readTime && <><span>&bull;</span><span>{post.readTime}</span></>}
          </div>
        </div>
      </section>

      <section className="section container">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {post.summary && (
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '20px' }}>
              {post.summary}
            </p>
          )}
          <div style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {(post.content || generateSampleContent(post)).split('\n').map((paragraph, i) => (
              paragraph.trim() ? <p key={i} style={{ marginBottom: '16px' }}>{paragraph}</p> : null
            ))}
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <Link to="/blog" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i data-lucide="arrow-left" style={{ width: '16px', height: '16px' }}></i> Back to Blog
            </Link>
            <Link to="/blog" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              More Articles <i data-lucide="arrow-right" style={{ width: '16px', height: '16px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ShieldCheck, 
  Navigation, 
  Zap, 
  Cpu, 
  AlertTriangle,
  ArrowRight,
  Lock,
  Activity,
  UserCheck,
  Rocket,
  Check,
  Minus,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  BookOpen,
  TrendingUp,
  Star,
  Users,
  CreditCard,
  Mail,
  Smartphone
} from 'lucide-react';
import { useParking } from './ParkingContext';

// Public relative paths
const ARTICLE_IMG = "/article.png";
const DATA_IMG = "/data.png";
const SHOWCASE_IMG = "/showcase.png";

const LandingPage = ({ onLaunch, onNavigate }) => {
  const { locationStatus, error } = useParking();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [browserInfo, setBrowserInfo] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [liveStats, setLiveStats] = useState({ users: 1240, pins: 45210 });
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setBrowserInfo(navigator.userAgent);
    setIsSecure(window.isSecureContext);
    
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 2),
        pins: prev.pins + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featureCards = [
    {
      title: "Gen-2 Precision Tracking",
      desc: "Our propriety algorithm uses multi-source sensor fusion (GPS, WiFi, Accelerometer) to pin your location with sub-meter accuracy.",
      icon: <Target size={24} className="text-blue-500" />
    },
    {
      title: "Zero-Knowledge Pins",
      desc: "Your data never leaves your device. We use industry-standard local encryption to ensure your private spots stay private.",
      icon: <Lock size={24} className="text-emerald-500" />
    },
    {
      title: "Smart Navigation",
      desc: "Integrated OSRM routing engine provides dynamic walking paths and real-time ETA updates back to your vehicle.",
      icon: <Navigation size={24} className="text-indigo-500" />
    }
  ];

  const testimonials = [
    { name: "Alex Rivet", role: "Frequent Traveler", text: "I used to take photos of parking pillars. Now, one tap and I'm free. The AR readiness is what excites me most.", rating: 5 },
    { name: "Sarah Chen", role: "City Commuter", text: "The accuracy is scary good. Even in underground garages where Google Maps dies, WIMP keeps me pinned.", rating: 5 },
    { name: "Marcus Thorne", role: "Tech Enthusiast", text: "Privacy is my #1. Knowing my locations aren't being sold to advertisers makes this the only parking app I'll use.", rating: 5 }
  ];

  const pricingTiers = [
    { 
      name: "Explorer", 
      price: "Free", 
      desc: "For the casual day-tripper.",
      features: ["Active Pinning", "Standard History", "Precision GPS", "QR Sharing"],
      button: "Current Plan",
      featured: false
    },
    { 
      name: "Ultra Pro", 
      price: "$2.99", 
      priceId: "/mo",
      desc: "For the power user and commuter.",
      features: ["Unlimited Pins", "Encrypted Cloud Sync", "AR Navigation", "Vehicle Fleet Mode", "Priority Support"],
      button: "Upgrade Now",
      featured: true
    }
  ];

  const articlesList = [
    {
      title: "The Future of Smart Parking in Megacities",
      excerpt: "As urban density increases, traditional parking is becoming obsolete. Explore how AI and sensor fusion are reimagining the way we store vehicles.",
      readTime: "6 min read",
      image: ARTICLE_IMG,
      slug: "article-parking"
    },
    {
      title: "Securing Digital Identities in Location Apps",
      excerpt: "Why 'Zero-Knowledge' isn't just a buzzword—it's the future of user trust in the mapping industry.",
      readTime: "4 min read",
      image: DATA_IMG,
      slug: "article-security"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      {/* Mesh Gradient Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3, background: 'radial-gradient(circle at 10% 10%, #1e3a8a 0%, transparent 40%), radial-gradient(circle at 90% 90%, #312e81 0%, transparent 40%)', pointerEvents: 'none' }} />

      {/* Navigation */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: '20px' }}>
          <div style={{ background: '#3b82f6', padding: 6, borderRadius: 8 }}><MapPin size={20} color="white" fill="white" /></div>
          WHERE IS MY PARK
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
           <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
           <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
           <a href="#insights" style={{ color: 'inherit', textDecoration: 'none' }}>Insights</a>
           <span onClick={() => setShowDiagnostic(true)} style={{ cursor: 'pointer', color: '#60a5fa' }}>Status</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '160px 24px 80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '100px', color: '#38bdf8', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '32px' }}>
            <Activity size={14} /> <span>{liveStats.users.toLocaleString()} Explorers Online</span>
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 10vw, 92px)', fontWeight: 900, lineHeight: 0.9, marginBottom: '28px', background: 'linear-gradient(to bottom, #ffffff 40%, #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.06em' }}>
            Find Your Way.<br />Every Single Time.
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 56px', lineHeight: 1.4 }}>
            Stop wasting time searching for your vehicle. Our Gen-2 GPS engine ensures sub-meter precision with absolute privacy.
          </p>
          <div style={{ display: 'flex', gap: 16, flexDirection: 'column', width: '100%', maxWidth: '360px' }}>
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }} 
              whileTap={{ scale: 0.98 }} 
              onClick={onLaunch} 
              style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '22px 40px', borderRadius: '24px', fontSize: '20px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            >
              Launch Platform <ArrowRight size={22} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* App Showcase Mockup */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          <img 
            src={SHOWCASE_IMG} 
            alt="App Interface" 
            style={{ width: '100%', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }} 
          />
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px' }}>Explorer Voices.</h2>
            <p style={{ color: '#64748b', fontSize: '18px' }}>Join thousand who have simplified their arrival and departure.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: '40px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '32px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: '20px', color: '#f59e0b' }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic', color: '#94a3b8' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800 }}>{t.name}</p>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px' }}>Simple, Transparent.</h2>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Start for free, upgrade when you need the edge.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {pricingTiers.map((tier, i) => (
            <div key={i} style={{ 
              flex: '1 1 380px', maxWidth: '450px', padding: '48px', 
              background: tier.featured ? 'rgba(59, 130, 246, 0.05)' : '#0f172a',
              border: tier.featured ? '2px solid #3b82f6' : '1px solid #1e293b',
              borderRadius: '40px', position: 'relative'
            }}>
              {tier.featured && <div style={{ position: 'absolute', top: -20, right: 40, background: '#3b82f6', color: 'white', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 900 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>{tier.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '16px' }}>
                <span style={{ fontSize: '48px', fontWeight: 900 }}>{tier.price}</span>
                {tier.priceId && <span style={{ color: '#64748b' }}>{tier.priceId}</span>}
              </div>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>{tier.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: '48px' }}>
                {tier.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} />
                    </div>
                    <span style={{ fontSize: '15px', color: '#94a3b8' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={onLaunch}
                style={{ width: '100%', background: tier.featured ? '#3b82f6' : '#1e293b', color: 'white', border: 'none', padding: '18px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer' }}
              >
                {tier.button}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Community / Newsletter Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px', background: 'linear-gradient(to bottom, #020617, #0f172a)', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            <Users size={32} />
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px' }}>Join the Explorer Community.</h2>
          <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '48px', lineHeight: 1.6 }}>Get early access to our AR navigation engine and receive monthy tips on optimizing your urban travel experience.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{ padding: '20px 32px', borderRadius: '20px', border: '1px solid #1e293b', background: '#020617', color: 'white', fontSize: '16px', minWidth: '300px' }} 
            />
            <button style={{ background: 'white', color: '#020617', border: 'none', padding: '20px 32px', borderRadius: '20px', fontWeight: 900, cursor: 'pointer' }}>Join Now</button>
          </div>
        </div>
      </section>

      {/* Article Insights Section */}
      <section id="insights" style={{ position: 'relative', zIndex: 1, padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6', marginBottom: 8 }}>
              <BookOpen size={18} />
              <span style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase' }}>Expert Insights</span>
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: 900 }}>The Future of Mobility</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
          {articlesList.map((article, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '32px', border: '1px solid #1e293b', overflow: 'hidden' }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>Technology</span>
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{article.readTime}</span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>{article.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>{article.excerpt}</p>
                <button 
                  onClick={() => onNavigate(article.slug)}
                  style={{ background: 'none', border: 'none', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  Read Full Article <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Diagnostic Modal */}
      <AnimatePresence>
        {showDiagnostic && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDiagnostic(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '500px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '40px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div><h2 style={{ fontSize: '28px', fontWeight: 900 }}>GPS Diagnostic</h2><p style={{ fontSize: '14px', color: '#64748b' }}>System Health & Readiness</p></div>
                 <button onClick={() => setShowDiagnostic(false)} style={{ background: '#1e293b', border: 'none', borderRadius: '50%', color: 'white', padding: '12px', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <StatusItem icon={<ShieldCheck size={20} />} active={isSecure} label="Secure Context" value={isSecure ? "ACTIVE" : "INSECURE"} color={isSecure ? "#10b981" : "#f59e0b"} />
                <StatusItem icon={<Activity size={20} />} active={locationStatus === 'ok'} label="GPS Signal" value={locationStatus?.toUpperCase()} color={locationStatus === 'ok' ? "#10b981" : "#3b82f6"} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '80px 24px 40px', textAlign: 'center', borderTop: '1px solid #1e293b', fontSize: '14px', color: '#475569' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: '24px' }}>
          <span onClick={() => onNavigate('privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span onClick={() => onNavigate('terms')} style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span>Contact</span>
        </div>
        &copy; 2026 WHERE IS MY PARK. Advanced Location Systems.
      </footer>
    </div>
  );
};

const StatusItem = ({ icon, label, value, color, active }) => (
  <div style={{ padding: '16px', background: '#1e293b', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ color: active ? color : '#475569' }}>{icon}</div>
    <div style={{ flex: 1 }}><p style={{ fontSize: '13px', fontWeight: 700 }}>{label}</p><p style={{ fontSize: '11px', fontWeight: 800, color: color }}>{value}</p></div>
  </div>
);

export default LandingPage;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Share2, Rocket, ShieldCheck, Zap } from 'lucide-react';

const ArticleLayout = ({ title, img, readTime, children, onBack }) => (
  <div style={{
    minHeight: '100vh',
    background: '#020617',
    color: 'white',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '40px 24px'
  }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', border: 'none', color: '#60a5fa', 
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          fontSize: '14px', fontWeight: 600, marginBottom: '40px' 
        }}
      >
        <ArrowLeft size={18} /> Back to Insights
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>Technology</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '12px' }}>
          <Clock size={12} /> {readTime}
        </div>
      </div>
      
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
      
      <div style={{ width: '100%', borderRadius: '32px', overflow: 'hidden', marginBottom: '48px', border: '1px solid #1e293b' }}>
        <img src={img} alt={title} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <div style={{ 
        lineHeight: 1.8, color: '#94a3b8', fontSize: '18px',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        {children}
      </div>

      <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '32px', textAlign: 'center', border: '1px solid #1e293b' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>Want to try it yourself?</h3>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Experience the Gen-2 GPS engine and secure your parking spot today.</p>
        <button 
           onClick={() => window.location.reload()}
           style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer' }}
        >
          Launch Platform Free
        </button>
      </div>
    </div>
  </div>
);

export const ArticleSmartParking = ({ onBack }) => (
  <ArticleLayout 
    title="The Future of Smart Parking in Megacities" 
    img="/article.png" 
    readTime="6 min read"
    onBack={onBack}
  >
    <p>As urban density continues to skyrocket, the traditional concept of "finding a spot" is rapidly becoming a relic of the past. In cities like New York, London, and Tokyo, drivers spend an average of 107 hours per year searching for parking, contributing significantly to urban congestion and carbon emissions.</p>
    
    <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginTop: '24px' }}>Sensor Fusion: The New Backbone</h2>
    <p>The core of modern parking innovation lies in sensor fusion. By combining traditional GPS data with accelerometers, Wi-Fi fingerprinting, and Bluetooth beacons, we can now create "High-Definition" location fixes even in the deep shadows of skyscrapers where GPS traditionally fails.</p>

    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '24px', borderLeft: '4px solid #3b82f6' }}>
      <p style={{ color: 'white', fontStyle: 'italic', fontWeight: 500 }}>"The goal isn't just to find a spot; it's to eliminate the cognitive load of navigation entirely."</p>
    </div>

    <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginTop: '24px' }}>Privacy as a Product Feature</h2>
    <p>In an era of mass surveillance, knowing exactly where someone parks their car is sensitive data. That's why Gen-2 platforms are moving toward Zero-Knowledge architectures. Your habits, your locations, and your routines should never leave the palm of your hand.</p>
  </ArticleLayout>
);

export const ArticleSecurity = ({ onBack }) => (
  <ArticleLayout 
    title="Securing Digital Identities in Location Apps" 
    img="/data.png" 
    readTime="4 min read"
    onBack={onBack}
  >
    <p>Privacy is no longer an optional add-on; it is a fundamental human right in the digital age. Most mapping applications track your every move back to a central server, building a profile of your life without your explicit consent.</p>

    <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginTop: '24px' }}>The Zero-Knowledge Standard</h2>
    <p>With Zero-Knowledge encryption, the platform facilitates the service without ever seeing the content. When you pin a parking spot, that coordinate is encrypted with keys stored only on your local chipset. Even the platform developers cannot see where you parked.</p>

    <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginTop: '24px' }}>Local-First Architecture</h2>
    <p>By prioritizing LocalStorage and indexedDB, we ensure that your data is fast, accessible offline, and physically under your control. This shift from "Cloud-First" to "Local-First" is the cornerstone of modern secure application design.</p>
  </ArticleLayout>
);

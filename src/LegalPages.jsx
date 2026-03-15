import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Lock, Globe } from 'lucide-react';

const LegalLayout = ({ title, children, onBack }) => (
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
        <ArrowLeft size={18} /> Back to Home
      </button>
      
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em' }}>{title}</h1>
      <p style={{ color: '#64748b', marginBottom: '48px' }}>Last updated: March 15, 2026</p>
      
      <div style={{ 
        lineHeight: 1.8, color: '#94a3b8', fontSize: '16px',
        display: 'flex', flexDirection: 'column', gap: '32px'
      }}>
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = ({ onBack }) => (
  <LegalLayout title="Privacy Policy" onBack={onBack}>
    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>1. Zero-Knowledge Commitment</h2>
      <p>Where Is My Park is built on a "Privacy First" architecture. Unlike traditional tracking apps, we do not store your location data on our servers. All parking pins, notes, and photos are stored exclusively on your device using browser local storage.</p>
    </section>

    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>2. Data Collection</h2>
      <p>We do not require account creation. We do not collect names, email addresses, or phone numbers. The only technical data processed is your immediate GPS coordinates, which are used solely to display your position on the map and calculate walking routes.</p>
    </section>

    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>3. How Your Data is Used</h2>
      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <li><strong>Location:</strong> Used locally to pin your vehicle.</li>
        <li><strong>Storage:</strong> LocalStorage is used to remember your spots between sessions.</li>
        <li><strong>Camera/Mic:</strong> Only used if you choose to attach a photo or voice memo to a pin.</li>
      </ul>
    </section>
    
    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>4. Third-Party Services</h2>
      <p>We use OpenStreetMap and OSRM for mapping and routing. These services receive your coordinates to provide map tiles and directions but do not receive any personal identifiers from our application.</p>
    </section>
  </LegalLayout>
);

export const TermsOfService = ({ onBack }) => (
  <LegalLayout title="Terms of Service" onBack={onBack}>
    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>1. Use of Service</h2>
      <p>Where Is My Park is a tool provided for convenience. Users are responsible for ensuring they park in legal, designated areas. The app does not guarantee the safety of your vehicle or its contents.</p>
    </section>

    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>2. Accuracy Disclaimer</h2>
      <p>GPS accuracy depends on your device and environmental factors. We provide high-precision tools, but users should always use their own judgment when navigating to their vehicle.</p>
    </section>

    <section>
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>3. Modification of Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
    </section>
  </LegalLayout>
);

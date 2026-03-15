# Where Is My Park (WIMP) 🚗📍

**The World's Most Advanced Precision Parking Assistant.**

Where Is My Park (WIMP) isn't just a location pin; it's a premium, privacy-first ecosystem designed to eliminate the anxiety of urban mobility. Built with high-precision sensor fusion and a zero-knowledge architecture, WIMP ensures you find your vehicle every single time, without compromise.

![App Showcase](https://where-did-i-park-web.vercel.app/showcase.png)

## ✨ Core Features

- **Gen-2 Precision Tracking**: Proprietary multi-source sensor fusion (GPS, WiFi, Accelerometer, Magnetometer) for sub-meter accuracy even in "GPS Shadow" areas.
- **Zero-Knowledge Privacy**: Your location data never touches our servers. Period. Local-only encryption ensures your private routines stay private.
- **Smart Navigation**: Integrated OSRM walking-first routing provides dynamic paths and real-time ETA updates.
- **Ultra-Premium UI**: A glassmorphic, mobile-first interface designed for immediate clarity and emotional delight.
- **QR Sharing**: Securely share your parking spot with friends or family via encrypted QR codes.
- **Offline Readiness**: PWA support ensures that even with poor connectivity, your coordinates and notes are always accessible.

## 🛠️ Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Vanilla CSS with Framer Motion for high-fidelity animations
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Routing**: OSRM (Open Source Routing Machine)
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics (Privacy-focused)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/priyanshu9888/where-did-i-park.git
   cd where-did-i-park
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🛡️ Privacy & Security

WIMP is built on a "Privacy First" foundation:
- **No Account Required**: We don't ask for your name, email, or phone number.
- **LocalStorage Storage**: All pins and history are stored directly on your browser's LocalStorage.
- **Encrypted Pins**: High-sensitivity spots can be toggled to "Incognito" mode.

## 🗺️ Roadmap

- [x] Gen-2 Location Engine (Released)
- [x] Multi-page SEO Optimization (Released)
- [ ] AR Navigation (Q3 2026)
- [ ] Vehicle Fleet Management (Q4 2026)

---

Developed with ❤️ for the Modern Explorer. Visit the live platform: [where-did-i-park-web.vercel.app](https://where-did-i-park-web.vercel.app)

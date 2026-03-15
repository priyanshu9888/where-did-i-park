import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  StickyNote, 
  Camera, 
  History, 
  ChevronUp, 
  X,
  Navigation2,
  Trash2,
  CheckCircle2,
  Share2,
  DollarSign,
  Users,
  Coffee,
  Star,
  Layers,
  Map as MapIcon,
  Hash,
  Mic,
  MicOff,
  Play,
  Square,
  Cloud,
  Sun,
  Utensils,
  Landmark,
  QrCode,
  Zap,
  ShieldCheck,
  Smartphone,
  Search,
  Download,
  Upload,
  Car,
  Bike,
  Truck,
  Loader2
} from 'lucide-react';
import { format, addMinutes, differenceInSeconds } from 'date-fns';
import { useParking, ParkingProvider } from './ParkingContext';
import LandingPage from './LandingPage';
import { PrivacyPolicy, TermsOfService } from './LegalPages';
import { ArticleSmartParking, ArticleSecurity } from './ArticlePages';

// --- Components ---

import { MapContainer, TileLayer, Marker, useMap, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Car Icon
const carIcon = L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="background: #4CAF50; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.6C2.1 11.1 2 11.6 2 12s.1.9.4 1.2c.3.3.6.5 1 .5h1c.1 0 .3 0 .4-.1l.6.9c.3.5.9.8 1.5.8h9.2c.6 0 1.2-.3 1.5-.8l.6-.9c.1.1.3.1.4.1zM5 19c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm14 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const hasValidCoordinates = (coords) => (
  Number.isFinite(coords?.lat) && Number.isFinite(coords?.lng)
);

// Helper component to center map - only once on first location fix
const RecenterMap = ({ coords, once = false, resetKey = 0 }) => {
  const map = useMap();
  const hasRecentered = React.useRef(false);

  useEffect(() => {
    hasRecentered.current = false;
  }, [resetKey]);

  useEffect(() => {
    if (hasValidCoordinates(coords)) {
      if (!once || !hasRecentered.current) {
        map.setView([coords.lat, coords.lng], 16, { animate: true });
        hasRecentered.current = true;
      }
    }
  }, [coords, map, once, resetKey]);

  return null;
};

const MapBackground = ({ nearbySpots = [], selectedNearbySpot = null, recenterKey = 0, navigationTarget = null }) => {
  const { activeSpots, location, mapTheme } = useParking();

  const getTileUrl = () => {
    switch(mapTheme) {
      case 'satellite': return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'dark': return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      default: return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  };

  const attribution = mapTheme === 'satellite' 
    ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url={getTileUrl()}
          attribution={attribution}
        />
        {/* Current location — pulsing blue dot */}
        {hasValidCoordinates(location) && (
          <>
            {/* Outer pulse ring */}
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={20}
              pathOptions={{
                color: '#1976D2',
                fillColor: '#1976D2',
                fillOpacity: 0.12,
                weight: 0,
              }}
            />
            {/* Accuracy ring */}
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={13}
              pathOptions={{
                color: '#1976D2',
                fillColor: '#1976D2',
                fillOpacity: 0.18,
                weight: 2,
                dashArray: '4 3',
              }}
            />
            {/* Solid dot */}
            <CircleMarker
              center={[location.lat, location.lng]}
              radius={7}
              pathOptions={{
                color: 'white',
                fillColor: '#1976D2',
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -12]}>
                <span style={{ fontWeight: 700, fontSize: 11, color: '#1976D2' }}>You are here</span>
              </Tooltip>
            </CircleMarker>
          </>
        )}
  {activeSpots.filter(hasValidCoordinates).map(spot => (
          <React.Fragment key={spot.id}>
            <Marker position={[spot.lat, spot.lng]} icon={carIcon} />
            {hasValidCoordinates(location) && (
              <Polyline 
                positions={[
                  [location.lat, location.lng],
                  [spot.lat, spot.lng]
                ]}
                color={activeSpots[0]?.id === spot.id ? "#1976D2" : "#aaa"}
                weight={activeSpots[0]?.id === spot.id ? 4 : 2}
                opacity={activeSpots[0]?.id === spot.id ? 0.6 : 0.3}
                dashArray="10, 10"
              />
            )}
          </React.Fragment>
        ))}
        {/* Nearby parking spots from OSM */}
        {nearbySpots.map(spot => {
          const isSelected = selectedNearbySpot?.id === spot.id;
          return (
            <React.Fragment key={spot.id}>
              {/* Outer glow ring */}
              <CircleMarker
                center={[spot.lat, spot.lng]}
                radius={isSelected ? 22 : 12}
                pathOptions={{
                  color: isSelected ? '#FF6B00' : '#FF9800',
                  fillColor: isSelected ? '#FF6B00' : '#FF9800',
                  fillOpacity: isSelected ? 0.25 : 0.15,
                  weight: isSelected ? 3 : 2,
                }}
              />
              {/* Inner solid dot */}
              <CircleMarker
                center={[spot.lat, spot.lng]}
                radius={isSelected ? 10 : 6}
                pathOptions={{
                  color: 'white',
                  fillColor: isSelected ? '#FF6B00' : '#FF9800',
                  fillOpacity: 1,
                  weight: 2,
                }}
              >
                <Tooltip permanent={isSelected} direction="top" offset={[0, -10]}>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>
                    {spot.name || 'Parking'}
                  </span>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          );
        })}
        {selectedNearbySpot && <RecenterMap coords={{ lat: selectedNearbySpot.lat, lng: selectedNearbySpot.lng }} />}
        {!selectedNearbySpot && hasValidCoordinates(location) && (
          <RecenterMap coords={location} once={true} resetKey={recenterKey} />
        )}

        {/* In-app navigation route */}
        {navigationTarget && hasValidCoordinates(location) && hasValidCoordinates(navigationTarget) && (
          <>
            {navigationTarget.route && Array.isArray(navigationTarget.route) ? (
              <Polyline
                positions={navigationTarget.route}
                color="#1976D2"
                weight={4}
                opacity={0.9}
              />
            ) : (
              <Polyline 
                positions={[[location.lat, location.lng], [navigationTarget.lat, navigationTarget.lng]]}
                color="#1976D2"
                weight={4}
                opacity={0.8}
              />
            )}
            <Marker position={[navigationTarget.lat, navigationTarget.lng]} />
            <RecenterMap coords={navigationTarget.route && navigationTarget.route.length ? { lat: navigationTarget.route[navigationTarget.route.length-1][0], lng: navigationTarget.route[navigationTarget.route.length-1][1] } : navigationTarget} once={true} resetKey={recenterKey} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

const MapThemeSwitcher = () => {
  const { mapTheme, setMapTheme } = useParking();

  const themes = [
    { id: 'standard', label: 'Street', icon: <MapIcon size={16} /> },
    { id: 'satellite', label: 'Satellite', icon: <Layers size={16} /> },
    { id: 'dark', label: 'Dark', icon: <Layers size={16} /> },
  ];

  return (
    <div style={{ 
      position: 'absolute', top: 120, left: 20, 
      display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 
    }}>
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setMapTheme(t.id)}
          style={{
            background: mapTheme === t.id ? '#1976D2' : 'white',
            color: mapTheme === t.id ? 'white' : '#444',
            width: 44, height: 44, borderRadius: 12,
            cursor: 'pointer', transition: 'all 0.2s', border: mapTheme === t.id ? '2px solid white' : 'none'
          }}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

// --- Distance & Bearing Helpers ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const getBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
};

const FloatingActionCard = ({ onOpenForm, onOpenQR, onNavigate, isUnlocked }) => {
  const { activeSpots, location, clearSpot } = useParking();
  const [secondsRemaining, setSecondsRemaining] = useState({});
  const [metrics, setMetrics] = useState({});

  const visibleSpots = activeSpots.filter(s => !s.isSecret || isUnlocked);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSeconds = {};
      const newMetrics = {};

      visibleSpots.forEach(spot => {
        if (spot.timerEndTime) {
          const diff = differenceInSeconds(new Date(spot.timerEndTime), new Date());
          newSeconds[spot.id] = diff > 0 ? diff : 0;
        }

        if (location) {
          const d = getDistance(location.lat, location.lng, spot.lat, spot.lng);
          const b = getBearing(location.lat, location.lng, spot.lat, spot.lng);
          const eta = Math.ceil(d / 80); // ~5km/h walking speed (83m/min)
          newMetrics[spot.id] = { distance: d, bearing: b, eta };

          if (d < 30) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          } else if (d < 100) {
            if (navigator.vibrate) navigator.vibrate(100);
          }
        }
      });

      setSecondsRemaining(newSeconds);
      setMetrics(newMetrics);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSpots, location, visibleSpots]);

  const handleShare = async (spot) => {
    const shareData = {
      title: `Saved ${spot.category || 'Location'}`,
      text: `${spot.note || 'Where Did I Park?'}\nLocation: https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.text);
        alert('Location link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const formatTime = (s) => {
    if (!s) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'meeting': return <Users size={20} color="#1976D2" />;
      case 'food': return <Coffee size={20} color="#FF9800" />;
      case 'gem': return <Star size={20} color="#E91E63" />;
      default: return <MapIcon size={20} color="#4CAF50" />;
    }
  };

  if (visibleSpots.length === 0) {
    if (activeSpots.some(s => s.isSecret) && !isUnlocked) {
      return (
        <motion.div 
          className="premium-card"
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{ position: 'absolute', bottom: 24, left: 24, right: 24, padding: '20px', zIndex: 10, maxWidth: 500, margin: '0 auto', pointerEvents: 'auto', textAlign: 'center' }}
        >
          <ShieldCheck size={40} color="#1976D2" style={{ marginBottom: 12 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Secure Pins Hidden</h2>
          <p style={{ color: '#666', marginBottom: 20, fontSize: 13 }}>You have secret pins saved. Unlock to view them.</p>
        </motion.div>
      );
    }
    return (
      <motion.div 
        className="premium-card"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'absolute', bottom: 24, left: 24, right: 24,
          padding: '20px', zIndex: 10, maxWidth: 500, margin: '0 auto', pointerEvents: 'auto'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#111' }}>Where are you?</h2>
          <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Pin your location to find it later instantly.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button className="btn-primary" style={{ padding: '14px' }} onClick={onOpenForm}>
          <MapPin size={18} />
          Park Here
        </button>
            <button className="btn-primary" style={{ background: '#f5f5f5', color: '#111', padding: '14px' }} onClick={onOpenForm}>
               <Star size={18} />
               Pin Spot
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 12, right: 12, zIndex: 10,
      display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '40vh', overflowY: 'auto',
      paddingBottom: 10, pointerEvents: 'auto'
    }}>
      {visibleSpots.map((spot, index) => (
        <motion.div 
          key={spot.id}
          className="premium-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          style={{ padding: '16px', maxWidth: 500, margin: '0 auto', width: '95%' }}
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {spot.photo ? (
              <div style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={spot.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ 
                width: 50, height: 50, borderRadius: 10, background: '#f8f9fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {getCategoryIcon(spot.category)}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{spot.category?.charAt(0).toUpperCase() + spot.category?.slice(1)}</h2>
                <div style={{ display: 'flex', gap: 6 }}>
                  {metrics[spot.id] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E3F2FD', padding: '3px 6px', borderRadius: 6 }}>
                       <span style={{ fontSize: 10, fontWeight: 800, color: '#1976D2' }}>
                          {metrics[spot.id].eta}m walk
                       </span>
                    </div>
                  )}
                  {metrics[spot.id] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E3F2FD', padding: '3px 6px', borderRadius: 6 }}>
                       <motion.div animate={{ rotate: metrics[spot.id].bearing }} transition={{ type: 'spring', damping: 10 }}>
                          <Navigation size={10} fill="#1976D2" color="#1976D2" />
                       </motion.div>
                       <span style={{ fontSize: 10, fontWeight: 800, color: '#1976D2' }}>
                          {metrics[spot.id].distance > 1000 ? `${(metrics[spot.id].distance/1000).toFixed(1)}km` : `${Math.round(metrics[spot.id].distance)}m`}
                       </span>
                    </div>
                  )}
                </div>
              </div>
              <p style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{spot.note || 'No notes'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 12 }} onClick={() => {
              if (typeof onNavigate === 'function') onNavigate({ id: spot.id, lat: spot.lat, lng: spot.lng, note: spot.note, category: spot.category, timestamp: spot.timestamp });
            }}>
              <Navigation size={14} /> Navigate
            </button>
            {spot.audio && (
              <button 
                className="btn-primary" 
                style={{ background: '#eef6ff', color: '#1976D2', padding: '0 10px' }} 
                onClick={() => new Audio(spot.audio).play()}
              >
                <Play size={14} fill="#1976D2" />
              </button>
            )}
            <button className="btn-primary" style={{ background: '#f5f5f5', color: '#111', padding: '0 10px' }} onClick={() => handleShare(spot)}>
              <Share2 size={14} />
            </button>
            <button className="btn-primary" style={{ background: '#f5f5f5', color: '#111', padding: '0 10px' }} onClick={() => onOpenQR({ id: spot.id, lat: spot.lat, lng: spot.lng, note: spot.note, category: spot.category, timestamp: spot.timestamp })}>
              <QrCode size={14} />
            </button>
            <button className="btn-primary" style={{ background: '#f5f5f5', color: '#d32f2f', padding: '0 10px' }} onClick={() => clearSpot(spot.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


// --- Nearby Parking Panel ---

const VEHICLE_TYPES = [
  { id: 'car',        label: 'Car',        icon: '🚗', query: `node["amenity"="parking"](around:1500,LAT,LNG);way["amenity"="parking"](around:1500,LAT,LNG);` },
  { id: 'bike',       label: 'Bike',       icon: '🚲', query: `node["amenity"="bicycle_parking"](around:1500,LAT,LNG);way["amenity"="bicycle_parking"](around:1500,LAT,LNG);` },
  { id: 'truck',      label: 'Truck',      icon: '🚛', query: `node["amenity"="parking"]["hgv"~"yes|designated"](around:3000,LAT,LNG);way["amenity"="parking"]["hgv"~"yes|designated"](around:3000,LAT,LNG);` },
  { id: 'motorcycle', label: 'Moto',       icon: '🏍️', query: `node["amenity"="motorcycle_parking"](around:1500,LAT,LNG);way["amenity"="motorcycle_parking"](around:1500,LAT,LNG);` },
  { id: 'disabled',   label: 'Accessible', icon: '♿', query: `node["amenity"="parking"]["capacity:disabled"](around:1500,LAT,LNG);way["amenity"="parking"]["capacity:disabled"](around:1500,LAT,LNG);` },
];

const fetchNearbyParking = async (lat, lng, vehicleType) => {
  const vt = VEHICLE_TYPES.find(v => v.id === vehicleType) || VEHICLE_TYPES[0];
  const rawQuery = vt.query.replace(/LAT/g, lat).replace(/LNG/g, lng);
  const overpassQuery = `[out:json][timeout:25];(${rawQuery});out center body;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return (data.elements || []).map(el => ({
    id: el.id,
    lat: el.lat ?? el.center?.lat,
    lng: el.lon ?? el.center?.lon,
    name: el.tags?.name || el.tags?.['name:en'] || null,
    capacity: el.tags?.capacity || null,
    fee: el.tags?.fee || null,
    access: el.tags?.access || null,
    openingHours: el.tags?.opening_hours || null,
    operator: el.tags?.operator || null,
    vehicleType,
  })).filter(s => s.lat && s.lng);
};

const NearbyParkingPanel = ({ isOpen, onClose, onSpotsChange, onSelectSpot, selectedSpot, onNavigate }) => {
  const { location } = useParking();
  const [vehicleType, setVehicleType] = useState('car');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doSearch = useCallback(async (type) => {
    if (!location) { setError('Location not available yet.'); return; }
    setLoading(true); setError(null);
    try {
      const results = await fetchNearbyParking(location.lat, location.lng, type);
      // Sort by distance
      const withDist = results.map(s => ({
        ...s,
        distance: getDistance(location.lat, location.lng, s.lat, s.lng)
      })).sort((a, b) => a.distance - b.distance);
      setSpots(withDist);
      onSpotsChange(withDist);
    } catch(e) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [location, onSpotsChange]);

  useEffect(() => {
    if (isOpen) doSearch(vehicleType);
  }, [isOpen, vehicleType]);

  // Clear markers when panel closes
  useEffect(() => {
    if (!isOpen) { setSpots([]); onSpotsChange([]); }
  }, [isOpen]);

  const formatDist = (m) => m >= 1000 ? `${(m/1000).toFixed(1)} km` : `${Math.round(m)} m`;

  const vehicleColors = { car: '#1976D2', bike: '#4CAF50', truck: '#FF6B00', motorcycle: '#9C27B0', disabled: '#00BCD4' };
  const color = vehicleColors[vehicleType] || '#1976D2';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 30 }}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28,
              padding: '20px 20px 40px', zIndex: 40,
              maxHeight: '75vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Handle bar */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e0e0e0', margin: '0 auto 16px' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>Find Nearby Parking</h2>
                <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {spots.length > 0 ? `${spots.length} spots found nearby` : 'Searching around your location...'}
                </p>
              </div>
              <button onClick={onClose} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Vehicle Type Chips */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 12, flexShrink: 0 }}>
              {VEHICLE_TYPES.map(vt => (
                <button
                  key={vt.id}
                  onClick={() => setVehicleType(vt.id)}
                  style={{
                    flexShrink: 0, padding: '8px 14px', borderRadius: 20,
                    border: `2px solid ${vehicleType === vt.id ? vehicleColors[vt.id] : '#eee'}`,
                    background: vehicleType === vt.id ? vehicleColors[vt.id] : 'white',
                    color: vehicleType === vt.id ? 'white' : '#555',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                    boxShadow: vehicleType === vt.id ? `0 4px 12px ${vehicleColors[vt.id]}40` : 'none'
                  }}
                >
                  <span>{vt.icon}</span>
                  {vt.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 12 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={32} color={color} />
                  </motion.div>
                  <p style={{ color: '#888', fontSize: 14 }}>Searching nearby...</p>
                </div>
              )}

              {error && !loading && (
                <div style={{ textAlign: 'center', padding: 32, color: '#d32f2f' }}>
                  <p style={{ fontWeight: 600, marginBottom: 12 }}>{error}</p>
                  <button
                    onClick={() => doSearch(vehicleType)}
                    style={{ background: color, color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}
                  >Retry</button>
                </div>
              )}

              {!loading && !error && spots.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: 40, color: '#aaa' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🅿️</div>
                  <p style={{ fontWeight: 600 }}>No {VEHICLE_TYPES.find(v=>v.id===vehicleType)?.label} parking found nearby</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>Try a different vehicle type or expand your search area</p>
                </div>
              )}

              {!loading && spots.map((spot, i) => {
                const isSelected = selectedSpot?.id === spot.id;
                return (
                  <motion.div
                    key={spot.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => onSelectSpot(isSelected ? null : spot)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderRadius: 16, marginBottom: 8, cursor: 'pointer',
                      border: `2px solid ${isSelected ? color : '#f0f0f0'}`,
                      background: isSelected ? `${color}08` : '#fafafa',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Distance badge */}
                    <div style={{
                      minWidth: 56, height: 56, borderRadius: 14,
                      background: isSelected ? color : `${color}18`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: isSelected ? 'white' : color, textTransform: 'uppercase', letterSpacing: 0.5 }}>Away</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'white' : color, lineHeight: 1.2 }}>
                        {formatDist(spot.distance)}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {spot.name || `Parking Spot`}
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {spot.capacity && <span style={{ fontSize: 10, background: '#f0f0f0', padding: '2px 6px', borderRadius: 6, color: '#555', fontWeight: 600 }}>Cap: {spot.capacity}</span>}
                        {spot.fee === 'yes' && <span style={{ fontSize: 10, background: '#fff3e0', padding: '2px 6px', borderRadius: 6, color: '#E65100', fontWeight: 600 }}>Paid</span>}
                        {spot.fee === 'no' && <span style={{ fontSize: 10, background: '#e8f5e9', padding: '2px 6px', borderRadius: 6, color: '#2E7D32', fontWeight: 600 }}>Free</span>}
                        {spot.access && spot.access !== 'yes' && <span style={{ fontSize: 10, background: '#fce4ec', padding: '2px 6px', borderRadius: 6, color: '#880E4F', fontWeight: 600 }}>{spot.access}</span>}
                        {!spot.capacity && !spot.fee && <span style={{ fontSize: 10, color: '#aaa' }}>Tap to show on map</span>}
                      </div>
                    </div>

                    {/* Navigate button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); if (typeof onNavigate === 'function') onNavigate({ id: spot.id, lat: spot.lat, lng: spot.lng, note: spot.note, category: spot.vehicleType || spot.category }); }}
                      style={{
                        background: color, color: 'white', border: 'none',
                        borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}
                    >
                      <Navigation size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ActionForm = ({ isOpen, onClose, initialCategory = 'parking' }) => {
  const { saveSpot } = useParking();
  const [note, setNote] = useState('');
  const [timer, setTimer] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isSecret, setIsSecret] = useState(false);

  // Voice Memo State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
      setNote('');
      setPhoto(null);
      setAudio(null);
      setTimer(null);
      setIsSecret(false);
      setRecordingTime(0);
      setIsRecording(false);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => setAudio(reader.result);
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
      alert("Please enable microphone access to record memos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  
  const categories = [
    { id: 'parking', label: 'Parking', icon: <MapIcon size={18} /> },
    { id: 'meeting', label: 'Meeting', icon: <Users size={18} /> },
    { id: 'food', label: 'Food', icon: <Coffee size={18} /> },
    { id: 'gem', label: 'Gem', icon: <Star size={18} /> },
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let endTime = null;
    if (timer) {
      endTime = addMinutes(new Date(), timer).toISOString();
    }
    saveSpot({ 
      note, 
      timerEndTime: endTime, 
      photo, 
      audio,
      category,
      isSecret
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            paddingBottom: 48,
            zIndex: 100,
            boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Save location</h2>
            <button onClick={onClose} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Category Picker */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: '#444' }}>Category</label>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: '10px 16px',
                    borderRadius: 14,
                    border: '1px solid',
                    borderColor: category === cat.id ? '#1976D2' : '#eee',
                    background: category === cat.id ? '#eef6ff' : 'white',
                    color: category === cat.id ? '#1976D2' : '#666',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo & Audio Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div 
              onClick={() => document.getElementById('photo-input').click()}
              style={{ 
                height: 100, borderRadius: 16, background: '#f5f5f5',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', border: '2px dashed #ddd', gap: 8
              }}
            >
              {photo ? (
                <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Camera size={24} color="#999" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>Add Photo</span>
                </>
              )}
            </div>
            
            <div 
              style={{ 
                height: 100, borderRadius: 16, background: isRecording ? '#fff5f5' : '#f5f5f5',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: isRecording ? '2px solid #ff4d4d' : '2px dashed #ddd', gap: 8,
                position: 'relative'
              }}
              onClick={isRecording ? stopRecording : (audio ? () => setAudio(null) : startRecording)}
            >
              {isRecording ? (
                <>
                  <Square size={24} color="#ff4d4d" fill="#ff4d4d" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ff4d4d' }}>{recordingTime}s Recording...</span>
                </>
              ) : audio ? (
                <>
                  <Play size={24} color="#1976D2" fill="#1976D2" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1976D2' }}>Tap to Remove Memo</span>
                </>
              ) : (
                <>
                  <Mic size={24} color="#999" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>Voice Memo</span>
                </>
              )}
            </div>
            
            <input 
              id="photo-input"
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* floor/zone/pillar inputs removed per user request */}

          {/* Incognito Toggle */}
          <div 
            onClick={() => setIsSecret(!isSecret)}
            style={{ 
              marginBottom: 24, padding: 16, borderRadius: 16, 
              background: isSecret ? '#f0f7ff' : '#f8f9fa',
              border: `1px solid ${isSecret ? '#1976D2' : '#eee'}`,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ color: isSecret ? '#1976D2' : '#999' }}>
               <ShieldCheck size={24} />
            </div>
            <div style={{ flex: 1 }}>
               <p style={{ fontSize: 14, fontWeight: 700, color: isSecret ? '#1976D2' : '#444' }}>Incognito Mode</p>
               <p style={{ fontSize: 11, color: '#888' }}>Hide this pin from the main view.</p>
            </div>
            <div style={{ 
               width: 40, height: 20, borderRadius: 10, background: isSecret ? '#1976D2' : '#ddd',
               position: 'relative'
            }}>
               <div style={{ 
                  width: 16, height: 16, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 2, left: isSecret ? 22 : 2, transition: 'all 0.2s'
               }} />
            </div>
          </div>


          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#444' }}>Notes</label>
            <textarea 
              placeholder="Add extra details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 16,
                border: '1px solid #eee',
                background: '#fcfcfc',
                fontFamily: 'inherit',
                fontSize: 16,
                minHeight: 80,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, color: '#444' }}>Set Reminder</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[15, 30, 60, 120].map(mins => (
                <button 
                  key={mins}
                  onClick={() => setTimer(timer === mins ? null : mins)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 14,
                    border: '1px solid',
                    borderColor: timer === mins ? '#1976D2' : '#eee',
                    background: timer === mins ? '#eef6ff' : 'white',
                    color: timer === mins ? '#1976D2' : '#666',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {mins >= 60 ? `${mins/60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%' }} onClick={handleSave}>
            <CheckCircle2 size={20} />
            Check-in Here
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const QRCodeModal = ({ isOpen, onClose, data }) => {
  const [imgError, setImgError] = useState(false);
  const [dataUrl, setDataUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  if (!isOpen || !data) return null;

  // Only include the minimal fields needed for syncing so the QR payload stays small.
  const safePayload = typeof data === 'object' && data !== null
    ? {
        id: data.id,
        lat: data.lat,
        lng: data.lng,
        note: data.note,
        category: data.category,
        timestamp: data.timestamp
      }
    : data;

  useEffect(() => {
    let mounted = true;
    setImgError(false);
    setErrorMessage(null);
    setDataUrl(null);
    const str = JSON.stringify(safePayload);
    console.log('QRCodeModal: generating QR for payload', safePayload);
    // Generate QR locally to avoid external image/network problems and URL length limits
    QRCode.toDataURL(str, { errorCorrectionLevel: 'H', width: 400 })
      .then(url => {
        console.log('QRCodeModal: generation success');
        if (mounted) setDataUrl(url);
      })
      .catch(err => {
        console.error('QR generation failed', err);
        if (mounted) {
          setImgError(true);
          setErrorMessage(err?.message || String(err));
        }
      });
    return () => { mounted = false; };
  }, [data]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'white', padding: 24, borderRadius: 24, textAlign: 'center', maxWidth: 320, width: '100%' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700 }}>Share Location</h3>
            <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 16, marginBottom: 20 }}>
            {!imgError && dataUrl ? (
              <img src={dataUrl} alt="QR Code" style={{ width: '100%', height: 'auto', borderRadius: 8 }} onError={() => setImgError(true)} />
            ) : imgError ? (
              <div style={{ padding: 12 }}>
                <p style={{ color: '#666', fontSize: 13 }}>QR image failed to generate. You can copy the sync payload below and paste it on the other device:</p>
                <pre style={{ textAlign: 'left', maxHeight: 160, overflow: 'auto', background: '#fff', padding: 8, borderRadius: 8 }}>{JSON.stringify(safePayload)}</pre>
                {errorMessage && <p style={{ color: '#d32f2f', fontSize: 12, marginTop: 8 }}>Error: {errorMessage}</p>}
              </div>
            ) : (
              <div style={{ padding: 12 }}>
                <p style={{ color: '#666', fontSize: 13 }}>Generating QR…</p>
                <details style={{ marginTop: 8, textAlign: 'left' }}>
                  <summary style={{ cursor: 'pointer', fontSize: 12 }}>Show payload (for debug)</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#fff', padding: 8, borderRadius: 8 }}>{JSON.stringify(safePayload, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Scan this code on another device to instantly sync this pin.</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              className="btn-primary"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(JSON.stringify(safePayload));
                  alert('Payload copied to clipboard');
                } catch (e) {
                  // fallback
                  const ta = document.createElement('textarea');
                  ta.value = JSON.stringify(safePayload);
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand('copy');
                  ta.remove();
                  alert('Payload copied to clipboard');
                }
              }}
              style={{ flex: 1 }}
            >
              Copy payload
            </button>
            {dataUrl && (
              <a href={dataUrl} download={`where-did-i-park-${safePayload.id || 'pin'}.png`} style={{ flex: 1 }}>
                <button className="btn-primary" style={{ width: '100%' }}>Download QR</button>
              </a>
            )}
          </div>

          <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HistoryPanel = ({ isOpen, onClose }) => {
  const { history } = useParking();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 30 }}
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400,
              background: 'white', zIndex: 40, padding: 24, overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>History</h2>
              <button onClick={onClose} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: 8 }}>
                <X size={20} />
              </button>
            </div>

            {history.length === 0 ? (
               <div style={{ textAlign: 'center', marginTop: 100, color: '#aaa' }}>
                 <History size={48} style={{ marginBottom: 16 }} />
                 <p>No history yet.</p>
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {history.map(spot => (
                  <div key={spot.id} style={{ padding: 16, borderRadius: 16, border: '1px solid #eee', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 16 }}>{format(new Date(spot.timestamp), 'MMM d, h:mm a')}</span>
                          {spot.audio && <Mic size={14} color="#1976D2" />}
                       </div>
                       <MapPin size={16} color="#1976D2" />
                    </div>
                    <p style={{ color: '#666', fontSize: 14 }}>{spot.note || 'No notes'}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- App Layout ---

const BatteryReminder = ({ onOpenForm }) => {
  const { batteryStatus, activeSpot } = useParking();
  const [dismissed, setDismissed] = useState(false);

  if (activeSpot || dismissed || batteryStatus.level > 0.20 || batteryStatus.charging) return null;

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        position: 'absolute', top: 100, right: 20, zIndex: 100,
        background: '#fff5f5', border: '1px solid #feb2b2',
        padding: '12px 16px', borderRadius: 16, maxWidth: 220,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', gap: 12
      }}
    >
      <div style={{ color: '#c53030' }}><Navigation2 size={20} /></div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#c53030', marginBottom: 4 }}>Low Battery!</p>
        <p style={{ fontSize: 11, color: '#7b2c2c', marginBottom: 8 }}>Save your spot before your phone dies.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => onOpenForm()}
            style={{ 
              background: '#c53030', color: 'white', border: 'none', 
              padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' 
            }}
          >
            Pin Now
          </button>
          <button 
            onClick={() => setDismissed(true)}
            style={{ background: 'transparent', border: 'none', color: '#9b2c2c', fontSize: 10, cursor: 'pointer' }}
          >
            Later
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- App Layout ---

function AppContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [formCategory, setFormCategory] = useState('parking');
  const [isNearbyOpen, setIsNearbyOpen] = useState(false);
  const [nearbySpots, setNearbySpots] = useState([]);
  const [selectedNearbySpot, setSelectedNearbySpot] = useState(null);
  const [recenterKey, setRecenterKey] = useState(0);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const { 
    locationStatus, 
    error, 
    refreshLocation,
    location,
    activeSpots
  } = useParking();
  const fileInputRef = React.useRef(null);

  const exportSpots = () => {
    try {
      const data = JSON.stringify(activeSpots || []);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `where-did-i-park-spots-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. See console for details.');
    }
  };

  const importSpots = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) throw new Error('Invalid format: expected an array of spots');
        // Basic validation: ensure each item has lat and lng
        const valid = parsed.filter(s => s && typeof s.lat === 'number' && typeof s.lng === 'number');
        localStorage.setItem('activeSpots', JSON.stringify(valid));
        alert(`Imported ${valid.length} spots. Reloading to apply.`);
        window.location.reload();
      } catch (err) {
        console.error('Import failed', err);
        alert('Import failed: ' + (err.message || String(err)));
      }
    };
    reader.readAsText(file);
  };

  const handleSpotsChange = useCallback((spots) => {
    setNearbySpots(spots);
    setSelectedNearbySpot(null);
  }, []);

  const openFormWithCategory = (cat) => {
    setFormCategory(cat);
    setIsFormOpen(true);
  };

  const handleNavigate = async (target) => {
    // Accept either {lat,lng} or spot object
    if (!target) return setNavigationTarget(null);
    if (!(typeof target.lat === 'number' && typeof target.lng === 'number')) return;

    // Set a loading navigation target so UI updates immediately
    setNavigationTarget({ lat: target.lat, lng: target.lng, id: target.id, note: target.note, category: target.category, loading: true });
    setSelectedNearbySpot(null);
    setRecenterKey(prev => prev + 1);

    // If we have a current location, request a route from OSRM demo server
    if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      try {
        const src = `${location.lng},${location.lat}`;
        const dst = `${target.lng},${target.lat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${src};${dst}?overview=full&geometries=geojson&annotations=distance,duration`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.routes && data.routes.length > 0) {
          const r = data.routes[0];
          // r.geometry.coordinates is [[lon,lat],...]
          const routeLatLng = r.geometry.coordinates.map(c => [c[1], c[0]]);
          setNavigationTarget({
            lat: target.lat,
            lng: target.lng,
            id: target.id,
            note: target.note,
            category: target.category,
            loading: false,
            route: routeLatLng,
            distance: r.distance, // meters
            duration: r.duration // seconds
          });
          return;
        }
      } catch (err) {
        console.error('OSRM route fetch failed', err);
      }
    }

    // Fallback: no route geometry available
    setNavigationTarget({ lat: target.lat, lng: target.lng, id: target.id, note: target.note, category: target.category, loading: false, route: null });
  };

  const showLocationError = typeof error === 'string' && error.length > 0;
  const showPermissionError = typeof error === 'string' && /permission|denied/i.test(error);
  const showSecureContextError = typeof error === 'string' && /https|localhost|secure/i.test(error);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <MapBackground
        nearbySpots={nearbySpots}
        selectedNearbySpot={selectedNearbySpot}
        recenterKey={recenterKey}
        navigationTarget={navigationTarget}
      />
      <MapThemeSwitcher />
      <BatteryReminder onOpenForm={() => openFormWithCategory('parking')} />
      
      {/* Top Navbar */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, right: 20,
        display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
          <div style={{ 
            background: 'white', padding: '10px 18px', borderRadius: 100,
            display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-premium)'
          }}>
             <Navigation2 size={18} fill="#1976D2" color="#1976D2" />
             <span style={{ fontWeight: 700, fontSize: 14 }}>Where is my spot?</span>
             {/* GPS status pill */}
             <span style={{
               fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
               background: locationStatus === 'ok' ? '#e8f5e9' : locationStatus === 'error' ? '#ffebee' : '#fff8e1',
               color: locationStatus === 'ok' ? '#2E7D32' : locationStatus === 'error' ? '#c62828' : '#F57F17',
               display: 'flex', alignItems: 'center', gap: 4
             }}>
               <span style={{
                 width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
                 background: locationStatus === 'ok' ? '#4CAF50' : locationStatus === 'error' ? '#ef5350' : '#FFC107'
               }} />
               {locationStatus === 'ok' ? 'GPS Active' : locationStatus === 'error' ? 'GPS Error' : 'Searching…'}
             </span>
          </div>
          
          <button 
            onClick={() => setIsUnlocked(!isUnlocked)}
            style={{ 
              background: isUnlocked ? '#1976D2' : 'white', width: 42, height: 42, borderRadius: '50%', border: 'none',
              boxShadow: 'var(--shadow-premium)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={18} color={isUnlocked ? 'white' : '#1976D2'} />
          </button>

          <button 
            onClick={() => setIsHistoryOpen(true)}
            style={{ 
              background: 'white', width: 42, height: 42, borderRadius: '50%', border: 'none',
              boxShadow: 'var(--shadow-premium)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <History size={18} color="#1976D2" />
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => importSpots(e.target.files[0])} />
          <button
            onClick={() => exportSpots()}
            style={{ background: 'white', width: 42, height: 42, borderRadius: '50%', border: 'none', marginLeft: 8, boxShadow: 'var(--shadow-premium)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Export pins"
          >
            <Download size={18} color="#1976D2" />
          </button>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ background: 'white', width: 42, height: 42, borderRadius: '50%', border: 'none', marginLeft: 8, boxShadow: 'var(--shadow-premium)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Import pins"
          >
            <Upload size={18} color="#1976D2" />
          </button>
        </div>

        {/* Quick Launch Row */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            display: 'flex', gap: 8, overflowX: 'auto', 
            padding: '4px 2px', pointerEvents: 'auto' 
          }}
        >
          {/* Find Nearby Parking button - kept first per request */}
          <button
            onClick={() => setIsNearbyOpen(true)}
            style={{
              background: isNearbyOpen ? '#7B1FA2' : 'white',
              padding: '8px 14px', borderRadius: 12,
              border: 'none', boxShadow: isNearbyOpen ? '0 4px 16px rgba(123,31,162,0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontWeight: 700, fontSize: 12, color: isNearbyOpen ? 'white' : '#444',
              cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s'
            }}
          >
            <Search size={15} style={{ color: isNearbyOpen ? 'white' : '#7B1FA2' }} />
            Find Parking
          </button>

          {[
            { id: 'parking', icon: <MapIcon size={16} />, color: '#4CAF50' },
            { id: 'meeting', icon: <Users size={16} />, color: '#1976D2' },
            { id: 'food', icon: <Coffee size={16} />, color: '#FF9800' },
            { id: 'gem', icon: <Star size={16} />, color: '#E91E63' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => openFormWithCategory(item.id)}
              style={{
                background: 'white', padding: '8px 12px', borderRadius: 12,
                border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 700, fontSize: 12, color: '#444', cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
            </button>
          ))}
        </motion.div>
      </div>

      <FloatingActionCard 
        onOpenForm={() => openFormWithCategory('parking')} 
        onOpenQR={setQrData} 
        onNavigate={handleNavigate}
        isUnlocked={isUnlocked}
      />

      <QRCodeModal isOpen={!!qrData} onClose={() => setQrData(null)} data={qrData} />

      {/* In-app route control */}
      {navigationTarget && (
        <div style={{ position: 'absolute', bottom: 140, left: 20, right: 20, zIndex: 120, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 12, borderRadius: 12, display: 'flex', gap: 8, alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', maxWidth: 540, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Navigation size={18} color="#1976D2" />
              <div style={{ fontSize: 14, fontWeight: 700 }}>{navigationTarget.note || (navigationTarget.category ? navigationTarget.category : 'Destination')}</div>
            </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {navigationTarget.distance != null && (
                      <div style={{ fontSize: 13, color: '#444', marginRight: 8 }}>
                        {(navigationTarget.distance >= 1000) ? `${(navigationTarget.distance/1000).toFixed(1)} km` : `${Math.round(navigationTarget.distance)} m`}
                        {navigationTarget.duration != null && (` • ${Math.ceil(navigationTarget.duration/60)} min`)}
                      </div>
                    )}
                    <button
                      className="btn-primary"
                      onClick={() => {
                        // Open external Google Maps if user wants
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${navigationTarget.lat},${navigationTarget.lng}`, '_blank');
                      }}
                    >Open in Google Maps</button>
                    <button className="btn-primary" style={{ background: '#f5f5f5', color: '#111' }} onClick={() => setNavigationTarget(null)}>Clear</button>
                  </div>
          </div>
        </div>
      )}
      
      {/* Location Error Feedback */}
        {showLocationError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: 120, left: 20, right: 20,
              background: '#fff9f9', color: '#d32f2f', padding: '20px',
              borderRadius: 24, fontSize: 13, fontWeight: 600,
              boxShadow: '0 8px 30px rgba(211, 47, 47, 0.15)',
              zIndex: 100, display: 'flex', flexDirection: 'column', gap: 14,
              border: '2px solid #fee2e2'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ background: '#fee2e2', padding: 8, borderRadius: '50%' }}>
                <Navigation size={20} color="#d32f2f" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
                  {showSecureContextError ? 'Open Securely for Location' : 'Location Access Required'}
                </p>
                <p style={{ color: '#666', fontWeight: 500, lineHeight: 1.4 }}>{error}</p>
                <div style={{ marginTop: 12, background: '#f8f9fa', padding: 12, borderRadius: 12, color: '#444', fontSize: 11 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>How to fix:</p>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {showSecureContextError ? (
                      <>
                        <li>Open the app from <strong>https://...</strong> or <strong>localhost</strong></li>
                        <li>Avoid plain <strong>http://</strong> addresses for location access</li>
                        <li>If testing on a phone, use a secure deployed URL instead of a local network URL</li>
                      </>
                    ) : showPermissionError ? (
                      <>
                        <li>Go to your phone's <strong>Settings</strong></li>
                        <li>Find <strong>Privacy → Location Services</strong></li>
                        <li>Ensure <strong>Safari</strong> (or your browser) is set to <strong>"While Using the App"</strong></li>
                        <li>Turn ON <strong>Precise Location</strong></li>
                      </>
                    ) : (
                      <>
                        <li>Wait a few seconds in an open area</li>
                        <li>Make sure location services are turned on for your device</li>
                        <li>Tap the location button to try again</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                background: '#d32f2f', color: 'white', border: 'none', 
                padding: '12px 20px', borderRadius: 14, fontSize: 14, 
                fontWeight: 800, cursor: 'pointer', width: '100%',
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <Zap size={16} fill="white" />
              Try Force Refresh
            </button>
          </motion.div>
        )}

      {/* Locate Me Button */}
      <button 
        onClick={() => {
          refreshLocation();
          setSelectedNearbySpot(null);
          setRecenterKey(prev => prev + 1);
        }}
        style={{ 
          position: 'absolute', bottom: 220, right: 20,
          background: 'white', width: 44, height: 44, borderRadius: 12, border: 'none',
          boxShadow: 'var(--shadow-premium)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10
        }}
      >
        <Navigation size={20} color="#1976D2" />
      </button>
      
      <ActionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialCategory={formCategory}
      />
      
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      <NearbyParkingPanel
        isOpen={isNearbyOpen}
        onClose={() => setIsNearbyOpen(false)}
        onSpotsChange={handleSpotsChange}
        onSelectSpot={(spot) => setSelectedNearbySpot(spot)}
        onNavigate={handleNavigate}
        selectedSpot={selectedNearbySpot}
      />
      
      {/* Subtle Branding */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', opacity: 0.05, zIndex: 1
      }}>
        <Navigation size={400} />
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'app', 'privacy', 'terms'

  useEffect(() => {
    if (view === 'app') {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
  }, [view]);

  return (
    <ParkingProvider>
      {view === 'landing' && <LandingPage onLaunch={() => setView('app')} onNavigate={setView} />}
      {view === 'app' && <AppContent />}
      {view === 'privacy' && <PrivacyPolicy onBack={() => setView('landing')} />}
      {view === 'terms' && <TermsOfService onBack={() => setView('landing')} />}
      {view === 'article-parking' && <ArticleSmartParking onBack={() => setView('landing')} />}
      {view === 'article-security' && <ArticleSecurity onBack={() => setView('landing')} />}
    </ParkingProvider>
  );
}

export default App;

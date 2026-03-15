import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Square,
  Cloud,
  Sun,
  Fuel,
  Utensils,
  Landmark
} from 'lucide-react';
import { addMinutes, differenceInSeconds } from 'date-fns';

const ParkingContext = createContext();

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
  const [activeSpots, setActiveSpots] = useState(() => {
    const saved = localStorage.getItem('activeSpots');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('parkingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [mapTheme, setMapTheme] = useState('standard');
  const [weather, setWeather] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState({ level: 1, charging: false });

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBattery = () => {
          setBatteryStatus({ level: battery.level, charging: battery.charging });
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }
  }, []);

  const fetchWeather = async (lat, lng) => {
    try {
      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
      const data = await resp.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error("Weather fetch failed", err);
    }
  };

  useEffect(() => {
    if (activeSpots.length > 0) {
      // Fetch weather for the first active spot for now
      fetchWeather(activeSpots[0].lat, activeSpots[0].lng);
    } else {
      setWeather(null);
    }
  }, [activeSpots]);

  const [locationStatus, setLocationStatus] = useState('searching'); // 'searching' | 'ok' | 'error'

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationStatus('error');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000
    };

    const onSuccess = (pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setError(null);
      setLocationStatus('ok');
    };

    const onError = (err) => {
      console.error('Location error:', err.code, err.message);
      let msg = 'Unknown GPS error';
      if (err.code === 1) msg = 'Location access denied. Please allow in Safari settings.';
      else if (err.code === 2) msg = 'GPS hardware unavailable or macOS system location off.';
      else if (err.code === 3) msg = 'GPS signal too weak or timed out. Try moving near a window.';
      
      setError(msg);
      setLocationStatus('error');
    };

    // Get a fast first fix immediately
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Then keep watching for updates
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const saveSpot = (details) => {
    if (!location) return;
    const newSpot = {
      id: Date.now(),
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date().toISOString(),
      note: details.note || '',
      timerEndTime: details.timerEndTime || null,
      photo: details.photo || null,
      audio: details.audio || null,
      category: details.category || 'parking',
      isSecret: details.isSecret || false,
      parkingDetails: details.parkingDetails || { floor: '', zone: '', pillar: '' }
    };
    const updatedSpots = [...activeSpots, newSpot];
    setActiveSpots(updatedSpots);
    localStorage.setItem('activeSpots', JSON.stringify(updatedSpots));
    
    const updatedHistory = [newSpot, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));
  };

  const updateSpot = (id, updates) => {
    const updatedSpots = activeSpots.map(s => s.id === id ? { ...s, ...updates } : s);
    setActiveSpots(updatedSpots);
    localStorage.setItem('activeSpots', JSON.stringify(updatedSpots));

    const updatedHistory = history.map(s => s.id === id ? { ...s, ...updates } : s);
    setHistory(updatedHistory);
    localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));
  };

  const clearSpot = (id) => {
    const updatedSpots = activeSpots.filter(s => s.id !== id);
    setActiveSpots(updatedSpots);
    localStorage.setItem('activeSpots', JSON.stringify(updatedSpots));
  };

  const clearAllSpots = () => {
    setActiveSpots([]);
    localStorage.removeItem('activeSpots');
  };

  return (
    <ParkingContext.Provider value={{ 
      activeSpots, activeSpot: activeSpots[0] || null,
      history, location, locationStatus, error, 
      mapTheme, setMapTheme, batteryStatus, weather,
      saveSpot, updateSpot, clearSpot, clearAllSpots
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

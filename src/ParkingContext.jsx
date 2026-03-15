import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';

const ParkingContext = createContext();

const FAST_FIX_MAX_AGE = 5 * 60 * 1000;
const FAST_FIX_TIMEOUT = 5000;
const HIGH_ACCURACY_TIMEOUT = 12000;
const STANDARD_TIMEOUT = 12000;

const getLocationErrorMessage = (err) => {
  let msg = 'Unable to determine your location right now.';
  if (err?.code === 1) {
    msg = 'Location permission denied. Enable it in your browser or system settings and try again.';
  } else if (err?.code === 2) {
    msg = 'Position unavailable. Move to an open area or make sure location services are enabled.';
  } else if (err?.code === 3) {
    msg = 'Location request timed out. Trying again can help once your device has a better signal.';
  }
  return err?.code ? `${msg} (Code ${err.code})` : msg;
};

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
  const [activeSpots, setActiveSpots] = useState(() => {
    const saved = localStorage.getItem('activeSpots');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Remove any parkingDetails fields saved previously
      if (Array.isArray(parsed)) {
        return parsed.map(s => {
          const { parkingDetails, ...rest } = s || {};
          return rest;
        });
      }
      return [];
    } catch (err) {
      console.error('Failed to parse saved activeSpots', err);
      return [];
    }
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('parkingHistory');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(s => {
          const { parkingDetails, ...rest } = s || {};
          return rest;
        });
      }
      return [];
    } catch (err) {
      console.error('Failed to parse saved parkingHistory', err);
      return [];
    }
  });

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [mapTheme, setMapTheme] = useState('standard');
  const [weather, setWeather] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState({ level: 1, charging: false });
  const watchIdRef = useRef(null);
  const locationRef = useRef(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    let isMounted = true;
    let batteryManager = null;
    let updateBattery = null;

    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (!isMounted) return;
        batteryManager = battery;

        updateBattery = () => {
          setBatteryStatus({ level: battery.level, charging: battery.charging });
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }

    return () => {
      isMounted = false;
      if (batteryManager && updateBattery) {
        batteryManager.removeEventListener('levelchange', updateBattery);
        batteryManager.removeEventListener('chargingchange', updateBattery);
      }
    };
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

  const clearLocationWatch = useCallback(() => {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestPosition = useCallback((options) => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  }), []);

  const applyLocationSuccess = useCallback((pos) => {
    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setError(null);
    setLocationStatus('ok');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const startLocationServices = async () => {
      clearLocationWatch();

      if (!navigator.geolocation) {
        setError('Geolocation is not supported in this browser.');
        setLocationStatus('error');
        return;
      }

      if (!window.isSecureContext) {
        setError('Location access requires HTTPS or localhost. Open the app securely and try again.');
        setLocationStatus('error');
        return;
      }

      setError(null);
      setLocationStatus('searching');

      const onSuccess = (pos) => {
        if (cancelled) return;
        applyLocationSuccess(pos);
      };

      const onError = async (err) => {
        if (cancelled) return;

        if (err?.code === 1) {
          setError(getLocationErrorMessage(err));
          setLocationStatus('error');
          return;
        }

        try {
          const fallbackFix = await requestPosition({
            enableHighAccuracy: false,
            maximumAge: Infinity,
            timeout: STANDARD_TIMEOUT
          });

          if (!cancelled) {
            applyLocationSuccess(fallbackFix);
          }
          return;
        } catch {
          if (!locationRef.current) {
            setError(getLocationErrorMessage(err));
            setLocationStatus('error');
          }
        }
      };

      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: HIGH_ACCURACY_TIMEOUT
      });

      try {
        const initialPosition = await requestPosition({
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: HIGH_ACCURACY_TIMEOUT
        });

        if (!cancelled) {
          applyLocationSuccess(initialPosition);
        }
      } catch (err) {
        if (cancelled) return;

        if (err?.code === 1) {
          setError(getLocationErrorMessage(err));
          setLocationStatus('error');
          return;
        }

        try {
          const cachedPosition = await requestPosition({
            enableHighAccuracy: false,
            maximumAge: FAST_FIX_MAX_AGE,
            timeout: FAST_FIX_TIMEOUT
          });

          if (!cancelled) {
            applyLocationSuccess(cachedPosition);
          }
        } catch (fallbackErr) {
          if (!locationRef.current) {
            setError(getLocationErrorMessage(fallbackErr?.code === 1 ? fallbackErr : err));
            setLocationStatus('error');
          }
        }
      }
    };

    startLocationServices();

    return () => {
      cancelled = true;
      clearLocationWatch();
    };
  }, [applyLocationSuccess, clearLocationWatch, requestPosition, retryKey]);

  const refreshLocation = () => {
    setError(null);
    setLocationStatus('searching');
    setRetryKey(prev => prev + 1);
  };

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
      // parkingDetails removed — not storing floor/zone/pillar per user request
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
      saveSpot, updateSpot, clearSpot, clearAllSpots,
      refreshLocation
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

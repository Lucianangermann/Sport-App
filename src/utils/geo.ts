/** Haversine distance in km between two WGS84 points. */
export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

export interface UserPosition {
  lat: number;
  lon: number;
  source: 'gps' | 'fallback';
}

const FALLBACK: UserPosition = { lat: 48.1351, lon: 11.582, source: 'fallback' };

const POS_CACHE_KEY = 'user_position_v1';
const POS_CACHE_TTL_MS = 1000 * 60 * 30;

interface CachedPos {
  ts: number;
  pos: UserPosition;
}

const loadCachedPos = (): UserPosition | null => {
  try {
    const raw = localStorage.getItem(POS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPos;
    if (Date.now() - parsed.ts > POS_CACHE_TTL_MS) return null;
    return parsed.pos;
  } catch {
    return null;
  }
};

const savePos = (pos: UserPosition) => {
  try {
    localStorage.setItem(POS_CACHE_KEY, JSON.stringify({ ts: Date.now(), pos }));
  } catch {
    /* ignore */
  }
};

export const getUserPosition = async (allowGps: boolean): Promise<UserPosition> => {
  const cached = loadCachedPos();
  if (cached && (cached.source === 'gps' || !allowGps)) return cached;

  if (!allowGps || !('geolocation' in navigator)) {
    savePos(FALLBACK);
    return FALLBACK;
  }

  return new Promise<UserPosition>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const pos: UserPosition = { lat: geo.coords.latitude, lon: geo.coords.longitude, source: 'gps' };
        savePos(pos);
        resolve(pos);
      },
      () => {
        savePos(FALLBACK);
        resolve(FALLBACK);
      },
      { timeout: 6000, maximumAge: POS_CACHE_TTL_MS },
    );
  });
};

export const clearPositionCache = () => {
  try {
    localStorage.removeItem(POS_CACHE_KEY);
  } catch {
    /* ignore */
  }
};

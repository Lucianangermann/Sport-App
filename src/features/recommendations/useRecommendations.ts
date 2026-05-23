import { useCallback, useEffect, useState } from 'react';
import { callClaudeJSON } from '../../lib/claude';
import { useAppStore } from '../../store/useAppStore';
import { SPORTS } from '../../data/sports';

export interface Recommendation {
  sport: string;
  reason: string;
  emoji: string;
}

interface WeatherSnapshot {
  description: string;
  tempC: number;
  isOutdoorFriendly: boolean;
}

const DEFAULT_LAT = 48.1351; // München fallback
const DEFAULT_LON = 11.5820;

const WEATHER_CODES: Record<number, { de: string; outdoorFriendly: boolean }> = {
  0: { de: 'klar', outdoorFriendly: true },
  1: { de: 'überwiegend klar', outdoorFriendly: true },
  2: { de: 'teilweise bewölkt', outdoorFriendly: true },
  3: { de: 'bedeckt', outdoorFriendly: true },
  45: { de: 'nebelig', outdoorFriendly: false },
  48: { de: 'gefrierender Nebel', outdoorFriendly: false },
  51: { de: 'leichter Nieselregen', outdoorFriendly: false },
  53: { de: 'mäßiger Nieselregen', outdoorFriendly: false },
  55: { de: 'starker Nieselregen', outdoorFriendly: false },
  61: { de: 'leichter Regen', outdoorFriendly: false },
  63: { de: 'mäßiger Regen', outdoorFriendly: false },
  65: { de: 'starker Regen', outdoorFriendly: false },
  71: { de: 'leichter Schneefall', outdoorFriendly: false },
  73: { de: 'mäßiger Schneefall', outdoorFriendly: false },
  75: { de: 'starker Schneefall', outdoorFriendly: false },
  80: { de: 'leichte Regenschauer', outdoorFriendly: false },
  81: { de: 'Regenschauer', outdoorFriendly: false },
  82: { de: 'heftige Regenschauer', outdoorFriendly: false },
  95: { de: 'Gewitter', outdoorFriendly: false },
  96: { de: 'Gewitter mit Hagel', outdoorFriendly: false },
};

const dayNamesDE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const fetchWeather = async (lat: number, lon: number): Promise<WeatherSnapshot> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weathercode,temperature_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const code = data?.current?.weathercode ?? 0;
  const temp = data?.current?.temperature_2m ?? 0;
  const entry = WEATHER_CODES[code] ?? { de: 'wechselhaft', outdoorFriendly: true };
  return { description: entry.de, tempC: Math.round(temp), isOutdoorFriendly: entry.outdoorFriendly };
};

const fetchPosition = (): Promise<GeolocationPosition | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 4000, maximumAge: 1000 * 60 * 30 },
    );
  });

const STORAGE_KEY = 'smart_rec_v1';

interface CachedRec {
  generatedAtISO: string;
  hourBucket: string; // YYYY-MM-DD-HH
  dismissedHourBucket?: string;
  rec: Recommendation;
}

const hourBucket = (d: Date) =>
  `${d.toISOString().slice(0, 10)}-${String(d.getHours()).padStart(2, '0')}`;

const loadCache = (): CachedRec | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CachedRec) : null;
  } catch {
    return null;
  }
};

const saveCache = (data: CachedRec) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

export function useRecommendations() {
  const favorites = useAppStore((s) => s.favorites);
  const locationEnabled = useAppStore((s) => s.profile.settings.locationEnabled);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial: load from cache if same hour and not dismissed for this hour
  useEffect(() => {
    const cached = loadCache();
    const now = hourBucket(new Date());
    if (cached) {
      if (cached.dismissedHourBucket === now) {
        setDismissed(true);
        return;
      }
      if (cached.hourBucket === now) {
        setRec(cached.rec);
        return;
      }
    }
    // Otherwise, generate fresh once
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let lat = DEFAULT_LAT;
      let lon = DEFAULT_LON;
      if (locationEnabled) {
        const pos = await fetchPosition();
        if (pos) {
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        }
      }

      const weather = await fetchWeather(lat, lon);
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = dayNamesDE[now.getDay()];
      const favSports = favorites
        .map((id) => SPORTS.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(', ') || 'noch keine Favoriten';

      const result = await callClaudeJSON<Recommendation>({
        system:
          'Du bist ein Sport-Berater. Empfehle EINE passende Sportart und gib eine sehr kurze Begründung auf Deutsch (max. 1 Satz). Antworte ausschließlich mit JSON in genau diesem Format: { "sport": "...", "reason": "...", "emoji": "..." }. Sport-Namen aus dieser Liste: Fußball, Basketball, Tennis, Schwimmen, Klettern, Yoga, Boxen, Laufen, Radfahren, Volleyball, Handball, Judo, Karate, Kickboxen, Badminton, Tischtennis, Squash, Rudern, Segeln, Surfen, Krafttraining, CrossFit, Pilates, Wandern, Mountainbike, Ski Alpin, Snowboard, Eishockey, Tanzen, Parkour, Reiten, Golf. Berücksichtige Wetter, Uhrzeit, Wochentag und Favoriten.',
        messages: [
          {
            role: 'user',
            content: `Wetter: ${weather.description}, ${weather.tempC}°C (${weather.isOutdoorFriendly ? 'outdoor-tauglich' : 'eher indoor'}).
Uhrzeit: ${hour}:00 Uhr (${dayOfWeek}).
Favoriten: ${favSports}.
Empfehle EINE Sportart für jetzt.`,
          },
        ],
        maxTokens: 200,
      });
      setRec(result);
      saveCache({ generatedAtISO: now.toISOString(), hourBucket: hourBucket(now), rec: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [favorites, locationEnabled]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    const cached = loadCache();
    const now = hourBucket(new Date());
    if (cached) {
      saveCache({ ...cached, dismissedHourBucket: now });
    } else if (rec) {
      saveCache({ generatedAtISO: new Date().toISOString(), hourBucket: now, rec, dismissedHourBucket: now });
    }
  }, [rec]);

  return { rec, dismissed, loading, error, generate, dismiss };
}

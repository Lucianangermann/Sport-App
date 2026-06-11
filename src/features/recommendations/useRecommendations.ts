import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SPORTS } from '../../data/sports';
import type { Sport } from '../../types';

export interface Recommendation {
  sport: string;
  reason: string;
  emoji: string;
}

interface WeatherSnapshot {
  description: string;
  tempC: number;
  isOutdoorFriendly: boolean;
  weatherCode: number;
}

const DEFAULT_LAT = 48.1351;
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

const SNOW_CODES = new Set([71, 73, 75]);

const fetchWeather = async (lat: number, lon: number): Promise<WeatherSnapshot> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weathercode,temperature_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const code = data?.current?.weathercode ?? 0;
  const temp = data?.current?.temperature_2m ?? 0;
  const entry = WEATHER_CODES[code] ?? { de: 'wechselhaft', outdoorFriendly: true };
  return {
    description: entry.de,
    tempC: Math.round(temp),
    isOutdoorFriendly: entry.outdoorFriendly,
    weatherCode: code,
  };
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

const STORAGE_KEY = 'smart_rec_v2';

interface CachedRec {
  generatedAtISO: string;
  hourBucket: string;
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

const isWinterSport = (id: string) => ['ski', 'snowboard', 'eishockey'].includes(id);

const scoreSport = (
  sport: Sport,
  ctx: { weather: WeatherSnapshot; hour: number; isFavorite: boolean },
): number => {
  let score = sport.popularity * 0.5;
  const { weather, hour, isFavorite } = ctx;

  if (isFavorite) score += 30;

  const outdoor = sport.tags.includes('outdoor');
  const indoor = sport.tags.includes('indoor');
  if (weather.isOutdoorFriendly && outdoor) score += 25;
  if (!weather.isOutdoorFriendly && indoor) score += 25;
  if (!weather.isOutdoorFriendly && outdoor) score -= 30;

  // Temperature
  if (outdoor && weather.tempC < 5) score -= 10;
  if (outdoor && weather.tempC >= 18 && weather.tempC <= 26) score += 8;

  // Snow boost for winter sports
  if (SNOW_CODES.has(weather.weatherCode) && isWinterSport(sport.id)) score += 35;
  if (!SNOW_CODES.has(weather.weatherCode) && isWinterSport(sport.id) && weather.tempC > 5) score -= 25;

  // Time of day
  if (hour < 9) {
    // Mornings: prefer calmer / outdoor / running
    if (['yoga', 'pilates', 'laufen', 'wandern', 'schwimmen'].includes(sport.id)) score += 15;
    if (sport.tags.includes('high-intensity')) score -= 5;
  } else if (hour >= 9 && hour < 17) {
    // Daytime: any
    if (sport.tags.includes('outdoor') && weather.isOutdoorFriendly) score += 5;
  } else if (hour >= 17 && hour < 21) {
    // Evening: team sports, gym, indoor classes
    if (sport.tags.includes('team')) score += 12;
    if (['krafttraining', 'crossfit', 'boxen', 'kickboxen', 'tanzen'].includes(sport.id)) score += 10;
  } else {
    // Late night: low-impact only
    if (sport.tags.includes('low-intensity')) score += 10;
    if (sport.tags.includes('high-intensity')) score -= 15;
    if (outdoor) score -= 10;
  }

  return score;
};

const buildReason = (sport: Sport, weather: WeatherSnapshot, hour: number, isFavorite: boolean): string => {
  const parts: string[] = [];
  if (isFavorite) parts.push('einer deiner Favoriten');

  if (SNOW_CODES.has(weather.weatherCode) && isWinterSport(sport.id)) {
    parts.push(`Schneefall draußen — ${sport.name} ist genau richtig`);
  } else if (weather.isOutdoorFriendly && sport.tags.includes('outdoor')) {
    parts.push(`${weather.tempC}°C und ${weather.description} — perfekt für draußen`);
  } else if (!weather.isOutdoorFriendly && sport.tags.includes('indoor')) {
    parts.push(`${weather.description} draußen — indoor läuft heute besser`);
  }

  if (hour < 9 && ['yoga', 'laufen', 'pilates'].includes(sport.id)) {
    parts.push('idealer Morgensport');
  } else if (hour >= 17 && hour < 21 && sport.tags.includes('team')) {
    parts.push('typische Trainingszeit für Teamsportler');
  } else if (hour >= 21 && sport.tags.includes('low-intensity')) {
    parts.push('ruhig genug für den Abend');
  }

  if (!parts.length) parts.push(`passt gut zu ${weather.description} bei ${weather.tempC}°C`);
  return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + '.';
};

const EMOJI_MAP: Record<string, string> = {
  fussball: '⚽️', basketball: '🏀', tennis: '🎾', schwimmen: '🏊', klettern: '🧗',
  yoga: '🧘', boxen: '🥊', laufen: '🏃', radfahren: '🚴', volleyball: '🏐',
  handball: '🤾', judo: '🥋', karate: '🥋', kickboxen: '🥊', badminton: '🏸',
  tischtennis: '🏓', squash: '🎯', rudern: '🚣', segeln: '⛵️', surfen: '🏄',
  krafttraining: '💪', crossfit: '🏋️', pilates: '🧘‍♀️', wandern: '🥾',
  mountainbike: '🚵', ski: '⛷️', snowboard: '🏂', eishockey: '🏒',
  tanzen: '💃', parkour: '🤸', reiten: '🐎', golf: '⛳️',
};

/** Read this hour's cached recommendation (or decide we must generate one).
 *  Lives at module scope so its impure reads (localStorage, clock) stay out of
 *  the component's render path and can seed state lazily. */
function readInitialRecState(): {
  rec: Recommendation | null;
  dismissed: boolean;
  shouldGenerate: boolean;
} {
  const cached = loadCache();
  const now = hourBucket(new Date());
  if (cached) {
    if (cached.dismissedHourBucket === now) return { rec: null, dismissed: true, shouldGenerate: false };
    if (cached.hourBucket === now) return { rec: cached.rec, dismissed: false, shouldGenerate: false };
  }
  return { rec: null, dismissed: false, shouldGenerate: true };
}

export function useRecommendations() {
  const favorites = useAppStore((s) => s.favorites);
  const locationEnabled = useAppStore((s) => s.profile.settings.locationEnabled);
  const [initial] = useState(readInitialRecState);
  const [rec, setRec] = useState<Recommendation | null>(initial.rec);
  const [dismissed, setDismissed] = useState(initial.dismissed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const favSet = new Set(favorites);
      const ranked = SPORTS.map((sport) => ({
        sport,
        score: scoreSport(sport, { weather, hour, isFavorite: favSet.has(sport.id) }),
      })).sort((a, b) => b.score - a.score);

      const top = ranked[0].sport;
      const result: Recommendation = {
        sport: top.name,
        reason: buildReason(top, weather, hour, favSet.has(top.id)),
        emoji: EMOJI_MAP[top.id] ?? '🏅',
      };

      setRec(result);
      saveCache({ generatedAtISO: now.toISOString(), hourBucket: hourBucket(now), rec: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [favorites, locationEnabled]);

  // On mount: if no fresh cache was found, generate a recommendation. State for
  // a cache hit is already seeded via readInitialRecState, so the effect does no
  // synchronous setState of its own.
  useEffect(() => {
    // Canonical fetch-on-mount; generate() flips its own loading flag.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial.shouldGenerate) void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

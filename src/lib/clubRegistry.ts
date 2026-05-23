import type { Club } from '../types';

/**
 * Cross-page registry of fetched OSM clubs. ClubsPage writes here when
 * it loads nearby results so that ClubDetailPage / ContactPage / ProfilePage
 * can resolve an OSM `id` back to a full club object after navigation.
 */
const REGISTRY_KEY = 'osm_clubs_registry_v1';
const MAX_ENTRIES = 300;

interface RegistryShape {
  ts: number;
  clubs: Record<string, Club>;
}

const load = (): RegistryShape => {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return { ts: Date.now(), clubs: {} };
    return JSON.parse(raw) as RegistryShape;
  } catch {
    return { ts: Date.now(), clubs: {} };
  }
};

const save = (data: RegistryShape) => {
  try {
    // Trim if too big — keep most recent entries.
    const entries = Object.entries(data.clubs);
    if (entries.length > MAX_ENTRIES) {
      data.clubs = Object.fromEntries(entries.slice(-MAX_ENTRIES));
    }
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

export const rememberClubs = (clubs: Club[]) => {
  const data = load();
  for (const c of clubs) data.clubs[c.id] = c;
  data.ts = Date.now();
  save(data);
};

export const lookupClub = (id: string): Club | null => {
  const data = load();
  return data.clubs[id] ?? null;
};

const CACHE_KEY = (sportId: string, lat: number, lon: number, radiusKm: number) =>
  `osm_clubs_${sportId}_${lat.toFixed(2)}_${lon.toFixed(2)}_${radiusKm}`;

const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

interface CachedResult {
  ts: number;
  clubs: Club[];
}

export const readCache = (sportId: string, lat: number, lon: number, radiusKm: number): Club[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY(sportId, lat, lon, radiusKm));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedResult;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.clubs;
  } catch {
    return null;
  }
};

export const writeCache = (sportId: string, lat: number, lon: number, radiusKm: number, clubs: Club[]) => {
  try {
    localStorage.setItem(
      CACHE_KEY(sportId, lat, lon, radiusKm),
      JSON.stringify({ ts: Date.now(), clubs }),
    );
  } catch {
    /* ignore */
  }
};

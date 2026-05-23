import { haversineKm } from '../utils/geo';
import type { Club } from '../types';

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

/**
 * Mapping sport ID → OSM `sport=*` values (regex alternatives) and whether
 * we should also include common `leisure=*` POIs that often miss a sport tag.
 */
interface SportQuery {
  sportRegex?: string;
  leisure?: string[];
  /** When true, the query also accepts `club=sport` rows whose sport list contains any sport tag. */
  acceptUntaggedClub?: boolean;
}

const SPORT_TO_OSM: Record<string, SportQuery> = {
  fussball: { sportRegex: 'soccer' },
  basketball: { sportRegex: 'basketball' },
  tennis: { sportRegex: 'tennis' },
  schwimmen: { sportRegex: 'swimming', leisure: ['swimming_pool', 'swimming_area'] },
  klettern: { sportRegex: 'climbing|bouldering', leisure: ['climbing'] },
  yoga: { sportRegex: 'yoga', leisure: ['fitness_centre'] },
  boxen: { sportRegex: 'boxing' },
  laufen: { sportRegex: 'running|athletics', leisure: ['track'] },
  radfahren: { sportRegex: 'cycling' },
  volleyball: { sportRegex: 'volleyball|beachvolleyball' },
  handball: { sportRegex: 'handball' },
  judo: { sportRegex: 'judo' },
  karate: { sportRegex: 'karate' },
  kickboxen: { sportRegex: 'kickboxing|muay_thai' },
  badminton: { sportRegex: 'badminton' },
  tischtennis: { sportRegex: 'table_tennis' },
  squash: { sportRegex: 'squash' },
  rudern: { sportRegex: 'rowing' },
  segeln: { sportRegex: 'sailing' },
  surfen: { sportRegex: 'surfing' },
  krafttraining: { sportRegex: 'fitness|weightlifting', leisure: ['fitness_centre'] },
  crossfit: { sportRegex: 'crossfit|fitness', leisure: ['fitness_centre'] },
  pilates: { sportRegex: 'pilates', leisure: ['fitness_centre'] },
  wandern: { sportRegex: 'hiking' },
  mountainbike: { sportRegex: 'cycling|mtb' },
  ski: { sportRegex: 'skiing' },
  snowboard: { sportRegex: 'snowboarding|skiing' },
  eishockey: { sportRegex: 'ice_hockey', leisure: ['ice_rink'] },
  tanzen: { sportRegex: 'dance', leisure: ['dance'] },
  parkour: { sportRegex: 'parkour' },
  reiten: { sportRegex: 'equestrian', leisure: ['horse_riding'] },
  golf: { sportRegex: 'golf' },
};

const buildQuery = (sportId: string, lat: number, lon: number, radiusM: number): string | null => {
  const cfg = SPORT_TO_OSM[sportId];
  if (!cfg) return null;
  const around = `(around:${radiusM},${lat},${lon})`;
  const parts: string[] = [];
  if (cfg.sportRegex) {
    parts.push(`nwr["sport"~"^(${cfg.sportRegex})$"]${around};`);
    parts.push(`nwr["club"="sport"]["sport"~"${cfg.sportRegex}"]${around};`);
  }
  if (cfg.leisure) {
    for (const l of cfg.leisure) parts.push(`nwr["leisure"="${l}"]${around};`);
  }
  if (!parts.length) return null;
  return `[out:json][timeout:25];(${parts.join('')});out center 60;`;
};

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const formatAddress = (tags: Record<string, string>): string => {
  const street = tags['addr:street'];
  const housenumber = tags['addr:housenumber'];
  const postcode = tags['addr:postcode'];
  const city = tags['addr:city'] ?? tags['addr:suburb'] ?? tags['addr:town'];
  const parts: string[] = [];
  if (street) parts.push(housenumber ? `${street} ${housenumber}` : street);
  if (postcode || city) parts.push([postcode, city].filter(Boolean).join(' '));
  return parts.join(', ') || tags['addr:full'] || '';
};

const pickTag = (tags: Record<string, string>, keys: string[]): string | undefined => {
  for (const k of keys) if (tags[k]) return tags[k];
  return undefined;
};

const cleanWebsite = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const elementToClub = (
  el: OverpassElement,
  sportId: string,
  userLat: number,
  userLon: number,
): Club | null => {
  const tags = el.tags ?? {};
  const name = tags.name ?? tags['name:de'] ?? tags.operator;
  if (!name) return null;
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;
  const distanceKm = haversineKm(userLat, userLon, lat, lon);
  return {
    id: `osm:${el.type}:${el.id}`,
    source: 'osm',
    name,
    sportId,
    distanceKm: Math.round(distanceKm * 100) / 100,
    address: formatAddress(tags),
    trialAvailable: false,
    lat,
    lon,
    website: cleanWebsite(pickTag(tags, ['website', 'contact:website', 'url'])),
    contactPhone: pickTag(tags, ['phone', 'contact:phone']),
    contactEmail: pickTag(tags, ['email', 'contact:email']),
    openingHours: pickTag(tags, ['opening_hours']),
    description: tags.description,
  };
};

const tryEndpoint = async (endpoint: string, query: string, signal?: AbortSignal): Promise<OverpassElement[]> => {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    signal,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.elements) ? (data.elements as OverpassElement[]) : [];
};

export const fetchNearbyClubs = async (
  sportId: string,
  lat: number,
  lon: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Club[]> => {
  const query = buildQuery(sportId, lat, lon, Math.round(radiusKm * 1000));
  if (!query) return [];

  let lastErr: Error | null = null;
  for (const ep of ENDPOINTS) {
    try {
      const elements = await tryEndpoint(ep, query, signal);
      const seen = new Set<string>();
      const clubs: Club[] = [];
      for (const el of elements) {
        const c = elementToClub(el, sportId, lat, lon);
        if (!c) continue;
        const dedupKey = c.name.toLowerCase() + '|' + Math.round(c.lat! * 1000) + '|' + Math.round(c.lon! * 1000);
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);
        clubs.push(c);
      }
      clubs.sort((a, b) => a.distanceKm - b.distanceKm);
      return clubs;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      if (signal?.aborted) throw lastErr;
    }
  }
  throw lastErr ?? new Error('Overpass fehlgeschlagen');
};

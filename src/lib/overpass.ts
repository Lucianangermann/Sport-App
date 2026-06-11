import { haversineKm } from '../utils/geo';
import type { Club } from '../types';

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

/** Per-sport configuration. `sportRegex` matches OSM `sport=*` values
 * (including semicolon-separated multi-sport tags). `leisureSpecific`
 * lists leisure types where the sport is typically implicit (e.g.
 * `swimming_pool` for Schwimmen). */
interface SportQuery {
  sportRegex: string;
  leisureSpecific: string[];
}

const SPORT_TO_OSM: Record<string, SportQuery> = {
  fussball: { sportRegex: 'soccer', leisureSpecific: [] },
  basketball: { sportRegex: 'basketball', leisureSpecific: [] },
  tennis: { sportRegex: 'tennis|padel', leisureSpecific: [] },
  schwimmen: { sportRegex: 'swimming', leisureSpecific: ['swimming_pool', 'swimming_area'] },
  klettern: { sportRegex: 'climbing|bouldering', leisureSpecific: ['climbing'] },
  yoga: { sportRegex: 'yoga', leisureSpecific: ['fitness_centre'] },
  boxen: { sportRegex: 'boxing', leisureSpecific: [] },
  laufen: { sportRegex: 'running|athletics|jogging', leisureSpecific: ['track'] },
  radfahren: { sportRegex: 'cycling|road_cycling', leisureSpecific: [] },
  volleyball: { sportRegex: 'volleyball|beachvolleyball', leisureSpecific: [] },
  handball: { sportRegex: 'handball', leisureSpecific: [] },
  judo: { sportRegex: 'judo', leisureSpecific: [] },
  karate: { sportRegex: 'karate', leisureSpecific: [] },
  kickboxen: { sportRegex: 'kickboxing|muay_thai', leisureSpecific: [] },
  badminton: { sportRegex: 'badminton', leisureSpecific: [] },
  tischtennis: { sportRegex: 'table_tennis', leisureSpecific: [] },
  squash: { sportRegex: 'squash', leisureSpecific: [] },
  rudern: { sportRegex: 'rowing', leisureSpecific: [] },
  segeln: { sportRegex: 'sailing', leisureSpecific: ['marina'] },
  surfen: { sportRegex: 'surfing|kitesurfing', leisureSpecific: [] },
  krafttraining: { sportRegex: 'fitness|weightlifting|gym', leisureSpecific: ['fitness_centre'] },
  crossfit: { sportRegex: 'crossfit|fitness', leisureSpecific: ['fitness_centre'] },
  pilates: { sportRegex: 'pilates|fitness', leisureSpecific: ['fitness_centre'] },
  wandern: { sportRegex: 'hiking', leisureSpecific: [] },
  mountainbike: { sportRegex: 'cycling|mtb|bmx', leisureSpecific: [] },
  ski: { sportRegex: 'skiing|alpine_skiing', leisureSpecific: [] },
  snowboard: { sportRegex: 'snowboarding|skiing', leisureSpecific: [] },
  eishockey: { sportRegex: 'ice_hockey|hockey', leisureSpecific: ['ice_rink'] },
  tanzen: { sportRegex: 'dance|dancing', leisureSpecific: ['dance'] },
  parkour: { sportRegex: 'parkour|free_running', leisureSpecific: [] },
  reiten: { sportRegex: 'equestrian|horse_riding', leisureSpecific: ['horse_riding'] },
  golf: { sportRegex: 'golf|miniature_golf', leisureSpecific: ['golf_course'] },
};

const LEISURE_LABEL: Record<string, string> = {
  fitness_centre: 'Studio',
  sports_centre: 'Halle',
  sport_centre: 'Halle',
  pitch: 'Platz',
  stadium: 'Stadion',
  track: 'Bahn',
  swimming_pool: 'Schwimmbad',
  swimming_area: 'Badestelle',
  ice_rink: 'Eishalle',
  climbing: 'Kletterhalle',
  horse_riding: 'Reithof',
  marina: 'Yachthafen',
  golf_course: 'Golfplatz',
  dance: 'Tanzstudio',
};

/** Sports that rarely have a dedicated club POI in OSM. We still search but lower expectations. */
const NICHE_SPORTS = new Set(['laufen', 'wandern', 'radfahren', 'mountainbike', 'parkour']);

export const isNicheSport = (sportId: string) => NICHE_SPORTS.has(sportId);

const buildQuery = (sportId: string, lat: number, lon: number, radiusM: number): string | null => {
  const cfg = SPORT_TO_OSM[sportId];
  if (!cfg) return null;
  const around = `(around:${radiusM},${lat},${lon})`;
  const parts: string[] = [];
  // (1) Anything with a matching sport tag — note: NO anchors, so multi-sport like
  //     "soccer;basketball" is matched.
  parts.push(`nwr["sport"~"${cfg.sportRegex}",i]${around};`);
  // (2) Sport-specific leisure POIs where the sport is implicit.
  for (const l of cfg.leisureSpecific) parts.push(`nwr["leisure"="${l}"]${around};`);
  // (3) Multi-sport clubs: typical German "TSV / SV"-style Vereine often only carry
  //     leisure=sports_centre or club=sport without a specific sport tag.
  parts.push(`nwr["club"="sport"]${around};`);
  parts.push(`nwr["leisure"~"^sports?_centre$"]${around};`);
  return `[out:json][timeout:40];(${parts.join('')});out center 120;`;
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

interface Classification {
  score: number;
  kind: string;
  multiSport: boolean;
}

const classify = (tags: Record<string, string>, cfg: SportQuery): Classification | null => {
  const sport = tags.sport ?? '';
  const sportRe = new RegExp(cfg.sportRegex, 'i');
  const sportMatch = sport && sportRe.test(sport);

  const leisure = tags.leisure ?? '';
  const isClub = tags.club === 'sport';
  const isSpecificLeisure = cfg.leisureSpecific.includes(leisure);
  const isFitness = leisure === 'fitness_centre';
  const isSportsCentre = leisure === 'sports_centre' || leisure === 'sport_centre';
  const isPitchLike = leisure === 'pitch' || leisure === 'stadium' || leisure === 'track';

  // Assigned in every branch below (the final `else` returns), so no init.
  let score: number;
  let kind: string;
  let multiSport = false;

  if (sportMatch && isClub) {
    score = 100;
    kind = 'Verein';
  } else if (sportMatch && isSpecificLeisure) {
    score = 95;
    kind = LEISURE_LABEL[leisure] ?? 'Anlage';
  } else if (sportMatch && isFitness) {
    score = 90;
    kind = 'Studio';
  } else if (sportMatch && isSportsCentre) {
    score = 85;
    kind = 'Halle';
  } else if (sportMatch && isPitchLike) {
    score = 80;
    kind = LEISURE_LABEL[leisure] ?? 'Platz';
  } else if (sportMatch) {
    score = 75;
    kind = 'Anlage';
  } else if (isSpecificLeisure) {
    score = 70;
    kind = LEISURE_LABEL[leisure] ?? 'Anlage';
  } else if (isClub) {
    score = 60;
    kind = 'Verein';
    multiSport = true;
  } else if (isSportsCentre) {
    score = 55;
    kind = 'Halle';
    multiSport = true;
  } else {
    return null;
  }

  return { score, kind, multiSport };
};

const elementToClub = (
  el: OverpassElement,
  sportId: string,
  cfg: SportQuery,
  userLat: number,
  userLon: number,
): (Club & { score: number }) | null => {
  const tags = el.tags ?? {};
  const name = tags.name ?? tags['name:de'] ?? tags.operator ?? tags.brand;
  if (!name) return null;
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const cls = classify(tags, cfg);
  if (!cls) return null;

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
    kind: cls.kind,
    multiSport: cls.multiSport,
    score: cls.score,
  };
};

const ENDPOINT_TIMEOUT_MS = 12000;

const tryEndpoint = async (
  endpoint: string,
  query: string,
  signal: AbortSignal,
): Promise<OverpassElement[]> => {
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

/** Race three Overpass endpoints in parallel. First success wins, others get aborted. */
const raceEndpoints = async (query: string, parentSignal?: AbortSignal): Promise<OverpassElement[]> => {
  const ctrls = ENDPOINTS.map(() => new AbortController());
  // Per-endpoint timeout in addition to client signal.
  const timers = ctrls.map((c) =>
    window.setTimeout(() => c.abort(), ENDPOINT_TIMEOUT_MS),
  );
  if (parentSignal) {
    parentSignal.addEventListener('abort', () => ctrls.forEach((c) => c.abort()));
  }

  let pending = ENDPOINTS.length;
  let lastErr: Error = new Error('Overpass fehlgeschlagen');

  return new Promise<OverpassElement[]>((resolve, reject) => {
    ENDPOINTS.forEach((ep, i) => {
      tryEndpoint(ep, query, ctrls[i].signal)
        .then((result) => {
          // Cancel other endpoints
          ctrls.forEach((c, j) => {
            if (j !== i) c.abort();
          });
          timers.forEach((t) => window.clearTimeout(t));
          resolve(result);
        })
        .catch((err) => {
          lastErr = err instanceof Error ? err : new Error(String(err));
          pending--;
          if (pending === 0) {
            timers.forEach((t) => window.clearTimeout(t));
            reject(lastErr);
          }
        });
    });
  });
};

export const fetchNearbyClubs = async (
  sportId: string,
  lat: number,
  lon: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Club[]> => {
  const cfg = SPORT_TO_OSM[sportId];
  if (!cfg) return [];
  const query = buildQuery(sportId, lat, lon, Math.round(radiusKm * 1000));
  if (!query) return [];

  const elements = await raceEndpoints(query, signal);
  const seen = new Map<string, Club & { score: number }>();
  for (const el of elements) {
    const c = elementToClub(el, sportId, cfg, lat, lon);
    if (!c) continue;
    const dedupKey = `${c.name.toLowerCase().trim()}|${Math.round(c.lat! * 1000)}|${Math.round(c.lon! * 1000)}`;
    const existing = seen.get(dedupKey);
    if (!existing || existing.score < c.score) seen.set(dedupKey, c);
  }

  return Array.from(seen.values())
    .sort((a, b) => {
      // High score first, then nearer first.
      if (b.score !== a.score) return b.score - a.score;
      return a.distanceKm - b.distanceKm;
    })
    .map(({ score: _score, ...rest }) => rest);
};

import type { Club, Sport } from '../types';

/** Generic emoji per POI kind — used for multi-sport venues where the
 * specific sport emoji would be misleading. */
const KIND_EMOJI: Record<string, string> = {
  Verein: '🏟️',
  Halle: '🏟️',
  Studio: '💪',
  Platz: '🥅',
  Stadion: '🏟️',
  Bahn: '🏃',
  Anlage: '🏟️',
  Schwimmbad: '🏊',
  Badestelle: '🏖️',
  Eishalle: '⛸️',
  Kletterhalle: '🧗',
  Reithof: '🐎',
  Yachthafen: '⛵️',
  Golfplatz: '⛳️',
  Tanzstudio: '💃',
};

/** Choose the best emoji for a club card.
 *  - Curated mock data: always use the sport emoji.
 *  - OSM sport-match: use the sport emoji.
 *  - OSM multi-sport venue: use a kind-based generic emoji so the user can
 *    tell at a glance that this isn't a sport-specific result. */
export const emojiForClub = (club: Club, sport?: Sport): string => {
  if (club.multiSport && club.kind && KIND_EMOJI[club.kind]) {
    return KIND_EMOJI[club.kind];
  }
  if (club.source === 'osm' && club.kind && club.kind !== 'Verein' && KIND_EMOJI[club.kind]) {
    // Specific facility type (e.g. Schwimmbad, Reithof) carries more information
    // than the sport emoji for non-Verein POIs.
    return KIND_EMOJI[club.kind];
  }
  return sport?.emoji ?? '🏅';
};

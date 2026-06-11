import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchNearbyClubs } from '../lib/overpass';
import { readCache, rememberClubs, writeCache } from '../lib/clubRegistry';
import { getUserPosition, type UserPosition } from '../utils/geo';
import { useAppStore } from '../store/useAppStore';
import type { Club } from '../types';

interface UseNearbyClubsArgs {
  sportId: string | null;
  radiusKm: number;
}

interface UseNearbyClubsResult {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  position: UserPosition | null;
  /** The radius the request was made with. */
  requestedRadiusKm: number;
  /** The radius that actually produced results (after auto-expansion). */
  effectiveRadiusKm: number;
  refresh: () => void;
}

const EXPANSION_LADDER = [2, 5, 10, 25, 50];

const expansionFor = (requested: number): number[] => {
  const idx = EXPANSION_LADDER.indexOf(requested);
  if (idx === -1) return [requested];
  return EXPANSION_LADDER.slice(idx);
};

const filterByRadius = (clubs: Club[], radiusKm: number): Club[] =>
  clubs.filter((c) => c.distanceKm <= radiusKm);

export const useNearbyClubs = ({ sportId, radiusKm }: UseNearbyClubsArgs): UseNearbyClubsResult => {
  const locationEnabled = useAppStore((s) => s.profile.settings.locationEnabled);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [effectiveRadiusKm, setEffectiveRadiusKm] = useState(radiusKm);
  const abortRef = useRef<AbortController | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    if (!sportId) {
      // Reset derived state when there's no sport to query. This effect is the
      // canonical geolocation+network sync, so synchronous resets here are fine.
      /* eslint-disable react-hooks/set-state-in-effect */
      setClubs([]);
      setPosition(null);
      setEffectiveRadiusKm(radiusKm);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const pos = await getUserPosition(locationEnabled);
        if (cancelled) return;
        setPosition(pos);

        const lat = Math.round(pos.lat * 100) / 100;
        const lon = Math.round(pos.lon * 100) / 100;

        // Try the requested radius first, then expand if empty.
        const radiiToTry = expansionFor(radiusKm);
        let resolved = false;
        for (const r of radiiToTry) {
          if (cancelled || ctrl.signal.aborted) return;

          let results = readCache(sportId, lat, lon, r);
          if (!results) {
            results = await fetchNearbyClubs(sportId, pos.lat, pos.lon, r, ctrl.signal);
            if (cancelled) return;
            writeCache(sportId, lat, lon, r, results);
          }
          // The fetched list is unbounded by radius — filter to "r km" precisely for stable UX.
          const within = filterByRadius(results, r);
          if (within.length > 0) {
            setClubs(within);
            rememberClubs(within);
            setEffectiveRadiusKm(r);
            resolved = true;
            break;
          }
        }
        if (!resolved) {
          setClubs([]);
          setEffectiveRadiusKm(radiiToTry[radiiToTry.length - 1] ?? radiusKm);
        }
      } catch (err) {
        if (cancelled || ctrl.signal.aborted) return;
        const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [sportId, radiusKm, locationEnabled, reloadToken]);

  return {
    clubs,
    loading,
    error,
    position,
    requestedRadiusKm: radiusKm,
    effectiveRadiusKm,
    refresh,
  };
};

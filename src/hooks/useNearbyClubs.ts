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
  refresh: () => void;
}

export const useNearbyClubs = ({ sportId, radiusKm }: UseNearbyClubsArgs): UseNearbyClubsResult => {
  const locationEnabled = useAppStore((s) => s.profile.settings.locationEnabled);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    if (!sportId) {
      setClubs([]);
      setPosition(null);
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

        const cached = readCache(sportId, lat, lon, radiusKm);
        if (cached) {
          setClubs(cached);
          rememberClubs(cached);
          setLoading(false);
          return;
        }

        const result = await fetchNearbyClubs(sportId, pos.lat, pos.lon, radiusKm, ctrl.signal);
        if (cancelled) return;
        setClubs(result);
        rememberClubs(result);
        writeCache(sportId, lat, lon, radiusKm, result);
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

  return { clubs, loading, error, position, refresh };
};

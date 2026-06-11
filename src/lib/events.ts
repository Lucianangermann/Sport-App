import { useEffect, useRef } from 'react';
import type { SkillLevel } from '../types';

/**
 * Domain event layer.
 *
 * The app's features (gamification, insights, …) used to communicate purely
 * through shared Zustand state and reverse-engineer "what happened" by diffing
 * that state inside `useEffect`. That pattern is fragile — a reload looks like
 * a state change, so rewards fired on mount (see git history of useGameEvents).
 *
 * Instead, *actions* emit semantic events here, and features *subscribe*. An
 * event means "this just happened", exactly once, at the moment it happened —
 * there is nothing to misread on reload.
 */
export interface DomainEvents {
  'module.completed': { sportId: string; level: SkillLevel; moduleId: string };
  'module.uncompleted': { sportId: string; level: SkillLevel; moduleId: string };
  'streak.advanced': { days: number };
  'onboarding.completed': Record<string, never>;
  'inquiry.sent': { clubId: string };
}

type EventType = keyof DomainEvents;
type Handler<K extends EventType> = (payload: DomainEvents[K]) => void;

// Public API is fully typed; the store itself is type-erased (the generic index
// can't be expressed soundly), so casts are confined to these two functions.
type AnyHandler = (payload: never) => void;
const listeners = new Map<EventType, Set<AnyHandler>>();

/** Subscribe to an event. Returns an unsubscribe function. */
export function on<K extends EventType>(type: K, handler: Handler<K>): () => void {
  let set = listeners.get(type);
  if (!set) listeners.set(type, (set = new Set()));
  set.add(handler as AnyHandler);
  return () => set!.delete(handler as AnyHandler);
}

/** Emit an event to all current subscribers. */
export function emit<K extends EventType>(type: K, payload: DomainEvents[K]): void {
  const set = listeners.get(type);
  if (!set) return;
  // Iterate a copy so a handler that (un)subscribes mid-dispatch is safe.
  for (const handler of [...set]) (handler as Handler<K>)(payload);
}

/**
 * React binding: subscribe for the lifetime of the component. The latest
 * handler is always called, so callers don't need to memoize it — no stale
 * closures, no re-subscribe churn.
 */
export function useDomainEvent<K extends EventType>(type: K, handler: Handler<K>): void {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => on(type, (payload) => ref.current(payload)), [type]);
}

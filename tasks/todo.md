# Sportify — System-Verbesserung (phasenweise)

Architektur-Kernproblem: Features kommunizieren nur über Zustand und "erraten"
Ereignisse durch State-Diffing in `useEffect`. Das erzeugt eine ganze Bug-Klasse.
Vorgehen: erst Bugs fixen (verifizierbar), dann das Prinzip strukturell korrigieren.

## Phase 1 — Bugfixes (verifizierbar) ← ABGESCHLOSSEN, Check-in offen
- [x] `useGameEvents.ts`: XP-Vergabe nur bei echtem Anstieg von completedModulesCount
      (heute: feuert bei jedem Mount/Reload → +30 XP geschenkt; feuert beim Abwählen)
- [x] `useGameEvents.ts`: toten Code entfernen (`prevProgressRef = useEffect(...)`)
- [x] `useGameEvents.ts`: Streak-Crate nur einmal pro erreichtem 7er-Schritt (nicht bei jedem Mount)
- [x] `xpStore.ts`: `INITIAL_XP = 2340` → `0` (kein Demo-Seed in echten Nutzerdaten)
- [x] `ErrorBoundary` hinzufügen + App umschließen (kein White-Screen mehr)
- [x] Verifizieren: `tsc -b` + `vite build` grün, Bug-Szenarien durchdacht
- [ ] CHECK-IN mit Nutzer

## Phase 2 — Event-Layer + XP-Unifizierung ← ABGESCHLOSSEN
- [x] `lib/events.ts`: typisierter Domain-Event-Bus (emit/on/useDomainEvent)
- [x] `toggleModule`/`completeOnboarding`/`addInquiry` emittieren semantische Events
- [x] `useGameEvents` abonniert Events statt State zu diffen (Bug-Klasse strukturell weg)
- [x] XP-Wahrheit vereinheitlicht: `profile.xp` + `helpers.xpForLevel` entfernt,
      xpStore ist alleinige Quelle; ProfilePage + useInsights lesen daraus
- [x] Bonus-Cleanup: useInsights nutzt useMemo + lazy state statt setState-im-Effect
- [x] Verifiziert: tsc ✓, vite build ✓, eslint (geänderte Dateien) ✓, Dev-Boot HTTP 200 ✓

## Phase 3 — Doku & Tests
- [ ] README schreiben (App statt Vite-Template)
- [ ] Tests für calcLevel / Event-Layer / Recommendation-Scoring

## Review
(wird nach Abschluss gefüllt)

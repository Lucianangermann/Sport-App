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

## Phase 3 — Doku & Tests ← ABGESCHLOSSEN
- [x] Vitest eingerichtet (vite.config test-Block, setup mit In-Memory-localStorage,
      test/test:watch-Scripts)
- [x] Tests: events (6), calcLevel (7), helpers/Scoring (7) — 20 Tests grün
- [x] README neu geschrieben (App, Architektur, Event-Layer, Setup, Datenquellen)
- [x] Verifiziert: npm test ✓ (20/20), npm run build ✓

## Review
- Architektur-Kern korrigiert: Features kommunizieren jetzt über einen
  typisierten Domain-Event-Bus statt über State-Diffing in useEffect.
  Das hat den Reload-XP-Bug, den Abwähl-Bug und die Fragilität an der Wurzel
  beseitigt — nicht nur symptomatisch geflickt.
- XP/Level haben eine einzige Wahrheit (xpStore); profile.xp + helpers.xpForLevel
  entfernt. Keine widersprüchlichen XP-Anzeigen mehr.
- Sicherheitsnetze: ErrorBoundary (kein White-Screen), INITIAL_XP=0.
- 20 Tests sichern die kritische Logik; README dokumentiert das Prinzip.

### Offene Beobachtungen (nicht in diesem Auftrag umgesetzt)
- badgeStore seedet `DEMO_UNLOCKED` Badges + Showcase — gleicher „Demo-Seed in
  echten Nutzerdaten"-Fall wie das frühere INITIAL_XP. Kandidat zum Entfernen.
- Community-Inhalte sind statische Fixtures (als „live" dargestellt).
- Bundle ist ~987 kB (eine Datei) — Code-Splitting per Route wäre lohnend.
- Vorbestehende Lint-Fehler in pages/community/* (Math.random im Render,
  any-Typen) — unberührt gelassen, außerhalb des Auftrags.

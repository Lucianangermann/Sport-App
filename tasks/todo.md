# Sportify — Phase 4: Offene Beobachtungen abarbeiten

Reihenfolge (jeder Punkt einzeln verifiziert + committet):

## 4.1 — Badge-Demo-Seed entfernen ← ABGESCHLOSSEN
- [x] `badgeStore`: `DEMO_UNLOCKED` + Showcase-Seed raus (neue Nutzer starten leer)
- [x] geprüft: lootStore availableCrates:1 = bewusstes Willkommensgeschenk, bleibt
- [x] Verifiziert: build + tests grün

## 4.2 — Lint vollständig grün (`npm run lint` exit 0) ← ABGESCHLOSSEN
ECHTE Bugs (Wrapper/Inner-Split, Hooks jetzt unbedingt):
- [x] TrainingPlanGenerator.tsx: rules-of-hooks behoben
- [x] SportDetailPage.tsx: rules-of-hooks behoben
Saubere Wertfixes:
- [x] LiveSessionsPage.tsx: Math.random/Date.now → Modul-Helper, left im State
- [x] SportMapPage.tsx: Leaflet-any begründet disabled (CDN-Global), deps-Hinweis
- [x] MentorsPage.tsx: let→const
- [x] overpass.ts: definite assignment + varsIgnorePattern '^_' in eslint config
- [x] SportMatchQuiz.tsx: animKey-Effect → key={currentIdx} (Effect entfernt)
- [x] useRecommendations.ts: lazy-init + generate vor Effect (3 Fehler weg)
Legitime Effekt-State-Machines (begründetes scoped disable):
- [x] useNearbyClubs / LootBoxPage / useCoach: set-state-in-effect Sync-Fälle
- [x] Verifiziert: eslint exit 0, build ✓, 20 Tests ✓, Dev-Boot HTTP 200 ✓

## 4.3 — Route-basiertes Code-Splitting ← ABGESCHLOSSEN
- [x] App.tsx: Routen via React.lazy + Suspense, Shell/Onboarding/GameLayer eager
- [x] Ergebnis: Haupt-Bundle 987 kB → 440 kB (gzip 140 kB); modules/community
      als eigene Chunks; 500-kB-Warnung weg
- [x] Verifiziert: build (viele Chunks), eslint exit 0, Dev-Boot HTTP 200

## 4.4 — Community-Fixtures ehrlich kennzeichnen ← ABGESCHLOSSEN
- [x] Wiederverwendbare `DemoDataNotice` (dezent, gestrichelt, ℹ️)
- [x] Auf Community-Hub + 6 Unterseiten (Feed, Challenges, Buddies, Mentoren,
      Live, Map) platziert
- [x] Verifiziert: build ✓, eslint exit 0, 20 Tests ✓, Dev-Boot HTTP 200

## Review (Phase 4)
- 4.1 Badge-Demo-Seed entfernt — neue Nutzer starten ehrlich bei 0.
- 4.2 Lint von 24 Problemen → 0. Zwei echte rules-of-hooks-Bugs strukturell
  behoben (Wrapper/Inner-Split). Übrige als saubere Wertfixes oder begründete,
  gezielte Disables für legitime Effekt-Sync-Fälle.
- 4.3 Code-Splitting: Haupt-Bundle 987 kB → 440 kB; Inhalte laden per Route.
- 4.4 Community-Demo-Inhalte ehrlich als „Beispieldaten" gekennzeichnet.
- Jede Teilaufgabe einzeln verifiziert (build/lint/test/boot) und committet+gepusht.

### Bewusst nicht geändert
- lootStore `availableCrates: 1` = Willkommensgeschenk (kein Fake-Fortschritt).
- DuellPage/Community-Stores enthalten Mock-Gegner/Inhalte — als Feature-Demo
  nötig; jetzt durch DemoDataNotice transparent.

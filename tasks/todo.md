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

## 4.3 — Route-basiertes Code-Splitting
- [ ] App.tsx: Routen via React.lazy + Suspense (Bundle ~987 kB aufteilen)
- [ ] Verifizieren: build zeigt mehrere Chunks, App bootet

## 4.4 — Community-Fixtures ehrlich kennzeichnen
- [ ] Statische Demo-Inhalte als „Beispieldaten" markieren statt als „live"
- [ ] Verifizieren: build + sinnvolle, unaufdringliche Kennzeichnung

## Review
(wird gefüllt)

# Sportify — Phase 4: Offene Beobachtungen abarbeiten

Reihenfolge (jeder Punkt einzeln verifiziert + committet):

## 4.1 — Badge-Demo-Seed entfernen
- [ ] `badgeStore`: `DEMO_UNLOCKED` + Showcase-Seed raus (neue Nutzer starten leer)
- [ ] prüfen, ob weitere Stores Demo-Seeds haben (quest/duel/season/loot)
- [ ] Verifizieren: build + UI-Logik (leere Zustände brechen nicht)

## 4.2 — Lint vollständig grün (`npm run lint` exit 0)
ECHTE Bugs zuerst:
- [ ] TrainingPlanGenerator.tsx: Hooks bedingt aufgerufen (rules-of-hooks)
- [ ] SportDetailPage.tsx: useNearbyClubs bedingt aufgerufen (rules-of-hooks)
Dann Rest:
- [ ] LiveSessionsPage.tsx: Math.random im Render (purity)
- [ ] SportMapPage.tsx: any-Typen + exhaustive-deps
- [ ] MentorsPage.tsx: prefer-const
- [ ] overpass.ts: useless-assignment + unused var
- [ ] useRecommendations.ts: var-before-declared / memoization
- [ ] useCoach.ts, LootBoxPage.tsx, SportMatchQuiz.tsx, useNearbyClubs.ts: Rest

## 4.3 — Route-basiertes Code-Splitting
- [ ] App.tsx: Routen via React.lazy + Suspense (Bundle ~987 kB aufteilen)
- [ ] Verifizieren: build zeigt mehrere Chunks, App bootet

## 4.4 — Community-Fixtures ehrlich kennzeichnen
- [ ] Statische Demo-Inhalte als „Beispieldaten" markieren statt als „live"
- [ ] Verifizieren: build + sinnvolle, unaufdringliche Kennzeichnung

## Review
(wird gefüllt)

# Sportify 🏅

Eine mobil-first Web-App, die Menschen hilft, eine Sportart zu **finden**, sie
**zu lernen** und am Ball zu bleiben — mit Trainingsplänen, einer echten
Vereinssuche, einer Community-Schicht und durchgehender Gamification.

Reine Frontend-App: kein Backend, kein API-Key. Aller Nutzerzustand liegt lokal
im Browser (`localStorage`). 32 Sportarten mit dreistufigen Lehrplänen
(Anfänger / Fortgeschritten / Profi).

## Tech-Stack

| Bereich        | Wahl                                   |
| -------------- | -------------------------------------- |
| Framework      | React 19 + TypeScript                  |
| Build / Dev    | Vite 8                                  |
| Styling        | Tailwind CSS 3                          |
| State          | Zustand (mit `persist`)                |
| Routing        | React Router 7                         |
| Animation      | Framer Motion, canvas-confetti         |
| Tests          | Vitest                                 |

## Schnellstart

```bash
npm install
npm run dev        # Dev-Server (http://localhost:5173)
npm run build      # tsc -b && vite build  → dist/
npm run preview    # gebautes Bundle lokal ansehen
npm run lint       # ESLint
npm test           # Vitest (einmalig)
npm run test:watch # Vitest im Watch-Modus
```

## Architektur

### Feature-Slices

Code ist nach Feature geschnitten, nicht nach technischer Schicht. Jedes Feature
unter `src/features/<name>/` besitzt seinen eigenen `store/`, seine
`components/`, `pages/`, `hooks/` und `data/`. Geteilte Bausteine liegen in
`src/components/`, `src/store/`, `src/utils/` und `src/lib/`.

```
src/
├── data/                 statische Inhalte (Sportarten, Lehrpläne, Drills)
├── pages/                Top-Level-Routen (+ pages/community/…)
├── features/
│   ├── gamification/     XP, Level, Badges, Quests, Duelle, Season, Loot
│   ├── community/        Feed, Buddies, Mentoren, Live, Map, …
│   ├── recommendations/  regelbasierte Sport-Empfehlungen
│   ├── insights/         wöchentliche Trainings-Insights
│   ├── ai-coach/         regelbasierter Coach-Chat (keyword-getrieben)
│   ├── training-plan/    Trainingsplan-Generator
│   └── sport-quiz/       „Welcher Sport passt zu mir?"
├── store/                App-weiter Zustand (Profil, Fortschritt, Favoriten)
├── lib/                  Infrastruktur: Event-Bus, OSM-Anbindung
└── utils/                reine Helfer (Geo, Formatierung, Scoring)
```

### Domain-Event-Layer (`src/lib/events.ts`)

Features kommunizieren über einen kleinen, **typisierten Event-Bus**, nicht
indem sie gegenseitig fremden Zustand beobachten. Eine *Aktion* sendet ein
semantisches Ereignis; interessierte Features *abonnieren* es:

```ts
// Sender — in einer Store-Aktion (z. B. toggleModule):
emit('module.completed', { sportId, level, moduleId });

// Empfänger — in einem React-Hook (z. B. useGameEvents):
useDomainEvent('module.completed', () => {
  addXP(XP_SOURCES.COMPLETE_MODULE, 'Modul abgeschlossen');
});
```

Warum so: Ein Ereignis bedeutet „das ist *gerade jetzt* passiert" — genau
einmal. Der frühere Ansatz, Ereignisse aus Zustandsänderungen in `useEffect`
abzuleiten, verwechselte einen Reload mit einer echten Aktion und vergab
Belohnungen beim bloßen Laden der Seite. Der Event-Bus räumt diese ganze
Fehlerklasse strukturell aus.

Aktuelle Events: `module.completed`, `module.uncompleted`, `streak.advanced`,
`onboarding.completed`, `inquiry.sent`.

### Eine XP-Wahrheit

XP und Level leben ausschließlich im `gamification`-`xpStore` (Level-Bänder
Rookie → Legend, Multiplikator, Loot). Alle Ansichten lesen denselben Wert —
es gibt keinen zweiten, abweichenden XP-Zähler im Profil.

## Datenquellen

- **Lehrplaninhalte** (`src/data/`): kuratiert, statisch im Repo — inklusive
  echter YouTube-Lektionen je Modul.
- **Vereine** (`src/lib/overpass.ts`): live aus **OpenStreetMap** über die
  Overpass-API (mehrere Endpunkte als Fallback, Radius-Erweiterung). Keine
  erfundenen Entfernungen.
- **Community-Inhalte**: derzeit statische Demo-Fixtures.

## Tests

`npm test` führt die Vitest-Suite aus. Abgedeckt ist die kritische, reine
Logik: der Event-Bus (`src/lib/events.test.ts`), die Level-Berechnung
(`calcLevel`) und das Empfehlungs-Scoring. Tests laufen in der Node-Umgebung;
`src/test/setup.ts` stellt ein In-Memory-`localStorage` bereit, damit Module
mit persistenten Stores importierbar sind.

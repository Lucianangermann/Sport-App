import type { LessonContent, SkillLevel, SportCurriculum, TrainingModule } from '../types';
import { SPORTS } from './sports';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type LessonInput = {
  id: string;
  title: string;
  duration: string;
  description: string;
  ytVideoId?: string;
  channel?: string;
  content?: LessonContent;
};

const mod = (m: LessonInput): TrainingModule => m;

/* -------------------------------------------------------------------------- */
/*  Generic fallback curriculum                                               */
/* -------------------------------------------------------------------------- */

const genericBeginner: TrainingModule[] = [
  { id: 'b1', title: 'Grundlagen & Regeln', description: 'Die wichtigsten Regeln, Begriffe und Disziplinen im Überblick.', duration: '15 min' },
  { id: 'b2', title: 'Erste Bewegungen', description: 'Fundamentale Bewegungsabläufe, sauber und kontrolliert.', duration: '20 min' },
  { id: 'b3', title: 'Ausrüstung verstehen', description: 'Was du wirklich brauchst – und was nicht.', duration: '10 min' },
  { id: 'b4', title: 'Aufwärmen richtig', description: 'Verletzungen vermeiden, Leistung steigern.', duration: '12 min' },
];

const genericIntermediate: TrainingModule[] = [
  { id: 'i1', title: 'Technik vertiefen', description: 'Saubere Ausführung als Basis für mehr.', duration: '25 min' },
  { id: 'i2', title: 'Taktische Grundlagen', description: 'Strategie verstehen und anwenden.', duration: '30 min' },
  { id: 'i3', title: 'Konditionstraining', description: 'Ausdauer für ernsthaftes Training.', duration: '35 min' },
  { id: 'i4', title: 'Regeneration', description: 'Schlaf, Ernährung, aktive Erholung.', duration: '15 min' },
];

const genericAdvanced: TrainingModule[] = [
  { id: 'p1', title: 'Peak Performance', description: 'Die letzten Prozent herauskitzeln.', duration: '40 min' },
  { id: 'p2', title: 'Mentaltraining', description: 'Fokus, Visualisierung, Wettkampfpsychologie.', duration: '30 min' },
  { id: 'p3', title: 'Periodisierung', description: 'Trainingsphasen sinnvoll planen.', duration: '35 min' },
  { id: 'p4', title: 'Analyse & Daten', description: 'Mit Metriken besser werden.', duration: '25 min' },
];

/* -------------------------------------------------------------------------- */
/*  Shared modules used across multiple sports (Profi level)                  */
/* -------------------------------------------------------------------------- */

const periodisierungModule: TrainingModule = {
  id: 'p-period',
  title: 'Periodisierung verstehen',
  duration: '14 min',
  description: 'Wie du dein Training in Makro-, Meso- und Mikrozyklen sinnvoll aufbaust.',
  ytVideoId: 'XN3SKiZWJXI',
  channel: 'Peter Köster',
  content: {
    intro:
      'Periodisierung ist die Kunst, Training in Phasen zu denken. Statt jede Woche dasselbe zu machen, wechseln sich Belastung und Erholung systematisch ab – so vermeidest du Stagnation und Übertraining.',
    keyPoints: [
      'Makrozyklus: dein Jahr oder die Saison (z. B. Aufbau → Wettkampf → Übergang).',
      'Mesozyklus: 3–6 Wochen mit einem klaren Fokus (Hypertrophie, Kraft, Schnelligkeit).',
      'Mikrozyklus: deine Trainingswoche – Belastungswechsel zwischen den Einheiten.',
      'Deload: nach 3–5 harten Wochen eine Woche mit ~60 % Volumen einplanen.',
    ],
    tips: [
      'Schreibe deinen Plan vier Wochen im Voraus auf – nicht jeden Tag spontan entscheiden.',
      'Tracke RPE (gefühlte Anstrengung 1–10) zusätzlich zu Gewicht oder Tempo.',
    ],
  },
};

const mentaltrainingModule: TrainingModule = {
  id: 'p-mental',
  title: 'Mentaltraining: 5 Übungen für den Wettkampf',
  duration: '11 min',
  description: 'Visualisierung, Atmung und Selbstgespräch – Werkzeuge für den Kopf.',
  ytVideoId: '-jokYGikJv0',
  channel: 'Rheinischer Schützenbund',
  content: {
    intro:
      'Die letzten 10 % Leistung kommen aus dem Kopf. Mentaltraining ist erlernbar – wie ein Muskel. Diese fünf Bausteine bilden das Fundament.',
    keyPoints: [
      'Visualisierung: täglich 5 Minuten den perfekten Bewegungsablauf vor dem inneren Auge durchspielen.',
      'Atemanker: 4 Sekunden ein – 6 Sekunden aus, beruhigt das vegetative Nervensystem.',
      'Selbstgespräch: ersetze "nicht ins Aus" durch "ins Feld spielen" – das Gehirn liebt positive Bilder.',
      'Routinen: ein fester Ablauf vor dem Wettkampf reduziert Entscheidungsstress.',
      'Reframing: Nervosität als Energie deuten, nicht als Bedrohung.',
    ],
  },
};

const standardProfi: TrainingModule[] = [
  periodisierungModule,
  mentaltrainingModule,
  genericAdvanced[0],
  genericAdvanced[3],
];

/* -------------------------------------------------------------------------- */
/*  Deep-built curricula                                                      */
/* -------------------------------------------------------------------------- */

const fussball: SportCurriculum = {
  sportId: 'fussball',
  anfaenger: [
    mod({ id: 'b1', title: 'Der Innenseitstoß', duration: '6 min', description: 'Die Grundlage jedes Passes – sauber und kontrolliert.', ytVideoId: 'DIA-TUeV09E', channel: 'Glosemeyer85', content: {
      intro: 'Der Innenseitstoß ist der wichtigste Pass im Fußball: präzise, kontrolliert, einfach zu lernen.',
      keyPoints: [
        'Standbein neben den Ball stellen, etwa 15 cm Abstand.',
        'Schuss-Spitzfuß angezogen und fixiert – stabiles Sprunggelenk.',
        'Mit der Innenseite (nicht der Spitze) mittig treffen.',
        'Oberkörper leicht über den Ball – sonst hebt er ab.',
      ],
      tips: ['Übe zuerst gegen eine Wand – sofortiges Feedback.'],
    }}),
    mod({ id: 'b2', title: '9 Varianten der Ballannahme', duration: '8 min', description: 'Flache und hohe Bälle sauber annehmen.', ytVideoId: 'HfV67rCgMI4', channel: 'All About Football', content: {
      intro: 'Eine gute Ballannahme entscheidet, ob die nächste Aktion gelingt.',
      keyPoints: [
        'Erster Kontakt = nächste Aktion. Plane die Annahme vor dem Ball.',
        'Annahmefläche locker halten – nicht versteifen.',
        'Bei hohen Bällen den Ball "abfedern" wie ein Ei.',
        'Mitnahme in die Richtung der nächsten Aktion.',
      ],
    }}),
    mod({ id: 'b3', title: 'Kopfball – 4 Schritte zum perfekten Header', duration: '7 min', description: 'Timing, Sprungtechnik und Stirn-Kontakt.', ytVideoId: 'SYjEF6SSMg0', channel: 'Camill Hauser', content: {
      keyPoints: [
        'Absprung mit einem Bein, kraftvoll abdrücken.',
        'Augen geöffnet halten bis zum Kontakt.',
        'Mit der Stirn treffen – nicht mit Scheitel oder Nase.',
        'Aktive Nackenbewegung: peitsche den Kopf nach vorne.',
      ],
      safety: ['Im Jugendbereich Kopfbälle reduzieren – Nackenkraft erst aufbauen.'],
    }}),
    mod({ id: 'b4', title: 'Aufwärmen vor jedem Training', duration: '12 min', description: 'Dynamisches Warm-up mit Mobility & Ballgefühl.', content: {
      intro: 'Verletzungen passieren überproportional in den ersten 15 Minuten.',
      keyPoints: [
        '5 min lockeres Joggen mit Richtungswechseln.',
        'Dynamische Mobility: Hüftöffner, Beinpendel, Ausfallschritte.',
        'Aktivierung: kurze Sprints (5 × 20 m).',
        'Ballgefühl: Pässe mit ansteigendem Tempo.',
      ],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: '5 Methoden für den Spielaufbau', duration: '12 min', description: 'Räume erkennen, Linien überspielen.', ytVideoId: 'QQt_MQy4cYM', channel: "Sam's Fußball Channel", content: {
      keyPoints: [
        'Tiefe und Breite gleichzeitig – das Feld groß machen.',
        'Dreieck als Grundform: immer zwei Anspielstationen.',
        'Linien überspielen: Pass durch die Pressinglinie.',
        'Schnelles Umschalten nach Ballgewinn (5-Sekunden-Regel).',
      ],
    }}),
    mod({ id: 'i2', title: 'Spielaufbau in der Dreierkette', duration: '14 min', description: 'Trainingsformen für eine 3er-Kette.', ytVideoId: 'UqiT1HgEszg', channel: 'Deutsches Fußball Internat' }),
    mod({ id: 'i3', title: 'Kopfball-Training für Fortgeschrittene', duration: '10 min', description: 'Timing-Übungen mit Sprungkraft.', ytVideoId: 'vN7BefbV8sM', channel: 'Deutsches Fußball Internat' }),
    mod({ id: 'i4', title: 'Regeneration nach intensiven Spielen', duration: '8 min', description: 'Auslaufen, Ernährung, Schlaf.', content: {
      keyPoints: [
        'Erste 30 Min: Kohlenhydrate + Eiweiß auffüllen.',
        'Auslaufen für 10 Min senkt Muskelkater.',
        'Schlaf ist Trainingsmittel Nr. 1 – 8–9 h für Sportler.',
      ],
    }}),
  ],
  profi: standardProfi,
};

const basketball: SportCurriculum = {
  sportId: 'basketball',
  anfaenger: [
    mod({ id: 'b1', title: 'Dribbling Basics mit Steffen Hamann', duration: '6 min', description: 'FC Bayern Basketball Tutorial – sicher dribbeln.', ytVideoId: 'kjbY0yaE_3E', channel: 'FC Bayern Basketball', content: {
      keyPoints: [
        'Tief in den Knien – Schwerpunkt nach unten.',
        'Ball mit den Fingerkuppen führen, nicht mit der Handfläche.',
        'Blick nach vorne, nie auf den Ball.',
        'Mit beiden Händen üben – schwächere Hand zuerst.',
      ],
    }}),
    mod({ id: 'b2', title: 'Dribbling: Technik & Zeitlupe', duration: '5 min', description: 'Bewegungsanalyse in Slow-Motion.', ytVideoId: 'IJ5wHEpTkL8', channel: 'vlamingo' }),
    mod({ id: 'b3', title: 'Der Korbleger (Layup)', duration: '11 min', description: 'Schrittfolge, Absprung, weicher Ablauf.', ytVideoId: 'MDwpCVqtoz4', channel: 'True Rimdoc', content: {
      keyPoints: [
        'Schrittfolge rechts: rechts – links – Absprung links.',
        'Hochziehen des Spielbein-Knies für Drive und Schutz.',
        'Den Ball mit der korbfernen Hand schützen.',
        'Sanft am Brett ablegen – nicht hineinwerfen.',
      ],
    }}),
    mod({ id: 'b4', title: 'Wurftechnik – Der perfekte Korbwurf', duration: '10 min', description: 'Basketball Basics mit Niels Giffey (BBL).', ytVideoId: 'hd0fKRokd84', channel: 'easyCredit Basketball Bundesliga', content: {
      keyPoints: [
        'Füße zum Korb ausrichten ("ten toes to the rim").',
        'Wurfarm bildet ein "L" – Ball auf den Fingerspitzen.',
        'Hochstrecken und durchziehen – Hand zeigt in den Korb.',
        'Rhythmus aus den Beinen, nicht aus dem Arm.',
      ],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Defense Helpside', duration: '7 min', description: 'Wann du herunterhelfen musst.', ytVideoId: 'koNygTlamzQ', channel: 'FC Bayern Basketball' }),
    mod({ id: 'i2', title: 'Pick & Roll lesen', duration: '15 min', description: 'Das wichtigste Spielmuster des modernen Basketball.', content: {
      keyPoints: ['Drop: Center bleibt tief.', 'Hedge: kurz mit raus, dann Recovery.', 'Switch: gegen schwache Mismatches.', 'Trap: aggressive Doppelung.'],
    }}),
    mod({ id: 'i3', title: 'Konditionstraining für Basketballer', duration: '20 min', description: 'Sprint-Intervalle und Sprungkraft.' }),
    mod({ id: 'i4', title: 'Spielsysteme verstehen', duration: '18 min', description: 'Motion Offense vs. Pick & Roll Sets.' }),
  ],
  profi: standardProfi,
};

const yoga: SportCurriculum = {
  sportId: 'yoga',
  anfaenger: [
    mod({ id: 'b1', title: 'Sonnengruß für Anfänger', duration: '10 min', description: 'Langsam und exakt – Schritt für Schritt.', ytVideoId: 'MYIUYHFIpJw', channel: 'YOGABASICS', content: {
      intro: 'Der Sonnengruß (Surya Namaskar) ist die ikonische Yoga-Sequenz.',
      keyPoints: [
        'Jede Bewegung mit einem Atemzug verbinden.',
        'Stehende Vorbeuge: Knie beugen ist erlaubt.',
        'Plank: Schultern über Handgelenken, Po nicht hängen lassen.',
      ],
      safety: ['Bei Bandscheibenproblemen keine tiefen Rückbeugen ohne Lehrer.'],
    }}),
    mod({ id: 'b2', title: 'Krieger 1, 2 und 3 lernen', duration: '15 min', description: 'Die drei wichtigsten stehenden Posen.', ytVideoId: 'wgdj7-C75m0', channel: 'YOGABASICS', content: {
      keyPoints: [
        'Krieger 1: vorderes Knie über dem Knöchel, hinterer Fuß im 45°.',
        'Krieger 2: Hüfte zur Seite öffnen, Arme parallel zum Boden.',
        'Krieger 3: aktiv aus dem Hüftgelenk in die Waagrechte heben.',
      ],
    }}),
    mod({ id: 'b3', title: 'Wechselatmung für Anfänger', duration: '8 min', description: 'Nadi Shodana – beruhigende Atemtechnik.', ytVideoId: '6Ct6N1vEWhQ', channel: 'Mady Morrison' }),
    mod({ id: 'b4', title: 'Sicher in den ersten Asanas', duration: '8 min', description: 'Wann pausieren, wann modifizieren?', content: {
      safety: [
        'Schmerz im Knie = sofort raus aus der Pose.',
        'Bei Bluthochdruck keine kopfüber-Haltungen.',
        'Klötze und Gurte machen besseres Yoga möglich – keine Krücken.',
      ],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Krieger 3 – Variationen', duration: '9 min', description: 'Balance und Hüftöffnung.', ytVideoId: 'jrDdVEvfFfs', channel: 'Yoga Individual' }),
    mod({ id: 'i2', title: 'Power Vinyasa Flow (60 Min)', duration: '60 min', description: 'Sonnengruß, Krieger, Balancen, Twists.', ytVideoId: 'Z2saufuHh4w', channel: 'Mascha Trietsch' }),
    mod({ id: 'i3', title: 'Hüftöffner-Reihe', duration: '20 min', description: 'Lange gehaltene Posen für Beweglichkeit.' }),
    mod({ id: 'i4', title: 'Rückbeugen sicher aufbauen', duration: '15 min', description: 'Von Bridge zu Rad.' }),
  ],
  profi: [
    mod({ id: 'p1', title: 'Kopfstand (Sirsasana) lernen', duration: '12 min', description: 'Vorbereitung und fortgeschrittenere Variation.', ytVideoId: 'x9y97j4uI_w', channel: 'Mascha Trietsch', content: {
      safety: ['Bei Nackenproblemen, Bluthochdruck oder Glaukom NICHT üben.', 'Erste Versuche immer an der Wand.'],
    }}),
    mentaltrainingModule,
    periodisierungModule,
    mod({ id: 'p4', title: 'Yoga als Lehrer:in weitergeben', duration: '20 min', description: 'Cue-Sprache und Klassen-Aufbau.' }),
  ],
};

const laufen: SportCurriculum = {
  sportId: 'laufen',
  anfaenger: [
    mod({ id: 'b1', title: 'Von 0 auf 5 km – 8 Wochen', duration: '11 min', description: 'Der klassische Einstieg in den Laufsport.', ytVideoId: 'U94gD-isdeE', channel: 'ausdauerclub', content: {
      keyPoints: [
        '3 Einheiten pro Woche mit mind. 24 h Pause.',
        'Tempo so wählen, dass du dich noch unterhalten kannst.',
        'Steigern über Zeit, nicht über Geschwindigkeit.',
      ],
    }}),
    mod({ id: 'b2', title: '6-Wochen-Trainingsplan für 5 km', duration: '12 min', description: 'Eine straffere Variante mit klarer Wochenstruktur.', ytVideoId: '3F-jtzPCTrw', channel: 'ONESTEPFASTER UG' }),
    mod({ id: 'b3', title: 'Richtig atmen beim Joggen', duration: '8 min', description: 'Nie wieder Seitenstechen.', ytVideoId: 'm52QiGiaICw', channel: 'runnersflow', content: {
      keyPoints: [
        'Tief in den Bauch atmen, nicht in die Brust.',
        'Atemrhythmus an Schrittfolge koppeln: 3-2 oder 4-4.',
        'Durch Mund UND Nase – mehr Sauerstoff.',
      ],
    }}),
    mod({ id: 'b4', title: 'Lauftechnik & Atmung', duration: '6 min', description: "Expert:innen erklären systematisch.", ytVideoId: 'SHFDUHbbke4', channel: "RUNNER'S WORLD" }),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Marathon-Vorbereitung: Grundlagen', duration: '14 min', description: 'Wie ein Marathon-Aufbau strukturell aussieht.', ytVideoId: '-nM47Dd4S0g', channel: 'Andreas Butz' }),
    mod({ id: 'i2', title: 'Intervalltraining strukturieren', duration: '10 min', description: 'Welche Intervalle eignen sich wofür?', content: {
      keyPoints: ['Kurz (200–400 m): Schnelligkeit.', 'Mittel (800–1.600 m): VO₂max.', 'Lang (>2.000 m): Schwellentempo.'],
    }}),
    mod({ id: 'i3', title: 'Ernährung für Läufer', duration: '12 min', description: 'Kohlenhydrate, Salz, Hydration.' }),
    mod({ id: 'i4', title: 'Verletzungen vorbeugen', duration: '15 min', description: 'Läuferknie, Achillessehne, Schienbein.', content: {
      safety: ['Wöchentliches Volumen max. um 10 % steigern.', 'Schuhe nach 600–800 km wechseln.', 'Krafttraining 2× pro Woche.'],
    }}),
  ],
  profi: [periodisierungModule, mentaltrainingModule, mod({ id: 'p3', title: 'Höhentraining & Laktatdiagnostik', duration: '18 min', description: 'Was Spitzenleistung trennt.' }), mod({ id: 'p4', title: 'Pacing-Strategien im Wettkampf', duration: '12 min', description: 'Negative Splits, Pace-Pläne, Renntaktik.' })],
};

const krafttraining: SportCurriculum = {
  sportId: 'krafttraining',
  anfaenger: [
    mod({ id: 'b1', title: 'Trainingsplan für Anfänger', duration: '13 min', description: 'Ein 3–4-Tage-Plan, der wirklich funktioniert.', ytVideoId: '4PJfrREOigM', channel: 'Jessica Bock', content: {
      keyPoints: [
        'Drei Ganzkörper-Workouts pro Woche, je 45–60 Min.',
        'Sechs Grundübungen: Kniebeuge, Kreuzheben, Bankdrücken, Rudern, Schulterdrücken, Klimmzug.',
        '3–4 Sätze à 8–12 Wiederholungen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Neulinge im Gym', duration: '10 min', description: 'Anfängerplan im Studio.', ytVideoId: 'AIUaHSmYblc', channel: 'Patricia Kraft' }),
    mod({ id: 'b3', title: 'Aufwärmen mit dem Gewicht', duration: '7 min', description: 'Spezifisches Warmup an der Langhantel.', content: {
      keyPoints: ['5 Min lockeres Cardio.', 'Mobility für die belasteten Gelenke.', 'Aufwärmsätze: leere Stange → 50 % → 70 % → 85 %.'],
    }}),
    mod({ id: 'b4', title: 'Sicherheit im Studio', duration: '8 min', description: 'Spotter, Klemmen, Etikette.', content: {
      safety: ['Klemmen sind nicht optional.', 'Bei schwerem Bankdrücken: Spotter oder Rack.', 'Niemals mit verdrehter Wirbelsäule heben.'],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Kniebeuge / Squat – Korrekte Technik', duration: '10 min', description: 'Die wichtigste Ganzkörperübung.', ytVideoId: 'BwuC74wVQT4', channel: 'Work It Training', content: {
      keyPoints: [
        'Füße schulterbreit, Zehen leicht nach außen.',
        'Hüfte UND Knie gleichzeitig beugen.',
        'Knie folgen der Zehenspitze.',
        'Bis mindestens parallel runter.',
      ],
    }}),
    mod({ id: 'i2', title: 'Kreuzheben / Deadlift', duration: '12 min', description: 'Der Klassiker der Ganzkörperkraft.', ytVideoId: 'gRfFdvXpEEU', channel: 'Kernwerk® Functional Fitness', content: {
      keyPoints: [
        'Stange direkt vor dem Schienbein, Mittelfuß darunter.',
        'Schulterblätter nach hinten/unten ziehen.',
        'Hüfte zuerst hoch, dann Schultern.',
      ],
      safety: ['Niemals mit gerundetem unteren Rücken heben.'],
    }}),
    mod({ id: 'i3', title: 'Volumen, Intensität & Frequenz', duration: '15 min', description: 'Die drei Stellschrauben des Trainings.' }),
    mod({ id: 'i4', title: 'Ernährung für Muskelaufbau', duration: '12 min', description: 'Kalorienüberschuss, Protein, Timing.' }),
  ],
  profi: [periodisierungModule, mentaltrainingModule, mod({ id: 'p3', title: 'Powerlifting-Spezialisierung', duration: '20 min', description: 'Maximalkraft systematisch entwickeln.' }), mod({ id: 'p4', title: 'Coaching: Form-Checks geben', duration: '15 min', description: 'Wie du Bewegung analysierst und cued.' })],
};

/* -------------------------------------------------------------------------- */
/*  New curricula (Tranche A–E)                                               */
/* -------------------------------------------------------------------------- */

const tennis: SportCurriculum = {
  sportId: 'tennis',
  anfaenger: [
    mod({ id: 'b1', title: 'Vorhand lernen Schritt für Schritt', duration: '9 min', description: 'Die wichtigste Grundtechnik im Tennis.', ytVideoId: 'X8kOE02NNrI', channel: 'Tennis Mastery', content: {
      keyPoints: [
        'Westerngriff oder halbwestern – nicht zu extrem.',
        'Schulter zur Netzseite drehen (Ausholen).',
        'Treffpunkt vor dem Körper.',
        'Durchschwung zur gegenüberliegenden Schulter.',
      ],
    }}),
    mod({ id: 'b2', title: 'Anfängerstunde in 30 Minuten', duration: '30 min', description: 'Vorhand, Rückhand und Aufschlag kompakt.', ytVideoId: 'zAcGyBoMz0s', channel: 'Tennis Mastery' }),
    mod({ id: 'b3', title: 'Grundstellung und Beinarbeit', duration: '8 min', description: 'Splittstep, kleine Schritte, Bereitschaft.', content: {
      keyPoints: [
        'Splittstep: kleiner Hüpfer, wenn Gegner trifft.',
        'Mit kleinen, schnellen Schritten zum Ball.',
        'Position halten, statt rennen, wenn möglich.',
      ],
    }}),
    mod({ id: 'b4', title: 'Aufwärmen vor dem Match', duration: '10 min', description: 'Mobility und erste Bälle.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const schwimmen: SportCurriculum = {
  sportId: 'schwimmen',
  anfaenger: [
    mod({ id: 'b1', title: 'Kraulen lernen mit Toni Embacher', duration: '7 min', description: 'In vier einfachen Schritten zur Kraultechnik.', ytVideoId: 'cg5kkJH1EvA', channel: 'FITBOOK', content: {
      keyPoints: [
        'Wasserlage flach – Po und Beine an die Oberfläche.',
        'Beinschlag aus der Hüfte, nicht aus dem Knie.',
        'Armzug: ziehen, drücken, raus.',
        'Atmung zur Seite, niemals nach vorne.',
      ],
    }}),
    mod({ id: 'b2', title: 'Schwimmkurs Kraulen Teil 1/3', duration: '12 min', description: 'Online-Schwimmkurs: Technik & Übungen.', ytVideoId: 'Wljc3OWYKVk', channel: 'DOCSWIM' }),
    mod({ id: 'b3', title: 'Wassergewöhnung & Atmung', duration: '8 min', description: 'Im Wasser entspannen, Auftrieb spüren.', content: {
      keyPoints: ['Ausatmen unter Wasser – nicht oben.', 'Gesicht ins Wasser, Augen offen.', 'Kein hektischer Schluck.'],
    }}),
    mod({ id: 'b4', title: 'Sicherheit im Wasser', duration: '6 min', description: 'Selbstrettung und Bahnregeln.', content: {
      safety: ['Niemals allein in unbekanntem Gewässer.', 'Bahn vorne hoch, hinten runter – Schwimmer-Etikette.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const klettern: SportCurriculum = {
  sportId: 'klettern',
  anfaenger: [
    mod({ id: 'b1', title: '10 Technik-Tipps für Bouldern-Anfänger', duration: '11 min', description: 'Die wichtigsten Bouldergrundlagen.', ytVideoId: '5F_JDm1VWH8', channel: 'Lauf des Lebens', content: {
      keyPoints: [
        'Mit den Beinen drücken, nicht mit den Armen ziehen.',
        'Hüfte nah an die Wand.',
        'Augen ruhig lassen – Route vor dem Klettern lesen.',
        'Aktiv atmen, gerade in schweren Zügen.',
      ],
    }}),
    mod({ id: 'b2', title: '4 Techniken für Boulder-Einsteiger', duration: '8 min', description: 'Die wichtigsten Bewegungsmuster.', ytVideoId: 'x6hjO4w0XUc', channel: 'Grundkurs Bouldern' }),
    mod({ id: 'b3', title: 'Sicher Fallen und Landen', duration: '6 min', description: 'Beine ausfedern, abrollen, kontrolliert.', content: {
      safety: [
        'Nie steif landen – Knie federn.',
        'Auf der Matte rollen, nicht aufschlagen.',
        'Beim Klettern in der Halle aufmerksam – nicht unter andere Kletterer.',
      ],
    }}),
    mod({ id: 'b4', title: 'Routen lesen', duration: '7 min', description: 'Die Wand mental vor dem Klettern durchgehen.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const boxen: SportCurriculum = {
  sportId: 'boxen',
  anfaenger: [
    mod({ id: 'b1', title: 'Die 5 wichtigsten Schläge', duration: '9 min', description: 'Jab, Cross, Hook, Uppercut – die Basics.', ytVideoId: 'W-QbWPDs4Bs', channel: 'Coach Ferhat', content: {
      keyPoints: [
        'Jab: gerade aus der Führhand, schnell.',
        'Cross: harte Gerade aus der Schlaghand.',
        'Hook: seitlich aus der Hüftrotation.',
        'Uppercut: von unten in die Kinnspitze.',
        'Immer mit Deckung schlagen, Hand zurückführen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Beinarbeit & Grundstellung', duration: '10 min', description: 'Stand, Footwork und erste Kombinationen.', ytVideoId: 'KSZk17UTfLc', channel: 'uebungenzuhause' }),
    mod({ id: 'b3', title: 'Schattenboxen', duration: '8 min', description: 'Trockenübung für Technik & Kondition.' }),
    mod({ id: 'b4', title: 'Hand- und Kopfschutz', duration: '5 min', description: 'Bandagen, Handschuhe, Mundschutz.', content: {
      safety: ['Immer mit Bandagen schlagen – schützt Finger und Handgelenk.', 'Kein Sparring ohne Mundschutz und Kopfschutz.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const radfahren: SportCurriculum = {
  sportId: 'radfahren',
  anfaenger: [
    mod({ id: 'b1', title: '5 Tipps für Rennrad-Anfänger', duration: '9 min', description: 'GCN-Klassiker für den Einstieg.', ytVideoId: 'eFwuOVrETjs', channel: 'GCN auf Deutsch', content: {
      keyPoints: [
        'Sattelhöhe: Bein fast gestreckt am tiefsten Pedalpunkt.',
        'Gleichmäßige Trittfrequenz von 80–90 U/min anstreben.',
        'Mit dem leichten Gang starten – Knie schonen.',
        'Nicht voll bremsen mit der Vorderbremse.',
      ],
    }}),
    mod({ id: 'b2', title: 'Rennrad & Gravel Bike – Einstieg 2025', duration: '12 min', description: 'Aktuelle Tipps für den Einstieg.', ytVideoId: 'TS7hWBHPWTs', channel: 'Fahrrad XXL' }),
    mod({ id: 'b3', title: 'Sitzposition richtig einstellen', duration: '8 min', description: 'Sattelhöhe, Sattelposition, Lenkerhöhe.' }),
    mod({ id: 'b4', title: 'Sicherheit im Straßenverkehr', duration: '7 min', description: 'Handzeichen, Sichtbarkeit, Spurfahren.', content: {
      safety: ['Helm immer, auch bei kurzen Fahrten.', 'Nachts mit Lichtern und Reflektoren.', 'Genug Abstand zu parkenden Autos – Türen-Falle.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const volleyball: SportCurriculum = {
  sportId: 'volleyball',
  anfaenger: [
    mod({ id: 'b1', title: 'Pritschen (oberes Zuspiel) – Technik', duration: '6 min', description: 'VLW Duo-Fibel: die Grundlage des Aufbaus.', ytVideoId: 'sEhA80T-PUE', channel: 'VLWOnline', content: {
      keyPoints: [
        'Hände bilden ein "Dach" über der Stirn.',
        'Fingerspitzen kontrollieren – Daumen nicht ins Spiel.',
        'Aus den Beinen drücken, nicht aus den Armen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Baggern (unteres Zuspiel)', duration: '6 min', description: 'Annahme harter Aufschläge und Angriffe.', ytVideoId: 'ffee5FXAZ9w', channel: 'VLWOnline', content: {
      keyPoints: [
        'Plattform aus beiden Unterarmen formen.',
        'Knie gebeugt, Schultern locker.',
        'Den Ball anschieben, nicht schlagen.',
      ],
    }}),
    mod({ id: 'b3', title: 'Aufschlag von unten', duration: '5 min', description: 'Sicherer Einstieg in den Aufschlag.' }),
    mod({ id: 'b4', title: 'Spielfeldverhalten', duration: '6 min', description: 'Zonen, Rotation und Rufabsprachen.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const handball: SportCurriculum = {
  sportId: 'handball',
  anfaenger: [
    mod({ id: 'b1', title: 'Handball-Regeln einfach erklärt', duration: '7 min', description: 'Spielfeld, Schritte, Strafen.', ytVideoId: 'Y6dFe6VjVjQ', channel: 'LAPZ Tutorials' }),
    mod({ id: 'b2', title: 'Fangen, Prellen, Sprungwurf, Finte', duration: '9 min', description: 'Die vier zentralen Grundtechniken.', ytVideoId: 'GuNHlG0kSO8', channel: 'Vision on Demand', content: {
      keyPoints: [
        'Maximal 3 Schritte ohne Prellen.',
        'Sprungwurf: Hüfte mitziehen, Hand peitscht nach.',
        'Finte: Schulter erst, dann Beine.',
      ],
    }}),
    mod({ id: 'b3', title: 'Passspiel im Training', duration: '8 min', description: 'Sauber zu Mitspielern werfen und fangen.' }),
    mod({ id: 'b4', title: 'Schiedsrichtergesten lesen', duration: '5 min', description: 'Die wichtigsten Zeichen verstehen.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const judo: SportCurriculum = {
  sportId: 'judo',
  anfaenger: [
    mod({ id: 'b1', title: 'Deine ersten Würfe: O-soto-otoshi und O-goshi', duration: '10 min', description: 'Die ersten Standardwürfe.', ytVideoId: 'x8ctXpjgdm8', channel: 'Judo-im-Pott [de]', content: {
      keyPoints: [
        'O-soto-otoshi: Beinwurf mit großem Außensichel.',
        'O-goshi: Hüftwurf, Kontakt am Bauch.',
        'Uke (der Geworfene) lernt zuerst, sicher zu fallen.',
      ],
      safety: ['Wurftraining nur auf Mattenflächen.', 'Erst Fallen lernen, dann Werfen.'],
    }}),
    mod({ id: 'b2', title: 'Die vier Grundhaltegriffe', duration: '8 min', description: 'Bodenarbeit für Anfänger.', ytVideoId: 'HCqGvmPZieg', channel: 'Judo-im-Pott [de]' }),
    mod({ id: 'b3', title: 'Ukemi – Fallschule', duration: '7 min', description: 'Vorwärts, rückwärts, seitlich sicher fallen.' }),
    mod({ id: 'b4', title: 'Dojo-Etikette', duration: '5 min', description: 'Verbeugung, Hygiene, Respekt.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const karate: SportCurriculum = {
  sportId: 'karate',
  anfaenger: [
    mod({ id: 'b1', title: 'Karate-Training für Anfänger – Stände', duration: '12 min', description: 'Die Grundstellungen aus dem Dojo.', ytVideoId: 'A1AzP5jqQGQ', channel: 'TG Neuss', content: {
      keyPoints: [
        'Zenkutsu-dachi: vorderer Stand, 60/40-Gewicht.',
        'Kiba-dachi: Reiterstand, breit und tief.',
        'Kokutsu-dachi: hinterer Stand, 70/30 nach hinten.',
      ],
    }}),
    mod({ id: 'b2', title: 'Kihon – Fünf Grundtechniken', duration: '15 min', description: 'Mit Benni durch die Grundlagen.', ytVideoId: '0wQ1X3EdXvY', channel: 'Karate Dojo Sandokan' }),
    mod({ id: 'b3', title: 'Atmung und Kiai', duration: '6 min', description: 'Druck aufbauen, kontrolliert ausatmen.' }),
    mod({ id: 'b4', title: 'Etikette und Gürtelsystem', duration: '5 min', description: 'Reigi, Rang und Respekt.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const kickboxen: SportCurriculum = {
  sportId: 'kickboxen',
  anfaenger: [
    mod({ id: 'b1', title: 'Deckung und Kampfstellung', duration: '10 min', description: 'Kurs 1 – die Grundbasis.', ytVideoId: 'Sb2bSsNWfoM', channel: 'DieKickboxtrainer', content: {
      keyPoints: [
        'Schulterbreiter Stand, schwaches Bein vorne.',
        'Hände auf Wangenhöhe, Ellbogen am Körper.',
        'Kinn gesenkt, Blick gerade.',
      ],
    }}),
    mod({ id: 'b2', title: 'Kickboxen Anfänger Training #1', duration: '14 min', description: 'Komplettes Anfänger-Training.', ytVideoId: 'fMWI0kls_mY', channel: 'ExitAsia - Home of Combat Sports' }),
    mod({ id: 'b3', title: 'Erste Tritte', duration: '9 min', description: 'Front Kick und Low Kick.' }),
    mod({ id: 'b4', title: 'Sparring-Etikette', duration: '6 min', description: 'Light Contact, Respekt, Tap Out.', content: {
      safety: ['Niemals ohne Mundschutz sparren.', 'Light Contact heißt Light – nicht Full.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const badminton: SportCurriculum = {
  sportId: 'badminton',
  anfaenger: [
    mod({ id: 'b1', title: 'Der Aufschlag im Badminton', duration: '6 min', description: 'Korrekter Aufschlag nach den Regeln.', ytVideoId: '_oJcI0GNWAY', channel: 'Landessportbund Nordrhein-Westfalen e.V.', content: {
      keyPoints: [
        'Ball wird unter Hüfthöhe getroffen.',
        'Beide Füße bleiben am Boden.',
        'Diagonal in das Aufschlagfeld.',
      ],
    }}),
    mod({ id: 'b2', title: 'Basics im Badminton', duration: '10 min', description: 'Klassisches Lehrvideo zu den Grundlagen.', ytVideoId: 'AhKBRh8Oxfs', channel: 'Spielstark' }),
    mod({ id: 'b3', title: 'Clear, Smash, Drop', duration: '8 min', description: 'Die wichtigsten Überkopf-Schläge.' }),
    mod({ id: 'b4', title: 'Schlägerhaltung', duration: '5 min', description: 'Vorhand-, Rückhand- und Universalgriff.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const tischtennis: SportCurriculum = {
  sportId: 'tischtennis',
  anfaenger: [
    mod({ id: 'b1', title: '4 Grundregeln für Anfänger', duration: '7 min', description: 'TT Helden erklären die Basics.', ytVideoId: 'AKgVDhjvBkk', channel: 'Tischtennis Helden' }),
    mod({ id: 'b2', title: 'Grundschläge – Bewegungsablauf', duration: '6 min', description: 'Mit Slow-Motion-Analyse.', ytVideoId: 'pHeFwNFuK_Q', channel: 'sportunterricht', content: {
      keyPoints: [
        'Vorhand-Konter: Schläger schließt, vor dem Körper treffen.',
        'Rückhand-Konter: Ellbogen vor dem Körper.',
        'Rückkehr in Grundstellung nach jedem Schlag.',
      ],
    }}),
    mod({ id: 'b3', title: 'Aufschlag mit Schnitt', duration: '7 min', description: 'Erste Variationen mit Effet.' }),
    mod({ id: 'b4', title: 'Schlägerwahl', duration: '5 min', description: 'Belag, Holz, Griff – Einsteiger-Setup.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const squash: SportCurriculum = {
  sportId: 'squash',
  anfaenger: [
    mod({ id: 'b1', title: 'Squash für Anfänger', duration: '8 min', description: 'Erste Stunde auf dem Court.', ytVideoId: 'qPTazNsmYGs', channel: 'Nico Haedicke', content: {
      keyPoints: [
        'T-Position halten – Zentrum des Courts.',
        'Schläger immer oben, Bereitschaft signalisieren.',
        'Ball nach dem Schlag aus dem Weg gehen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Squash-Regeln einfach erklärt', duration: '7 min', description: 'Einsteiger-Guide zu den Regeln.', ytVideoId: 'zFmDv0V1qKA', channel: 'Squash Factory Schengen-Lützebuerg asbl' }),
    mod({ id: 'b3', title: 'Drives entlang der Seitenwand', duration: '6 min', description: 'Der wichtigste Schlag in jedem Spiel.' }),
    mod({ id: 'b4', title: 'Sicherheit auf engem Raum', duration: '5 min', description: 'Schutzbrille und Abstand zum Gegner.', content: {
      safety: ['Schutzbrille ist Pflicht für Anfänger.', 'Bei Sichtbehinderung Let spielen, nicht riskieren.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const rudern: SportCurriculum = {
  sportId: 'rudern',
  anfaenger: [
    mod({ id: 'b1', title: 'Concept2 – So ruderst du richtig', duration: '10 min', description: 'Die offizielle Anleitung des Herstellers.', ytVideoId: 'GV5158xPxt8', channel: 'Concept2 Deutschland', content: {
      keyPoints: [
        'Vier Phasen: Auslage, Durchzug, Rücklage, Vorrollen.',
        '60 % Beine, 20 % Rumpf, 20 % Arme.',
        'Rücken neutral, nicht runden.',
      ],
    }}),
    mod({ id: 'b2', title: 'Step-by-Step mit Olympioniken Lars', duration: '9 min', description: 'Rudertechnik für Anfänger.', ytVideoId: 'okS40vuruF8', channel: 'Augletics Rudergeräte' }),
    mod({ id: 'b3', title: 'Schlagfrequenz & Power', duration: '8 min', description: 'Lockerer Schlag, hohe Effektivität.' }),
    mod({ id: 'b4', title: 'Rücken sichern', duration: '6 min', description: 'Hyperextensions, Plank, Core.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const segeln: SportCurriculum = {
  sportId: 'segeln',
  anfaenger: [
    mod({ id: 'b1', title: 'Segeln lernen – die ersten Stunden an Bord', duration: '13 min', description: 'Von der Segelschule Stella Maris.', ytVideoId: 'vdy7_KEahcw', channel: 'moinmoinkiel', content: {
      keyPoints: [
        'Wind erkennen – Augen, Wellen, Verklicker.',
        'Halsen vs. Wenden verstehen.',
        'Niemals ohne Sicherheitsweste an Deck.',
      ],
    }}),
    mod({ id: 'b2', title: '9 Knoten in 10 Minuten', duration: '10 min', description: 'Die wichtigsten Knoten für SBF und Alltag.', ytVideoId: 'T0B1EhOLPEM', channel: 'Sunshine Sailing' }),
    mod({ id: 'b3', title: 'Fachbegriffe verstehen', duration: '8 min', description: 'Lee, Luv, Bug, Heck – das Vokabular.' }),
    mod({ id: 'b4', title: 'Sicherheit auf dem Wasser', duration: '7 min', description: 'Wetter lesen, MOB-Manöver.', content: {
      safety: ['Schwimmweste immer, wenn nicht angeleint.', 'Wetterbericht vor jedem Törn.', 'Crew einweisen vor Ablegen.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const surfen: SportCurriculum = {
  sportId: 'surfen',
  anfaenger: [
    mod({ id: 'b1', title: 'Surf Pop-Up Training', duration: '7 min', description: 'Der Take-Off für alle Boardgrößen.', ytVideoId: 'UvlA7YQCguw', channel: 'POPUPMATIC', content: {
      keyPoints: [
        'Bauch flach am Brett, Blick nach vorne.',
        'Hände unter Brusthöhe – nicht weiter hinten.',
        'In einer Bewegung hoch (kein Knien zwischendurch).',
        'Erst Vorderbein, Hinterbein folgt automatisch.',
      ],
    }}),
    mod({ id: 'b2', title: 'Takeoff-Tutorial', duration: '6 min', description: 'AllYouCanSurf zeigt die Schritte.', ytVideoId: 'MUJ1iOIngCo', channel: 'AllYouCanSurf' }),
    mod({ id: 'b3', title: 'Wellen lesen', duration: '9 min', description: 'Peak, Schaum und Set-Wellen erkennen.' }),
    mod({ id: 'b4', title: 'Strand- und Wassersicherheit', duration: '7 min', description: 'Strömungen, Surf-Etikette, Rettung.', content: {
      safety: ['Niemals allein in unbekanntem Spot.', 'Rip-Current: parallel zur Küste schwimmen.', 'Vorfahrt: wer näher am Peak ist, hat sie.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const crossfit: SportCurriculum = {
  sportId: 'crossfit',
  anfaenger: [
    mod({ id: 'b1', title: 'CrossFit – Einsteiger-Guide', duration: '11 min', description: 'Was steckt hinter dem "härtesten Workout der Welt"?', ytVideoId: 'VAt2RhSU0xQ', channel: 'Filmproduktion › Videoproduktion LANIZMEDIA', content: {
      intro: 'CrossFit kombiniert Gewichtheben, Gymnastik und Cardio in kurzen, intensiven Einheiten (WODs).',
      keyPoints: [
        'WOD = "Workout of the Day", variiert täglich.',
        'Skalierung ist Pflicht: jede Übung hat eine Anfänger-Version.',
        'Bewegungsqualität vor Geschwindigkeit.',
      ],
    }}),
    mod({ id: 'b2', title: 'CrossFit Home-Workout mit Hendrik Senf', duration: '20 min', description: 'Praxisbeispiel mit Profi-Trainer.', ytVideoId: '3q8tJc4TY7E', channel: 'FITBOOK' }),
    mod({ id: 'b3', title: 'Die 9 Foundational Movements', duration: '15 min', description: 'Air Squat, Front Squat, Overhead Squat, Press, Push Press, Push Jerk, Deadlift, Sumo Deadlift High Pull, Medball Clean.' }),
    mod({ id: 'b4', title: 'Sicher in der Box', duration: '7 min', description: 'Coaches fragen, skalieren, hören.', content: {
      safety: ['Olympisches Heben nur unter Anleitung.', 'Niemals zu viel Gewicht zu früh.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const pilates: SportCurriculum = {
  sportId: 'pilates',
  anfaenger: [
    mod({ id: 'b1', title: 'Pilates für Anfänger – Bauch & Rumpf', duration: '15 min', description: '11 Pilates-Übungen kompakt erklärt.', ytVideoId: 'KaYi1UmZqNw', channel: 'Einfach besser leben', content: {
      keyPoints: [
        'Zentrierung: Bauchnabel sanft nach innen.',
        'Lange Wirbelsäule – nicht runden.',
        'Atmung in den Brustkorb, breit zur Seite.',
      ],
    }}),
    mod({ id: 'b2', title: 'Pilates Basic Workout', duration: '18 min', description: 'Die Grundlagen mit erfahrenem Coach.', ytVideoId: 'wUSnEtC3BhA', channel: 'HappyAndFitPilates' }),
    mod({ id: 'b3', title: 'Hundred & Roll-Up', duration: '10 min', description: 'Die ikonischen Pilates-Übungen.' }),
    mod({ id: 'b4', title: 'Pilates-Prinzipien', duration: '8 min', description: 'Konzentration, Kontrolle, Präzision, Atmung, Fluss, Zentrierung.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const wandern: SportCurriculum = {
  sportId: 'wandern',
  anfaenger: [
    mod({ id: 'b1', title: 'Die richtige Wanderausrüstung', duration: '10 min', description: 'Packliste, Schuhe, Rucksack.', ytVideoId: 'aSYbPlIWwTA', channel: 'marlenesleben', content: {
      keyPoints: [
        'Schuhe einlaufen, niemals neu auf der ersten Tour.',
        '3-Schichten-Prinzip: Funktionsunterwäsche + Isolation + Wetterschutz.',
        'Rucksack richtig packen: Schweres nah am Rücken.',
      ],
    }}),
    mod({ id: 'b2', title: 'Packliste für Tagestouren', duration: '8 min', description: 'Was wirklich in den Rucksack gehört.', ytVideoId: '8ydBuXcyNx4', channel: 'DraufssenUnterwegs' }),
    mod({ id: 'b3', title: 'Karte und Höhenprofile lesen', duration: '9 min', description: 'Tourenplanung Schritt für Schritt.' }),
    mod({ id: 'b4', title: 'Sicherheit am Berg', duration: '8 min', description: 'Wetter, Notfall, Schwierigkeitsgrade.', content: {
      safety: ['Tourenplanung an Wetterbericht koppeln.', 'Notfallkontakt hinterlassen.', 'Genug Wasser und Notnahrung.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const mountainbike: SportCurriculum = {
  sportId: 'mountainbike',
  anfaenger: [
    mod({ id: 'b1', title: '5 Fahrtechnik-Grundlagen MTB', duration: '11 min', description: 'Die wichtigsten Skills für Anfänger.', ytVideoId: '2j3BtDdbpvg', channel: 'Daniel Daya', content: {
      keyPoints: [
        'Grundposition: Pedale waagerecht, leichte Hocke.',
        'Bremsen: zwei Finger reichen, vor allem vorne dosieren.',
        'Blick weit nach vorne – wohin du schaust, fährst du.',
        'Sattelposition unten bei Abfahrten.',
      ],
    }}),
    mod({ id: 'b2', title: 'Grundposition auf dem Bike', duration: '7 min', description: 'BIKE Magazin erklärt die Basis.', ytVideoId: 'c-4LtoB94lU', channel: 'BIKE Magazin' }),
    mod({ id: 'b3', title: 'Kurventechnik', duration: '8 min', description: 'Außenbein belasten, Blick durch die Kurve.' }),
    mod({ id: 'b4', title: 'Schutzausrüstung', duration: '6 min', description: 'Helm, Knie, Brille, Handschuhe.', content: {
      safety: ['Full-Face Helm für Trails ab Schwierigkeitsgrad S2.', 'Trinkrucksack mit Pumpe und Werkzeug.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const ski: SportCurriculum = {
  sportId: 'ski',
  anfaenger: [
    mod({ id: 'b1', title: 'Vom Schneepflug zum parallelen Skifahren', duration: '8 min', description: '5 Schritte vom Anfänger zum sicheren Schwung.', ytVideoId: '474dkQ8vRy8', channel: 'Julian Witting Skiing', content: {
      keyPoints: [
        'Pflug: V-Stellung, Innenkanten greifen.',
        'Pflugbogen: Druck auf den Außenski.',
        'Schaufeln zusammen: paralleles Schwingen.',
        'Hände nach vorne, nicht nach hinten lehnen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Bremsen im Pflug lernen', duration: '6 min', description: 'Sicher anhalten – die wichtigste Skill.', ytVideoId: 'INIqJPwBOtQ', channel: 'Marius Quast' }),
    mod({ id: 'b3', title: 'Liftfahren und Etikette', duration: '5 min', description: 'Schlepplift, Sessellift, Gondel.' }),
    mod({ id: 'b4', title: 'FIS-Pistenregeln', duration: '6 min', description: 'Vorfahrt, Geschwindigkeit, Hilfeleistung.', content: {
      safety: ['Helm immer.', 'Pistenregeln gelten wie Straßenverkehr.', 'Bei Sturz nach oben sichern.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const snowboard: SportCurriculum = {
  sportId: 'snowboard',
  anfaenger: [
    mod({ id: 'b1', title: 'Das 1. Mal auf dem Snowboard', duration: '10 min', description: 'Die ersten Schritte sicher meistern.', ytVideoId: 'EZ-c4q80mRs', channel: 'Marius Quast', content: {
      keyPoints: [
        'Goofy vs. Regular – führende Fußposition.',
        'Frontside (Zehen) und Backside (Fersen) Kante.',
        'Knie immer leicht gebeugt.',
      ],
    }}),
    mod({ id: 'b2', title: '10 Snowboard-Anfänger-Tipps', duration: '12 min', description: 'Die ersten Tage meistern.', ytVideoId: 'bNTyzdnmHcw', channel: 'The Grey Rebel (Deutsch)' }),
    mod({ id: 'b3', title: 'Sturz und Aufstehen', duration: '6 min', description: 'Richtig fallen, ohne sich zu verletzen.' }),
    mod({ id: 'b4', title: 'Equipment-Setup', duration: '8 min', description: 'Stance, Bindungswinkel, Boards.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const eishockey: SportCurriculum = {
  sportId: 'eishockey',
  anfaenger: [
    mod({ id: 'b1', title: 'Schlittschuhlaufen für Anfänger', duration: '8 min', description: 'Tipps vom DEG-Profi.', ytVideoId: 'CmM9MpfLvb8', channel: 'Rheinische Post', content: {
      keyPoints: [
        'Knie tief, Oberkörper leicht nach vorne.',
        'Druck mit der Innenkante, nicht der ganzen Schiene.',
        'Bremsen: T-Stop oder Hockey-Stop.',
      ],
    }}),
    mod({ id: 'b2', title: 'Schlägerführung', duration: '7 min', description: 'Puck-Handling und Pässe.' }),
    mod({ id: 'b3', title: 'Schussvarianten', duration: '8 min', description: 'Wrist Shot, Slap Shot, Snap Shot.' }),
    mod({ id: 'b4', title: 'Vollständige Schutzausrüstung', duration: '6 min', description: 'Helm, Schulter, Ellbogen, Beine, Tiefschutz.', content: {
      safety: ['Niemals ohne komplette Schutzkleidung aufs Eis.', 'Gitter oder Visier für Anfänger.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const tanzen: SportCurriculum = {
  sportId: 'tanzen',
  anfaenger: [
    mod({ id: 'b1', title: '5 Hip-Hop Basic Steps', duration: '9 min', description: 'Die wichtigsten Moves in 9 Minuten.', ytVideoId: '0Os5Dd8BW_0', channel: 'Allmygolden', content: {
      keyPoints: [
        'Two-Step, Bounce, Cross-Step, Kick-Ball-Change, V-Step.',
        'Auf den Beat hören, nicht auf die Melodie.',
        'Knie locker, Brustkorb frei.',
      ],
    }}),
    mod({ id: 'b2', title: 'Grundhaltung & Rhythmus', duration: '8 min', description: 'Körperspannung und Timing.' }),
    mod({ id: 'b3', title: 'Erste Choreografie', duration: '12 min', description: 'Aus Steps eine kleine Choreo bauen.' }),
    mod({ id: 'b4', title: 'Stilrichtungen überblicken', duration: '6 min', description: 'Standard, Latein, Hip-Hop, Contemporary.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const parkour: SportCurriculum = {
  sportId: 'parkour',
  anfaenger: [
    mod({ id: 'b1', title: 'Sicher landen und abrollen', duration: '9 min', description: 'Die wichtigste Skill in Parkour.', ytVideoId: 'qVGHfEMChYw', channel: 'Freerunning Factory', content: {
      keyPoints: [
        'Beine federn, niemals steif landen.',
        'Rolle über die Diagonale (Schulter zur Hüfte).',
        'Aus dem Sprung in die Rolle ohne Pause.',
      ],
      safety: ['Erst auf Matten, dann auf Gras, dann auf hartem Untergrund.'],
    }}),
    mod({ id: 'b2', title: 'Parkour-Abrollen Tutorial', duration: '7 min', description: 'Detail-Tutorial von urbanamadei.', ytVideoId: 'aeVoHp2jccw', channel: 'urbanamadei' }),
    mod({ id: 'b3', title: 'Präzisionssprung', duration: '8 min', description: 'Exakt auf einen Punkt landen.' }),
    mod({ id: 'b4', title: 'Spot-Scouting', duration: '6 min', description: 'Untergrund prüfen, Sichtlinien.', content: {
      safety: ['Niemals auf nasse oder vereiste Untergründe.', 'Spot vor dem Sprung physisch testen.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const reiten: SportCurriculum = {
  sportId: 'reiten',
  anfaenger: [
    mod({ id: 'b1', title: 'Richtig auf dem Pferd sitzen', duration: '9 min', description: 'Loesdau Lessons – Basics mit Kati.', ytVideoId: 'PvjqjCJknuU', channel: 'Pferdesporthaus Loesdau', content: {
      keyPoints: [
        'Ohr, Schulter, Hüfte, Ferse auf einer Linie.',
        'Becken aufrecht – nicht stuhl-sitzen, nicht reiten wie auf Sofa.',
        'Hände leicht, Daumen oben.',
      ],
    }}),
    mod({ id: 'b2', title: 'Sitzfehler beim Reiten', duration: '10 min', description: 'Folge 1: Grundlagen und Sattel.', ytVideoId: 'gURTenPfjrA', channel: 'Mindset Sport - Reiten' }),
    mod({ id: 'b3', title: 'Schritt, Trab, Galopp', duration: '12 min', description: 'Die drei Grundgangarten.' }),
    mod({ id: 'b4', title: 'Stallarbeit & Pferdepflege', duration: '8 min', description: 'Putzen, Hufe auskratzen, Verständnis.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const golf: SportCurriculum = {
  sportId: 'golf',
  anfaenger: [
    mod({ id: 'b1', title: '5 Golfschwung-Grundlagen', duration: '10 min', description: 'Die Basis für jeden Anfänger.', ytVideoId: 'k94N8LvVoqQ', channel: 'Vaughan spielt den Platz', content: {
      keyPoints: [
        'Griff: Daumen führen, V zur rechten Schulter.',
        'Stand: schulterbreit, leicht in den Knien.',
        'Schwung-Tempo gleichmäßig – nicht abrupt.',
        'Treffmoment: Hände vor dem Ball.',
      ],
    }}),
    mod({ id: 'b2', title: 'Gerade Putten – Technik-Basics', duration: '8 min', description: 'Putt-Grundlagen für Anfänger.', ytVideoId: 'VMBqHXYalis', channel: 'GOLFSTUN.DE - Golf-Training und -Übungen' }),
    mod({ id: 'b3', title: 'Driving Range Routine', duration: '7 min', description: 'Aufwärmen und systematisch üben.' }),
    mod({ id: 'b4', title: 'Etikette auf dem Platz', duration: '6 min', description: 'Schnelles Spiel, Pitchmarks, Bunker.' }),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

const BESPOKE: Record<string, SportCurriculum> = {
  fussball,
  basketball,
  tennis,
  schwimmen,
  klettern,
  yoga,
  boxen,
  laufen,
  radfahren,
  volleyball,
  handball,
  judo,
  karate,
  kickboxen,
  badminton,
  tischtennis,
  squash,
  rudern,
  segeln,
  surfen,
  krafttraining,
  crossfit,
  pilates,
  wandern,
  mountainbike,
  ski,
  snowboard,
  eishockey,
  tanzen,
  parkour,
  reiten,
  golf,
};

const fallbackCurriculum = (sportId: string): SportCurriculum => ({
  sportId,
  anfaenger: genericBeginner,
  fortgeschritten: genericIntermediate,
  profi: genericAdvanced,
});

export const CURRICULA: Record<string, SportCurriculum> = Object.fromEntries(
  SPORTS.map((s) => [s.id, BESPOKE[s.id] ?? fallbackCurriculum(s.id)]),
);

export const LEVEL_LABELS = {
  anfaenger: { label: 'Anfänger', emoji: '🌱', subtitle: 'Grundlagen & erste Übungen' },
  fortgeschritten: { label: 'Fortgeschritten', emoji: '⚡', subtitle: 'Technik, Taktik & Wettkampf' },
  profi: { label: 'Profi', emoji: '🏆', subtitle: 'Peak Performance & Mentaltraining' },
} as const satisfies Record<SkillLevel, { label: string; emoji: string; subtitle: string }>;

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
/*  Generic fallback curriculum (unused now, kept for safety)                 */
/* -------------------------------------------------------------------------- */

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
/*  Shared modules (Profi)                                                    */
/* -------------------------------------------------------------------------- */

const periodisierungModule: TrainingModule = {
  id: 'p-period',
  title: 'Periodisierung verstehen',
  duration: '14 min',
  description: 'Wie du dein Training in Makro-, Meso- und Mikrozyklen aufbaust.',
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
  },
};

const mentaltrainingModule: TrainingModule = {
  id: 'p-mental',
  title: 'Mentaltraining: 5 Übungen für den Wettkampf',
  duration: '11 min',
  description: 'Visualisierung, Atmung und Selbstgespräch.',
  ytVideoId: '-jokYGikJv0',
  channel: 'Rheinischer Schützenbund',
  content: {
    intro: 'Die letzten 10 % Leistung kommen aus dem Kopf. Mentaltraining ist erlernbar – wie ein Muskel.',
    keyPoints: [
      'Visualisierung: täglich 5 Minuten den perfekten Bewegungsablauf durchspielen.',
      'Atemanker: 4 ein – 6 aus, beruhigt das Nervensystem.',
      'Selbstgespräch positiv formulieren ("ins Feld spielen", nicht "nicht ins Aus").',
      'Routinen vor dem Wettkampf reduzieren Entscheidungsstress.',
      'Reframing: Nervosität als Energie deuten.',
    ],
  },
};

const standardProfi: TrainingModule[] = [periodisierungModule, mentaltrainingModule, genericAdvanced[0], genericAdvanced[3]];

/* -------------------------------------------------------------------------- */
/*  Deep-built curricula — Anfänger fully fleshed out                         */
/* -------------------------------------------------------------------------- */

const fussball: SportCurriculum = {
  sportId: 'fussball',
  anfaenger: [
    mod({ id: 'b1', title: 'Der Innenseitstoß', duration: '6 min', description: 'Der wichtigste Pass im Fußball – sauber und kontrolliert.', ytVideoId: 'DIA-TUeV09E', channel: 'Glosemeyer85', content: {
      intro: 'Der Innenseitstoß ist der Pass, den jeder Profi tausendmal pro Spiel spielt: präzise, kontrolliert, einfach zu lernen. Beherrschst du ihn sauber, hast du das Fundament für alles Weitere.',
      keyPoints: [
        'Standbein neben den Ball, ca. 15 cm Abstand – Zehe zeigt zum Ziel.',
        'Schussfuß-Spitze angezogen und fixiert, stabiles Sprunggelenk.',
        'Mit der Innenseite mittig treffen, nicht mit der Spitze.',
        'Oberkörper leicht über den Ball – sonst steigt er hoch.',
        'Den Schuss durchziehen, Bein hinterher.',
      ],
      tips: ['Übe zuerst gegen eine Wand – sofortiges Feedback.', 'Konzentriere dich auf den Trefferpunkt am Fuß, nicht auf das Ziel.'],
    }}),
    mod({ id: 'b2', title: '9 Varianten der Ballannahme', duration: '8 min', description: 'Flache und hohe Bälle sauber kontrollieren.', ytVideoId: 'HfV67rCgMI4', channel: 'All About Football', content: {
      intro: 'Eine saubere Ballannahme entscheidet, ob die nächste Aktion gelingt. Du lernst Annahme mit Innenseite, Außenseite, Sohle, Brust und Oberschenkel.',
      keyPoints: [
        'Erster Kontakt = nächste Aktion. Plane die Annahme vor dem Ball.',
        'Annahmefläche locker halten – nicht versteifen.',
        'Bei hohen Bällen "abfedern", als würdest du ein Ei fangen.',
        'Mitnahme in die Richtung der nächsten Aktion.',
        'Vor dem Ball schon das Umfeld scannen.',
      ],
      tips: ['1-gegen-1-Drill: Annahme + sofortige Bewegung gegen Druck.'],
    }}),
    mod({ id: 'b3', title: 'Kopfball – 4 Schritte zum perfekten Header', duration: '7 min', description: 'Timing, Sprungtechnik und sauberer Stirn-Kontakt.', ytVideoId: 'SYjEF6SSMg0', channel: 'Camill Hauser', content: {
      intro: 'Viele Kopfbälle scheitern nicht am Sprung, sondern am Trefferpunkt. Mit dieser Methode lernst du, den Ball aktiv mit der Stirn zu spielen.',
      keyPoints: [
        'Absprung kraftvoll aus einem Bein.',
        'Augen geöffnet bis zum Kontakt.',
        'Mit der Stirn treffen – nicht mit Scheitel oder Nase.',
        'Aktive Nackenbewegung: peitsche den Kopf nach vorne.',
      ],
      safety: ['Im Jugendbereich Kopfbälle reduzieren – Nackenkraft erst aufbauen.', 'Bei Schwindel oder Kopfschmerzen sofort pausieren.'],
    }}),
    mod({ id: 'b4', title: 'FIFA 11+ Aufwärmen', duration: '12 min', description: 'Verletzungsprävention durch das offizielle FIFA-Programm.', ytVideoId: 'DiAbszQCwO8', channel: 'PhysioCoach Matteo', content: {
      intro: 'Über 50 % der Fußballverletzungen passieren in den ersten 15 Minuten. Ein strukturiertes FIFA-11+-Warm-up senkt das Risiko nachweislich.',
      keyPoints: [
        '5 min lockeres Joggen mit Richtungswechseln.',
        'Dynamische Mobility: Hüftöffner, Beinpendel, Ausfallschritte mit Rotation.',
        'Aktivierung: 5 × 20 m Sprints, Side-Steps, Antritte aus der Bewegung.',
        'Ballgefühl: Passspiel mit ansteigendem Tempo, Annahme + sofortiger Pass.',
        'Direkt vor Anpfiff 1-gegen-1-Duelle für die mentale Aktivierung.',
      ],
      tips: ['FIFA 11+ ist wissenschaftlich validiert und sollte 2× pro Woche komplett durchgespielt werden.'],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: '5 Methoden für den Spielaufbau', duration: '12 min', description: 'Räume erkennen, Linien überspielen.', ytVideoId: 'QQt_MQy4cYM', channel: "Sam's Fußball Channel" }),
    mod({ id: 'i2', title: 'Spielaufbau in der Dreierkette', duration: '14 min', description: 'Trainingsformen für eine 3er-Kette.', ytVideoId: 'UqiT1HgEszg', channel: 'Deutsches Fußball Internat' }),
    mod({ id: 'i3', title: 'Kopfball-Training für Fortgeschrittene', duration: '10 min', description: 'Timing-Übungen mit Sprungkraft.', ytVideoId: 'vN7BefbV8sM', channel: 'Deutsches Fußball Internat' }),
    mod({ id: 'i4', title: 'Regeneration nach Spielen', duration: '8 min', description: 'Auslaufen, Ernährung, Schlaf.' }),
  ],
  profi: standardProfi,
};

const basketball: SportCurriculum = {
  sportId: 'basketball',
  anfaenger: [
    mod({ id: 'b1', title: 'Dribbling Basics mit Steffen Hamann', duration: '6 min', description: 'Sicheres Dribbling – FC Bayern Tutorial.', ytVideoId: 'kjbY0yaE_3E', channel: 'FC Bayern Basketball', content: {
      intro: 'Dribbling ist die wichtigste Fähigkeit im Basketball – aus jedem Move startet ein Dribbling oder ein Pass. BBL-Profi Steffen Hamann zeigt dir die Basics.',
      keyPoints: [
        'Tief in den Knien – Schwerpunkt nach unten, schwer zu klauen.',
        'Ball mit den Fingerkuppen führen, nicht mit der Handfläche.',
        'Blick nach vorne, nie auf den Ball.',
        'Beide Hände gleich oft trainieren – schwächere zuerst.',
      ],
      tips: ['Tägliches 5-Min-Drill: 100 Dribblings rechts, 100 links, 50 wechselseitig.'],
    }}),
    mod({ id: 'b2', title: 'Dribbling: Technik in Zeitlupe', duration: '5 min', description: 'Bewegungsanalyse Frame für Frame.', ytVideoId: 'IJ5wHEpTkL8', channel: 'vlamingo', content: {
      keyPoints: [
        'Druck nach unten kommt aus dem Handgelenk, nicht aus dem Arm.',
        'Knie weich – stoße den Boden weg, nicht klopfe ihn.',
        'Schutzhand defensiv vor den Körper.',
      ],
    }}),
    mod({ id: 'b3', title: 'Der Korbleger (Layup)', duration: '11 min', description: 'Schrittfolge, Absprung, weicher Ablauf.', ytVideoId: 'MDwpCVqtoz4', channel: 'True Rimdoc', content: {
      intro: 'Der Korbleger ist die häufigste Punkteform im Basketball. Mit der richtigen Schrittfolge wird er auch unter Gegnerdruck zur sicheren Bank.',
      keyPoints: [
        'Schrittfolge rechts: rechts – links – Absprung links.',
        'Hochziehen des Spielbein-Knies für Drive und Schutz.',
        'Ball mit der korbfernen Hand schützen.',
        'Sanft am Brett ablegen, nicht hineinwerfen.',
      ],
      tips: ['Beide Seiten gleich oft üben – auf Spielniveau ist das Pflicht.'],
    }}),
    mod({ id: 'b4', title: 'Wurftechnik mit Niels Giffey', duration: '10 min', description: 'Der perfekte Korbwurf – Basketball Basics aus der BBL.', ytVideoId: 'hd0fKRokd84', channel: 'easyCredit Basketball Bundesliga', content: {
      intro: 'Eine sauber wiederholbare Wurftechnik ist das Fundament jedes Scorers. Niels Giffey führt dich durch die Bausteine.',
      keyPoints: [
        'Füße zum Korb ausrichten ("ten toes to the rim").',
        'Wurfarm bildet ein "L" – Ball auf den Fingerspitzen.',
        'Hochstrecken und durchziehen – Hand zeigt in den Korb.',
        'Rhythmus aus den Beinen, nicht aus dem Arm.',
        'Follow-Through stehen lassen, bis der Ball den Ring trifft.',
      ],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Defense Helpside', duration: '7 min', description: 'Wann du herunterhelfen musst.', ytVideoId: 'koNygTlamzQ', channel: 'FC Bayern Basketball' }),
    mod({ id: 'i2', title: 'Pick & Roll lesen', duration: '15 min', description: 'Das wichtigste Muster modernen Basketballs.' }),
    mod({ id: 'i3', title: 'Konditionstraining', duration: '20 min', description: 'Sprint-Intervalle, Sprungkraft, Beweglichkeit.' }),
    mod({ id: 'i4', title: 'Spielsysteme verstehen', duration: '18 min', description: 'Motion Offense vs. Pick & Roll Sets.' }),
  ],
  profi: standardProfi,
};

const yoga: SportCurriculum = {
  sportId: 'yoga',
  anfaenger: [
    mod({ id: 'b1', title: 'Sonnengruß für Anfänger', duration: '10 min', description: 'Langsam und exakt – Surya Namaskar Schritt für Schritt.', ytVideoId: 'MYIUYHFIpJw', channel: 'YOGABASICS', content: {
      intro: 'Der Sonnengruß (Surya Namaskar) ist die ikonische Yoga-Sequenz. Er wärmt den Körper auf, mobilisiert die Wirbelsäule und verbindet Atmung mit Bewegung.',
      keyPoints: [
        'Jede Bewegung mit einem Atemzug verbinden.',
        'Stehende Vorbeuge: Knie beugen ist erlaubt!',
        'Plank: Schultern über Handgelenken, Po nicht hängen lassen.',
        'Aufwärts schauender Hund: nur, wenn die Lendenwirbelsäule stabil ist.',
      ],
      tips: ['Starte mit 3 Runden täglich. Steigere auf 12 – ein klassisches Pensum.'],
      safety: ['Bei Bandscheibenproblemen keine tiefen Rückbeugen ohne Lehrer.'],
    }}),
    mod({ id: 'b2', title: 'Krieger 1, 2 und 3 lernen', duration: '15 min', description: 'Die drei wichtigsten stehenden Posen.', ytVideoId: 'wgdj7-C75m0', channel: 'YOGABASICS', content: {
      intro: 'Die Krieger-Posen (Virabhadrasana) stärken Beine, öffnen die Hüfte und schulen Balance. Sie sind in fast jeder Klasse präsent.',
      keyPoints: [
        'Krieger 1: vorderes Knie über dem Knöchel, hinterer Fuß im 45°-Winkel.',
        'Krieger 2: Hüfte zur Seite öffnen, Arme parallel zum Boden.',
        'Krieger 3: aus dem Hüftgelenk in die Waagrechte heben.',
        'Bauchspannung in allen Varianten – stabilisiert die Wirbelsäule.',
      ],
    }}),
    mod({ id: 'b3', title: 'Wechselatmung für Anfänger', duration: '8 min', description: 'Nadi Shodana – die beruhigende Atemtechnik.', ytVideoId: '6Ct6N1vEWhQ', channel: 'Mady Morrison', content: {
      intro: 'Pranayama (Atemarbeit) ist Yoga jenseits der Asanas. Die Wechselatmung beruhigt das Nervensystem in unter 10 Minuten messbar.',
      keyPoints: [
        'Daumen schließt das rechte Nasenloch, Ringfinger das linke.',
        'Links einatmen, rechts ausatmen – rechts einatmen, links ausatmen.',
        'Atemzüge gleichmäßig zählen (z. B. 4-4-4-4).',
        'Sitz aufrecht, Schultern entspannt.',
      ],
    }}),
    mod({ id: 'b4', title: 'Verletzungsgefahren für Yoga-Anfänger', duration: '8 min', description: 'YOGABASICS warnt vor typischen Anfängerfallen.', ytVideoId: 'ED0aWn40DFQ', channel: 'YOGABASICS - Der 8 Minuten Club', content: {
      intro: 'Yoga ist sicher – wenn du auf den Körper hörst. Diese Hinweise helfen, typische Anfängerfehler zu vermeiden.',
      safety: [
        'Schmerz im Knie = sofort raus aus der Pose, niemals "durchhalten".',
        'Bei Bluthochdruck keine kopfüber-Haltungen.',
        'In der Schwangerschaft nur spezialisierten Klassen folgen.',
        'Klötze und Gurte sind keine Krücken – sie machen besseres Yoga möglich.',
        'Niemals durch scharfen Schmerz pushen – das ist kein "Dehnen".',
      ],
      tips: ['Hör in den ersten Wochen mehr auf den Lehrer als auf den Nachbarn.'],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Krieger 3 – Variationen', duration: '9 min', description: 'Balance und Hüftöffnung.', ytVideoId: 'jrDdVEvfFfs', channel: 'Yoga Individual' }),
    mod({ id: 'i2', title: 'Power Vinyasa Flow (60 Min)', duration: '60 min', description: 'Sonnengruß, Krieger, Balancen, Twists.', ytVideoId: 'Z2saufuHh4w', channel: 'Mascha Trietsch' }),
    mod({ id: 'i3', title: 'Hüftöffner-Reihe', duration: '20 min', description: 'Lange gehaltene Posen für Beweglichkeit.' }),
    mod({ id: 'i4', title: 'Rückbeugen sicher aufbauen', duration: '15 min', description: 'Von Bridge zu Rad.' }),
  ],
  profi: [
    mod({ id: 'p1', title: 'Kopfstand (Sirsasana) lernen', duration: '12 min', description: 'Vorbereitung und fortgeschrittenere Variation.', ytVideoId: 'x9y97j4uI_w', channel: 'Mascha Trietsch' }),
    mentaltrainingModule,
    periodisierungModule,
    mod({ id: 'p4', title: 'Yoga als Lehrer:in weitergeben', duration: '20 min', description: 'Cue-Sprache und Klassen-Aufbau.' }),
  ],
};

const laufen: SportCurriculum = {
  sportId: 'laufen',
  anfaenger: [
    mod({ id: 'b1', title: 'Von 0 auf 5 km – 8 Wochen', duration: '11 min', description: 'Der klassische Einstieg in den Laufsport.', ytVideoId: 'U94gD-isdeE', channel: 'ausdauerclub', content: {
      intro: 'In 8 Wochen schaffst du deine ersten 5 km am Stück – wenn du strukturiert vorgehst. Der Plan startet mit Geh-Lauf-Intervallen und steigert sich behutsam.',
      keyPoints: [
        '3 Einheiten pro Woche mit mindestens 24 h Pause.',
        'Tempo so wählen, dass du dich noch unterhalten kannst.',
        'Steigern über Zeit, nicht über Geschwindigkeit.',
        'Eine leichtere Woche alle 4 Wochen einplanen.',
      ],
      tips: ['Lieber 5× pro Woche 25 min als 1× pro Woche 90 min.'],
    }}),
    mod({ id: 'b2', title: '6-Wochen-Trainingsplan für 5 km', duration: '12 min', description: 'Eine straffere Variante mit klarer Wochenstruktur.', ytVideoId: '3F-jtzPCTrw', channel: 'ONESTEPFASTER UG', content: {
      keyPoints: [
        'Woche 1–2: Geh-Lauf-Intervalle 1:1 bis 2:1.',
        'Woche 3–4: durchgehend 10–15 Minuten laufen.',
        'Woche 5–6: lange Läufe steigern auf 30 Minuten.',
      ],
    }}),
    mod({ id: 'b3', title: 'Richtig atmen beim Joggen', duration: '8 min', description: 'Nie wieder Seitenstechen.', ytVideoId: 'm52QiGiaICw', channel: 'runnersflow', content: {
      intro: 'Falsche Atmung ist die Nr.-1-Ursache für Seitenstechen und vorzeitige Erschöpfung. Mit ein paar Anpassungen läufst du locker länger.',
      keyPoints: [
        'Tief in den Bauch atmen, nicht in die Brust.',
        'Atemrhythmus an Schrittfolge koppeln: 3-2 (3 ein, 2 aus) für Tempo, 4-4 für Dauerlauf.',
        'Durch Mund UND Nase – mehr Sauerstoff.',
        'Bei Seitenstechen: kurz langsamer, tief ausatmen.',
      ],
    }}),
    mod({ id: 'b4', title: 'Lauftechnik & Atmung (Runner\'s World)', duration: '6 min', description: 'Expert:innen erklären die richtige Atmung systematisch.', ytVideoId: 'SHFDUHbbke4', channel: "RUNNER'S WORLD" }),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Marathon-Vorbereitung: Grundlagen', duration: '14 min', description: 'Wie ein Marathon-Aufbau strukturell aussieht.', ytVideoId: '-nM47Dd4S0g', channel: 'Andreas Butz' }),
    mod({ id: 'i2', title: 'Intervalltraining strukturieren', duration: '10 min', description: 'Welche Intervalle wofür?' }),
    mod({ id: 'i3', title: 'Ernährung für Läufer', duration: '12 min', description: 'Kohlenhydrate, Salz, Hydration.' }),
    mod({ id: 'i4', title: 'Verletzungen vorbeugen', duration: '15 min', description: 'Läuferknie, Achillessehne, Schienbein.' }),
  ],
  profi: standardProfi,
};

const krafttraining: SportCurriculum = {
  sportId: 'krafttraining',
  anfaenger: [
    mod({ id: 'b1', title: 'Trainingsplan für Anfänger', duration: '13 min', description: 'Ein 3–4-Tage-Plan, der wirklich funktioniert.', ytVideoId: '4PJfrREOigM', channel: 'Jessica Bock', content: {
      intro: 'Als Anfänger:in profitierst du am meisten von einem Ganzkörperplan. Diese Routine deckt alle wichtigen Muskelgruppen ab – ohne Schnickschnack.',
      keyPoints: [
        'Drei Ganzkörper-Workouts pro Woche, je 45–60 Min.',
        'Sechs Grundübungen: Kniebeuge, Kreuzheben, Bankdrücken, Rudern, Schulterdrücken, Klimmzug.',
        '3–4 Sätze à 8–12 Wiederholungen.',
        'Letzte 1–2 Wiederholungen sollen wirklich schwer sein.',
      ],
    }}),
    mod({ id: 'b2', title: 'Neulinge im Gym', duration: '10 min', description: 'Wie ein Anfängerplan im Studio aussieht.', ytVideoId: 'AIUaHSmYblc', channel: 'Patricia Kraft', content: {
      keyPoints: [
        'Erste 4 Wochen: Übungen erst an Maschinen lernen.',
        'Bewegungsamplitude voll ausnutzen – kein Teiltraining.',
        'Pausen 1–2 Min zwischen Sätzen.',
      ],
    }}),
    mod({ id: 'b3', title: 'Aufwärmen mit dem Gewicht', duration: '7 min', description: 'Spezifisches Warmup an der Langhantel.', content: {
      intro: 'Kaltes Gewicht ist Verletzungsgefahr. Das spezifische Warmup ist Pflicht für jede Hauptübung.',
      keyPoints: [
        '5 Min lockeres Cardio zur allgemeinen Erwärmung.',
        'Mobility für die belasteten Gelenke (Schulter / Hüfte / Sprunggelenk).',
        'Aufwärmsätze: leere Stange × 8 → 50 % × 5 → 70 % × 3 → 85 % × 1.',
        'Erst dann Arbeitssätze.',
      ],
    }}),
    mod({ id: 'b4', title: 'Sicherheit & Etikette im Studio', duration: '10 min', description: 'Spotter, Klemmen, Bankdrücken, Studio-Knigge.', content: {
      intro: 'Krafttraining ist einer der sichersten Sports – statistisch sicherer als Fußball oder Skifahren. Vorausgesetzt, du befolgst ein paar einfache Regeln. Gleichzeitig macht Studio-Etikette das Training für alle angenehmer.',
      keyPoints: [
        'Klemmen IMMER beidseitig – die Stange darf nicht kippen.',
        'Schweres Bankdrücken nur im Rack mit Safety Pins oder mit aktivem Spotter.',
        'Bei Kniebeuge das Gewicht im Rack auf passender Höhe einhängen.',
        'Atmung: tief vor der Last, ausatmen in der Anstrengung – Valsalva nur bei sehr schwerem Heben.',
        'Vor jedem Arbeitssatz: kurzer mentaler Check – Stange gerade? Füße richtig? Klemmen?',
        'Pause-Etikette: kein Smartphone-Scrollen auf belegtem Gerät, nach Gebrauch abräumen.',
      ],
      tips: [
        'Frage andere Trainierende nach einem Spot – das ist im Studio normal und erwünscht.',
        'Handtuch ist Pflicht – Schweiß auf Polstern ist Ekel und Verletzungsrisiko.',
        'Bei knappen Sätzen: lieber abbrechen als verletzen.',
      ],
      safety: [
        'Niemals mit verdrehter oder gerundeter Wirbelsäule heben.',
        'Bei stechendem oder einschießendem Schmerz sofort abbrechen – nicht "durchziehen".',
        'Olympisches Heben (Reißen, Stoßen) nur mit qualifiziertem Coach lernen.',
      ],
    }}),
  ],
  fortgeschritten: [
    mod({ id: 'i1', title: 'Kniebeuge / Squat – korrekte Technik', duration: '10 min', description: 'Die wichtigste Ganzkörperübung.', ytVideoId: 'BwuC74wVQT4', channel: 'Work It Training' }),
    mod({ id: 'i2', title: 'Kreuzheben / Deadlift', duration: '12 min', description: 'Der Klassiker der Ganzkörperkraft.', ytVideoId: 'gRfFdvXpEEU', channel: 'Kernwerk® Functional Fitness' }),
    mod({ id: 'i3', title: 'Volumen, Intensität & Frequenz', duration: '15 min', description: 'Die drei Stellschrauben des Trainings.' }),
    mod({ id: 'i4', title: 'Ernährung für Muskelaufbau', duration: '12 min', description: 'Kalorienüberschuss, Protein, Timing.' }),
  ],
  profi: standardProfi,
};

const tennis: SportCurriculum = {
  sportId: 'tennis',
  anfaenger: [
    mod({ id: 'b1', title: 'Vorhand lernen Schritt für Schritt', duration: '9 min', description: 'Die wichtigste Grundtechnik im Tennis.', ytVideoId: 'X8kOE02NNrI', channel: 'Tennis Mastery', content: {
      intro: 'Die Vorhand ist im Tennis der meistgespielte Schlag. Eine saubere Technik gibt dir Kontrolle, Spin und Power – ohne dass du dich verausgaben musst.',
      keyPoints: [
        'Eastern- oder Halbwestern-Griff – nicht zu extrem.',
        'Schulter zur Netzseite drehen (Ausholen).',
        'Treffpunkt deutlich vor dem Körper.',
        'Durchschwung zur gegenüberliegenden Schulter.',
        'Auf den Bällen der Füße bleiben.',
      ],
      tips: ['Beginne ohne Ball – schattenschwinge 20× pro Tag.'],
    }}),
    mod({ id: 'b2', title: 'Anfängerstunde in 30 Minuten', duration: '30 min', description: 'Vorhand, Rückhand, Aufschlag kompakt.', ytVideoId: 'zAcGyBoMz0s', channel: 'Tennis Mastery' }),
    mod({ id: 'b3', title: 'Aufschlag lernen Teil 1', duration: '11 min', description: 'Der wichtigste Punkt jedes Spiels – sauber starten.', ytVideoId: 'hZnEb8W8ElE', channel: 'Tennis Mastery', content: {
      intro: 'Der Aufschlag ist der einzige Schlag, den nur du selbst bestimmst. Mit dieser Schritt-für-Schritt-Anleitung baust du eine wiederholbare Technik auf.',
      keyPoints: [
        'Kontinentalgriff – wie ein Hammer.',
        'Wurf-Hochwurf: glatt und kontrolliert, leicht vor dem Körper.',
        'Trophy-Position: Schläger zeigt nach oben hinten, Ellbogen hoch.',
        'Aus den Beinen explodieren – Power kommt von unten.',
        'Mit pronierter Hand treffen, durchschwingen.',
      ],
    }}),
    mod({ id: 'b4', title: 'Splitstep – die wichtigste Beinarbeit', duration: '6 min', description: 'Der oft vergessene Schritt – Grundlage jeder Bewegung.', ytVideoId: 'VpLXJ5YVFJ4', channel: 'Tennisschule Klee', content: {
      intro: 'Im Tennis wird mit den Füßen geschlagen, nicht mit dem Arm. Wer schlecht steht, schlägt schlecht – egal wie gut die Technik ist.',
      keyPoints: [
        'Splittstep: kleiner Hüpfer, wenn der Gegner trifft.',
        'Mit kleinen, schnellen Schritten zum Ball.',
        'Position halten statt rennen, wenn möglich.',
        'Nach dem Schlag aktiv zurück zur Mittellinie.',
      ],
      tips: ['Übe Splittsteps an der Wand – jedes Mal, wenn der Ball trifft, ein Hüpfer.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const schwimmen: SportCurriculum = {
  sportId: 'schwimmen',
  anfaenger: [
    mod({ id: 'b1', title: 'Kraulen lernen mit Toni Embacher', duration: '7 min', description: 'In vier einfachen Schritten zur Kraultechnik.', ytVideoId: 'cg5kkJH1EvA', channel: 'FITBOOK', content: {
      intro: 'Kraulen ist die schnellste Lage und gleichzeitig die anspruchsvollste in der Koordination. Ex-Profi Toni Embacher zeigt dir den Einstieg.',
      keyPoints: [
        'Wasserlage flach – Po und Beine an der Oberfläche.',
        'Beinschlag aus der Hüfte, nicht aus dem Knie.',
        'Armzug: Eintauchen → ziehen → drücken → raus.',
        'Atmung zur Seite, niemals nach vorne.',
      ],
      tips: ['Üben mit Pull-Buoy zwischen den Beinen – isoliere den Armzug.'],
    }}),
    mod({ id: 'b2', title: 'Schwimmkurs Kraulen Teil 1/3', duration: '12 min', description: 'Online-Schwimmkurs mit Technikübungen.', ytVideoId: 'Wljc3OWYKVk', channel: 'DOCSWIM' }),
    mod({ id: 'b3', title: 'Brustschwimmen – Schritt für Schritt', duration: '8 min', description: 'Die Lage, die jeder lernen sollte.', ytVideoId: 'ItRtk_eP5EQ', channel: 'VA-Verlag – Imprint FeuerTanz-Verlag', content: {
      intro: 'Brustschwimmen ist die meistverbreitete Lage – aber 90 % machen sie falsch. Saubere Technik schont Kniegelenke und Halswirbelsäule.',
      keyPoints: [
        'Beinschlag wie ein Frosch: anziehen → grätschen → schließen.',
        'Arme nach vorne strecken, dann nach außen ziehen, vor der Brust zusammenführen.',
        'Atmung in jeder Zugphase – Kopf nicht ständig oben halten.',
        'Gleitphase nach jedem Zyklus – das ist die Erholung.',
      ],
      safety: ['Nicht den Kopf dauerhaft über Wasser halten – Nackenprobleme drohen.'],
    }}),
    mod({ id: 'b4', title: 'Wassergewöhnung – Anfängerschwimmkurs Teil 2', duration: '12 min', description: 'Im Wasser entspannen und sicher Vertrauen aufbauen.', ytVideoId: 'LZfmAVRM1EQ', channel: 'swimcoachvideos', content: {
      intro: 'Bevor Technik kommt, kommt Vertrauen. Wassergewöhnung ist der Schlüssel – auch für Erwachsene, die Schwimmen "nachlernen".',
      keyPoints: [
        'Ausatmen UNTER Wasser – nicht oben.',
        'Gesicht ins Wasser, Augen offen (mit Brille).',
        'Auftrieb passiv spüren: einfach treiben lassen.',
        'Tieferes Wasser nur schrittweise erschließen.',
      ],
      safety: [
        'Niemals allein in unbekanntem Gewässer.',
        'Bahn-Etikette: vorne hoch, hinten runter, im Kreis schwimmen.',
        'Bei Krampf: ruhig bleiben, Muskel dehnen, auf den Rücken legen.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const klettern: SportCurriculum = {
  sportId: 'klettern',
  anfaenger: [
    mod({ id: 'b1', title: '10 Technik-Tipps für Bouldern-Anfänger', duration: '11 min', description: 'Die wichtigsten Bouldergrundlagen.', ytVideoId: '5F_JDm1VWH8', channel: 'Lauf des Lebens', content: {
      intro: 'Bouldern ist die zugänglichste Form des Kletterns – ohne Seil, niedrige Wand, dicke Matte. Diese 10 Tipps machen dich vom ersten Versuch an besser.',
      keyPoints: [
        'Mit den Beinen drücken, nicht mit den Armen ziehen.',
        'Hüfte nah an die Wand.',
        'Augen ruhig lassen – Route vor dem Klettern lesen.',
        'Aktiv atmen, gerade in schweren Zügen.',
        'Trittfehler bewusst korrigieren – nicht nur "draufstehen".',
      ],
    }}),
    mod({ id: 'b2', title: '4 Techniken für Boulder-Einsteiger', duration: '8 min', description: 'Die wichtigsten Bewegungsmuster.', ytVideoId: 'x6hjO4w0XUc', channel: 'Grundkurs Bouldern', content: {
      keyPoints: [
        'Schweben (Frog): Hüfte zur Wand, Knie nach außen.',
        'Drop Knee: Knie nach innen drehen für Reichweite.',
        'Flagging: Bein als Gegengewicht ausstellen.',
        'Heel Hook: Ferse einhaken und damit ziehen.',
      ],
    }}),
    mod({ id: 'b3', title: 'Sichern, Knoten & Clippen (Seilklettern)', duration: '14 min', description: 'Für Toprope brauchst du diese drei Skills.', ytVideoId: 'G5Exk1Jzj_I', channel: 'Ulrich Schwingshackl - UIAGM Mountain Guide', content: {
      intro: 'Beim Klettern mit Seil hängt dein Leben am Partner. Achterknoten, Tube-Sicherung und sauberes Clippen sind die drei Skills, die du sicher beherrschen MUSST.',
      keyPoints: [
        'Achterknoten gegensteckend, mit doppeltem Spierenstich gesichert.',
        'Tube oder Halbmastwurf: Bremshand IMMER unten.',
        'Vor dem Klettern: Partner-Check (Gurt, Knoten, Verschluss).',
        'Beim Sichern: aktiv nachgeben und einholen, nicht nur abwarten.',
      ],
      safety: [
        'Niemals ohne Partner-Check ins Seil.',
        'Im Zweifel: zusätzlich Hintersicherung.',
        'Sicherungskurs in der Halle vor der ersten echten Tour.',
      ],
    }}),
    mod({ id: 'b4', title: 'Boulder-Basics: Sicher fallen und landen', duration: '8 min', description: 'Die wichtigste Skill nach dem Klettern.', ytVideoId: '6yVCjdKAQZw', channel: 'Grundkurs Bouldern', content: {
      intro: 'Über 70 % aller Boulder-Verletzungen passieren beim unkontrollierten Fallen. Saubere Falltechnik ist Skill Nr. 1.',
      keyPoints: [
        'Nie steif landen – Knie weich, Beine federn.',
        'Auf der Matte abrollen, nicht aufschlagen.',
        'Beim Klettern aufmerksam: nicht unter andere Kletterer.',
        'Auf großen Boulder-Problemen: vorher den Fallweg checken.',
      ],
      safety: ['Spotter haben bei hohen Boulder – sie steuern den Fall, fangen ihn nicht.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const boxen: SportCurriculum = {
  sportId: 'boxen',
  anfaenger: [
    mod({ id: 'b1', title: 'Die 5 wichtigsten Schläge', duration: '9 min', description: 'Jab, Cross, Hook, Uppercut, Bodyshot.', ytVideoId: 'W-QbWPDs4Bs', channel: 'Coach Ferhat', content: {
      intro: 'Beim Boxen bauen alle Kombinationen auf 5 Grundschlägen auf. Beherrschst du diese sauber, kannst du fast jede Situation lösen.',
      keyPoints: [
        'Jab: gerade aus der Führhand, schnell, präzise.',
        'Cross: harte Gerade aus der Schlaghand, Hüftrotation.',
        'Hook: seitlich, kommt aus der Hüfte – Ellbogen waagerecht.',
        'Uppercut: von unten in die Kinnspitze, Beine drücken.',
        'Bodyshot: zur Leber – Beine beugen, dann schlagen.',
      ],
      tips: ['Immer mit Deckung schlagen, Hand zurück zur Wange führen.'],
    }}),
    mod({ id: 'b2', title: 'Beinarbeit – Fundament eines Boxers', duration: '11 min', description: 'Footwork mit Maurice Weber.', ytVideoId: 'GTnIPuZSaU8', channel: 'Maurice Weber', content: {
      intro: 'Boxen wird mit den Beinen gewonnen. Wer steht, verliert – wer sich bewegt, dominiert die Distanz.',
      keyPoints: [
        'Klein und tief – Schwerpunkt nach unten.',
        'Schritt-Schritt-Prinzip: führendes Bein zuerst, hinteres folgt.',
        'Nie Beine kreuzen – Gleichgewicht weg.',
        'Aus dem Stand abdrücken, nicht hüpfen.',
      ],
      tips: ['Übe in der Wohnung mit Klebeband-Quadrat – innerhalb der Markierung bewegen.'],
    }}),
    mod({ id: 'b3', title: 'Grundstellung & erste Kombinationen', duration: '10 min', description: 'Stand, Footwork und Schlag-Kombinationen.', ytVideoId: 'KSZk17UTfLc', channel: 'uebungenzuhause' }),
    mod({ id: 'b4', title: 'Boxbandagen richtig wickeln', duration: '6 min', description: 'KHUNPON erklärt die Bandagen-Technik Schritt für Schritt.', ytVideoId: '-8U3KTPr3Kc', channel: 'KHUN PON - Onlineshop (Kein Ladengeschäft)', content: {
      intro: 'Boxen ist ein Kontaktsport. Die richtige Schutzausrüstung macht Training erst möglich und schützt deine Karriere.',
      keyPoints: [
        'Bandagen schützen Finger und Handgelenk – immer wickeln.',
        'Handschuhe: 12 oz fürs Training, 14–16 oz fürs Sparring.',
        'Mundschutz und Kopfschutz beim Sparring – ohne Ausnahme.',
        'Hand-Wraps regelmäßig waschen – sonst Hautprobleme.',
      ],
      safety: ['Kein Sparring ohne Schutz.', 'Bei Hand-/Handgelenkschmerzen sofort pausieren.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const radfahren: SportCurriculum = {
  sportId: 'radfahren',
  anfaenger: [
    mod({ id: 'b1', title: '5 Tipps für Rennrad-Anfänger', duration: '9 min', description: 'GCN-Klassiker für den Einstieg.', ytVideoId: 'eFwuOVrETjs', channel: 'GCN auf Deutsch', content: {
      intro: 'Vom Citybike aufs Rennrad zu wechseln ist ein Sprung – andere Geometrie, andere Schaltung, andere Geschwindigkeit. Diese 5 Tipps sparen dir Wochen an Lernkurve.',
      keyPoints: [
        'Sattelhöhe: Bein fast gestreckt am tiefsten Pedalpunkt.',
        'Gleichmäßige Trittfrequenz von 80–90 U/min anstreben.',
        'Mit leichten Gängen starten – Knie schonen.',
        'Vorderbremse vorsichtig dosieren – sonst Überschlag.',
        'Click-Pedale erst auf ruhiger Strecke lernen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Rennrad & Gravel-Einstieg 2025', duration: '12 min', description: 'Aktuelle Tipps für den Einstieg.', ytVideoId: 'TS7hWBHPWTs', channel: 'Fahrrad XXL' }),
    mod({ id: 'b3', title: 'Sitzposition richtig einstellen', duration: '8 min', description: 'Sattelhöhe, Sattelposition, Lenkerhöhe.', content: {
      intro: 'Ein perfekt eingestelltes Rad fühlt sich nach 100 km noch wie 10 km an. Eine schlechte Position bringt Schmerzen schon nach 30 Minuten.',
      keyPoints: [
        'Sattelhöhe (Heel-Method): Ferse aufs Pedal, Bein gerade gestreckt.',
        'Sattel waagerecht oder minimal nach vorne gekippt.',
        'Lenkerabstand: Ellbogen leicht gebeugt, Schultern entspannt.',
        'Cleats: Großzehenballen über der Pedalachse.',
      ],
      tips: ['Vor der ersten 100-km-Tour ein Bike-Fitting machen lassen.'],
    }}),
    mod({ id: 'b4', title: 'Handzeichen für Radfahrer', duration: '6 min', description: 'GCN erklärt die wichtigsten Handzeichen für die Gruppenfahrt.', ytVideoId: 'WWUFzfZuXgk', channel: 'GCN auf Deutsch', content: {
      intro: 'Auf der Straße bist du der kleinste Verkehrsteilnehmer – Sichtbarkeit und Vorhersehbarkeit retten Leben.',
      keyPoints: [
        'Handzeichen vor jedem Spurwechsel.',
        'In Gruppen Lücken nicht zu schmal lassen – Reaktionszeit.',
        'Genug Abstand zu parkenden Autos (Türen-Falle, "Dooring").',
        'Bei Nacht: Front- UND Rücklicht, Reflektoren an Speichen.',
      ],
      safety: [
        'Helm immer, auch bei kurzen Fahrten.',
        'Bei Regen: doppelter Bremsweg einplanen.',
        'Niemals mit Kopfhörern beidseitig im Verkehr.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const volleyball: SportCurriculum = {
  sportId: 'volleyball',
  anfaenger: [
    mod({ id: 'b1', title: 'Pritschen (oberes Zuspiel)', duration: '6 min', description: 'Die Grundlage des Aufbaus.', ytVideoId: 'sEhA80T-PUE', channel: 'VLWOnline', content: {
      intro: 'Das Pritschen ist die präziseste Technik im Volleyball – damit baut der Steller jeden Angriff auf.',
      keyPoints: [
        'Hände formen ein "Dach" über der Stirn.',
        'Fingerspitzen kontrollieren – Daumen nicht ins Spiel bringen.',
        'Aus den Beinen drücken, nicht aus den Armen.',
        'Ball mit beiden Händen gleichzeitig treffen – nicht versetzt.',
      ],
    }}),
    mod({ id: 'b2', title: 'Baggern (unteres Zuspiel)', duration: '6 min', description: 'Annahme harter Aufschläge und Angriffe.', ytVideoId: 'ffee5FXAZ9w', channel: 'VLWOnline', content: {
      keyPoints: [
        'Plattform aus beiden Unterarmen formen.',
        'Knie gebeugt, Schultern locker, leicht nach vorne geneigt.',
        'Den Ball anschieben, nicht schlagen.',
        'Plattform zum Ziel ausrichten – nicht über Schwung.',
      ],
    }}),
    mod({ id: 'b3', title: 'Aufschlag von unten und oben', duration: '8 min', description: 'Der Start jedes Spielzugs – sicher aufschlagen.', ytVideoId: '-3ZSJTj-yPM', channel: 'Sport-Thieme', content: {
      intro: 'Mit einer Profilerin und ihrer Beach-Partnerin lernst du die saubere Technik von unteren und oberen Aufschlägen.',
      keyPoints: [
        'Unterer Aufschlag: stabile Schrittstellung, Pendelbewegung des Arms.',
        'Oberer Aufschlag (Tennis-Aufschlag): Wurf vor den Körper, Schlaghand über den Kopf.',
        'Augenkontakt mit dem Ball bis zum Treffmoment.',
        'Mit der ganzen Hand treffen, nicht nur Faust.',
      ],
    }}),
    mod({ id: 'b4', title: 'Volleyball-Rotation einfach erklärt', duration: '7 min', description: 'Die Rotationsregel für Einsteiger.', ytVideoId: '7CN_VFuAjWE', channel: 'Volleyballfreak', content: {
      intro: 'Volleyball ist ein Rotationsspiel mit klaren Positionen. Wer das System nicht versteht, ist im Spiel verloren.',
      keyPoints: [
        '6 Spieler:innen drehen nach jedem Aufschlag-Gewinn im Uhrzeigersinn.',
        'Zonen 1–6: Aufschlag aus 1, Annahme in 5/6/1.',
        'Vor dem Schlag: "Mein!" rufen – kein Doppel-Schlag-Risiko.',
        'Libero darf nur in der Defensive ein- und auswechseln.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const handball: SportCurriculum = {
  sportId: 'handball',
  anfaenger: [
    mod({ id: 'b1', title: 'Handball-Regeln einfach erklärt', duration: '7 min', description: 'Spielfeld, Schritte, Strafen.', ytVideoId: 'Y6dFe6VjVjQ', channel: 'LAPZ Tutorials', content: {
      intro: 'Handball hat klare Regeln, die man in wenigen Minuten verstehen kann. Wer die Schritte und Linien kennt, kann sofort mitspielen.',
      keyPoints: [
        'Maximal 3 Schritte ohne Prellen.',
        'Maximal 3 Sekunden mit dem Ball in der Hand.',
        'Wurfkreis (6-m-Linie) nur in der Luft betreten.',
        '7 m: Strafwurf nach klarer Torchance.',
      ],
    }}),
    mod({ id: 'b2', title: 'Fangen, Prellen, Sprungwurf, Finte', duration: '9 min', description: 'Die 4 zentralen Grundtechniken.', ytVideoId: 'GuNHlG0kSO8', channel: 'Vision on Demand', content: {
      keyPoints: [
        'Fangen: Hände öffnen sich wie ein Korb.',
        'Prellen: aus dem Handgelenk, niedrige Höhe.',
        'Sprungwurf: Hüfte mitziehen, Hand peitscht nach.',
        'Finte: Schulter erst, dann Beine.',
      ],
    }}),
    mod({ id: 'b3', title: 'Passübung mit Tempo', duration: '8 min', description: 'Highspeed-Pässe für Mannschaftstraining.', ytVideoId: '3hiAhB14ySI', channel: 'Handball Hacks', content: {
      intro: 'Passen ist im Handball oft entscheidender als Werfen. Tempo und Präzision dürfen sich nicht ausschließen.',
      keyPoints: [
        'Pass-Hand begleitet den Ball – nicht klatschen.',
        'Pass in den Lauf des Mitspielers, nicht zu Füßen.',
        'Augenkontakt vor jedem Pass.',
        'Nach dem Pass weiterbewegen – kein "Pass and Watch".',
      ],
    }}),
    mod({ id: 'b4', title: 'Schiedsrichter-Handzeichen', duration: '7 min', description: 'Die wichtigsten Gesten verstehen.', ytVideoId: 'YYLjabcYGsU', channel: 'hsgschaumburgnord', content: {
      intro: 'Wer die Gesten kennt, spielt schneller und beschwert sich nicht – das hilft dem ganzen Team.',
      keyPoints: [
        'Schritt-Fehler: Schiedsrichter dreht Fäuste umeinander.',
        'Doppelfehler: zwei Finger zeigen.',
        'Stürmerfoul: Hände kreuzen vor der Brust.',
        '2 Minuten: zwei Finger nach oben.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const judo: SportCurriculum = {
  sportId: 'judo',
  anfaenger: [
    mod({ id: 'b1', title: 'Erste Würfe: O-soto-otoshi & O-goshi', duration: '10 min', description: 'Die Standardwürfe aus dem Weiß-Gelb-Programm.', ytVideoId: 'x8ctXpjgdm8', channel: 'Judo-im-Pott [de]', content: {
      intro: 'Im Judo lernt jeder Anfänger diese beiden Würfe zuerst: ein Beinwurf und ein Hüftwurf. Sie zeigen das Prinzip "Ju" – Nachgeben statt Brechen.',
      keyPoints: [
        'O-soto-otoshi: Beinwurf mit großer Außensichel.',
        'O-goshi: Hüftwurf, Kontakt am Bauch.',
        'Uke (der Geworfene) lernt zuerst, sicher zu fallen.',
        'Zug am Ärmel führt die Bewegung – nicht der Körper.',
      ],
      safety: ['Wurftraining nur auf Mattenflächen.', 'Erst Fallen lernen, dann Werfen.'],
    }}),
    mod({ id: 'b2', title: 'Fallschule – Ukemi-waza', duration: '8 min', description: 'Sicher fallen ist die wichtigste Skill im Judo.', ytVideoId: '_OcCMesYo1c', channel: 'Judo-im-Pott [de]', content: {
      intro: 'Bevor du wirfst, musst du fallen können. Ukemi rettet dir bei jedem Sturz – im Dojo und im Alltag.',
      keyPoints: [
        'Rückwärts: Kinn auf Brust, Hände schlagen die Matte.',
        'Seitlich: Bein anziehen, Hand schlägt die Matte.',
        'Vorwärts-Rolle: über die Schulter, nicht über den Kopf.',
        'Atem ausstoßen beim Aufschlag – schützt den Brustkorb.',
      ],
      safety: ['Niemals mit gestrecktem Arm fallen – Schulter geht kaputt.'],
    }}),
    mod({ id: 'b3', title: 'Die vier Grundhaltegriffe', duration: '8 min', description: 'Bodenarbeit für Anfänger.', ytVideoId: 'HCqGvmPZieg', channel: 'Judo-im-Pott [de]' }),
    mod({ id: 'b4', title: 'Dojo-Etikette & Judo-Tradition', duration: '8 min', description: 'Reigi – das, was Judo zu Judo macht.', content: {
      intro: 'Judo (柔道) heißt wörtlich "der sanfte Weg" und wurde 1882 von Jigorō Kanō begründet. Es ist nicht nur Sport, sondern auch Erziehungskonzept. Reigi (Etikette) ist Teil jeder Trainingseinheit und unterscheidet das Dojo vom Fitnessstudio.',
      keyPoints: [
        'Beim Betreten / Verlassen der Matte: Verbeugung (Rei) zum Shomen (Stirnwand).',
        'Vor und nach jeder Partnerübung: Verbeugung zum Partner – Augenkontakt halten.',
        'Beim Eintreffen Lehrer (Sensei) und höher Graduierte zuerst begrüßen.',
        'Pünktlich, sauberer Gi, kurze Fingernägel – Schutz für dich und Partner.',
        'Während der Erklärung: stillsitzen im Seiza oder Kreuzsitz, nicht herumlaufen.',
        'Im Notfall "Matte!" rufen – sofort wird das Training pausiert.',
      ],
      tips: [
        'Den Gi nach dem Training falten und sauber lagern – nicht in der Tasche knüllen.',
        'Höhergraduierte sind nicht "die Lehrer", aber respektvoll behandeln – sie waren auch mal Anfänger.',
      ],
      safety: ['Niemals Schmuck auf der Matte – Verletzungsgefahr für beide Partner.', 'Kein Training mit offenen Wunden – Hygiene-Risiko.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const karate: SportCurriculum = {
  sportId: 'karate',
  anfaenger: [
    mod({ id: 'b1', title: 'Karate-Basics – Stände', duration: '12 min', description: 'Die Grundstellungen aus dem Dojo.', ytVideoId: 'A1AzP5jqQGQ', channel: 'TG Neuss', content: {
      intro: 'Stände (Dachi-waza) sind das Fundament des Karate. Ein stabiler Stand erlaubt kraftvolle Techniken.',
      keyPoints: [
        'Zenkutsu-dachi: vorderer Stand, 60/40-Gewicht.',
        'Kiba-dachi: Reiterstand, breit und tief.',
        'Kokutsu-dachi: hinterer Stand, 70/30 nach hinten.',
        'Schultern entspannt, Hüfte aktiv.',
      ],
    }}),
    mod({ id: 'b2', title: 'Kihon – Fünf Grundtechniken', duration: '15 min', description: 'Mit Benni durch die Grundlagen.', ytVideoId: '0wQ1X3EdXvY', channel: 'Karate Dojo Sandokan', content: {
      keyPoints: [
        'Oi-zuki: gerader Stoß mit dem vorderen Arm.',
        'Gyaku-zuki: gerader Stoß aus der Hüfte (hinten).',
        'Mae-geri: Front-Kick aus dem Knie.',
        'Yoko-geri: Seitwärts-Tritt mit der Fußkante.',
        'Mawashi-geri: Rundkick.',
      ],
    }}),
    mod({ id: 'b3', title: 'Kata Heian Shodan', duration: '10 min', description: 'Die erste Kata für den Gelbgurt (8. Kyu, DKV).', ytVideoId: '03FqfhadiSo', channel: 'Kara-Fit', content: {
      intro: 'Kata sind festgelegte Bewegungsabläufe. Heian Shodan ist die erste, die jeder Karateka lernt – sie enthält alle Grundprinzipien.',
      keyPoints: [
        '21 Techniken in symmetrischer Form.',
        'Beginn und Ende am exakt gleichen Punkt.',
        'Atmung mit jedem Block und Stoß synchronisiert.',
        'Kiai (Kampfschrei) an zwei festgelegten Stellen.',
      ],
    }}),
    mod({ id: 'b4', title: 'Karate-Etikette & das Kyu-Dan-System', duration: '8 min', description: 'Reigi, Rang und Respekt im Dojo.', content: {
      intro: 'Karate (空手) bedeutet "leere Hand" – ohne Waffe. Es entstand auf Okinawa und kam in den 1920ern nach Japan. Was Karate vom reinen Kampfsport unterscheidet, ist die Geisteshaltung: Karate-do ist ein Weg (Do), der mit Etikette beginnt und endet.',
      keyPoints: [
        'Beim Betreten und Verlassen des Dojo: Verbeugung zum Shomen.',
        'Begrüßung und Verabschiedung im Seiza (Kniesitz) – mit Mokuso (Meditationsmoment).',
        'Vor und nach jeder Partnerübung: gegenseitige Verbeugung.',
        'Gürtelsystem (Kyu-Grade, absteigend von 9. Kyu/Weiß bis 1. Kyu/Braun).',
        'Dan-Grade (aufsteigend ab Shodan/1. Dan in Schwarz – mind. 10 Jahre Training für 5. Dan).',
        'Der Gürtel wird symbolisch nie gewaschen – er trägt den Schweiß des Trainings.',
      ],
      tips: [
        'Pünktlichkeit: 10 Minuten vor Trainingsbeginn da sein – das ist Standard, nicht "früh".',
        'Beim Verspäten: vor der Matte abwarten, bis der Sensei einwinkt.',
        'Während der Korrektur durch den Lehrer: aufmerksam zuhören, mit "Hai!" (Ja!) bestätigen.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const kickboxen: SportCurriculum = {
  sportId: 'kickboxen',
  anfaenger: [
    mod({ id: 'b1', title: 'Deckung und Kampfstellung', duration: '10 min', description: 'Kurs 1 – die Grundbasis.', ytVideoId: 'Sb2bSsNWfoM', channel: 'DieKickboxtrainer', content: {
      intro: 'Bevor du schlägst oder trittst, musst du stehen. Eine gute Kampfstellung schützt dich und gibt dir alle Optionen.',
      keyPoints: [
        'Schulterbreiter Stand, schwaches Bein vorne.',
        'Hände auf Wangenhöhe, Ellbogen am Körper.',
        'Kinn gesenkt, Blick gerade.',
        'Gewicht 50/50 – nicht nach vorne oder hinten lehnen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Front Kick lernen', duration: '8 min', description: 'Der einfachste und wirkungsvollste Kick.', ytVideoId: 'rkN3rQbYEdA', channel: 'Sascha Micheel', content: {
      intro: 'Der Front Kick (Mae-geri / Push Kick) ist die direkteste Tritttechnik – einfach zu lernen, schwer zu verteidigen.',
      keyPoints: [
        'Knie zuerst hochziehen, dann das Bein nach vorne strecken.',
        'Mit dem Fußballen oder der Sohle treffen.',
        'Hüfte vorne durchschieben für Power.',
        'Sofort zurückziehen – nicht stehenlassen.',
      ],
    }}),
    mod({ id: 'b3', title: 'Low Kick richtig & härter treten', duration: '7 min', description: 'Smolik zeigt die Technik vom Ring.', ytVideoId: 'Rm_6-TQHiu0', channel: 'Michael Smolik', content: {
      keyPoints: [
        'Mit dem Schienbein treffen, nicht mit dem Fuß.',
        'Hüfte rotiert mit – Power kommt von dort.',
        'Standbein-Ferse dreht 90° auswärts.',
        'Treffpunkt: Außenseite Oberschenkel.',
      ],
    }}),
    mod({ id: 'b4', title: 'Sparring-Tipps für Anfänger', duration: '8 min', description: 'Praxis-Tipps fürs erste Sparring.', ytVideoId: 'GLZV6hKYzic', channel: 'na- kangaroos', content: {
      intro: 'Sparring ist kein Kampf – es ist Training. Wer zu hart geht, verliert Sparringpartner und entwickelt sich nicht weiter.',
      keyPoints: [
        '"Light" heißt wirklich light – nicht 80 %.',
        'Tap-Out und "Stopp" sofort respektieren.',
        'Kein Sparring ohne Mundschutz und Tiefschutz.',
        'Nach dem Sparring: Faust auf Faust, kein Ego.',
      ],
      safety: ['Anfänger sollten erst nach 3+ Monaten Training ins Sparring.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const badminton: SportCurriculum = {
  sportId: 'badminton',
  anfaenger: [
    mod({ id: 'b1', title: 'Der Aufschlag im Badminton', duration: '6 min', description: 'Regelkonform und sicher aufschlagen.', ytVideoId: '_oJcI0GNWAY', channel: 'Landessportbund Nordrhein-Westfalen e.V.', content: {
      intro: 'Der Aufschlag ist der einzige Schlag, den du allein bestimmst. Korrekt ausgeführt – sonst Punkt für den Gegner.',
      keyPoints: [
        'Ball wird UNTER Hüfthöhe getroffen.',
        'Beide Füße bleiben am Boden während des Schlags.',
        'Diagonal in das Aufschlagfeld.',
        'Schlägerkopf zeigt nach unten zum Treffmoment.',
      ],
    }}),
    mod({ id: 'b2', title: 'Basics im Badminton', duration: '10 min', description: 'Klassisches Lehrvideo zu den Grundlagen.', ytVideoId: 'AhKBRh8Oxfs', channel: 'Spielstark', content: {
      keyPoints: [
        'Universalgriff: V zwischen Daumen und Zeigefinger zur Schlägerkante.',
        'Aktive Schlagbewegung aus dem Handgelenk.',
        'Nach jedem Schlag zurück zur Mitte.',
      ],
    }}),
    mod({ id: 'b3', title: 'Vorhand-Überkopf Clear', duration: '6 min', description: 'Der Schlag, der den Gegner ans Ende des Felds drückt.', ytVideoId: 'MmVUCWlnfJA', channel: 'Die Sportlehrer', content: {
      intro: 'Der Clear ist der wichtigste Defensiv- und Übergangsschlag im Badminton – er gibt dir Zeit und drückt den Gegner zurück.',
      keyPoints: [
        'Universalgriff, Schlägerkopf zeigt nach hinten oben.',
        'Treffpunkt deutlich über dem Kopf, leicht vor dem Körper.',
        'Schnelle Pronation des Unterarms beim Treffmoment.',
        'Durchschwung quer vor den Körper.',
      ],
    }}),
    mod({ id: 'b4', title: 'Badminton-Schläger kaufen', duration: '8 min', description: 'Worauf bei der Schlägerwahl achten?', ytVideoId: 'OgkSaZzbFGM', channel: 'Sport und Abenteuer', content: {
      intro: 'Anfänger brauchen kein Profi-Equipment – falsche Wahl bremst aber den Lernfortschritt aus.',
      keyPoints: [
        'Schläger: kopflastig (Power) oder grifflastig (Kontrolle) – Mittelweg ist Anfängerwahl.',
        '85–90 g Gewicht, Spannung 22–24 lbs für Einsteiger.',
        'Federbälle: Nylon-Federbälle robust für Training, Natur für Spiel.',
        'Hallenschuhe sind Pflicht – keine Outdoor-Sohle.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const tischtennis: SportCurriculum = {
  sportId: 'tischtennis',
  anfaenger: [
    mod({ id: 'b1', title: '4 Grundregeln für Anfänger', duration: '7 min', description: 'TT Helden erklären die Basics.', ytVideoId: 'AKgVDhjvBkk', channel: 'Tischtennis Helden', content: {
      intro: 'Tischtennis ist schnell und scheinbar einfach. Diese 4 Grundregeln verhindern die typischen Anfängerfehler.',
      keyPoints: [
        'Beinarbeit vor Schlag – nicht mit Arm hinterherlaufen.',
        'Schlägerkopf führt – Handgelenk locker.',
        'Mit dem Ball mitgehen, nicht gegen ihn schlagen.',
        'Zurück in Grundstellung nach JEDEM Schlag.',
      ],
    }}),
    mod({ id: 'b2', title: 'Grundschläge – Bewegungsablauf', duration: '6 min', description: 'Mit Slow-Motion-Analyse.', ytVideoId: 'pHeFwNFuK_Q', channel: 'sportunterricht', content: {
      keyPoints: [
        'Vorhand-Konter: Schläger schließt, vor dem Körper treffen.',
        'Rückhand-Konter: Ellbogen vor dem Körper.',
        'Ball auf höchster Höhe nehmen.',
      ],
    }}),
    mod({ id: 'b3', title: 'Aufschlag mit Schnitt lernen', duration: '8 min', description: 'Den ersten Trumpf richtig spielen.', ytVideoId: 'rMG-mOiWDlM', channel: "Let's play table tennis", content: {
      intro: 'Der Aufschlag ist im Tischtennis der wichtigste Schlag – nur hier hast du volle Kontrolle. Schnitt macht den Unterschied.',
      keyPoints: [
        'Unterschnitt: Schläger streift den Ball von oben nach unten.',
        'Oberschnitt (Topspin-Aufschlag): von unten nach oben.',
        'Seitschnitt: Schläger streift seitlich.',
        'Variation in der Position – nicht immer aus derselben Stelle servieren.',
      ],
      tips: ['Übe jeden Aufschlag 100× pro Woche solo am Tisch.'],
    }}),
    mod({ id: 'b4', title: 'Welchen Schläger für Einsteiger?', duration: '7 min', description: 'Konkrete Schläger-Empfehlung für Einsteiger.', ytVideoId: 'LbJoxfnaneQ', channel: 'smarTT', content: {
      intro: 'Der falsche Schläger blockiert deinen Fortschritt für Monate. Mit dem richtigen Setup lernst du deutlich schneller.',
      keyPoints: [
        'Holz: All-Round, nicht zu schnell, nicht zu langsam.',
        'Belag: Tempo 6–7, Spin 7–8, Kontrolle 8+.',
        'Griff: gerade (Standard) oder konkav (Schoner).',
        'Lieber 30 € investieren als 5 € Drogeriemarkt-Schläger.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const squash: SportCurriculum = {
  sportId: 'squash',
  anfaenger: [
    mod({ id: 'b1', title: 'Squash für Anfänger', duration: '8 min', description: 'Erste Stunde auf dem Court.', ytVideoId: 'qPTazNsmYGs', channel: 'Nico Haedicke', content: {
      intro: 'Squash ist hochintensiv und taktisch – die ersten Stunden entscheiden, ob du es richtig lernst oder dir Fehler einprägst.',
      keyPoints: [
        'T-Position halten – Zentrum des Courts.',
        'Schläger immer oben, Bereitschaft signalisieren.',
        'Ball nach dem Schlag aus dem Weg gehen.',
        'Auf den Bällen der Füße bleiben.',
      ],
    }}),
    mod({ id: 'b2', title: 'Squash-Regeln einfach erklärt', duration: '7 min', description: 'Einsteiger-Guide zu den Regeln.', ytVideoId: 'zFmDv0V1qKA', channel: 'Squash Factory Schengen-Lützebuerg asbl' }),
    mod({ id: 'b3', title: 'Der Drive (Longline) – wichtigster Schlag', duration: '9 min', description: 'Squashpoint zeigt den Schlag, der jeden Ballwechsel dominiert.', ytVideoId: 'fcRV7ObGFvE', channel: 'Squashpoint', content: {
      intro: 'Der Longline (Drive) ist der wichtigste Schlag im Squash. Er hält den Gegner in der hinteren Hälfte und gibt dir die T-Position.',
      keyPoints: [
        'Ball möglichst nah an der Seitenwand spielen.',
        'Hoch genug, dass er an der Vorderwand über der Tin landet.',
        'Tief in den Knien, Schlägerkopf parallel zum Boden.',
        'Ausschwung Richtung Wand, nicht zur Mitte.',
      ],
    }}),
    mod({ id: 'b4', title: 'Squash kurz erklärt', duration: '7 min', description: 'Sportarten-Podcast zum schnellen Verständnis.', ytVideoId: 'ZGBW6ghgJ8E', channel: 'SportsGraph', content: {
      intro: 'Squash spielt sich auf engstem Raum mit Hochgeschwindigkeitsbällen ab. Schutz und Etikette sind kein "Nice to have".',
      keyPoints: [
        'Schutzbrille ist für Anfänger faktisch Pflicht.',
        'Bei Sichtbehinderung Let spielen, nicht riskieren.',
        'Schläger nicht über Schulterhöhe schwingen, wenn Gegner zu nah.',
        'Schweißband am Handgelenk – nasser Griff = Schläger-Wurf-Gefahr.',
      ],
      safety: ['Schutzbrille kostet 20 € – Augenoperation 2.000 €.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const rudern: SportCurriculum = {
  sportId: 'rudern',
  anfaenger: [
    mod({ id: 'b1', title: 'Concept2 – So ruderst du richtig', duration: '10 min', description: 'Die offizielle Anleitung des Herstellers.', ytVideoId: 'GV5158xPxt8', channel: 'Concept2 Deutschland', content: {
      intro: 'Concept2 ist der weltweite Standard für Indoor-Rudern. Die Hersteller-Anleitung ist die beste Quelle für saubere Technik.',
      keyPoints: [
        'Vier Phasen: Auslage – Durchzug – Rücklage – Vorrollen.',
        '60 % Beine, 20 % Rumpf, 20 % Arme.',
        'Rücken neutral, nicht runden.',
        'Griff: locker, nicht verkrampft.',
      ],
    }}),
    mod({ id: 'b2', title: 'Step-by-Step mit Olympioniken Lars', duration: '9 min', description: 'Rudertechnik für Anfänger.', ytVideoId: 'okS40vuruF8', channel: 'Augletics Rudergeräte' }),
    mod({ id: 'b3', title: 'Schlagfrequenz richtig wählen', duration: '8 min', description: 'Effizienter trainieren durch passende Frequenz.', ytVideoId: 'q9WcXpIcajA', channel: 'Ruderathlet', content: {
      intro: 'Hohe Schlagzahl ≠ schnelles Rudern. Effizienz kommt aus der richtigen Frequenz für dein Ziel.',
      keyPoints: [
        'Grundlagen-Ausdauer: 18–22 SPM.',
        'Schwellentempo: 24–28 SPM.',
        'Sprints: 30+ SPM.',
        'Drag-Faktor (Widerstand) anpassen, nicht nur Frequenz.',
      ],
    }}),
    mod({ id: 'b4', title: 'Core-Übungen auf dem Rudergerät', duration: '8 min', description: 'Vier effektive Übungen für einen starken Core.', ytVideoId: 'yQQNXdq2sYI', channel: 'FlowRow', content: {
      intro: 'Rudern belastet den unteren Rücken stark. Wer keinen starken Core hat, riskiert Bandscheibenprobleme.',
      keyPoints: [
        'Hyperextensions: 3 × 12 Wdh., 2× pro Woche.',
        'Plank: 3 × 60 Sek.',
        'Bird-Dog: Stabilität in der Wirbelsäule.',
        'Mobility für die Hüfte – schiefe Hüfte = schiefer Rücken.',
      ],
      safety: ['Bei Rückenschmerzen pausieren – nicht "durchziehen".'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const segeln: SportCurriculum = {
  sportId: 'segeln',
  anfaenger: [
    mod({ id: 'b1', title: 'Segeln lernen – die ersten Stunden an Bord', duration: '13 min', description: 'Aus der Segelschule Stella Maris in Kiel.', ytVideoId: 'vdy7_KEahcw', channel: 'moinmoinkiel', content: {
      intro: 'Segeln ist ein Lebensgefühl – aber auch ein Handwerk. Die ersten Stunden an Bord legen das Fundament für alle späteren Törns.',
      keyPoints: [
        'Wind erkennen – Augen (Wasseroberfläche), Verklicker, Telltales.',
        'Halsen vs. Wenden verstehen.',
        'Großschot kontrolliert, nicht klemmen.',
        'Niemals ohne Sicherheitsweste an Deck.',
      ],
    }}),
    mod({ id: 'b2', title: '9 Knoten in 10 Minuten', duration: '10 min', description: 'Die wichtigsten Knoten für SBF und Alltag.', ytVideoId: 'T0B1EhOLPEM', channel: 'Sunshine Sailing', content: {
      keyPoints: [
        'Palstek – der wichtigste Knoten überhaupt.',
        'Achtknoten – als Stopper.',
        'Webleinenstek – am Pfahl.',
        'Kreuzknoten – zwei gleiche Leinen verbinden.',
      ],
    }}),
    mod({ id: 'b3', title: 'Wende, Halse, Schiften, Q-Wende', duration: '12 min', description: 'Segelmanöver in Theorie und Praxis.', ytVideoId: 'O_fzzBcJUe8', channel: 'sail.ch_wassersport', content: {
      intro: 'Wende und Halse sind die zwei Grundmanöver, um die Windrichtung zu wechseln. Wer sie sauber beherrscht, navigiert sicher überall.',
      keyPoints: [
        'Wende: Bug durch den Wind – sicheres Manöver.',
        'Halse: Heck durch den Wind – beim Vorwindkurs.',
        '"Klar zur Wende!" – Crew vorwarnen.',
        'Bei viel Wind: kurz nochmal anluven, dann wenden.',
      ],
      safety: ['Halse bei starkem Wind nur mit erfahrenem Skipper.'],
    }}),
    mod({ id: 'b4', title: 'Mann-über-Bord-Manöver', duration: '8 min', description: 'Grabner Sailing Academy zeigt das wichtigste Notfallmanöver.', ytVideoId: 'jgSSLDVOb0Q', channel: 'Grabner Boote', content: {
      intro: 'Auf dem Wasser bist du auf dich gestellt. Vorbereitung entscheidet, ob ein Törn entspannt oder dramatisch wird.',
      keyPoints: [
        'Schwimmweste immer, wenn nicht angeleint.',
        'Wetterbericht vor jedem Törn (Seewetterbericht des DWD).',
        'MOB-Manöver beherrschen, bevor Crew an Bord.',
        'Notfunkgerät und EPIRB griffbereit.',
      ],
      safety: ['Crew vor dem Ablegen einweisen: wo Westen, wo Notruf, wer Skipper.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const surfen: SportCurriculum = {
  sportId: 'surfen',
  anfaenger: [
    mod({ id: 'b1', title: 'Surf Pop-Up Training', duration: '7 min', description: 'Der Take-Off für alle Boardgrößen.', ytVideoId: 'UvlA7YQCguw', channel: 'POPUPMATIC', content: {
      intro: 'Der Pop-Up ist DIE Bewegung im Surfen. Wer ihn sauber kann, surft – wer ihn nicht kann, fällt nur.',
      keyPoints: [
        'Bauch flach am Brett, Blick nach vorne.',
        'Hände unter Brusthöhe – nicht weiter hinten.',
        'In einer Bewegung hoch (kein Knien zwischendurch).',
        'Erst Vorderbein, Hinterbein folgt automatisch.',
        'Tief in den Knien stehen – nicht aufrichten.',
      ],
      tips: ['100 Pop-Ups pro Tag an Land (Yoga-Matte) trainieren.'],
    }}),
    mod({ id: 'b2', title: 'Takeoff-Tutorial', duration: '6 min', description: 'AllYouCanSurf zeigt die Schritte.', ytVideoId: 'MUJ1iOIngCo', channel: 'AllYouCanSurf' }),
    mod({ id: 'b3', title: 'Wellen surfen für Anfänger', duration: '8 min', description: '5 Tipps für die ersten Wellen.', ytVideoId: 'XtwjtH2y0G4', channel: 'Kanuschule Versam', content: {
      intro: 'Wellen lesen ist die Skill, die Anfänger von Fortgeschrittenen trennt. Wer die richtige Welle wählt, surft mehr und stürzt weniger.',
      keyPoints: [
        'Whitewater (Schaum): perfekt für die ersten Wochen.',
        'Peak-Point: die Stelle, wo die Welle bricht.',
        'Sets kommen alle 7–10 Minuten – warten lohnt sich.',
        'Niemals direkt vor brechende Wellen paddeln.',
      ],
    }}),
    mod({ id: 'b4', title: 'Wenn das Meer gefährlich wird', duration: '9 min', description: 'Terra X plus über lebensgefährliche Strömungen.', ytVideoId: '_eu6Ycw9uhs', channel: 'Terra X plus', content: {
      intro: 'Das Meer ist mächtig und gleichgültig. Wer ohne Wissen ins Wasser geht, riskiert Leben.',
      safety: [
        'Niemals allein in unbekanntem Spot.',
        'Rip-Current: parallel zur Küste schwimmen, NICHT gegen die Strömung.',
        'Vorfahrt: wer näher am Peak ist, hat sie.',
        'Local Knowledge: vor dem Paddeln Locals fragen.',
        'Bei Erschöpfung: aufs Board legen, nicht panisch werden.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const crossfit: SportCurriculum = {
  sportId: 'crossfit',
  anfaenger: [
    mod({ id: 'b1', title: 'CrossFit – Einsteiger-Guide', duration: '11 min', description: 'Was steckt hinter dem "härtesten Workout der Welt"?', ytVideoId: 'VAt2RhSU0xQ', channel: 'Filmproduktion LANIZMEDIA', content: {
      intro: 'CrossFit kombiniert Gewichtheben, Gymnastik und Cardio in kurzen, intensiven Einheiten (WODs). Vor dem ersten Workout solltest du verstehen, was dich erwartet.',
      keyPoints: [
        'WOD = "Workout of the Day", variiert täglich.',
        'Skalierung ist Pflicht: jede Übung hat eine Anfänger-Version.',
        'Bewegungsqualität vor Geschwindigkeit.',
        'Community ist Teil der Methodik.',
      ],
    }}),
    mod({ id: 'b2', title: 'Air Squat – Foundational Movement', duration: '6 min', description: 'Die wichtigste Bewegung im CrossFit.', ytVideoId: '9H825G4dgZk', channel: 'HEARTCORE Athletics', content: {
      intro: 'Der Air Squat ist die Mutter aller CrossFit-Bewegungen. Wer hier nicht sauber ist, hat in Front Squat, Thruster und Wall Ball Probleme.',
      keyPoints: [
        'Füße schulterbreit, Zehen leicht nach außen.',
        'Hüfte und Knie gleichzeitig beugen.',
        'Knie folgen den Zehenspitzen.',
        'Brust hoch, Rücken neutral.',
        'Bis mindestens parallel – Hüfte unter Knie.',
      ],
    }}),
    mod({ id: 'b3', title: 'CrossFit Home-Workout mit Hendrik Senf', duration: '20 min', description: 'Praxisbeispiel mit Profi-Trainer.', ytVideoId: '3q8tJc4TY7E', channel: 'FITBOOK' }),
    mod({ id: 'b4', title: 'Sicher in der CrossFit-Box', duration: '10 min', description: 'Coaches, Skalierung, On-Ramp – Anfängerleitfaden.', content: {
      intro: 'CrossFit hat den Ruf "verletzungsanfällig" zu sein – aber das stimmt nur für schlecht geführte Boxen. Eine gute Box bringt dich sicher durch jedes WOD. Das Wichtigste: lerne die Bewegungen sauber, bevor du sie unter Zeitdruck ausführst.',
      keyPoints: [
        'On-Ramp / Foundation-Kurs (2–4 Wochen) ist vor jedem offiziellen WOD Pflicht.',
        'Bewegungsqualität geht IMMER vor Geschwindigkeit oder Gewicht.',
        'Skalierung ist Standard – jede Übung hat eine angepasste Variante.',
        'Olympisches Heben (Snatch, Clean & Jerk) nur mit qualifizierter Anleitung.',
        'Bei stechenden Schmerzen oder Schwindel sofort aussetzen.',
        'Atmung im WOD: Pace finden, mit der du noch sprechen könntest.',
      ],
      tips: [
        'Bei einem neuen WOD: zuerst die Bewegung trocken üben, dann das Gewicht testen.',
        'Coaches sind dafür da, dich zu bremsen, nicht zu pushen – hör auf sie.',
        'In Klassen genau hinten oder vorne anstellen, je nach Sichtbarkeit – Spiegel hilft.',
      ],
      safety: [
        'Rhabdomyolyse (zerfallene Muskeln) ist eine reale Gefahr bei zu hartem Start – tritt bei dunkelbraunem Urin sofort zum Arzt.',
        'Niemals "Kipping Pull-Ups" ohne sauberen "Strict Pull-Up" davor lernen – Schulterprobleme drohen.',
        'Box-Jumps niemals erschöpft – Schienbeinverletzungen sind die häufigste CF-Verletzung.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const pilates: SportCurriculum = {
  sportId: 'pilates',
  anfaenger: [
    mod({ id: 'b1', title: 'Pilates für Anfänger – Bauch & Rumpf', duration: '15 min', description: '11 Pilates-Übungen kompakt erklärt.', ytVideoId: 'KaYi1UmZqNw', channel: 'Einfach besser leben', content: {
      intro: 'Pilates trainiert die "Powerhouse-Mitte" – Bauch, Rücken, Beckenboden. Die ersten Stunden bauen das Fundament für alles Weitere.',
      keyPoints: [
        'Zentrierung: Bauchnabel sanft nach innen.',
        'Lange Wirbelsäule – nicht runden.',
        'Atmung in den Brustkorb, breit zur Seite.',
        'Bewegungen langsam und kontrolliert.',
      ],
    }}),
    mod({ id: 'b2', title: 'Pilates Basic Workout', duration: '18 min', description: 'Die Grundlagen mit erfahrenem Coach.', ytVideoId: 'wUSnEtC3BhA', channel: 'HappyAndFitPilates' }),
    mod({ id: 'b3', title: 'The Hundred & Roll Up', duration: '12 min', description: 'Die ikonischen Pilates-Übungen.', ytVideoId: 'fp6KNETlTfM', channel: 'Lifeline.de', content: {
      intro: 'Hundred wärmt den ganzen Körper auf und trainiert Atmung. Roll Up ist die Königsdisziplin der Rumpfkraft.',
      keyPoints: [
        'Hundred: Beine in 45°, Arme pumpen 5× ein, 5× aus.',
        'Roll Up: aus dem Liegen segmentweise aufrollen – Wirbel für Wirbel.',
        'Atmung steuert die Bewegung – nicht andersherum.',
        'Lieber kleiner und sauber als groß und schlampig.',
      ],
    }}),
    mod({ id: 'b4', title: 'Roll Up – richtige Ausführung', duration: '7 min', description: 'Detail-Tutorial der DHfPG/BSA-Akademie.', ytVideoId: 'Dyum_-zLp74', channel: 'DHfPG/ BSA-Akademie', content: {
      keyPoints: [
        'Beine gestreckt am Boden, Füße flexed.',
        'Kinn zur Brust einleiten.',
        'Wirbel für Wirbel hoch – nicht aus Schwung.',
        'Genauso langsam wieder ablegen.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const wandern: SportCurriculum = {
  sportId: 'wandern',
  anfaenger: [
    mod({ id: 'b1', title: 'Die richtige Wanderausrüstung', duration: '10 min', description: 'Packliste, Schuhe, Rucksack.', ytVideoId: 'aSYbPlIWwTA', channel: 'marlenesleben', content: {
      intro: 'Mit der richtigen Ausrüstung wird jede Wanderung angenehmer – mit der falschen wird selbst die schönste Tour zur Tortur.',
      keyPoints: [
        'Schuhe einlaufen, niemals neu auf der ersten Tour.',
        '3-Schichten-Prinzip: Funktionsunterwäsche + Isolation + Wetterschutz.',
        'Rucksack richtig packen: Schweres nah am Rücken.',
        'Niemals Baumwolle als Unterwäsche – hält Schweiß.',
      ],
    }}),
    mod({ id: 'b2', title: 'Packliste für Tagestouren', duration: '8 min', description: 'Was wirklich in den Rucksack gehört.', ytVideoId: '8ydBuXcyNx4', channel: 'DraufssenUnterwegs' }),
    mod({ id: 'b3', title: 'Karte und Kompass lesen', duration: '14 min', description: 'Navigation ohne Smartphone-Abhängigkeit.', ytVideoId: 'hQ5_KMuxwJM', channel: 'Dom Wild', content: {
      intro: 'Smartphone und GPS sind großartig – bis der Akku leer ist oder kein Signal kommt. Karte und Kompass sind die Lebensversicherung jedes Wanderers.',
      keyPoints: [
        'Karte nach Norden ausrichten (Einnorden).',
        'Magnetisch Nord ≠ geographisch Nord – Missweisung beachten.',
        'Höhenlinien lesen: enger = steiler.',
        'Marschrichtung anpeilen: Kompass auf der Karte ausrichten, dann Pfeil verfolgen.',
      ],
    }}),
    mod({ id: 'b4', title: 'Notsituation am Berg – richtig handeln', duration: '10 min', description: 'ORTOVOX zeigt das Verhalten im alpinen Notfall.', ytVideoId: 'gyzQYbIWg2Y', channel: 'ORTOVOX', content: {
      intro: 'Berge verzeihen wenig. Wer in den Bergen unterwegs ist, plant für das Wetter und Szenarien.',
      keyPoints: [
        'Tourenplanung an Wetterbericht koppeln (Bergwetter Alpenverein).',
        'Notfallkontakt zuhause hinterlassen (Wo, mit wem, bis wann).',
        'Schwierigkeitsgrade kennen: SAC-Skala T1–T6.',
        'Genug Wasser (mind. 1,5 l für Tagestour) und Notnahrung.',
      ],
      safety: ['Notruf in den Bergen: 112 funktioniert europaweit, auch ohne Empfang über andere Netze.', 'Bei Gewitter: tiefer gehen, exponierte Stellen meiden.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const mountainbike: SportCurriculum = {
  sportId: 'mountainbike',
  anfaenger: [
    mod({ id: 'b1', title: '5 Fahrtechnik-Grundlagen MTB', duration: '11 min', description: 'Die wichtigsten Skills für Anfänger.', ytVideoId: '2j3BtDdbpvg', channel: 'Daniel Daya', content: {
      intro: 'MTB ist mehr als Fahrradfahren. Die richtigen Grundlagen entscheiden, ob du Spaß oder Stürze hast.',
      keyPoints: [
        'Grundposition: Pedale waagerecht, leichte Hocke.',
        'Blick weit nach vorne – wohin du schaust, fährst du.',
        'Bremsen: zwei Finger reichen, vor allem vorne dosieren.',
        'Sattelposition unten bei Abfahrten.',
        'Aktive Arme – Bike unter dir bewegen lassen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Grundposition auf dem Bike', duration: '7 min', description: 'BIKE Magazin erklärt die Basis.', ytVideoId: 'c-4LtoB94lU', channel: 'BIKE Magazin' }),
    mod({ id: 'b3', title: 'Bremstechnik richtig dosieren', duration: '9 min', description: 'Die wichtigste Skill auf dem Trail.', ytVideoId: 'kqNWcmBXXaA', channel: 'Ridingstyle', content: {
      intro: 'Falsch bremsen ist Verletzungsrisiko Nr. 1 im MTB. Die richtige Dosierung von Vorder- und Hinterbremse rettet Stürze.',
      keyPoints: [
        'Vorderbremse macht 70 % der Verzögerung – aber kontrolliert.',
        'Bremsen VOR der Kurve, nicht in der Kurve.',
        'Beim Bremsen Po nach hinten – nicht über den Lenker.',
        'Zwei Finger genügen für Disc-Bremsen.',
      ],
      safety: ['Niemals nur vorne voll ziehen – Überschlag droht.'],
    }}),
    mod({ id: 'b4', title: 'Protektoren von Kopf bis Fuß', duration: '11 min', description: 'Anfängerguide für Schutzausrüstung.', ytVideoId: 'wMzkmTIuLNk', channel: 'Mark Bartsch', content: {
      intro: 'Stürze gehören zum MTB. Mit der richtigen Schutzausrüstung sind sie meist harmlos.',
      keyPoints: [
        'Helm immer – idealerweise mit verlängertem Hinterkopfschutz.',
        'Handschuhe schützen bei Stürzen die Hände.',
        'Knie- und Ellbogenschoner für Trails ab S1.',
        'Trinkrucksack mit Pumpe, Schlauch, Multitool.',
      ],
      safety: ['Full-Face-Helm ab Schwierigkeit S2.', 'Sicht: helle, kontrastreiche Kleidung.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const ski: SportCurriculum = {
  sportId: 'ski',
  anfaenger: [
    mod({ id: 'b1', title: 'Vom Schneepflug zum parallelen Skifahren', duration: '8 min', description: '5 Schritte vom Anfänger zum sicheren Schwung.', ytVideoId: '474dkQ8vRy8', channel: 'Julian Witting Skiing', content: {
      intro: "Der Übergang vom Pflug zum parallelen Schwung ist die wichtigste Hürde im Ski-Anfänger-Leben. Mit dem richtigen Aufbau geht's in einer Woche.",
      keyPoints: [
        'Pflug: V-Stellung, Innenkanten greifen.',
        'Pflugbogen: Druck auf den Außenski.',
        'Schaufeln zusammen: paralleles Schwingen.',
        'Hände nach vorne, nicht nach hinten lehnen.',
        'Talski belasten – der ist der wichtige.',
      ],
    }}),
    mod({ id: 'b2', title: 'Bremsen im Pflug lernen', duration: '6 min', description: 'Sicher anhalten – die wichtigste Skill.', ytVideoId: 'INIqJPwBOtQ', channel: 'Marius Quast' }),
    mod({ id: 'b3', title: 'Parallelschwung – Tipps für Anfänger', duration: '8 min', description: 'Der erste parallele Schwung – Schritt für Schritt.', ytVideoId: 'LxhVgmWVdQs', channel: 'checkyeti', content: {
      intro: 'Der Parallelschwung ist die Königsdisziplin der Anfängerphase. Wer ihn kann, hat im Wesentlichen "Skifahren gelernt".',
      keyPoints: [
        'Schaufeln am Ende des Schwungs zusammenführen.',
        'Hüfte in Fahrtrichtung – nicht zurückbleiben.',
        'Talski mit der Schaufel zuerst belasten.',
        'Mit kurzen Schwüngen üben, dann verlängern.',
      ],
    }}),
    mod({ id: 'b4', title: 'Die 10 FIS-Regeln erklärt', duration: '8 min', description: 'Marius Quast erklärt die offiziellen Pistenregeln.', ytVideoId: 'U4KCSh9zuJM', channel: 'Marius Quast', content: {
      intro: 'Auf der Piste gelten klare Regeln – wie im Straßenverkehr. Sie schützen dich und alle anderen.',
      keyPoints: [
        'Rücksicht auf andere Skifahrer.',
        'Geschwindigkeit den Verhältnissen anpassen.',
        'Beim Anhalten: an den Pistenrand, nie auf engen Stellen.',
        'Bei Unfall: Hilfe leisten und Personalien austauschen.',
      ],
      safety: [
        'Helm immer.',
        'Bei Sturz nach oben sichern – Lawine an Skifahrern droht.',
        'Bei Schmerzen die Piste verlassen, nicht "weiterfahren".',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const snowboard: SportCurriculum = {
  sportId: 'snowboard',
  anfaenger: [
    mod({ id: 'b1', title: 'Das 1. Mal auf dem Snowboard', duration: '10 min', description: 'Die ersten Schritte sicher meistern.', ytVideoId: 'EZ-c4q80mRs', channel: 'Marius Quast', content: {
      intro: 'Der erste Tag auf dem Snowboard ist hart – aber wer durchhält, hat danach jahrelang Spaß. Marius zeigt dir, wie du sicher startest.',
      keyPoints: [
        'Goofy vs. Regular – führende Fußposition.',
        'Frontside (Zehen) und Backside (Fersen) Kante.',
        'Knie immer leicht gebeugt.',
        'Blick in Fahrtrichtung – nicht aufs Board.',
      ],
    }}),
    mod({ id: 'b2', title: '10 Snowboard-Anfänger-Tipps', duration: '12 min', description: 'Die ersten Tage meistern.', ytVideoId: 'bNTyzdnmHcw', channel: 'The Grey Rebel (Deutsch)' }),
    mod({ id: 'b3', title: 'Heelside & Toeside Schwung', duration: '10 min', description: 'Der Kantenwechsel ist der Schlüssel zum Fahren.', content: {
      intro: 'Snowboarden ist eigentlich ein ständiger Wechsel zwischen Heelside (Fersen) und Toeside (Zehen) Kante. Wer den Kantenwechsel beherrscht, fährt.',
      keyPoints: [
        'Heelside: Gewicht auf die Fersen, Zehen heben.',
        'Toeside: Gewicht auf die Zehen, Fersen heben.',
        'Bei der Kanten-Wechsel: Knie nutzen, nicht den ganzen Körper.',
        'Hände niedrig – Schultern nicht zur Hilfe nehmen.',
        'Blick immer in die Schwung-Richtung.',
      ],
      tips: ['Üben auf der grünen Piste – nicht zu früh blaue Pisten.'],
    }}),
    mod({ id: 'b4', title: 'Hinfallen und aufstehen', duration: '7 min', description: 'Sicher fallen und korrekt wieder aufstehen.', ytVideoId: '6BpzT10KP0U', channel: 'GER Knowboard - Die online Snowboardschule', content: {
      intro: 'Du wirst am ersten Tag 100× fallen. Das Wissen, wie du das ohne Verletzungen tust, macht den Unterschied.',
      keyPoints: [
        'Vorwärts: Knie und Hände nutzen, nicht volle Länge.',
        'Rückwärts: Kinn auf Brust, runder Rücken.',
        'Aufstehen Toeside: Knie unter den Körper.',
        'Aufstehen Heelside: Brett hochstellen, Hände hinter dem Körper drücken.',
      ],
      safety: ['Handgelenkschoner sind goldwert in den ersten Wochen.', 'Helm immer – auch auf der Anfängerpiste.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const eishockey: SportCurriculum = {
  sportId: 'eishockey',
  anfaenger: [
    mod({ id: 'b1', title: 'Schlittschuhlaufen für Anfänger', duration: '8 min', description: 'Tipps vom DEG-Profi.', ytVideoId: 'CmM9MpfLvb8', channel: 'Rheinische Post', content: {
      intro: 'Ohne Schlittschuhlaufen kein Eishockey. Die ersten Stunden auf dem Eis sind entscheidend für die spätere Spielqualität.',
      keyPoints: [
        'Knie tief, Oberkörper leicht nach vorne.',
        'Druck mit der Innenkante – nicht der ganzen Schiene.',
        'Bremsen: T-Stop oder Hockey-Stop.',
        'Beide Beine gleich oft trainieren.',
      ],
    }}),
    mod({ id: 'b2', title: 'Schlägerführung & Puck-Handling', duration: '8 min', description: 'Der Schläger als Verlängerung des Arms.', content: {
      intro: 'Pucks führen ohne hinzuschauen – das trennt Anfänger von Spielern. Stickhandling übt man am besten täglich.',
      keyPoints: [
        'Obere Hand am Knauf, untere Hand 30 cm darunter.',
        'Puck vor dem Körper, nicht seitlich.',
        'Handgelenk-Bewegung – nicht Arm.',
        'Blick nach oben, nicht auf den Puck.',
      ],
      tips: ['Daheim mit Tennisball oder Stickhandling-Ball trainieren.'],
    }}),
    mod({ id: 'b3', title: 'Slapshot – Schlagschuss lernen', duration: '9 min', description: 'Mit Ex-Profi Christian Ehrhoff.', ytVideoId: 'Qtt57OSQc9U', channel: 'owayo custom sports', content: {
      intro: 'Der Slapshot ist die Krone der Schusstechnik – kraftvoll, aber technisch anspruchsvoll. Ehrhoff zeigt dir die Schritte.',
      keyPoints: [
        'Schlägerblatt schlägt zuerst aufs Eis, ca. 10 cm hinter dem Puck.',
        'Flex (Biegung) des Schaftes nutzen – das ist die Power.',
        'Stand: Puck zwischen den Füßen, leicht vor dem hinteren Bein.',
        'Mit dem ganzen Körper drehen, nicht nur Arme.',
      ],
    }}),
    mod({ id: 'b4', title: 'Eishockey-Ausrüstung anziehen', duration: '12 min', description: 'owayo zeigt mit Christian Ehrhoff alle Teile.', ytVideoId: 'jLvZi-UpF8g', channel: 'owayo custom sports', content: {
      intro: 'Eishockey ist Vollkontakt-Sport mit Hochgeschwindigkeitspucks. Ohne komplette Ausrüstung kein Training.',
      keyPoints: [
        'Helm mit Gitter oder Visier – für Anfänger Gitter.',
        'Schulterschützer, Ellbogenschützer.',
        'Hose mit Schulternaht, Schienbeinschoner.',
        'Tiefschutz und Mundschutz – nicht verzichtbar.',
        'Handschuhe vom Puck angepasst.',
      ],
      safety: ['Niemals ohne komplette Schutzkleidung aufs Eis.', 'Schlittschuhe scharf halten – stumpf = Unfall.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const tanzen: SportCurriculum = {
  sportId: 'tanzen',
  anfaenger: [
    mod({ id: 'b1', title: '5 Hip-Hop Basic Steps', duration: '9 min', description: 'Die wichtigsten Moves in 9 Minuten.', ytVideoId: '0Os5Dd8BW_0', channel: 'Allmygolden', content: {
      intro: 'Hip-Hop ist die zugänglichste Tanzform – kein fester Partner, kein Studio nötig. Diese 5 Basics öffnen die Tür zu allem Weiteren.',
      keyPoints: [
        'Two-Step, Bounce, Cross-Step, Kick-Ball-Change, V-Step.',
        'Auf den Beat hören, nicht auf die Melodie.',
        'Knie locker, Brustkorb frei.',
        'Wiederholen, bis es automatisch sitzt.',
      ],
    }}),
    mod({ id: 'b2', title: 'Langsamer Walzer Grundschritt', duration: '7 min', description: 'Der Klassiker für Hochzeit & Ball.', ytVideoId: 'eX4Rrupk9jA', channel: 'Tanzstudio First Dance | Max & Rebecca', content: {
      intro: 'Der Langsame Walzer ist der bekannteste Standardtanz. Mit dem Grundschritt bist du auf jedem Fest tanzfähig.',
      keyPoints: [
        'Drei-Schritt-Rhythmus: stark – schwach – schwach.',
        'Vorwärts (Herr): Linker Fuß rechts diagonal vor.',
        'Rückwärts (Dame): spiegelbildlich.',
        'Aufstehen auf "1", senken auf "2-3".',
      ],
    }}),
    mod({ id: 'b3', title: 'Grundhaltung & Rhythmusgefühl', duration: '8 min', description: 'Körperspannung und Timing.', content: {
      intro: 'Tanzen ist 50 % Schritte und 50 % Haltung. Wer die Grundhaltung beherrscht, sieht in jedem Tanz gut aus.',
      keyPoints: [
        'Brustkorb hoch, Schultern entspannt nach unten/hinten.',
        'Bauch leicht angespannt für Stabilität.',
        'Kopf aufrecht, Blick über die Schulter des Partners.',
        'Rhythmus erst klatschen, dann tanzen.',
      ],
      tips: ['Vor dem Tanzen 5 Min nur zur Musik wippen – das schult Timing.'],
    }}),
    mod({ id: 'b4', title: 'Latein vs. Standard – der Unterschied', duration: '8 min', description: 'Hobbytanzgeflüster zeigt die Fußarbeit beider Stile.', ytVideoId: '6jUVQKmsjNs', channel: 'Hobbytanzgeflüster', content: {
      intro: 'Es gibt dutzende Tanzstile – manche brauchen einen Partner, andere nicht. Hier ein Überblick zur Orientierung.',
      keyPoints: [
        'Standard: Walzer, Tango, Foxtrott, Wiener Walzer, Quickstep.',
        'Latein: Cha-Cha, Samba, Rumba, Paso Doble, Jive.',
        'Hip-Hop: Solo, urban, ohne Partner.',
        'Contemporary: ausdrucksstark, Tanztheater.',
        'Salsa: Paartanz, schnell, aus Kuba.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const parkour: SportCurriculum = {
  sportId: 'parkour',
  anfaenger: [
    mod({ id: 'b1', title: 'Sicher landen und abrollen', duration: '9 min', description: 'Die wichtigste Skill in Parkour.', ytVideoId: 'qVGHfEMChYw', channel: 'Freerunning Factory', content: {
      intro: 'Im Parkour fällst du oft – und genau dafür musst du trainiert sein. Die Rolle (Roll) ist die zentrale Skill.',
      keyPoints: [
        'Beine federn, niemals steif landen.',
        'Rolle über die Diagonale (Schulter zur gegenüberliegenden Hüfte).',
        'Aus dem Sprung in die Rolle ohne Pause.',
        'Niemals direkt über den Kopf rollen.',
      ],
      safety: ['Erst auf Matten, dann auf Gras, dann auf hartem Untergrund.'],
    }}),
    mod({ id: 'b2', title: 'Parkour-Abrollen Tutorial', duration: '7 min', description: 'Detail-Tutorial von urbanamadei.', ytVideoId: 'aeVoHp2jccw', channel: 'urbanamadei' }),
    mod({ id: 'b3', title: 'Präzisionssprung lernen', duration: '8 min', description: 'Genau auf einen Punkt landen.', ytVideoId: 'oQuaHt2Eu30', channel: 'urbanamadei', content: {
      intro: 'Der Präzisionssprung ist die Grundtechnik im Parkour: vom Punkt A zum Punkt B mit exakter Landung. Ohne ihn keine Stadt-Bewegung.',
      keyPoints: [
        'Anlauf: 1–3 Schritte reichen meist.',
        'Absprung mit beiden Beinen gleichzeitig.',
        'Arme schwingen mit – Schwung und Balance.',
        'Landung auf den Fußballen, Knie federn.',
        'Hocke kurz bleiben, nicht "stehen lassen".',
      ],
    }}),
    mod({ id: 'b4', title: 'Parkour-Spots finden', duration: '7 min', description: 'urbanamadei erklärt, wie du gute Trainings-Spots erkennst.', ytVideoId: '_cdsmkyb3T8', channel: 'urbanamadei', content: {
      intro: 'Parkour ist nur so sicher wie der gewählte Spot. Vor jedem Sprung gilt: erst denken, dann springen.',
      keyPoints: [
        'Untergrund prüfen – nass, glatt, locker?',
        'Sichtlinien checken – kommen Passanten?',
        'Sprung mental durchgehen, dann physisch testen.',
        'Niemals erschöpft springen.',
      ],
      safety: [
        'Niemals auf nasse oder vereiste Untergründe.',
        'Spot vor dem Sprung physisch testen.',
        'Im Zweifel: nicht springen, langsamer Weg ist auch ein Weg.',
      ],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const reiten: SportCurriculum = {
  sportId: 'reiten',
  anfaenger: [
    mod({ id: 'b1', title: 'Richtig auf dem Pferd sitzen', duration: '9 min', description: 'Loesdau Lessons – Basics mit Kati.', ytVideoId: 'PvjqjCJknuU', channel: 'Pferdesporthaus Loesdau', content: {
      intro: 'Der Sitz ist im Reiten alles. Eine schlechte Sitzposition lähmt das Pferd, ein guter Sitz lässt es laufen.',
      keyPoints: [
        'Ohr, Schulter, Hüfte, Ferse auf einer Linie.',
        'Becken aufrecht – nicht "stuhl-sitzen", nicht reiten wie aufs Sofa.',
        'Hände leicht, Daumen oben, Fäuste nach innen gedreht.',
        'Schultern entspannt zurück, Brust offen.',
      ],
    }}),
    mod({ id: 'b2', title: 'Sitzfehler beim Reiten', duration: '10 min', description: 'Folge 1: Grundlagen und Sattel.', ytVideoId: 'gURTenPfjrA', channel: 'Mindset Sport - Reiten' }),
    mod({ id: 'b3', title: 'Reiten für Anfänger – Trab und Leichttrab', duration: '12 min', description: 'Die wichtigste Gangart richtig sitzen.', ytVideoId: 'SCEpNGd5POk', channel: 'Klaras Welt', content: {
      intro: 'Der Trab ist die anstrengendste Gangart für den Anfänger – aber sobald du Leichttraben kannst, wird Reiten plötzlich entspannt.',
      keyPoints: [
        'Leichttraben: bei jedem zweiten Hufschlag aus dem Sattel heben.',
        'Aus den Knien arbeiten, nicht aus dem Rücken.',
        'Rhythmus über die Schulter des Pferdes finden.',
        'Aussitzen Trab: erst, wenn das Becken locker mitschwingt.',
      ],
    }}),
    mod({ id: 'b4', title: 'Das Pferd pflegen und putzen', duration: '10 min', description: 'Loesdau Lessons – Basics mit Kati Teil 1.', ytVideoId: 'qbAllBFG0Q4', channel: 'Pferdesporthaus Loesdau', content: {
      intro: 'Reiten beginnt nicht im Sattel, sondern auf dem Stallgang. Wer das Pferd respektvoll pflegt, baut Vertrauen – die Basis für gutes Reiten.',
      keyPoints: [
        'Pferd vor dem Reiten gründlich putzen – Striegel, Kardätsche, Mähnenkamm.',
        'Hufe auskratzen – vor und nach dem Reiten.',
        'Sattel- und Trensenlage prüfen.',
        'Beim Hochsteigen ruhig sprechen – Pferde sind Fluchttiere.',
      ],
      safety: ['Niemals von hinten ans Pferd herangehen.', 'Helm und feste Stiefel sind Pflicht.'],
    }}),
  ],
  fortgeschritten: genericIntermediate,
  profi: standardProfi,
};

const golf: SportCurriculum = {
  sportId: 'golf',
  anfaenger: [
    mod({ id: 'b1', title: '5 Golfschwung-Grundlagen', duration: '10 min', description: 'Die Basis für jeden Anfänger.', ytVideoId: 'k94N8LvVoqQ', channel: 'Vaughan spielt den Platz', content: {
      intro: 'Golf wirkt einfach – ist es aber nicht. Diese 5 Grundlagen entscheiden, ob du in 3 Monaten Spaß hast oder 3 Jahre frustriert bist.',
      keyPoints: [
        'Griff: Daumen führen, V zur rechten Schulter (Rechtshänder).',
        'Stand: schulterbreit, leicht in den Knien.',
        'Schwung-Tempo gleichmäßig – nicht abrupt.',
        'Treffmoment: Hände vor dem Ball.',
        'Vollendung: Brust zeigt zum Ziel.',
      ],
    }}),
    mod({ id: 'b2', title: 'Der Golfschwung – Griff, Setup, Schwung', duration: '13 min', description: 'Florian Raggl erklärt alles von Grund auf.', ytVideoId: 'iTpdmMOwuUY', channel: 'Florian Raggl Golf', content: {
      keyPoints: [
        'Setup ist 80 % des Schwungs.',
        'Ballposition variiert je nach Schläger.',
        'Schultern und Hüfte stehen parallel zur Ziellinie.',
        'Rotation um die Wirbelsäule, nicht Verschiebung.',
      ],
    }}),
    mod({ id: 'b3', title: 'Gerade Putten – Technik-Basics', duration: '8 min', description: 'Putt-Grundlagen für Anfänger.', ytVideoId: 'VMBqHXYalis', channel: 'GOLFSTUN.DE - Golf-Training und -Übungen', content: {
      intro: 'Putten macht 40 % aller Schläge auf einer Runde aus. Wer hier sauber ist, spart die Hälfte aller Strokes.',
      keyPoints: [
        'Augen direkt über dem Ball – nicht innen, nicht außen.',
        'Schultern bewegen den Putter, nicht Hände.',
        'Pendelbewegung: gleichmäßig zurück und durch.',
        'Distanz wichtiger als Linie – zu kurz ist immer schlechter.',
      ],
    }}),
    mod({ id: 'b4', title: 'Etikette auf dem Golfplatz', duration: '8 min', description: 'PGA-Pro Patrick Limbecker erklärt die Spielregeln im Umgang.', ytVideoId: 'liDL2inpR9g', channel: 'PGA Patrick Limbecker | PL Performance', content: {
      intro: 'Golf ist ein Sport mit ungeschriebenen Regeln. Wer die Etikette kennt, ist gern gesehen – wer sie ignoriert, wird gemieden.',
      keyPoints: [
        'Schnelles Spiel: bereit sein, wenn du dran bist.',
        'Pitchmarks auf dem Grün ausbessern.',
        'Bunker glatt rechen, Spuren entfernen.',
        'Niemals reden, wenn jemand schlägt.',
        'Auf dem Platz still gehen, nicht laufen.',
      ],
    }}),
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
  anfaenger: [],
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

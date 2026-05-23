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
  profi: [
    mod({ id: 'p1', title: 'Spielintelligenz – 3 gegen 1', duration: '15 min', description: 'Horst Wein zur Wahrnehmungsschulung im Profibereich.', ytVideoId: '5CDd2r5umww', channel: 'IFJ96', content: {
      intro: 'Auf Profiniveau entscheidet Spielintelligenz, nicht Athletik allein. Die Wahrnehmung des Raumes, das Antizipieren der Bewegung des Mitspielers und das Lösen von Über- und Unterzahlsituationen sind die Skills, die Top-Spieler von Bundesligaspielern unterscheiden.',
      keyPoints: [
        '3-gegen-1-Spielformen schulen Entscheidungsgeschwindigkeit.',
        'Vor dem Pass: Blick über die Schulter, Optionen scannen.',
        'Pass mit Tempo passend zur Aktion danach.',
        'Antizipation: wo läuft der Mitspieler hin, wo die Lücke?',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Match- und Gegneranalyse', duration: '20 min', description: 'Video-Studium auf Profiniveau.', content: {
      intro: 'Im modernen Profifußball werden vor jedem Spiel 4–8 Stunden Videomaterial des Gegners studiert. Wer das auch im Amateurbereich macht, hat einen Vorteil.',
      keyPoints: [
        'Eigene Spiele aufzeichnen – Smartphone reicht.',
        'Pattern erkennen: wo steht der Gegner bei Standards?',
        'Schwächen identifizieren: wer ist langsam, wer übermotiviert?',
        'Mit Trainer und Mannschaft besprechen.',
      ],
    }}),
  ],
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
  profi: [
    mod({ id: 'p1', title: 'Wurftraining mit Lucca Staiger', duration: '10 min', description: '1x1SPORT mit einem Bundesligaspieler.', ytVideoId: 'bjJi_5L2sAU', channel: '1x1SPORT', content: {
      intro: 'Auf Profiniveau wird der Wurf bis ins kleinste Detail trainiert. Lucca Staiger (Bundesliga, Nationalspieler) zeigt Drills, die jedes Wurfniveau verbessern.',
      keyPoints: [
        '500–1000 Würfe pro Trainingssession – wiederholbare Form.',
        'Form Shooting aus 1 m Abstand vor Distanzwürfen.',
        'Game-Speed-Drills: Würfe mit Tempo und unter Druck.',
        'Off-Hand entwickeln: schwächere Hand mind. 20 % der Würfe.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Spielanalyse & Coaching', duration: '20 min', description: 'Vom Spieler zum Spielmacher.', content: {
      keyPoints: [
        'NBA-Spiele studieren: warum funktioniert eine Aktion?',
        'Eigene Spielsequenzen aufnehmen und ehrlich bewerten.',
        'Pick-and-Roll-Optionen lesen lernen.',
        'Coaching anderer macht dich selbst besser.',
      ],
    }}),
  ],
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
  profi: [
    mod({ id: 'p1', title: 'Powerlifting-Spezialisierung', duration: '20 min', description: 'Maximalkraft systematisch entwickeln.', content: {
      intro: 'Powerlifting ist die kompetitive Spezialisierung des Krafttrainings: Kniebeuge, Bankdrücken, Kreuzheben jeweils auf 1 Wiederholung mit maximalem Gewicht.',
      keyPoints: [
        '1RM-Training: 80–95 % der Maximalkraft.',
        'Drei Hauptlifts plus Hilfsübungen – nicht mehr.',
        'Cycle-System: 4 Wochen Volumen, 3 Wochen Intensität, 1 Woche Deload.',
        'Wettkampf-Equipment: Knee Sleeves, Wrist Wraps, Lifting Belt.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Coaching: Form-Checks geben', duration: '15 min', description: 'Wie du Bewegung analysierst und cuest.', content: {
      keyPoints: [
        'Frontansicht für Symmetrie, Seitenansicht für Bewegungsbahn.',
        'Cues kurz und konkret ("Brust raus", nicht "achte auf deine Haltung").',
        'Video-Aufnahmen aus mehreren Winkeln nutzen.',
        'Erst loben, dann korrigieren, dann erneut loben.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Vorhand-Topspin verbessern', duration: '10 min', description: 'In 3 Schritten zu mehr Spin und Kontrolle.', ytVideoId: 'odJxC0Nyx_I', channel: 'MeinTennisGame - Online Tennis Training', content: {
      intro: 'Topspin trennt Anfänger vom fortgeschrittenen Spieler. Drei Anpassungen entscheiden, ob der Ball flach segelt oder mit Bogen und Kontrolle landet.',
      keyPoints: [
        'Schlägerkopf tiefer als die Ballposition – von unten nach oben schlagen.',
        'Schnelle Pronation der Schlaghand am Treffmoment.',
        'Hüftrotation als Power-Quelle – nicht der Arm.',
        'Durchschwung über die andere Schulter, Schwungbahn lang.',
      ],
    }}),
    mod({ id: 'i2', title: 'Slice und Volleys', duration: '15 min', description: 'Rückhand-Slice Grundlagen plus Netzschläge.', ytVideoId: 'C5h10u-6CPo', channel: 'MeinTennisGame - Online Tennis Training', content: {
      keyPoints: [
        'Slice: Schlägerkopf öffnet, Schwung von oben nach unten – flacher, schwer zu retournieren.',
        'Vorhand-Volley: Schläger fixiert, kurzer Schwung, Treffpunkt vor dem Körper.',
        'Rückhand-Volley: Schulter zum Netz, kompakter Schwung.',
        'Volley-Schritt: Splitstep, dann Vorwärtsschritt mit dem Außenfuß.',
      ],
    }}),
    mod({ id: 'i3', title: 'Match-Taktik gegen verschiedene Gegner', duration: '12 min', description: 'Spielanalyse und Anpassung.', content: {
      keyPoints: [
        'Gegen Topspin-Spieler: tief und mit Slice spielen, Tempo brechen.',
        'Gegen Slicer: hohe Bälle aufnehmen, sofort drücken.',
        'Gegen Aggressive: sicher anspielen, Fehler erzwingen.',
        'Bei zwei verlorenen Spielen am Stück: Taktik wechseln.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Tennis', duration: '20 min', description: 'Sprintkraft, Beweglichkeit, Stabilität.', content: {
      keyPoints: [
        'Sprint-Intervalle (10 × 20 m) 2× pro Woche.',
        'Plyometrik für Sprung und Antritt.',
        'Mobility für Schulter und Hüfte.',
        'Rumpfkraft (Plank-Variationen, Dead Bug, Bird Dog).',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Pronation – die Geheimwaffe des Aufschlags', duration: '12 min', description: 'Sven Bendlin zum entscheidenden Profi-Detail.', ytVideoId: 'k5Xe3AN89ac', channel: 'Tenniswelt von Sven Bendlin', content: {
      intro: 'Die Pronation des Unterarms am Treffmoment trennt 180-km/h-Aufschläge von 220-km/h-Aufschlägen. Profis nutzen sie unbewusst – Hobby-Spieler oft gar nicht.',
      keyPoints: [
        'Schlägerkopf rotiert nach innen am Treffmoment.',
        'Kontinentalgriff erlaubt die volle Pronation.',
        'Kein bewusstes "Schwingen" – Bewegung ist explosiv und kurz.',
        'Übung: Aufschlag in der Bewegung gegen die Wand.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Match-Analyse & Ranking-Aufstieg', duration: '15 min', description: 'Vom Hobby zum LK-Spieler.', content: {
      keyPoints: [
        'Eigene Spiele aufzeichnen – Erkenntnisse sind brutal ehrlich.',
        'LK-System verstehen (Leistungsklasse 1–25).',
        'Wettkampf-Erfahrung sammeln: lokale Turniere, dann Verbandsserien.',
        'Trainingsplan mit Coach – Selbstcoaching limitiert.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Rückenschwimmen mit Toni Embacher', duration: '8 min', description: 'Die rückenschonendste Lage richtig lernen.', ytVideoId: 'Gd4riUvx7hc', channel: 'FITBOOK', content: {
      intro: 'Rückenschwimmen ist die wirbelsäulenschonendste Lage – und gleichzeitig eine, die viele schief schwimmen. Ex-Profi Toni Embacher zeigt dir die Bausteine.',
      keyPoints: [
        'Hüfte hoch – die Körperlinie muss horizontal liegen.',
        'Beinschlag aus der Hüfte, Knie nur leicht beugen.',
        'Armzug: gestreckter Eintauch, S-förmiger Zug.',
        'Kopf ruhig, Blick zur Decke.',
      ],
    }}),
    mod({ id: 'i2', title: 'Kraulen effizienter machen', duration: '12 min', description: 'Wasserlage und Rotation perfektionieren.', ytVideoId: 'cOUXc07s9M0', channel: 'JORGE - SPORTS & TRAVEL', content: {
      keyPoints: [
        'Rotation aus der Hüfte (45°) – Schultern folgen.',
        'Catch-Up-Übung: ein Arm wartet, bis der andere ankommt.',
        'Atmung beidseitig (3er-Rhythmus) für Balance.',
        'Pull-Buoy zwischen den Beinen für Armarbeit-Fokus.',
      ],
    }}),
    mod({ id: 'i3', title: 'Wechsel zwischen Lagen üben', duration: '15 min', description: 'Lagenschwimmen aufbauen.', content: {
      keyPoints: [
        'Reihenfolge im Wettkampf: Schmetterling → Rücken → Brust → Kraul.',
        'Wendetechnik üben: Rollwende für Kraul/Rücken, Schwimmwende für Brust/Schmetterling.',
        'Übergänge sauber – nicht antäuschen.',
      ],
    }}),
    mod({ id: 'i4', title: 'Schwimm-Trainingsplan strukturieren', duration: '14 min', description: 'Konditions-Aufbau im Wasser.', content: {
      keyPoints: [
        'Aufwärmen: 400 m locker mit Wechsel.',
        'Hauptteil: 6–10 × 100 m mit 20–30 s Pause.',
        'Technik-Drills (Pull-Buoy, Paddles) 1× pro Woche.',
        'Cool-down: 200 m sehr locker, Streckendehnung.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Delfinschwimmen mit Toni Embacher', duration: '8 min', description: 'Die anspruchsvollste Schwimmlage – mit 6-fachem deutschen Meister.', ytVideoId: 'LHUr7bklKeQ', channel: 'FITBOOK', content: {
      intro: 'Schmetterling (Delfin) ist die anstrengendste und technisch anspruchsvollste Lage. Auf Profiniveau geht es um maximalen Vortrieb mit minimalem Widerstand.',
      keyPoints: [
        'Wellenbewegung kommt aus der Hüfte, nicht aus den Schultern.',
        'Armzug: parallel, kraftvolle Druckphase.',
        'Atmung jeden zweiten Zyklus – seltener atmen = schneller.',
        'Beinschlag synchron, zwei Schläge pro Armzyklus.',
      ],
      safety: ['Ohne saubere Technik: Schultern und unterer Rücken leiden – nur mit Coach an Volumen steigern.'],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Wettkampf-Vorbereitung', duration: '15 min', description: 'Tapering und Renntag-Routine.', content: {
      keyPoints: [
        'Tapering: 2 Wochen vor Wettkampf Volumen senken, Intensität halten.',
        'Wendetechnik perfektionieren – 0,3 s pro Wende über 8 Wenden = 2,4 s.',
        'Renntag: Frühstück 3 h vorher, Aufwärmen 45 Min vor Start.',
        'Visualisierung des Rennens am Vorabend.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Vorstieg im Klettergarten', duration: '13 min', description: 'Vom Toprope zum Lead Climbing – sicher in den Vorstieg.', ytVideoId: '5M2oAKINaBg', channel: 'Transa', content: {
      intro: 'Vorstieg ist der entscheidende Schritt vom Hobby- zum echten Kletterer. Du musst nicht nur klettern, sondern auch klippen, fallen, und beim Sichern dynamisch arbeiten.',
      keyPoints: [
        'Partner-Check VOR jedem Klettern: Knoten, Karabiner, Sicherungsgerät.',
        'Sauberes Klippen: kurze Bewegung, Seil von hinten nach vorne.',
        'Dynamisches Sichern: aktiv mitspringen beim Sturz, weiches Halten.',
        'Erste Vorstieg-Stürze unter kontrollierten Bedingungen üben.',
      ],
      safety: ['Niemals mit Halbmastwurf im Vorstieg sichern – Tube/Grigri obligatorisch.', 'Backclipping vermeiden – Seil wird sonst beim Sturz aufgeschnitten.'],
    }}),
    mod({ id: 'i2', title: 'Heel Hook richtig legen', duration: '10 min', description: 'Grundkurs Bouldern – Heel Hook, Drop Knee, Dyno.', ytVideoId: 'qeo9tR6iv4I', channel: 'Grundkurs Bouldern', content: {
      keyPoints: [
        'Drop Knee: Knie nach innen drehen, Hüfte zur Wand pressen – riesige Reichweite.',
        'Heel Hook: Ferse einhaken, mit Hamstring ziehen.',
        'Toe Hook: Zehen einhaken, körpernahes Halten.',
        'Dyno: dynamischer Sprung mit Push aus den Beinen.',
      ],
    }}),
    mod({ id: 'i3', title: 'Routen lesen & projektieren', duration: '12 min', description: 'Eine Route mental durchgehen.', content: {
      keyPoints: [
        'Crux identifizieren – wo wird es schwer?',
        'Ruheposition zwischen Schlüsselstellen finden.',
        'Bewegungssequenz visualisieren.',
        'Projekt-Routen über mehrere Sessions arbeiten.',
      ],
    }}),
    mod({ id: 'i4', title: 'Krafttraining für Kletterer', duration: '18 min', description: 'Hangboard, Klimmzug, Antagonisten.', content: {
      keyPoints: [
        'Hangboard: 7s On / 3s Off Intervalle, 6 Sätze.',
        'Klimmzüge mit Zusatzgewicht.',
        'Antagonisten: Liegestütze, Außenrotation – verhindert Schulterprobleme.',
        'Niemals junge Finger maximal belasten (vor dem 16. Lebensjahr).',
      ],
      safety: ['Bei Fingerschmerz sofort pausieren – Ringbandverletzungen heilen Monate.'],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Mehrseillängen – Vorbereitung', duration: '14 min', description: 'Transa zur alpinen Routenplanung.', ytVideoId: 'QDf_WRPRNHU', channel: 'Transa', content: {
      intro: 'Mehrseillängen-Klettern bringt dich aus der Halle in echte Wände. Plotzliche Wetterwechsel, langer Abstieg, große Höhen — Vorbereitung ist alles.',
      keyPoints: [
        'Routenwahl: Topo studieren, Schwierigkeit ehrlich einschätzen.',
        'Equipment: Halbseil-Technik, Bandschlingen, Friends, Set.',
        'Wetterprognose im Detail – Mehrseillängen abbrechen ist Pflicht.',
        'Pacing: oben sein vor dem Mittag.',
      ],
      safety: [
        'Erst mit Bergführer in echte Routen – Theorie reicht nicht.',
        'Notfallplan: Wer weiß, wo ihr seid? Wann meldet ihr euch zurück?',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Projektklettern 8a+', duration: '20 min', description: 'Eine Route in mehreren Sessions arbeiten.', content: {
      keyPoints: [
        'Schwierige Routen brauchen 5–50 Versuche – Geduld.',
        'Jede Session: 2–3 Top-Versuche, dann Pause.',
        'Crux-Stellen ohne Sturz angehen, dann verketten.',
        'Mentale Routine vor dem Start.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Wichtigste Kombinationen', duration: '10 min', description: 'One-Two und die klassischen Combos.', ytVideoId: 'SGGKQvXkSl8', channel: 'Darius', content: {
      intro: 'Boxen ist ein Spiel der Kombinationen. Einzelne Schläge sind selten erfolgreich – Combos öffnen Deckungen und schaffen Punkte.',
      keyPoints: [
        '1-2 (Jab + Cross): die Grundkombination, immer üben.',
        '1-2-3 (Jab + Cross + Hook): nach dem Cross seitlich nachsetzen.',
        '1-1-2 (Doppelter Jab + Cross): Distanz brechen.',
        '2-3 (Cross + Hook zum Körper): Körper-zu-Kopf-Wechsel.',
        'Nach jeder Combo: Defense oder Schritt zurück.',
      ],
    }}),
    mod({ id: 'i2', title: 'Schläge schneller ausweichen', duration: '8 min', description: 'Coach Ferhat zu Slip, Roll, Parry.', ytVideoId: 'Eg8_bph2ctE', channel: 'Coach Ferhat', content: {
      keyPoints: [
        'Slip: Kopf nach links oder rechts verlagern – nicht mehr.',
        'Roll: rotierende Bewegung unter dem Hook durch.',
        'Parry: leichte Hand-Bewegung lenkt den Schlag um.',
        'Block ist die LETZTE Verteidigung, nicht die erste.',
      ],
    }}),
    mod({ id: 'i3', title: 'Sandsack-Training', duration: '20 min', description: 'Power und Ausdauer am Sack.', content: {
      keyPoints: [
        '3 Minuten Runden mit 1 Minute Pause.',
        'Verschiedene Höhen: Kopf, Körper, Leber.',
        'Combos statt einzelner Schläge.',
        'Auf Pratzen zur Präzision wechseln.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Boxer', duration: '18 min', description: 'Lauf, HIIT, Seil.', content: {
      keyPoints: [
        '5 km Dauerlauf 2× pro Woche.',
        'Seilspringen: 3 × 3 Min Doppelschwung-Intervalle.',
        'HIIT-Sprints am Hügel.',
        'Mobility Schulter und Hüfte – sonst harte Combos verletzen.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Boxen wie ein Profi – Konter', duration: '12 min', description: 'Coach Ferhat zu Kontertechniken.', ytVideoId: 'sAP5Tp2fmAs', channel: 'Coach Ferhat', content: {
      intro: 'Im Profibox ist der Konter wertvoller als jeder eigene Angriff – der Gegner ist offen, du triffst mit maximaler Wucht.',
      keyPoints: [
        'Konter über die Führhand: schnell, nicht hart.',
        'Konter über die Schlaghand: nach Slip, knock-out-Risiko.',
        'Body-Konter zum Bauch nach Kopf-Versuch.',
        'Counterpuncher-Strategie: Geduld, Lesen, Explosion.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Wettkampf-Strategie & Cornering', duration: '15 min', description: 'Ringgeneralität auf Profiniveau.', content: {
      keyPoints: [
        'Erstes Drittel: Distanz und Timing erkennen.',
        'Zweites Drittel: gefundene Lücken systematisch ausnutzen.',
        'Drittes Drittel: kontrolliert verteidigen oder Knockout-Druck.',
        'Cornering: Trainer-Anweisungen 30 s pro Pause.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: '5 Tipps schneller bergauf', duration: '9 min', description: 'GCN auf Deutsch zur Bergauf-Performance.', ytVideoId: '1lk4Za-4Cas', channel: 'GCN auf Deutsch', content: {
      intro: 'Bergauf fahren ist die unbarmherzigste Disziplin im Radsport: hier zählt das Verhältnis von Kraft zu Gewicht. GCN zeigt dir die fünf wichtigsten Hebel.',
      keyPoints: [
        'Pacing: nicht zu hart starten, gleichmäßiges Tempo halten.',
        'Trittfrequenz hochhalten (75–90 U/min) – schont die Beine.',
        'Wiegetritt sparsam einsetzen – kostet mehr Energie.',
        'Atmung tief und gleichmäßig.',
        'Gewicht reduzieren ist meist effektiver als mehr Training.',
      ],
    }}),
    mod({ id: 'i2', title: 'Wiegetritt – Aus dem Sattel', duration: '8 min', description: 'GCN auf Deutsch zur Antritt-Technik.', ytVideoId: 'HMJ8tqwGwUs', channel: 'GCN auf Deutsch', content: {
      keyPoints: [
        'Wiegetritt für volle Power – Oberkörper über dem Lenker.',
        'Antritt: erst Sitzen, dann Wiegetritt bei voller Last.',
        'Sprint im Pulk: Position in Top 5 vor dem Endspurt.',
        'Aerodynamik bricht ab 40 km/h alles.',
      ],
    }}),
    mod({ id: 'i3', title: 'Aerodynamik & Positionsoptimierung', duration: '10 min', description: 'Mehr Speed bei gleicher Watt-Leistung.', content: {
      keyPoints: [
        'Im Aero-Lenker tief und schmal – Rücken flach.',
        'Helm aerodynamisch – ohne Visier verlierst du Watt.',
        'Kleidung körpernah – flatternde Stoffe bremsen messbar.',
        'Bike-Fitting beim Profi für Watt-pro-Geschwindigkeit-Optimierung.',
      ],
    }}),
    mod({ id: 'i4', title: 'Ernährung auf langen Touren', duration: '14 min', description: 'Wann was essen und trinken.', content: {
      keyPoints: [
        'Vor dem Start: 2 h vorher Kohlenhydrate.',
        'Auf der Tour: 60–90 g Kohlenhydrate / Stunde.',
        'Hydration: 500–800 ml / Stunde, mit Elektrolyten.',
        'Bei > 3h: feste Nahrung statt nur Gels.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Schwellentraining & Sweet Spot', duration: '14 min', description: 'SCYENCE-Masterclass zum Profi-Training in Zone 4.', ytVideoId: 'VCRUcO7w9Hg', channel: 'SCYENCE', content: {
      intro: 'Schwellentempo ist die intensivste Belastung, die ein Athlet langfristig aushalten kann (~1 Stunde Vollgas). Profis verbringen 30–40 % ihrer Saison in Zone 3-4.',
      keyPoints: [
        'FTP-Test bestimmen (20-min-Test × 0,95).',
        'Sweet Spot: 88–94 % FTP, 2–3 × 20 Min.',
        'Threshold: 94–105 % FTP, 1 × 30 Min oder 2 × 15 Min.',
        'VO₂max: über 105 % FTP, 5 × 5 Min mit 3 Min Pause.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Race-Strategie & Renntaktik', duration: '15 min', description: 'Pacing, Position, Sprint.', content: {
      keyPoints: [
        'Vor dem Rennen: Strecken-Recon, kritische Punkte markieren.',
        'In der Gruppe: Energie sparen, Windschatten nutzen.',
        'Berg-Sprint: lange Atemzüge, gleichmäßiger Tritt.',
        'Endspurt: aus 200 m, nicht früher.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Angriffsschlag – 3 Keys', duration: '10 min', description: 'Volleyballkompass zur Technik des harten Schmetterschlags.', ytVideoId: 'c-9VkMA94Ps', channel: 'Volleyballkompass', content: {
      intro: 'Der Angriffsschlag (Spike) entscheidet die meisten Spielzüge. Drei technische Schlüssel machen den Unterschied zwischen "geht über" und "donnert in den Boden".',
      keyPoints: [
        'Anlauf 3-Schritt: links, rechts-links (oder spiegelbildlich) – Power aus dem letzten Schritt.',
        'Beidarmiger Armzug während des Absprungs – wie ein Bogenspanner.',
        'Treffmoment in vollster Streckung, oberhalb des Netzes.',
        'Handgelenk-Snap am Schluss für Topspin und Power.',
      ],
    }}),
    mod({ id: 'i2', title: 'Einstieg ins Blocktraining', duration: '10 min', description: 'Volleyballkompass zur Block-Technik.', ytVideoId: 'DKbNsPcnUJs', channel: 'Volleyballkompass', content: {
      keyPoints: [
        'Position: nahe am Netz, Hände hoch.',
        'Absprung beidbeinig, ohne Anlauf.',
        'Hände über das Netz schieben (penetrieren).',
        'Augen auf den Ball UND den Angreifer.',
      ],
    }}),
    mod({ id: 'i3', title: 'Annahme harter Aufschläge', duration: '10 min', description: 'Floater und Sprungaufschläge sicher annehmen.', content: {
      keyPoints: [
        'Plattform früh formen – nicht warten.',
        'Knie tief, Schwerpunkt nach vorne.',
        'Bei Floater: nicht überreagieren, locker abfedern.',
        'Annahmeziel ist immer der Zuspieler – nicht die Decke.',
      ],
    }}),
    mod({ id: 'i4', title: 'Taktik im 6-gegen-6', duration: '14 min', description: 'Rotation, Position, Spielzüge.', content: {
      keyPoints: [
        '5-1-System: ein Zuspieler, fünf Angreifer.',
        '4-2-System: zwei Zuspieler – einfacher für Schulteams.',
        'Libero-Wechsel mit Mittelblocker organisieren.',
        'Spielzüge nummerieren: "Hut" = Mitte, "Pipe" = Hinterfeld-Angriff.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Schnellangriff – Basistechnik', duration: '10 min', description: 'ARGE Volleyball BW zum Tempo-Angriff der Profis.', ytVideoId: 'jodOgyYC10E', channel: 'ARGE Volleyball Baden-Württemberg', content: {
      intro: 'Auf Profiniveau wird mit Geschwindigkeit gespielt. Schnellangriff (Quick) trifft, bevor die Verteidigung den Block aufstellen kann.',
      keyPoints: [
        '1er-Tempo: Angreifer ist schon in der Luft, wenn der Zuspieler den Ball bekommt.',
        '3er-Tempo: zweite Reihe, leicht versetzt.',
        'Anlauf-Timing entscheidet alles – mit Zuspieler abstimmen.',
        'Block muss raten – schaffe ihm Entscheidungen.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Beach vs. Halle: Übergang', duration: '15 min', description: 'Doppelter Sport, doppelte Skills.', content: {
      keyPoints: [
        'Beach: keine Position, jeder muss alles können.',
        'Sand bremst – Sprungkraft schwerer einzusetzen.',
        'Wind und Sonne lesen – jeder Punkt anders.',
        'Halle: Spezialisierung pro Position.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Sprungwurf durch Techniktraining verbessern', duration: '12 min', description: 'Handball Hacks – individuelles Techniktraining.', ytVideoId: 'T9M_mFSC-7A', channel: 'Handball Hacks', content: {
      intro: 'Der Sprungwurf ist der Königsschlag im Handball. Profis machen 90 % ihrer Tore aus dem Sprung – aber Technik schlägt Kraft.',
      keyPoints: [
        'Absprungbein: bei Rechtshändern links – Hochsprung am höchsten Punkt.',
        'Ballarm zieht in die Hochhalte, Spielbein knickt zur Brust.',
        'Wurf aus voller Streckung, Peitsche aus dem Handgelenk.',
        'Landung in den Wurfkreis vermeiden – außerhalb landen.',
      ],
    }}),
    mod({ id: 'i2', title: 'Was ist ein Kempa-Trick?', duration: '8 min', description: 'RON TV zur ikonischen Wurfvariante.', ytVideoId: '085nWcWoXjc', channel: 'RON TV', content: {
      keyPoints: [
        'Kempa-Trick: Pass in die Luft zum springenden Kreis.',
        'Stoßen und Anspielen: Position 3 oder 4 stößt durch, KL fängt.',
        'Doppel-Pass über die Position des Kreisläufers.',
        'Spielen aus dem Kreuz: Pass diagonal über das Spielfeld.',
      ],
    }}),
    mod({ id: 'i3', title: 'Verteidigungsformationen', duration: '12 min', description: '6-0, 3-2-1, 5-1.', content: {
      keyPoints: [
        '6-0: Alle Verteidiger auf 6-m-Linie – kompakt, gut gegen Rückraum.',
        '3-2-1: dreigliedrig, aggressiv – gut gegen technische Teams.',
        '5-1: ein vorgezogener Verteidiger – stört den Spielmacher.',
        'Übergeben/Übernehmen: klare Absprache an den Schnittstellen.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Handball', duration: '18 min', description: 'Sprint, Sprungkraft, Wurfausdauer.', content: {
      keyPoints: [
        'Sprint-Intervalle 30 m mit Richtungswechsel.',
        'Plyometrik für den Absprung (Box Jumps).',
        'Wurfschulter: Außenrotatoren mit Theraband.',
        'Ganzkörperkraft für Zweikämpfe in der Verteidigung.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: '1-gegen-0-Gegenstoß mit Christian Prokop', duration: '8 min', description: 'Profi-Trainingsform vom DHB-Coach.', ytVideoId: '9N0Zs_vZMnU', channel: 'handball.inspires', content: {
      intro: 'Tempogegenstöße entscheiden Spitzenspiele. Christian Prokop (Ex-Nationaltrainer) zeigt die saubere Form für 1-gegen-0-Situationen.',
      keyPoints: [
        'Sprintbeschleunigung nach Ballgewinn – nicht zögern.',
        'Pass mit Vorlauf zum Mitspieler – nicht zum Standort.',
        'Tor-Versuch: Wurfentscheidung früh, dann durchziehen.',
        'Erste Welle vor der zweiten Welle – Geduld bringt mehr Tore.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Spielplanung & Match-Coaching', duration: '15 min', description: 'Vom Spieler zum Spielführer.', content: {
      keyPoints: [
        'Pre-Game-Routine: 60 Min vor Anpfiff strukturiert.',
        'Time-Out-Strategie: 2 pro Hälfte, gezielt einsetzen.',
        'Auswechslungen: Frische vs. Erfahrung balancieren.',
        'Mannschaftsführung: Stimme zwischen den Aktionen.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Randori auf Orangegurt-Niveau', duration: '12 min', description: 'JudoHD zeigt freies Üben für den 5. Kyu.', ytVideoId: 'qSuOYMq0Nss', channel: 'JudoHD', content: {
      intro: 'Randori (乱取り, "freies Üben") ist Judo unter realistischen Bedingungen. Ab dem Orangegurt arbeitest du gegen Widerstand, mit voller Bewegung.',
      keyPoints: [
        'Beweglich bleiben, nicht klammern – Judo ist Bewegung.',
        'Kuzushi (Gleichgewichtsbrechen) vor jedem Wurf.',
        'Mehrere Würfe verketten: erster scheitert → sofort zweiter.',
        'Niemals mit Ego kämpfen – verlieren ist Lernen.',
      ],
      safety: ['Bei eingehaktem Arm: sofort lockerlassen.', 'Tap-Out im Bodenkampf wird sofort respektiert.'],
    }}),
    mod({ id: 'i2', title: 'Übergang Stand-Boden: Verteidigen', duration: '10 min', description: 'Judo-im-Pott – wie du im Bodenkampf nicht passiv wirst.', ytVideoId: '_gmCGERMKrk', channel: 'Judo-im-Pott [de]', content: {
      keyPoints: [
        'Übergang: nach dem Wurf sofort in die Bodenkontrolle.',
        'Vier Grundhaltegriffe: Kesa-gatame, Yoko-shiho-gatame, Kami-shiho-gatame, Tate-shiho-gatame.',
        'Befreiungstechniken aus den Haltegriffen.',
        'Hebel- und Würgegriffe ab Blaugurt (1. Kyu).',
      ],
    }}),
    mod({ id: 'i3', title: 'Wettkampftaktik', duration: '12 min', description: 'Auf dem Tatami siegen.', content: {
      keyPoints: [
        'Erste 30 Sekunden: Gegner studieren, Griffe testen.',
        'Bei Führung: kontrollierte Verteidigung, kein Hyper-Risk.',
        'Bei Rückstand: aggressiver Griff, dynamische Würfe.',
        'Shido (Strafe) vermeiden: aktiv kämpfen, nicht passiv.',
      ],
    }}),
    mod({ id: 'i4', title: 'Krafttraining für Judoka', duration: '15 min', description: 'Funktionelle Kraft am Tatami.', content: {
      keyPoints: [
        'Griffkraft: Hangboard, Towel-Pull-Ups.',
        'Kreuzheben für Wurf-Power aus den Beinen.',
        'Klimmzüge mit Gi-Aufhängung.',
        'Rumpfstabilität – jede Bewegung im Judo braucht den Core.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Kansetsu-waza – Waki-gatame', duration: '10 min', description: 'Judobund zur Achselhebel-Technik.', ytVideoId: 'WbyyiFb0HvU', channel: 'Judobund', content: {
      intro: 'Kansetsu-waza (Hebeltechniken) sind ab Blaugurt (1. Kyu) Teil des Programms. Waki-gatame ist der Achselhebel – effektiv und schnell.',
      keyPoints: [
        'Ärmel des Gegners festhalten, Arm strecken.',
        'Achsel auf den Ellbogen drücken.',
        'Druckaufbau langsam, sofortige Tap-Out-Akzeptanz.',
        'Im Wettkampf nur ab Blaugurt erlaubt.',
      ],
      safety: ['Niemals ohne erfahrenen Trainer üben.', 'Beim Tap-Out sofort lösen – Bandverletzungen drohen sonst.'],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Wettkampfstrategie & Renking-Aufstieg', duration: '15 min', description: 'Vom Vereins- zum nationalen Niveau.', content: {
      keyPoints: [
        'Top-Würfe entwickeln: 2 als Tokui-waza (Lieblingswurf).',
        'Linkshändige und rechtshändige Variation.',
        'Wettkampf-Periodisierung: 4–6 Turniere pro Saison.',
        'Trainingslager mit Bundes- oder Landeskader.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Mawashi Geri Chudan im Kumite', duration: '8 min', description: 'KSC Team zur effektivsten Tritttechnik im Wettkampf.', ytVideoId: 'JYm_tE-K9pc', channel: 'KSC Team', content: {
      intro: 'Mawashi Geri Chudan ist die meistvariierte Technik im Karate-Kumite – schnell, präzise, punktet bei gutem Treffer sofort.',
      keyPoints: [
        'Hüfte führt die Bewegung, Knie hochziehen.',
        'Treffpunkt mit Spann oder Schienbein (Wettkampf: Spann).',
        'Standbein-Ferse rotiert mit – Power aus der Drehung.',
        'Sofort Bein zurückziehen – nicht stehenlassen.',
      ],
    }}),
    mod({ id: 'i2', title: 'Kata Heian Nidan – 7. Kyu', duration: '10 min', description: 'Kara-Fit zur Orangegurt-Prüfungs-Kata.', ytVideoId: 'jBqH9bT-rcw', channel: 'Kara-Fit', content: {
      intro: 'Heian Nidan ist die Kata für den 7. Kyu (gelb-orange). Sie führt seitwärts gerichtete Bewegungen ein.',
      keyPoints: [
        '26 Techniken in einer komplexen Choreografie.',
        'Erste Kombinationen aus Block + Konter.',
        'Wechsel zwischen tiefen und hohen Ständen.',
        'Tempo wechselt zwischen schnell und ruhig.',
      ],
    }}),
    mod({ id: 'i3', title: 'Bunkai – Kata-Anwendung', duration: '15 min', description: 'Was die Bewegungen wirklich bedeuten.', content: {
      intro: 'Bunkai (分解) heißt "Zerlegung". Jede Kata-Bewegung hat eine konkrete Kampfanwendung – Bunkai macht aus Tanz Kampfkunst.',
      keyPoints: [
        'Jede Bewegung hat mindestens eine direkte Anwendung.',
        'Mehrdeutig: ein Block kann auch ein Schlag sein.',
        'Mit Partner üben – Theorie reicht nicht.',
        'Ältere Versionen der Kata zeigen die ursprüngliche Anwendung.',
      ],
    }}),
    mod({ id: 'i4', title: 'Wettkampfvorbereitung', duration: '12 min', description: 'Auf das erste Turnier vorbereitet sein.', content: {
      keyPoints: [
        'Sparring mit Wettkampf-Regeln (Punkterichter, Zone, Zeit).',
        'Mawashi Geri und Gyaku Zuki sind die Punkte-Bringer.',
        'Ippon (3 Punkte): vor allem mit gut platzierten Tritten.',
        'Mental: Visualisierung des Ablaufs am Vorabend.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Jion Bunkai – Kata mit Anwendung', duration: '14 min', description: 'Kata-Karate zur klassischen Form mit Bunkai-Vergleich.', ytVideoId: 'L__3YEAFHOA', channel: 'Kata-Karate', content: {
      intro: 'Jion ist eine fortgeschrittene Shotokan-Kata (ab 2. Kyu). Sie verbindet kraftvolle Techniken mit komplexen Bewegungsmustern. Bunkai zeigt, dass jede Bewegung Kampfanwendung hat.',
      keyPoints: [
        'Charakteristische Manji-uke-Position am Anfang.',
        'Doppelstand Kosa-dachi mit Mehrfachschlägen.',
        'Bunkai: Verteidigung gegen multiple Angreifer.',
        '47 Techniken, davon zwei Kiai-Punkte.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Sport-Karate vs. Tradition', duration: '15 min', description: 'WKF-Kumite vs. Karate-do.', content: {
      keyPoints: [
        'WKF-Sport: Geschwindigkeit, Punkte, Wettkampf.',
        'Traditionell: Kata-Bunkai, Selbstverteidigung, Geist.',
        'Beide Pfade haben Wert – die Wahl ist persönlich.',
        'Ab 4. Dan unterrichten – Karate weitergeben.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Mawashi Geri – Grundübungen', duration: '10 min', description: 'Marie Niino Karate – die Basis-Übungen für den Rundtritt.', ytVideoId: '09frCZOfD0E', channel: 'Marie Niino Karate & Kokoro Physical Training', content: {
      intro: 'Mawashi Geri (Roundhouse Kick) ist im Kickboxen die meistverwendete Technik. Saubere Ausführung schützt deine Hüfte und macht den Tritt schnell.',
      keyPoints: [
        'Knie zuerst hochziehen – diagonal.',
        'Hüfte rotiert vollständig mit, Standbein dreht 90°.',
        'Treffen mit dem Schienbein, nicht mit dem Spann.',
        'Bein nach dem Tritt sofort zurück in die Deckung.',
      ],
    }}),
    mod({ id: 'i2', title: 'Sandsack-Workout', duration: '15 min', description: 'DieKickboxtrainer – Sandsack-Training für Combos und Defense.', ytVideoId: 'cCgvL6b8Evc', channel: 'DieKickboxtrainer', content: {
      keyPoints: [
        'Auf Jab: Slip + Cross-Konter.',
        'Auf Cross: Roll + Hook-Konter.',
        'Auf Front Kick: Side-Step + Low Kick.',
        'Konter funktioniert nur, wenn du erst die Distanz kontrollierst.',
      ],
    }}),
    mod({ id: 'i3', title: 'Sandsack-Training mit Tritten', duration: '15 min', description: 'Power und Ausdauer am Pratzen und Sack.', content: {
      keyPoints: [
        '3 × 3 Min Runden mit 1 Min Pause.',
        'Jede Runde mit anderer Combo-Fokus.',
        'Auf Pratzen für Präzision.',
        'Tritte mit dem rechten und linken Bein gleich oft.',
      ],
    }}),
    mod({ id: 'i4', title: 'Wettkampftaktik', duration: '14 min', description: 'Punkten im Light Contact und K1.', content: {
      keyPoints: [
        'Light Contact: schnelle Technik, kein Knockout-Versuch.',
        'K1: Powerschläge im Bereich, Clinch erlaubt.',
        'Ring-Generalität: die Mitte halten.',
        'Konditions-Drittel: erstes Drittel mit Tempo, letztes mit Effizienz.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: '7 beste K1-Kombinationen am Pratzen', duration: '11 min', description: 'OYAKATA zu Profi-Combos auf K1-Niveau.', ytVideoId: 'XyYBaXvT_q8', channel: 'OYAKATA', content: {
      intro: 'K1-Style ist die kompletteste Kickbox-Variante: alle Schläge plus Tritte, kein Clinch. Diese 7 Combos sind die Hauptwaffen der Top-Fighter.',
      keyPoints: [
        'Jab-Cross-Low-Kick: die Klassik.',
        'Doppel-Jab-Cross-Mid-Kick: Distanz schaffen, dann zur Mitte.',
        'Cross-Hook-Knee: in den Clinch.',
        'Pendelschritt + Round-Kick: Distanz halten und treten.',
        'Switch-Kick: Bein wechselt VOR dem Tritt.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'WAKO vs. ISKA – Verbände & Karriere', duration: '12 min', description: 'Welcher Verband, welcher Weg?', content: {
      keyPoints: [
        'WAKO: Hauptsächlich Amateurklasse, weltweit anerkannt.',
        'ISKA / WKA: Profi-Lizenzen, K1-fokussiert.',
        'Glory / Bellator MMA für Profi-Vollkontakt.',
        'Karriere-Pfad: Amateur → Semi-Pro → Profi.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Vorhand-Überkopf Smash', duration: '8 min', description: 'Die Sportlehrer zur Power-Technik.', ytVideoId: 'Z8lY0OJmnVI', channel: 'Die Sportlehrer', content: {
      intro: 'Der Smash ist der härteste Schlag im Badminton – Profis schmettern mit über 400 km/h. Mit sauberer Technik wird er schon im Hobby zur unverteidigbaren Waffe.',
      keyPoints: [
        'Treffpunkt steil über dem Kopf, leicht vor dem Körper.',
        'Schnelle Pronation – Schlägerkopf peitscht durch.',
        'Volle Körperrotation, Schlaghand führt.',
        'Nach dem Schlag sofort zurück zur Mitte.',
      ],
    }}),
    mod({ id: 'i2', title: 'Doppelspiel-Taktik', duration: '12 min', description: 'Vorne-Hinten-System richtig spielen.', content: {
      keyPoints: [
        'Bei Angriff: vorne-hinten-Aufstellung (Front-Back).',
        'Bei Verteidigung: seitlich (Side-Side).',
        'Rotation: nach Pushshot vorne, nach hohem Ball hinten.',
        'Kommunikation: "Mein!" oder "Deins!" laut rufen.',
      ],
    }}),
    mod({ id: 'i3', title: 'Drop, Drive, Lift', duration: '12 min', description: 'Die drei taktischen Schlagvarianten.', content: {
      keyPoints: [
        'Drop: kurze, leise Schläge ans Netz.',
        'Drive: flacher, schneller Schlag parallel zum Netz.',
        'Lift: defensiver Hochschlag aus dem Vorderfeld.',
        'Variation gewinnt Punkte – nicht nur Power.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Badminton', duration: '15 min', description: 'Schnellkraft und Reaktion.', content: {
      keyPoints: [
        'Sprintintervalle 5–10 m für Antritt.',
        'Plyometrie für den Smash-Sprung.',
        'Schulter-Mobility für die Pronation.',
        'Reaktions-Drills mit Partner.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Doppel-Taktik: Stellungsspiel & Rotation', duration: '14 min', description: 'Diemo Ruhnow zur Profi-Rotation im Doppel.', ytVideoId: 'KWPPyGH1Tbk', channel: "Diemo Ruhnow's Badminton Training", content: {
      intro: 'Im Doppel auf Profiniveau ist die Rotation alles. Bei jedem Schlag ändert sich die Position beider Spieler – wer das beherrscht, dominiert.',
      keyPoints: [
        'Front-Back bei Angriff, Side-Side bei Verteidigung.',
        'Rotation nach jedem Smash und Drop.',
        'Kommunikation: kurz, klar, laut.',
        'Anticipation: Position 1 m vor der erwarteten Schlagrichtung.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'BWF Tour & Ranking', duration: '12 min', description: 'Der Weg zum internationalen Wettkampf.', content: {
      keyPoints: [
        'DBV-Ranking nationaler Einstieg.',
        'BWF-Tour: International Series → Tour Super 100/300/500/750/1000.',
        'Eigenes Equipment: Yonex / Victor Pro-Modell.',
        'Spielanalyse mit Video-Software.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Vorhand-Topspin DTTB', duration: '10 min', description: 'Deutscher Tischtennis-Bund – der wichtigste Schlag im modernen TT.', ytVideoId: 'woT6NgJymBk', channel: 'Deutscher Tischtennis-Bund', content: {
      intro: 'Der Vorhand-Topspin ist im modernen offensiven Tischtennis der dominante Schlag. Ohne ihn kommst du auf Vereins-Niveau nicht weiter.',
      keyPoints: [
        'Schläger schließt im Treffmoment, streift den Ball von hinten/unten.',
        'Power aus Beinen, Hüfte und Schulter – nicht aus dem Arm.',
        'Tiefe Position – Knie deutlich gebeugt.',
        'Durchschwung über die linke Schulter (Rechtshänder).',
      ],
    }}),
    mod({ id: 'i2', title: 'Vorhand-Schupfen lernen', duration: '8 min', description: "Let's play table tennis zum wichtigsten Defensiv-Schlag.", ytVideoId: '8j0sHuyFQOo', channel: "Let's play table tennis", content: {
      keyPoints: [
        'Kurzer Schupfball: dicht am Netz, schwer anzuspinnen.',
        'Halblanger Schupf: zwingt zum Topspin – kontrollierbar.',
        'Aggressives Schupfen: gezielter Druck auf die Ecken.',
        'Aktive Hand am Treffpunkt – nicht passiv.',
      ],
    }}),
    mod({ id: 'i3', title: 'Aufschlag-Strategie', duration: '14 min', description: 'Der Aufschlag entscheidet 30 % aller Punkte.', content: {
      keyPoints: [
        'Variation: jede Aufschlagrunde mit anderem Schnitt.',
        'Spin verstecken: Wechsel von Ober- und Unterschnitt mit gleichem Bewegungsablauf.',
        'Platzierung: lange Aufschläge zur Vorhand des Gegners.',
        'Kurzaufschläge ziehen ins Spiel rein.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für TT', duration: '12 min', description: 'Reaktion, Beweglichkeit, Stabilität.', content: {
      keyPoints: [
        'Reaktions-Drills: Ball aus mehreren Richtungen returnieren.',
        'Beinarbeit: kleine schnelle Schritte, kein Springen.',
        'Hüft-Mobility für tiefen Stand.',
        'Augen-Hand-Koordination mit Tennisball.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Vom Konter zum gefährlichen Topspin', duration: '10 min', description: 'Profi-Tipps zur Übergangstechnik.', ytVideoId: '5g96XIpBfAQ', channel: "Let's play table tennis", content: {
      intro: 'Auf Profiniveau ist der Konter selten der Schluss – er ist die Vorbereitung für den entscheidenden Topspin. Der Übergang trennt Bundesligaspieler von Verbandsspielern.',
      keyPoints: [
        'Konter im Aufprall, Topspin im nächsten Schlag.',
        'Schläger früh schließen für die Schlagwahl.',
        'Beinposition vorbereiten: Druck auf das hintere Bein.',
        'Variation zwingt den Gegner zu Fehlern.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Belag-Kunde für Profis', duration: '12 min', description: 'Das Equipment-Match macht den Unterschied.', content: {
      keyPoints: [
        'Tensor-Beläge: Vortrieb durch chemische Spannung.',
        'Antitop / Noppen außen für Defensive.',
        'Boostern: einige Profis behandeln Beläge für mehr Tempo.',
        'Belagwechsel alle 2–4 Wochen für Top-Performance.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Boast Shot verbessern', duration: '7 min', description: 'Squashpoint zur taktischen Schlagvariante.', ytVideoId: 'KqTusUA_JM0', channel: 'Squashpoint', content: {
      intro: 'Der Boast ist der trickreichste Schlag im Squash: Der Ball trifft erst die Seitenwand, dann die Vorderwand. Richtig eingesetzt zwingt er den Gegner ins Vorderfeld.',
      keyPoints: [
        'Schlagen aus dem Hinterfeld – Boast funktioniert defensiv und offensiv.',
        'Treffwinkel: 45° zur Seitenwand, ca. 30 cm über der Tin.',
        'Variieren: 2-Wall- vs. 3-Wall-Boast.',
        'Nach dem Boast SOFORT zurück zur T-Position.',
      ],
    }}),
    mod({ id: 'i2', title: 'T-Position kontrollieren', duration: '8 min', description: 'Squashpoint zur Court-Mitte als taktisches Zentrum.', ytVideoId: 'LbT2aaim68M', channel: 'Squashpoint', content: {
      keyPoints: [
        'Nach jedem Schlag direkt zurück zur T.',
        'Position seitlich verschieben, nicht hin und her laufen.',
        'Wer die T hält, kontrolliert das Spiel.',
        'Bei Druck: tiefere Längsschläge ans Hinterfeld.',
      ],
    }}),
    mod({ id: 'i3', title: 'Volley-Schläge', duration: '12 min', description: 'Den Ball aus der Luft nehmen.', content: {
      keyPoints: [
        'Schneller Eingriff bricht den Rhythmus des Gegners.',
        'Volley-Drive: aus dem Mittelfeld direkt nach hinten.',
        'Volley-Drop: vor dem Bouncen abkürzen.',
        'Position 1 m hinter der T für aggressive Volleys.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Squash', duration: '15 min', description: 'Sprint-Ausdauer und Stabilität.', content: {
      keyPoints: [
        'Ghosting-Drills: leere Court-Bewegung simulieren.',
        'Sprint-Intervalle 30 s an / 30 s aus.',
        'Plyometrie für den Lunge zum Ball.',
        'Mobility für tiefe Ausfallschritte.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Schneller auf dem Squash-Court', duration: '9 min', description: 'Spitzentrainer Bart Wijnhoven zur Court-Bewegung.', ytVideoId: 'weznu3NWonc', channel: 'Squashpoint', content: {
      intro: 'Auf Profi-Niveau wird Squash mit den Füßen gewonnen. Top-Coach Bart Wijnhoven zeigt, wie du dich effektiver und schneller auf dem Court bewegst.',
      keyPoints: [
        'Kleine schnelle Schritte statt großer Sprünge.',
        'Antritt aus der T mit Cross-Over-Step.',
        'Bei Volley-Position: leichter Spring-Step.',
        'Atemrhythmus an Bewegung koppeln.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'PSA-Tour & Profi-Karriere', duration: '12 min', description: 'Der internationale Wettkampfweg.', content: {
      keyPoints: [
        'PSA Challenger Tour als Einstieg.',
        'PSA World Tour für Top-50-Spieler.',
        'Trainingscenter in Ägypten, Frankreich, England.',
        'Spielanalyse mit Heatmaps und Bewegungstracker.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Schlagfrequenz richtig wählen', duration: '8 min', description: 'Augletics zur effizienten Schlagzahl.', ytVideoId: 'SJc3NisV3kA', channel: 'Augletics Rudergeräte', content: {
      intro: 'Die Schlagfrequenz ist im Rudern wichtiger als Power. Zu hoch = ineffizient, zu niedrig = Power verschwendet. Augletics zeigt dir das Optimum.',
      keyPoints: [
        'Grundlagentraining: 18–22 Schläge / Min.',
        'Wettkampf (2000 m): 28–34 SPM.',
        'Sprint-Intervalle: 36+ SPM.',
        'Schlagzahl muss zur Druckphase passen – nicht eilen.',
      ],
    }}),
    mod({ id: 'i2', title: 'Race Pacing für 2000 m', duration: '15 min', description: 'Die olympische Distanz strategisch fahren.', content: {
      keyPoints: [
        'Start (250 m): hohe Schlagzahl 38-40 SPM, harter Druck.',
        'Body (250-1750 m): 28-32 SPM, konstant.',
        'Sprint (letzte 250 m): wieder 36+ SPM mit allem.',
        'Negative Splits: zweite 1000 m schneller als erste.',
      ],
    }}),
    mod({ id: 'i3', title: 'Krafttraining für Ruderer', duration: '15 min', description: 'Kreuzheben, Klimmzug, Beine.', content: {
      keyPoints: [
        'Kreuzheben 3 × 5 für Hüft- und Beinstreckung.',
        'Klimmzüge für den Endzug.',
        'Frontkniebeuge für Knie-Stabilität.',
        'Plank-Varianten für den Core.',
      ],
    }}),
    mod({ id: 'i4', title: 'Vom Ergometer aufs Wasser', duration: '12 min', description: 'Den Übergang zum Boot meistern.', content: {
      keyPoints: [
        'Balance: 80 % Aufmerksamkeit auf das Boot, nicht den Schlag.',
        'Skull (zwei Riemen) ist anfangs einfacher als Riemen.',
        'Slow & balanced – nicht hart fahren am Anfang.',
        'Vor allem: nicht ins Wasser fallen ;-)',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Der Ruder-Achter: Mythos & Vorbereitung', duration: '15 min', description: 'kicker.tv zur Königsdisziplin des Ruderns.', ytVideoId: 'G4Quy7ShQR8', channel: 'kicker', content: {
      intro: 'Der Achter (8+) ist die schnellste und prestigereichste Bootsklasse. Acht Ruderer, ein Steuermann, perfekte Synchronisation – auf Olympia-Niveau hart erarbeitet.',
      keyPoints: [
        'Synchronisation = entscheidender Faktor.',
        'Schlagmann gibt Takt vor.',
        'Steuermann ruft Kommandos und liest die Strecke.',
        'Trainingslager über Monate vor Olympia.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Vom Skuller zum Riemen', duration: '14 min', description: 'Bootsklassen verstehen und wechseln.', content: {
      keyPoints: [
        'Skull (2 Riemen pro Person): 1×, 2×, 4×, 8× (selten).',
        'Riemen (1 Riemen pro Person): 2-, 4-, 8+ (mit Steuermann).',
        'Riemen-Übergang verlangt körperliche Asymmetrie-Anpassung.',
        'Skuller-Achter (8×) gibt es kaum, Riemen-Achter (8+) ist die Königsklasse.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Spinnaker setzen', duration: '10 min', description: 'Der Segelberater Folge 10 – Spi-Manöver.', ytVideoId: 'flzjpDM1FjA', channel: 'NAUTIC FILM', content: {
      intro: 'Der Spinnaker (Spi) ist das große bunte Segel für Raumkurse. Setzen und Bergen erfordert Crew-Koordination – aber dafür segelst du danach mit doppelter Geschwindigkeit.',
      keyPoints: [
        'Vorbereiten: Schoten und Fallen klar legen.',
        'Setzen im Schutz der Großsegels – verhindert Verheddern.',
        'Trimmen: Achterkante muss leicht "atmen".',
        'Bergen: Luvseite zuerst, dann Leeschot lockern.',
      ],
    }}),
    mod({ id: 'i2', title: 'Trimm bei verschiedenen Windverhältnissen', duration: '14 min', description: 'Segel optimal stellen.', content: {
      keyPoints: [
        'Wenig Wind: tiefer Twist, lockerer Trimm.',
        'Mittlerer Wind: Standard – Achterstag fest, Großschot anziehen.',
        'Viel Wind: Großbaum nach unten (Vang), Vorsegel flach.',
        'Telltales zeigen, ob der Trimm passt.',
      ],
    }}),
    mod({ id: 'i3', title: 'Regatta-Grundlagen', duration: '15 min', description: 'Vom ersten Wettkampf an mithalten.', content: {
      keyPoints: [
        'Startlinie: Position auf Steuerbordseite ist ideal.',
        'Layline berechnen: nicht zu weit ausholen.',
        'Bei Boje rounding: enge Linie nehmen.',
        'Regeln kennen: Steuerbord vor Backbord.',
      ],
    }}),
    mod({ id: 'i4', title: 'Reffen bei Starkwind', duration: '10 min', description: 'Segelfläche verkleinern – sicher segeln.', content: {
      keyPoints: [
        'Frühzeitig reffen, nicht erst bei Sturm.',
        'Erst Großsegel reffen, dann Vorsegel.',
        'Crew einweisen: jeder weiß, wo Sicherheitsweste und Reffleinen sind.',
      ],
      safety: ['Bei Böen über 25 Knoten: defensive Routen wählen.', 'Wetterprognose alle 3 h checken.'],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Regattataktik – 3 wichtige Grundsätze', duration: '11 min', description: 'bessersegeln.at zum strategischen Segeln.', ytVideoId: 'QYIHQZ8HV88', channel: 'bessersegeln at', content: {
      intro: 'Regattasegeln ist 80 % Taktik und 20 % Boot. Die drei wichtigsten Grundsätze entscheiden über Sieg und Niederlage.',
      keyPoints: [
        'Spitze finden: rechtzeitig auf der schneller fahrenden Seite sein.',
        'Lay-Lines beachten – zu früh ausholen verliert Zeit.',
        'Andere Boote als Indikator nutzen.',
        'Wettkampf-Regeln Steuerbord/Backbord kennen.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Match Race & Team Race', duration: '14 min', description: 'Profi-Segeln in besonderen Formaten.', content: {
      keyPoints: [
        'Match Race: 1 gegen 1, Punkt für Punkt.',
        'Team Race: 3 gegen 3, taktisch hochkomplex.',
        'America\'s Cup als Profi-Königsdisziplin.',
        'Foiling-Boote: Geschwindigkeit über 50 Knoten.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Backside Cutback & Bottom Turn', duration: '8 min', description: 'WINDSURFERS – die beiden Schlüssel-Manöver.', ytVideoId: 'MpcUyDeTgCc', channel: 'WINDSURFERS', content: {
      intro: 'Cutback und Bottom Turn sind die zentralen Manöver, mit denen du auf der Welle Geschwindigkeit nutzt und Punkte sammelst.',
      keyPoints: [
        'Bottom Turn: am Fuß der Welle eindrehen, Druck auf die Heel-Edge.',
        'Cutback: oben in der Welle den Kurs umkehren.',
        'Backside (Rücken zur Welle) ist schwerer als Frontside.',
        'Knie tief, Blick führt – wohin du schaust, fährst du.',
      ],
    }}),
    mod({ id: 'i2', title: 'Bottom & Top Turn – The Chillhouse', duration: '12 min', description: 'Internationale Surfschool zu den Schlüssel-Manövern.', ytVideoId: 'JZTHMS0K32U', channel: 'The Chillhouse - Bali Surf and Yoga Retreat', content: {
      keyPoints: [
        'Top Turn: gleitend nach oben fahren, dann Druck wechseln.',
        'Snap: schnelle Drehung mit Spray-Effekt.',
        'Floater: über den Wellenkamm gleiten.',
        'Re-entry: hinter der Welle wieder einsteigen.',
      ],
    }}),
    mod({ id: 'i3', title: 'Surfboard-Wahl für Fortgeschrittene', duration: '10 min', description: 'Vom Softboard zum Performance-Board.', content: {
      keyPoints: [
        'Volumen reduzieren – mehr Wendigkeit, weniger Stabilität.',
        'Shortboard für schnelle Manöver – ab Surfniveau Stufe 4.',
        'Fish für kleine Wellen, Gun für große.',
        'Finsetup variieren: Thruster (3) für Allround, Quad (4) für Speed.',
      ],
    }}),
    mod({ id: 'i4', title: 'Surf-Fitness', duration: '15 min', description: 'Trockentraining für längere Sessions.', content: {
      keyPoints: [
        'Schwimmen für Paddel-Ausdauer (Schulter).',
        'Yoga für Hüft- und Schultermobility.',
        'Pop-Up Tausende von Wiederholungen daheim.',
        'Balance-Training auf Bosu Ball.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Big Wave Surfing in Nazaré', duration: '12 min', description: 'DER SPIEGEL zur Weltrekordwelle.', ytVideoId: '4mT0DzAY7dQ', channel: 'DER SPIEGEL', content: {
      intro: 'Big-Wave-Surfing ist der Extremsport, der wenigen Surfern vorbehalten ist. Sebastian Steudtner aus Bayern surfte hier 2020 die Rekordwelle.',
      keyPoints: [
        'Tow-In: Per Jet-Ski auf die Welle gezogen.',
        'Boards: 8–10 ft, schwerer und stabiler.',
        'Vorbereitung: monatelang Atem trainieren, Workouts unter Wasser.',
        'Risiko: Wellen über 20 m, Stürze tödlich möglich.',
      ],
      safety: ['Big Wave nur mit Sicherheits-Team (Jet-Ski-Rettung) und Erfahrung.', 'Niemals allein – jeder Profi hat einen Spotter.'],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'WSL-Tour & Profi-Karriere', duration: '14 min', description: 'Der Weg ins Welttournee.', content: {
      keyPoints: [
        'WSL Qualifying Series für Aufstieg.',
        'Championship Tour: Top 36 weltweit.',
        'Sponsor-Kontakte sind essenziell.',
        'Pipeline, Teahupo\'o, Cloudbreak – die Stops.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Muscle Up Tutorial', duration: '14 min', description: 'Coach Stef – Bar Muscle Up Schritt für Schritt.', ytVideoId: 'mUlkFVmOKMw', channel: 'Coach Stef', content: {
      intro: 'Der Muscle Up ist die Krönung der Calisthenics. Mit der richtigen Technik geht er, sobald du saubere Klimmzüge und Dips kannst.',
      keyPoints: [
        'Voraussetzung: 10 saubere Strict Pull Ups + 10 Dips.',
        'False Grip: Handgelenk über die Stange – ermöglicht Übergang.',
        'Explosiv hochziehen mit Hüft-Kick.',
        'Übergang: Brust über die Stange, dann Push.',
      ],
      safety: ['Niemals nur mit Kipping – Schulterprobleme drohen.'],
    }}),
    mod({ id: 'i2', title: 'Snatch (Reißen) – Schritt für Schritt', duration: '14 min', description: 'Johannes Kwella zum Olympischen Heben.', ytVideoId: 'kKSBffUmOUg', channel: 'Johannes Kwella', content: {
      keyPoints: [
        'Lernen NUR mit Coach – Verletzungsrisiko sonst hoch.',
        'Snatch: Boden zu Overhead in einer Bewegung.',
        'Clean & Jerk: erst auf die Schulter, dann Overhead.',
        'Mit Holzstange üben, bevor du Gewicht draufpackst.',
      ],
      safety: ['Niemals olympisch heben ohne saubere Frontkniebeuge / Overhead Squat.'],
    }}),
    mod({ id: 'i3', title: 'Double Unders', duration: '10 min', description: 'Doppelschwung am Seil.', content: {
      keyPoints: [
        'Hochsprung knapp 5–10 cm – nicht mehr.',
        'Handgelenke kurbeln, nicht die Arme.',
        'Singel-Doppel-Wechsel: ein Single zwischen Doubles.',
        'Erst lockere 30 Singles, dann erste Double versuchen.',
      ],
    }}),
    mod({ id: 'i4', title: 'Wettkampf-Vorbereitung', duration: '12 min', description: 'Open / Quarterfinals / Local Comps.', content: {
      keyPoints: [
        'CrossFit Open ist global zugänglich – jeder kann mitmachen.',
        'Warm-up Routine vor jedem WOD.',
        'Strategy: weiß was kommt, plane Pacing.',
        'Mentaltraining – CrossFit ist viel im Kopf.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'CrossFit Open & Qualifier', duration: '18 min', description: 'Der Weg zu den CrossFit Games.', content: {
      intro: 'Die CrossFit Open ist die weltweite Qualifikation für die CrossFit Games – jeder kann mitmachen. Quartersfinals und Semifinals folgen für Top-Athleten.',
      keyPoints: [
        'Open: 3 Wochen, jeweils ein WOD – online eingereicht.',
        'Quartersfinals: Top 10 % weltweit.',
        'Semifinals: Top 60 pro Region.',
        'CrossFit Games: Top 40 Männer, 40 Frauen weltweit.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Coaching & Box-Ownership', duration: '15 min', description: 'Vom Athleten zum Coach.', content: {
      keyPoints: [
        'CrossFit Level 1 als Einstiegszertifikat.',
        'Level 2 für Profi-Coaching.',
        'Eigene Box: Investition 80–200 k€, plus laufende Kosten.',
        'Athletenbetreuung statt eigene Wettkampf-Karriere.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Pilates Reformer – Einführung', duration: '10 min', description: 'Vela Pilates – was du vorm ersten Reformer-Training wissen solltest.', ytVideoId: 'qRDITmQrWbw', channel: 'Vela Pilates', content: {
      intro: 'Der Reformer ist DAS Pilates-Gerät schlechthin. Mit Federn und Schlitten erschließt du Bewegungen, die auf der Matte unmöglich sind – aber Sicherheit ist hier wichtig.',
      keyPoints: [
        'Federn (1, 1.5, 2 Federn) regulieren den Widerstand.',
        'Headrest, Shoulder Rests, Foot Bar richtig einstellen.',
        'Mehrere Übungen aus dem klassischen Repertoire (Footwork, Hundred, Long Stretch).',
        'Niemals Federn lösen während eine Übung läuft.',
      ],
      safety: ['Schlitten kann zurückschnellen – kontrollierte Bewegung Pflicht.'],
    }}),
    mod({ id: 'i2', title: 'Pilates für Fortgeschrittene', duration: '25 min', description: "Lena's Health Lab – Control Balance und Boomerang.", ytVideoId: 'kutGV3GZE-w', channel: "Lena's Health Lab", content: {
      keyPoints: [
        'Teaser: V-Sitz aus Liegen – Königsdisziplin der Bauch-Kraft.',
        'Roll Over: aus Liegen Beine über den Kopf.',
        'Swan: tiefe Rückbeuge mit Push-Up Arms.',
        'Boomerang: kombinierte Sequenz aus Teaser und Roll Over.',
      ],
    }}),
    mod({ id: 'i3', title: 'Pilates für Sportler', duration: '15 min', description: 'Performance-Booster für andere Sportarten.', content: {
      keyPoints: [
        'Läufer profitieren von Hüftöffnern und Core.',
        'Skifahrer brauchen Bein- und Rumpfstabilität.',
        'Schwimmer: Rotation und Schulterstabilität.',
        'Pilates verbessert Wahrnehmung – egal welcher Sport.',
      ],
    }}),
    mod({ id: 'i4', title: 'Atemtechnik vertiefen', duration: '8 min', description: 'Pilates-Atmung über die Basics hinaus.', content: {
      keyPoints: [
        'Lateral Breathing: in den Brustkorb seitlich, nicht in den Bauch.',
        'Atem führt die Bewegung – nicht umgekehrt.',
        'Ausatmen in der schwersten Phase.',
        'Zwerchfell aktiv nutzen für Core-Stabilität.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Pilates-Trainer:in werden – ASG-Ausbildung', duration: '10 min', description: 'Akademie für Sport und Gesundheit zu den FAQs.', ytVideoId: 'TVYvwSo_-v0', channel: 'Akademie für Sport und Gesundheit', content: {
      intro: 'Pilates-Lehrer:in ist ein anerkannter Beruf. Die ASG und andere Akademien bieten strukturierte Ausbildungen mit B- und A-Lizenzen.',
      keyPoints: [
        'B-Lizenz: Mat Pilates Basics, ~4 Tage + Eigenstudium.',
        'A-Lizenz: erweiterte Mat und Geräte-Grundlagen.',
        'Reformer-Spezialisierung als separate Ausbildung.',
        'Anatomie- und Methodik-Kenntnisse sind Pflicht.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Apparatus-Spezialisierung', duration: '15 min', description: 'Reformer, Cadillac, Chair, Barrels.', content: {
      keyPoints: [
        'Reformer: meistverbreitet, vielseitig.',
        'Cadillac: ganzkörperlich, viele Aufhängungen.',
        'Wunda Chair: kleine Fläche, intensive Übungen.',
        'Spine Corrector / Ladder Barrel: für Rückenkräftigung.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Ultraleicht-Packliste Mehrtagestour', duration: '14 min', description: 'SASCHA zur Alpen-Mehrtagestour mit minimalem Gewicht.', ytVideoId: 'QXcriumM-w8', channel: 'SASCHA', content: {
      intro: 'Bei Mehrtagestouren entscheidet jedes Gramm. Ultraleicht-Wandern heißt: alles weglassen, was nicht wirklich gebraucht wird – dann genießt du den Weg.',
      keyPoints: [
        'Basisgewicht (ohne Wasser/Essen) Ziel: 6–8 kg.',
        '3-Schichten-Prinzip strikt einhalten.',
        'Schlafsystem nach Klima wählen (Daune vs. synthetisch).',
        'Filter statt Tabletten – schneller und besser im Geschmack.',
      ],
    }}),
    mod({ id: 'i2', title: 'Trekking-Tourenplanung', duration: '15 min', description: 'Mehrere Tage hintereinander planen.', content: {
      keyPoints: [
        'Höhenmeter / Tag: 800–1200 Hm für Mehrtagestouren angemessen.',
        'Hütten-Reservierung 4–6 Monate im Voraus für Sommer-Alpen.',
        'Karte + GPS-App (komoot, OutdoorActive, Locus Map).',
        'Alternativ-Route immer im Hinterkopf.',
      ],
    }}),
    mod({ id: 'i3', title: 'Hütten- und Biwakübernachtungen', duration: '10 min', description: 'Wie es in den Bergen abläuft.', content: {
      keyPoints: [
        'Auf der Hütte: Hüttenschlafsack ist Pflicht.',
        'Reservierung verbindlich – auch im Schlechtwetter erscheinen.',
        'Bergsteigeressen: meist Halbpension – ankommen, bestellen.',
        'Biwak: nur im Notfall, lokale Vorschriften beachten.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionsaufbau fürs Trekking', duration: '14 min', description: 'Trainieren für 7-Tage-Touren.', content: {
      keyPoints: [
        '3 Monate Vorlauf: 1× pro Woche lange Tour mit Rucksack.',
        'Berg-Treppe oder Stadion-Stufen mit Rucksack.',
        'Beinkraft: Ausfallschritte und Kniebeugen.',
        'Schuhe einlaufen: 100+ km vor der Tour.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Höhenbergsteigen – Akklimatisierung', duration: '12 min', description: 'yourdailymilk zu Vorbereitung & Höhenanpassung.', ytVideoId: 'eLJgn6-vSDY', channel: 'yourdailymilk', content: {
      intro: 'Oberhalb 2500 m beginnt der Bereich, wo der Körper sich anpassen muss. Auf 5000 m+ ist Akklimatisierung kritisch für Leben und Erfolg.',
      keyPoints: [
        'Goldene Regel: nicht über 500 Hm pro Tag schlafen.',
        '"Climb high, sleep low": Tagesausflüge höher, dann tiefer schlafen.',
        'Ruhetage alle 3–4 Tage einplanen.',
        'Symptome: Kopfschmerzen, Übelkeit, Schwindel ernst nehmen.',
      ],
      safety: [
        'Bei HACE oder HAPE (Hirn-/Lungenödem): sofort absteigen!',
        'Diamox als prophylaktisches Medikament nur mit Arzt.',
        'Niemals allein in der Todeszone (>8000 m).',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Expedition planen', duration: '20 min', description: 'Von Aufbauzelt bis Sherpa-Auswahl.', content: {
      keyPoints: [
        'Klettergebiete: Alpen → Anden → Himalaya in Schritten.',
        'Genehmigungen: Kilimanjaro frei, Everest 11.000 USD Permit.',
        'Versicherung: Hubschrauberrettung über 6000 m essentiell.',
        'Logistik: Trekking-Agenturen vs. Eigenexpedition.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'HOW TO DROP – Drops springen', duration: '9 min', description: 'Rock my Trail Mountainbikeschule zur Sprung-Technik.', ytVideoId: '6eO9wqmDRB8', channel: 'Rock my Trail Mountainbikeschule', content: {
      intro: 'Der Drop ist der erste echte Trail-Move. Erst mit guter Drop-Technik kannst du Trails ab S2 sicher fahren.',
      keyPoints: [
        'Approach gerade und mit Tempo – nicht bremsen.',
        'Beim Absprung Hinterrad belasten, Vorderrad anlupfen.',
        'In der Luft Knie und Ellbogen leicht beugen.',
        'Landen mit beiden Rädern gleichzeitig (oder Hinterrad zuerst).',
      ],
      safety: ['Erst kleine Drops (20–30 cm) üben, dann steigern.', 'Erschöpft niemals springen – Konzentration ist alles.'],
    }}),
    mod({ id: 'i2', title: 'Spitzkehren & enge Kurven fahren', duration: '11 min', description: 'VeloTOTAL-MTB zur S2+ Trail-Technik.', ytVideoId: 'oXdPPhzttkc', channel: 'VeloTOTAL-MTB', content: {
      keyPoints: [
        'S0: Forstweg, jeder fährt.',
        'S1: leichter Trail, Wurzeln und Steine.',
        'S2: anspruchsvoller, kleine Drops und Spitzkehren.',
        'S3: technisch schwer, ohne Erfahrung gefährlich.',
      ],
    }}),
    mod({ id: 'i3', title: 'Sprünge: Tabletops & Doubles', duration: '14 min', description: 'Park-Skills aufbauen.', content: {
      keyPoints: [
        'Tabletop: flacher Sprung – sicher, gut zum Lernen.',
        'Double: Lücke zwischen Absprung und Landung – nur mit Speed.',
        'Pumptrack lernen: Rhythmus und Linie.',
        'Helm-Setup für Park: Full-Face oder Half-Shell mit Brille.',
      ],
    }}),
    mod({ id: 'i4', title: 'Bike-Setup für Trails', duration: '10 min', description: 'Fahrwerk, Reifendruck, Bremshebel.', content: {
      keyPoints: [
        'Reifendruck: 1.4–1.8 bar je nach Untergrund und Gewicht.',
        'Federgabel-Setup: 25–30 % Sag.',
        'Bremshebel zur Erreichbarkeit verschieben.',
        'Tubeless für weniger Platten und Grip.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'MTB-Disziplinen erklärt', duration: '10 min', description: 'Marc Diekmann zu Downhill, Enduro, Freeride, Trial.', ytVideoId: 'sJ2KHpQ-60s', channel: 'Weber-Werke', content: {
      intro: 'Auf Profiniveau spezialisiert man sich. Diekmann erklärt die Unterschiede der MTB-Disziplinen – jede hat eigene Bikes, Tracks und Skills.',
      keyPoints: [
        'Downhill: nur bergab, schnellste Disziplin (UCI-Worldcup).',
        'Enduro: Mehrere Stages, nur bergab gewertet aber alles fahren.',
        'Freeride: Flow, Stil, große Sprünge (Red Bull Rampage).',
        'Trial: Hindernisse überwinden ohne Bodenkontakt.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Profi-Karriere & Sponsoring', duration: '15 min', description: 'Vom lokalen Race zur UCI-Lizenz.', content: {
      keyPoints: [
        'Deutsche Meisterschaft als nationaler Einstieg.',
        'UCI Junior, U23, Elite-Lizenzen.',
        'Sponsoren: Bike-Hersteller, Component-Brands, Versicherung.',
        'YouTube/Social Media als zusätzlicher Karriere-Pfad.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Carving-Technik für Fortgeschrittene', duration: '12 min', description: 'bergfex Skikurs – das Königsschwingen.', ytVideoId: 'MCHl5FBZfVI', channel: 'bergfex', content: {
      intro: 'Carving ist das, was die meisten Skifahrer wirklich wollen: saubere Spurschnitte mit hoher Geschwindigkeit. Die Technik dahinter kommt aber nicht von alleine.',
      keyPoints: [
        'Aufkanten aktiv aus den Knöcheln, dann Knien.',
        'Außenski stark belasten – 70/30 Verteilung.',
        'Kreuzhang: Schultern bleiben talwärts.',
        'Druckwechsel sauber an der Falllinie.',
      ],
    }}),
    mod({ id: 'i2', title: 'Buckelpiste fahren – Julius Garbe', duration: '10 min', description: 'Weltcupfahrer Julius Garbe zur Moguls-Technik.', ytVideoId: 'knv8K_DhIKg', channel: 'Julian Witting Skiing', content: {
      keyPoints: [
        'Tiefer Stand mit Knien als Stoßdämpfer.',
        'Rhythmus wichtiger als Schwung-Qualität.',
        'Hände vor dem Körper, Stöcke aktiv setzen.',
        'Linie vor dem Buckel wählen, nicht im Buckel.',
      ],
    }}),
    mod({ id: 'i3', title: 'Tiefschnee – die Grundlagen', duration: '12 min', description: 'Vom Pisten- zum Off-Piste-Fahrer.', content: {
      keyPoints: [
        'Mit Druck nach hinten (50/50 statt 40/60).',
        'Längere, runde Schwünge statt kurz und kantig.',
        'Spezielles Equipment: breitere Ski, Rocker-Form.',
        'Lawinen-Set (LVS, Schaufel, Sonde) immer dabei.',
      ],
      safety: ['Niemals allein abseits der Piste.', 'Lawinen-Lagebericht jeden Tag checken.'],
    }}),
    mod({ id: 'i4', title: 'Skitouren – Einstieg', duration: '15 min', description: 'Mit Fellen den Berg hoch.', content: {
      keyPoints: [
        'Tourenski + Tourenbindung + Felle nötig.',
        'Aufstieg mit Spitzkehren – Technik will geübt sein.',
        'LVS-Übung mindestens einmal pro Saison.',
        'Erstmal mit Bergführer oder erfahrenem Partner.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'DSV-Experten-Tipps: Freeride', duration: '12 min', description: 'Deutscher Skiverband zu Off-Piste-Skifahren.', ytVideoId: 'XwriBehdSGQ', channel: 'Deutscher Skiverband', content: {
      intro: 'Freeride ist der Weg vom Pistenfahrer zum echten Bergskifahrer. DSV-Experten erklären, was nötig ist, um sicher und stilvoll abseits der Piste zu fahren.',
      keyPoints: [
        'Druckpunkt nach hinten verlagern für Auftrieb.',
        'Längere, runde Schwünge – nicht kantige Bremser.',
        'Lawinen-Set (LVS, Schaufel, Sonde) immer dabei + Übung.',
        'Hänge-Beurteilung: Steilheit, Aussetzungen, Auslauf.',
      ],
      safety: [
        'Niemals allein im freien Gelände.',
        'Lawinenlagebericht jeden Tag.',
        'Notfall-Rucksack mit LVS-Pieps regelmäßig testen.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Skitouren & Hochalpines', duration: '18 min', description: 'Vom Lift zur Tour.', content: {
      keyPoints: [
        'Tourenski mit Pin-Bindung, Felle, Harscheisen.',
        'Aufstiegstechnik mit Spitzkehren.',
        'Tourenplanung mit Karte, Höhenmesser, GPS.',
        'Lawinen-Kompetenz-Module beim DAV.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Kicker springen – die Basics', duration: '10 min', description: 'Melina Merkhoffer zum ersten Kicker.', ytVideoId: '3yBdgS3L1fE', channel: 'Melina Merkhoffer', content: {
      intro: 'Der erste Kicker-Sprung ist ein Schritt vom Carver zum Freerider. Mit der richtigen Technik fliegst du – statt zu fallen.',
      keyPoints: [
        'Tempo abschätzen am Vortag mit einem Tester.',
        'Squared-Stance am Absprung – Druck auf beide Beine.',
        'Pop am Lip: aktiv abdrücken, nicht einfach drüberfliegen.',
        'Landung: Knie weich, sofort zum Schwung.',
      ],
      safety: ['Helm und Protektoren bei jedem Park-Tag.', 'Erst kleine Kicker (Knee-Level), dann steigern.'],
    }}),
    mod({ id: 'i2', title: 'Switch fahren leicht gemacht', duration: '8 min', description: 'BPM Proshop zur Kontrolle des "falschen" Fuß.', ytVideoId: '5pgVobrpJnU', channel: 'BPM Proshop', content: {
      keyPoints: [
        'Switch ist Pflicht für jeden Park-Snowboarder.',
        'Anfangs auf flacher Piste in der Falllinie üben.',
        'Beide Kanten gleich gut beherrschen.',
        '50/50: 50 % Switch, 50 % Regular fahren.',
      ],
    }}),
    mod({ id: 'i3', title: 'Tiefschnee – die ersten Schwünge', duration: '12 min', description: 'Vom Park ins Backcountry.', content: {
      keyPoints: [
        'Hinteren Fuß stärker belasten – die Nose schwimmt.',
        'Runde, gleichmäßige Schwünge statt kurze Bremser.',
        'Spezielles Pulver-Board oder Rocker-Form.',
        'Lawinen-Wissen ist Pflicht im Backcountry.',
      ],
      safety: ['LVS, Schaufel, Sonde dabei + Übung.', 'Lawinenlagebericht jeden Tag.'],
    }}),
    mod({ id: 'i4', title: 'Park-Etikette', duration: '7 min', description: 'Snowboard-Park Knigge.', content: {
      keyPoints: [
        'Auf Drop In warten, bis vorherige fertig ist.',
        'Nicht in der Landezone stehen bleiben.',
        '"Hörbar dropping in" – ankündigen.',
        'Nach Sturz: Bahn sofort frei machen.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Snowboard 360 lernen', duration: '8 min', description: 'snowmagazine zum Klassiker-Trick.', ytVideoId: 'tyd9qfggctI', channel: 'snowmagazine', content: {
      intro: 'Der 360 ist der ikonische Park-Trick. Wer ihn beherrscht, hat den Schritt vom Park-Hobby zum echten Freestyler gemacht.',
      keyPoints: [
        'Anlauf gerade, mit Tempo.',
        'Drehung beginnt VOR dem Absprung mit Schultern.',
        'In der Luft kompakt – Knie zur Brust.',
        'Landung schaut in die Fahrtrichtung, weich.',
      ],
      safety: ['Auf Airbag oder Schnee-Landung üben.', 'Helm + Rückenprotektor Pflicht.'],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Slopestyle & Big Air Wettkampf', duration: '15 min', description: 'Von X Games bis Olympia.', content: {
      keyPoints: [
        'FIS-Punkte für Wettkampfteilnahmen.',
        'Slopestyle: mehrere Features mit Tricks.',
        'Big Air: einzelner riesiger Sprung mit Pro-Tricks.',
        'Halfpipe: drei Hits pro Run.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Powerplay-ABC: das Überzahlspiel', duration: '10 min', description: 'MySports zum Spezialteam-Spiel.', ytVideoId: 'nDIyVD0Q2tI', channel: 'MySports', content: {
      intro: 'Special Teams (Powerplay und Boxplay) machen rund 20 % der Spielzeit aus. Spiele gewinnt oft, wer hier dominiert.',
      keyPoints: [
        '1-3-1-Formation: ein Spielmacher hinten, drei Forwards.',
        'Umbrella: in Form eines Schirms aufstellen.',
        'Schnelle Pass-Triangulation – nicht stillstehen.',
        'Shooting Lanes öffnen: Spieler stehen versetzt.',
      ],
    }}),
    mod({ id: 'i2', title: 'Boxplay / Unterzahl', duration: '10 min', description: 'Defensiv wirksam unterzahl spielen.', content: {
      keyPoints: [
        'Box-Formation: 2 vorne, 2 hinten.',
        'Aktiv Schussbahnen blockieren.',
        'Lange Pässe in den Mittelkreis vermeiden – Übergeben.',
        'Wechsel-Disziplin: Linien bleiben in Position.',
      ],
    }}),
    mod({ id: 'i3', title: 'Spielsysteme & Forecheck', duration: '14 min', description: 'Strukturiert offensiv spielen.', content: {
      keyPoints: [
        '1-2-2 Forecheck: aggressiv, ein Stürmer presst die Scheibe.',
        '2-1-2 Forecheck: zwei Stürmer im Druckspiel.',
        'Trap (1-3-1): defensiv mit Konter-Fokus.',
        'Center Lane Drive: zentraler Antritt mit Optionen.',
      ],
    }}),
    mod({ id: 'i4', title: 'Konditionstraining für Eishockey', duration: '15 min', description: 'Maximale Sprintkraft 30-60 Sekunden.', content: {
      keyPoints: [
        'Schicht ist 30-60 s Vollgas, dann 1 Min Pause.',
        'Sprintintervalle 30 s an / 30 s aus.',
        'Beinkraft (Kniebeuge, Box Jumps).',
        'Beweglichkeit der Hüfte – essenziell für den Schritt.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Bully-Tutorial mit der Nationalmannschaft', duration: '8 min', description: "Marcel's Hockey School mit Profi-Tipps.", ytVideoId: 'cNcbZ6mznec', channel: "Marcel's Hockey School", content: {
      intro: 'Faceoffs (Bullys) entscheiden Punkte. Auf Profiniveau wird hier jede Mikro-Bewegung optimiert.',
      keyPoints: [
        'Schläger genau auf Punkt, Augen auf den Linesman.',
        'Antritt aus den Knien – Power kommt von unten.',
        'Schläger-Technik: Stick-Lift, Hook, Reverse.',
        'Mit dem Körper den Gegner blocken.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'DEL & NHL: Der Profi-Weg', duration: '15 min', description: 'Karriere im Eishockey.', content: {
      keyPoints: [
        'DNL (Deutsche Nachwuchsliga) als Einstieg.',
        'Oberliga / DEL2 / DEL als deutsche Liga-Stufen.',
        'NHL-Draft für junge Talente (Alter 18).',
        'AHL und ECHL als nordamerikanische Farm-Ligen.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Discofox-Grundschritt', duration: '7 min', description: 'Doodance – in 1 Minute erklärt.', ytVideoId: 'iGz2pLtGv7w', channel: 'Doodance - Online Tanzen lernen!', content: {
      intro: 'Discofox ist der "Allrounder" der Paartänze – funktioniert auf praktisch jeder Hochzeit, in jeder Bar. Mit dem Grundschritt allein bist du tanzfähig.',
      keyPoints: [
        '4/4-Rhythmus, gezählt: 1-2-3-4 oder schnell-schnell-langsam.',
        'Herr führt mit der rechten Hand auf dem Rücken der Dame.',
        'Schrittfolge: Seitwärts, Tap, Seitwärts, Tap.',
        'Dann Drehungen einbauen.',
      ],
    }}),
    mod({ id: 'i2', title: 'Wiener Walzer Rechtsdrehung', duration: '10 min', description: 'AO Dance – die Königsdrehung Step by Step.', ytVideoId: 'aqtWhEGWOrs', channel: 'AO Dance - online Tanzen lernen: Flashmob&Paartanz', content: {
      keyPoints: [
        'Langsamer Walzer: 3/4-Takt, eleganter Stil.',
        'Wiener Walzer: schneller, viele Drehungen.',
        'Tango: scharfer Stil, plötzliche Stopps.',
        'Foxtrott: 4/4, fließende Bewegung – gut für jede Musik.',
      ],
    }}),
    mod({ id: 'i3', title: 'Choreografie selbst bauen', duration: '15 min', description: 'Eine kleine Routine zusammenstellen.', content: {
      keyPoints: [
        'Musik wählen, Beats zählen.',
        'Grundschritt als roter Faden.',
        '8er-Sequenzen bauen – einprägsam.',
        'Aufbauen: Intro – Verse – Chorus – Bridge.',
      ],
    }}),
    mod({ id: 'i4', title: 'Auftritt & Bühnenpräsenz', duration: '10 min', description: 'Vor Publikum tanzen.', content: {
      keyPoints: [
        'Lächeln – wirkt selbstbewusst.',
        'Blickkontakt mit Partner und Publikum.',
        'Falls Fehler: weitermachen, nicht stehenbleiben.',
        'Outfit passend zum Stil.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Tango Argentino – Grundschritt', duration: '8 min', description: 'AO Dance zum traditionellen Profi-Tanz.', ytVideoId: 'AcHFzW9cSts', channel: 'AO Dance - online Tanzen lernen: Flashmob&Paartanz', content: {
      intro: 'Tango Argentino ist der intimste und ausdrucksstärkste Paartanz. Im Gegensatz zum sportlichen Standard-Tango improvisiert man hier komplett — auf höchstem Niveau eine eigene Sprache zwischen Tänzern.',
      keyPoints: [
        '6er-Kachel als Grundmuster, alles improvisiert.',
        'Führung sehr fein – über Brust und Bauch, nicht Arme.',
        'Achten auf "Cabeceo": Blickkontakt vor dem Tanz.',
        'Milongas (Tanzveranstaltungen) als Lerngelegenheit.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Wettkampf-Tanzen WDSF', duration: '15 min', description: 'Vom Hobby zur Turniertanz-Karriere.', content: {
      keyPoints: [
        'WDSF Welttanzsport-Verband für Standard und Latein.',
        'Klassen E, D, C, B, A, S nach Punktesystem.',
        'Trainingsumfang Top-Paare: 30+ Stunden/Woche.',
        'Tanzschuhe, Kleidung, Coach – kostenintensiv.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Wall Run lernen', duration: '8 min', description: 'Freerunning Factory zur klassischen Mauer-Überwindung.', ytVideoId: 'rA0Dy8wzcY0', channel: 'Freerunning Factory', content: {
      intro: 'Der Wall Run ist eine ikonische Parkour-Technik: an einer Wand hochlaufen und das obere Ende greifen. In 3 Schritten geht es.',
      keyPoints: [
        'Anlauf mit Tempo – Geschwindigkeit ist Hebel.',
        'Ersten Schritt mit dem schwächeren Fuß an der Wand.',
        'Zweiten Schritt mit dem stärkeren Fuß zum Hochstoßen.',
        'Mit den Händen die Kante greifen.',
      ],
      safety: ['Erst an niedrigen Wänden üben.', 'Handgelenke und Schultern aufwärmen.'],
    }}),
    mod({ id: 'i2', title: 'Flow & Combinationen', duration: '12 min', description: 'Mehrere Moves verketten.', content: {
      keyPoints: [
        'Flow heißt: keine Pause zwischen Bewegungen.',
        'Vault → Wall Run → Präzision verketten.',
        'Rhythmus wichtig – Bewegung sucht den nächsten Move.',
        'Tempo variieren – nicht alles auf max.',
      ],
    }}),
    mod({ id: 'i3', title: 'Krafttraining für Parkour', duration: '15 min', description: 'Funktionelle Kraft für den Körper.', content: {
      keyPoints: [
        'Klimmzüge, Liegestütze, Pistols (einbeinige Kniebeugen).',
        'Hand-Foot-Coordination: Cat Crawl, Bear Crawl.',
        'Sprungkraft: Plyometrie, Box Jumps.',
        'Beweglichkeit: Hüfte, Schulter, Handgelenk.',
      ],
    }}),
    mod({ id: 'i4', title: 'Mentale Vorbereitung', duration: '10 min', description: 'Sprünge im Kopf vorher meistern.', content: {
      keyPoints: [
        'Visualisierung vor jedem Sprung.',
        'Risk Assessment: kann ich das HEUTE?',
        'Kein Drücken durch andere – nur eigene Entscheidung.',
        'Fortschritt langsam – Parkour ist Geduldssport.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Parkour & Freerunning Level 1–6', duration: '14 min', description: 'urbanamadei zur Progression vom Anfänger zum Profi.', ytVideoId: '7pMGl7C4NxU', channel: 'urbanamadei', content: {
      intro: 'Frontflip, Kong, Backflip, Wallflip — die Profi-Tricks. urbanamadei strukturiert sie nach Schwierigkeitsgraden, damit du verletzungsfrei aufbauen kannst.',
      keyPoints: [
        'Level 1–2: Basics (Vault, Roll, Wall Run).',
        'Level 3–4: Combinations (Kong, Speed Vault).',
        'Level 5–6: Flips (Front, Back, Wall Flip).',
        'Niemals Levels überspringen – Verletzungsrisiko explodiert.',
      ],
      safety: ['Flips erst nach Bodenturnen-Erfahrung.', 'Erst auf Matten, dann auf Gras, niemals direkt auf Beton.'],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Performance & Stunt-Arbeit', duration: '15 min', description: 'Parkour als Beruf.', content: {
      keyPoints: [
        'Stunt-Performer in Film und Fernsehen.',
        'YouTube/Social Media als Hauptkanal vieler Profis.',
        'Stunt-Versicherung essentiell.',
        'Internationale Parkour-Events (Red Bull, NinjaUSA).',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Galopphilfen erklärt', duration: '11 min', description: 'WR-ride your life – Hilfen für die schönste Gangart.', ytVideoId: 'dcGE1wYiPPU', channel: 'WR-ride your life  Riding Academy by Wolfgang Rust', content: {
      intro: 'Der Galopp ist die Königsgangart – aber nur, wenn Reiter und Pferd zusammen arbeiten. Die richtige Hilfengebung macht alles aus.',
      keyPoints: [
        'Aus dem Trab heraus mit dem äußeren Schenkel den Galopp anreiten.',
        'Innerer Schenkel hält die Biegung.',
        'Sitz mitschwingen lassen – nicht versuchen, mit den Beinen zu treiben.',
        'Rechter Handgalopp und linker Handgalopp gleich üben.',
      ],
    }}),
    mod({ id: 'i2', title: 'Springreiten? Aber sicher! Cavaletti', duration: '12 min', description: 'Pferdesport Deutschland zur Cavaletti-Arbeit.', ytVideoId: 'cACofYNRsaA', channel: 'Pferdesport Deutschland', content: {
      keyPoints: [
        'Leichter Sitz (Vorgehalten) für Sprünge.',
        'Cavaletti-Reihen für Rhythmus und Distanz.',
        'Aus dem Galopp anspringen – Tempo halten.',
        'Bügel etwas kürzer als beim Sitzen.',
      ],
    }}),
    mod({ id: 'i3', title: 'Dressur-Aufgaben', duration: '15 min', description: 'A-Niveau Aufgaben erkennen und üben.', content: {
      keyPoints: [
        'Volten in den Ecken sauber reiten.',
        'Tritt-Übergänge: Schritt-Trab-Galopp und zurück.',
        'Hilfengebung leicht und kombiniert.',
        'Im Viereck Linien einhalten – Punkte des Vierecks lernen (A-B-C-X).',
      ],
    }}),
    mod({ id: 'i4', title: 'Pferdetraining-Pläne', duration: '12 min', description: 'Strukturiertes Reiten.', content: {
      keyPoints: [
        '3–5 Trainingseinheiten pro Woche, davon 1× Ruhetag.',
        'Lösungsphase: 15 Min im Schritt und Trab.',
        'Arbeitsphase: Lektionen passend zum Niveau.',
        'Cool-down: 10 Min im Schritt – Pferd trocken werden lassen.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'S-Klasse Dressur – die Krone', duration: '15 min', description: 'ClipMyHorse.TV zur höchsten Dressurklasse.', ytVideoId: 'mUHmS3u14Ss', channel: 'ClipMyHorse.TV Academy', content: {
      intro: 'S-Klasse (Schwer) ist die Königsdisziplin der Dressur. Hier zeigen sich die Lektionen, die Reiter ein Leben lang üben: Piaffe, Passage, fliegende Galoppwechsel.',
      keyPoints: [
        'Piaffe: Trab auf der Stelle, höchste Versammlung.',
        'Passage: erhabener Trab mit Schwebephase.',
        'Fliegende Galoppwechsel: bis zur Einsprung-Sequenz alle 1 Tritt.',
        'Pirouetten: Wendung im Galopp auf der Hinterhand.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Springreiten & Vielseitigkeit', duration: '18 min', description: 'Die olympischen Disziplinen.', content: {
      keyPoints: [
        'Springreiten: Parcours bis 1,60 m im Profibereich.',
        'Vielseitigkeit: Dressur + Cross-Country + Springreiten.',
        'Pferdeauswahl & -ausbildung sind 60 % des Erfolgs.',
        'Profi-Reiter trainieren 6–8 Pferde parallel.',
      ],
    }}),
  ],
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
  fortgeschritten: [
    mod({ id: 'i1', title: 'Bunkerschlag – Konzept und Technik', duration: '10 min', description: 'BIRDIETRAIN zum Standard-Bunkerschlag.', ytVideoId: 'yzbzX9Xa3CU', channel: 'BIRDIETRAIN', content: {
      intro: 'Der Bunkerschlag ist DER Schlag, der Amateure von Wettkampfspielern trennt. Mit der richtigen Technik kommt der Ball jedes Mal raus – und manchmal sogar zum Loch.',
      keyPoints: [
        'Sand-Wedge nutzen, offene Schlagfläche.',
        'Stand breit, leichter Spread.',
        'Hände leicht hinter dem Ball – nicht davor.',
        'Sand 5 cm vor dem Ball treffen – Ball wird vom Sand mitgetragen.',
      ],
    }}),
    mod({ id: 'i2', title: 'Der Chip – einfachste Technik', duration: '8 min', description: 'Florian Raggl Golf zum entscheidenden Short Game.', ytVideoId: '-pLDZLWMxRU', channel: 'Florian Raggl Golf', content: {
      keyPoints: [
        'Chip: kurzer Schlag, läuft viel.',
        'Pitch: höherer Schlag mit mehr Stop.',
        'Kontrollierte Schwunglänge: Brust-Brust = mittlere Distanz.',
        'Hände aktiv, Handgelenke locker.',
      ],
    }}),
    mod({ id: 'i3', title: 'Driver-Schwung verbessern', duration: '15 min', description: 'Längere und präzisere Abschläge.', content: {
      keyPoints: [
        'Schwung breit aufbauen – nicht steil.',
        'Hüfte führt die Bewegung.',
        'Treffpunkt leicht oberhalb der Schläger-Mitte (Sweet Spot).',
        'Aufwärts-Treffmoment für maximale Distanz.',
      ],
    }}),
    mod({ id: 'i4', title: 'Mentales Spielmanagement', duration: '12 min', description: 'Score-Management auf 18 Loch.', content: {
      keyPoints: [
        'Pre-Shot-Routine: gleicher Ablauf vor jedem Schlag.',
        'Schlag vergessen, nächster ist neu.',
        'Bei schwierigen Lagen: konservativ spielen.',
        'Atmen, lockern, Schwung.',
      ],
    }}),
  ],
  profi: [
    mod({ id: 'p1', title: 'Kurzer Pitch mit Backspin', duration: '9 min', description: 'Alexander Marx zum Profi-Schlag im kurzen Spiel.', ytVideoId: 'AyuJxHNCj6U', channel: 'Alexander Marx', content: {
      intro: 'Der kurze Pitch mit viel Backspin ist DER Schlag der Tour-Profis. Der Ball landet, springt einmal und bleibt stehen — pure Magie für Zuschauer.',
      keyPoints: [
        'Wedge mit hohem Loft (56°+ Sand Wedge).',
        'Stand offen, Ball leicht hinter der Mitte.',
        'Schlagfläche offen halten.',
        'Beschleunigung durch den Ball – kein Bremsen.',
        'Boden VOR dem Ball treffen für maximalen Spin.',
      ],
    }}),
    periodisierungModule,
    mentaltrainingModule,
    mod({ id: 'p4', title: 'Tour-Karriere: PGA, DP World, LIV', duration: '18 min', description: 'Der Profi-Karriere-Pfad im Golf.', content: {
      keyPoints: [
        'Q-School (Qualifying School) als Einstieg.',
        'Korn Ferry Tour als Sprungbrett zur PGA Tour.',
        'DP World Tour (früher European Tour) für Europa.',
        'Mental Coaching, Caddie, Manager – das Team eines Profis.',
      ],
    }}),
  ],
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

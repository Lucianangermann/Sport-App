import type { SkillLevel, SportCurriculum, TrainingModule } from '../types';
import { SPORTS } from './sports';

/* -------------------------------------------------------------------------- */
/*  Generic fallback curriculum (used for sports without bespoke content yet) */
/* -------------------------------------------------------------------------- */

const genericBeginner: TrainingModule[] = [
  {
    id: 'b1',
    title: 'Grundlagen & Regeln',
    description: 'Die wichtigsten Regeln, Begriffe und Disziplinen im Überblick.',
    duration: '15 min',
  },
  {
    id: 'b2',
    title: 'Erste Bewegungen',
    description: 'Fundamentale Bewegungsabläufe, sauber und kontrolliert.',
    duration: '20 min',
  },
  {
    id: 'b3',
    title: 'Ausrüstung verstehen',
    description: 'Was du wirklich brauchst – und was nicht.',
    duration: '10 min',
  },
  {
    id: 'b4',
    title: 'Aufwärmen richtig',
    description: 'Verletzungen vermeiden, Leistung steigern.',
    duration: '12 min',
  },
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
      'Plane Regeneration AKTIV: leichte Mobility-Einheiten zählen.',
    ],
    sources: [
      { title: 'Trainingsperiodisierung erklärt (YouTube)', url: 'https://www.youtube.com/watch?v=XN3SKiZWJXI' },
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
      'Visualisierung: jeden Tag 5 Minuten den perfekten Bewegungsablauf vor dem inneren Auge durchspielen.',
      'Atemanker: 4 Sekunden ein – 6 Sekunden aus, beruhigt das vegetative Nervensystem.',
      'Selbstgespräch: ersetze "nicht ins Aus" durch "ins Feld spielen" – das Gehirn liebt positive Bilder.',
      'Routinen: ein fester Ablauf vor dem Wettkampf reduziert Entscheidungsstress.',
      'Reframing: Nervosität als Energie deuten, nicht als Bedrohung.',
    ],
    tips: [
      'Vor dem Einschlafen 60 Sekunden visualisieren – das Unterbewusstsein arbeitet weiter.',
      'Einen "Anker" definieren (z. B. ein Wort), an dem du dich im Wettkampf festhalten kannst.',
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Sport-specific curricula with verified YouTube content                    */
/* -------------------------------------------------------------------------- */

const fussball: SportCurriculum = {
  sportId: 'fussball',
  anfaenger: [
    {
      id: 'b1',
      title: 'Der Innenseitstoß',
      duration: '6 min',
      description: 'Die Grundlage jedes Passes – der saubere Innenseitstoß.',
      ytVideoId: 'DIA-TUeV09E',
      channel: 'Glosemeyer85',
      content: {
        intro:
          'Der Innenseitstoß ist der wichtigste Pass im Fußball: präzise, kontrolliert, einfach zu lernen. Er bildet das Fundament für jedes weitere Passspiel.',
        keyPoints: [
          'Standbein neben den Ball stellen, etwa 15 cm Abstand.',
          'Schuss-Spitzfuß angezogen und fixiert – stabiles Sprunggelenk.',
          'Mit der Innenseite (nicht der Spitze) den Ball mittig treffen.',
          'Oberkörper leicht über den Ball – sonst hebt er ab.',
          'Den Schuss durchziehen, nicht stoppen.',
        ],
        tips: [
          'Übe zuerst gegen eine Wand – sofortiges Feedback.',
          'Konzentriere dich auf Trefferpunkt am Fuß, nicht auf das Ziel.',
        ],
      },
    },
    {
      id: 'b2',
      title: '9 Varianten der Ballannahme',
      duration: '8 min',
      description: 'Flache und hohe Bälle sauber annehmen und ins Spiel bringen.',
      ytVideoId: 'HfV67rCgMI4',
      channel: 'All About Football',
      content: {
        intro:
          'Eine gute Ballannahme entscheidet, ob die nächste Aktion gelingt. Du lernst Annahme mit Innenseite, Außenseite, Sohle, Brust und Oberschenkel.',
        keyPoints: [
          'Erster Kontakt = nächste Aktion. Plane die Annahme vor dem Ball.',
          'Annahmefläche locker halten – nicht versteifen.',
          'Bei hohen Bällen den Ball "abfedern", als würdest du ein Ei fangen.',
          'Mitnahme in die Richtung, in die du als Nächstes spielen willst.',
        ],
        tips: [
          'Üben im 1-gegen-1-Drill: Annahme + sofortige Bewegung gegen Druck.',
          'Augen offen lassen – schon vor dem Kontakt das Umfeld scannen.',
        ],
      },
    },
    {
      id: 'b3',
      title: 'Kopfball – 4 Schritte zum perfekten Header',
      duration: '7 min',
      description: 'Timing, Sprungtechnik und Stirn-Kontakt für sichere Kopfbälle.',
      ytVideoId: 'SYjEF6SSMg0',
      channel: 'Camill Hauser',
      content: {
        intro:
          'Viele Kopfbälle scheitern nicht am Sprung, sondern am Trefferpunkt. Mit diesen vier Schritten lernst du, den Ball aktiv mit der Stirn zu spielen.',
        keyPoints: [
          'Absprung mit einem Bein, kraftvoll abdrücken.',
          'Augen geöffnet halten bis zum Kontakt.',
          'Mit der Stirn treffen – nicht mit Scheitel oder Nase.',
          'Aktive Nackenbewegung: peitsche den Kopf nach vorne.',
        ],
        safety: [
          'Im Jugendbereich werden Kopfbälle reduziert – baue Kraft im Nacken auf, bevor du intensiv übst.',
          'Bei Schwindel oder Kopfschmerzen sofort pausieren.',
        ],
      },
    },
    {
      id: 'b4',
      title: 'Aufwärmen vor jedem Training',
      duration: '12 min',
      description: 'Dynamisches Aufwärmen mit Mobility, Aktivierung und Ballgefühl.',
      content: {
        intro:
          'Verletzungen passieren überproportional in den ersten 15 Minuten. Ein strukturiertes Warm-up senkt das Risiko und macht dich gleich von der ersten Aktion bereit.',
        keyPoints: [
          '5 min lockeres Joggen mit Richtungswechseln.',
          'Dynamische Mobility: Hüftöffner, Beinpendel, Ausfallschritte.',
          'Aktivierung: kurze Sprints (5 × 20 m), Side-Steps, Antritte.',
          'Ballgefühl: Pässe mit ansteigendem Tempo, Annahme + Pass.',
        ],
        tips: ['Beim Mannschaftstraining das FIFA 11+ Programm einbauen – wissenschaftlich validiert.'],
      },
    },
  ],
  fortgeschritten: [
    {
      id: 'i1',
      title: '5 Methoden für den Spielaufbau',
      duration: '12 min',
      description: 'Wie modernes Aufbauspiel funktioniert – Räume erkennen, Linien überspielen.',
      ytVideoId: 'QQt_MQy4cYM',
      channel: "Sam's Fußball Channel",
      content: {
        intro:
          'Spielaufbau heißt: kontrolliert von hinten ins Angriffsdrittel kommen. Wir gehen fünf konkrete Muster durch, die du im nächsten Spiel anwenden kannst.',
        keyPoints: [
          'Tiefe und Breite gleichzeitig – das Feld groß machen.',
          'Dreieck als Grundform: immer zwei Anspielstationen.',
          'Linien überspielen: Pass durch die gegnerische Pressinglinie.',
          'Schnelles Umschalten nach Ballgewinn (5-Sekunden-Regel).',
        ],
        tips: ['Schau Spiele mit Notizblock – markiere jede Aktion, die Linien überspielt.'],
      },
    },
    {
      id: 'i2',
      title: 'Spielaufbau in der Dreierkette',
      duration: '14 min',
      description: 'Trainingsformen aus dem Deutschen Fußball Internat für eine 3er-Kette.',
      ytVideoId: 'UqiT1HgEszg',
      channel: 'Deutsches Fußball Internat',
      content: {
        intro:
          'Die Dreierkette ist taktisch flexibel und dominiert in vielen Top-Ligen. Du lernst die Grundbewegungen und Anspielmuster.',
        keyPoints: [
          'Außenverteidiger schieben in der Verteidigung weit nach vorne.',
          'Sechser kippt zwischen die Innenverteidiger ab – kurze Anspielstation.',
          'Verlagerungen sind das Mittel der Wahl gegen kompaktes Pressing.',
        ],
      },
    },
    {
      id: 'i3',
      title: 'Kopfball-Training für Fortgeschrittene',
      duration: '10 min',
      description: 'Übungen mit Timing-Fokus und Sprungkraft – wie im Internat trainiert.',
      ytVideoId: 'vN7BefbV8sM',
      channel: 'Deutsches Fußball Internat',
    },
    {
      id: 'i4',
      title: 'Regeneration nach intensiven Spielen',
      duration: '8 min',
      description: 'Auslaufen, Eisbad, Schlaf – was wirklich hilft.',
      content: {
        intro: 'Nach 90 Minuten Vollgas entscheidet die Erholung über den nächsten Auftritt.',
        keyPoints: [
          'Erste 30 Min nach dem Spiel: Kohlenhydrate + Eiweiß auffüllen.',
          'Auslaufen / Lockern für 10 Min senkt Muskelkater.',
          'Schlaf ist Trainingsmittel Nr. 1 – 8–9 h für Sportler.',
          'Kalt-Warm-Duschen als günstige Alternative zum Eisbad.',
        ],
      },
    },
  ],
  profi: [periodisierungModule, mentaltrainingModule, genericAdvanced[0], genericAdvanced[3]],
};

const basketball: SportCurriculum = {
  sportId: 'basketball',
  anfaenger: [
    {
      id: 'b1',
      title: 'Dribbling Basics mit Steffen Hamann',
      duration: '6 min',
      description: 'FC Bayern Basketball Tutorial – die Grundlagen des sicheren Dribblings.',
      ytVideoId: 'kjbY0yaE_3E',
      channel: 'FC Bayern Basketball',
      content: {
        intro:
          'Dribbling ist die wichtigste Fähigkeit im Basketball – aus jedem Move startet ein Dribbling oder ein Pass. Hier zeigt dir ein Bundesliga-Profi die Basics.',
        keyPoints: [
          'Tief in den Knien – Schwerpunkt nach unten.',
          'Ball mit den Fingerkuppen führen, nicht mit der Handfläche.',
          'Blick nach vorne, nie auf den Ball.',
          'Mit beiden Händen üben – die schwächere Hand zuerst.',
        ],
        tips: ['Tägliches 5-Minuten-Drill: 100 Dribblings rechts, 100 links, 50 wechselseitig.'],
      },
    },
    {
      id: 'b2',
      title: 'Dribbling: Technik & Zeitlupe',
      duration: '5 min',
      description: 'Bewegungsanalyse in Slow-Motion – worauf es bei der Hand kommt.',
      ytVideoId: 'IJ5wHEpTkL8',
      channel: 'vlamingo',
    },
    {
      id: 'b3',
      title: 'Der Korbleger (Layup)',
      duration: '11 min',
      description: 'Ausführliches Tutorial – Schrittfolge, Absprung, weicher Ablauf am Brett.',
      ytVideoId: 'MDwpCVqtoz4',
      channel: 'True Rimdoc',
      content: {
        intro:
          'Der Korbleger ist die häufigste Punkteform im Basketball. Mit der richtigen Schrittfolge wird er auch unter Gegnerdruck zur sicheren Bank.',
        keyPoints: [
          'Schrittfolge rechts: rechts – links – Absprung links.',
          'Hochziehen des Spielbein-Knies für Drive und Schutz.',
          'Den Ball mit der korbfernen Hand schützen.',
          'Sanft am Brett ablegen – nicht hineinwerfen.',
        ],
        tips: ['Beide Seiten gleich oft üben – das ist auf Spielniveau Pflicht.'],
      },
    },
    {
      id: 'b4',
      title: 'Wurftechnik – Der perfekte Korbwurf',
      duration: '10 min',
      description: 'Basketball Basics mit Niels Giffey (BBL) – Schritt-für-Schritt zum sauberen Wurf.',
      ytVideoId: 'hd0fKRokd84',
      channel: 'easyCredit Basketball Bundesliga',
      content: {
        intro:
          'Eine sauber wiederholbare Wurftechnik ist das Fundament jedes Scorers. BBL-Profi Niels Giffey zeigt dir die Bausteine.',
        keyPoints: [
          'Füße zum Korb ausrichten ("ten toes to the rim").',
          'Wurfarm bildet ein "L" – Ball auf den Fingerspitzen, nicht in der Handfläche.',
          'Hochstrecken und durchziehen – Hand zeigt nach dem Wurf in den Korb.',
          'Gleichmäßiger Rhythmus aus den Beinen, nicht aus dem Arm.',
        ],
      },
    },
  ],
  fortgeschritten: [
    {
      id: 'i1',
      title: 'Defense Helpside',
      duration: '7 min',
      description: 'Die wichtigste defensive Bewegung im Teamspiel – wann du herunterhelfen musst.',
      ytVideoId: 'koNygTlamzQ',
      channel: 'FC Bayern Basketball',
      content: {
        intro:
          'Helpside-Defense ist das, was gute Teams von Hobby-Teams unterscheidet. Du lernst, wann du deinen direkten Gegenspieler verlässt, um zu helfen.',
        keyPoints: [
          'Die "I-Linie" zwischen Ball und deinem Gegner immer im Blick.',
          'Helpside heißt: ein Schritt in Richtung Ball, Hände aktiv.',
          'Closeout nach dem Pass: kurze Schritte, hohe Hand.',
        ],
      },
    },
    {
      id: 'i2',
      title: 'Pick & Roll – Angriff & Verteidigung',
      duration: '15 min',
      description: 'Das wichtigste Spielmuster der NBA – verstehen und lesen lernen.',
      content: {
        intro:
          'Pick & Roll dominiert das moderne Basketball. Lerne die fünf häufigsten Coverages und wann welche Lösung optimal ist.',
        keyPoints: [
          'Drop: Center bleibt tief, kein 3er-Wurf-Druck.',
          'Hedge: Center geht kurz mit raus, dann Recovery.',
          'Switch: einfache Lösung gegen schwache Mismatches.',
          'Trap: aggressive Doppelung, zwingt zum Pass.',
        ],
      },
    },
    {
      id: 'i3',
      title: 'Konditionstraining für Basketballer',
      duration: '20 min',
      description: 'Sprint-Intervalle, Sprungkraft, Beweglichkeit – sportartspezifisch.',
    },
    {
      id: 'i4',
      title: 'Spielsysteme verstehen',
      duration: '18 min',
      description: 'Motion Offense vs. Pick & Roll Sets – welches passt zu deinem Team?',
    },
  ],
  profi: [periodisierungModule, mentaltrainingModule, genericAdvanced[0], genericAdvanced[3]],
};

const yoga: SportCurriculum = {
  sportId: 'yoga',
  anfaenger: [
    {
      id: 'b1',
      title: 'Sonnengruß für Anfänger',
      duration: '10 min',
      description: 'Langsam und exakt – die wichtigste Yoga-Sequenz Schritt für Schritt.',
      ytVideoId: 'MYIUYHFIpJw',
      channel: 'YOGABASICS',
      content: {
        intro:
          'Der Sonnengruß (Surya Namaskar) ist die ikonische Yoga-Sequenz. Er wärmt den Körper auf, mobilisiert die Wirbelsäule und verbindet Atmung mit Bewegung.',
        keyPoints: [
          'Jede Bewegung mit einem Atemzug verbinden – ein Ein, ein Aus.',
          'Stehende Vorbeuge: Knie beugen ist erlaubt!',
          'Plank: Schultern über Handgelenken, Po nicht hängen lassen.',
          'Aufwärts schauender Hund: nur, wenn die untere Rückenmuskulatur stabil ist.',
        ],
        tips: ['Starte mit 3 Runden täglich. Steigere langsam auf 12 – ein klassisches Pensum.'],
        safety: ['Bei Bandscheibenproblemen: keine tiefen Rückbeugen ohne Lehrer.'],
      },
    },
    {
      id: 'b2',
      title: 'Krieger 1, 2 und 3 lernen',
      duration: '15 min',
      description: 'Die drei wichtigsten stehenden Posen – Schritt für Schritt.',
      ytVideoId: 'wgdj7-C75m0',
      channel: 'YOGABASICS',
      content: {
        intro:
          'Die Krieger-Posen (Virabhadrasana) stärken Beine, öffnen die Hüfte und schulen Balance. Sie sind in fast jeder Yoga-Klasse präsent.',
        keyPoints: [
          'Krieger 1: vorderes Knie über dem Knöchel, hinterer Fuß im 45°-Winkel.',
          'Krieger 2: Hüfte zur Seite öffnen, Arme parallel zum Boden.',
          'Krieger 3: aktiv aus dem Hüftgelenk in die Waagrechte heben.',
        ],
        tips: ['Aktiviere die Bauchmuskulatur in allen drei Varianten – das stabilisiert die Wirbelsäule.'],
      },
    },
    {
      id: 'b3',
      title: 'Wechselatmung für Anfänger',
      duration: '8 min',
      description: 'Nadi Shodana – die beruhigende Atemtechnik für Fokus & Balance.',
      ytVideoId: '6Ct6N1vEWhQ',
      channel: 'Mady Morrison',
      content: {
        intro:
          'Pranayama (Atemarbeit) ist Yoga jenseits der Asanas. Die Wechselatmung beruhigt das Nervensystem in unter 10 Minuten messbar.',
        keyPoints: [
          'Daumen schließt das rechte Nasenloch, Ringfinger das linke.',
          'Links einatmen, rechts ausatmen – rechts einatmen, links ausatmen.',
          'Atemzüge gleichmäßig zählen (z. B. 4-4-4-4).',
          'Sitz aufrecht, Schultern entspannt.',
        ],
      },
    },
    {
      id: 'b4',
      title: 'Sicher in den ersten Asanas',
      duration: '8 min',
      description: 'Wann pausieren, wann modifizieren? Anfänger-Checkliste.',
      content: {
        intro:
          'Yoga ist sicher – wenn du auf den Körper hörst. Diese Hinweise helfen, typische Anfängerfehler zu vermeiden.',
        safety: [
          'Schmerz im Knie = sofort raus aus der Pose, niemals "durchhalten".',
          'Bei Bluthochdruck keine kopfüber-Haltungen.',
          'In der Schwangerschaft nur spezialisierten Klassen folgen.',
          'Klötze und Gurte sind keine Krücken – sie machen besseres Yoga möglich.',
        ],
      },
    },
  ],
  fortgeschritten: [
    {
      id: 'i1',
      title: 'Krieger 3 – Variationen',
      duration: '9 min',
      description: 'Balance schulen, Hüftöffnung und propriozeptive Kontrolle.',
      ytVideoId: 'jrDdVEvfFfs',
      channel: 'Yoga Individual',
    },
    {
      id: 'i2',
      title: 'Power Vinyasa Flow (60 Min)',
      duration: '60 min',
      description: 'Eine kraftvolle Stunde – Sonnengruß, Krieger, Balancen und Twists.',
      ytVideoId: 'Z2saufuHh4w',
      channel: 'Mascha Trietsch',
      content: {
        intro:
          'Vinyasa heißt: jede Bewegung mit dem Atem verbinden. In dieser Stunde kombinierst du Kraft, Mobilität und Balance zu einem durchgängigen Flow.',
        keyPoints: [
          'Bewege dich nur, solange du tief und gleichmäßig atmen kannst.',
          'Bei Erschöpfung: Kindhaltung (Balasana) ist immer eine Option.',
          'Drei Bandhas (Beckenboden, Bauch, Kehle) aktiv halten für Stabilität.',
        ],
      },
    },
    {
      id: 'i3',
      title: 'Hüftöffner-Reihe',
      duration: '20 min',
      description: 'Lange gehaltene Posen für Beweglichkeit der Hüftgelenke.',
    },
    {
      id: 'i4',
      title: 'Rückbeugen sicher aufbauen',
      duration: '15 min',
      description: 'Von Bridge zu Rad – Voraussetzungen für tiefe Rückbeugen.',
      content: {
        safety: [
          'Tiefe Rückbeugen nie aus dem unteren Rücken machen – Brustwirbelsäule mobilisieren.',
          'Wenn der Nacken überstreckt: kürzere Range arbeiten.',
        ],
      },
    },
  ],
  profi: [
    {
      id: 'p1',
      title: 'Kopfstand (Sirsasana) lernen',
      duration: '12 min',
      description: 'Vorbereitung und fortgeschrittenere Variation – Schritt für Schritt.',
      ytVideoId: 'x9y97j4uI_w',
      channel: 'Mascha Trietsch',
      content: {
        intro:
          'Der Kopfstand gilt als König der Asanas. Er fordert Kraft, Kontrolle und Demut. Diese Anleitung führt dich sicher heran.',
        keyPoints: [
          'Unterarmstand vor Kopfstand üben – baut die nötige Schulterkraft auf.',
          'Kopfposition: Scheitel auf dem Boden, NICHT Stirn oder Nacken.',
          '70 % Gewicht auf den Unterarmen, 30 % auf dem Kopf – nie umgekehrt.',
          'Beine kontrolliert heben, nicht schwingen.',
        ],
        safety: [
          'Bei Nackenproblemen, Bluthochdruck oder Glaukom NICHT üben.',
          'Erste Versuche immer an der Wand – auch nach Monaten.',
        ],
      },
    },
    mentaltrainingModule,
    periodisierungModule,
    {
      id: 'p4',
      title: 'Yoga als Lehrer:in weitergeben',
      duration: '20 min',
      description: 'Cue-Sprache, Hands-on-Assists und Klassen-Aufbau.',
    },
  ],
};

const laufen: SportCurriculum = {
  sportId: 'laufen',
  anfaenger: [
    {
      id: 'b1',
      title: 'Von 0 auf 5 km – 8 Wochen Trainingsplan',
      duration: '11 min',
      description: 'Der klassische Einstieg in den Laufsport – mit konkretem Plan.',
      ytVideoId: 'U94gD-isdeE',
      channel: 'ausdauerclub',
      content: {
        intro:
          'In 8 Wochen schaffst du deine ersten 5 km am Stück – wenn du strukturiert vorgehst. Der Plan startet mit Geh-Lauf-Intervallen und steigert sich behutsam.',
        keyPoints: [
          '3 Einheiten pro Woche mit mindestens 24 h Pause dazwischen.',
          'Tempo so wählen, dass du dich noch unterhalten kannst.',
          'Steigern über Zeit, nicht über Geschwindigkeit.',
          'Eine Pause-Woche alle 4 Wochen einbauen.',
        ],
      },
    },
    {
      id: 'b2',
      title: '6-Wochen-Trainingsplan für 5 km',
      duration: '12 min',
      description: 'Eine straffere Variante mit klarer Wochenstruktur.',
      ytVideoId: '3F-jtzPCTrw',
      channel: 'ONESTEPFASTER UG',
    },
    {
      id: 'b3',
      title: 'Richtig atmen beim Joggen',
      duration: '8 min',
      description: 'Atemtechnik, Atemrhythmus – nie wieder Seitenstechen.',
      ytVideoId: 'm52QiGiaICw',
      channel: 'runnersflow',
      content: {
        intro:
          'Falsche Atmung ist die Nr.-1-Ursache für Seitenstechen und vorzeitige Erschöpfung. Mit ein paar Anpassungen läufst du locker länger.',
        keyPoints: [
          'Tief in den Bauch atmen, nicht in die Brust.',
          'Atemrhythmus an Schrittfolge koppeln: 3-2 (3 ein, 2 aus) für Tempolauf, 4-4 für Dauerlauf.',
          'Durch Mund UND Nase – mehr Sauerstoff.',
          'Bei Seitenstechen: kurz langsamer werden, tief ausatmen.',
        ],
      },
    },
    {
      id: 'b4',
      title: 'Lauftechnik & Atmung – RUNNER\'S WORLD',
      duration: '6 min',
      description: 'Expert:innen erklären die korrekte Atmung systematisch.',
      ytVideoId: 'SHFDUHbbke4',
      channel: "RUNNER'S WORLD",
    },
  ],
  fortgeschritten: [
    {
      id: 'i1',
      title: 'Marathon-Vorbereitung: Die Grundlagen',
      duration: '14 min',
      description: 'Andreas Butz erklärt, wie ein Marathon-Aufbau strukturell aussieht.',
      ytVideoId: '-nM47Dd4S0g',
      channel: 'Andreas Butz',
      content: {
        intro:
          'Vom 10er auf den Marathon ist ein Sprung. Diese Grundlagen brauchst du, bevor du dich für deinen ersten Marathon anmeldest.',
        keyPoints: [
          'Mindestens 12–16 Wochen reine Vorbereitungszeit.',
          'Long Run bis ~32 km, nicht weiter im Training.',
          'Tempotraining 1× pro Woche, Schwellentempo.',
          'Carbo-Loading 2–3 Tage vor dem Wettkampf.',
        ],
      },
    },
    {
      id: 'i2',
      title: 'Intervalltraining strukturieren',
      duration: '10 min',
      description: 'Welche Intervalle gibt es und wofür eignen sie sich?',
      content: {
        intro:
          'Intervalle sind das Werkzeug, mit dem du schneller wirst. Aber zu viel davon führt zu Verletzungen.',
        keyPoints: [
          'Kurze Intervalle (200–400 m): Schnelligkeit.',
          'Mittlere Intervalle (800–1.600 m): VO₂max.',
          'Lange Intervalle (>2.000 m): Schwellentempo.',
          'Höchstens 1–2 Intervall-Einheiten pro Woche.',
        ],
      },
    },
    {
      id: 'i3',
      title: 'Ernährung für Läufer',
      duration: '12 min',
      description: 'Kohlenhydrate, Salz, Hydration – was vor, während und nach dem Lauf.',
    },
    {
      id: 'i4',
      title: 'Verletzungen vorbeugen',
      duration: '15 min',
      description: 'Läuferknie, Achillessehne, Schienbein – die häufigsten Probleme.',
      content: {
        safety: [
          'Steigere wöchentliches Volumen um maximal 10 %.',
          'Schuhe nach 600–800 km wechseln.',
          'Krafttraining 2× pro Woche ist Verletzungs-Prävention.',
        ],
      },
    },
  ],
  profi: [
    periodisierungModule,
    mentaltrainingModule,
    {
      id: 'p3',
      title: 'Höhentraining & Laktatdiagnostik',
      duration: '18 min',
      description: 'Was wirklich die Leistung an der Spitze trennt.',
    },
    {
      id: 'p4',
      title: 'Pacing-Strategien im Wettkampf',
      duration: '12 min',
      description: 'Negative Splits, Pace-Pläne, Renntaktik.',
    },
  ],
};

const krafttraining: SportCurriculum = {
  sportId: 'krafttraining',
  anfaenger: [
    {
      id: 'b1',
      title: 'Trainingsplan für Anfänger',
      duration: '13 min',
      description: 'Ein 3–4-Tage-Plan, der wirklich funktioniert.',
      ytVideoId: '4PJfrREOigM',
      channel: 'Jessica Bock',
      content: {
        intro:
          'Als Anfänger:in profitierst du am meisten von einem Ganzkörperplan. Diese Routine deckt alle wichtigen Muskelgruppen ab – ohne Schnickschnack.',
        keyPoints: [
          'Drei Ganzkörper-Workouts pro Woche, je 45–60 Min.',
          'Sechs Grundübungen: Kniebeuge, Kreuzheben, Bankdrücken, Rudern, Schulterdrücken, Klimmzug.',
          '3–4 Sätze à 8–12 Wiederholungen.',
          'Letzte 1–2 Wiederholungen sollen wirklich schwer sein.',
        ],
      },
    },
    {
      id: 'b2',
      title: 'Neulinge im Gym',
      duration: '10 min',
      description: 'Wie ein Anfängerplan im Studio aussieht.',
      ytVideoId: 'AIUaHSmYblc',
      channel: 'Patricia Kraft',
    },
    {
      id: 'b3',
      title: 'Aufwärmen mit dem Gewicht',
      duration: '7 min',
      description: 'Spezifisches Warmup an der Langhantel.',
      content: {
        intro:
          'Kaltes Gewicht ist Verletzungsgefahr. Das spezifische Warmup ist Pflicht für jede Hauptübung.',
        keyPoints: [
          '5 Min lockere Aufwärmrunde (Cardio).',
          'Mobility für die belasteten Gelenke (Schulter/Hüfte/Sprunggelenk).',
          'Aufwärmsätze: leere Stange × 8 → 50 % × 5 → 70 % × 3 → 85 % × 1.',
        ],
      },
    },
    {
      id: 'b4',
      title: 'Sicherheit im Studio',
      duration: '8 min',
      description: 'Spotter, Klemmen, Abräumen – Etikette und Sicherheit.',
      content: {
        safety: [
          'Klemmen an der Langhantel sind nicht optional.',
          'Bei schwerem Bankdrücken: Spotter oder Power Rack.',
          'Niemals mit verdrehter Wirbelsäule heben.',
        ],
      },
    },
  ],
  fortgeschritten: [
    {
      id: 'i1',
      title: 'Kniebeuge / Squat – Korrekte Technik',
      duration: '10 min',
      description: 'Die wichtigste Ganzkörperübung – sauber und sicher.',
      ytVideoId: 'BwuC74wVQT4',
      channel: 'Work It Training',
      content: {
        intro:
          'Die Kniebeuge ist die "Königin" der Übungen. Mit sauberer Technik baust du Beine, Po und Rumpf – und schützt dich vor Verletzungen.',
        keyPoints: [
          'Füße schulterbreit, Zehen leicht nach außen.',
          'Hüfte UND Knie gleichzeitig beugen.',
          'Knie folgen der Zehenspitze – kein Einknicken nach innen.',
          'Rücken neutral, Brust offen.',
          'Bis mindestens parallel runter – sonst zählt es nicht.',
        ],
        safety: [
          'Bei Beweglichkeitsdefiziten in den Sprunggelenken: Heeled Shoes oder Erhöhung nutzen.',
          'Schwere Sätze NUR im Rack mit Safety Pins.',
        ],
      },
    },
    {
      id: 'i2',
      title: 'Kreuzheben / Deadlift – Schritt für Schritt',
      duration: '12 min',
      description: 'Der Klassiker der Ganzkörperkraft – sicher gelernt.',
      ytVideoId: 'gRfFdvXpEEU',
      channel: 'Kernwerk® Functional Fitness',
      content: {
        intro:
          'Kreuzheben trainiert mehr Muskeln als jede andere Übung – aber falsch ausgeführt ist es auch das Risikoreichste.',
        keyPoints: [
          'Stange direkt vor dem Schienbein, Mittelfuß darunter.',
          'Schulterblätter nach hinten/unten ziehen.',
          'Hüfte zuerst hoch, dann Schultern – nicht der Rücken.',
          'Stange am Körper entlangführen, fast wie Schwung beim Aufstehen.',
        ],
        safety: [
          'Niemals mit gerundetem unteren Rücken heben.',
          'Atmung: tief einatmen vor dem Heben, ausatmen oben.',
        ],
      },
    },
    {
      id: 'i3',
      title: 'Volumen, Intensität & Frequenz',
      duration: '15 min',
      description: 'Die drei Stellschrauben des Trainings – wie du sie austarierst.',
      content: {
        intro:
          'Fortschritt entsteht durch progressive Überlastung. Du kannst Volumen (Sätze × Wdh.), Intensität (Last) oder Frequenz (Häufigkeit) steigern.',
        keyPoints: [
          'Anfänger: Last steigern (lineare Progression).',
          'Fortgeschrittene: Volumen erhöhen (z. B. von 12 auf 16 Sätzen/Muskel/Woche).',
          'Plateaus brechen durch Wechsel des Schemas.',
        ],
      },
    },
    {
      id: 'i4',
      title: 'Ernährung für Muskelaufbau',
      duration: '12 min',
      description: 'Kalorienüberschuss, Protein, Timing – die Basics.',
      content: {
        keyPoints: [
          '~10 % über Kalorienverbrauch = sauberer Aufbau.',
          '1,6–2,2 g Protein pro kg Körpergewicht.',
          'Verteilung über 3–4 Mahlzeiten.',
          'Genug Kohlenhydrate für die Performance.',
        ],
      },
    },
  ],
  profi: [
    periodisierungModule,
    mentaltrainingModule,
    {
      id: 'p3',
      title: 'Powerlifting-Spezialisierung',
      duration: '20 min',
      description: 'Maximalkraft systematisch entwickeln.',
    },
    {
      id: 'p4',
      title: 'Coaching: Form-Checks geben',
      duration: '15 min',
      description: 'Wie du Bewegung analysierst und cued.',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Curricula registry                                                        */
/* -------------------------------------------------------------------------- */

const BESPOKE: Record<string, SportCurriculum> = {
  fussball,
  basketball,
  yoga,
  laufen,
  krafttraining,
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

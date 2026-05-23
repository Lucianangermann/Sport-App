import { useCallback, useState } from 'react';
import type { SkillLevel, Sport } from '../../types';

export type Goal = 'Abnehmen' | 'Muskelaufbau' | 'Ausdauer' | 'Spaß' | 'Wettkampf';
export type Duration = 20 | 45 | 60 | 90;
export type PreferredTime = 'Morgens' | 'Mittags' | 'Abends';
export type Intensity = 'low' | 'medium' | 'high';

export interface TrainingDay {
  day: string;
  title: string;
  duration: number;
  intensity: Intensity;
  exercises: string[];
}

export interface TrainingWeek {
  week: number;
  focus: string;
  days: TrainingDay[];
}

export interface TrainingPlan {
  weeks: TrainingWeek[];
  coachNote: string;
}

export interface PlanInput {
  daysPerWeek: number;
  duration: Duration;
  goal: Goal;
  time: PreferredTime;
}

const STORAGE_KEY = (sportId: string) => `training_plan_${sportId}`;
const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/** For N days/week, pick a spread that maximizes recovery. */
const pickDays = (n: number): string[] => {
  const presets: Record<number, number[]> = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 2, 4, 5],
    5: [0, 1, 3, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  const idx = presets[n] ?? presets[3];
  return idx.map((i) => WEEKDAYS[i]);
};

/** Per-week focus by goal. */
const FOCUS_BY_GOAL: Record<Goal, string[]> = {
  Abnehmen: ['Grundlagenausdauer aufbauen', 'Volumen steigern', 'Intervalle einführen', 'Peak — Maximalverbrennung'],
  Muskelaufbau: ['Technik & Bewegungsmuster', 'Volumen aufbauen', 'Intensität steigern', 'Deload & Peak'],
  Ausdauer: ['Aerobe Basis', 'Volumen-Block', 'Tempoarbeit', 'Peak & Erholung'],
  Spaß: ['Reinkommen & Routine', 'Variation entdecken', 'Spielerische Challenge', 'Highlight-Woche'],
  Wettkampf: ['Grundlage festigen', 'Spezifische Intensität', 'Wettkampf-Simulation', 'Taper & Peak'],
};

/** Exercise libraries — keep ~6–8 per sport so we can rotate without repeats. */
const EX_LIB: Record<string, Record<SkillLevel, string[]>> = {
  fussball: {
    anfaenger: ['Lockeres Einlaufen 10 Min', 'Ballannahme rechts/links 3×10', 'Passübung gegen die Wand 3×15', 'Dribbling-Slalom 4×30 Sek', 'Torschuss-Form (kein Anlauf) 2×8', 'Ausdauerlauf 15 Min'],
    fortgeschritten: ['Sprintserie 6×30 m', 'Ballannahme in Bewegung 4×10', '1-vs-1 Coaching-Drill 4×2 Min', 'Direktpass-Quadrat 4×3 Min', 'Torschuss aus Bewegung 3×10', 'Conditioning-Run 20 Min'],
    profi: ['HIIT-Sprints 10×20 m mit Ball', 'Positionsspezifisches Drilling 4×4 Min', 'Set-Piece-Training 30 Min', 'Spielform 4v4 3×8 Min', 'Plyo-Box-Sprünge 4×8', 'Aktive Regeneration 15 Min'],
  },
  basketball: {
    anfaenger: ['Dribbling links/rechts 5 Min', 'Lay-Up-Reihen 3×10', 'Stand-Wurf 3×15', 'Pivot-Drill 3×10', 'Defensive-Slides 3×30 Sek', 'Free Throws 50'],
    fortgeschritten: ['Crossover-Drills 4×30 Sek', 'Pull-Up-Jumper 4×10', 'Pick-&-Roll-Form 4×8', 'Reboundtechnik 3×10', 'Suicides 4×', 'Free Throws 100'],
    profi: ['Game-Speed Ball-Handling 10 Min', 'Catch-&-Shoot aus Bewegung 5×15', 'Hedge-&-Recover Defense 4×4 Min', 'Iso-Spielsituationen 4×5', 'Conditioning 17er 6×', 'Free Throws unter Belastung 100'],
  },
  tennis: {
    anfaenger: ['Schattenschläge 5 Min', 'Vorhand cross 3×20', 'Rückhand cross 3×20', 'Aufschlagform 4×10', 'Volley-Übung 3×15', 'Lockeres Auslaufen 5 Min'],
    fortgeschritten: ['Topspin-Vorhand 4×20', 'Slice-Rückhand 4×15', 'Aufschlag + erster Ball 4×10', 'Punkt-Pattern (3 Bälle) 5×6', 'Footwork-Drill 4×30 Sek', 'Match-Tiebreak'],
    profi: ['Cross-Linie-Wechsel 5×8 Bälle', 'Aufschlag-Serve+1 Pattern 6×8', 'Return-Drill 5×10', 'Live-Ball-Punkte (4 Aufschläge auf jede Seite)', 'Sprint-Footwork 6×20 Sek', 'Match-Simulation 1 Satz'],
  },
  schwimmen: {
    anfaenger: ['200 m lockeres Einschwimmen', '4×50 m Kraul mit Pull-Buoy', '4×25 m Beine mit Brett', '100 m Rücken locker', '4×25 m Atem-Drill', '100 m Ausschwimmen'],
    fortgeschritten: ['400 m Einschwimmen', '6×100 m Kraul auf Zeit', '4×50 m Brust technisch', '200 m Beinarbeit', '6×25 m Sprint', '200 m Ausschwimmen'],
    profi: ['600 m Einschwimmen + Drill-Mix', '10×100 m Kraul progressiv', '4×200 m Lagen', '8×50 m Sprint mit Pause', 'Atem-Hypoxie-Set 8×25 m', '300 m Cooldown'],
  },
  klettern: {
    anfaenger: ['Mobility 10 Min', '2× Aufwärmrouten leicht', '4 Boulder leichtes Grade', 'Trittpräzisions-Drill', 'Hängen am Griff 4×10 Sek', 'Dehnen 10 Min'],
    fortgeschritten: ['Mobility 10 Min', '3 Routen onsight im Grenzbereich', '4×4 Boulder-Pyramide', 'Hangboard 6×7 Sek', 'Core (Frontlever-Progression) 4×30 Sek', 'Stretching'],
    profi: ['Projektroute 3 Versuche', 'System-Board Drills', 'Hangboard Max-Hangs 5×7 Sek', 'Campus-Board Sets', 'Antagonist-Training', 'Foam-Roll-Recovery'],
  },
  yoga: {
    anfaenger: ['Atem-Übung 5 Min', 'Sonnengruß A 3×', 'Krieger I/II 5 Min', 'Vorbeuge & Twist 5 Min', 'Balance-Posen 5 Min', 'Endentspannung 10 Min'],
    fortgeschritten: ['Pranayama 8 Min', 'Sonnengruß A & B je 3×', 'Krieger-Flow 10 Min', 'Hüftöffner 10 Min', 'Inversions-Vorbereitung 5 Min', 'Savasana 8 Min'],
    profi: ['Pranayama mit Bandhas 10 Min', 'Advanced Sun Salutations', 'Arm-Balances Sequenz', 'Tiefe Hüftöffner + Twists', 'Inversionen 10 Min', 'Meditation 10 Min'],
  },
  boxen: {
    anfaenger: ['Seilspringen 3×2 Min', 'Schattenboxen 3×2 Min', 'Geradenfolge Sackarbeit 4×2 Min', 'Beinarbeit-Drill 3×1 Min', 'Bauch & Liegestütz 3×15', 'Stretching'],
    fortgeschritten: ['Seil 4×3 Min', 'Schatten mit Kombi 4×3 Min', 'Sackarbeit Kombinationen 6×3 Min', 'Pratzentraining mit Partner', 'HIIT-Bodyweight 4×4 Min', 'Cool-down'],
    profi: ['Seil 5×3 Min progressive', 'Schatten mit Defense 5×3 Min', 'Sparring 4–6 Runden', 'Pratzen Highspeed 6×3 Min', 'Konditionssatz 8×30 Sek all-out', 'Stretch + Foam-Roll'],
  },
  laufen: {
    anfaenger: ['Walk 5 Min', '4×3 Min lockeres Joggen / 1 Min gehen', 'Lauf-ABC 6×20 m', 'Cool-down-Walk 5 Min', 'Dehnen Beine 8 Min'],
    fortgeschritten: ['Warm-up 10 Min', 'Tempolauf 4×5 Min @ Schwelle', '2 Min Trabpause', 'Strides 4×100 m', 'Cooldown 10 Min'],
    profi: ['Warm-up 15 Min + Drills', 'Intervall 6×1000 m @ VO2max', '90 Sek Pause', 'Plyo-Set 3×10', 'Cooldown 15 Min'],
  },
  radfahren: {
    anfaenger: ['Lockere Ausfahrt 30 Min Zone 2', 'Trittfrequenz-Drill 6×1 Min 90 rpm', 'Cooldown 5 Min'],
    fortgeschritten: ['Warm-up 15 Min', 'Sweet-Spot-Intervalle 3×10 Min', '5 Min locker zwischen', 'Cooldown 10 Min'],
    profi: ['Warm-up 20 Min', 'Threshold 2×20 Min', 'Sprints 6×15 Sek max', 'Cooldown 15 Min'],
  },
  volleyball: {
    anfaenger: ['Pritsche-Übung an die Wand 5 Min', 'Bagger-Form 3×15', 'Aufschlag von unten 3×10', 'Sprung-Drill 4×8', 'Lauf-ABC 5 Min', 'Stretching'],
    fortgeschritten: ['Pritsch-Bagger-Pritsch 4×3 Min', 'Aufschlag Tennis-Aufschlag 4×10', 'Angriffsschlag aus dem Stand 4×8', 'Block-Footwork 4×30 Sek', 'Plyo-Box 4×8', 'Cool-down'],
    profi: ['Spielnaher Pass-Drill 5×3 Min', 'Sprungaufschlag 5×10', 'Angriffsschlag aus Anlauf 6×8', 'Block-Sprung-Reihe 6×4', 'Vertical-Jump-Training', 'Mobility'],
  },
  handball: {
    anfaenger: ['Warm-up Ballkontakt 5 Min', 'Pass-Übung 3×15', 'Stand-Wurf 3×10', 'Sprungwurf-Form 3×8', 'Lauf-ABC 5 Min', 'Stretching'],
    fortgeschritten: ['Pass-Schritt-Wurf 4×10', 'Sprungwurf 4×10', 'Kreisspieler-Aktion 4×6', '3-2 Verteidigung Drill', 'Sprintserien 6×20 m', 'Cool-down'],
    profi: ['Spielsituationen 5×3 Min', 'Sprungwurf unter Belastung 5×8', 'Gegenstoß-Sequenzen 6×', 'Set-Plays üben 30 Min', 'HIIT 6×30 Sek', 'Mobility'],
  },
  judo: {
    anfaenger: ['Ukemi (Fallschule) 10 Min', 'Standgrund-Übung mit Partner', 'O-Goshi Form 3×10', 'Newaza Basics 10 Min', 'Bauch & Rücken 3×15', 'Stretching'],
    fortgeschritten: ['Ukemi schnell 5 Min', 'Uchikomi 5×20', 'Nage-Komi mit Wurf 4×10', 'Randori am Boden 4×3 Min', 'Conditioning 4×30 Sek', 'Cool-down'],
    profi: ['Uchikomi maximal 6×20', 'Nage-Komi mit Wurf 6×10', 'Randori Stand 4×4 Min', 'Randori Boden 4×3 Min', 'Sport-spezifisches Konditionssatz', 'Mobility & Atemarbeit'],
  },
  karate: {
    anfaenger: ['Kihon Stand-Techniken 10 Min', 'Tsuki-Reihe 5×10', 'Geri-Übung am Sandsack 4×10', 'Kata Heian Shodan 3×', 'Conditioning 3×30 Sek', 'Dehnen 10 Min'],
    fortgeschritten: ['Kihon im Stand-Wechsel 15 Min', 'Kumite-Drills 4×3 Min', 'Kata 2×', 'Sandsack-Kombinationen 4×2 Min', 'Plyo-Set 4×8', 'Cool-down'],
    profi: ['Schnellkraft-Kihon 15 Min', 'Kumite Live 5×3 Min', 'Kata Wettkampfniveau 3×', 'Sandsack High-Speed 6×2 Min', 'Reaktions-Drill mit Partner', 'Mobility'],
  },
  kickboxen: {
    anfaenger: ['Seil 3×2 Min', 'Schatten mit Tritten 3×2 Min', 'Sackarbeit Kicks 4×2 Min', 'Beinarbeit 3×1 Min', 'Bauch 3×15', 'Stretching'],
    fortgeschritten: ['Seil 4×3 Min', 'Schatten Hand + Bein 4×3 Min', 'Pratzentraining', 'Sandsack-Kombis 5×3 Min', 'Conditioning 4×4 Min', 'Cool-down'],
    profi: ['Seil 5×3 Min', 'Sparring 5×3 Min', 'Pratzen High-Speed 6×3 Min', 'Sandsack Kombi-Marathon 5×3 Min', 'HIIT 8×30 Sek', 'Foam-Roll-Recovery'],
  },
  badminton: {
    anfaenger: ['Schattenschritte 5 Min', 'Clear-Übung 3×20', 'Drop-Übung 3×15', 'Aufschlag kurz/lang 4×10', 'Volley-Drill 3×15', 'Stretching'],
    fortgeschritten: ['Footwork 6 Ecken 5×30 Sek', 'Clear-Drop-Smash-Pattern 4×3 Min', 'Aufschlag-Empfang 4×10', 'Doppel-Stellung 4×3 Min', 'Plyo 4×8', 'Cool-down'],
    profi: ['Multi-Shuttle-Drill 5×3 Min', 'Spielnahe Patterns 5×4 Min', 'Smash-Defense Live 4×3 Min', 'Match-Set 1×', 'Sprung-Squats 5×10', 'Mobility'],
  },
  tischtennis: {
    anfaenger: ['Schattenschläge 5 Min', 'Vorhand Konter 5 Min', 'Rückhand Konter 5 Min', 'Aufschlag-Form 4×10', 'Konter-Wechsel 5 Min', 'Stretching'],
    fortgeschritten: ['Topspin-Vorhand 5×30', 'Topspin-Rückhand 5×30', 'Block-Topspin-Pattern 5×3 Min', 'Aufschlag + 3. Ball 4×10', 'Beinarbeit 5×30 Sek', 'Match-Sätze'],
    profi: ['Spinaufschlag-Variation 6×10', 'Topspin Long-Rally 6×3 Min', 'Block-Konter mit Footwork', 'Live-Punkte 6×6', 'Reaktionsdrill', 'Mobility'],
  },
  squash: {
    anfaenger: ['Geistschläge 5 Min', 'Vorhand longline 3×20', 'Rückhand longline 3×20', 'Aufschlag-Form 3×10', 'T-Position-Drill 3×1 Min', 'Cool-down'],
    fortgeschritten: ['Ghosting 6×30 Sek', 'Boast-Drive-Pattern 4×3 Min', 'Volley-Drill 4×20', 'Conditioned Game (3 Bälle) 4×5 Min', 'Sprintserien 6×', 'Stretching'],
    profi: ['Ghosting High-Speed 8×30 Sek', 'Pressure-Drill 5×3 Min', 'Match-Spiel 2 Sätze', 'Solo-Hitting 10 Min', 'Court-Sprints 8×', 'Cool-down'],
  },
  rudern: {
    anfaenger: ['Erg-Einrudern 5 Min', 'Technik-Drill (Beine-Rumpf-Arme) 10 Min', 'Steady-State 15 Min Zone 2', 'Stretching 10 Min'],
    fortgeschritten: ['Erg 10 Min Warm-up', '4×1000 m mit 3 Min Pause', 'Beinpressen-Form 3×15', 'Stretching'],
    profi: ['Erg 15 Min Warm-up + Drills', '5×1500 m Wettkampftempo', 'Krafttraining Beine + Rücken', 'Cool-down 15 Min'],
  },
  segeln: {
    anfaenger: ['Knoten lernen 15 Min', 'Trimm-Theorie 10 Min', 'Auf dem Boot: Wenden 30 Min', 'Halsen 15 Min', 'Sicherheitsübung Mensch über Bord', 'Boot aufklaren'],
    fortgeschritten: ['Trim-Setup-Check', 'Kursfahren mit Variationen 30 Min', 'Manöver-Übungen 20 Min', 'Spinnaker-Setzen üben', 'Boot säubern'],
    profi: ['Regatta-Start-Sequenz 20 Min', 'Kurslesen & Taktik 30 Min', 'Manöver auf Zeit', 'Krafttraining (Pullups, Pull-Y, Core)', 'Mental-Routine'],
  },
  surfen: {
    anfaenger: ['Paddel-Technik am Land 10 Min', 'Pop-Up am Land 3×15', 'Whitewater 30 Min', 'Stand-Übung im Wasser', 'Rückenmuskel-Stärkung'],
    fortgeschritten: ['Paddeln 30 Min', 'Green Waves angehen', 'Bottom-Turn-Form üben', 'Cutback-Form 3×', 'Krafttraining Schultern + Core'],
    profi: ['Heat-Simulation 20 Min', 'Aerial-Vorbereitung am Trampolin', 'Wave-Selection-Drill', 'Power-Endurance Schwimm-Set', 'Mobility-Flow'],
  },
  krafttraining: {
    anfaenger: ['Goblet-Squat 3×10', 'Romanian Deadlift 3×10', 'Liegestütz 3×8', 'Rudern Maschine 3×10', 'Plank 3×30 Sek', 'Stretching'],
    fortgeschritten: ['Kniebeuge 4×8', 'Bankdrücken 4×8', 'Klimmzüge 4×6', 'Schulterdrücken 3×10', 'Bauch-Komplex', 'Cool-down'],
    profi: ['Kniebeuge 5×5 @ 80 %', 'Kreuzheben 5×3 @ 85 %', 'Bankdrücken 5×5', 'Pull-Ups gewichtet 4×6', 'Accessoires (Hip-Thrust, Face-Pull)', 'Mobility'],
  },
  crossfit: {
    anfaenger: ['Skill: Air-Squat & Push-Up', 'WOD: AMRAP 10 Min — 10 Squats / 10 Push-Ups / 10 Sit-Ups', 'Cool-down'],
    fortgeschritten: ['Strength: Back-Squat 5×5', 'WOD: 4 Rounds — 400 m Lauf / 15 KB-Swings / 10 Burpees', 'Mobility'],
    profi: ['Olympic Lift: Clean & Jerk 6×2', 'WOD "Fran": 21-15-9 Thruster + Pull-Ups for time', 'Accessoire Gymnastics', 'Cool-down'],
  },
  pilates: {
    anfaenger: ['Hundred-Vorbereitung', 'Roll-Up 3×8', 'Single-Leg-Stretch 3×10', 'Bridging 3×10', 'Schwan vorbereiten', 'Stretching'],
    fortgeschritten: ['Hundred volle Form', 'Roll-Over 3×8', 'Teaser-Vorbereitung 3×8', 'Side-Plank-Reihe', 'Schwan-Tauchen', 'Cool-down'],
    profi: ['Reformer-Sequenz 30 Min', 'Teaser komplett 5×', 'Boomerang 3×', 'Control Balance', 'Magic-Circle-Block', 'Mobility'],
  },
  wandern: {
    anfaenger: ['Aufwärm-Walk 5 Min', '90 Min Wanderung Flachland', 'Trinkpause integrieren', 'Stretching nach Tour'],
    fortgeschritten: ['Warm-up 10 Min', '3 h Tour mit 400 hm', 'Stockeinsatz üben', 'Snack-Rhythmus halten', 'Cool-down-Stretch'],
    profi: ['Warm-up 15 Min', '5–6 h Bergtour mit 1000 hm+', 'Tempo-Variation', 'Kraft-Tour mit Gewicht im Rucksack', 'Erholungsdehnen'],
  },
  mountainbike: {
    anfaenger: ['Grundposition üben 10 Min', 'Bremstechnik 10 Min', 'Trail leicht 60 Min', 'Cool-down'],
    fortgeschritten: ['Sprünge bis 50 cm', 'Anlieger-Kurven trainieren', 'Trail mittel 90 Min mit Tempowechsel', 'Stretching'],
    profi: ['Drop-Training', 'Race-Pace-Intervalle auf Trail', 'Technik-Sektion auf Zeit', 'Krafttraining Beine + Core', 'Cool-down'],
  },
  ski: {
    anfaenger: ['Pflug-Bogen üben', 'Carving-Vorbereitung leichter Hang', 'Schwung-Wechsel-Drill', 'Pisten-Etikette'],
    fortgeschritten: ['Carving sauber auf roter Piste', 'Buckelpiste leicht', 'Tiefschnee-Versuch', 'Krafttraining Beine'],
    profi: ['Variantenfahrt', 'Tiefschnee-Technik', 'Touren-Aufstieg', 'Carving-Speed', 'Trockenübungen Mobilität'],
  },
  snowboard: {
    anfaenger: ['Front- und Backside-Edge wechseln', 'Slow-Turn-Drill', 'Anfänger-Pist 60 Min', 'Falltechnik'],
    fortgeschritten: ['Carving üben', 'Park-Basics (Boxes, kleine Kicker)', 'Switch-Riding 30 Min', 'Krafttraining'],
    profi: ['Park-Tricks (180/360)', 'Tiefschnee-Carving', 'Boardercross-Sektion', 'Krafttraining Beine + Core'],
  },
  eishockey: {
    anfaenger: ['Schlittschuh-Stride 10 Min', 'Stick-Handling auf Eis 15 Min', 'Passen mit Partner 10 Min', 'Stand-Schuss 4×10', 'Cool-down'],
    fortgeschritten: ['Power-Skating 15 Min', 'Stick-Handling mit Tempo', 'One-Timer-Schuss 4×10', 'Spielform 3vs3 4×3 Min', 'Cool-down'],
    profi: ['Speed-Skating-Intervalle', 'Live-Drills 4×4 Min', 'Schuss-Kombi-Übungen', 'Spielzüge üben 30 Min', 'Off-Ice Conditioning'],
  },
  tanzen: {
    anfaenger: ['Warm-up zur Musik 8 Min', 'Grundschritte 20 Min', 'Rhythmus-Übung 10 Min', 'Choreo-Block 15 Min', 'Stretching'],
    fortgeschritten: ['Warm-up 10 Min', 'Drehungen & Spins 15 Min', 'Choreo lernen 25 Min', 'Improvisations-Block 10 Min', 'Cool-down'],
    profi: ['Warm-up 15 Min', 'Technik-Repertoire', 'Voll-Choreo 30 Min', 'Performance-Block mit Ausdruck', 'Mobility'],
  },
  parkour: {
    anfaenger: ['Mobility + Springgelenke 10 Min', 'Präzisionssprünge auf der Stelle', 'Roll-Übung 3×10', 'Speed-Vault leicht 4×10', 'Hangeln 3×30 Sek', 'Stretching'],
    fortgeschritten: ['Mobility 10 Min', 'Präzisionssprünge mittlere Distanz', 'Kong-Vault 5×5', 'Wall-Run 5×', 'Klettern auf Mauern', 'Cool-down'],
    profi: ['Flow-Line 4×3 Min', 'Komplexe Vaults', 'Cat-Leap + Climb-Up', 'Drop & Roll aus 2 m', 'Strength-Block (Frontlever, Muscle-Up)', 'Mobility'],
  },
  reiten: {
    anfaenger: ['Putzen & Satteln', 'Schritt 15 Min', 'Trab 10 Min angetrabt', 'Galopp leicht angaloppieren', 'Versorgen'],
    fortgeschritten: ['Aufwärmprogramm Dressur', 'Trabverstärkung & Schenkelweichen', 'Galopp-Wechsel üben', 'Cavaletti-Reihe', 'Cool-down'],
    profi: ['Lektionen Dressur M-Niveau', 'Springen Parcours', 'Cross-Country-Sequenz', 'Krafttraining Reiter', 'Mental-Routine'],
  },
  golf: {
    anfaenger: ['Setup-Drill 10 Min', 'Putten 30 Bälle aus 1 m', 'Chipping 20 Bälle', 'Iron-Schlag 7er Eisen 30 Bälle', 'Driver leicht'],
    fortgeschritten: ['Putten 50 Bälle aus 2–5 m', 'Bunker-Training 20 Schläge', 'Mid-Iron-Block 30 Bälle', 'Driver Vollkraft 20 Bälle', '9 Loch Runde'],
    profi: ['Putten Drill mit Druck-Situation', 'Wedge-Distanzkontrolle 50 Bälle', 'Driver Spin-Optimierung', 'Course-Management üben', '18 Loch Runde'],
  },
};

const fallbackExercises = (level: SkillLevel): string[] =>
  ({
    anfaenger: ['10 Min Aufwärmen', 'Technik-Grundlagen 20 Min', 'Sportartspezifisches Üben 20 Min', 'Cool-down 10 Min'],
    fortgeschritten: ['Warm-up 10 Min', 'Technik-Block 20 Min', 'Intensitäts-Block 20 Min', 'Cool-down 10 Min'],
    profi: ['Warm-up + Drills 15 Min', 'Spezifische Belastung 30 Min', 'High-Intensity 20 Min', 'Mobility 15 Min'],
  }[level]);

const intensityForWeek = (week: number, goal: Goal): Intensity => {
  if (goal === 'Spaß') return week === 4 ? 'high' : 'medium';
  if (week === 1) return 'low';
  if (week === 2) return 'medium';
  if (week === 3) return 'high';
  return goal === 'Muskelaufbau' ? 'medium' : 'high'; // deload for hypertrophy, peak for others
};

const titleForDay = (sport: Sport, week: number, goal: Goal, level: SkillLevel): string => {
  const focus = FOCUS_BY_GOAL[goal][week - 1];
  return `${sport.name}: ${focus} (${LEVEL_DE[level]})`;
};

const buildTemplatePlan = (sport: Sport, level: SkillLevel, input: PlanInput): TrainingPlan => {
  const dayNames = pickDays(input.daysPerWeek);
  const lib = EX_LIB[sport.id]?.[level] ?? fallbackExercises(level);

  const weeks: TrainingWeek[] = [];
  for (let w = 1; w <= 4; w++) {
    const days: TrainingDay[] = dayNames.map((d, idx) => {
      const start = ((w - 1) * 3 + idx) % lib.length;
      const count = Math.min(lib.length, input.duration <= 20 ? 3 : input.duration <= 45 ? 4 : input.duration <= 60 ? 5 : 6);
      const exercises: string[] = [];
      for (let i = 0; i < count; i++) {
        exercises.push(lib[(start + i) % lib.length]);
      }
      return {
        day: d,
        title: titleForDay(sport, w, input.goal, level),
        duration: input.duration,
        intensity: intensityForWeek(w, input.goal),
        exercises,
      };
    });
    weeks.push({ week: w, focus: FOCUS_BY_GOAL[input.goal][w - 1], days });
  }

  const coachNote = (() => {
    const base = `4 Wochen ${sport.name} mit Fokus ${input.goal.toLowerCase()}, ${input.daysPerWeek}× pro Woche je ${input.duration} Min.`;
    const time = input.time === 'Morgens'
      ? 'Morgens trainiert es sich nüchtern besonders fokussiert — leichtes Frühstück danach.'
      : input.time === 'Mittags'
        ? 'Mittagseinheiten geben den ganzen Nachmittag Energie — achte auf gute Mahlzeiten-Abstände.'
        : 'Abends ist Stress raus — lass dem Körper nach der Einheit Zeit zum Runterfahren.';
    return `${base} ${time}`;
  })();

  return { weeks, coachNote };
};

const loadPlan = (sportId: string): { plan: TrainingPlan; input: PlanInput } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(sportId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const savePlan = (sportId: string, plan: TrainingPlan, input: PlanInput) => {
  try {
    localStorage.setItem(STORAGE_KEY(sportId), JSON.stringify({ plan, input }));
  } catch {
    /* ignore */
  }
};

interface UseTrainingPlanArgs {
  sport: Sport;
  level: SkillLevel;
}

export function useTrainingPlan({ sport, level }: UseTrainingPlanArgs) {
  const stored = loadPlan(sport.id);
  const [plan, setPlan] = useState<TrainingPlan | null>(stored?.plan ?? null);
  const [lastInput, setLastInput] = useState<PlanInput | null>(stored?.input ?? null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const generate = useCallback(
    async (input: PlanInput) => {
      setLoading(true);
      // Brief artificial delay so the UI's "wird erstellt..." feels real.
      await new Promise((r) => window.setTimeout(r, 600));
      const result = buildTemplatePlan(sport, level, input);
      setPlan(result);
      setLastInput(input);
      savePlan(sport.id, result, input);
      setLoading(false);
    },
    [sport, level],
  );

  const reset = useCallback(() => {
    setPlan(null);
    setLastInput(null);
    try {
      localStorage.removeItem(STORAGE_KEY(sport.id));
    } catch {
      /* ignore */
    }
  }, [sport.id]);

  return { plan, lastInput, loading, error, generate, reset };
}

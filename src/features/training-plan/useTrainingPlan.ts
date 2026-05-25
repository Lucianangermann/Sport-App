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

type DayType = 'technique' | 'conditioning' | 'strength' | 'play' | 'recovery' | 'mixed' | 'long';

const STORAGE_KEY = (sportId: string) => `training_plan_${sportId}`;
const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

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

const FOCUS_BY_GOAL: Record<Goal, string[]> = {
  Abnehmen: ['Grundlagenausdauer aufbauen', 'Volumen steigern', 'Intervalle einführen', 'Peak — Maximalverbrennung'],
  Muskelaufbau: ['Technik & Bewegungsmuster', 'Volumen aufbauen', 'Intensität steigern', 'Deload & Peak'],
  Ausdauer: ['Aerobe Basis', 'Volumen-Block', 'Tempoarbeit', 'Peak & Erholung'],
  Spaß: ['Reinkommen & Routine', 'Variation entdecken', 'Spielerische Challenge', 'Highlight-Woche'],
  Wettkampf: ['Grundlage festigen', 'Spezifische Intensität', 'Wettkampf-Simulation', 'Taper & Peak'],
};

const DAY_TYPE_LABEL: Record<DayType, string> = {
  technique: 'Technik',
  conditioning: 'Kondition',
  strength: 'Kraft & Athletik',
  play: 'Spielform',
  recovery: 'Regeneration',
  mixed: 'Gemischt',
  long: 'Volumen',
};

const DAY_TYPE_INTENSITY: Record<DayType, Intensity> = {
  technique: 'medium',
  conditioning: 'high',
  strength: 'medium',
  play: 'high',
  recovery: 'low',
  mixed: 'medium',
  long: 'medium',
};

/** Per-goal × daysPerWeek base sequence of day types. */
const DAY_PATTERNS: Record<Goal, Record<number, DayType[]>> = {
  Muskelaufbau: {
    1: ['strength'],
    2: ['strength', 'strength'],
    3: ['strength', 'strength', 'technique'],
    4: ['strength', 'conditioning', 'strength', 'recovery'],
    5: ['strength', 'conditioning', 'strength', 'technique', 'recovery'],
    6: ['strength', 'conditioning', 'strength', 'technique', 'strength', 'recovery'],
    7: ['strength', 'conditioning', 'strength', 'recovery', 'strength', 'technique', 'recovery'],
  },
  Abnehmen: {
    1: ['conditioning'],
    2: ['conditioning', 'conditioning'],
    3: ['conditioning', 'strength', 'conditioning'],
    4: ['conditioning', 'strength', 'conditioning', 'recovery'],
    5: ['conditioning', 'strength', 'conditioning', 'mixed', 'recovery'],
    6: ['conditioning', 'strength', 'conditioning', 'mixed', 'long', 'recovery'],
    7: ['conditioning', 'strength', 'conditioning', 'mixed', 'long', 'strength', 'recovery'],
  },
  Ausdauer: {
    1: ['long'],
    2: ['conditioning', 'long'],
    3: ['conditioning', 'technique', 'long'],
    4: ['conditioning', 'technique', 'strength', 'long'],
    5: ['conditioning', 'technique', 'strength', 'recovery', 'long'],
    6: ['conditioning', 'technique', 'conditioning', 'strength', 'recovery', 'long'],
    7: ['conditioning', 'technique', 'conditioning', 'strength', 'recovery', 'long', 'recovery'],
  },
  Spaß: {
    1: ['play'],
    2: ['play', 'mixed'],
    3: ['play', 'technique', 'mixed'],
    4: ['play', 'technique', 'mixed', 'play'],
    5: ['play', 'technique', 'conditioning', 'mixed', 'play'],
    6: ['play', 'technique', 'conditioning', 'mixed', 'play', 'recovery'],
    7: ['play', 'technique', 'conditioning', 'mixed', 'play', 'strength', 'recovery'],
  },
  Wettkampf: {
    1: ['play'],
    2: ['technique', 'play'],
    3: ['technique', 'conditioning', 'play'],
    4: ['technique', 'conditioning', 'strength', 'play'],
    5: ['technique', 'conditioning', 'strength', 'play', 'recovery'],
    6: ['technique', 'conditioning', 'strength', 'play', 'technique', 'recovery'],
    7: ['technique', 'conditioning', 'strength', 'play', 'technique', 'conditioning', 'recovery'],
  },
};

/** Sport-specific drill pool (carried over from previous version, used for technique/play days). */
const SPORT_DRILLS: Record<string, Record<SkillLevel, string[]>> = {
  fussball: {
    anfaenger: ['Ballannahme rechts/links 3×10', 'Passübung gegen die Wand 3×15', 'Dribbling-Slalom 4×30 Sek', 'Torschuss-Form (kein Anlauf) 2×8', 'Innenseiten-Pass im Quadrat 4×3 Min'],
    fortgeschritten: ['Ballannahme in Bewegung 4×10', '1-vs-1 Coaching-Drill 4×2 Min', 'Direktpass-Quadrat 4×3 Min', 'Torschuss aus Bewegung 3×10', 'Set-Piece-Übung 4×5'],
    profi: ['Positionsspezifisches Drilling 4×4 Min', 'Set-Piece-Training 30 Min', 'Spielform 4v4 3×8 Min', 'Pass-Kombination unter Druck 6×3 Min', 'Torschuss nach Kombination 5×10'],
  },
  basketball: {
    anfaenger: ['Dribbling links/rechts 5 Min', 'Lay-Up-Reihen 3×10', 'Stand-Wurf 3×15', 'Pivot-Drill 3×10', 'Free Throws 50'],
    fortgeschritten: ['Crossover-Drills 4×30 Sek', 'Pull-Up-Jumper 4×10', 'Pick-&-Roll-Form 4×8', 'Reboundtechnik 3×10', 'Free Throws 100'],
    profi: ['Game-Speed Ball-Handling 10 Min', 'Catch-&-Shoot aus Bewegung 5×15', 'Hedge-&-Recover Defense 4×4 Min', 'Iso-Spielsituationen 4×5', 'Free Throws unter Belastung 100'],
  },
  tennis: {
    anfaenger: ['Schattenschläge 5 Min', 'Vorhand cross 3×20', 'Rückhand cross 3×20', 'Aufschlagform 4×10', 'Volley-Übung 3×15'],
    fortgeschritten: ['Topspin-Vorhand 4×20', 'Slice-Rückhand 4×15', 'Aufschlag + erster Ball 4×10', 'Punkt-Pattern (3 Bälle) 5×6', 'Footwork-Drill 4×30 Sek'],
    profi: ['Cross-Linie-Wechsel 5×8 Bälle', 'Aufschlag-Serve+1 Pattern 6×8', 'Return-Drill 5×10', 'Live-Ball-Punkte (4 Aufschläge auf jede Seite)', 'Match-Simulation 1 Satz'],
  },
  schwimmen: {
    anfaenger: ['4×50 m Kraul mit Pull-Buoy', '4×25 m Beine mit Brett', '100 m Rücken locker', '4×25 m Atem-Drill', '4×50 m Brust-Technik'],
    fortgeschritten: ['6×100 m Kraul auf Zeit', '4×50 m Brust technisch', '200 m Beinarbeit', '6×25 m Sprint', '4×100 m Lagen'],
    profi: ['10×100 m Kraul progressiv', '4×200 m Lagen', '8×50 m Sprint mit Pause', 'Atem-Hypoxie-Set 8×25 m', '4×400 m negative Splits'],
  },
  klettern: {
    anfaenger: ['2× Aufwärmrouten leicht', '4 Boulder leichtes Grade', 'Trittpräzisions-Drill', 'Hängen am Griff 4×10 Sek', 'Statische Position-Drill 5×30 Sek'],
    fortgeschritten: ['3 Routen onsight im Grenzbereich', '4×4 Boulder-Pyramide', 'Hangboard 6×7 Sek', 'Routenlesen-Übung', 'System-Board Lock-Off 4×'],
    profi: ['Projektroute 3 Versuche', 'System-Board Drills', 'Hangboard Max-Hangs 5×7 Sek', 'Campus-Board Sets', 'Komplexe Onsight-Vorbereitung'],
  },
  yoga: {
    anfaenger: ['Sonnengruß A 3×', 'Krieger I/II 5 Min', 'Vorbeuge & Twist 5 Min', 'Balance-Posen 5 Min', 'Brücke + Schulterstand-Vorbereitung'],
    fortgeschritten: ['Sonnengruß A & B je 3×', 'Krieger-Flow 10 Min', 'Hüftöffner 10 Min', 'Inversions-Vorbereitung 5 Min', 'Twist-Sequenz 8 Min'],
    profi: ['Advanced Sun Salutations', 'Arm-Balances Sequenz', 'Tiefe Hüftöffner + Twists', 'Inversionen 10 Min', 'Backbend-Flow 12 Min'],
  },
  boxen: {
    anfaenger: ['Schattenboxen 3×2 Min', 'Geradenfolge Sackarbeit 4×2 Min', 'Beinarbeit-Drill 3×1 Min', 'Jab-Cross-Hook Kombi 3×10', 'Doppeljab 3×20'],
    fortgeschritten: ['Schatten mit Kombi 4×3 Min', 'Sackarbeit Kombinationen 6×3 Min', 'Pratzentraining mit Partner', 'Konter-Drill 4×3 Min', 'Footwork-Pattern 4×2 Min'],
    profi: ['Schatten mit Defense 5×3 Min', 'Sparring 4–6 Runden', 'Pratzen Highspeed 6×3 Min', 'Konter-Sequenzen unter Druck 5×3 Min', 'Body-Punch-Drill 5×3 Min'],
  },
  laufen: {
    anfaenger: ['Lauf-ABC 6×20 m', 'Strides 4×80 m', '4×3 Min lockeres Joggen / 1 Min gehen', '15 Min Dauerlauf', 'Bergan-Walks 6×30 Sek'],
    fortgeschritten: ['Tempolauf 4×5 Min @ Schwelle', 'Strides 4×100 m', 'Fartlek 25 Min', 'Hügelsprints 8×60 m', 'Pyramide 1-2-3-2-1 Min'],
    profi: ['Intervall 6×1000 m @ VO2max', 'Tempo-Dauerlauf 30 Min', 'Plyo-Set 3×10', 'Bahnintervalle 10×400 m', 'Progression-Run 45 Min'],
  },
  radfahren: {
    anfaenger: ['Trittfrequenz-Drill 6×1 Min 90 rpm', 'Lockere Ausfahrt Zone 2', 'Wiegetritt 4×30 Sek', 'Cleat-Position-Check', 'Bergan-Sitting 4×2 Min'],
    fortgeschritten: ['Sweet-Spot-Intervalle 3×10 Min', 'VO2-Intervalle 5×3 Min', 'Sprints 6×20 Sek', 'Bergan-Stehend 5×3 Min', 'Tempo-Block 2×20 Min'],
    profi: ['Threshold 2×20 Min', 'Sprints 6×15 Sek max', 'Microbursts 30/15 Sek 4×5 Min', 'FTP-Test', 'Race-Pace-Block 3×15 Min'],
  },
  volleyball: {
    anfaenger: ['Pritsche-Übung an die Wand 5 Min', 'Bagger-Form 3×15', 'Aufschlag von unten 3×10', 'Sprung-Drill 4×8', 'Block-Footwork 4×30 Sek'],
    fortgeschritten: ['Pritsch-Bagger-Pritsch 4×3 Min', 'Aufschlag Tennis-Aufschlag 4×10', 'Angriffsschlag aus dem Stand 4×8', 'Block-Footwork 4×30 Sek', 'Annahme-Verteidigung 4×3 Min'],
    profi: ['Spielnaher Pass-Drill 5×3 Min', 'Sprungaufschlag 5×10', 'Angriffsschlag aus Anlauf 6×8', 'Block-Sprung-Reihe 6×4', 'Komplex-Pattern 6×3 Min'],
  },
  handball: {
    anfaenger: ['Pass-Übung 3×15', 'Stand-Wurf 3×10', 'Sprungwurf-Form 3×8', 'Lauf-ABC 5 Min', 'Wurf-Kombination 3×10'],
    fortgeschritten: ['Pass-Schritt-Wurf 4×10', 'Sprungwurf 4×10', 'Kreisspieler-Aktion 4×6', '3-2 Verteidigung Drill', 'Gegenstoß-Sequenz 5×'],
    profi: ['Spielsituationen 5×3 Min', 'Sprungwurf unter Belastung 5×8', 'Gegenstoß-Sequenzen 6×', 'Set-Plays üben 30 Min', 'Komplex-Spielform 4×4 Min'],
  },
  judo: {
    anfaenger: ['Ukemi (Fallschule) 10 Min', 'Standgrund-Übung mit Partner', 'O-Goshi Form 3×10', 'Newaza Basics 10 Min', 'Uchikomi 5×10'],
    fortgeschritten: ['Uchikomi 5×20', 'Nage-Komi mit Wurf 4×10', 'Randori am Boden 4×3 Min', 'Wurfkombination 4×8', 'Kuzushi-Drill 5 Min'],
    profi: ['Uchikomi maximal 6×20', 'Nage-Komi mit Wurf 6×10', 'Randori Stand 4×4 Min', 'Randori Boden 4×3 Min', 'Wettkampf-Simulation 3×5 Min'],
  },
  karate: {
    anfaenger: ['Kihon Stand-Techniken 10 Min', 'Tsuki-Reihe 5×10', 'Geri-Übung am Sandsack 4×10', 'Kata Heian Shodan 3×', 'Stand-Wechsel-Drill 5 Min'],
    fortgeschritten: ['Kihon im Stand-Wechsel 15 Min', 'Kumite-Drills 4×3 Min', 'Kata 2×', 'Sandsack-Kombinationen 4×2 Min', 'Renraku-Übung 5×10'],
    profi: ['Schnellkraft-Kihon 15 Min', 'Kumite Live 5×3 Min', 'Kata Wettkampfniveau 3×', 'Sandsack High-Speed 6×2 Min', 'Konter-Drills 6×3 Min'],
  },
  kickboxen: {
    anfaenger: ['Schatten mit Tritten 3×2 Min', 'Sackarbeit Kicks 4×2 Min', 'Beinarbeit 3×1 Min', 'Jab-Cross-Lowkick 3×10', 'Knee-Strike-Drill 3×15'],
    fortgeschritten: ['Schatten Hand + Bein 4×3 Min', 'Pratzentraining', 'Sandsack-Kombis 5×3 Min', 'Slip-and-Kick-Drill 4×3 Min', 'Clinch-Knee 4×2 Min'],
    profi: ['Sparring 5×3 Min', 'Pratzen High-Speed 6×3 Min', 'Sandsack Kombi-Marathon 5×3 Min', 'Defense-Reaktions-Drill 6×3 Min', 'Body-Kick-Pattern 5×3 Min'],
  },
  badminton: {
    anfaenger: ['Schattenschritte 5 Min', 'Clear-Übung 3×20', 'Drop-Übung 3×15', 'Aufschlag kurz/lang 4×10', 'Volley-Drill 3×15'],
    fortgeschritten: ['Footwork 6 Ecken 5×30 Sek', 'Clear-Drop-Smash-Pattern 4×3 Min', 'Aufschlag-Empfang 4×10', 'Doppel-Stellung 4×3 Min', 'Smash-Verteidigung 4×3 Min'],
    profi: ['Multi-Shuttle-Drill 5×3 Min', 'Spielnahe Patterns 5×4 Min', 'Smash-Defense Live 4×3 Min', 'Match-Set 1×', 'Speed-Drill 6 Ecken 5×30 Sek'],
  },
  tischtennis: {
    anfaenger: ['Schattenschläge 5 Min', 'Vorhand Konter 5 Min', 'Rückhand Konter 5 Min', 'Aufschlag-Form 4×10', 'Konter-Wechsel 5 Min'],
    fortgeschritten: ['Topspin-Vorhand 5×30', 'Topspin-Rückhand 5×30', 'Block-Topspin-Pattern 5×3 Min', 'Aufschlag + 3. Ball 4×10', 'Beinarbeit 5×30 Sek'],
    profi: ['Spinaufschlag-Variation 6×10', 'Topspin Long-Rally 6×3 Min', 'Block-Konter mit Footwork', 'Live-Punkte 6×6', 'Reaktionsdrill 5×3 Min'],
  },
  squash: {
    anfaenger: ['Vorhand longline 3×20', 'Rückhand longline 3×20', 'Aufschlag-Form 3×10', 'T-Position-Drill 3×1 Min', 'Geister-Schläge 5 Min'],
    fortgeschritten: ['Boast-Drive-Pattern 4×3 Min', 'Volley-Drill 4×20', 'Conditioned Game (3 Bälle) 4×5 Min', 'Lob-und-Drop-Drill 5×', 'Ecken-Drill 4×3 Min'],
    profi: ['Pressure-Drill 5×3 Min', 'Match-Spiel 2 Sätze', 'Solo-Hitting 10 Min', 'Court-Sprints 8×', 'Komplex-Pattern 6×3 Min'],
  },
  rudern: {
    anfaenger: ['Erg Technik-Drill 10 Min', 'Steady-State 15 Min Zone 2', '10er-Spurts 5×', 'Beine-only-Drill 5 Min', 'Pause-Drill 3×5 Min'],
    fortgeschritten: ['Erg 4×1000 m mit 3 Min Pause', 'Beinpressen-Form 3×15', 'Power-10 Intervalle 5×', '2k-Pace-Test', '20-Minute-Test'],
    profi: ['Erg 5×1500 m Wettkampftempo', '6×500 m all-out', '60-Minute Threshold', '4×2000 m Race-Pace', '10×250 m Sprint'],
  },
  segeln: {
    anfaenger: ['Knoten lernen 15 Min', 'Trimm-Theorie 10 Min', 'Wenden 30 Min', 'Halsen 15 Min', 'Sicherheitsübung Mensch über Bord'],
    fortgeschritten: ['Kursfahren mit Variationen 30 Min', 'Manöver-Übungen 20 Min', 'Spinnaker-Setzen üben', 'Trim-Optimierung', 'Boot-Check & Wartung'],
    profi: ['Regatta-Start-Sequenz 20 Min', 'Kurslesen & Taktik 30 Min', 'Manöver auf Zeit', 'Speed-Trim 20 Min', 'Mental-Routine'],
  },
  surfen: {
    anfaenger: ['Paddel-Technik am Land 10 Min', 'Pop-Up am Land 3×15', 'Whitewater 30 Min', 'Stand-Übung im Wasser', 'Brett-Balance-Drill 10 Min'],
    fortgeschritten: ['Paddeln 30 Min', 'Green Waves angehen', 'Bottom-Turn-Form üben', 'Cutback-Form 3×', 'Wellen-Selektion-Drill 30 Min'],
    profi: ['Heat-Simulation 20 Min', 'Aerial-Vorbereitung am Trampolin', 'Wave-Selection-Drill', 'Power-Endurance Schwimm-Set', 'Manöver-Repertoire 30 Min'],
  },
  krafttraining: {
    anfaenger: ['Goblet-Squat 3×10', 'Romanian Deadlift 3×10', 'Liegestütz 3×8', 'Rudern Maschine 3×10', 'Plank 3×30 Sek'],
    fortgeschritten: ['Kniebeuge 4×8', 'Bankdrücken 4×8', 'Klimmzüge 4×6', 'Schulterdrücken 3×10', 'Hip-Thrust 4×10'],
    profi: ['Kniebeuge 5×5 @ 80 %', 'Kreuzheben 5×3 @ 85 %', 'Bankdrücken 5×5', 'Pull-Ups gewichtet 4×6', 'Power Clean 5×3'],
  },
  crossfit: {
    anfaenger: ['Skill: Air-Squat & Push-Up', 'WOD: AMRAP 10 Min — 10 Squats / 10 Push-Ups / 10 Sit-Ups', 'Box Jumps 4×8', 'Kettlebell Swings 3×15', 'Mobility-Block 10 Min'],
    fortgeschritten: ['Strength: Back-Squat 5×5', 'WOD: 4 Rounds — 400 m Lauf / 15 KB-Swings / 10 Burpees', 'Power Clean 5×3', 'Pull-Up-Skill 4×5', 'Double-Unders 3×50'],
    profi: ['Olympic Lift: Clean & Jerk 6×2', 'WOD "Fran": 21-15-9 Thruster + Pull-Ups for time', 'Snatch-Technik 5×3', 'Muscle-Up-Skill', 'EMOM 16 Min'],
  },
  pilates: {
    anfaenger: ['Hundred-Vorbereitung', 'Roll-Up 3×8', 'Single-Leg-Stretch 3×10', 'Bridging 3×10', 'Cat-Cow-Flow 3 Min'],
    fortgeschritten: ['Hundred volle Form', 'Roll-Over 3×8', 'Teaser-Vorbereitung 3×8', 'Side-Plank-Reihe', 'Swan-Dive 3×8'],
    profi: ['Reformer-Sequenz 30 Min', 'Teaser komplett 5×', 'Boomerang 3×', 'Control Balance', 'Jackknife 3×8'],
  },
  wandern: {
    anfaenger: ['90 Min Wanderung Flachland', 'Trinkpause integrieren', 'Stockeinsatz lernen', 'Rucksack-Packtipp', 'Karten lesen'],
    fortgeschritten: ['3 h Tour mit 400 hm', 'Stockeinsatz üben', 'Snack-Rhythmus halten', 'Höhenmeter-Block 600 hm', 'Geschwindigkeitsvariation'],
    profi: ['5–6 h Bergtour mit 1000 hm+', 'Tempo-Variation', 'Kraft-Tour mit Gewicht im Rucksack', 'Gratwanderung', 'Wettervorhersage planen'],
  },
  mountainbike: {
    anfaenger: ['Grundposition üben 10 Min', 'Bremstechnik 10 Min', 'Trail leicht 60 Min', 'Kurventechnik 5×Anlieger', 'Steile Auffahrt 5×'],
    fortgeschritten: ['Sprünge bis 50 cm', 'Anlieger-Kurven trainieren', 'Trail mittel 90 Min mit Tempowechsel', 'Drop-Vorbereitung', 'Technische Sektion 4×'],
    profi: ['Drop-Training', 'Race-Pace-Intervalle auf Trail', 'Technik-Sektion auf Zeit', 'Manualling 5×', 'Steile Auffahrt all-out 6×'],
  },
  ski: {
    anfaenger: ['Pflug-Bogen üben', 'Carving-Vorbereitung leichter Hang', 'Schwung-Wechsel-Drill', 'Pisten-Etikette', 'Stockeinsatz-Drill'],
    fortgeschritten: ['Carving sauber auf roter Piste', 'Buckelpiste leicht', 'Tiefschnee-Versuch', 'Speed-Variation', 'Slalom-Stangenfahrt'],
    profi: ['Variantenfahrt', 'Tiefschnee-Technik', 'Touren-Aufstieg', 'Carving-Speed', 'Renn-Slalom-Drills'],
  },
  snowboard: {
    anfaenger: ['Front- und Backside-Edge wechseln', 'Slow-Turn-Drill', 'Anfänger-Pist 60 Min', 'Falltechnik', 'Stop-and-Go-Drill'],
    fortgeschritten: ['Carving üben', 'Park-Basics (Boxes, kleine Kicker)', 'Switch-Riding 30 Min', 'Ollie-Drill 5×', 'Trick-Vorbereitung'],
    profi: ['Park-Tricks (180/360)', 'Tiefschnee-Carving', 'Boardercross-Sektion', 'Switch-Tricks', 'Halfpipe-Vorbereitung'],
  },
  eishockey: {
    anfaenger: ['Schlittschuh-Stride 10 Min', 'Stick-Handling auf Eis 15 Min', 'Passen mit Partner 10 Min', 'Stand-Schuss 4×10', 'Kreis-Skating-Drill'],
    fortgeschritten: ['Power-Skating 15 Min', 'Stick-Handling mit Tempo', 'One-Timer-Schuss 4×10', 'Spielform 3vs3 4×3 Min', 'Backwards-Skating 10 Min'],
    profi: ['Speed-Skating-Intervalle', 'Live-Drills 4×4 Min', 'Schuss-Kombi-Übungen', 'Spielzüge üben 30 Min', 'Forecheck-Drills 4×3 Min'],
  },
  tanzen: {
    anfaenger: ['Grundschritte 20 Min', 'Rhythmus-Übung 10 Min', 'Choreo-Block 15 Min', 'Isolations-Drill 10 Min', 'Pivot-Drehung 5 Min'],
    fortgeschritten: ['Drehungen & Spins 15 Min', 'Choreo lernen 25 Min', 'Improvisations-Block 10 Min', 'Partnerführung 10 Min', 'Across-the-Floor 15 Min'],
    profi: ['Technik-Repertoire', 'Voll-Choreo 30 Min', 'Performance-Block mit Ausdruck', 'Improvisations-Showcase', 'Master-Class-Style Drills'],
  },
  parkour: {
    anfaenger: ['Präzisionssprünge auf der Stelle', 'Roll-Übung 3×10', 'Speed-Vault leicht 4×10', 'Hangeln 3×30 Sek', 'Cat-Leap-Form'],
    fortgeschritten: ['Präzisionssprünge mittlere Distanz', 'Kong-Vault 5×5', 'Wall-Run 5×', 'Klettern auf Mauern', 'Lazy-Vault 4×5'],
    profi: ['Flow-Line 4×3 Min', 'Komplexe Vaults', 'Cat-Leap + Climb-Up', 'Drop & Roll aus 2 m', 'Dash-Vault 5×5'],
  },
  reiten: {
    anfaenger: ['Schritt 15 Min', 'Trab 10 Min angetrabt', 'Galopp leicht angaloppieren', 'Putzen & Satteln', 'Reitersitz-Drill'],
    fortgeschritten: ['Aufwärmprogramm Dressur', 'Trabverstärkung & Schenkelweichen', 'Galopp-Wechsel üben', 'Cavaletti-Reihe', 'Dressur-Lektion E'],
    profi: ['Lektionen Dressur M-Niveau', 'Springen Parcours', 'Cross-Country-Sequenz', 'Fliegende Wechsel', 'Galopp-Pirouette'],
  },
  golf: {
    anfaenger: ['Putten 30 Bälle aus 1 m', 'Chipping 20 Bälle', 'Iron-Schlag 7er Eisen 30 Bälle', 'Driver leicht', 'Setup-Drill 10 Min'],
    fortgeschritten: ['Putten 50 Bälle aus 2–5 m', 'Bunker-Training 20 Schläge', 'Mid-Iron-Block 30 Bälle', 'Driver Vollkraft 20 Bälle', 'Approach-Distanzen 50 Bälle'],
    profi: ['Putten Drill mit Druck-Situation', 'Wedge-Distanzkontrolle 50 Bälle', 'Driver Spin-Optimierung', 'Course-Management üben', 'Mental-Routine'],
  },
};

/** Generic, sport-agnostic blocks that get mixed in based on day type. */
const WARMUP_BY_INTENSITY: Record<Intensity, string[][]> = {
  low: [
    ['5 Min sanftes Mobilisationsprogramm', 'Atem-Aktivierung 3 Min'],
    ['10 Min lockerer Spaziergang', 'Kreisende Bewegungen 5 Min'],
    ['Cat-Cow + Hüftöffner 8 Min', 'Atem-Routine 4 Min'],
    ['Sanfte Yoga-Sequenz 10 Min', 'Aktivierungs-Drill 3 Min'],
  ],
  medium: [
    ['Dynamische Mobilisation 8 Min', 'Lauf-ABC 6 Übungen × 20m'],
    ['Aktivierung Beinkette 6 Min', 'Sprungvariation 3×10'],
    ['Hip-Mobility-Flow 5 Min', '5 Min lockeres Cardio'],
    ['Schultern + Wirbelsäule mobilisieren 7 Min', 'Aktivierungs-Sprünge 4×10'],
    ['World\'s Greatest Stretch 4× pro Seite', 'Lockeres Einlaufen 5 Min'],
  ],
  high: [
    ['Progressives Warm-up 12 Min', 'Sprintsteigerungen 4×60m'],
    ['RAMP-Protokoll 10 Min', 'Plyo-Aktivierung 3×8'],
    ['Dynamic Stretch 6 Min', 'Sprint-Drill 4×40m'],
    ['Mobility + Cardio-Boost 8 Min', 'Reaktions-Drill 3×30 Sek'],
    ['Aktivierungssatz 6 Min', 'Sprung-ABC 4 Übungen'],
  ],
};

const STRENGTH_POOL: Record<SkillLevel, string[]> = {
  anfaenger: [
    'Goblet-Squat 3×10',
    'Liegestütz 3×8',
    'Romanian Deadlift mit Kurzhanteln 3×10',
    'Rudern (Kurzhantel oder Band) 3×10',
    'Bird-Dog 3×10 pro Seite',
    'Glute Bridge 3×12',
    'Side-Plank 3×30 Sek pro Seite',
    'Dead-Bug 3×10 pro Seite',
    'Step-Ups 3×10 pro Bein',
    'Schulterdrücken (KH) 3×10',
  ],
  fortgeschritten: [
    'Kniebeuge 4×8',
    'Bankdrücken (KH) 4×10',
    'Rumänisches Kreuzheben 4×8',
    'Klimmzüge oder Lat-Pull 4×6',
    'Bulgarian Split Squat 3×8 pro Bein',
    'Hip-Thrust 4×10',
    'Push-Press 4×6',
    'Hanging Knee-Raise 3×10',
    'Walking Lunges 3×12 pro Bein',
    'Pallof-Press 3×12 pro Seite',
  ],
  profi: [
    'Back-Squat 5×5 @ 80 %',
    'Kreuzheben 5×3 @ 85 %',
    'Bankdrücken 5×5',
    'Weighted Pull-Ups 4×5',
    'Front-Squat 4×6',
    'Power Clean 5×3',
    'Push-Jerk 5×3',
    'Dragon-Flag-Progression 4×6',
    'Single-Leg-Deadlift 3×8 pro Bein',
    'Ring-Dips 4×8',
  ],
};

const CONDITIONING_POOL: Record<SkillLevel, string[]> = {
  anfaenger: [
    'Intervalle 5×1 Min schnell / 1 Min Pause',
    'Treppenläufe 4×30 Sek',
    '15 Min Dauerlauf locker',
    'Tabata-Set 4 Min (Squat-Jumps)',
    'Hügel-Walks 5×60 Sek',
    'Kettlebell-Swings 4×15',
    'Box-Step-Ups 4×40 Sek',
    'Skipping 5×1 Min',
  ],
  fortgeschritten: [
    'HIIT 8×30 Sek all-out / 30 Sek Pause',
    'Tempolauf 4×5 Min @ Schwelle',
    'Hügelsprints 6×60 m',
    'Tabata 8×20/10 (Burpees)',
    'EMOM 12 Min (10 Squats + 10 Push-Ups)',
    'Rope Skipping 4×3 Min',
    'Pyramide 1-2-3-2-1 Min',
    'Sled-Pushes 6×30 m',
  ],
  profi: [
    'VO2max Intervalle 6×3 Min',
    'Tabata 8×20/10 mit Kettlebell',
    'Lactate Threshold 3×10 Min',
    'Sprint-Pyramide 100/200/300/200/100 m',
    'Sled-Pushes 8×40 m',
    'Assault-Bike Intervalle 8×40 Sek',
    'Hill-Repeats 10×60 m all-out',
    'Microburst-Block 30/15 Sek × 12',
  ],
};

const RECOVERY_POOL = [
  'Foam-Rolling Beinrückseite & Quadrizeps 10 Min',
  'Yoga-Flow für Hüfte & Rücken 15 Min',
  'Stretching Brust & Schultern 10 Min',
  'Atemarbeit Box-Breathing 8 Min',
  'Spaziergang locker 30 Min',
  'Mobility-Routine Wirbelsäule 12 Min',
  'Lockeres Schwimmen 20 Min',
  'Yin-Yoga 20 Min',
];

const COOLDOWN_POOL = [
  '5 Min lockeres Auslaufen',
  'Statisches Stretching 8 Min',
  'Mobility-Cool-down 6 Min',
  'Atemberuhigung 4 Min',
  'Foam-Rolling 8 Min',
];

/** Coach hints per day type — adds a personalized touch each day. */
const DAY_HINTS: Record<DayType, string[]> = {
  technique: [
    'Heute Tempo runter — Saubere Technik schlägt Geschwindigkeit.',
    'Filme dich kurz mit dem Handy und vergleiche mit einem Pro-Clip.',
    'Achte auf jedes Detail — Wiederholung mit Fokus macht den Unterschied.',
  ],
  conditioning: [
    'Bei den Intervallen wirklich pushen — die Pause ist die Belohnung.',
    'Atmung in der Pause kontrollieren, nicht durch die Belastung hetzen.',
    'Gefühlsskala 7–8/10 in den harten Phasen, sonst zu früh leer.',
  ],
  strength: [
    'Technik vor Gewicht — auch wenn der Kollege mehr drauf hat.',
    'Letzte 2 Wiederholungen sollten richtig anstrengend sein, nicht easy.',
    '60–90 Sek Pause zwischen Sätzen, das ist Teil des Trainings.',
  ],
  play: [
    'Heute Spielform-Fokus: aus Fehlern lernen, weniger über Ergebnis.',
    'Wenn möglich mit besseren Partnern — du lernst am meisten dort.',
    'Sprich mit deinem Trainer/Team — Feedback ist Gold wert.',
  ],
  recovery: [
    'Keine Leistung heute — Schlaf, Wasser und Bewegung sind das Training.',
    'Höre auf deinen Körper, weniger ist heute mehr.',
    'Mobility-Tag heißt: zwischendurch lange dehnen, nicht hetzen.',
  ],
  mixed: [
    'Kombi-Tag: leicht starten, dann steigern, am Ende auslaufen.',
    'Wechsel zwischen Belastungsformen hält den Körper wach.',
    'Heute geht es um Vielfalt — keine Übung dominiert.',
  ],
  long: [
    'Lang heißt: locker beginnen, durchziehen, nicht überdrehen.',
    'Trink- und Snack-Strategie im Voraus klären.',
    'Mentale Ausdauer ist heute genauso wichtig wie körperliche.',
  ],
};

const intensityForDay = (dayType: DayType, week: number, goal: Goal): Intensity => {
  const base = DAY_TYPE_INTENSITY[dayType];
  // Week 4: Deload for hypertrophy/strength/competition; peak for others.
  if (week === 4) {
    if (goal === 'Muskelaufbau' || goal === 'Wettkampf') {
      if (base === 'high') return 'medium';
      if (base === 'medium') return 'low';
    } else {
      if (base === 'medium') return 'high';
    }
  }
  // Week 1: take it slower
  if (week === 1) {
    if (base === 'high' && goal !== 'Wettkampf') return 'medium';
  }
  return base;
};

const titleForDay = (sport: Sport, dayType: DayType): string => {
  return `${DAY_TYPE_LABEL[dayType]} · ${sport.name}`;
};

const seededPick = <T,>(arr: T[], seed: number): T => arr[((seed % arr.length) + arr.length) % arr.length];

const seededPickN = <T,>(arr: T[], n: number, seed: number): T[] => {
  if (!arr.length) return [];
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(arr[((seed + i * 3) % arr.length + arr.length) % arr.length]);
  }
  return result;
};

const sportDrills = (sport: Sport, level: SkillLevel): string[] =>
  SPORT_DRILLS[sport.id]?.[level] ?? [];

interface BuildDayArgs {
  sport: Sport;
  level: SkillLevel;
  dayType: DayType;
  week: number;
  dayIdxInWeek: number;
  duration: Duration;
  goal: Goal;
}

const buildDay = ({ sport, level, dayType, week, dayIdxInWeek, duration, goal }: BuildDayArgs): TrainingDay => {
  const intensity = intensityForDay(dayType, week, goal);
  const seed = week * 7 + dayIdxInWeek + dayType.length;

  const drills = sportDrills(sport, level);
  const warmup = seededPick(WARMUP_BY_INTENSITY[intensity], seed);
  const cooldown = seededPick(COOLDOWN_POOL, seed + 1);
  const hint = seededPick(DAY_HINTS[dayType], seed + 2);

  // How many "main" exercises depending on duration
  const mainCount = duration <= 20 ? 2 : duration <= 45 ? 3 : duration <= 60 ? 4 : 5;

  const main: string[] = [];

  switch (dayType) {
    case 'technique':
      main.push(...seededPickN(drills, mainCount, seed));
      break;
    case 'play':
      // Play day: 1-2 drills + open play
      if (drills.length) main.push(...seededPickN(drills, Math.min(2, mainCount), seed));
      main.push(duration >= 60 ? 'Freies Spiel / Live-Situationen 30 Min' : 'Freies Spiel / Live-Situationen 15 Min');
      while (main.length < mainCount && drills.length) {
        main.push(seededPick(drills, seed + main.length));
      }
      break;
    case 'conditioning': {
      const sportSpecific = drills.filter((d) =>
        /sprint|interval|HIIT|Tabata|Lauf|Bahn|Ausfahrt|km|Sweet-Spot|Threshold|all-out|Tempolauf|Pyramide/i.test(d),
      );
      // Prefer sport-specific conditioning if available, else generic
      if (sportSpecific.length >= mainCount - 1) {
        main.push(...seededPickN(sportSpecific, mainCount, seed));
      } else {
        if (sportSpecific.length) main.push(seededPick(sportSpecific, seed));
        const generic = seededPickN(CONDITIONING_POOL[level], mainCount - main.length, seed);
        main.push(...generic);
      }
      break;
    }
    case 'strength': {
      // 1-2 sport-specific (if relevant) + generic strength
      const sportRelevantStrength = drills.filter((d) =>
        /Kraft|Plyo|Sprung|Squat|Pull|Push|Klimmzug|Hip|Kettlebell|Liegestütz|Plank|Stand|Stand-/i.test(d),
      );
      if (sportRelevantStrength.length) main.push(seededPick(sportRelevantStrength, seed));
      const generic = seededPickN(STRENGTH_POOL[level], mainCount - main.length, seed);
      main.push(...generic);
      break;
    }
    case 'recovery':
      main.push(...seededPickN(RECOVERY_POOL, mainCount, seed));
      break;
    case 'mixed': {
      // 1 technique + 1 conditioning + 1 strength
      if (drills.length) main.push(seededPick(drills, seed));
      main.push(seededPick(CONDITIONING_POOL[level], seed + 1));
      if (mainCount >= 3) main.push(seededPick(STRENGTH_POOL[level], seed + 2));
      while (main.length < mainCount) {
        main.push(seededPick(drills.length ? drills : STRENGTH_POOL[level], seed + main.length + 5));
      }
      break;
    }
    case 'long': {
      // Long day: one main long exercise + supporting
      const sportSpecific = drills.length
        ? seededPick(drills, seed)
        : `${sport.name}: lange Einheit ${duration} Min`;
      main.push(`${sportSpecific} (langer Block)`);
      if (mainCount >= 3) main.push(seededPick(CONDITIONING_POOL[level], seed + 1));
      while (main.length < mainCount && drills.length) {
        main.push(seededPick(drills, seed + main.length));
      }
      break;
    }
  }

  // Dedup exercises while preserving order
  const seen = new Set<string>();
  const uniqueMain = main.filter((m) => {
    if (seen.has(m)) return false;
    seen.add(m);
    return true;
  });

  const exercises: string[] = [];
  // Warm-up first
  exercises.push(...warmup);
  exercises.push(...uniqueMain);
  // Cool-down
  exercises.push(cooldown);
  // Coach hint at the end so it stands out
  exercises.push(`💡 ${hint}`);

  return {
    day: WEEKDAYS[0],
    title: titleForDay(sport, dayType),
    duration,
    intensity,
    exercises,
  };
};

const buildTemplatePlan = (sport: Sport, level: SkillLevel, input: PlanInput): TrainingPlan => {
  const dayNames = pickDays(input.daysPerWeek);
  const basePattern =
    DAY_PATTERNS[input.goal]?.[input.daysPerWeek] ?? DAY_PATTERNS[input.goal]?.[3] ?? ['technique', 'conditioning', 'recovery'];

  const weeks: TrainingWeek[] = [];
  for (let w = 1; w <= 4; w++) {
    // Rotate pattern slightly per week so the same weekday isn't always the same type.
    const offset = (w - 1) % basePattern.length;
    const rotated = [...basePattern.slice(offset), ...basePattern.slice(0, offset)];

    const days: TrainingDay[] = dayNames.map((d, idx) => {
      const dayType = rotated[idx] ?? basePattern[idx % basePattern.length] ?? 'technique';
      const day = buildDay({
        sport,
        level,
        dayType,
        week: w,
        dayIdxInWeek: idx,
        duration: input.duration,
        goal: input.goal,
      });
      return { ...day, day: d };
    });

    weeks.push({ week: w, focus: FOCUS_BY_GOAL[input.goal][w - 1], days });
  }

  const coachNote = (() => {
    const base = `4 Wochen ${sport.name} mit Fokus ${input.goal.toLowerCase()}, ${input.daysPerWeek}× pro Woche je ${input.duration} Min auf Level ${LEVEL_DE[level]}.`;
    const time =
      input.time === 'Morgens'
        ? 'Morgens trainiert es sich nüchtern besonders fokussiert — leichtes Frühstück danach.'
        : input.time === 'Mittags'
          ? 'Mittagseinheiten geben den ganzen Nachmittag Energie — achte auf gute Mahlzeiten-Abstände.'
          : 'Abends ist Stress raus — lass dem Körper nach der Einheit Zeit zum Runterfahren.';
    const variety =
      'Jeder Tag hat einen eigenen Schwerpunkt (Technik, Kondition, Kraft, Spielform, Regeneration) — folge der Reihenfolge für beste Erholung.';
    return `${base} ${variety} ${time}`;
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

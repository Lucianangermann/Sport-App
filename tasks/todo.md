# Sportify — Phase 5: Nächste Schritte

## 5.1 — Community-Persistenz: Seed nicht einfrieren
Problem: Der Store persistiert die kompletten Mock-Arrays. Neu in den Code
ergänzte Seed-Inhalte (Posts/Challenges/Spots/Sessions/Buddies) erreichen
Bestandsnutzer nie, weil deren localStorage die alte Kopie hält.
Fix (rein additiv, keine Regression): persist-`merge`, das frische Seed-Items
per `id` ergänzt und ALLE bestehenden Nutzer-Interaktionen erhält.
- [x] communityStore: `unionById` (exportiert) + `merge` über die 5 Content-Arrays
- [x] Verifiziert: build ✓, eslint ✓

## 5.2 — Tests für refaktorierte/neue Logik ← ABGESCHLOSSEN
- [x] community-Reducer: toggleReaction (add/remove/switch), join/leave, toggleFollow, addPost
- [x] communityStore unionById: append/keep/fallback
- [x] (bereits abgedeckt: events, calcLevel, helpers/scoring)
- [x] Verifiziert: 28 Tests grün (20 + 8 neu), eslint exit 0, build ✓

## Review (Phase 5)
- 5.1 Community-Persistenz härtet: neu ausgelieferte Seed-Inhalte erreichen
  Bestandsnutzer jetzt (union-by-id im persist-merge), ohne deren Interaktionen
  zu verlieren. Bewusst KEIN voller Delta-Umbau — die Mock-Typen vermischen
  Seed/Nutzerstatus; ein Rewrite wäre für ein Demo-Feature überengineert/riskant.
- 5.2 Testabdeckung von 20 → 28: Community-Reducer-Mathematik + merge-Logik
  abgesichert. Round-trip-Tests sind ordnungsunabhängig (Singleton-Store).
- Beide Schritte verifiziert und committet.

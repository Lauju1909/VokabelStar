# 🤖 Richtlinien für KI-Agenten (VokabelStar (Desktop))
<!-- Für alle KI-Assistenten (Claude, ChatGPT, Copilot, Gemini, Cursor, Antigravity) -->

Dieses Dokument definiert die **verbindlichen Regeln**, Pflichten und Verbote für jede KI, die an diesem Projekt arbeitet.

---

## 🚫 1. Was Agenten STRIKT VERBOTEN ist (DON'TS)

1. **KEINE manuellen Versionsnummern-Änderungen:**
   - ❌ Ändere NIEMALS manuell Versionsnummern in `version.json`, `build.gradle`, `package.json`, `app.js` oder HTML-Dateien!
   - ℹ️ GitHub Actions CI/CD (`build-release.yml` bzw. `build-apk.yml`) erhöht die Versionsnummern (`version`, `versionCode`, `versionName`) und alle UI-Referenzen bei jedem Push auf `main` **vollautomatisch**.
2. **KEINE manuellen GitHub Releases oder Git-Tags anlegen:**
   - ❌ Erstelle niemals manuell Tags wie `v1.x.x` oder Releases über Git/CLI. GitHub Actions kompiliert, taggt und veröffentlicht Releases automatisch.
3. **KEINE privaten Daten des Autors veröffentlichen:**
   - ❌ Der Entwickler ist **Laurin Schneider**. Es dürfen **NIEMALS** private Anschriften, Adressen, Telefonnummern oder vertrauliche persönliche Angaben in Code, Commits, Dokumentation oder Issues hinterlegt werden (Datenschutz & Privatsphäre!).
4. **KEINE bestehenden Benutzerdaten oder Vokabeln beschädigen:**
   - ❌ Niemals vorhandene Vokabellisten, Beispieldaten, Backup-Strukturen oder Datenbank-Schemata löschen oder inkompatibel umbauen.
   - 100% Abwärtskompatibilität für alle gespeicherten Daten (Vokabeln, Noten, Finanzbuchungen, Stundenpläne) ist zwingend vorgeschrieben.
5. **KEINE unzugänglichen UI-Elemente bauen:**
   - ❌ Niemals klickbare Elemente ohne Tastatur-Fokus (`tabindex="0"`), ohne `role="button"` oder ohne `aria-label` verwenden.
   - ❌ Niemals reine Maus-Hover-Interaktionen ohne Tastatur-Alternative einbauen.
6. **KEINE Multiplattform-Inkompatibilitäten erzeugen:**
   - ❌ Änderungen dürfen weder den Windows-Betrieb, noch die Linux-Nutzung, noch den Android-Build stören. Beide Systeme müssen unabhängig und fehlerfrei funktionieren.

---

## ✅ 2. Was Agenten TUN MÜSSEN (DO'S & PFLICHTEN)

- **Automatisches Änderungsprotokoll (Changelog):**
  - Deine Git-Commit-Nachricht wird von GitHub Actions **vollautomatisch als offizielles Änderungsprotokoll** in das GitHub-Release übernommen!
  - Schreibe daher immer aussagekräftige, klare Commit-Nachrichten (z. B. ix: Fehler bei Screenreader-Ansage behoben oder eat: Neuer barrierefreier Export hinzugefügt).

1. **100% Barrierefreiheit (WCAG 2.2 AAA & Screenreader-Kompatibilität):**
   - ♿ Zielgruppe: Blinde und stark sehbehinderte Nutzer mit Screenreadern (NVDA, JAWS, Orca (Desktop)).
   - Jedes UI-Element muss voll per Tastatur (`Tab`, `Enter`, `Leertaste`, Pfeiltasten) erreichbar und bedienbar sein.
   - Statusmeldungen, Dialoge, Ladevorgänge und Fehler MÜSSEN über `aria-live="polite"` oder `aria-live="assertive"` an den Screenreader gemeldet werden.
   - Hohe Kontraste, klare semantische Überschriften-Hierarchien (`<h1>`-`<h6>`) und eindeutige Beschriftungen.
2. **Sauberer Git-Workflow:**
   - Änderungen am Code ganz normal entwickeln, testen und auf den Branch `main` pushen.
   - Bei reinen Dokumentations-Commits (die keinen Build oder Release erfordern) immer `[skip ci]` in die Commit-Message schreiben.
3. **Lokale Datenhaltung & Offline-First:**
   - Alle Funktionen müssen lokal, fehlertolerant und offline nutzbar sein.
   - Export- und Import-Funktionen (JSON/CSV) immer robust gegen ungültige oder veraltete Eingaben absichern.

---

## ⚙️ 3. Technische Projektdaten

- **Projekttyp:** Barrierefreier Vokabeltrainer mit Word/Excel-Import, Audio-Unterstützung und mehreren Lernmodi.
- **Plattformen & Build:** Windows (.exe via C# csc.exe) & Linux (PyInstaller Standalone aus launcher_linux.py)
- **Wichtige Kerndateien:** `VokabelStar_App.html, index.html, VokabelStarProgram.cs, launcher_linux.py, version.json`
- **CI/CD Pipeline:** Befindet sich unter `.github/workflows/`. Führt automatische Tests, Kompilierung und Veröffentlichung durch.

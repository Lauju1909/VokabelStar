# 🤖 Verbindliche Anweisungen für alle KI-Modelle & Agenten (VokabelStar (Desktop))
<!-- Gilt für alle KI-Assistenten: OpenAI (ChatGPT/Codex), Anthropic (Claude Code), Google (Gemini/Antigravity), GitHub Copilot, Cursor, Windsurf -->

Dieses Dokument definiert die **verbindlichen Regeln, Pflichten und Verbote** für jedes KI-Modell und jeden Agenten, der in diesem Repository arbeitet.

---

## 🚫 1. Was KI-Modelle STRIKT NICHT TUN DÜRFEN (DON'TS / VERBOTE)

1. ❌ **KEINE manuellen Versionsnummern ändern:**
   - Ändere NIEMALS manuell Versionsnummern in `version.json`, `build.gradle` (`versionCode`/`versionName`), `package.json`, `app.js` oder HTML-Dateien!
   - ℹ️ GitHub Actions CI/CD (`build-release.yml` bzw. `build-apk.yml`) erhöht die Versionsnummern und synchronisiert alle Stellen im gesamten Projekt bei jedem Push auf `main` **vollautomatisch**.
2. ❌ **KEINE manuellen GitHub Releases oder Git-Tags anlegen:**
   - Erstelle niemals manuell Tags wie `v1.x.x` oder Releases über Git/CLI. GitHub Actions kompiliert, taggt und veröffentlicht Multiplattform-Releases automatisch.
3. ❌ **KEINE privaten Daten des Autors veröffentlichen:**
   - Der Entwickler ist **Laurin Schneider**. Es dürfen **NIEMALS** private Anschriften, Wohnadressen, Telefonnummern oder vertrauliche persönliche Angaben in Code, Commits, Dokumentation oder Issues hinterlegt werden (strikter Schutz der Privatsphäre!).
4. ❌ **KEINE bestehenden Benutzerdaten oder Vokabeln beschädigen:**
   - Niemals vorhandene Vokabellisten, Beispieldaten, Backup-Strukturen, Notizen oder Finanzdaten löschen oder inkompatibel umbauen.
   - 100% Abwärtskompatibilität für alle gespeicherten Daten (Vokabeln, Noten, Finanzbuchungen, Stundenpläne) ist zwingend vorgeschrieben.
5. ❌ **KEINE unzugänglichen UI-Elemente bauen:**
   - Niemals klickbare Elemente ohne Tastatur-Fokus (`tabindex="0"`), ohne `role="button"` oder ohne aussagekräftiges `aria-label` verwenden.
   - Niemals reine Maus-Hover-Interaktionen ohne Tastaturalternative einbauen.
6. ❌ **KEINE Multiplattform-Inkompatibilitäten erzeugen:**
   - Änderungen dürfen weder den Windows-Betrieb, noch die Linux-Nutzung, noch den Android-Build stören. Beide Systeme müssen unabhängig und fehlerfrei funktionieren.

---

## ✅ 2. Was KI-Modelle TUN MÜSSEN (DO'S & PFLICHTEN)

1. 📝 **Aussagekräftige Commit-Nachrichten für das automatische Änderungsprotokoll:**
   - Deine Commit-Nachricht wird von GitHub Actions **vollautomatisch als offizielles Release-Änderungsprotokoll (Changelog)** auf GitHub übernommen!
   - Schreibe daher immer verständliche, prägnante Commit-Nachrichten (am besten nach Conventional Commits):
     - `feat: Neuer barrierefreier Tabellenfilter` (für neue Funktionen)
     - `fix: Fehler bei Screenreader-Ansage behoben` (für Fehlerbehebungen)
     - `perf: Ladezeit der Vokabeln optimiert` (für Optimierungen)
2. ♿ **100% Barrierefreiheit (WCAG 2.2 AAA & Screenreader-Fokus):**
   - Zielgruppe: Blinde und sehbehinderte Menschen mit Screenreadern (NVDA, JAWS, Orca (Desktop)).
   - Jedes UI-Element muss vollständig ohne Maus per Tastatur (`Tab`, `Enter`, `Leertaste`, Pfeiltasten) erreichbar und bedienbar sein.
   - Alle Statusänderungen, Dialoge, Ladevorgänge und Fehler MÜSSEN über `aria-live="polite"` oder `aria-live="assertive"` an den Screenreader gemeldet werden.
   - Hohe Kontraste, klare semantische Überschriften (`<h1>`-`<h6>`) und sprechende Beschriftungen.
3. 🚀 **Sauberer Git-Workflow:**
   - Entwickle Änderungen am Code normal und pushe sie auf den Branch `main`.
   - Bei reinen Dokumentations-Commits (die keinen Build oder Release erfordern) immer `[skip ci]` in die Commit-Message schreiben.
4. 💾 **Lokale Datenhaltung & Offline-First:**
   - Alle Funktionen müssen lokal, fehlertolerant und offline nutzbar sein.
   - Import- und Export-Funktionen (JSON/CSV) immer robust gegen ungültige Eingaben absichern.

---

## ⚙️ 3. Technische Projektdaten

- **Projekttyp:** Barrierefreier Vokabeltrainer mit Word/Excel-Import, Audio-Unterstützung und mehreren Lernmodi.
- **Plattformen & Build:** Windows (.exe via C# csc.exe) & Linux (PyInstaller Standalone aus launcher_linux.py)
- **Wichtige Kerndateien:** `VokabelStar_App.html, index.html, VokabelStarProgram.cs, launcher_linux.py, version.json`
- **CI/CD Pipeline:** Befindet sich unter `.github/workflows/`. Führt automatische Tests, Kompilierung, Versionierung und Changelog-Erstellung durch.

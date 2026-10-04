# 🦉 VokabelStar – Barrierefreier Vokabeltrainer wie Duolingo

Eine barrierefreie, motivierende Vokabel-Lern-App im echten **Duolingo-Stil**, die speziell dafür entwickelt wurde, **ohne ständiges Tippen** zu lernen – mit voller Unterstützung für **blinde Nutzer (Screenreader)**, **automatischer Anpassung an die Systemsprache** deines Handys oder PCs und direktem **Import von Word- und Excel-Dateien**.

---

## 🚀 Schnellstart

* **Per Doppelklick starten:** Öffne einfach die Datei `Start_VokabelStar.bat`
* **Oder im Browser:** Öffne direkt die Datei `index.html` mit Edge, Chrome, Firefox oder Safari.
* **100% Offline-fähig:** Funktioniert komplett ohne Internetverbindung.

---

## 🎮 Duolingo-Features für Blinde & Sehende

* **🔥 Tages-Streak:** Zählt mit, wie viele Tage in Folge du gelernt hast.
* **⚡ XP & Level:** Verdiene +10 XP pro richtige Antwort und +25 Bonus XP pro abgeschlossene Lektion. Steige von Stufe 1 bis Stufe 5+ auf!
* **❤️ Herzen / Leben-System:**
  * Standardmäßig 5 Herzen. Falsche Antworten ziehen ein Herz ab.
  * In den Einstellungen kannst du jederzeit **„Unbegrenzte Herzen“** für stressfreies, entspanntes Lernen aktivieren.
  * Herzen können mit einem Klick in den Einstellungen wieder auf 5 aufgefüllt werden.
* **🗺️ Interaktiver Lernpfad:**
  * Schritt für Schritt Einheiten und Lektionen mit Kronen 👑 und Sternen ⭐ meistern.
* **🎯 Tages-Quests (Herausforderungen):**
  * Tägliche Missionen (z. B. *Schließe 1 Lektion ab*, *Sammle 30 XP*, *Löse 5 Paare*) mit Belohnungs-XP.
* **🦉 Maskottchen Oli die Eule:**
  * Gibt motivierende Tipps, Ratschläge und feiert deine Erfolge.
  * Drücke jederzeit die Taste `O` auf deiner Tastatur für einen motivierenden Spruch!

---

## 🌍 Internationale Sprachunterstützung & Systemerkennung

* **📱 Automatische Geräte-Sprache:** Erkennt sofort die Systemsprache deines Smartphones (Android, iOS) oder PCs (Windows, Mac, Linux).
* **Manuelle Sprachauswahl:** In der Menüleiste und in den Einstellungen kann die Oberflächensprache jederzeit gewechselt werden:
  * 🇩🇪 Deutsch
  * 🇬🇧 English
  * 🇪🇸 Español
  * 🇫🇷 Français
  * 🇮🇹 Italiano
  * 🇵🇹 Português
  * 🇹🇷 Türkçe
  * 🇵🇱 Polski
  * 🇺🇦 Українська
  * 🇷🇺 Русский
  * 🇸🇦 العربية (inkl. Rechts-nach-Links RTL-Layout)
* **Screenreader-Sprachumschaltung:** Beim Sprachwechsel wird das HTML-Attribut `lang="..."` automatisch angepasst, sodass NVDA, JAWS und VoiceOver die richtige Vorlesestimme wählen.

---

## 📥 Neuer Vokabel-Upload-Hub in den Einstellungen

Du kannst Vokabeln jetzt an **zwei bequemen Orten** hochladen:
1. Im separaten Reiter **„📥 Word/Excel Import“**
2. Direkt im Reiter **„⚙️ Einstellungen & Upload“** über den Schnell-Upload-Hub

### Unterstützte Dokumentformate:
* **Microsoft Excel (`.xlsx`, `.xls`):** Liest Tabellen automatisch ein (Spalte 1 = Begriff, Spalte 2 = Übersetzung, Spalte 3 = Notiz).
* **Microsoft Word (`.docx`):** Liest Tabellen oder Listen direkt aus Word-Dokumenten aus.
* **CSV / Tabellen (`.csv`, `.tsv`):** Mit Komma, Semikolon oder Tabulator.
* **Textdateien (`.txt`) oder Zwischenablage (Copy-Paste):** Zeilen wie `Hund = dog`, `Katze - cat` oder `Haus : house`.
* **Fertige Test-Dateien:** Im Ordner `beispiele/` liegen Musterdateien (`.xlsx`, `.docx`, `.csv`, `.txt`) bereit.

---

## ♿ Barrierefreiheit (WCAG 2.2 AAA Fokus)

* **Screenreader:** `aria-live`-Regionen melden Punktestände, Treffer, Fehler und Aufgabenwechsel in Echtzeit.
* **Synthetisches Audio:** Eigene Duolingo-ähnliche Zweiklang-Töne für Treffer, gedämpfter Summton für Fehler, Jubel-Fanfare bei Level-Aufstieg.
* **Vorlesestimme (Text-to-Speech):** Liest Vokabeln auf Knopfdruck (`Taste R`) oder automatisch in der Zielsprache vor.
* **Schriftgrößen-Umschaltung:** Standard (100%), Groß (125%) oder Sehr groß (150%) für Sehbehinderte.
* **Farbschemata:** Duolingo Grün, Klassisch Blau und OLED-Hochkontrast (Schwarz / Gelb / Cyan).

---

## ⌨️ Tastatur-Kurzbefehle (Shortcuts)

| Taste | Funktion |
| :--- | :--- |
| `Alt + 1` bis `Alt + 5` | Tabs wechseln (Lernpfad, Üben, Listen, Import, Einstellungen) |
| `1`, `2`, `3`, `4` | Antworten wählen / Karteikarten bewerten |
| `J` / `N` | Ja oder Nein im Wahr/Falsch-Modus |
| `Leertaste` | Karte umdrehen oder Auswahl bestätigen |
| `R` | Aktuelles Wort erneut aussprechen |
| `O` | Maskottchen Oli nach einem Tipp fragen |
| `Esc` | Laufende Übung abbrechen & zurückkehren |
| `Alt + S` | Töne ein-/ausschalten |
| `Alt + V` | Sprachausgabe ein-/ausschalten |
| `Alt + K` | Hohen Kontrast umschalten |

---

## 🔒 Datenschutz
100% lokal. Alle Vokabeln, Streaks, XP und Lernfortschritte verbleiben auf deinem Computer im Browser-Speicher (`localStorage`). Keine Registrierung, kein Cloud-Zwang, kein Tracking.

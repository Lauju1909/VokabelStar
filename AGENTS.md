# 🤖 Hinweise für KI-Agenten (AI Agents Guide)

## ⚡ Automatisiertes Build-, Auto-Versioning- und Release-System
- **Automatische Versionserhöhung:** Die Versionsnummer in `version.json` wird bei jedem Push auf den Branch `main` **vollautomatisch durch GitHub Actions erhöht** (z. B. `1.1.0` -> `1.1.1`).
- **Automatischer Multi-Plattform Build (Windows & Linux):**
  - **Windows:** GitHub Actions kompiliert auf `windows-latest` automatisch `VokabelStar.exe` und `VokabelStar_App.html` über `node build_desktop.js` / `csc.exe`.
  - **Linux:** GitHub Actions kompiliert auf `ubuntu-latest` automatisch `VokabelStar-Linux` über PyInstaller aus `launcher_linux.py`.
- **Automatisches GitHub-Release:** Für jeden Commit auf `main` wird automatisch ein neues GitHub-Release erstellt und die Windows- und Linux-Dateien als Download angehängt.

## 📌 Was KI-Agenten beachten MÜSSEN:
1. **Keine manuellen Releases oder Versionsnummern-Änderungen erzwingen:** Features und Bugfixes normal committen. Nach dem Push auf `main` übernimmt GitHub Actions das Hochzählen der Patch-Version, das Taggen und das Veröffentlichen des Releases vollautomatisch.
2. **Barrierefreiheit (WCAG 2.2 AAA & NVDA / JAWS / Orca):** Alle Komponenten müssen 100% barrierefrei bleiben.

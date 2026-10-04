/**
 * VokabelStar – Accessible Vocabulary Trainer (Duolingo Style)
 * Full Gamification: Streaks 🔥, XP ⚡, Hearts ❤️, Levels 🎖️, Daily Quests & Learning Path
 * Universal Document Import: Word (.docx), Excel (.xlsx, .xls), CSV, Text
 * Multi-Language UI (i18n) with Automatic Device/System Language Detection
 * 100% Screenreader Accessible (WCAG 2.2 AAA Standard Focus)
 */

// ==========================================
// 1. STARTER DECKS & STORAGE
// ==========================================

const DEFAULT_DECKS = [
  {
    id: "deck_en_starter",
    title: "Englisch: Alltag & Grundwortschatz",
    lang: "en-US",
    words: [
      { id: "w1", source: "der Hund", target: "dog", note: "Tier", box: 1 },
      { id: "w2", source: "die Katze", target: "cat", note: "Tier", box: 1 },
      { id: "w3", source: "das Haus", target: "house", note: "Gebäude", box: 1 },
      { id: "w4", source: "der Baum", target: "tree", note: "Natur", box: 1 },
      { id: "w5", source: "das Wasser", target: "water", note: "Getränk", box: 1 },
      { id: "w6", source: "das Brot", target: "bread", note: "Essen", box: 1 },
      { id: "w7", source: "das Buch", target: "book", note: "Gegenstand", box: 1 },
      { id: "w8", source: "die Schule", target: "school", note: "Ort", box: 1 },
      { id: "w9", source: "der Freund", target: "friend", note: "Mensch", box: 1 },
      { id: "w10", source: "das Auto", target: "car", note: "Fahrzeug", box: 1 },
      { id: "w11", source: "die Sonne", target: "sun", note: "Natur", box: 1 },
      { id: "w12", source: "der Mond", target: "moon", note: "Natur", box: 1 },
      { id: "w13", source: "glücklich", target: "happy", note: "Gefühl", box: 1 },
      { id: "w14", source: "schnell", target: "fast", note: "Eigenschaft", box: 1 },
      { id: "w15", source: "lernen", target: "learn", note: "Verb", box: 1 }
    ]
  },
  {
    id: "deck_es_starter",
    title: "Spanisch: Erste Schritte",
    lang: "es-ES",
    words: [
      { id: "es1", source: "Hallo", target: "hola", note: "Begrüßung", box: 1 },
      { id: "es2", source: "Danke", target: "gracias", note: "Höflichkeit", box: 1 },
      { id: "es3", source: "Bitte", target: "por favor", note: "Höflichkeit", box: 1 },
      { id: "es4", source: "das Wasser", target: "el agua", note: "Getränk", box: 1 },
      { id: "es5", source: "die Katze", target: "el gato", note: "Tier", box: 1 },
      { id: "es6", source: "der Hund", target: "el perro", note: "Tier", box: 1 },
      { id: "es7", source: "gut", target: "bueno", note: "Eigenschaft", box: 1 },
      { id: "es8", source: "die Zeit", target: "el tiempo", note: "Begriff", box: 1 },
      { id: "es9", source: "die Nacht", target: "la noche", note: "Tageszeit", box: 1 },
      { id: "es10", source: "die Straße", target: "la calle", note: "Ort", box: 1 }
    ]
  },
  {
    id: "deck_fr_starter",
    title: "Französisch: Begrüßung & Essen",
    lang: "fr-FR",
    words: [
      { id: "fr1", source: "Guten Tag", target: "bonjour", note: "Begrüßung", box: 1 },
      { id: "fr2", source: "Danke", target: "merci", note: "Höflichkeit", box: 1 },
      { id: "fr3", source: "Auf Wiedersehen", target: "au revoir", note: "Abschied", box: 1 },
      { id: "fr4", source: "der Apfel", target: "la pomme", note: "Obst", box: 1 },
      { id: "fr5", source: "das Brot", target: "le pain", note: "Essen", box: 1 },
      { id: "fr6", source: "der Kaffee", target: "le café", note: "Getränk", box: 1 },
      { id: "fr7", source: "das Haus", target: "la maison", note: "Gebäude", box: 1 },
      { id: "fr8", source: "die Nacht", target: "la nuit", note: "Tageszeit", box: 1 }
    ]
  }
];

class StorageManager {
  static KEY_DECKS = "vokabelstar_decks";
  static KEY_ACTIVE_DECK = "vokabelstar_active_deck";
  static KEY_SETTINGS = "vokabelstar_settings";
  static KEY_PROGRESS = "vokabelstar_gamification";

  static getSettings() {
    const raw = localStorage.getItem(this.KEY_SETTINGS);
    const defaults = {
      soundEnabled: true,
      speechEnabled: true,
      highContrast: false,
      theme: "theme-duo",
      fontSize: "normal",
      ttsRate: 1.0,
      soundVolume: 0.8,
      autoPronounce: true,
      unlimitedHearts: false,
      enableTypingExercises: false,
      selectedVoiceURI: ""
    };
    if (!raw) return defaults;
    try {
      return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {
      return defaults;
    }
  }

  static saveSettings(settings) {
    localStorage.setItem(this.KEY_SETTINGS, JSON.stringify(settings));
  }

  static getProgress() {
    const raw = localStorage.getItem(this.KEY_PROGRESS);
    const defaults = {
      xp: 0,
      streak: 1,
      lastStreakDate: new Date().toISOString().slice(0, 10),
      hearts: 5,
      maxHearts: 5,
      level: 1,
      todayCompletedLessons: 0,
      todayEarnedXp: 0,
      todayMatchPairsSolved: 0
    };
    if (!raw) return defaults;
    try {
      return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {
      return defaults;
    }
  }

  static saveProgress(prog) {
    localStorage.setItem(this.KEY_PROGRESS, JSON.stringify(prog));
  }

  static getDecks() {
    const raw = localStorage.getItem(this.KEY_DECKS);
    if (!raw) {
      this.saveDecks(DEFAULT_DECKS);
      return DEFAULT_DECKS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DECKS;
    } catch (e) {
      return DEFAULT_DECKS;
    }
  }

  static saveDecks(decks) {
    localStorage.setItem(this.KEY_DECKS, JSON.stringify(decks));
  }

  static getActiveDeckId() {
    return localStorage.getItem(this.KEY_ACTIVE_DECK) || "deck_en_starter";
  }

  static setActiveDeckId(id) {
    localStorage.setItem(this.KEY_ACTIVE_DECK, id);
  }
}

// ==========================================
// 2. DUOLINGO GAMIFICATION ENGINE
// ==========================================

class GamificationEngine {
  constructor() {
    this.progress = StorageManager.getProgress();
    this.checkDailyStreak();
  }

  checkDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = this.progress.lastStreakDate;

    if (!lastDate) {
      this.progress.lastStreakDate = today;
      this.progress.streak = 1;
    } else if (lastDate !== today) {
      const diffDays = Math.round((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        // Logged in the next consecutive day!
        this.progress.streak += 1;
        this.progress.lastStreakDate = today;
      } else if (diffDays > 1) {
        // Missed a day
        this.progress.streak = 1;
        this.progress.lastStreakDate = today;
      }
      // Reset daily quest counters
      this.progress.todayCompletedLessons = 0;
      this.progress.todayEarnedXp = 0;
      this.progress.todayMatchPairsSolved = 0;
      // Refill hearts each day
      this.progress.hearts = this.progress.maxHearts;
    }
    this.updateLevel();
    this.save();
  }

  updateLevel() {
    // Level formula: Level = floor(XP / 100) + 1
    const newLevel = Math.floor(this.progress.xp / 100) + 1;
    if (newLevel > this.progress.level) {
      this.progress.level = newLevel;
      announceToScreenReader(I18n.t("mascot_level_up", { level: newLevel }), "assertive");
      audioManager.playFanfare();
    }
  }

  addXP(amount) {
    this.progress.xp += amount;
    this.progress.todayEarnedXp += amount;
    this.updateLevel();
    this.save();
    this.renderStats();
    this.checkQuests();
  }

  loseHeart() {
    if (appState.settings.unlimitedHearts) return true;

    if (this.progress.hearts > 1) {
      this.progress.hearts -= 1;
      this.save();
      this.renderStats();
      audioManager.playHeartLost();
      announceToScreenReader(I18n.t("heart_lost_msg", { hearts: this.progress.hearts }), "assertive");
      return true;
    } else {
      this.progress.hearts = 0;
      this.save();
      this.renderStats();
      audioManager.playHeartLost();
      announceToScreenReader(I18n.t("no_hearts_left"), "assertive");
      return false; // Out of hearts
    }
  }

  refillHearts() {
    this.progress.hearts = this.progress.maxHearts;
    this.save();
    this.renderStats();
    audioManager.playSuccess();
    announceToScreenReader("Herzen wieder voll aufgeladen (5 von 5).", "assertive");
  }

  recordMatchPairSolved() {
    this.progress.todayMatchPairsSolved += 1;
    this.save();
    this.checkQuests();
  }

  recordLessonComplete() {
    this.progress.todayCompletedLessons += 1;
    this.addXP(25); // Bonus XP for full lesson
    this.save();
    this.checkQuests();
  }

  checkQuests() {
    // Quest 1: 1 lesson (target 1)
    const q1Pct = Math.min(100, Math.round((this.progress.todayCompletedLessons / 1) * 100));
    const q1Fill = document.getElementById("quest-1-fill");
    if (q1Fill) q1Fill.style.width = `${q1Pct}%`;

    // Quest 2: 30 XP (target 30)
    const q2Pct = Math.min(100, Math.round((this.progress.todayEarnedXp / 30) * 100));
    const q2Fill = document.getElementById("quest-2-fill");
    if (q2Fill) q2Fill.style.width = `${q2Pct}%`;

    // Quest 3: 5 pairs (target 5)
    const q3Pct = Math.min(100, Math.round((this.progress.todayMatchPairsSolved / 5) * 100));
    const q3Fill = document.getElementById("quest-3-fill");
    if (q3Fill) q3Fill.style.width = `${q3Pct}%`;
  }

  renderStats() {
    // Streak
    const streakVal = document.getElementById("display-streak-count");
    if (streakVal) streakVal.textContent = this.progress.streak;

    const streakSr = document.getElementById("sr-streak-text");
    if (streakSr) streakSr.textContent = I18n.t("streak_label", { count: this.progress.streak });

    // XP
    const xpVal = document.getElementById("display-xp-count");
    if (xpVal) xpVal.textContent = this.progress.xp;

    const xpSr = document.getElementById("sr-xp-text");
    if (xpSr) xpSr.textContent = I18n.t("xp_label", { count: this.progress.xp });

    // Hearts
    const heartsVal = document.getElementById("display-hearts-count");
    const heartsSr = document.getElementById("sr-hearts-text");
    if (heartsVal) {
      if (appState.settings.unlimitedHearts) {
        heartsVal.textContent = "∞";
        if (heartsSr) heartsSr.textContent = I18n.t("hearts_unlimited");
      } else {
        heartsVal.textContent = this.progress.hearts;
        if (heartsSr) heartsSr.textContent = I18n.t("hearts_label", { count: this.progress.hearts });
      }
    }

    // Level
    const levelText = document.getElementById("display-level-text");
    if (levelText) levelText.textContent = I18n.t("level_label", { level: this.progress.level });

    this.checkQuests();
  }

  save() {
    StorageManager.saveProgress(this.progress);
  }
}

// ==========================================
// 3. AUDIO & SPEECH SYNTHESIS ENGINE
// ==========================================

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.currentAudioPlayer = null;
    this.isLocalTtsAvailable = true;
    this.initVoices();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  initVoices() {
    if (!this.synth) return;
    const update = () => {
      this.voices = this.synth.getVoices();
      if (typeof populateVoiceList === "function") {
        populateVoiceList();
      }
    };
    update();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = update;
    }
  }

  getBestVoiceForLang(langCode = "en-US") {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const prefix = langCode.slice(0, 2).toLowerCase();

    // 1. If user selected a custom voice
    if (appState.settings && appState.settings.selectedVoiceURI && appState.settings.selectedVoiceURI !== "sapi_local") {
      const userChoice = this.voices.find(v => v.voiceURI === appState.settings.selectedVoiceURI);
      if (userChoice && userChoice.lang.toLowerCase().replace("_", "-").startsWith(prefix)) {
        return userChoice;
      }
    }

    // Filter all voices strictly matching this language prefix
    const langVoices = this.voices.filter(v => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
    if (langVoices.length === 0) return null;

    // Preference: High-fidelity / Natural English voices
    const preferredNames = ["natural", "online", "google", "jenny", "guy", "aria", "zira", "david", "mark", "george", "samantha", "daniel"];
    for (const name of preferredNames) {
      const match = langVoices.find(v => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    // Exact lang match
    const exact = langVoices.find(v => v.lang.toLowerCase().replace("_", "-") === langCode.toLowerCase());
    if (exact) return exact;

    return langVoices[0];
  }

  loadVoices() {
    this.initVoices();
  }

  playTone(freq, type, duration, startTime = 0, gainLevel = 0.2) {
    if (!appState.settings || !appState.settings.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);

    const actualVol = gainLevel * (appState.settings ? appState.settings.soundVolume : 0.8);
    gain.gain.setValueAtTime(actualVol, this.audioCtx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(this.audioCtx.currentTime + startTime);
    osc.stop(this.audioCtx.currentTime + startTime + duration);
  }

  playSuccess() {
    this.playTone(587.33, "triangle", 0.12, 0, 0.25);
    this.playTone(880.00, "sine", 0.22, 0.08, 0.3);
  }

  playError() {
    this.playTone(220, "sawtooth", 0.15, 0, 0.2);
    this.playTone(185, "sawtooth", 0.2, 0.12, 0.2);
  }

  playHeartLost() {
    this.playTone(330, "sawtooth", 0.15, 0, 0.25);
    this.playTone(260, "sawtooth", 0.25, 0.1, 0.25);
  }

  playSelect() {
    this.playTone(700, "sine", 0.06, 0, 0.15);
  }

  playFanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      this.playTone(freq, "triangle", 0.25, idx * 0.1, 0.25);
    });
  }

  async speak(text, lang = "en-US") {
    if (!text || !appState.settings || !appState.settings.speechEnabled) return;
    const clean = String(text).trim();
    if (!clean) return;

    const targetLang = lang || (appState.activeDeck && appState.activeDeck.lang) || "en-US";

    // Strict Safeguard: If target language is English, NEVER pronounce German words!
    if (targetLang.toLowerCase().startsWith("en")) {
      const deScore = typeof scoreGerman === "function" ? scoreGerman(clean) : 0;
      const enScore = typeof scoreEnglish === "function" ? scoreEnglish(clean) : 0;
      if (deScore > enScore && deScore >= 2) {
        console.warn(`[AudioManager] Vorlesen für deutsches Wort "${clean}" mit englischer TTS blockiert.`);
        return;
      }
    }

    const pronounceText = expandVocabAbbreviations(clean);

    // Stop current audio or speech
    if (this.currentAudioPlayer) {
      try { this.currentAudioPlayer.pause(); } catch (e) {}
      this.currentAudioPlayer = null;
    }
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }

    // 1. Priorität: Lokale echte Microsoft Zira Systemstimme (/api/tts)
    const preferLocalVoice = !appState.settings || !appState.settings.selectedVoiceURI || appState.settings.selectedVoiceURI === "sapi_local";
    if (preferLocalVoice && this.isLocalTtsAvailable) {
      try {
        const res = await fetch(`/api/tts?text=${encodeURIComponent(pronounceText)}&lang=${encodeURIComponent(targetLang)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.ok && data.url) {
            const audio = new Audio(data.url);
            this.currentAudioPlayer = audio;
            audio.playbackRate = (appState.settings && appState.settings.ttsRate) || 1.0;
            audio.volume = (appState.settings && appState.settings.soundVolume) || 1.0;
            audio.play().catch(e => {
              console.warn("[AudioManager] Lokales Audio-Play abgefangen:", e);
            });
            return;
          }
        }
      } catch (err) {
        console.info("[AudioManager] Lokale TTS nicht erreichbar, nutze Browser-Stimme.");
      }
    }

    // 2. Priorität: Web Speech Synthesis (NUR wenn eine ECHTE passende Stimme vorhanden ist!)
    const genuineVoice = this.getBestVoiceForLang(targetLang);
    if (genuineVoice && this.synth) {
      const utterance = new SpeechSynthesisUtterance(pronounceText);
      utterance.rate = (appState.settings && appState.settings.ttsRate) || 1.0;
      utterance.lang = targetLang;
      utterance.voice = genuineVoice;
      this.synth.speak(utterance);
      return;
    }

    // 3. Priorität: Native Aussprache-Audio (z. B. bei englischen Einzelwörtern / Begriffen)
    if (targetLang.toLowerCase().startsWith("en")) {
      this.playNativeAudioFallback(pronounceText, targetLang);
    }
  }

  playNativeAudioFallback(text, lang = "en-US") {
    try {
      const audio = new Audio();
      this.currentAudioPlayer = audio;
      const type = lang.toLowerCase().includes("gb") || lang.toLowerCase().includes("uk") ? "1" : "2";
      audio.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=${type}`;
      audio.play().catch(err => {
        console.warn("[AudioManager] Native Audio-Fallback fehlgeschlagen:", err);
      });
    } catch (e) {
      console.warn("[AudioManager] Native Audio-Fallback Exception:", e);
    }
  }
}

// ==========================================
// 4. MASCOT (OLI DIE EULE)
// ==========================================

class MascotManager {
  static getMotivationLines() {
    const lang = I18n.getActiveLanguage();
    const motivators = {
      de: [
        "Jeder Tag zählt! Bleib dran und halte deinen Streak am Brennen!",
        "Klasse Leistung! Du hast schon viele Wörter heute gemeistert!",
        "Fehler sind der beste Beweis, dass du lernst. Weiter so!",
        "Tipp: Nutze Tastenkombinationen wie Alt+1 bis Alt+5 zum schnellen Wechseln!",
        "Übe heute noch eine Einheit, um deine Tages-Quests zu erfüllen!"
      ],
      en: [
        "Every day counts! Keep your streak burning!",
        "Fantastic progress! You're expanding your vocabulary!",
        "Mistakes are proof that you're learning. Keep going!",
        "Tip: Use shortcuts like 1-4 and Spacebar for ultra-fast navigation!",
        "Complete another lesson today to finish your daily quests!"
      ],
      es: [
        "¡Cada día cuenta! ¡Mantén viva tu racha!",
        "¡Excelente progreso! ¡Estás aprendiendo muchas palabras!",
        "¡Los errores son parte del aprendizaje! ¡Sigue adelante!",
        "Consejo: Usa las teclas 1-4 y la barra espaciadora."
      ],
      fr: [
        "Chaque jour compte ! Entretenez votre série !",
        "Superbe travail ! Votre vocabulaire s'agrandit !",
        "On apprend toujours de ses erreurs. Continuez !",
        "Astuce : Utilisez les touches 1 à 4 pour répondre rapidement !"
      ]
    };
    return motivators[lang] || motivators["en"] || motivators["de"];
  }

  static cheer() {
    const lines = this.getMotivationLines();
    const pick = lines[Math.floor(Math.random() * lines.length)];
    const bubble = document.getElementById("mascot-message-text");
    if (bubble) bubble.textContent = pick;
    audioManager.playSelect();
    announceToScreenReader(`Oli sagt: ${pick}`, "assertive");
  }
}

// ==========================================
// 5. APPLICATION STATE & ARIA ANNOUNCER
// ==========================================

const appState = {
  decks: [],
  activeDeck: null,
  settings: StorageManager.getSettings(),
  currentGame: null,
  parsedImportData: null,
  gamification: null
};

const audioManager = new AudioManager();

function announceToScreenReader(message, priority = "polite") {
  const targetId = priority === "assertive" ? "sr-announcements" : "sr-status";
  const el = document.getElementById(targetId);
  if (el) {
    el.textContent = "";
    setTimeout(() => {
      el.textContent = message;
    }, 50);
  }
}

// ==========================================
// 6. DOCUMENT & FILE IMPORTER (WORD, EXCEL, CSV, TXT)
// ==========================================

class DocumentImporter {
  static readFileAsArrayBuffer(file) {
    if (file.arrayBuffer) {
      return file.arrayBuffer();
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Fehler beim Lesen der Binärdatei."));
      reader.readAsArrayBuffer(file);
    });
  }

  static readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Fehler beim Lesen der Textdatei."));
      reader.readAsText(file, "UTF-8");
    });
  }

  static async parseFile(file) {
    const fileName = file.name || "";
    const extension = fileName.split('.').pop().toLowerCase();

    if (extension === "xlsx" || extension === "xls") {
      return this.parseExcel(file);
    } else if (extension === "docx") {
      return this.parseWord(file);
    } else if (extension === "json") {
      return this.parseJson(file);
    } else if (["csv", "tsv", "txt"].includes(extension) || (file.type && file.type.startsWith("text/"))) {
      return this.parseTextFile(file);
    } else {
      // Fallback attempt: read as text
      try {
        return await this.parseTextFile(file);
      } catch (e) {
        throw new Error(`Dateityp ".${extension}" wird nicht unterstützt. Bitte Word (.docx), Excel (.xlsx/.xls), JSON (.json), CSV oder Text (.txt) wählen.`);
      }
    }
  }

  static async parseJson(file) {
    const text = await this.readFileAsText(file);
    const data = JSON.parse(text);
    const vocabList = [];
    const items = Array.isArray(data) ? data : (data.words || data.items || []);
    items.forEach(it => {
      const source = it.source || it.back || it.german || it.de || "";
      const target = it.target || it.front || it.english || it.en || "";
      const note = it.note || it.kategorie || it.topic || "";
      if (source && target) {
        vocabList.push({ source: source.trim(), target: target.trim(), note: note.trim() });
      }
    });
    if (vocabList.length === 0) throw new Error("Die JSON-Datei enthält keine erkannten Vokabeln.");
    return vocabList;
  }

  static async parseExcel(file) {
    if (typeof XLSX === "undefined") {
      throw new Error("Excel-Bibliothek nicht geladen. Bitte Seite neu laden.");
    }
    const data = await this.readFileAsArrayBuffer(file);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) throw new Error("Die Excel-Datei enthält keine lesbaren Tabellenblätter.");

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const vocabList = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;

      let colA = String(row[0] != null ? row[0] : "").trim();
      let colB = String(row[1] != null ? row[1] : "").trim();
      let colC = String(row[2] != null ? row[2] : "").trim();

      const lowerA = colA.toLowerCase();
      const lowerB = colB.toLowerCase();

      // Ignore header rows
      if (i === 0 && (
        lowerA.includes("wort") || lowerA.includes("deutsch") || lowerA.includes("begriff") || 
        lowerA.includes("term") || lowerA.includes("nr") || lowerA.includes("spalte") ||
        lowerB.includes("übersetz") || lowerB.includes("translat") || lowerB.includes("englisch")
      )) {
        continue;
      }

      // Check if colA is merely row index number (e.g. 1, 2, 3...)
      if (/^\d+$/.test(colA) && colB && colC) {
        vocabList.push({ source: colB, target: colC, note: String(row[3] || "").trim() });
        continue;
      }

      if (colA && colB) {
        vocabList.push({ source: colA, target: colB, note: colC });
      }
    }
    return vocabList;
  }

  static async parseWord(file) {
    if (typeof mammoth === "undefined") {
      throw new Error("Word-Bibliothek nicht geladen. Bitte Seite neu laden.");
    }
    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value || "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const vocabList = [];

    // Check HTML tables in document
    const tableRows = doc.querySelectorAll("table tr");
    if (tableRows.length > 0) {
      tableRows.forEach((tr, idx) => {
        const cells = tr.querySelectorAll("td, th");
        if (cells.length >= 2) {
          const colA = cells[0].textContent.trim();
          const colB = cells[1].textContent.trim();
          const colC = cells.length >= 3 ? cells[2].textContent.trim() : "";
          const lowerA = colA.toLowerCase();
          if (idx === 0 && (lowerA.includes("wort") || lowerA.includes("deutsch") || lowerA.includes("begriff") || lowerA.includes("nr"))) {
            return;
          }
          if (colA && colB) {
            vocabList.push({ source: colA, target: colB, note: colC });
          }
        }
      });
    }

    // Check paragraphs / bullet points
    if (vocabList.length === 0) {
      const paragraphs = doc.querySelectorAll("p, li");
      paragraphs.forEach(p => {
        const line = p.textContent.trim();
        if (line) {
          const parsed = DocumentImporter.parseLine(line);
          if (parsed) vocabList.push(parsed);
        }
      });
    }

    return vocabList;
  }

  static async parseTextFile(file) {
    const text = await this.readFileAsText(file);
    return this.parseRawText(text);
  }

  static parseRawText(rawText) {
    const lines = rawText.split(/\r?\n/);
    const vocabList = [];

    for (const line of lines) {
      const clean = line.trim();
      if (!clean || clean.startsWith("#") || clean.startsWith("//")) continue;
      const parsed = this.parseLine(clean);
      if (parsed) vocabList.push(parsed);
    }
    return vocabList;
  }

  static parseLine(line) {
    let parts = null;
    const delimiters = ["\t", ";", " = ", " - ", " – ", " — ", " : ", " | ", ","];
    for (const d of delimiters) {
      if (line.includes(d)) {
        parts = line.split(d);
        if (parts.length >= 2) break;
      }
    }

    if (!parts && (line.includes("=") || line.includes("-"))) {
      if (line.includes("=")) parts = line.split("=");
      else if (line.includes("-")) parts = line.split("-");
    }

    if (parts && parts.length >= 2) {
      const source = parts[0].trim().replace(/^["']|["']$/g, "");
      const target = parts[1].trim().replace(/^["']|["']$/g, "");
      const note = parts.length > 2 ? parts[2].trim().replace(/^["']|["']$/g, "") : "";
      if (source && target) {
        const sLow = source.toLowerCase();
        if (sLow === "deutsch" || sLow === "wort" || sLow === "begriff" || sLow === "spalte 1") {
          return null;
        }
        return { source, target, note };
      }
    }
    return null;
  }
}


// ==========================================
// 6.5 LANGUAGE DETECTION & ORIENTATION HELPERS
// ==========================================

function scoreGerman(text) {
  if (!text) return 0;
  let score = 0;
  const str = " " + String(text).toLowerCase() + " ";
  // German umlauts and ß (conclusive proof of German)
  if (/[äöüß]/.test(str)) score += 5;
  // German grammatical words, articles, prepositions & vocab abbreviations
  const deWords = /\b(der|die|das|den|dem|des|ein|eine|einer|einem|einen|eines|und|oder|nicht|für|fuer|mit|bei|nach|aus|zu|von|vom|im|in|am|an|auf|ab|etw|etwas|jdm|jdn|jds|jd|jemand|jemandem|jemanden|sich|sein|ihr|ihre|ihrem|ihren|halten|finden|machen|lassen|bringen|nehmen|gehen|kommen|sehen|wissen|sagen|geben|fragen|zeigen|hören|fühlen|haben|sein|werden)\b/g;
  const matches = str.match(deWords);
  if (matches) score += matches.length * 3;
  // German noun suffixes
  if (/\b\w+(ung|heit|keit|schaft|lein|chen)\b/.test(str)) score += 3;
  return score;
}

function scoreEnglish(text) {
  if (!text) return 0;
  let score = 0;
  const str = " " + String(text).toLowerCase() + " ";
  // Infinitive verb 'to ' prefix at start (e.g. 'to keep sth at hand')
  if (/^\s*to\s+[a-z]/i.test(String(text))) score += 5;
  // English vocabulary abbreviations & markers
  if (/\b(sth|sb|sb's|approx|exw|etc|eg|ie)\b/i.test(str)) score += 4;
  // English words, prepositions, articles, common vocabulary
  const enWords = /\b(the|a|an|to|of|and|in|on|at|for|with|from|by|about|into|through|keep|meet|approval|assistance|works|approximately|cat|dog|house|tree|water|bread|book|car|happy|fast|learn|school|friend|sun|moon|hello|thank|please|yes|no|good|night|street|apple|coffee|hand)\b/g;
  const matches = str.match(enWords);
  if (matches) score += matches.length * 3;
  // English suffixes
  if (/\b\w+(tion|sion|ment|ness|able|ible|ing)\b/.test(str)) score += 2;
  return score;
}

function detectDeckIsInverted(words) {
  if (!words || words.length === 0) return false;
  let invertedScore = 0;
  let standardScore = 0;

  for (const w of words) {
    const s = String(w.source || "");
    const t = String(w.target || "");
    const sDe = scoreGerman(s);
    const sEn = scoreEnglish(s);
    const tDe = scoreGerman(t);
    const tEn = scoreEnglish(t);

    if (tDe > sDe || sEn > tEn) {
      invertedScore++;
    } else if (sDe > tDe || tEn > sEn) {
      standardScore++;
    }
  }

  return (invertedScore > standardScore && invertedScore >= Math.min(2, words.length));
}

function normalizeDeckIfInverted(deck) {
  if (!deck || !deck.words || deck.words.length === 0) return false;
  if (detectDeckIsInverted(deck.words)) {
    console.log(`[VokabelStar] Auto-korrigiere Spalten für Deck "${deck.title}": Spalten wurden automatisch auf Deutsch ➔ Englisch ausgerichtet.`);
    deck.words.forEach(w => {
      const temp = w.source;
      w.source = w.target;
      w.target = temp;
    });
    return true;
  }
  return false;
}

function autoOrientPairs(pairs) {
  if (!pairs || pairs.length === 0) return false;
  if (detectDeckIsInverted(pairs)) {
    pairs.forEach(p => {
      const temp = p.source;
      p.source = p.target;
      p.target = temp;
    });
    return true;
  }
  return false;
}

function expandVocabAbbreviations(text) {
  if (!text) return "";
  let res = String(text);
  // Expand learner vocabulary abbreviations into full natural words for authentic pronunciation
  res = res.replace(/\b(sth\.|sth)\b/gi, "something");
  res = res.replace(/\b(sb’s|sb's)\b/gi, "somebody's");
  res = res.replace(/\b(sb\.|sb)\b/gi, "somebody");
  res = res.replace(/\b(approx\.|approx)\b/gi, "approximately");
  res = res.replace(/\b(exw|EXW)\b/g, "ex works");
  res = res.replace(/\b(etc\.|etc)\b/gi, "etcetera");
  res = res.replace(/\b(e\.g\.|eg)\b/gi, "for example");
  res = res.replace(/\b(i\.e\.|ie)\b/gi, "that is");
  // German abbreviations
  res = res.replace(/\b(etw\.|etw)\b/gi, "etwas");
  res = res.replace(/\b(jds\.|jds)\b/gi, "jemandes");
  res = res.replace(/\b(jdm\.|jdm)\b/gi, "jemandem");
  res = res.replace(/\b(jdn\.|jdn)\b/gi, "jemanden");
  res = res.replace(/\b(jd\.|jd)\b/gi, "jemand");
  return res.trim();
}

function populateVoiceList() {
  const select = document.getElementById("select-tts-voice");
  const statusBadge = document.getElementById("tts-voice-status-badge");
  if (!select) return;

  let voices = [];
  try {
    if (typeof audioManager !== "undefined" && audioManager && audioManager.voices && audioManager.voices.length > 0) {
      voices = audioManager.voices;
    } else if (window.speechSynthesis) {
      voices = window.speechSynthesis.getVoices();
    }
  } catch (e) {
    if (window.speechSynthesis) {
      voices = window.speechSynthesis.getVoices();
    }
  }

  select.innerHTML = "";

  // 1. Native High-Quality Local SAPI Voice Option (Empfohlen)
  const nativeOpt = document.createElement("option");
  nativeOpt.value = "sapi_local";
  nativeOpt.textContent = "🇺🇸 Microsoft Zira (Echte US-Englische Systemstimme - 100% Lokal & Empfohlen)";
  select.appendChild(nativeOpt);

  const englishVoices = voices.filter(v => v.lang.toLowerCase().replace("_", "-").startsWith("en"));
  const germanVoices = voices.filter(v => v.lang.toLowerCase().replace("_", "-").startsWith("de"));
  const otherVoices = voices.filter(v => !v.lang.toLowerCase().startsWith("en") && !v.lang.toLowerCase().startsWith("de"));

  if (englishVoices.length > 0) {
    const optGroupEn = document.createElement("optgroup");
    optGroupEn.label = "Englische Browser- / Windows-Stimmen";
    englishVoices.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `🇺🇸 ${v.name} (${v.lang})`;
      optGroupEn.appendChild(opt);
    });
    select.appendChild(optGroupEn);
  }

  if (germanVoices.length > 0) {
    const optGroupDe = document.createElement("optgroup");
    optGroupDe.label = "Deutsche Stimmen";
    germanVoices.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = `🇩🇪 ${v.name} (${v.lang})`;
      optGroupDe.appendChild(opt);
    });
    select.appendChild(optGroupDe);
  }

  // Selected value
  const savedChoice = appState.settings ? appState.settings.selectedVoiceURI : "";
  if (savedChoice && Array.from(select.options).some(o => o.value === savedChoice)) {
    select.value = savedChoice;
  } else {
    select.value = "sapi_local";
  }

  if (statusBadge) {
    statusBadge.innerHTML = `<strong>Aktiv:</strong> 🇺🇸 Microsoft Zira (Echte englische Muttersprachlerin, 100% lokal & nativ)`;
  }
}

function createSpeakButtonHtml(wordText, lang = "en-US") {
  if (!wordText) return "";
  const cleanWord = String(wordText).trim();
  if (!cleanWord) return "";

  // Safeguard: If target language is English and word is clearly German, NEVER render speak button!
  if (lang.toLowerCase().startsWith("en")) {
    const deScore = scoreGerman(cleanWord);
    const enScore = scoreEnglish(cleanWord);
    if (deScore > enScore && deScore >= 2) {
      return "";
    }
  }

  return `
    <button type="button" class="btn-word-speak" data-speak-word="${escapeHtml(cleanWord)}" data-speak-lang="${escapeHtml(lang)}" aria-label="Aussprache für ${escapeHtml(cleanWord)} vorlesen" title="Englisch vorlesen">
      <span aria-hidden="true">🗣️</span>
      <span class="btn-word-speak-text">Vorlesen</span>
    </button>
  `;
}

function getAvailableExerciseModes() {
  const modes = ["match", "audio_quiz", "quiz", "truefalse", "flashcards", "scramble"];
  if (appState.settings && appState.settings.enableTypingExercises) {
    modes.push("typing");
  }
  return modes;
}

function getModeTitle(mode) {
  const titles = {
    match: "1. Paare Zuordnen (Match)",
    audio_quiz: "2. Hör-Auswahl (Listen & Pick)",
    quiz: "3. Multiple Choice (Schnellauswahl)",
    truefalse: "4. Wahr oder Falsch",
    flashcards: "5. Barrierefreie Karteikarten",
    scramble: "6. Wort-Baukasten (Puzzle)",
    typing: "7. Schreib-Training & Diktat"
  };
  return titles[mode] || mode;
}

function getNextDifferentMode(currentMode) {
  const modes = getAvailableExerciseModes();
  const currentIndex = modes.indexOf(currentMode);
  if (currentIndex === -1) return modes[0];
  const nextIndex = (currentIndex + 1) % modes.length;
  return modes[nextIndex];
}

// ==========================================
// 7. GAME ENGINES (DUOLINGO COMPATIBLE)
// ==========================================

class BaseGame {
  constructor(words, lang) {
    this.words = [...words].sort(() => Math.random() - 0.5);
    this.lang = lang;
    this.totalQuestions = Math.min(this.words.length, 10);
    this.currentIndex = 0;
    this.score = 0;
  }

  renderProgress() {
    const text = document.getElementById("game-progress-text");
    const fill = document.getElementById("progress-fill");
    const bar = document.getElementById("game-progress-bar");
    const current = this.currentIndex + 1;
    const pct = Math.round((this.currentIndex / this.totalQuestions) * 100);

    if (text) text.textContent = I18n.t("task_progress", { current, total: this.totalQuestions });
    if (fill) fill.style.width = `${pct}%`;
    if (bar) {
      bar.setAttribute("aria-valuenow", pct);
      bar.setAttribute("aria-valuetext", `Aufgabe ${current} von ${this.totalQuestions}`);
    }
  }

  showFeedback(isSuccess, text, callback) {
    const banner = document.getElementById("game-feedback-banner");
    banner.className = `feedback-banner ${isSuccess ? "success" : "error"}`;
    banner.textContent = text;
    banner.classList.remove("hidden");

    announceToScreenReader(text, "assertive");
    if (isSuccess) {
      audioManager.playSuccess();
      appState.gamification.addXP(10);
    } else {
      const stillHasHearts = appState.gamification.loseHeart();
      if (!stillHasHearts) {
        // Out of hearts modal/redirect
        setTimeout(() => {
          banner.classList.add("hidden");
          exitCurrentGame();
          alert(I18n.t("no_hearts_left"));
        }, 1200);
        return;
      }
    }

    setTimeout(() => {
      banner.classList.add("hidden");
      if (callback) callback();
    }, 1400);
  }

  showFinalResults() {
    audioManager.playFanfare();
    appState.gamification.recordLessonComplete();

    const container = document.getElementById("game-dynamic-content");
    const pct = Math.round((this.score / this.totalQuestions) * 100);
    const msg = `${I18n.t("results_title")} ${this.score} von ${this.totalQuestions} richtig (${pct}%). +25 Bonus XP verdient!`;
    announceToScreenReader(msg, "assertive");

    const nextMode = getNextDifferentMode(this.modeKey);
    const nextTitle = getModeTitle(nextMode);

    container.innerHTML = `
      <div class="results-card">
        <div class="results-trophy" aria-hidden="true">🏆</div>
        <h2 class="results-title">${I18n.t("results_title")}</h2>
        <div class="results-score-badge">${this.score} von ${this.totalQuestions} gelöst (${pct}%)</div>
        <div class="results-xp-gain">⚡ +25 Bonus XP verdient!</div>

        <div class="results-next-banner" role="region" aria-label="Nächste Übung">
          <p style="margin-bottom: 6px;">Als Nächstes kommt eine andere abwechslungsreiche Übung:</p>
          <strong>${nextTitle}</strong>
        </div>

        <div class="results-buttons">
          <button id="btn-next-lesson" class="btn btn-primary btn-large">🌟 Nächste Lektion starten</button>
          <button id="btn-replay-game" class="btn btn-secondary btn-large">${I18n.t("btn_replay")}</button>
          <button id="btn-results-menu" class="btn btn-secondary btn-large">${I18n.t("back_to_menu")}</button>
        </div>
      </div>
    `;

    document.getElementById("btn-next-lesson").addEventListener("click", () => startGame(nextMode));
    document.getElementById("btn-replay-game").addEventListener("click", () => startGame(this.modeKey));
    document.getElementById("btn-results-menu").addEventListener("click", () => exitCurrentGame());
    document.getElementById("btn-next-lesson").focus();
  }
}

// ------------------------------------------
// MODUS 1: ZUORDNEN / MATCHING PAARE
// ------------------------------------------
class MatchGame {
  constructor(words, lang) {
    this.modeKey = "match";
    this.lang = lang;
    const shuffledAll = [...words].sort(() => Math.random() - 0.5);
    this.currentPairs = shuffledAll.slice(0, Math.min(5, shuffledAll.length));
    this.totalPairs = this.currentPairs.length;
    this.solvedPairsCount = 0;
    this.selectedLeft = null;
    this.selectedRight = null;
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "none";
    this.render();
    this.updateProgress();
    announceToScreenReader(I18n.t("match_start_sr", { total: this.totalPairs }), "polite");
  }

  updateProgress() {
    const text = document.getElementById("game-progress-text");
    const fill = document.getElementById("progress-fill");
    const bar = document.getElementById("game-progress-bar");
    const pct = Math.round((this.solvedPairsCount / this.totalPairs) * 100);

    if (text) text.textContent = I18n.t("match_task_progress", { solved: this.solvedPairsCount, total: this.totalPairs });
    if (fill) fill.style.width = `${pct}%`;
    if (bar) {
      bar.setAttribute("aria-valuenow", pct);
      bar.setAttribute("aria-valuetext", `Paare gelöst: ${this.solvedPairsCount} von ${this.totalPairs}`);
    }
  }

  render() {
    const container = document.getElementById("game-dynamic-content");
    const leftWords = [...this.currentPairs].sort(() => Math.random() - 0.5);
    const rightWords = [...this.currentPairs].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="match-grid-container match-columns-container">
        <!-- Spalte Links (Deutsch / Begriff) -->
        <div class="match-column" role="region" aria-label="Spalte 1">
          <div class="match-col-title">${I18n.t("col_source")}</div>
          ${leftWords.map((item, idx) => `
            <button class="match-tile match-tile-left"
                    data-id="${item.id}"
                    data-side="left"
                    data-text="${item.source}"
                    aria-label="${item.source}, Begriff ${idx + 1} von ${leftWords.length}">
              ${item.source}
            </button>
          `).join("")}
        </div>

        <!-- Spalte Rechts (Englisch / Übersetzung) -->
        <div class="match-column" role="region" aria-label="Spalte 2: Englische Übersetzung">
          <div class="match-col-title">${I18n.t("col_target")}</div>
          ${rightWords.map((item, idx) => `
            <div class="match-tile-row" style="display: flex; gap: 6px; align-items: stretch;">
              <button class="match-tile match-tile-right"
                      style="flex: 1;"
                      data-id="${item.id}"
                      data-side="right"
                      data-text="${escapeHtml(item.target)}"
                      aria-label="${escapeHtml(item.target)}, Übersetzung ${idx + 1} von ${rightWords.length}">
                ${escapeHtml(item.target)}
              </button>
              ${createSpeakButtonHtml(item.target, this.lang)}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    container.querySelectorAll(".match-tile").forEach(tile => {
      tile.addEventListener("click", () => this.handleTileSelect(tile));
    });

    const firstTile = container.querySelector(".match-tile-left");
    if (firstTile) firstTile.focus();
  }

  handleTileSelect(tile) {
    if (tile.classList.contains("solved")) return;
    audioManager.playSelect();

    const side = tile.dataset.side;
    const wordId = tile.dataset.id;
    const text = tile.dataset.text;

    if (side === "left") {
      document.querySelectorAll(".match-tile-left").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      this.selectedLeft = { id: wordId, text, element: tile };
      announceToScreenReader(I18n.t("match_selected_left", { text }), "assertive");
    } else {
      document.querySelectorAll(".match-tile-right").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      this.selectedRight = { id: wordId, text, element: tile };
      announceToScreenReader(`Ausgewählt: ${text}.`, "polite");
      if (appState.settings.speechEnabled) {
        audioManager.speak(text, this.lang);
      }
    }

    if (this.selectedLeft && this.selectedRight) {
      this.checkPairMatch();
    }
  }

  checkPairMatch() {
    const isMatch = this.selectedLeft.id === this.selectedRight.id;
    const leftEl = this.selectedLeft.element;
    const rightEl = this.selectedRight.element;
    const leftText = this.selectedLeft.text;
    const rightText = this.selectedRight.text;

    if (isMatch) {
      audioManager.playSuccess();
      appState.gamification.addXP(10);
      appState.gamification.recordMatchPairSolved();

      leftEl.classList.remove("selected");
      rightEl.classList.remove("selected");
      leftEl.classList.add("solved");
      rightEl.classList.add("solved");
      leftEl.disabled = true;
      rightEl.disabled = true;

      this.solvedPairsCount++;
      this.updateProgress();
      const remaining = this.totalPairs - this.solvedPairsCount;

      this.selectedLeft = null;
      this.selectedRight = null;

      if (remaining === 0) {
        announceToScreenReader(I18n.t("match_all_done"), "assertive");
        setTimeout(() => this.showCompletion(), 800);
      } else {
        announceToScreenReader(I18n.t("match_hit", { source: leftText, target: rightText, remaining }), "assertive");
        const nextLeft = document.querySelector(".match-tile-left:not(.solved)");
        if (nextLeft) nextLeft.focus();
      }
    } else {
      appState.gamification.loseHeart();
      announceToScreenReader(I18n.t("match_fail", { source: leftText, target: rightText }), "assertive");

      setTimeout(() => {
        leftEl.classList.remove("selected");
        rightEl.classList.remove("selected");
        this.selectedLeft = null;
        this.selectedRight = null;
        leftEl.focus();
      }, 700);
    }
  }

  showCompletion() {
    audioManager.playFanfare();
    appState.gamification.recordLessonComplete();

    const nextMode = getNextDifferentMode("match");
    const nextTitle = getModeTitle(nextMode);

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="results-card">
        <div class="results-trophy" aria-hidden="true">🎉</div>
        <h2 class="results-title">${I18n.t("results_title")}</h2>
        <div class="results-score-badge">Alle ${this.totalPairs} Paare gelöst!</div>
        <div class="results-xp-gain">⚡ +25 Bonus XP verdient!</div>

        <div class="results-next-banner" role="region" aria-label="Nächste Übung">
          <p style="margin-bottom: 6px;">Als Nächstes kommt eine andere abwechslungsreiche Übung:</p>
          <strong>${nextTitle}</strong>
        </div>

        <div class="results-buttons">
          <button id="btn-next-match-lesson" class="btn btn-primary btn-large">🌟 Nächste Lektion starten</button>
          <button id="btn-replay-match" class="btn btn-secondary btn-large">🔄 Paare nochmal spielen</button>
          <button id="btn-exit-match" class="btn btn-secondary btn-large">${I18n.t("back_to_menu")}</button>
        </div>
      </div>
    `;

    document.getElementById("btn-next-match-lesson").addEventListener("click", () => startGame(nextMode));
    document.getElementById("btn-replay-match").addEventListener("click", () => startGame("match"));
    document.getElementById("btn-exit-match").addEventListener("click", () => exitCurrentGame());
    document.getElementById("btn-next-match-lesson").focus();
  }

  handleKey(e) {}
}

// ------------------------------------------
// MODUS 2: MULTIPLE CHOICE
// ------------------------------------------
class QuizGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "quiz";
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.renderProgress();
    const currentWord = this.words[this.currentIndex];

    const otherWords = this.words.filter(w => w.id !== currentWord.id);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [currentWord, ...shuffledOthers].sort(() => Math.random() - 0.5);

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="quiz-container">
        <p class="quiz-hint" id="quiz-question-desc">${I18n.t("quiz_question_prompt")}</p>
        <div style="text-align: center; margin-bottom: 12px;">
          <h2 class="quiz-word-prompt" id="quiz-target-word" style="margin-bottom: 8px;">${escapeHtml(currentWord.target)}</h2>
          ${createSpeakButtonHtml(currentWord.target, this.lang)}
        </div>
        ${currentWord.note ? `<p class="quiz-hint">Hinweis: ${escapeHtml(currentWord.note)}</p>` : ""}

        <div class="quiz-options-grid" role="group" aria-labelledby="quiz-target-word">
          ${options.map((opt, i) => `
            <button class="quiz-option-btn"
                    data-correct="${opt.id === currentWord.id}"
                    data-answer="${escapeHtml(opt.source)}"
                    data-key="${i + 1}"
                    aria-label="Option ${i + 1}: ${escapeHtml(opt.source)}">
              <span class="opt-badge" aria-hidden="true">${i + 1}</span>
              <span>${escapeHtml(opt.source)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    if (appState.settings.autoPronounce && appState.settings.speechEnabled) {
      audioManager.speak(currentWord.target, this.lang);
    }

    const optionsText = options.map((opt, i) => `Taste ${i + 1}: ${opt.source}`).join(". ");
    announceToScreenReader(`Aufgabe ${this.currentIndex + 1} von ${this.totalQuestions}: "${currentWord.target}". Optionen: ${optionsText}`, "polite");

    container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => this.handleAnswer(btn));
    });

    const firstBtn = container.querySelector(".quiz-option-btn");
    if (firstBtn) firstBtn.focus();
  }

  handleAnswer(btn) {
    const isCorrect = btn.dataset.correct === "true";
    const answerText = btn.dataset.answer;
    const currentWord = this.words[this.currentIndex];

    if (isCorrect) {
      this.score++;
      this.showFeedback(true, `Richtig! "${currentWord.target}" = "${answerText}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    } else {
      this.showFeedback(false, `Leider falsch. "${currentWord.target}" = "${currentWord.source}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    }
  }

  handleKey(e) {
    if (["1", "2", "3", "4"].includes(e.key)) {
      const btn = document.querySelector(`.quiz-option-btn[data-key="${e.key}"]`);
      if (btn) btn.click();
    }
    if (e.key.toLowerCase() === "r") {
      const currentWord = this.words[this.currentIndex];
      if (currentWord) audioManager.speak(currentWord.target, this.lang);
    }
  }
}

// ------------------------------------------
// MODUS 3: WAHR ODER FALSCH
// ------------------------------------------
class TrueFalseGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "truefalse";
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.renderProgress();
    const currentWord = this.words[this.currentIndex];
    const isActuallyTrue = Math.random() >= 0.5;

    let shownTarget = currentWord.target;
    if (!isActuallyTrue) {
      const others = this.words.filter(w => w.id !== currentWord.id);
      if (others.length > 0) {
        shownTarget = others[Math.floor(Math.random() * others.length)].target;
      }
    }

    this.currentQuestionData = {
      source: currentWord.source,
      shownTarget: shownTarget,
      isActuallyTrue: isActuallyTrue,
      correctTarget: currentWord.target
    };

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="tf-container">
        <p class="quiz-hint">${I18n.t("truefalse_prompt")}</p>
        <div class="tf-card" role="region" aria-label="Aussage">
          <div class="tf-pair">
            <span>${escapeHtml(currentWord.source)}</span> = <strong>${escapeHtml(shownTarget)}</strong>
          </div>
          <div style="margin-top: 10px; display: flex; justify-content: center;">
            ${createSpeakButtonHtml(shownTarget, this.lang)}
          </div>
        </div>

        <div class="tf-actions">
          <button id="btn-tf-true" class="btn btn-success tf-btn" aria-label="Richtig (Taste J oder 1)">
            ${I18n.t("btn_true")}
          </button>
          <button id="btn-tf-false" class="btn btn-danger tf-btn" aria-label="Falsch (Taste N oder 2)">
            ${I18n.t("btn_false")}
          </button>
        </div>
      </div>
    `;

    announceToScreenReader(`${currentWord.source} = ${shownTarget}. Richtig oder falsch?`, "polite");

    if (appState.settings.autoPronounce && appState.settings.speechEnabled) {
      audioManager.speak(shownTarget, this.lang);
    }

    document.getElementById("btn-tf-true").addEventListener("click", () => this.handleDecision(true));
    document.getElementById("btn-tf-false").addEventListener("click", () => this.handleDecision(false));
    document.getElementById("btn-tf-true").focus();
  }

  handleDecision(userSaysTrue) {
    const q = this.currentQuestionData;
    const isCorrect = userSaysTrue === q.isActuallyTrue;

    if (isCorrect) {
      this.score++;
      const text = q.isActuallyTrue
        ? `Richtig! "${q.source}" = "${q.shownTarget}".`
        : `Richtig! "${q.source}" ist nicht "${q.shownTarget}", sondern "${q.correctTarget}".`;
      this.showFeedback(true, text, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    } else {
      const text = q.isActuallyTrue
        ? `Leider falsch. "${q.source}" = "${q.shownTarget}".`
        : `Leider falsch. "${q.source}" = "${q.correctTarget}".`;
      this.showFeedback(false, text, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    }
  }

  handleKey(e) {
    const key = e.key.toLowerCase();
    if (["j", "y", "s", "o", "t", "1"].includes(key)) {
      document.getElementById("btn-tf-true")?.click();
    } else if (["n", "2"].includes(key)) {
      document.getElementById("btn-tf-false")?.click();
    } else if (key === "r") {
      audioManager.speak(this.currentQuestionData.shownTarget, this.lang);
    }
  }
}

// ------------------------------------------
// MODUS 4: FLASHCARDS
// ------------------------------------------
class FlashcardsGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "flashcards";
    this.isFlipped = false;
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.isFlipped = false;
    this.renderProgress();
    const currentWord = this.words[this.currentIndex];

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="flashcard-wrapper">
        <div id="flashcard-element" class="flashcard-box" tabindex="0" role="button"
             aria-label="Karteikarte: ${currentWord.source}. Drücke Leertaste zum Umdrehen.">
          <div class="flashcard-side-tag">${I18n.t("flashcard_front_tag")}</div>
          <div class="flashcard-main-text">${currentWord.source}</div>
          <div class="flashcard-sub-text">${I18n.t("flashcard_hint_flip")}</div>
        </div>

        <div id="flashcard-rating-actions" class="flashcard-actions hidden">
          <button id="btn-fc-repeat" class="btn btn-secondary" aria-label="Noch üben (Taste 1)">
            ${I18n.t("flashcard_btn_repeat")}
          </button>
          <button id="btn-fc-success" class="btn btn-success" aria-label="Gewusst (Taste 2)">
            ${I18n.t("flashcard_btn_known")}
          </button>
        </div>
      </div>
    `;

    announceToScreenReader(`Karteikarte ${this.currentIndex + 1} von ${this.totalQuestions}: ${currentWord.source}. Drücke Leertaste zum Aufdecken.`, "polite");

    const cardEl = document.getElementById("flashcard-element");
    cardEl.addEventListener("click", () => this.flipCard());
    cardEl.focus();
  }

  flipCard() {
    if (this.isFlipped) return;
    this.isFlipped = true;
    audioManager.playSelect();

    const currentWord = this.words[this.currentIndex];
    const cardEl = document.getElementById("flashcard-element");
    const actions = document.getElementById("flashcard-rating-actions");

    cardEl.innerHTML = `
      <div class="flashcard-side-tag">${I18n.t("flashcard_back_tag")}</div>
      <div class="flashcard-main-text">${escapeHtml(currentWord.target)}</div>
      <div style="margin-top: 10px; display: flex; justify-content: center;">
        ${createSpeakButtonHtml(currentWord.target, this.lang)}
      </div>
      ${currentWord.note ? `<div class="flashcard-sub-text">Hinweis: ${escapeHtml(currentWord.note)}</div>` : ""}
    `;
    actions.classList.remove("hidden");

    if (appState.settings.speechEnabled) {
      audioManager.speak(currentWord.target, this.lang);
    }
    announceToScreenReader(`Aufgedeckt: ${currentWord.target}. Taste 1 für Noch üben, Taste 2 für Gewusst.`, "assertive");

    document.getElementById("btn-fc-repeat").addEventListener("click", () => this.rateCard(false));
    document.getElementById("btn-fc-success").addEventListener("click", () => this.rateCard(true));
    document.getElementById("btn-fc-success").focus();
  }

  rateCard(known) {
    if (known) {
      this.score++;
      audioManager.playSuccess();
      appState.gamification.addXP(10);
    } else {
      audioManager.playError();
      appState.gamification.loseHeart();
    }
    this.currentIndex++;
    this.nextQuestion();
  }

  handleKey(e) {
    if (e.code === "Space" || e.key === "Enter") {
      if (!this.isFlipped) {
        e.preventDefault();
        this.flipCard();
      }
    } else if (this.isFlipped && (e.key === "1" || e.key.toLowerCase() === "n")) {
      document.getElementById("btn-fc-repeat")?.click();
    } else if (this.isFlipped && (e.key === "2" || e.key.toLowerCase() === "j")) {
      document.getElementById("btn-fc-success")?.click();
    } else if (e.key.toLowerCase() === "r") {
      const currentWord = this.words[this.currentIndex];
      if (currentWord) audioManager.speak(currentWord.target, this.lang);
    }
  }
}

// ------------------------------------------
// MODUS 5: WORT-BAUKASTEN (SCRAMBLE)
// ------------------------------------------
class ScrambleGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "scramble";
    this.assembledTokens = [];
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.renderProgress();
    const currentWord = this.words[this.currentIndex];
    this.assembledTokens = [];

    const targetString = currentWord.target.trim();
    const rawTokens = targetString.includes(" ") ? targetString.split(" ") : targetString.split("");
    this.targetTokens = rawTokens;

    this.availableChips = rawTokens.map((char, idx) => ({ id: idx, char: char }))
                                   .sort(() => Math.random() - 0.5);

    this.renderArena();
    announceToScreenReader(`${I18n.t("scramble_prompt")} "${currentWord.source}"`, "polite");
  }

  renderArena() {
    const currentWord = this.words[this.currentIndex];
    const container = document.getElementById("game-dynamic-content");

    container.innerHTML = `
      <div class="scramble-container">
        <div class="scramble-prompt-box">
          <p class="quiz-hint">${I18n.t("scramble_prompt")}</p>
          <h2 class="scramble-source-word">${escapeHtml(currentWord.source)}</h2>
          <div style="margin-top: 8px; display: flex; justify-content: center;">
            ${createSpeakButtonHtml(currentWord.target, this.lang)}
          </div>
        </div>

        <div class="scramble-answer-display" role="status" aria-label="Bisher gebautes Wort">
          ${this.assembledTokens.length === 0
            ? '<span class="quiz-hint">Wähle Bausteine von unten aus...</span>'
            : this.assembledTokens.map(t => `<span class="scramble-letter-token">${t.char}</span>`).join("")
          }
        </div>

        <div class="scramble-pool" role="group" aria-label="Verfügbare Buchstabenbausteine">
          ${this.availableChips.map((chip, i) => `
            <button class="scramble-chip-btn" data-chip-id="${chip.id}" data-key="${i + 1}"
                    aria-label="Baustein ${i + 1}: ${chip.char}">
              ${chip.char}
            </button>
          `).join("")}
        </div>

        <div class="scramble-controls">
          <button id="btn-scramble-undo" class="btn btn-secondary" aria-label="Rückgängig (Backspace)">
            ${I18n.t("btn_undo")}
          </button>
          <button id="btn-scramble-check" class="btn btn-primary" aria-label="Prüfen (Enter)">
            ${I18n.t("btn_check")}
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".scramble-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.chipId, 10);
        this.addToken(id);
      });
    });

    document.getElementById("btn-scramble-undo").addEventListener("click", () => this.undoToken());
    document.getElementById("btn-scramble-check").addEventListener("click", () => this.checkAnswer());

    const firstChip = container.querySelector(".scramble-chip-btn");
    if (firstChip) firstChip.focus();
  }

  addToken(chipId) {
    const chipIdx = this.availableChips.findIndex(c => c.id === chipId);
    if (chipIdx === -1) return;
    audioManager.playSelect();

    const [chip] = this.availableChips.splice(chipIdx, 1);
    this.assembledTokens.push(chip);
    this.renderArena();

    const currentWord = this.assembledTokens.map(t => t.char).join("");
    announceToScreenReader(`Hinzugefügt: ${chip.char}. Wort: ${currentWord}`, "assertive");

    if (this.availableChips.length === 0) {
      setTimeout(() => this.checkAnswer(), 300);
    }
  }

  undoToken() {
    if (this.assembledTokens.length === 0) return;
    audioManager.playSelect();

    const removed = this.assembledTokens.pop();
    this.availableChips.push(removed);
    this.renderArena();
    announceToScreenReader(`Baustein ${removed.char} zurückgenommen.`, "polite");
  }

  checkAnswer() {
    const currentWord = this.words[this.currentIndex];
    const userBuilt = this.assembledTokens.map(t => t.char).join("").toLowerCase();
    const correctTarget = currentWord.target.toLowerCase().replace(/\s+/g, "");

    const isMatch = userBuilt.replace(/\s+/g, "") === correctTarget;

    if (isMatch) {
      this.score++;
      this.showFeedback(true, `Richtig gelöst! "${currentWord.source}" = "${currentWord.target}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    } else {
      this.showFeedback(false, `Leider nicht richtig. "${currentWord.source}" = "${currentWord.target}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    }
  }

  handleKey(e) {
    if (e.key === "Backspace") {
      this.undoToken();
    } else if (e.key === "Enter") {
      this.checkAnswer();
    } else if (e.key.toLowerCase() === "r") {
      const currentWord = this.words[this.currentIndex];
      if (currentWord) audioManager.speak(currentWord.target, this.lang);
    } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
      const btn = document.querySelector(`.scramble-chip-btn[data-key="${e.key}"]`);
      if (btn) btn.click();
    }
  }
}

// ------------------------------------------
// MODUS 6: HÖR-AUSWAHL (AUDIO QUIZ / LISTEN & PICK)
// ------------------------------------------
class AudioQuizGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "audio_quiz";
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.renderProgress();
    const currentWord = this.words[this.currentIndex];

    const otherWords = this.words.filter(w => w.id !== currentWord.id);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [currentWord, ...shuffledOthers].sort(() => Math.random() - 0.5);

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="quiz-container">
        <p class="quiz-hint">Höre genau hin! Was bedeutet das gesprochene Wort auf Deutsch?</p>

        <div class="audio-quiz-center">
          <button type="button" id="btn-audio-play-word" class="btn-audio-listen-big" aria-label="Englisches Wort laut anhören (Taste R)">
            <span aria-hidden="true" style="font-size: 32px;">🎧</span>
            <span>Wort laut anhören (Taste R)</span>
          </button>
          <p class="help-text">Tipp: Klicke den Knopf oder drücke R, um das Wort beliebig oft anzuhören.</p>
        </div>

        <div class="quiz-options-grid" role="group" aria-label="Antwort-Möglichkeiten auf Deutsch">
          ${options.map((opt, i) => `
            <button class="quiz-option-btn"
                    data-correct="${opt.id === currentWord.id}"
                    data-answer="${escapeHtml(opt.source)}"
                    data-key="${i + 1}"
                    aria-label="Option ${i + 1}: ${escapeHtml(opt.source)}">
              <span class="opt-badge" aria-hidden="true">${i + 1}</span>
              <span>${escapeHtml(opt.source)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    // Speak English word automatically
    if (appState.settings.speechEnabled) {
      setTimeout(() => {
        audioManager.speak(currentWord.target, this.lang);
      }, 300);
    }

    const optionsText = options.map((opt, i) => `Taste ${i + 1}: ${opt.source}`).join(". ");
    announceToScreenReader(`Aufgabe ${this.currentIndex + 1} von ${this.totalQuestions}: Höre das englische Wort an. Optionen: ${optionsText}`, "polite");

    document.getElementById("btn-audio-play-word")?.addEventListener("click", () => {
      audioManager.speak(currentWord.target, this.lang);
    });

    container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => this.handleAnswer(btn));
    });

    const firstBtn = container.querySelector(".quiz-option-btn");
    if (firstBtn) firstBtn.focus();
  }

  handleAnswer(btn) {
    const isCorrect = btn.dataset.correct === "true";
    const answerText = btn.dataset.answer;
    const currentWord = this.words[this.currentIndex];

    if (isCorrect) {
      this.score++;
      this.showFeedback(true, `Hervorragend herausgehört! "${currentWord.target}" = "${answerText}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    } else {
      this.showFeedback(false, `Leider falsch. Gesprochen wurde "${currentWord.target}" = "${currentWord.source}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    }
  }

  handleKey(e) {
    if (["1", "2", "3", "4"].includes(e.key)) {
      const btn = document.querySelector(`.quiz-option-btn[data-key="${e.key}"]`);
      if (btn) btn.click();
    }
    if (e.key.toLowerCase() === "r") {
      const currentWord = this.words[this.currentIndex];
      if (currentWord) audioManager.speak(currentWord.target, this.lang);
    }
  }
}

// ------------------------------------------
// MODUS 7: SCHREIB-TRAINING & DIKTAT (OPTIONAL)
// ------------------------------------------
class TypingGame extends BaseGame {
  constructor(words, lang) {
    super(words, lang);
    this.modeKey = "typing";
  }

  start() {
    document.getElementById("btn-audio-repeat").style.display = "inline-flex";
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentIndex >= this.totalQuestions) {
      this.showFinalResults();
      return;
    }

    this.renderProgress();
    const currentWord = this.words[this.currentIndex];

    const container = document.getElementById("game-dynamic-content");
    container.innerHTML = `
      <div class="typing-game-box">
        <p class="quiz-hint">Tippe die englische Übersetzung für diesen Begriff:</p>
        <h2 class="typing-prompt-source">${escapeHtml(currentWord.source)}</h2>
        ${currentWord.note ? `<p class="help-text">Hinweis: ${escapeHtml(currentWord.note)}</p>` : ""}

        <div style="margin-bottom: 6px;">
          <button type="button" id="btn-typing-hear" class="btn btn-secondary btn-word-speak" data-speak-word="${escapeHtml(currentWord.target)}" data-speak-lang="${this.lang}" aria-label="Aussprache anhören (Taste R)">
            <span aria-hidden="true">🗣️</span> <span>Aussprache anhören (Taste R)</span>
          </button>
        </div>

        <form id="form-typing-answer" style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px;">
          <label for="input-typing-word" class="sr-only">Englische Übersetzung tippen</label>
          <input type="text"
                 id="input-typing-word"
                 class="typing-input-large"
                 autocomplete="off"
                 autocapitalize="off"
                 spellcheck="false"
                 placeholder="Englische Vokabel tippen..."
                 required>

          <div class="typing-action-buttons">
            <button type="submit" id="btn-submit-typing" class="btn btn-primary btn-large">
              ✔️ Prüfen (Enter)
            </button>
            <button type="button" id="btn-skip-typing" class="btn btn-secondary btn-large">
              💡 Lösung zeigen &amp; Überspringen
            </button>
          </div>
        </form>
      </div>
    `;

    announceToScreenReader(`Aufgabe ${this.currentIndex + 1} von ${this.totalQuestions}: Tippe die Übersetzung für "${currentWord.source}".`, "polite");

    if (appState.settings.autoPronounce && appState.settings.speechEnabled) {
      audioManager.speak(currentWord.target, this.lang);
    }

    const input = document.getElementById("input-typing-word");
    if (input) input.focus();

    document.getElementById("btn-typing-hear")?.addEventListener("click", () => {
      audioManager.speak(currentWord.target, this.lang);
    });

    document.getElementById("form-typing-answer").addEventListener("submit", (e) => {
      e.preventDefault();
      this.checkTypingAnswer();
    });

    document.getElementById("btn-skip-typing").addEventListener("click", () => {
      this.revealAnswer();
    });
  }

  checkTypingAnswer() {
    const input = document.getElementById("input-typing-word");
    if (!input) return;
    const userVal = input.value.trim().toLowerCase();
    const currentWord = this.words[this.currentIndex];
    const correctVal = currentWord.target.trim().toLowerCase();

    const cleanUser = userVal.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
    const cleanCorrect = correctVal.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");

    if (cleanUser === cleanCorrect) {
      this.score++;
      this.showFeedback(true, `Perfekt geschrieben! "${currentWord.source}" = "${currentWord.target}".`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    } else {
      this.showFeedback(false, `Nicht ganz. Richtig geschrieben: "${currentWord.target}" (Eingabe war: "${input.value}").`, () => {
        this.currentIndex++;
        this.nextQuestion();
      });
    }
  }

  revealAnswer() {
    const currentWord = this.words[this.currentIndex];
    audioManager.speak(currentWord.target, this.lang);
    this.showFeedback(false, `Lösung aufgedeckt: "${currentWord.source}" = "${currentWord.target}".`, () => {
      this.currentIndex++;
      this.nextQuestion();
    });
  }

  handleKey(e) {
    if (e.key.toLowerCase() === "r" && document.activeElement?.id !== "input-typing-word") {
      const currentWord = this.words[this.currentIndex];
      if (currentWord) audioManager.speak(currentWord.target, this.lang);
    }
  }
}

// ==========================================
// 8. INITIALIZATION & UI BINDINGS
// ==========================================

function initApp() {
  appState.settings = StorageManager.getSettings();
  appState.decks = StorageManager.getDecks();
  appState.gamification = new GamificationEngine();

  // Automatische Orientierung für bestehende Decks prüfen & korrigieren (Deutsch = source, Fremdsprache = target)
  let decksModified = false;
  appState.decks.forEach(d => {
    if (normalizeDeckIfInverted(d)) {
      decksModified = true;
    }
  });
  if (decksModified) {
    StorageManager.saveDecks(appState.decks);
  }

  const savedDeckId = StorageManager.getActiveDeckId();
  appState.activeDeck = appState.decks.find(d => d.id === savedDeckId) || appState.decks[0];
  if (appState.activeDeck && normalizeDeckIfInverted(appState.activeDeck)) {
    StorageManager.saveDecks(appState.decks);
  }

  // Apply I18n Language & system detection
  I18n.applyLanguage();

  applySettingsToUI();
  populateVoiceList();
  populateDeckSelect();
  renderVocabTable();
  setupEventListeners();
  setupDragAndDrop();

  appState.gamification.renderStats();
}

function applySettingsToUI() {
  const { soundEnabled, speechEnabled, highContrast, theme, fontSize, soundVolume, ttsRate, autoPronounce, unlimitedHearts, enableTypingExercises } = appState.settings;

  // Sound Button (Header if exists)
  const btnSound = document.getElementById("btn-toggle-sound");
  if (btnSound) {
    btnSound.setAttribute("aria-pressed", soundEnabled);
    btnSound.querySelector(".ctrl-text").textContent = soundEnabled ? I18n.t("sound_on") : I18n.t("sound_off");
  }

  // Speech Button (Header if exists)
  const btnSpeech = document.getElementById("btn-toggle-speech");
  if (btnSpeech) {
    btnSpeech.setAttribute("aria-pressed", speechEnabled);
    btnSpeech.querySelector(".ctrl-text").textContent = speechEnabled ? I18n.t("speech_on") : I18n.t("speech_off");
  }

  // Contrast Button (Header if exists)
  const btnContrast = document.getElementById("btn-toggle-contrast");
  if (btnContrast) {
    btnContrast.setAttribute("aria-pressed", highContrast);
    btnContrast.querySelector(".ctrl-text").textContent = highContrast ? I18n.t("contrast_high") : I18n.t("contrast_std");
  }

  // Settings Panel Quick Toggles Sync
  const btnSettingsSound = document.getElementById("btn-settings-toggle-sound");
  if (btnSettingsSound) {
    btnSettingsSound.setAttribute("aria-pressed", soundEnabled);
    btnSettingsSound.querySelector(".ctrl-text").textContent = soundEnabled ? I18n.t("sound_on") : I18n.t("sound_off");
  }

  const btnSettingsSpeech = document.getElementById("btn-settings-toggle-speech");
  if (btnSettingsSpeech) {
    btnSettingsSpeech.setAttribute("aria-pressed", speechEnabled);
    btnSettingsSpeech.querySelector(".ctrl-text").textContent = speechEnabled ? I18n.t("speech_on") : I18n.t("speech_off");
  }

  const btnSettingsContrast = document.getElementById("btn-settings-toggle-contrast");
  if (btnSettingsContrast) {
    btnSettingsContrast.setAttribute("aria-pressed", highContrast);
    btnSettingsContrast.querySelector(".ctrl-text").textContent = highContrast ? I18n.t("contrast_high") : I18n.t("contrast_std");
  }

  const settingsQuickLang = document.getElementById("select-settings-quick-lang");
  if (settingsQuickLang) {
    settingsQuickLang.value = I18n.getSavedPreference();
  }

  // Typing Exercises Settings & Visibility Sync
  document.querySelectorAll(".check-typing-sync").forEach(cb => {
    cb.checked = !!enableTypingExercises;
  });

  const typingCard = document.getElementById("card-mode-typing");
  if (typingCard) {
    if (enableTypingExercises) {
      typingCard.style.display = "";
      typingCard.classList.remove("hidden");
    } else {
      typingCard.style.display = "none";
      typingCard.classList.add("hidden");
    }
  }

  // Apply Theme to body
  document.body.className = `${highContrast ? "theme-high-contrast" : (theme || "theme-duo")} font-${fontSize || "normal"}`;

  // Settings Panel Inputs
  const selectTheme = document.getElementById("select-theme");
  if (selectTheme) selectTheme.value = highContrast ? "theme-high-contrast" : (theme || "theme-duo");

  const selectFont = document.getElementById("select-font-size");
  if (selectFont) selectFont.value = fontSize || "normal";

  const checkEarcons = document.getElementById("check-earcons");
  if (checkEarcons) checkEarcons.checked = soundEnabled;

  const checkAutoPronounce = document.getElementById("check-auto-pronounce");
  if (checkAutoPronounce) checkAutoPronounce.checked = autoPronounce;

  const checkUnlimitedHearts = document.getElementById("check-unlimited-hearts");
  if (checkUnlimitedHearts) checkUnlimitedHearts.checked = unlimitedHearts;

  const rangeVolume = document.getElementById("range-sound-volume");
  if (rangeVolume) {
    rangeVolume.value = soundVolume;
    document.getElementById("sound-vol-label").textContent = `${Math.round(soundVolume * 100)}%`;
  }

  const rangeRate = document.getElementById("range-tts-rate");
  if (rangeRate) {
    rangeRate.value = ttsRate;
    document.getElementById("tts-rate-label").textContent = `${ttsRate}x`;
  }

  // Update header language select if present
  const headerLangSelect = document.getElementById("select-header-lang");
  if (headerLangSelect) headerLangSelect.value = I18n.getSavedPreference();
}

function populateDeckSelect() {
  const selects = document.querySelectorAll(".deck-select-sync");
  selects.forEach(select => {
    select.innerHTML = "";
    appState.decks.forEach(deck => {
      const opt = document.createElement("option");
      opt.value = deck.id;
      opt.textContent = `${deck.title} (${deck.words.length} Vokabeln)`;
      if (deck.id === appState.activeDeck.id) opt.selected = true;
      select.appendChild(opt);
    });
  });

  updateDeckStatsBadge();
}

function updateDeckStatsBadge() {
  const badges = document.querySelectorAll(".deck-stats-badge-sync");
  badges.forEach(b => {
    if (appState.activeDeck) {
      b.textContent = I18n.t("words_ready", { count: appState.activeDeck.words.length });
    }
  });

  const unitTitle = document.getElementById("unit-title-text");
  if (unitTitle && appState.activeDeck) {
    unitTitle.textContent = `${appState.activeDeck.title}`;
  }
}

function renderVocabTable(filterQuery = "") {
  const tbody = document.getElementById("vocab-table-body");
  const title = document.getElementById("current-deck-title");
  if (!tbody || !appState.activeDeck) return;

  if (title) title.textContent = `Vokabeln der Liste: ${appState.activeDeck.title}`;

  tbody.innerHTML = "";
  const query = (filterQuery || "").trim().toLowerCase();
  const filteredWords = query
    ? appState.activeDeck.words.filter(w =>
        w.source.toLowerCase().includes(query) ||
        w.target.toLowerCase().includes(query) ||
        (w.note && w.note.toLowerCase().includes(query))
      )
    : appState.activeDeck.words;

  if (filteredWords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">${
      query ? 'Keine Vokabeln gefunden für "' + escapeHtml(query) + '".' : 'Noch keine Vokabeln in dieser Liste vorhanden.'
    }</td></tr>`;
    return;
  }

  filteredWords.forEach((w) => {
    const tr = document.createElement("tr");
    const deckLang = (appState.activeDeck && appState.activeDeck.lang) || "en-US";
    tr.innerHTML = `
      <td><strong>${escapeHtml(w.source)}</strong></td>
      <td>
        <div class="vocab-word-flex">
          <span class="vocab-target-text">${escapeHtml(w.target)}</span>
          ${createSpeakButtonHtml(w.target, deckLang)}
        </div>
      </td>
      <td>${escapeHtml(w.note || "-")}</td>
      <td><span class="badge-stats">Box ${w.box || 1}</span></td>
      <td>
        <button class="btn btn-secondary btn-delete-word" data-id="${w.id}" aria-label="Vokabel ${escapeHtml(w.source)} löschen">
          🗑️ Löschen
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".btn-delete-word").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      appState.activeDeck.words = appState.activeDeck.words.filter(w => w.id !== id);
      StorageManager.saveDecks(appState.decks);
      renderVocabTable();
      populateDeckSelect();
      announceToScreenReader("Vokabel gelöscht.", "assertive");
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[m]);
}

// ------------------------------------------
// GAME START & LIFECYCLE
// ------------------------------------------
function startGame(mode) {
  if (!appState.activeDeck || appState.activeDeck.words.length === 0) {
    alert("Die aktuelle Vokabelliste ist leer! Bitte importiere Vokabeln.");
    return;
  }

  // If typing requested but disabled, redirect to next valid mode
  if (mode === "typing" && (!appState.settings || !appState.settings.enableTypingExercises)) {
    mode = "audio_quiz";
  }

  // Switch to learn panel and show game arena
  switchTab("tab-learn");
  document.getElementById("mode-selection-area").classList.add("hidden");
  document.getElementById("game-arena").classList.remove("hidden");

  // Shuffle words freshly on each game start so repetitions have different order!
  const words = [...appState.activeDeck.words].sort(() => Math.random() - 0.5);
  const lang = appState.activeDeck.lang || "en-US";

  switch (mode) {
    case "match":
      appState.currentGame = new MatchGame(words, lang);
      break;
    case "audio_quiz":
      appState.currentGame = new AudioQuizGame(words, lang);
      break;
    case "quiz":
      appState.currentGame = new QuizGame(words, lang);
      break;
    case "truefalse":
      appState.currentGame = new TrueFalseGame(words, lang);
      break;
    case "flashcards":
      appState.currentGame = new FlashcardsGame(words, lang);
      break;
    case "scramble":
      appState.currentGame = new ScrambleGame(words, lang);
      break;
    case "typing":
      appState.currentGame = new TypingGame(words, lang);
      break;
    default:
      appState.currentGame = new MatchGame(words, lang);
      break;
  }

  if (appState.currentGame) {
    appState.currentGame.start();
  }
}

function exitCurrentGame() {
  appState.currentGame = null;
  document.getElementById("game-arena").classList.add("hidden");
  document.getElementById("mode-selection-area").classList.remove("hidden");
  announceToScreenReader("Übung beendet. Zurück zur Auswahl.", "polite");
}

// ------------------------------------------
// TABS SWITCHER
// ------------------------------------------
function switchTab(tabId) {
  const tabs = ["tab-path", "tab-learn", "tab-vocab", "tab-import", "tab-settings"];
  const panels = ["panel-path", "panel-learn", "panel-vocab", "panel-import", "panel-settings"];

  tabs.forEach((id, idx) => {
    const tabEl = document.getElementById(id);
    const panelEl = document.getElementById(panels[idx]);
    const isActive = id === tabId;

    if (tabEl) {
      tabEl.setAttribute("aria-selected", isActive);
      tabEl.tabIndex = isActive ? 0 : -1;
      if (isActive) {
        tabEl.classList.add("active");
      } else {
        tabEl.classList.remove("active");
      }
    }
    if (panelEl) {
      if (isActive) {
        panelEl.classList.remove("hidden");
      } else {
        panelEl.classList.add("hidden");
      }
    }
  });

  const activeTabEl = document.getElementById(tabId);
  if (activeTabEl) {
    activeTabEl.focus();
    announceToScreenReader(`Bereich geöffnet: ${activeTabEl.textContent.trim()}`, "polite");
  }
}

// Callback when language changed
window.onLanguageChanged = function() {
  applySettingsToUI();
  updateDeckStatsBadge();
  if (appState.gamification) appState.gamification.renderStats();
};

// ------------------------------------------
// EVENT LISTENERS & SETUP
// ------------------------------------------
function setupEventListeners() {
  // Navigation Tabs
  ["tab-path", "tab-learn", "tab-vocab", "tab-import", "tab-settings"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => switchTab(id));
  });

  // Mascot Cheer Button
  document.getElementById("btn-mascot-cheer")?.addEventListener("click", () => MascotManager.cheer());

  // Duolingo Path Node Clicks
  document.querySelectorAll(".node-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      startGame(mode);
    });
  });

  // Centralized Accessibility Toggles (Settings Hub)
  function toggleAppSound() {
    appState.settings.soundEnabled = !appState.settings.soundEnabled;
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
    announceToScreenReader(`Töne ${appState.settings.soundEnabled ? "ein" : "aus"}.`, "assertive");
  }

  function toggleAppSpeech() {
    appState.settings.speechEnabled = !appState.settings.speechEnabled;
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
    announceToScreenReader(`Aussprache ${appState.settings.speechEnabled ? "ein" : "aus"}.`, "assertive");
  }

  function toggleAppContrast() {
    appState.settings.highContrast = !appState.settings.highContrast;
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
    announceToScreenReader(`Kontrast ${appState.settings.highContrast ? "hoch" : "standard"}.`, "assertive");
  }

  window.toggleAppSound = toggleAppSound;
  window.toggleAppSpeech = toggleAppSpeech;
  window.toggleAppContrast = toggleAppContrast;

  // Settings Buttons
  document.getElementById("btn-settings-toggle-sound")?.addEventListener("click", toggleAppSound);
  document.getElementById("btn-settings-toggle-speech")?.addEventListener("click", toggleAppSpeech);
  document.getElementById("btn-settings-toggle-contrast")?.addEventListener("click", toggleAppContrast);

  // Optional Fallback if header buttons ever present
  document.getElementById("btn-toggle-sound")?.addEventListener("click", toggleAppSound);
  document.getElementById("btn-toggle-speech")?.addEventListener("click", toggleAppSpeech);
  document.getElementById("btn-toggle-contrast")?.addEventListener("click", toggleAppContrast);

  // Header button to directly open settings (if present)
  document.getElementById("btn-header-open-settings")?.addEventListener("click", () => {
    switchTab("tab-settings");
    document.getElementById("settings-heading")?.focus();
  });

  // Typing Exercises Toggle Synchronization
  document.querySelectorAll(".check-typing-sync").forEach(cb => {
    cb.addEventListener("change", (e) => {
      appState.settings.enableTypingExercises = e.target.checked;
      StorageManager.saveSettings(appState.settings);
      applySettingsToUI();
      announceToScreenReader(`Schreibübungen ${appState.settings.enableTypingExercises ? "aktiviert" : "deaktiviert"}.`, "assertive");
    });
  });

  // Global Audio Read-Aloud Click Delegation for all English words
  document.addEventListener("click", (e) => {
    const speakBtn = e.target.closest(".btn-word-speak");
    if (speakBtn) {
      e.stopPropagation();
      const word = speakBtn.dataset.speakWord;
      const lang = speakBtn.dataset.speakLang || (appState.activeDeck && appState.activeDeck.lang) || "en-US";
      if (word) {
        audioManager.speak(word, lang);
        announceToScreenReader(`Wort ausgesprochen: ${word}`, "polite");
      }
    }
  });

  // Header & Settings Language Selectors (Synchronized)
  ["select-header-lang", "select-ui-language", "select-settings-quick-lang"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        I18n.setLanguage(e.target.value);
        announceToScreenReader(`Sprache geändert.`, "assertive");
      });
    }
  });

  // Theme & Font Size Selectors
  document.getElementById("select-theme")?.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "theme-high-contrast") {
      appState.settings.highContrast = true;
    } else {
      appState.settings.highContrast = false;
      appState.settings.theme = val;
    }
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
  });

  document.getElementById("select-font-size")?.addEventListener("change", (e) => {
    appState.settings.fontSize = e.target.value;
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
  });

  document.getElementById("check-unlimited-hearts")?.addEventListener("change", (e) => {
    appState.settings.unlimitedHearts = e.target.checked;
    StorageManager.saveSettings(appState.settings);
    appState.gamification.renderStats();
  });

  document.getElementById("btn-refill-hearts")?.addEventListener("click", () => {
    appState.gamification.refillHearts();
  });

  // Mode Start Buttons
  document.querySelectorAll(".btn-start-mode").forEach(btn => {
    btn.addEventListener("click", () => startGame(btn.dataset.mode));
  });

  // Game Arena Controls
  document.getElementById("btn-exit-game")?.addEventListener("click", exitCurrentGame);

  document.getElementById("btn-audio-repeat")?.addEventListener("click", () => {
    if (appState.currentGame && appState.currentGame.words) {
      const w = appState.currentGame.words[appState.currentGame.currentIndex];
      if (w) audioManager.speak(w.target, appState.currentGame.lang);
    }
  });

  // Active Deck Selection Change (Synchronized across all dropdowns)
  document.querySelectorAll(".deck-select-sync").forEach(select => {
    select.addEventListener("change", (e) => {
      const selected = appState.decks.find(d => d.id === e.target.value);
      if (selected) {
        if (normalizeDeckIfInverted(selected)) {
          StorageManager.saveDecks(appState.decks);
        }
        appState.activeDeck = selected;
        StorageManager.setActiveDeckId(selected.id);
        populateDeckSelect();
        renderVocabTable();
        announceToScreenReader(`Aktive Liste: ${selected.title}`, "assertive");
      }
    });
  });

  // Manual Column Swap (Deutsch ↔ Fremdsprache) in Reiter 3
  document.getElementById("btn-swap-deck-cols")?.addEventListener("click", () => {
    if (!appState.activeDeck || !appState.activeDeck.words || appState.activeDeck.words.length === 0) {
      alert("Keine Vokabeln zum Vertauschen vorhanden.");
      return;
    }
    appState.activeDeck.words.forEach(w => {
      const temp = w.source;
      w.source = w.target;
      w.target = temp;
    });
    StorageManager.saveDecks(appState.decks);
    renderVocabTable();
    audioManager.playSuccess();
    announceToScreenReader("Spalten erfolgreich vertauscht (Deutsch ↔ Fremdsprache).", "assertive");
  });

  // Vocab Search Filter
  const searchInput = document.getElementById("input-search-vocab");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderVocabTable(e.target.value));
  }

  // Add Word Form
  document.getElementById("form-add-word")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const source = document.getElementById("input-word-source").value.trim();
    const target = document.getElementById("input-word-target").value.trim();
    const note = document.getElementById("input-word-note").value.trim();

    if (!source || !target) return;

    appState.activeDeck.words.push({
      id: "w_" + Date.now(),
      source,
      target,
      note,
      box: 1
    });

    StorageManager.saveDecks(appState.decks);
    renderVocabTable();
    populateDeckSelect();

    document.getElementById("input-word-source").value = "";
    document.getElementById("input-word-target").value = "";
    document.getElementById("input-word-note").value = "";
    document.getElementById("input-word-source").focus();

    audioManager.playSuccess();
    announceToScreenReader(`Vokabel "${source}" hinzugefügt!`, "assertive");
  });

  // Create Deck Modal
  document.getElementById("btn-create-deck")?.addEventListener("click", () => {
    document.getElementById("modal-container").classList.remove("hidden");
    document.getElementById("modal-input-deck-name").focus();
  });
  document.getElementById("btn-close-modal")?.addEventListener("click", () => {
    document.getElementById("modal-container").classList.add("hidden");
  });
  document.getElementById("btn-modal-cancel")?.addEventListener("click", () => {
    document.getElementById("modal-container").classList.add("hidden");
  });
  document.getElementById("btn-modal-save")?.addEventListener("click", () => {
    const title = document.getElementById("modal-input-deck-name").value.trim() || "Neue Vokabelliste";
    const lang = document.getElementById("modal-select-lang").value;
    const newDeck = {
      id: "deck_" + Date.now(),
      title,
      lang,
      words: []
    };
    appState.decks.push(newDeck);
    appState.activeDeck = newDeck;
    StorageManager.saveDecks(appState.decks);
    StorageManager.setActiveDeckId(newDeck.id);

    document.getElementById("modal-container").classList.add("hidden");
    populateDeckSelect();
    renderVocabTable();
    announceToScreenReader(`Neue Liste "${title}" erstellt.`, "assertive");
  });

  // Export Deck as Excel
  document.getElementById("btn-export-deck-xlsx")?.addEventListener("click", exportDeckToExcel);

  // Settings range & test
  document.getElementById("range-sound-volume")?.addEventListener("input", (e) => {
    appState.settings.soundVolume = parseFloat(e.target.value);
    document.getElementById("sound-vol-label").textContent = `${Math.round(appState.settings.soundVolume * 100)}%`;
    StorageManager.saveSettings(appState.settings);
  });

  document.getElementById("range-tts-rate")?.addEventListener("input", (e) => {
    appState.settings.ttsRate = parseFloat(e.target.value);
    document.getElementById("tts-rate-label").textContent = `${appState.settings.ttsRate}x`;
    StorageManager.saveSettings(appState.settings);
  });

  document.getElementById("check-earcons")?.addEventListener("change", (e) => {
    appState.settings.soundEnabled = e.target.checked;
    StorageManager.saveSettings(appState.settings);
    applySettingsToUI();
  });

  document.getElementById("check-auto-pronounce")?.addEventListener("change", (e) => {
    appState.settings.autoPronounce = e.target.checked;
    StorageManager.saveSettings(appState.settings);
  });

  document.getElementById("btn-test-voice-en")?.addEventListener("click", () => {
    audioManager.speak("Welcome to your vocabulary trainer! Practice every day to master English.", "en-US");
    announceToScreenReader("Englische Aussprache wird abgespielt.", "polite");
  });

  document.getElementById("btn-test-voice-de")?.addEventListener("click", () => {
    audioManager.speak("Willkommen beim Vokabel-Trainer! Übe jeden Tag, um dein Englisch zu perfektionieren.", "de-DE");
    announceToScreenReader("Deutsche Aussprache wird abgespielt.", "polite");
  });

  document.getElementById("btn-test-voice")?.addEventListener("click", () => {
    audioManager.speak("Das ist ein Test der barrierefreien Sprachausgabe für VokabelStar.", "de-DE");
  });

  document.getElementById("select-tts-voice")?.addEventListener("change", (e) => {
    appState.settings.selectedVoiceURI = e.target.value;
    StorageManager.saveSettings(appState.settings);
  });

  // Reset to Defaults
  document.getElementById("btn-reset-defaults")?.addEventListener("click", () => {
    if (confirm("Möchtest du wirklich alle Daten auf den Auslieferungszustand zurücksetzen?")) {
      StorageManager.saveDecks(DEFAULT_DECKS);
      appState.decks = DEFAULT_DECKS;
      appState.activeDeck = DEFAULT_DECKS[0];
      populateDeckSelect();
      renderVocabTable();
      audioManager.playSuccess();
      announceToScreenReader("Standard-Sets wiederhergestellt.", "assertive");
    }
  });

  // Backup Export
  document.getElementById("btn-export-backup-json")?.addEventListener("click", () => {
    const fullBackup = {
      decks: appState.decks,
      progress: appState.gamification.progress,
      settings: appState.settings
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `vokabelstar_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    announceToScreenReader("Backup-Datei heruntergeladen.", "polite");
  });

  // Paste Text Parse Buttons (Synced across Import Tab and Settings Hub)
  document.querySelectorAll(".btn-parse-sync").forEach(btn => {
    btn.addEventListener("click", () => {
      // Find associated textarea
      const panel = btn.closest("section");
      const textarea = panel ? panel.querySelector(".textarea-paste-sync") : document.getElementById("textarea-paste-import");
      const text = textarea ? textarea.value.trim() : "";
      if (!text) {
        alert("Bitte füge zuerst Vokabeln ein (z. B. Hund = dog).");
        textarea?.focus();
        return;
      }
      const pairs = DocumentImporter.parseRawText(text);
      switchTab("tab-import");
      handleParsedImport(pairs, "Eingefügter Text");
    });
  });

  // Import Action Buttons
  document.getElementById("btn-confirm-import")?.addEventListener("click", executeImport);
  document.getElementById("btn-cancel-import")?.addEventListener("click", () => {
    document.getElementById("import-preview-card").classList.add("hidden");
    appState.parsedImportData = null;
    announceToScreenReader("Import abgebrochen.", "polite");
  });

  document.getElementById("import-swap-cols")?.addEventListener("change", () => {
    if (!appState.parsedImportData) return;
    appState.parsedImportData = appState.parsedImportData.map(item => ({
      source: item.target,
      target: item.source,
      note: item.note
    }));
    renderImportPreview(appState.parsedImportData);
    announceToScreenReader("Spalten vertauscht.", "polite");
  });

  // Global Keyboard Shortcuts
  window.addEventListener("keydown", handleGlobalShortcuts);
}

function handleGlobalShortcuts(e) {
  const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

  // Direct number keys 1..5 switch tabs (wie in BarrierefreieFinanzApp)
  if (!isInput && !e.ctrlKey && !e.altKey && !e.metaKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
    if (!appState.currentGame) {
      e.preventDefault();
      const map = {
        "1": "tab-path",
        "2": "tab-learn",
        "3": "tab-vocab",
        "4": "tab-import",
        "5": "tab-settings"
      };
      switchTab(map[e.key]);
      return;
    }
  }

  // Alt + 1..5: Always switch tabs
  if (e.altKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
    e.preventDefault();
    const map = {
      "1": "tab-path",
      "2": "tab-learn",
      "3": "tab-vocab",
      "4": "tab-import",
      "5": "tab-settings"
    };
    switchTab(map[e.key]);
    return;
  }

  // O: Mascot cheer / advice
  if (e.key.toLowerCase() === "o" && !isInput) {
    e.preventDefault();
    MascotManager.cheer();
    return;
  }

  // Alt + S: Toggle Sound
  if (e.altKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (window.toggleAppSound) window.toggleAppSound();
    return;
  }

  // Alt + V: Toggle Voice / Speech
  if (e.altKey && e.key.toLowerCase() === "v") {
    e.preventDefault();
    if (window.toggleAppSpeech) window.toggleAppSpeech();
    return;
  }

  // Alt + K: Toggle High Contrast
  if (e.altKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (window.toggleAppContrast) window.toggleAppContrast();
    return;
  }

  // Escape: Exit Game or Modal
  if (e.key === "Escape") {
    const modal = document.getElementById("modal-container");
    if (modal && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      return;
    }
    if (appState.currentGame) {
      exitCurrentGame();
      return;
    }
  }

  // Forward Key to Active Game
  if (appState.currentGame && typeof appState.currentGame.handleKey === "function") {
    appState.currentGame.handleKey(e);
  }
}

// ------------------------------------------
// DRAG & DROP AND FILE IMPORT
// ------------------------------------------
function setupDragAndDrop() {
  const dropZones = document.querySelectorAll(".file-drop-zone-sync");
  const fileInputs = document.querySelectorAll(".file-input-sync");

  // File Inputs with auto-reset
  fileInputs.forEach(fileInput => {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processSelectedFile(e.target.files[0]);
      }
      e.target.value = ''; // Always reset so re-selecting the same file works!
    });
  });

  // Drop Zones
  dropZones.forEach(dropZone => {
    ["dragenter", "dragover"].forEach(evtName => {
      dropZone.addEventListener(evtName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(evtName => {
      dropZone.addEventListener(evtName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", async (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processSelectedFile(files[0]);
      }
    });

    // Clicking anywhere on dropZone triggers corresponding file input
    dropZone.addEventListener("click", () => {
      const panel = dropZone.closest("section");
      const input = panel ? panel.querySelector(".file-input-sync") : document.getElementById("file-input-control");
      if (input) input.click();
    });

    // Pressing Space or Enter on focused dropZone triggers file picker
    dropZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const panel = dropZone.closest("section");
        const input = panel ? panel.querySelector(".file-input-sync") : document.getElementById("file-input-control");
        if (input) input.click();
      }
    });
  });
}

async function processSelectedFile(file) {
  const loader = document.getElementById("import-loading-indicator");
  try {
    announceToScreenReader(`Datei "${file.name}" wird gelesen und analysiert...`, "assertive");
    if (loader) loader.classList.remove("hidden");

    const pairs = await DocumentImporter.parseFile(file);
    const defaultListName = file.name.replace(/\.[^/.]+$/, "");
    switchTab("tab-import");
    handleParsedImport(pairs, defaultListName);
  } catch (err) {
    alert("Fehler beim Lesen der Datei: " + err.message);
    announceToScreenReader(`Fehler: ${err.message}`, "assertive");
  } finally {
    if (loader) loader.classList.add("hidden");
  }
}

function handleParsedImport(pairs, defaultListName) {
  if (!pairs || pairs.length === 0) {
    alert("In dieser Datei konnten leider keine Vokabelpaare erkannt werden. Bitte prüfe, ob die Datei mindestens 2 Spalten hat (z. B. Spalte 1: Begriff, Spalte 2: Übersetzung).");
    announceToScreenReader("Keine Vokabelpaare gefunden. Bitte Dateiformat prüfen.", "assertive");
    return;
  }

  // Automatische Orientierung: Englische Wörter als Lernvokabeln (Spalte 2), deutsche Begriffe als Bedeutung (Spalte 1)
  const wasSwapped = autoOrientPairs(pairs);

  appState.parsedImportData = pairs;
  const previewCard = document.getElementById("import-preview-card");
  const summaryText = document.getElementById("import-summary-text");
  const deckNameInput = document.getElementById("import-target-deck-name");

  if (deckNameInput) deckNameInput.value = defaultListName;
  if (summaryText) {
    let msg = `Erfolg! Es wurden ${pairs.length} Vokabelpaare erkannt.`;
    if (wasSwapped) {
      msg += ` 💡 Spalten wurden automatisch so ausgerichtet, dass die englischen Vokabeln gesprochen werden.`;
    }
    summaryText.textContent = msg;
  }
  if (previewCard) {
    previewCard.classList.remove("hidden");
    previewCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderImportPreview(pairs);
  audioManager.playSuccess();
  announceToScreenReader(`Dokument analysiert! ${pairs.length} Vokabelpaare erkannt. Vorschau ist geöffnet.`, "assertive");

  const confirmBtn = document.getElementById("btn-confirm-import");
  if (confirmBtn) {
    confirmBtn.focus();
  }
}

function renderImportPreview(pairs) {
  const tbody = document.getElementById("import-preview-body");
  tbody.innerHTML = "";

  pairs.slice(0, 50).forEach((pair, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(pair.source)}</strong></td>
      <td>
        <div class="vocab-word-flex">
          <span class="vocab-target-text">${escapeHtml(pair.target)}</span>
          ${createSpeakButtonHtml(pair.target, "en-US")}
        </div>
      </td>
      <td>${escapeHtml(pair.note || "-")}</td>
    `;
    tbody.appendChild(tr);
  });
}

function executeImport() {
  if (!appState.parsedImportData || appState.parsedImportData.length === 0) return;

  const mode = document.getElementById("import-mode-select").value;
  const deckTitle = document.getElementById("import-target-deck-name").value.trim() || "Importierte Liste";

  const newWords = appState.parsedImportData.map(p => ({
    id: "w_" + Math.random().toString(36).substr(2, 9),
    source: p.source,
    target: p.target,
    note: p.note || "",
    box: 1
  }));

  if (mode === "new") {
    const newDeck = {
      id: "deck_" + Date.now(),
      title: deckTitle,
      lang: "en-US",
      words: newWords
    };
    appState.decks.push(newDeck);
    appState.activeDeck = newDeck;
    StorageManager.setActiveDeckId(newDeck.id);
  } else {
    appState.activeDeck.words.push(...newWords);
  }

  StorageManager.saveDecks(appState.decks);
  populateDeckSelect();
  renderVocabTable();

  document.getElementById("import-preview-card").classList.add("hidden");
  appState.parsedImportData = null;
  audioManager.playSuccess();

  announceToScreenReader(`${newWords.length} Vokabeln erfolgreich gespeichert!`, "assertive");
  alert(`${newWords.length} Vokabeln wurden erfolgreich übernommen!`);
  switchTab("tab-path");
}

// ------------------------------------------
// EXPORT TO EXCEL (.XLSX)
// ------------------------------------------
function exportDeckToExcel() {
  if (typeof XLSX === "undefined") {
    alert("Excel-Export nicht bereit.");
    return;
  }
  const deck = appState.activeDeck;
  if (!deck || deck.words.length === 0) {
    alert("Die Liste enthält keine Vokabeln zum Exportieren.");
    return;
  }

  const exportRows = [
    ["Begriff / Sprache 1", "Übersetzung / Sprache 2", "Hinweis", "Lernstufe (Box)"],
    ...deck.words.map(w => [w.source, w.target, w.note || "", w.box || 1])
  ];

  const ws = XLSX.utils.aoa_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vokabeln");

  const safeFilename = `${deck.title.replace(/[^a-z0-9_-]/gi, "_")}.xlsx`;
  XLSX.writeFile(wb, safeFilename);
  announceToScreenReader(`Liste als "${safeFilename}" exportiert.`, "polite");
}

// Start application when DOM is ready
window.addEventListener("DOMContentLoaded", initApp);

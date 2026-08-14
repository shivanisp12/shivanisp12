/**
 * Celebration Verse - Background Audio Engine
 */
class BackgroundMusicLibrary {
  constructor() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.isPlaying = false;
    this.init();
  }

  init() {
    if (window.CELEBRATION_CONFIG && window.CELEBRATION_CONFIG.bgMusicUrl) {
      this.audio.src = window.CELEBRATION_CONFIG.bgMusicUrl;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(err => console.log("Audio playback blocked by browser policy:", err));
    }
    return this.isPlaying;
  }
}

window.bgMusicEngine = new BackgroundMusicLibrary();

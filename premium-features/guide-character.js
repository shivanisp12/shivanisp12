/**
 * Celebration Verse - Interactive Full-Body Mascot Guide
 */
class GuideCharacterManager {
  constructor() {
    this.container = document.getElementById('guideCharacterContainer');
    this.avatar = document.getElementById('mascotAvatar');
    this.bubble = document.getElementById('mascotBubble');
    this.dialogues = [
      "Welcome to Celebration Verse!",
      "Don't forget to unwrap your 3D gift box!",
      "Try playing the mini-games in the Arcade!",
      "You can unlock the secret vault with the passcode!"
    ];
    this.init();
  }

  init() {
    this.avatar.addEventListener('click', () => this.speakRandom());
    setTimeout(() => this.speak("Hi there! Click me anytime for tips! ✨"), 1500);
  }

  speak(text) {
    this.bubble.textContent = text;
    this.bubble.classList.remove('hidden');
    if (window.celebrationAudio) window.celebrationAudio.playClick();
    setTimeout(() => {
      this.bubble.classList.add('hidden');
    }, 4000);
  }

  speakRandom() {
    const msg = this.dialogues[Math.floor(Math.random() * this.dialogues.length)];
    this.speak(msg);
  }
}

window.GuideCharacterManager = GuideCharacterManager;

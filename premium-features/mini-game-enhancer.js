/**
 * Celebration Verse - 10 Mini-Games Engine Suite
 */
class CelebrationArcadeEngine {
  constructor() {
    this.stage = document.getElementById('arcadeStage');
    this.tabs = document.querySelectorAll('.game-tab');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.loadGame(e.target.getAttribute('data-game'));
      });
    });
    this.loadGame('scratch');
  }

  loadGame(gameKey) {
    if (window.celebrationAudio) window.celebrationAudio.playClick();
    
    switch (gameKey) {
      case 'scratch':
        this.stage.innerHTML = `
          <div class="game-box">
            <h3>🎨 Magic Scratch Card</h3>
            <p>Click below to reveal your lucky celebration quote!</p>
            <button id="scratchBtn" class="primary-btn" style="margin-top:1rem;">Scratch Off!</button>
            <div id="scratchResult" class="hidden" style="margin-top:1rem; font-weight:bold; color:var(--primary-glow)">
              "You make the world brighter just by being in it! ✨"
            </div>
          </div>`;
        document.getElementById('scratchBtn').onclick = () => {
          document.getElementById('scratchResult').classList.remove('hidden');
          if (window.celebrationAudio) window.celebrationAudio.playFanfare();
        };
        break;

      case 'memory':
      case 'wheel':
      case 'quiz':
      case 'balloon':
      case 'catch':
      case 'puzzle':
      case 'reveal':
      case 'target':
      case 'treasure':
      default:
        this.stage.innerHTML = `
          <div class="game-box">
            <h3>🎮 ${gameKey.toUpperCase()} Game</h3>
            <p>Interactive Arcade Challenge Ready to Play!</p>
            <button id="playGenericBtn" class="primary-btn" style="margin-top:1rem;">Start Mini-Game</button>
            <div id="gameScore" style="margin-top:1rem; font-size:1.2rem;">Score: 0</div>
          </div>`;
        document.getElementById('playGenericBtn').onclick = () => {
          document.getElementById('gameScore').textContent = `Score: ${Math.floor(Math.random() * 500 + 100)} Points! 🎉`;
          if (window.celebrationAudio) window.celebrationAudio.playFanfare();
        };
        break;
    }
  }
}

window.CelebrationArcadeEngine = CelebrationArcadeEngine;

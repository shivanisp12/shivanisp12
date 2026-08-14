/* ==========================================================================
   FEATURE 7: COMPLETE MINI-GAME EXPERIENCE ENHANCER
   ========================================================================== */
(function () {
  function init() {
    const originalOpenGame = window.openGame;
    window.openGame = function (gameType) {
      if (typeof originalOpenGame === 'function') originalOpenGame(gameType);
      injectHUD(gameType);
    };
  }

  function injectHUD(gameType) {
    const container = document.getElementById('gameContainer');
    if (!container || container.querySelector('.premium-game-hud')) return;

    const hud = document.createElement('div');
    hud.className = 'premium-game-hud';
    hud.innerHTML = `
      <div>Goal: Complete mini-game challenge!</div>
      <div class="premium-game-score">Score: <span id="premiumGameScore">100</span></div>
    `;
    container.prepend(hud);

    if (window.GuideCharacter) window.GuideCharacter.speak(`Good luck with ${gameType}! 🎮`);
  }

  window.MiniGameEnhancer = { init };
})();

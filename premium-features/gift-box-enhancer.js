/* ==========================================================================
   FEATURE 6: PREMIUM GIFT BOX EXPERIENCE ENHANCER
   ========================================================================== */
(function () {
  function init() {
    const giftBox = document.getElementById('giftBox');
    if (!giftBox) return;

    giftBox.classList.add('premium-glowing');

    // Non-destructive trigger hook on existing window.openGiftBox
    const originalOpen = window.openGiftBox;
    window.openGiftBox = function () {
      giftBox.classList.add('premium-shaking');

      if (window.SoundEngine) window.SoundEngine.play('giftOpening');

      setTimeout(() => {
        giftBox.classList.remove('premium-shaking');
        if (typeof originalOpen === 'function') originalOpen();
        triggerConfetti();
        if (window.GuideCharacter) window.GuideCharacter.speak('Yay! What a surprise! 🎉');
      }, 600);
    };
  }

  function triggerConfetti() {
    const fxCanvas = document.getElementById('fxCanvas');
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext('2d');
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }).map(() => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 12,
      color: ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2'][Math.floor(Math.random() * 4)],
      size: Math.random() * 8 + 4
    }));

    function draw() {
      ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      if (particles.some(p => p.y < window.innerHeight)) {
        requestAnimationFrame(draw);
      }
    }
    draw();
  }

  window.GiftBoxEnhancer = { init };
})();

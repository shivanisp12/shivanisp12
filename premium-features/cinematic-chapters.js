/* ==========================================================================
   FEATURE 5: CINEMATIC CHAPTER PRESENTATION
   ========================================================================== */
(function () {
  let overlayEl = null;

  function init() {
    createOverlay();
    observeChapters();
  }

  function createOverlay() {
    overlayEl = document.createElement('div');
    overlayEl.id = 'premiumCinematicOverlay';
    overlayEl.innerHTML = `
      <div class="cinematic-badge" id="cinematicBadge">CHAPTER REVEAL</div>
      <div class="cinematic-title" id="cinematicTitle">Chapter Title</div>
      <div class="cinematic-subtitle" id="cinematicSubtitle">Subtitle Details</div>
      <button class="cinematic-skip-btn" onclick="CinematicChapters.skip()">Skip Intro ➔</button>
    `;
    document.body.appendChild(overlayEl);
  }

  function playTransition(title, subtitle) {
    if (!overlayEl) return;
    document.getElementById('cinematicTitle').innerText = title;
    document.getElementById('cinematicSubtitle').innerText = subtitle || '';

    overlayEl.classList.add('active');
    if (window.SoundEngine) window.SoundEngine.play('chapterOpening');

    setTimeout(() => {
      skip();
    }, 2800);
  }

  function skip() {
    if (overlayEl) overlayEl.classList.remove('active');
  }

  function observeChapters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector('.section-title')?.innerText || 'Celebration Chapter';
          const subtitle = entry.target.querySelector('.section-subtitle')?.innerText || '';
          playTransition(title, subtitle);
          if (window.GuideCharacter) window.GuideCharacter.speak(`Welcome to ${title}! ✨`);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('.chapter-section').forEach(sec => observer.observe(sec));
  }

  window.CinematicChapters = {
    init,
    playTransition,
    skip
  };
})();

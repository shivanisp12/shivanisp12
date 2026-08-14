/* ==========================================================================
   FEATURE 5: CINEMATIC CHAPTER PRESENTATION (CI-COMPLIANT)
   ========================================================================== */
(function () {
  let overlayEl = null;

  function init() {
    if (typeof document === 'undefined') return;
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
      <button class="cinematic-skip-btn" id="cinematicSkipBtn">Skip Intro ➔</button>
    `;
    document.body.appendChild(overlayEl);

    const skipBtn = document.getElementById('cinematicSkipBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', skip);
    }
  }

  function playTransition(title, subtitle) {
    if (!overlayEl) return;
    
    const titleEl = document.getElementById('cinematicTitle');
    const subEl = document.getElementById('cinematicSubtitle');
    
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subtitle || '';

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
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const title = entry.target.querySelector('.section-title')?.textContent || 'Celebration Chapter';
          const subtitle = entry.target.querySelector('.section-subtitle')?.textContent || '';
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

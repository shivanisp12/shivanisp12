/* ==========================================================================
   FEATURE 3: INTERACTIVE GUIDE CHARACTER ENGINE
   ========================================================================== */
(function () {
  const mascots = {
    cat: `<svg viewBox="0 0 100 100" class="premium-guide-avatar"><circle cx="50" cy="55" r="35" fill="#ffb7c5"/><polygon points="20,30 35,5 45,35" fill="#ffb7c5"/><polygon points="80,30 65,5 55,35" fill="#ffb7c5"/><circle cx="38" cy="50" r="4" fill="#333"/><circle cx="62" cy="50" r="4" fill="#333"/><path d="M 45 62 Q 50 67 55 62" stroke="#333" stroke-width="3" fill="none"/></svg>`,
    puppy: `<svg viewBox="0 0 100 100" class="premium-guide-avatar"><circle cx="50" cy="55" r="35" fill="#d4a373"/><ellipse cx="18" cy="45" rx="12" ry="22" fill="#bc6c25"/><ellipse cx="82" cy="45" rx="12" ry="22" fill="#bc6c25"/><circle cx="38" cy="50" r="4" fill="#333"/><circle cx="62" cy="50" r="4" fill="#333"/><ellipse cx="50" cy="60" rx="6" ry="4" fill="#333"/></svg>`,
    cinnamoroll: `<svg viewBox="0 0 100 100" class="premium-guide-avatar"><ellipse cx="50" cy="60" rx="36" ry="26" fill="#ffffff"/><ellipse cx="15" cy="60" rx="16" ry="10" fill="#ffffff"/><ellipse cx="85" cy="60" rx="16" ry="10" fill="#ffffff"/><circle cx="38" cy="58" r="3" fill="#4a90e2"/><circle cx="62" cy="58" r="3" fill="#4a90e2"/><ellipse cx="28" cy="64" rx="4" ry="2" fill="#ffb7c5"/><ellipse cx="72" cy="64" rx="4" ry="2" fill="#ffb7c5"/></svg>`,
    fairy: `<svg viewBox="0 0 100 100" class="premium-guide-avatar"><path d="M 20 40 Q 50 10 80 40 Q 50 70 20 40" fill="#e0c3fc" opacity="0.7"/><circle cx="50" cy="50" r="24" fill="#ffdfba"/><circle cx="42" cy="48" r="3" fill="#333"/><circle cx="58" cy="48" r="3" fill="#333"/><path d="M 46 58 Q 50 62 54 58" stroke="#333" stroke-width="2" fill="none"/></svg>`,
    bunny: `<svg viewBox="0 0 100 100" class="premium-guide-avatar"><ellipse cx="38" cy="20" rx="7" ry="22" fill="#ffffff"/><ellipse cx="62" cy="20" rx="7" ry="22" fill="#ffffff"/><circle cx="50" cy="60" r="30" fill="#ffffff"/><circle cx="40" cy="55" r="3" fill="#333"/><circle cx="60" cy="55" r="3" fill="#333"/><polygon points="48,62 52,62 50,65" fill="#ffb7c5"/></svg>`
  };

  let state = {
    enabled: true,
    activeMascot: 'cat',
    container: null,
    speechEl: null,
    speechTimeout: null
  };

  function init() {
    createElements();
    loadConfig();
    bindInteractions();
  }

  function createElements() {
    state.container = document.createElement('div');
    state.container.id = 'premiumGuideContainer';
    state.container.innerHTML = `
      <div class="premium-guide-speech" id="premiumGuideSpeech">Hello! I am your celebration guide!</div>
      <div id="premiumGuideAvatarHolder">${mascots.cat}</div>
      <div class="premium-guide-controls">
        <button class="premium-guide-btn" onclick="GuideCharacter.toggleHide()">✕</button>
      </div>
    `;
    document.body.appendChild(state.container);
    state.speechEl = document.getElementById('premiumGuideSpeech');
  }

  function speak(message, duration = 4000) {
    if (!state.enabled || !state.speechEl) return;
    state.speechEl.innerText = message;
    state.speechEl.classList.add('visible');

    if (state.speechTimeout) clearTimeout(state.speechTimeout);
    state.speechTimeout = setTimeout(() => {
      state.speechEl.classList.remove('visible');
    }, duration);
  }

  function setMascot(name) {
    if (mascots[name]) {
      state.activeMascot = name;
      const holder = document.getElementById('premiumGuideAvatarHolder');
      if (holder) holder.innerHTML = mascots[name];
    }
  }

  function bindInteractions() {
    // Draggable logic
    let isDragging = false, offsetStartX = 0, offsetStartY = 0;

    state.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetStartX = e.clientX - state.container.offsetLeft;
      offsetStartY = e.clientY - state.container.offsetTop;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      state.container.style.left = `${e.clientX - offsetStartX}px`;
      state.container.style.top = `${e.clientY - offsetStartY}px`;
      state.container.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Click reaction
    state.container.addEventListener('click', () => {
      if (window.SoundEngine) window.SoundEngine.play('buttonClick');
      speak("I'm here cheering for you! ✨");
    });
  }

  function loadConfig() {
    try {
      const saved = localStorage.getItem('PREMIUM_GUIDE_CONFIG');
      if (saved) {
        const parsed = JSON.parse(saved);
        state.enabled = parsed.enabled !== false;
        setMascot(parsed.mascot || 'cat');
        if (!state.enabled) state.container.style.display = 'none';
      }
    } catch (e) {}
  }

  window.GuideCharacter = {
    init,
    speak,
    setMascot,
    toggleHide: () => {
      state.enabled = !state.enabled;
      state.container.style.display = state.enabled ? 'flex' : 'none';
    }
  };
})();

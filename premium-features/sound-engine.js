/* ==========================================================================
   FEATURE 2: UI SOUND EFFECTS ENGINE (Web Audio API Synthesizer)
   ========================================================================== */
(function () {
  let audioCtx = null;
  let enabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal = 0.1) {
    if (!enabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  const soundPack = {
    buttonClick: () => playTone(600, 'sine', 0.08, 0.08),
    cardOpen: () => {
      playTone(300, 'triangle', 0.15, 0.1);
      setTimeout(() => playTone(450, 'sine', 0.2, 0.1), 80);
    },
    pageTransition: () => playTone(250, 'sine', 0.3, 0.05),
    chapterOpening: () => {
      [300, 400, 500, 700].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.3, 0.08), i * 90);
      });
    },
    giftOpening: () => {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        setTimeout(() => playTone(f, 'triangle', 0.4, 0.12), i * 100);
      });
    },
    gameSuccess: () => {
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.25, 0.12), i * 80);
      });
    },
    gameFailure: () => {
      [300, 260, 220].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sawtooth', 0.2, 0.08), i * 100);
      });
    },
    timelineEvent: () => playTone(520, 'sine', 0.12, 0.06),
    wishSubmission: () => playTone(880, 'triangle', 0.3, 0.1),
    wishHanging: () => playTone(660, 'sine', 0.15, 0.08),
    surpriseAnimation: () => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => playTone(400 + i * 100, 'sine', 0.1, 0.05), i * 50);
      }
    },
    achievementUnlocked: () => {
      [523.25, 659.25, 783.99, 987.77, 1046.50].forEach((f, i) => {
        setTimeout(() => playTone(f, 'sine', 0.35, 0.12), i * 70);
      });
    }
  };

  function play(soundName) {
    if (soundPack[soundName]) {
      soundPack[soundName]();
    }
  }

  function setEnabled(val) {
    enabled = Boolean(val);
  }

  // Auto unlock AudioContext on user click
  window.addEventListener('click', () => getAudioContext(), { once: true });

  window.SoundEngine = {
    play,
    setEnabled,
    isEnabled: () => enabled
  };
})();

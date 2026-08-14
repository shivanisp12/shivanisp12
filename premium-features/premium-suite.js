/**
 * PREMIUM FEATURES SUITE - PRODUCTION READY MODULES
 * Append-only integration framework for custom interactive applications.
 */

window.PremiumSuite = (function () {
  'use strict';

  // State Management
  const state = {
    bgType: localStorage.getItem('pf_bg_type') || 'fireflies',
    bgUrl: localStorage.getItem('pf_bg_url') || '',
    soundEnabled: localStorage.getItem('pf_sound_enabled') !== 'false',
    guideEnabled: localStorage.getItem('pf_guide_enabled') !== 'false',
    guideMascot: localStorage.getItem('pf_guide_mascot') || 'cat',
    guideSize: localStorage.getItem('pf_guide_size') || '90',
    musicTrack: localStorage.getItem('pf_music_track') || 'romantic_piano',
    emailConfig: JSON.parse(localStorage.getItem('pf_email_config') || '{}')
  };

  /* ============================================================
     FEATURE 1: DYNAMIC BACKGROUND EXPERIENCE
     ============================================================ */
  const DynamicBackground = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: -1000, y: -1000 },
    animFrame: null,

    init() {
      let container = document.getElementById('pf-bg-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'pf-bg-container';
        document.body.prepend(container);
      }

      container.innerHTML = `
        <canvas id="pf-bg-canvas"></canvas>
        <video id="pf-bg-video" autoplay loop muted playsinline style="display:none;"></video>
      `;

      this.canvas = document.getElementById('pf-bg-canvas');
      this.ctx = this.canvas.getContext('2d');

      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      this.resize();
      this.applyBackground(state.bgType, state.bgUrl);
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initParticles();
    },

    initParticles() {
      this.particles = [];
      const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
      
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.3,
          alpha: Math.random(),
          decay: Math.random() * 0.02 + 0.005
        });
      }
    },

    applyBackground(type, customUrl = '') {
      state.bgType = type;
      state.bgUrl = customUrl;
      localStorage.setItem('pf_bg_type', type);
      localStorage.setItem('pf_bg_url', customUrl);

      const video = document.getElementById('pf-bg-video');
      if (type === 'video' && customUrl) {
        video.src = customUrl;
        video.style.display = 'block';
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        return;
      }
      video.style.display = 'none';

      if (this.animFrame) cancelAnimationFrame(this.animFrame);
      this.initParticles();
      this.render();
    },

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Soft cursor interactivity (repel)
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }

        // Wrap edges
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        // Draw depending on theme
        this.ctx.beginPath();
        if (state.bgType === 'hearts') {
          this.ctx.fillStyle = `rgba(255, 105, 180, ${p.alpha})`;
          this.ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
        } else if (state.bgType === 'snow') {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        } else {
          // Default Fireflies / Petals
          this.ctx.fillStyle = `rgba(255, 223, 128, ${p.alpha})`;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#ffd700';
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      });

      this.animFrame = requestAnimationFrame(() => this.render());
    }
  };

  /* ============================================================
     FEATURE 2: UI SOUND EFFECTS SYNTHESIZER
     ============================================================ */
  const SoundEngine = {
    audioCtx: null,

    getAudioContext() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    },

    play(effect) {
      if (!state.soundEnabled) return;
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (effect) {
          case 'click':
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

          case 'success':
          case 'gift':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;

          case 'achievement':
            // Chord chime
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.type = 'sine';
              o.frequency.value = freq;
              o.connect(g);
              g.connect(ctx.destination);
              g.gain.setValueAtTime(0.15, now + idx * 0.08);
              g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
              o.start(now + idx * 0.08);
              o.stop(now + idx * 0.08 + 0.4);
            });
            break;
        }
      } catch (e) {
        console.warn('Audio synthesis initialized on user touch.');
      }
    }
  };

  /* ============================================================
     FEATURE 3: INTERACTIVE GUIDE CHARACTER
     ============================================================ */
  const GuideCharacter = {
    element: null,
    bubble: null,
    mascots: {
      cat: '🐱',
      puppy: '🐶',
      bunny: '🐰',
      fox: '🦊',
      fairy: '🧚‍♀️',
      bear: '🧸',
      owl: '🦉'
    },

    init() {
      if (document.getElementById('pf-guide-mascot')) return;

      this.element = document.createElement('div');
      this.element.id = 'pf-guide-mascot';
      
      this.bubble = document.createElement('div');
      this.bubble.id = 'pf-guide-bubble';

      document.body.appendChild(this.element);
      document.body.appendChild(this.bubble);

      this.updateCharacter();
      this.setupEvents();

      // Greeting
      setTimeout(() => {
        this.say("Hi there! I'm your interactive guide. Enjoy the experience! ✨");
      }, 1500);
    },

    updateCharacter() {
      if (!state.guideEnabled) {
        if (this.element) this.element.style.display = 'none';
        if (this.bubble) this.bubble.style.display = 'none';
        return;
      }
      this.element.style.display = 'flex';
      this.element.style.alignItems = 'center';
      this.element.style.justifyContent = 'center';
      this.element.style.fontSize = `${state.guideSize * 0.6}px`;
      this.element.style.width = `${state.guideSize}px`;
      this.element.style.height = `${state.guideSize}px`;
      this.element.innerText = this.mascots[state.guideMascot] || '🐱';
    },

    setupEvents() {
      // Click interaction
      this.element.addEventListener('click', () => {
        SoundEngine.play('click');
        this.animateBounce();
        this.say("I'm here to guide you through every chapter!");
      });

      // Draggable logic
      let isDragging = false;
      let offsetX, offsetY;

      this.element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - this.element.offsetLeft;
        offsetY = e.clientY - this.element.offsetTop;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        this.element.style.left = `${e.clientX - offsetX}px`;
        this.element.style.top = `${e.clientY - offsetY}px`;
        this.element.style.bottom = 'auto';
        this.element.style.right = 'auto';
      });

      window.addEventListener('mouseup', () => { isDragging = false; });
    },

    say(text, duration = 4000) {
      if (!state.guideEnabled) return;
      this.bubble.innerText = text;
      this.bubble.classList.add('pf-visible');
      setTimeout(() => {
        this.bubble.classList.remove('pf-visible');
      }, duration);
    },

    animateBounce() {
      this.element.style.transform = 'scale(1.2) translateY(-10px)';
      setTimeout(() => {
        this.element.style.transform = 'scale(1) translateY(0)';
      }, 200);
    }
  };

  /* ============================================================
     FEATURE 4: ADVANCED BACKGROUND MUSIC LIBRARY
     ============================================================ */
  const MusicLibrary = {
    audio: new Audio(),
    tracks: {
      romantic_piano: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      birthday_orchestra: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73151.mp3',
      relaxing_nature: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8835848c48.mp3'
    },

    init() {
      this.audio.loop = true;
      if (state.musicTrack && this.tracks[state.musicTrack]) {
        this.audio.src = this.tracks[state.musicTrack];
      }
      
      // Auto play on first user touch
      const playOnInteraction = () => {
        this.audio.play().catch(() => {});
        window.removeEventListener('click', playOnInteraction);
      };
      window.addEventListener('click', playOnInteraction);
    },

    setTrack(trackKey, customUrl = '') {
      state.musicTrack = trackKey;
      localStorage.setItem('pf_music_track', trackKey);
      const url = customUrl || this.tracks[trackKey];
      if (url) {
        this.audio.src = url;
        this.audio.play();
      }
    }
  };

  /* ============================================================
     FEATURE 5: CINEMATIC CHAPTER PRESENTATION
     ============================================================ */
  const CinematicPresentation = {
    overlay: null,

    init() {
      this.overlay = document.createElement('div');
      this.overlay.id = 'pf-cinematic-overlay';
      this.overlay.innerHTML = `
        <div class="pf-cinematic-title" id="pf-chapter-title">Chapter Entrance</div>
        <button class="pf-skip-btn" onclick="PremiumSuite.Cinematic.skip()">Skip</button>
      `;
      document.body.appendChild(this.overlay);
    },

    play(chapterTitle, onComplete) {
      SoundEngine.play('achievement');
      const titleEl = document.getElementById('pf-chapter-title');
      titleEl.innerText = chapterTitle;
      this.overlay.classList.add('pf-active');

      this.timer = setTimeout(() => {
        this.skip(onComplete);
      }, 3500);
      this.onComplete = onComplete;
    },

    skip(cb) {
      if (this.timer) clearTimeout(this.timer);
      this.overlay.classList.remove('pf-active');
      const callback = cb || this.onComplete;
      if (callback) callback();
    }
  };

  /* ============================================================
     FEATURE 6: PREMIUM GIFT BOX EXPERIENCE
     ============================================================ */
  const GiftBoxEnhancer = {
    attach(elementSelector) {
      const targets = document.querySelectorAll(elementSelector);
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.05) rotate(2deg)';
          el.style.transition = 'transform 0.2s ease';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1) rotate(0deg)';
        });
        el.addEventListener('click', () => {
          SoundEngine.play('gift');
          GuideCharacter.say("Yay! You opened a surprise gift! 🎁");
        });
      });
    }
  };

  /* ============================================================
     FEATURE 7: COMPLETE GAME EXPERIENCE WRAPPER
     ============================================================ */
  const MiniGameEnhancer = {
    notifyWin(gameName, score) {
      SoundEngine.play('achievement');
      GuideCharacter.say(`Awesome! You finished ${gameName} with a score of ${score}! 🎉`);
      EmailNotifications.sendTrigger('Game Completed', { gameName, score });
    },
    notifyLose(gameName) {
      GuideCharacter.say(`Nice try! Don't give up on ${gameName}! 💪`);
    }
  };

  /* ============================================================
     FEATURE 8 & 9: OWNER EMAIL NOTIFICATIONS & TIME CAPSULE
     ============================================================ */
  const EmailNotifications = {
    sendTrigger(eventName, details = {}) {
      const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        details: details
      };

      // Integration point for Webhook / EmailJS / Custom Backend API
      if (state.emailConfig.webhookUrl) {
        fetch(state.emailConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch((err) => console.warn('Email Dispatch Exception:', err));
      }
    },

    scheduleTimeCapsuleCheck(targetDateStr) {
      const targetDate = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const timeDiff = targetDate - now;

      if (timeDiff > 0 && timeDiff < 86400000) {
        // Less than 24 hours remaining
        this.sendTrigger('Time Capsule Opening Soon', { unlockDate: targetDateStr });
      }
    }
  };

  /* ============================================================
     PUBLIC API EXPOSURE
     ============================================================ */
  return {
    init() {
      DynamicBackground.init();
      SoundEngine.getAudioContext();
      GuideCharacter.init();
      MusicLibrary.init();
      CinematicPresentation.init();
      
      // Auto-attach sound effects to standard button clicks without breaking existing handlers
      document.body.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .clickable')) {
          SoundEngine.play('click');
        }
      });
    },
    Background: DynamicBackground,
    Sound: SoundEngine,
    Guide: GuideCharacter,
    Music: MusicLibrary,
    Cinematic: CinematicPresentation,
    GiftBox: GiftBoxEnhancer,
    Games: MiniGameEnhancer,
    Notifications: EmailNotifications
  };
})();

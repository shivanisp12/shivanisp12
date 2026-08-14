/* ==========================================================================
   FEATURE 1: DYNAMIC BACKGROUND EXPERIENCE
   ========================================================================== */
(function () {
  const state = {
    mode: 'particles', // static, animated, particles, video, customImage, customVideo
    particleType: 'fireflies', // fireflies, petals, hearts, snow, rain, sparkles, bubbles, stars
    particles: [],
    mouse: { x: -1000, y: -1000, targetX: -1000, targetY: -1000 },
    canvas: null,
    ctx: null,
    animFrame: null,
    videoEl: null
  };

  function init() {
    createCanvas();
    bindEvents();
    loadConfig();
    startAnimation();
  }

  function createCanvas() {
    state.canvas = document.createElement('canvas');
    state.canvas.id = 'premiumBgCanvas';
    document.body.prepend(state.canvas);
    state.ctx = state.canvas.getContext('2d');
    resizeCanvas();
  }

  function resizeCanvas() {
    if (!state.canvas) return;
    state.canvas.width = window.innerWidth;
    state.canvas.height = window.innerHeight;
    initParticles();
  }

  function bindEvents() {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      state.mouse.targetX = e.clientX;
      state.mouse.targetY = e.clientY;
    });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        state.mouse.targetX = e.touches[0].clientX;
        state.mouse.targetY = e.touches[0].clientY;
      }
    });
  }

  function initParticles() {
    state.particles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    for (let i = 0; i < count; i++) {
      state.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 4 + 2,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.05,
        color: getRandomColor()
      });
    }
  }

  function getRandomColor() {
    const types = {
      fireflies: ['#ffea00', '#ffae00', '#76ff03'],
      petals: ['#ffb7c5', '#ff69b4', '#ff1493'],
      hearts: ['#ff4d6d', '#ff758f', '#c9184a'],
      snow: ['#ffffff', '#e0f7fa'],
      bubbles: ['rgba(255,255,255,0.6)', 'rgba(173,216,230,0.6)'],
      stars: ['#ffffff', '#fff59d', '#80deea']
    };
    const list = types[state.particleType] || types.fireflies;
    return list[Math.floor(Math.random() * list.length)];
  }

  function updateParticles() {
    // Smooth mouse lerp
    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;

    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion/attraction reactivity
      const dx = state.mouse.x - p.x;
      const dy = state.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= (dx / dist) * 1.5;
        p.y -= (dy / dist) * 1.5;
      }

      // Boundary wrap
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;
    });
  }

  function render() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    if (state.mode === 'particles') {
      state.particles.forEach(p => {
        state.ctx.save();
        state.ctx.globalAlpha = p.alpha;
        state.ctx.fillStyle = p.color;
        state.ctx.beginPath();
        if (state.particleType === 'hearts') {
          drawHeart(state.ctx, p.x, p.y, p.size);
        } else {
          state.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        state.ctx.fill();
        state.ctx.restore();
      });
    }

    updateParticles();
    state.animFrame = requestAnimationFrame(render);
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 3, x, y + size * 1.5);
    ctx.bezierCurveTo(x + size * 2, y + size / 3, x + size, y - size, x, y);
  }

  function startAnimation() {
    if (!state.animFrame) render();
  }

  function setBackgroundMode(mode, options = {}) {
    state.mode = mode;
    if (options.particleType) state.particleType = options.particleType;
    initParticles();

    // Video Background handle
    if (mode === 'video' || mode === 'customVideo') {
      if (!state.videoEl) {
        state.videoEl = document.createElement('video');
        state.videoEl.className = 'premium-bg-video';
        state.videoEl.autoplay = true;
        state.videoEl.loop = true;
        state.videoEl.muted = true;
        state.videoEl.playsInline = true;
        document.body.prepend(state.videoEl);
      }
      state.videoEl.src = options.url || '';
      state.videoEl.style.display = 'block';
    } else if (state.videoEl) {
      state.videoEl.style.display = 'none';
    }
  }

  function loadConfig() {
    try {
      const saved = localStorage.getItem('PREMIUM_BG_CONFIG');
      if (saved) {
        const parsed = JSON.parse(saved);
        setBackgroundMode(parsed.mode, parsed);
      }
    } catch (e) {}
  }

  window.PremiumBackground = {
    init,
    setBackgroundMode
  };
})();

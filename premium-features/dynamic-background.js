/* ==========================================================================
   ADVANCED 3D PROCEDURAL FLOWER & PETAL ENGINE
   ========================================================================== */
(function () {
  const state = {
    canvas: null,
    ctx: null,
    petals: [],
    flowerType: 'sakura3d', // sakura3d, rose3d, neonOrchid, goldenBlossom
    mouse: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 },
    animFrame: null,
    fov: 300, // 3D Field of View Depth
    maxPetals: 65
  };

  function init() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    createCanvas();
    bindEvents();
    init3DPetals();
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
  }

  function bindEvents() {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      state.mouse.vx = e.clientX - state.mouse.lastX;
      state.mouse.vy = e.clientY - state.mouse.lastY;
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.mouse.lastX = e.clientX;
      state.mouse.lastY = e.clientY;
    });
  }

  function create3DPetal() {
    return {
      // 3D Coordinates
      x: (Math.random() - 0.5) * window.innerWidth * 1.5,
      y: -Math.random() * window.innerHeight - 50,
      z: Math.random() * 800 - 200, // Depth axis
      
      // 3D Angles & Angular Velocities
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 0.03,
      vRotY: (Math.random() - 0.5) * 0.03,
      vRotZ: (Math.random() - 0.5) * 0.02,

      // Physics & Drift
      vy: Math.random() * 1.5 + 0.8,
      vx: Math.random() * 0.8 - 0.4,
      swayFreq: Math.random() * 0.02 + 0.01,
      swayAmp: Math.random() * 1.2 + 0.5,
      size: Math.random() * 14 + 10,
      
      // Aesthetics
      opacity: Math.random() * 0.4 + 0.6,
      flowerVariant: Math.floor(Math.random() * 3)
    };
  }

  function init3DPetals() {
    state.petals = [];
    for (let i = 0; i < state.maxPetals; i++) {
      const petal = create3DPetal();
      petal.y = Math.random() * window.innerHeight; // Initial scatter
      state.petals.push(petal);
    }
  }

  // Render procedural organic 3D petal mesh with lighting & depth gradients
  function draw3DPetal(ctx, petal, scale, posX, posY) {
    ctx.save();
    ctx.translate(posX, posY);

    // Apply 3D Matrix Transformations
    ctx.rotate(petal.rotZ);
    ctx.scale(Math.cos(petal.rotY) * scale, Math.sin(petal.rotX) * scale);

    const s = petal.size;
    const gradient = ctx.createLinearGradient(-s / 2, -s, s / 2, s);

    if (state.flowerType === 'neonOrchid') {
      gradient.addColorStop(0, '#ff007f');
      gradient.addColorStop(0.5, '#7928ca');
      gradient.addColorStop(1, '#00dfd8');
    } else if (state.flowerType === 'goldenBlossom') {
      gradient.addColorStop(0, '#ffe259');
      gradient.addColorStop(0.5, '#ffa751');
      gradient.addColorStop(1, '#ff512f');
    } else if (state.flowerType === 'rose3d') {
      gradient.addColorStop(0, '#ff0844');
      gradient.addColorStop(0.6, '#ffb199');
      gradient.addColorStop(1, '#800020');
    } else { // Sakura 3D High-Tech
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.4, '#ffb7c5');
      gradient.addColorStop(1, '#ff4d6d');
    }

    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(255, 182, 193, 0.4)';
    ctx.shadowBlur = 12 * scale;

    // Organic 3D Petal Path
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.8, -s * 0.8, s * 0.9, s * 0.3, 0, s);
    ctx.bezierCurveTo(-s * 0.9, s * 0.3, -s * 0.8, -s * 0.8, 0, -s);
    ctx.closePath();
    ctx.fill();

    // High-tech center vein detail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.lineTo(0, s * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  function updateAndRender() {
    if (!state.ctx) return;
    const ctx = state.ctx;
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Sort petals by 3D Z-index for realistic depth rendering
    state.petals.sort((a, b) => a.z - b.z);

    state.petals.forEach(p => {
      // 3D Motion Updates
      p.rotX += p.vRotX;
      p.rotY += p.vRotY;
      p.rotZ += p.vRotZ;

      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y * p.swayFreq) * p.swayAmp;

      // Mouse interactive gust force
      const dx = (p.x + centerX) - state.mouse.x;
      const dy = p.y - state.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.x += (dx / dist) * 3;
        p.y += (dy / dist) * 3;
        p.vRotX += 0.05;
      }

      // 3D Perspective Projection Formulas
      const scale = state.fov / (state.fov + p.z);
      const projX = p.x * scale + centerX;
      const projY = p.y * scale;

      // Depth Blur Effect
      const blurAmount = Math.abs(p.z) > 400 ? 3 : 0;
      ctx.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : 'none';
      ctx.globalAlpha = Math.min(1, Math.max(0.2, p.opacity * scale));

      draw3DPetal(ctx, p, scale, projX, projY);

      // Boundary Reset
      if (p.y > window.innerHeight + 100 || projX < -100 || projX > window.innerWidth + 100) {
        Object.assign(p, create3DPetal());
      }
    });

    ctx.filter = 'none';
    state.animFrame = requestAnimationFrame(updateAndRender);
  }

  function startAnimation() {
    if (!state.animFrame) updateAndRender();
  }

  function setFlowerTheme(theme) {
    state.flowerType = theme;
  }

  window.PremiumBackground = {
    init,
    setFlowerTheme
  };
})();

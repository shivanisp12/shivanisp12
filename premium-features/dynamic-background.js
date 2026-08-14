/**
 * Celebration Verse - Dynamic WebGL/Canvas Ambient Particle Engine
 */
class DynamicBackgroundEngine {
  constructor() {
    this.canvas = document.getElementById('bgCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 60;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 3 + 1,
        color: `hsla(${Math.random() * 60 + 320}, 100%, 75%, ${Math.random() * 0.5 + 0.3})`,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 0.8 + 0.3,
        rotation: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += 0.01;

      if (p.y > window.innerHeight) {
        p.y = -10;
        p.x = Math.random() * window.innerWidth;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.DynamicBackgroundEngine = DynamicBackgroundEngine;

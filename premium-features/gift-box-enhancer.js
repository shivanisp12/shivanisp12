/**
 * Celebration Verse - Three.js Interactive 3D Gift Box
 */
class GiftBox3DEnhancer {
  constructor() {
    this.container = document.getElementById('giftBox3DContainer');
    if (!this.container || typeof THREE === 'undefined') return;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // Cube Geometry (Gift Box)
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xff4081, shininess: 100 });
    this.boxMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.boxMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);

    this.animate();

    // Click trigger
    this.container.addEventListener('click', () => this.openBox());
  }

  openBox() {
    gsap.to(this.boxMesh.rotation, { y: Math.PI * 4, duration: 1.5 });
    gsap.to(this.boxMesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.5, yoyo: true, repeat: 1 });
    if (window.celebrationAudio) window.celebrationAudio.playFanfare();
    
    const msg = document.getElementById('giftBoxMessage');
    if (msg) msg.classList.remove('hidden');
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.boxMesh.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
  }
}

window.GiftBox3DEnhancer = GiftBox3DEnhancer;

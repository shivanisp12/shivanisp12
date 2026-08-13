/* ==================================================================================
   BULLETPROOF BACKGROUND MUSIC & SAKURA ENGINE FOR CELEBRATION VERSE
   ================================================================================== */

/* --- MODULE 1: SAKURA PETALS VISUAL LAYER --- */
(function initSakuraWishTreeLayer() {
    function setupSakuraLayer() {
        const treeWrap = document.querySelector('.tree-canvas-wrap');
        if (!treeWrap) return;

        treeWrap.style.position = 'relative';

        let sakuraCanvas = document.getElementById('sakuraLayerCanvas');
        if (!sakuraCanvas) {
            sakuraCanvas = document.createElement('canvas');
            sakuraCanvas.id = 'sakuraLayerCanvas';
            sakuraCanvas.style.position = 'absolute';
            sakuraCanvas.style.top = '0';
            sakuraCanvas.style.left = '0';
            sakuraCanvas.style.width = '100%';
            sakuraCanvas.style.height = '100%';
            sakuraCanvas.style.pointerEvents = 'none';
            sakuraCanvas.style.zIndex = '0';
            treeWrap.insertBefore(sakuraCanvas, treeWrap.firstChild);
        }

        const ctx = sakuraCanvas.getContext('2d');
        let width, height;

        function resize() {
            width = sakuraCanvas.width = treeWrap.clientWidth || 600;
            height = sakuraCanvas.height = treeWrap.clientHeight || 350;
        }
        resize();
        window.addEventListener('resize', resize);

        const petalCanvas = document.createElement('canvas');
        petalCanvas.width = 32;
        petalCanvas.height = 32;
        const pCtx = petalCanvas.getContext('2d');
        pCtx.beginPath();
        pCtx.moveTo(16, 0);
        pCtx.bezierCurveTo(30, 2, 32, 20, 16, 32);
        pCtx.bezierCurveTo(0, 20, 2, 2, 16, 0);
        const grad = pCtx.createLinearGradient(0, 0, 32, 32);
        grad.addColorStop(0, 'rgba(255, 183, 197, 0.95)');
        grad.addColorStop(0.7, 'rgba(255, 105, 180, 0.85)');
        grad.addColorStop(1, 'rgba(219, 39, 119, 0.7)');
        pCtx.fillStyle = grad;
        pCtx.fill();

        const PETAL_COUNT = 40;
        const petals = [];

        for (let i = 0; i < PETAL_COUNT; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 10 + Math.random() * 12,
                speedY: 0.6 + Math.random() * 1.0,
                speedX: -0.4 + Math.random() * 0.8,
                opacity: 0.5 + Math.random() * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.03,
                oscSpeed: 0.01 + Math.random() * 0.02,
                oscAmp: 0.8 + Math.random() * 1.5,
                step: Math.random() * Math.PI * 2
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < petals.length; i++) {
                const p = petals[i];
                p.step += p.oscSpeed;
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(p.step) * p.oscAmp;
                p.rotation += p.rotSpeed;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.opacity;
                ctx.drawImage(petalCanvas, -p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }

            requestAnimationFrame(render);
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSakuraLayer);
    } else {
        setupSakuraLayer();
    }
})();


/* --- MODULE 2: INDEXEDDB STORAGE FOR UPLOADS --- */
const MusicDB = {
    dbName: 'CelebrationMusicDB',
    storeName: 'tracks',
    
    open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            req.onsuccess = (e) => resolve(e.target.result);
            req.onerror = (e) => reject(e.target.error);
        });
    },

    async saveTrack(key, fileOrBlob) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).put(fileOrBlob, key);
                tx.oncomplete = () => resolve(true);
                tx.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.warn('IndexedDB Save Error:', err);
        }
    },

    async getTrack(key) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readonly');
                const req = tx.objectStore(this.storeName).get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.warn('IndexedDB Get Error:', err);
            return null;
        }
    },

    async deleteTrack(key) {
        try {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).delete(key);
                tx.oncomplete = () => resolve(true);
                tx.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.warn('IndexedDB Delete Error:', err);
        }
    }
};


/* --- MODULE 3: MUSIC ENGINE --- */
class BackgroundMusicEngine {
    constructor() {
        this.config = {
            enabled: false,
            sourceType: 'none',
            url: '',
            youtubeUrl: '',
            fileName: '',
            volume: 0.7,
            loop: true
        };

        this.audioEl = null;
        this.videoEl = null;
        this.activeBlobUrl = null;

        this.loadSettings();
        this.initElements();
    }

    loadSettings() {
        const saved = localStorage.getItem('celebration_bg_music_cfg');
        if (saved) {
            try { Object.assign(this.config, JSON.parse(saved)); } catch (e) {}
        }
    }

    saveSettings() {
        localStorage.setItem('celebration_bg_music_cfg', JSON.stringify(this.config));
    }

    initElements() {
        this.audioEl = document.getElementById('bgAudioPlayer') || document.createElement('audio');
        this.audioEl.id = 'bgAudioPlayer';
        this.audioEl.style.display = 'none';
        if (!document.body.contains(this.audioEl)) document.body.appendChild(this.audioEl);

        this.videoEl = document.getElementById('bgVideoPlayer') || document.createElement('video');
        this.videoEl.id = 'bgVideoPlayer';
        this.videoEl.style.display = 'none';
        this.videoEl.playsInline = true;
        if (!document.body.contains(this.videoEl)) document.body.appendChild(this.videoEl);
    }

    stopAll() {
        if (this.audioEl) { this.audioEl.pause(); this.audioEl.currentTime = 0; }
        if (this.videoEl) { this.videoEl.pause(); this.videoEl.currentTime = 0; }
    }

    pauseAll() {
        if (this.audioEl) this.audioEl.pause();
        if (this.videoEl) this.videoEl.pause();
    }

    setVolume(vol) {
        this.config.volume = parseFloat(vol);
        if (this.audioEl) this.audioEl.volume = this.config.volume;
        if (this.videoEl) this.videoEl.volume = this.config.volume;
        this.saveSettings();
    }

    async play() {
        this.stopAll();
        if (!this.config.enabled) return;

        try {
            if (this.config.sourceType === 'upload_audio' || this.config.sourceType === 'upload_video') {
                const blob = await MusicDB.getTrack('uploaded_media');
                if (blob) {
                    if (this.activeBlobUrl) URL.revokeObjectURL(this.activeBlobUrl);
                    this.activeBlobUrl = URL.createObjectURL(blob);

                    const player = (this.config.sourceType === 'upload_audio') ? this.audioEl : this.videoEl;
                    player.src = this.activeBlobUrl;
                    player.volume = this.config.volume;
                    player.loop = this.config.loop;
                    await player.play();
                } else {
                    alert('Please select and upload an audio file first!');
                }
            } else if (this.config.sourceType === 'audio_url') {
                if (!this.config.url) return;
                this.audioEl.src = this.config.url;
                this.audioEl.volume = this.config.volume;
                this.audioEl.loop = this.config.loop;
                await this.audioEl.play();
            }
        } catch (err) {
            console.warn('Autoplay blocked or playback error:', err);
            // Click listener fallback
            const handleUserClick = () => {
                this.play();
                window.removeEventListener('click', handleUserClick);
            };
            window.addEventListener('click', handleUserClick);
        }
    }
}

window.bgMusicEngine = new BackgroundMusicEngine();


/* --- MODULE 4: DYNAMIC UI INJECTION --- */
(function injectUI() {
    function setupPanel() {
        const modal = document.getElementById('creatorModal');
        if (!modal) return;

        const tabGroup = modal.querySelector('.tab-btn-group') || modal.querySelector('.tab-buttons') || modal.querySelector('.nav-tabs');
        const panelContainer = modal.querySelector('.creator-panel') || modal.querySelector('.modal-body') || modal;

        if (!tabGroup || !panelContainer) return;
        if (document.getElementById('btnTabBgMusic')) return;

        // Create Tab Button
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab-btn';
        tabBtn.id = 'btnTabBgMusic';
        tabBtn.type = 'button';
        tabBtn.innerText = '🎵 Music';
        tabGroup.appendChild(tabBtn);

        // Create Panel Container
        const panelDiv = document.createElement('div');
        panelDiv.id = 'tabBgMusic';
        panelDiv.className = 'tab-content';
        panelDiv.style.display = 'none';

        panelDiv.innerHTML = `
            <div style="background: #fff; padding: 1.2rem; border-radius: 12px; margin-top: 0.5rem; border: 1px solid #e2e8f0;">
                <h3 style="margin-top:0; color: #db2777; font-size: 1.1rem;">🎵 Background Music Setup</h3>
                
                <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="bgmEnable" style="width: 18px; height: 18px;" />
                    <label for="bgmEnable" style="font-weight: bold; cursor: pointer;">Enable Background Music</label>
                </div>

                <div id="bgmStatusBadge" style="padding: 0.5rem; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem; color: #475569;">
                    Status: No file selected
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display:block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.3rem;">Upload Audio File (MP3, WAV, AAC)</label>
                    <input type="file" id="bgmFileInput" accept="audio/*" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; border-radius: 6px;" />
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display:block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.3rem;">OR Direct Audio URL</label>
                    <input type="url" id="bgmUrlInput" placeholder="https://example.com/music.mp3" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px;" />
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="font-size: 0.85rem; font-weight: bold;">Volume: <span id="bgmVolLabel">70</span>%</label>
                    <input type="range" id="bgmVolRange" min="0" max="1" step="0.05" value="0.7" style="width:100%;" />
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" id="bgmBtnPlayNow" style="padding: 0.5rem 1rem; background: #db2777; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">▶ Play</button>
                    <button type="button" id="bgmBtnPauseNow" style="padding: 0.5rem 1rem; background: #64748b; color: #fff; border: none; border-radius: 6px; cursor: pointer;">⏸ Pause</button>
                    <button type="button" id="bgmBtnSaveConfig" style="padding: 0.5rem 1rem; background: #16a34a; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">💾 Save Settings</button>
                </div>
            </div>
        `;

        panelContainer.appendChild(panelDiv);

        // BULLETPROOF TAB SWITCHER
        tabBtn.onclick = (e) => {
            e.preventDefault();
            // Hide all tabs inside modal
            const allTabs = panelContainer.querySelectorAll('.tab-content');
            allTabs.forEach(t => t.style.display = 'none');

            const allBtns = tabGroup.querySelectorAll('.tab-btn');
            allBtns.forEach(b => b.classList.remove('active'));

            // Show music panel
            panelDiv.style.display = 'block';
            tabBtn.classList.add('active');
        };

        // UI Event Listeners
        const engine = window.bgMusicEngine;
        const enableCb = document.getElementById('bgmEnable');
        const fileInput = document.getElementById('bgmFileInput');
        const urlInput = document.getElementById('bgmUrlInput');
        const volRange = document.getElementById('bgmVolRange');
        const volLabel = document.getElementById('bgmVolLabel');
        const statusBadge = document.getElementById('bgmStatusBadge');

        // Sync initial UI
        enableCb.checked = engine.config.enabled;
        urlInput.value = engine.config.url || '';
        volRange.value = engine.config.volume;
        volLabel.innerText = Math.round(engine.config.volume * 100);
        if (engine.config.fileName) {
            statusBadge.innerText = `Active File: ${engine.config.fileName}`;
        }

        volRange.oninput = (e) => {
            volLabel.innerText = Math.round(e.target.value * 100);
            engine.setVolume(e.target.value);
        };

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                await MusicDB.saveTrack('uploaded_media', file);
                engine.config.sourceType = 'upload_audio';
                engine.config.fileName = file.name;
                engine.config.enabled = true;
                enableCb.checked = true;
                engine.saveSettings();
                statusBadge.innerText = `Uploaded: ${file.name}`;
                engine.play();
            }
        };

        document.getElementById('bgmBtnPlayNow').onclick = () => {
            engine.config.enabled = true;
            enableCb.checked = true;
            if (urlInput.value.trim()) {
                engine.config.sourceType = 'audio_url';
                engine.config.url = urlInput.value.trim();
            }
            engine.saveSettings();
            engine.play();
        };

        document.getElementById('bgmBtnPauseNow').onclick = () => {
            engine.pauseAll();
        };

        document.getElementById('bgmBtnSaveConfig').onclick = () => {
            engine.config.enabled = enableCb.checked;
            if (urlInput.value.trim()) {
                engine.config.sourceType = 'audio_url';
                engine.config.url = urlInput.value.trim();
            }
            engine.saveSettings();
            if (engine.config.enabled) engine.play();
            else engine.stopAll();
            alert('Music Settings Saved!');
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPanel);
    } else {
        setupPanel();
    }
})();

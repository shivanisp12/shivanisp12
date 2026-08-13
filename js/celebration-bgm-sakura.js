/* ==================================================================================
   MODULE 1: PREMIUM ANIMATED SAKURA VISUAL LAYER FOR WISH TREE
   ================================================================================== */
(function initSakuraWishTreeLayer() {
    function setupSakuraLayer() {
        const treeWrap = document.querySelector('.tree-canvas-wrap');
        if (!treeWrap) return;

        // Ensure canvas wrapper styling allows layering
        treeWrap.style.position = 'relative';

        // Check if Sakura overlay canvas already exists
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
            sakuraCanvas.style.zIndex = '0'; // Behind wish interaction layer
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

        // Pre-render offscreen realistic Sakura Petal
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

        // Particle System
        const PETAL_COUNT = 45;
        const petals = [];

        for (let i = 0; i < PETAL_COUNT; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 10 + Math.random() * 14,
                speedY: 0.6 + Math.random() * 1.2,
                speedX: -0.4 + Math.random() * 0.8,
                opacity: 0.5 + Math.random() * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.03,
                oscSpeed: 0.01 + Math.random() * 0.02,
                oscAmp: 0.8 + Math.random() * 1.5,
                step: Math.random() * Math.PI * 2
            });
        }

        function drawSakuraTreeBackground() {
            // Draws an aesthetic ambient Sakura silhouette backdrop on the canvas
            ctx.save();
            ctx.globalAlpha = 0.15;
            const treeGrad = ctx.createRadialGradient(width/2, height, 10, width/2, height, height);
            treeGrad.addColorStop(0, '#fbcfe8');
            treeGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = treeGrad;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            drawSakuraTreeBackground();

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
                if (p.x > width + 20) p.x = -20;
                if (p.x < -20) p.x = width + 20;

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


/* ==================================================================================
   MODULE 2: INDEXEDDB PERSISTENCE FOR UPLOADED MEDIA
   ================================================================================== */
const MusicDB = {
    dbName: 'CelebrationVerseMusicDB',
    storeName: 'media_tracks',
    
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


/* ==================================================================================
   MODULE 3: BACKGROUND MUSIC MANAGER ENGINE
   ================================================================================== */
class BackgroundMusicEngine {
    constructor() {
        this.config = {
            enabled: false,
            sourceType: 'none', // 'upload_audio', 'upload_video', 'audio_url', 'video_url', 'youtube'
            url: '',
            youtubeUrl: '',
            fileName: '',
            volume: 0.7,
            loop: true,
            autoplay: true
        };

        this.audioEl = null;
        this.videoEl = null;
        this.ytPlayer = null;
        this.ytReady = false;
        this.activeObjectUrl = null;

        this.loadSettings();
        this.initDOMMediaElements();
        this.loadYouTubeAPI();
    }

    loadSettings() {
        const saved = localStorage.getItem('celebration_bg_music_cfg');
        if (saved) {
            try {
                Object.assign(this.config, JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse music settings', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('celebration_bg_music_cfg', JSON.stringify(this.config));
    }

    initDOMMediaElements() {
        // Create hidden audio player
        this.audioEl = document.createElement('audio');
        this.audioEl.id = 'bgAudioPlayer';
        this.audioEl.style.display = 'none';
        document.body.appendChild(this.audioEl);

        // Create hidden video player (only audio track will be played)
        this.videoEl = document.createElement('video');
        this.videoEl.id = 'bgVideoPlayer';
        this.videoEl.style.display = 'none';
        this.videoEl.playsInline = true;
        document.body.appendChild(this.videoEl);

        // Bind events
        [this.audioEl, this.videoEl].forEach(media => {
            media.addEventListener('ended', () => {
                if (this.config.loop && this.config.enabled) {
                    media.currentTime = 0;
                    media.play().catch(() => {});
                }
            });
        });
    }

    loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.initYouTubePlayer();
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);

        window.onYouTubeIframeAPIReady = () => {
            this.initYouTubePlayer();
        };
    }

    initYouTubePlayer() {
        let container = document.getElementById('ytPlayerContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ytPlayerContainer';
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '1px';
            container.style.height = '1px';
            container.style.opacity = '0';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);
        }

        const playerDiv = document.createElement('div');
        playerDiv.id = 'ytMusicIframe';
        container.appendChild(playerDiv);

        this.ytPlayer = new YT.Player('ytMusicIframe', {
            height: '1',
            width: '1',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                loop: 0
            },
            events: {
                onReady: () => {
                    this.ytReady = true;
                    if (this.config.enabled && this.config.sourceType === 'youtube') {
                        this.applySourceAndPlay();
                    }
                },
                onStateChange: (e) => {
                    if (e.data === YT.PlayerState.ENDED && this.config.loop && this.config.enabled) {
                        this.ytPlayer.playVideo();
                    }
                },
                onError: (e) => {
                    console.warn('YouTube Playback Error Code:', e.data);
                    if (typeof window.showToast === 'function') {
                        window.showToast('YouTube video restricted or unplayable in background.');
                    }
                }
            }
        });
    }

    extractYouTubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    stopAll() {
        if (this.audioEl) {
            this.audioEl.pause();
            this.audioEl.currentTime = 0;
        }
        if (this.videoEl) {
            this.videoEl.pause();
            this.videoEl.currentTime = 0;
        }
        if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.stopVideo === 'function') {
            try { this.ytPlayer.stopVideo(); } catch(e){}
        }
    }

    pauseAll() {
        if (this.audioEl) this.audioEl.pause();
        if (this.videoEl) this.videoEl.pause();
        if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.pauseVideo === 'function') {
            try { this.ytPlayer.pauseVideo(); } catch(e){}
        }
    }

    setVolume(vol) {
        this.config.volume = parseFloat(vol);
        if (this.audioEl) this.audioEl.volume = this.config.volume;
        if (this.videoEl) this.videoEl.volume = this.config.volume;
        if (this.ytPlayer && this.ytReady && typeof this.ytPlayer.setVolume === 'function') {
            try { this.ytPlayer.setVolume(this.config.volume * 100); } catch(e){}
        }
        this.saveSettings();
    }

    async applySourceAndPlay() {
        this.stopAll();

        if (!this.config.enabled) return;

        const vol = this.config.volume;
        const loop = this.config.loop;

        try {
            if (this.config.sourceType === 'upload_audio' || this.config.sourceType === 'upload_video') {
                const blob = await MusicDB.getTrack('active_bg_media');
                if (blob) {
                    if (this.activeObjectUrl) URL.revokeObjectURL(this.activeObjectUrl);
                    this.activeObjectUrl = URL.createObjectURL(blob);

                    const target = (this.config.sourceType === 'upload_audio') ? this.audioEl : this.videoEl;
                    target.src = this.activeObjectUrl;
                    target.volume = vol;
                    target.loop = loop;
                    await target.play();
                } else if (typeof window.showToast === 'function') {
                    window.showToast('No uploaded track found in local storage.');
                }
            } else if (this.config.sourceType === 'audio_url') {
                if (!this.config.url) return;
                this.audioEl.src = this.config.url;
                this.audioEl.volume = vol;
                this.audioEl.loop = loop;
                await this.audioEl.play();
            } else if (this.config.sourceType === 'video_url') {
                if (!this.config.url) return;
                this.videoEl.src = this.config.url;
                this.videoEl.volume = vol;
                this.videoEl.loop = loop;
                await this.videoEl.play();
            } else if (this.config.sourceType === 'youtube') {
                const videoId = this.extractYouTubeId(this.config.youtubeUrl);
                if (!videoId) {
                    if (typeof window.showToast === 'function') {
                        window.showToast('Invalid YouTube URL.');
                    }
                    return;
                }
                if (this.ytPlayer && this.ytReady) {
                    this.ytPlayer.loadVideoById(videoId);
                    this.ytPlayer.setVolume(vol * 100);
                }
            }
        } catch (err) {
            console.warn('Autoplay prevented or network error:', err);
            this.setupAutoplayUserInteractionFallback();
        }
    }

    setupAutoplayUserInteractionFallback() {
        const handler = () => {
            if (this.config.enabled) {
                this.applySourceAndPlay();
            }
            window.removeEventListener('click', handler);
            window.removeEventListener('touchstart', handler);
        };
        window.addEventListener('click', handler);
        window.addEventListener('touchstart', handler);
    }
}

window.bgMusicEngine = new BackgroundMusicEngine();


/* ==================================================================================
   MODULE 4: DYNAMIC OWNER CONTROL PANEL UI INJECTION & CONTROLLER
   ================================================================================== */
(function injectBackgroundMusicUI() {
    function buildAndAttachPanel() {
        const modal = document.getElementById('creatorModal');
        if (!modal) return;

        const tabGroup = modal.querySelector('.tab-btn-group');
        const panelContainer = modal.querySelector('.creator-panel');

        if (!tabGroup || !panelContainer) return;

        // Prevent duplicate injection
        if (document.getElementById('btnTabBgMusic')) return;

        // 1. Inject Tab Button
        const tabBtn = document.createElement('button');
        tabBtn.className = 'tab-btn';
        tabBtn.id = 'btnTabBgMusic';
        tabBtn.innerText = 'Background Music';
        tabBtn.onclick = () => window.switchCreatorTab('tabBgMusic');
        tabGroup.appendChild(tabBtn);

        // 2. Inject Tab Content Panel
        const panelDiv = document.createElement('div');
        panelDiv.id = 'tabBgMusic';
        panelDiv.className = 'tab-content';

        panelDiv.innerHTML = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
                <h3 style="font-size: 1.2rem; color: var(--primary);">🎵 Background Music Configuration</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);">
                    Customize background music from direct uploads, URLs, or YouTube. Audio plays seamlessly across the experience.
                </p>
            </div>

            <!-- Enable/Disable Master Switch -->
            <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; background: #fafafa; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid #eee;">
                <label style="font-weight: 700; margin-bottom: 0;">Enable Background Music</label>
                <input type="checkbox" id="bgmEnableToggle" style="width: 20px; height: 20px; cursor: pointer;" />
            </div>

            <!-- Active Track Status Badge -->
            <div id="bgmActiveTrackBadge" style="margin-bottom: 1.2rem; padding: 0.6rem 0.9rem; background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
                Active Track: None
            </div>

            <!-- Source Selection Sub-tabs -->
            <div class="form-group">
                <label>Select Music Source Type</label>
                <select id="bgmSourceTypeSelect" class="form-control">
                    <option value="upload_audio">Upload Audio File (MP3, WAV, OGG, AAC, FLAC)</option>
                    <option value="upload_video">Upload Video File (MP4, MOV, WebM - Audio Only)</option>
                    <option value="audio_url">Direct Audio File URL</option>
                    <option value="video_url">Direct Video File URL (Audio Only)</option>
                    <option value="youtube">YouTube Video Link</option>
                </select>
            </div>

            <!-- Dynamic Source Sub-Panels -->
            <div id="subPanelUploadAudio" class="bgm-source-panel" style="margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.3rem;">Upload Audio Device File</label>
                <input type="file" id="bgmFileInputAudio" accept="audio/*" class="form-control" />
            </div>

            <div id="subPanelUploadVideo" class="bgm-source-panel" style="display:none; margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.3rem;">Upload Video Device File</label>
                <input type="file" id="bgmFileInputVideo" accept="video/*" class="form-control" />
            </div>

            <div id="subPanelDirectUrl" class="bgm-source-panel" style="display:none; margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.3rem;">Direct Media URL</label>
                <input type="url" id="bgmInputDirectUrl" placeholder="https://example.com/music.mp3" class="form-control" />
            </div>

            <div id="subPanelYoutube" class="bgm-source-panel" style="display:none; margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.3rem;">YouTube Video URL</label>
                <input type="url" id="bgmInputYoutubeUrl" placeholder="https://www.youtube.com/watch?v=..." class="form-control" />
            </div>

            <!-- Controls Toolbar -->
            <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1.2rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <button class="btn" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" id="bgmBtnPlay">▶ Play</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" id="bgmBtnPause">⏸ Pause</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" id="bgmBtnStop">⏹ Stop</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;" id="bgmBtnPreview">🎧 Preview</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem; color: #dc2626;" id="bgmBtnRemove">🗑 Remove Track</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: center;">
                    <div>
                        <label style="font-size: 0.8rem; font-weight: 600;">Volume (<span id="bgmVolumeVal">70</span>%)</label>
                        <input type="range" id="bgmVolumeSlider" min="0" max="1" step="0.01" value="0.7" style="width: 100%; cursor: pointer;" />
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <label style="font-size: 0.82rem; cursor: pointer;"><input type="checkbox" id="bgmLoopToggle" checked /> Loop Track</label>
                        <label style="font-size: 0.82rem; cursor: pointer;"><input type="checkbox" id="bgmAutoplayToggle" checked /> Autoplay</label>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem;">
                <button class="btn" id="bgmBtnSave">Save Music Settings</button>
                <button class="btn btn-secondary" id="bgmBtnReset">Reset Defaults</button>
            </div>
        `;

        panelContainer.appendChild(panelDiv);

        bindBgmUIEvents();
        syncBgmUIFromEngine();
    }

    function bindBgmUIEvents() {
        const engine = window.bgMusicEngine;

        const sourceTypeSelect = document.getElementById('bgmSourceTypeSelect');
        const enableToggle = document.getElementById('bgmEnableToggle');
        const volumeSlider = document.getElementById('bgmVolumeSlider');
        const volumeVal = document.getElementById('bgmVolumeVal');
        const loopToggle = document.getElementById('bgmLoopToggle');
        const autoplayToggle = document.getElementById('bgmAutoplayToggle');

        // Sub-panel visibility dynamic switcher
        sourceTypeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            document.getElementById('subPanelUploadAudio').style.display = (val === 'upload_audio') ? 'block' : 'none';
            document.getElementById('subPanelUploadVideo').style.display = (val === 'upload_video') ? 'block' : 'none';
            document.getElementById('subPanelDirectUrl').style.display = (val === 'audio_url' || val === 'video_url') ? 'block' : 'none';
            document.getElementById('subPanelYoutube').style.display = (val === 'youtube') ? 'block' : 'none';
        });

        // Volume slider update
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            volumeVal.innerText = Math.round(val * 100);
            engine.setVolume(val);
        });

        // Controls
        document.getElementById('bgmBtnPlay').addEventListener('click', () => {
            engine.config.enabled = true;
            enableToggle.checked = true;
            engine.applySourceAndPlay();
            if (typeof window.showToast === 'function') window.showToast('Playing Background Music');
        });

        document.getElementById('bgmBtnPause').addEventListener('click', () => {
            engine.pauseAll();
            if (typeof window.showToast === 'function') window.showToast('Music Paused');
        });

        document.getElementById('bgmBtnStop').addEventListener('click', () => {
            engine.stopAll();
            if (typeof window.showToast === 'function') window.showToast('Music Stopped');
        });

        document.getElementById('bgmBtnPreview').addEventListener('click', () => {
            engine.config.enabled = true;
            engine.applySourceAndPlay();
            if (typeof window.showToast === 'function') window.showToast('Previewing Track');
        });

        document.getElementById('bgmBtnRemove').addEventListener('click', async () => {
            engine.stopAll();
            await MusicDB.deleteTrack('active_bg_media');
            engine.config.sourceType = 'none';
            engine.config.fileName = '';
            engine.config.url = '';
            engine.config.youtubeUrl = '';
            engine.saveSettings();
            syncBgmUIFromEngine();
            if (typeof window.showToast === 'function') window.showToast('Track Removed');
        });

        // File upload event handlers
        document.getElementById('bgmFileInputAudio').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await MusicDB.saveTrack('active_bg_media', file);
                engine.config.sourceType = 'upload_audio';
                engine.config.fileName = file.name;
                engine.saveSettings();
                syncBgmUIFromEngine();
                if (typeof window.showToast === 'function') window.showToast(`Uploaded Audio: ${file.name}`);
            }
        });

        document.getElementById('bgmFileInputVideo').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await MusicDB.saveTrack('active_bg_media', file);
                engine.config.sourceType = 'upload_video';
                engine.config.fileName = file.name;
                engine.saveSettings();
                syncBgmUIFromEngine();
                if (typeof window.showToast === 'function') window.showToast(`Uploaded Video: ${file.name}`);
            }
        });

        // Save Button Handler
        document.getElementById('bgmBtnSave').addEventListener('click', () => {
            engine.config.enabled = enableToggle.checked;
            engine.config.sourceType = sourceTypeSelect.value;
            engine.config.url = document.getElementById('bgmInputDirectUrl').value.trim();
            engine.config.youtubeUrl = document.getElementById('bgmInputYoutubeUrl').value.trim();
            engine.config.volume = parseFloat(volumeSlider.value);
            engine.config.loop = loopToggle.checked;
            engine.config.autoplay = autoplayToggle.checked;

            engine.saveSettings();
            if (engine.config.enabled) {
                engine.applySourceAndPlay();
            } else {
                engine.stopAll();
            }

            if (typeof window.showToast === 'function') window.showToast('Background Music Settings Saved!');
        });

        // Reset Button Handler
        document.getElementById('bgmBtnReset').addEventListener('click', async () => {
            engine.stopAll();
            await MusicDB.deleteTrack('active_bg_media');
            engine.config = {
                enabled: false,
                sourceType: 'none',
                url: '',
                youtubeUrl: '',
                fileName: '',
                volume: 0.7,
                loop: true,
                autoplay: true
            };
            engine.saveSettings();
            syncBgmUIFromEngine();
            if (typeof window.showToast === 'function') window.showToast('Music Settings Reset to Defaults');
        });
    }

    function syncBgmUIFromEngine() {
        const engine = window.bgMusicEngine;
        if (!engine) return;

        const cfg = engine.config;

        const enableToggle = document.getElementById('bgmEnableToggle');
        const sourceTypeSelect = document.getElementById('bgmSourceTypeSelect');
        const badge = document.getElementById('bgmActiveTrackBadge');
        const inputDirect = document.getElementById('bgmInputDirectUrl');
        const inputYt = document.getElementById('bgmInputYoutubeUrl');
        const volumeSlider = document.getElementById('bgmVolumeSlider');
        const volumeVal = document.getElementById('bgmVolumeVal');
        const loopToggle = document.getElementById('bgmLoopToggle');
        const autoplayToggle = document.getElementById('bgmAutoplayToggle');

        if (enableToggle) enableToggle.checked = cfg.enabled;
        if (sourceTypeSelect && cfg.sourceType !== 'none') sourceTypeSelect.value = cfg.sourceType;
        if (inputDirect) inputDirect.value = cfg.url || '';
        if (inputYt) inputYt.value = cfg.youtubeUrl || '';
        if (volumeSlider) {
            volumeSlider.value = cfg.volume;
            if (volumeVal) volumeVal.innerText = Math.round(cfg.volume * 100);
        }
        if (loopToggle) loopToggle.checked = cfg.loop;
        if (autoplayToggle) autoplayToggle.checked = cfg.autoplay;

        // Badge update
        if (badge) {
            if (cfg.sourceType === 'upload_audio' || cfg.sourceType === 'upload_video') {
                badge.innerText = `Active Track: Local File (${cfg.fileName || 'Uploaded Media'})`;
            } else if (cfg.sourceType === 'audio_url' || cfg.sourceType === 'video_url') {
                badge.innerText = `Active Track: Direct URL (${cfg.url || 'No URL'})`;
            } else if (cfg.sourceType === 'youtube') {
                badge.innerText = `Active Track: YouTube Link (${cfg.youtubeUrl || 'No Link'})`;
            } else {
                badge.innerText = 'Active Track: None';
            }
        }

        // Trigger change event to set visible sub-panel
        if (sourceTypeSelect) sourceTypeSelect.dispatchEvent(new Event('change'));
    }

    // Auto load music on start if autoplay is enabled
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.bgMusicEngine && window.bgMusicEngine.config.enabled && window.bgMusicEngine.config.autoplay) {
                window.bgMusicEngine.applySourceAndPlay();
            }
        }, 1000);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildAndAttachPanel);
    } else {
        buildAndAttachPanel();
    }
})();

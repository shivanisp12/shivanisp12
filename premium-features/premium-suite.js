/**
 * ============================================================================
 * PREMIUM SUITE - MASTER ORCHESTRATOR & ENTRY POINT
 * File: premium-features/premium-suite.js
 * ============================================================================
 * Central orchestrator connecting and managing all feature modules:
 *  - Feature 1: Dynamic Background Engine (Canvas particles & video wallpapers)
 *  - Feature 2: Sound Engine (Web Audio API synth & sound effects)
 *  - Feature 3: Interactive Mascot Guide Engine
 *  - Feature 4: Background Music Library & YouTube/Audio Player
 *  - Feature 5: Cinematic Chapters Overlay & Scroll Reveal
 *  - Feature 6: 3D Gift Box Enhancer & Confetti Effects
 *  - Feature 7: Mini-Game Arcade Enhancer & Victory Modals
 *  - Feature 8 & 9: Time Capsule & Webhook/Email Notifications
 *  - Owner Settings Panel & Security Authentication Engine
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    // =========================================================================
    // 1. DEFAULT CELEBRATION CONFIGURATION
    // =========================================================================
    const DEFAULT_CONFIG = {
        ownerPasscode: "1234",
        recipientName: "Sophia",
        senderName: "Julian",
        occasion: "OUR SPECIAL DAY",
        introHeading: "Happy Celebration, Sophia!",
        mainMessage: "A dreamy personalized gift crafted with love, memory fragments, and joyful secrets just for you.",
        giftTitle: "You Unlocked The Surprise Gift!",
        giftText: "May your day be filled with warm laughter, sweet moments, and endless magic.",
        proposalQuestion: "Will you go out with me?",
        vaultPin: "2024",
        vaultSecretMsg: "You are my favorite thought every single day. I love you!",
        eventTitle: "Special Anniversary Dinner",
        eventDesc: "An intimate evening of delicious food, candles, and creating unforgettable memories.",
        eventDate: "October 14, 2026",
        eventTime: "7:00 PM EST",
        venue: "The Starlight Rooftop Garden",
        countdownTarget: "2026-10-14T19:00:00",
        theme: "dreamy-pink",
        selectedFinale: "confetti",
        quizQuestion: "What is our favorite shared activity?",
        quizCorrect: "Stargazing & long chats",
        quizWrong: "Sitting in traffic",
        letterPages: [
            "My Dearest Sophia, \n\nFrom the moment you entered my life, every ordinary day has felt like a scene from a magical movie. Your laughter brightens even the cloudiest afternoons.",
            "Thank you for every shared smile, late-night conversation, and quiet moment of understanding. Building memories with you is my absolute favorite pastime.",
            "As we celebrate this special occasion, I want you to remember how deeply loved and appreciated you are. Here is to all our adventures yet to come!"
        ],
        flowers: [
            { type: "rose", name: "Red Rose", msg: "You bring passion & endless joy to my life" },
            { type: "tulip", name: "Pink Tulip", msg: "A sweet reminder of how caring & gentle you are" },
            { type: "lily", name: "White Lily", msg: "Pure happiness whenever you are near" },
            { type: "orchid", name: "Royal Orchid", msg: "Unique, elegant, and beautiful inside out" },
            { type: "daisy", name: "Sunny Daisy", msg: "You bring bright warmth to my everyday world" },
            { type: "cherry", name: "Cherry Blossom", msg: "Every moment with you blooms sweetly" },
            { type: "sunflower", name: "Golden Sunflower", msg: "You light up any room with your radiant smile" },
            { type: "lotus", name: "Mystic Lotus", msg: "Peaceful, graceful, and deeply cherished" }
        ],
        memories: [
            { img: "https://picsum.photos/id/1018/600/400", caption: "Our serene walk by the mountain lake" },
            { img: "https://picsum.photos/id/1025/600/400", caption: "Cozy coffee mornings together" },
            { img: "https://picsum.photos/id/1062/600/400", caption: "Stargazing on warm summer nights" }
        ],
        pinterestPhotos: [
            { img: "https://picsum.photos/id/1015/600/800", caption: "Aesthetic sunset vibes" },
            { img: "https://picsum.photos/id/1025/600/600", caption: "Cozy moments" },
            { img: "https://picsum.photos/id/1039/600/900", caption: "Unforgettable trip" },
            { img: "https://picsum.photos/id/1043/600/700", caption: "Dreamy polaroids" },
            { img: "https://picsum.photos/id/1069/600/800", caption: "Golden hour glow" }
        ],
        retroTvMedia: [
            { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Channel 01 - Cozy Video Reel" },
            { type: "image", src: "https://picsum.photos/id/1018/800/450", title: "Channel 02 - Mountain Lake View" },
            { type: "image", src: "https://picsum.photos/id/1062/800/450", title: "Channel 03 - Night Sky Stargazing" }
        ],
        timeline: [
            { date: "June 12, 2023", title: "First Met", desc: "A chance meeting that changed everything." },
            { date: "October 14, 2023", title: "First Official Date", desc: "Coffee turned into a 4-hour walk." },
            { date: "August 10, 2024", title: "Roadtrip Adventure", desc: "Exploring coastlines and playing endless playlists." }
        ],
        musicConfig: {
            sourceType: "none",
            url: "",
            volume: 80,
            loop: true,
            autoplay: true,
            enabled: true
        },
        ownerResponses: []
    };

    // =========================================================================
    // 2. MASTER ORCHESTRATOR CLASS
    // =========================================================================
    class PremiumSuiteOrchestrator {
        constructor() {
            this.isInitialized = false;
            this.config = {};
            this.modules = {};
            this.state = {
                currentLetterPage: 0,
                currentMemoryIdx: 0,
                currentTvIdx: 0,
                themeIdx: 0,
                accMode: false,
                isOwnerAuthenticated: false,
                audioPresetIdx: 0
            };
        }

        /**
         * Central Bootstrapper
         */
        init() {
            if (this.isInitialized) return;

            console.log("🚀 Initializing Premium Suite Master Orchestrator...");
            this.loadConfiguration();
            this.initModules();
            this.bindDOMEvents();
            this.renderDynamicContent();
            this.exposeGlobalAPI();

            this.isInitialized = true;
            console.log("✅ Premium Suite Master Orchestrator Ready!");
        }

        /**
         * Load persistent configuration from LocalStorage
         */
        loadConfiguration() {
            const stored = localStorage.getItem('celebration_cfg');
            if (stored) {
                try {
                    this.config = Object.assign({}, DEFAULT_CONFIG, JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse stored celebration_cfg", e);
                    this.config = Object.assign({}, DEFAULT_CONFIG);
                }
            } else {
                this.config = Object.assign({}, DEFAULT_CONFIG);
            }
            window.CELEBRATION_CONFIG = this.config;
        }

        /**
         * Save current configuration state to LocalStorage
         */
        saveConfiguration() {
            localStorage.setItem('celebration_cfg', JSON.stringify(this.config));
            this.showToast("Configuration saved!");
        }

        /**
         * Initialize Modular Feature Sub-engines
         */
        initModules() {
            // Feature 1: Dynamic Background & Canvas Particles Engine
            if (window.DynamicBackgroundEngine) {
                this.modules.bg = new window.DynamicBackgroundEngine({
                    canvasId: 'bgCanvas',
                    fxCanvasId: 'fxCanvas',
                    sakuraCanvasId: 'sakuraCanvas'
                });
                this.modules.bg.init();
            }

            // Feature 2: Sound Engine (Web Audio API Synthesizer)
            if (window.SoundEngine) {
                this.modules.sound = new window.SoundEngine();
            }

            // Feature 3: Interactive Mascot Guide Engine
            if (window.GuideCharacterEngine) {
                this.modules.guide = new window.GuideCharacterEngine();
                this.modules.guide.init();
            }

            // Feature 4: Background Music Library & YouTube Engine
            if (window.BgMusicLibraryEngine) {
                this.modules.music = new window.BgMusicLibraryEngine(this.config.musicConfig);
                this.modules.music.init();
            }

            // Feature 5: Cinematic Chapters & Scroll Reveal Controller
            if (window.CinematicChaptersEngine) {
                this.modules.chapters = new window.CinematicChaptersEngine();
                this.modules.chapters.init();
            }

            // Feature 6: 3D Gift Box Enhancer Engine
            if (window.GiftBoxEnhancerEngine) {
                this.modules.gift = new window.GiftBoxEnhancerEngine();
            }

            // Feature 7: Mini-Game Arcade Enhancer
            if (window.MiniGameEnhancerEngine) {
                this.modules.games = new window.MiniGameEnhancerEngine();
            }

            // Feature 8 & 9: Email & Webhook Time Capsule Notifications
            if (window.EmailNotificationsEngine) {
                this.modules.notifications = new window.EmailNotificationsEngine();
            }

            // Owner Settings Panel Controller Injection
            if (window.OwnerSettingsPanelEngine) {
                this.modules.ownerPanel = new window.OwnerSettingsPanelEngine(this.config);
                this.modules.ownerPanel.init();
            }
        }

        /**
         * Bind DOM Listeners & Dynamic Scroll Observers
         */
        bindDOMEvents() {
            // Active Nav link highlight on scroll
            const sections = document.querySelectorAll('.chapter-section');
            const navLinks = document.querySelectorAll('.nav-link');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                        section.classList.add('visible');
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const onclickAttr = link.getAttribute('onclick');
                    if (onclickAttr && onclickAttr.includes(current)) {
                        link.classList.add('active');
                    }
                });
            });

            // Start Live Countdown Timer
            this.initCountdownTimer();
        }

        /**
         * Render All Dynamic UI Elements from Configuration
         */
        renderDynamicContent() {
            // General Header & Intro
            this.setElementText('cfgOccasion', this.config.occasion);
            const headingEl = document.getElementById('cfgIntroHeading');
            if (headingEl) {
                headingEl.innerHTML = `Happy Celebration, <br><span class="handwriting" style="color:var(--primary)">${this.escapeHTML(this.config.recipientName)}</span>!`;
            }
            this.setElementText('cfgMainMessage', this.config.mainMessage);

            // Gift Section
            this.setElementText('cfgGiftTitle', this.config.giftTitle);
            this.setElementText('cfgGiftText', this.config.giftText);

            // Proposal & Secret Section
            this.setElementText('cfgProposalQuestion', this.config.proposalQuestion);
            this.setElementText('cfgSenderSign', `With all my love, ${this.config.senderName}`);

            // RSVP Details
            this.setElementText('cfgEventTitle', this.config.eventTitle);
            this.setElementText('cfgEventDesc', this.config.eventDesc);
            this.setElementText('cfgEventDate', this.config.eventDate);
            this.setElementText('cfgEventTime', this.config.eventTime);
            this.setElementText('cfgVenue', this.config.venue);

            // Render Modules Content
            this.renderBouquet();
            this.renderMemories();
            this.renderPinterestGrid();
            this.renderTvScreen();
            this.renderTimeline();
        }

        // =========================================================================
        // 3. CORE DOM RENDERERS & FEATURE HANDLERS
        // =========================================================================

        renderBouquet() {
            const container = document.getElementById('flowerContainer');
            if (!container || !Array.isArray(this.config.flowers)) return;
            container.innerHTML = '';

            this.config.flowers.forEach((f, idx) => {
                const item = document.createElement('div');
                item.className = 'flower-item';
                item.onclick = () => {
                    item.classList.toggle('bloomed');
                    this.playSoftTone(400 + idx * 40, 0.3, 'triangle');
                };
                item.innerHTML = `
                    <div class="flower-head">${this.getFlowerSVG(f.type)}</div>
                    <div class="flower-stem">
                        <div class="flower-leaf left"></div>
                        <div class="flower-leaf right"></div>
                    </div>
                    <div class="flower-note-pop">${this.escapeHTML(f.msg)}</div>
                `;
                container.appendChild(item);
            });
        }

        getFlowerSVG(type) {
            switch (type) {
                case 'rose':
                    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 20 C30 20 20 40 35 60 C50 80 80 50 65 30 Z" fill="#e63946"/><path d="M50 25 C40 25 35 45 45 55 C55 65 70 45 60 30 Z" fill="#ff4d6d"/><path d="M50 30 C45 35 45 45 50 50 C55 45 55 35 50 30 Z" fill="#ff758f"/></svg>`;
                case 'tulip':
                    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 70 C20 40 30 20 50 30 C70 20 80 40 70 70 Z" fill="#ff4d6d"/><path d="M40 70 C35 50 45 30 50 35 C55 30 65 50 60 70 Z" fill="#ff758f"/></svg>`;
                case 'lily':
                    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="12" fill="#ffd166"/><path d="M50 15 C40 35 40 45 50 50 C60 45 60 35 50 15 Z" fill="#fffdfa"/><path d="M50 85 C40 65 40 55 50 50 C60 55 60 65 50 85 Z" fill="#fffdfa"/><path d="M15 50 C35 40 45 40 50 50 C45 60 35 60 15 50 Z" fill="#fffdfa"/><path d="M85 50 C65 40 55 40 50 50 C55 60 65 60 85 50 Z" fill="#fffdfa"/></svg>`;
                default:
                    return `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="18" fill="#facc15"/><circle cx="50" cy="22" r="14" fill="#f472b6"/><circle cx="50" cy="78" r="14" fill="#f472b6"/><circle cx="22" cy="50" r="14" fill="#f472b6"/><circle cx="78" cy="50" r="14" fill="#f472b6"/></svg>`;
            }
        }

        renderMemories() {
            const mems = this.config.memories;
            if (!Array.isArray(mems) || mems.length === 0) return;
            const img = document.getElementById('memoryImg');
            const cap = document.getElementById('memoryCaption');
            if (img) img.src = mems[this.state.currentMemoryIdx].img;
            if (cap) cap.innerText = mems[this.state.currentMemoryIdx].caption;
        }

        changeMemory(dir) {
            const mems = this.config.memories;
            if (!mems.length) return;
            this.state.currentMemoryIdx = (this.state.currentMemoryIdx + dir + mems.length) % mems.length;
            this.renderMemories();
        }

        renderPinterestGrid() {
            const grid = document.getElementById('pinterestGrid');
            if (!grid || !Array.isArray(this.config.pinterestPhotos)) return;
            grid.innerHTML = '';
            this.config.pinterestPhotos.forEach(p => {
                const card = document.createElement('div');
                card.className = 'pin-card';
                card.innerHTML = `<img src="${p.img}" alt="Pinterest memory"/><div class="pin-caption">${this.escapeHTML(p.caption)}</div>`;
                grid.appendChild(card);
            });
        }

        renderTvScreen() {
            const frame = document.getElementById('tvScreenFrame');
            const label = document.getElementById('tvChannelLabel');
            if (!frame || !Array.isArray(this.config.retroTvMedia) || this.config.retroTvMedia.length === 0) return;

            const item = this.config.retroTvMedia[this.state.currentTvIdx];
            if (!item) return;

            if (label) label.innerText = `CH 0${this.state.currentTvIdx + 1}`;
            frame.innerHTML = '<div class="tv-scanlines"></div>';

            if (item.type === 'video') {
                const vid = document.createElement('video');
                vid.src = item.src;
                vid.autoplay = true;
                vid.loop = true;
                vid.muted = true;
                frame.appendChild(vid);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                frame.appendChild(img);
            }
        }

        cycleTvChannel() {
            const media = this.config.retroTvMedia;
            if (!media.length) return;
            this.state.currentTvIdx = (this.state.currentTvIdx + 1) % media.length;
            this.renderTvScreen();
        }

        prevTvMedia() {
            const media = this.config.retroTvMedia;
            if (!media.length) return;
            this.state.currentTvIdx = (this.state.currentTvIdx - 1 + media.length) % media.length;
            this.renderTvScreen();
        }

        renderTimeline() {
            const container = document.getElementById('timelineList');
            if (!container || !Array.isArray(this.config.timeline)) return;
            container.innerHTML = '';

            this.config.timeline.forEach(item => {
                const div = document.createElement('div');
                div.className = 'timeline-item';
                div.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div style="font-size:0.85rem; font-weight:700; color:var(--primary);">${this.escapeHTML(item.date)}</div>
                    <h4 style="font-size:1.2rem; margin:0.2rem 0;">${this.escapeHTML(item.title)}</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted);">${this.escapeHTML(item.desc)}</p>
                `;
                container.appendChild(div);
            });
        }

        initCountdownTimer() {
            const update = () => {
                const target = new Date(this.config.countdownTarget).getTime();
                const now = new Date().getTime();
                const diff = target - now;

                if (diff <= 0) {
                    this.setElementText('cdDays', '00');
                    this.setElementText('cdHours', '00');
                    this.setElementText('cdMins', '00');
                    this.setElementText('cdSecs', '00');
                    return;
                }

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                this.setElementText('cdDays', d < 10 ? '0' + d : d);
                this.setElementText('cdHours', h < 10 ? '0' + h : h);
                this.setElementText('cdMins', m < 10 ? '0' + m : m);
                this.setElementText('cdSecs', s < 10 ? '0' + s : s);
            };

            update();
            setInterval(update, 1000);
        }

        // =========================================================================
        // 4. INTERACTIVE ACTIONS & HANDLERS
        // =========================================================================

        scrollToSection(id) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                this.playSoftTone(440, 0.2);
            }
        }

        startStoryExperience() {
            this.scrollToSection('gift');
        }

        openGiftBox() {
            const box = document.getElementById('giftBox');
            const reveal = document.getElementById('giftRevealCard');
            if (box && !box.classList.contains('opened')) {
                box.classList.add('opened');
                this.playSoftTone(587.33, 0.6, 'triangle');
                this.triggerConfettiBurst(80);
                setTimeout(() => {
                    if (reveal) {
                        reveal.style.display = 'block';
                        reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 700);
            }
        }

        openLetter() {
            const env = document.getElementById('envelope');
            const paper = document.getElementById('letterPaper');
            if (env) env.classList.add('opened');
            if (paper) paper.style.display = 'block';
            this.renderLetterPage();
        }

        renderLetterPage() {
            const pages = this.config.letterPages;
            if (!pages) return;
            this.setElementText('letterContent', pages[this.state.currentLetterPage] || '');
            this.setElementText('pageIndicator', `Page ${this.state.currentLetterPage + 1}/${pages.length}`);
        }

        prevLetterPage() {
            if (this.state.currentLetterPage > 0) {
                this.state.currentLetterPage--;
                this.renderLetterPage();
            }
        }

        nextLetterPage() {
            if (this.state.currentLetterPage < this.config.letterPages.length - 1) {
                this.state.currentLetterPage++;
                this.renderLetterPage();
            }
        }

        speakLetterPage() {
            if ('speechSynthesis' in window) {
                const text = this.config.letterPages[this.state.currentLetterPage];
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            } else {
                this.showToast("Text-to-speech not supported in this browser.");
            }
        }

        unlockVault() {
            const pin = document.getElementById('vaultPin')?.value;
            if (pin === this.config.vaultPin) {
                this.showToast("Vault Unlocked!");
                alert(`SECRET MESSAGE UNLOCKED:\n\n${this.config.vaultSecretMsg}`);
                this.recordOwnerResponse('Secret Vault', `Vault unlocked using PIN: ${pin}`);
            } else {
                this.showToast("Incorrect PIN. Please try again.");
            }
        }

        submitRSVP(status) {
            this.setElementText('rsvpStatus', `RSVP Recorded: ${status}! Thank you.`);
            this.showToast(`RSVP status updated to ${status}`);
            this.recordOwnerResponse('RSVP Submission', `RSVP Status: ${status}`);
        }

        escapeNoButton() {
            if (this.state.accMode) return;
            const btnNo = document.getElementById('btnNo');
            if (!btnNo) return;
            const rx = (Math.random() - 0.5) * 200;
            const ry = (Math.random() - 0.5) * 120;
            btnNo.style.transform = `translate(${rx}px, ${ry}px)`;
        }

        toggleAccessibilityMode(val) {
            this.state.accMode = val;
            const btnNo = document.getElementById('btnNo');
            if (btnNo && val) {
                btnNo.style.transform = 'none';
            }
        }

        triggerYesCelebration() {
            const card = document.getElementById('proposalResultCard');
            if (card) card.style.display = 'block';
            this.triggerConfettiBurst(150);
            this.recordOwnerResponse('Proposal Response', 'SHE SAID YES!');
        }

        recordOwnerResponse(type, detail) {
            if (!Array.isArray(this.config.ownerResponses)) {
                this.config.ownerResponses = [];
            }
            this.config.ownerResponses.unshift({
                timestamp: new Date().toLocaleString(),
                type: type,
                detail: detail,
                unread: true
            });
            this.saveConfiguration();
        }

        // =========================================================================
        // 5. UTILITIES & AUDIO EFFECTS
        // =========================================================================

        playSoftTone(freq = 440, duration = 0.4, type = 'sine') {
            if (this.modules.sound && typeof this.modules.sound.playTone === 'function') {
                this.modules.sound.playTone(freq, duration, type);
            }
        }

        cycleTheme() {
            const themesList = [
                'dreamy-pink', 'lavender-moon', 'cloudy-blue', 'peach-sunset', 'sakura-dream', 'soft-garden',
                'cream-champagne', 'midnight-romance', 'cozy-coffee', 'fairy-garden', 'vintage-love-letter',
                'celestial-dream', 'soft-wedding', 'dreamy-birthday', 'luxury-gold', 'galaxy', 'aurora', 'ocean', 
                'forest', 'scrapbook', 'polaroid'
            ];
            this.state.themeIdx = (this.state.themeIdx + 1) % themesList.length;
            const t = themesList[this.state.themeIdx];
            document.documentElement.setAttribute('data-theme', t);
            this.showToast(`Theme (${this.state.themeIdx + 1}/21): ${t.replace(/-/g, ' ').toUpperCase()}`);
            this.playSoftTone(523.25, 0.2);
        }

        cycleAudioPreset() {
            this.state.audioPresetIdx = (this.state.audioPresetIdx + 1) % 4;
            const presets = ["Muted", "Ambient Synth", "Romantic Chimes", "Lofi Waves"];
            this.showToast(`Audio Preset: ${presets[this.state.audioPresetIdx]}`);
        }

        showToast(msg) {
            const toast = document.getElementById('toast');
            if (toast) {
                toast.innerText = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }
        }

        triggerConfettiBurst(count = 100) {
            const fx = document.getElementById('fxCanvas');
            if (!fx) return;
            const ctx = fx.getContext('2d');
            fx.width = window.innerWidth;
            fx.height = window.innerHeight;
            const particles = [];

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: fx.width / 2,
                    y: fx.height / 2,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12 - 4,
                    size: Math.random() * 8 + 4,
                    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                    life: 100
                });
            }

            const anim = () => {
                ctx.clearRect(0, 0, fx.width, fx.height);
                particles.forEach((p, idx) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.15;
                    p.life--;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    if (p.life <= 0) particles.splice(idx, 1);
                });
                if (particles.length > 0) requestAnimationFrame(anim);
            };
            anim();
        }

        setElementText(id, text) {
            const el = document.getElementById(id);
            if (el && text !== undefined) el.innerText = text;
        }

        escapeHTML(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // =========================================================================
        // 6. GLOBAL API EXPOSURE (Backwards compatibility for HTML inline handlers)
        // =========================================================================
        exposeGlobalAPI() {
            window.scrollToSection = (id) => this.scrollToSection(id);
            window.startStoryExperience = () => this.startStoryExperience();
            window.openGiftBox = () => this.openGiftBox();
            window.openLetter = () => this.openLetter();
            window.prevLetterPage = () => this.prevLetterPage();
            window.nextLetterPage = () => this.nextLetterPage();
            window.speakLetterPage = () => this.speakLetterPage();
            window.changeMemory = (dir) => this.changeMemory(dir);
            window.cycleTvChannel = () => this.cycleTvChannel();
            window.prevTvMedia = () => this.prevTvMedia();
            window.nextTvMedia = () => this.cycleTvChannel();
            window.unlockVault = () => this.unlockVault();
            window.submitRSVP = (status) => this.submitRSVP(status);
            window.escapeNoButton = () => this.escapeNoButton();
            window.toggleAccessibilityMode = (val) => this.toggleAccessibilityMode(val);
            window.triggerYesCelebration = () => this.triggerYesCelebration();
            window.cycleTheme = () => this.cycleTheme();
            window.cycleAudioPreset = () => this.cycleAudioPreset();
        }
    }

    // Auto-instantiate and start on DOMReady
    document.addEventListener('DOMContentLoaded', () => {
        window.PremiumSuite = new PremiumSuiteOrchestrator();
        window.PremiumSuite.init();
    });

})(window, document);

/* ==========================================================================
   FEATURE 4: ADVANCED BACKGROUND MUSIC LIBRARY ENGINE
   ========================================================================== */
(function () {
  let audioEl = null;

  function init() {
    audioEl = document.getElementById('mainBgMusic');
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'mainBgMusic';
      audioEl.loop = true;
      document.body.appendChild(audioEl);
    }
  }

  function setTrack(sourceType, value) {
    if (!audioEl) init();

    if (sourceType === 'audioUrl' || sourceType === 'uploadAudio') {
      audioEl.src = value;
      audioEl.play().catch(() => {});
    } else if (sourceType === 'youtubeUrl') {
      // Direct YouTube audio handling / Iframe fallback trigger
      audioEl.pause();
      const container = document.getElementById('youtubeEmbedContainer');
      if (container) {
        const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = value.match(reg);
        if (match && match[1]) {
          container.style.display = 'block';
          container.innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}?autoplay=1&loop=1" allow="autoplay"></iframe>`;
        }
      }
    }
  }

  function setVolume(volumePct) {
    if (audioEl) {
      audioEl.volume = Math.max(0, Math.min(1, volumePct / 100));
    }
  }

  window.BgMusicLibrary = {
    init,
    setTrack,
    setVolume
  };
})();

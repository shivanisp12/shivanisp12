/**
 * Celebration Verse - Master Suite Orchestrator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Core Extensions
  window.celebrationBg = new window.DynamicBackgroundEngine();
  window.celebrationGuide = new window.GuideCharacterManager();
  window.celebrationChapters = new window.CinematicChapters();
  window.celebrationGiftBox = new window.GiftBox3DEnhancer();
  window.celebrationArcade = new window.CelebrationArcadeEngine();
  window.celebrationOwner = new window.OwnerSettingsPanel();

  // Audio Toggle Button Event Binding
  const audioBtn = document.getElementById('toggleAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const playing = window.bgMusicEngine.toggle();
      audioBtn.style.boxShadow = playing ? '0 0 15px var(--primary-glow)' : 'none';
    });
  }

  // Image Fallback Handling Engine
  document.querySelectorAll('img.fallback-img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23222"/><text x="50%" y="50%" fill="%23fff" dominant-baseline="middle" text-anchor="middle">Celebration Moment ✨</text></svg>';
    });
  });

  // Love Letter Unfold Trigger
  const unfoldBtn = document.getElementById('unfoldLetterBtn');
  if (unfoldBtn) {
    unfoldBtn.addEventListener('click', () => {
      const paper = document.getElementById('letterPaper');
      if (paper) paper.classList.toggle('open');
      if (window.celebrationAudio) window.celebrationAudio.playClick();
    });
  }

  // Flower Node Interactivity
  document.querySelectorAll('.flower-node').forEach(node => {
    node.addEventListener('click', () => {
      const detailBox = document.getElementById('flowerDetailModal');
      const meaning = node.getAttribute('data-meaning');
      const flower = node.getAttribute('data-flower');
      if (detailBox) {
        detailBox.innerHTML = `<strong>${flower}:</strong> ${meaning}`;
      }
      if (window.celebrationAudio) window.celebrationAudio.playClick();
    });
  });

  // Proposal Section Interactivity
  const propYes = document.getElementById('proposalYesBtn');
  const propNo = document.getElementById('proposalNoBtn');
  const propResp = document.getElementById('proposalResponse');

  if (propYes && propResp) {
    propYes.addEventListener('click', () => {
      propResp.innerHTML = "💖 Yay! You've made this the happiest day ever!";
      propResp.classList.remove('hidden');
      if (window.celebrationAudio) window.celebrationAudio.playFanfare();
      if (window.NotificationDispatcher) {
        window.NotificationDispatcher.send('PROPOSAL_ACCEPTED', { response: 'YES' });
      }
    });
  }

  if (propNo && propNo) {
    propNo.addEventListener('mouseover', () => {
      // Playful evasive button effect
      propNo.style.transform = `translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 100}px)`;
    });
  }

  // RSVP Form Submission Handler
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('rsvpStatus');
      const name = document.getElementById('rsvpName').value;
      const attending = document.getElementById('rsvpAttending').value;
      
      if (status) {
        status.textContent = `Thank you ${name}! Your RSVP (${attending}) has been recorded.`;
        status.style.color = '#4caf50';
      }

      if (window.NotificationDispatcher) {
        window.NotificationDispatcher.send('RSVP_SUBMITTED', {
          name,
          attending,
          note: document.getElementById('rsvpNote').value
        });
      }
    });
  }

  console.log("🚀 Celebration Verse 2026 Commercial Upgrade Engine Loaded Successfully!");
});

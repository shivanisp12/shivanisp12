/* ==========================================================================
   OWNER SETTINGS TAB INJECTION MODULE
   ========================================================================== */
(function () {
  function init() {
    const tabGroup = document.querySelector('#creatorModal .tab-btn-group');
    if (!tabGroup || tabGroup.querySelector('#tabPremiumBtn')) return;

    // Inject New Premium Tab Button
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.id = 'tabPremiumBtn';
    btn.innerText = '✨ Premium Suite';
    btn.onclick = () => switchTab();
    tabGroup.appendChild(btn);

    // Inject New Tab Panel Content
    const panel = document.createElement('div');
    panel.id = 'tabPremiumContent';
    panel.className = 'tab-content';
    panel.innerHTML = `
      <h3>✨ Premium Features Suite Controls</h3>
      <div class="premium-settings-grid">
        <div class="premium-settings-card">
          <h4>Dynamic Background</h4>
          <label>Mode:</label>
          <select id="pBgMode" class="form-control" onchange="PremiumSettings.updateBg()">
            <option value="particles">Interactive Particles</option>
            <option value="video">Looping Video</option>
          </select>
        </div>
        <div class="premium-settings-card">
          <h4>Guide Character</h4>
          <label>Mascot:</label>
          <select id="pGuideMascot" class="form-control" onchange="PremiumSettings.updateGuide()">
            <option value="cat">Cute Cat</option>
            <option value="puppy">Puppy</option>
            <option value="cinnamoroll">Cinnamoroll</option>
            <option value="fairy">Fairy</option>
            <option value="bunny">Bunny</option>
          </select>
        </div>
      </div>
    `;
    document.querySelector('#creatorModal .creator-panel').appendChild(panel);
  }

  function switchTab() {
    document.querySelectorAll('#creatorModal .tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('#creatorModal .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tabPremiumContent').classList.add('active');
    document.getElementById('tabPremiumBtn').classList.add('active');
  }

  window.PremiumSettings = {
    init,
    updateBg: () => {
      const mode = document.getElementById('pBgMode').value;
      if (window.PremiumBackground) window.PremiumBackground.setBackgroundMode(mode);
    },
    updateGuide: () => {
      const mascot = document.getElementById('pGuideMascot').value;
      if (window.GuideCharacter) window.GuideCharacter.setMascot(mascot);
    }
  };
})();

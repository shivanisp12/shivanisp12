/**
 * OWNER SETTINGS INJECTOR
 * Appends the controls for the new Premium Features into your Owner Settings UI.
 */
document.addEventListener('DOMContentLoaded', () => {
  const existingSettingsContainer = 
    document.querySelector('.owner-settings-container') || 
    document.querySelector('#owner-settings') || 
    document.body; // Fallback insertion

  const settingsCard = document.createElement('div');
  settingsCard.className = 'pf-settings-panel';
  settingsCard.innerHTML = `
    <h3 style="margin-top:0;">✨ Premium Suite Settings</h3>
    
    <!-- Background Experience -->
    <div style="margin-bottom:15px;">
      <label><b>Background Theme:</b></label>
      <select id="pf-set-bg" class="pf-input" style="width:100%; padding:8px; margin-top:5px;">
        <option value="fireflies">Floating Fireflies</option>
        <option value="hearts">Floating Hearts</option>
        <option value="snow">Falling Snow</option>
        <option value="video">Custom Looping Video</option>
      </select>
    </div>

    <!-- UI Sound Effects -->
    <div style="margin-bottom:15px;">
      <label>
        <input type="checkbox" id="pf-set-sound" checked> <b>Enable UI Sound Effects</b>
      </label>
    </div>

    <!-- Interactive Guide Character -->
    <div style="margin-bottom:15px;">
      <label><b>Guide Character Mascot:</b></label>
      <select id="pf-set-mascot" class="pf-input" style="width:100%; padding:8px; margin-top:5px;">
        <option value="cat">Cute Anime Cat 🐱</option>
        <option value="puppy">Cute Puppy 🐶</option>
        <option value="bunny">Magical Bunny 🐰</option>
        <option value="fox">Fox 🦊</option>
        <option value="fairy">Fairy Guide 🧚‍♀️</option>
      </select>
    </div>

    <!-- Email Webhook Endpoint -->
    <div style="margin-bottom:15px;">
      <label><b>Email Notification Webhook URL (EmailJS / Zapier):</b></label>
      <input type="url" id="pf-set-webhook" placeholder="https://api.emailjs.com/..." style="width:100%; padding:8px; margin-top:5px;">
    </div>

    <button id="pf-save-settings-btn" style="background:#4A90E2; color:#fff; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">
      Save Premium Settings
    </button>
  `;

  existingSettingsContainer.appendChild(settingsCard);

  // Bind settings saving logic
  document.getElementById('pf-save-settings-btn').addEventListener('click', () => {
    const bg = document.getElementById('pf-set-bg').value;
    const sound = document.getElementById('pf-set-sound').checked;
    const mascot = document.getElementById('pf-set-mascot').value;
    const webhook = document.getElementById('pf-set-webhook').value;

    window.PremiumSuite.Background.applyBackground(bg);
    localStorage.setItem('pf_sound_enabled', sound);
    localStorage.setItem('pf_guide_mascot', mascot);
    localStorage.setItem('pf_email_config', JSON.stringify({ webhookUrl: webhook }));

    window.PremiumSuite.Guide.updateCharacter();
    window.PremiumSuite.Sound.play('success');
    alert('Premium settings saved successfully!');
  });
});

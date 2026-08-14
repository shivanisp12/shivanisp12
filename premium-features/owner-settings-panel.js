/**
 * Celebration Verse - Owner Administrative Settings Panel
 */
class OwnerSettingsPanel {
  constructor() {
    this.container = document.getElementById('ownerModalContainer');
    this.init();
  }

  init() {
    const btn = document.getElementById('ownerPanelBtn');
    if (btn) btn.addEventListener('click', () => this.promptPasscode());
  }

  promptPasscode() {
    const input = prompt("Enter Owner Passcode:");
    if (input === window.CELEBRATION_CONFIG.ownerPasscode) {
      this.openPanel();
    } else {
      alert("Incorrect passcode!");
    }
  }

  openPanel() {
    this.container.innerHTML = `
      <div class="glass-card modal-card" style="max-width:500px; margin: 10% auto;">
        <h2>⚙️ Owner Settings</h2>
        <div style="margin:1rem 0;">
          <label>Recipient Name:</label>
          <input type="text" id="ownerRecipient" value="${window.CELEBRATION_CONFIG.recipientName}" style="width:100%; padding:0.5rem; margin-top:0.4rem;"/>
        </div>
        <div style="margin:1rem 0;">
          <label>Webhook URL:</label>
          <input type="text" id="ownerWebhook" value="${window.CELEBRATION_CONFIG.webhookUrl || ''}" style="width:100%; padding:0.5rem; margin-top:0.4rem;"/>
        </div>
        <button id="saveOwnerSettings" class="primary-btn">Save Changes</button>
        <button id="closeOwnerPanel" class="secondary-btn">Close</button>
      </div>`;
    this.container.classList.remove('hidden');

    document.getElementById('saveOwnerSettings').onclick = () => {
      window.CELEBRATION_CONFIG.recipientName = document.getElementById('ownerRecipient').value;
      window.CELEBRATION_CONFIG.webhookUrl = document.getElementById('ownerWebhook').value;
      alert("Settings Saved Successfully!");
      this.container.classList.add('hidden');
    };

    document.getElementById('closeOwnerPanel').onclick = () => {
      this.container.classList.add('hidden');
    };
  }
}

window.OwnerSettingsPanel = OwnerSettingsPanel;

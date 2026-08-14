/* ==========================================================================
   FEATURE 8 & 9: OWNER EMAIL NOTIFICATIONS & TIME CAPSULE REMINDERS
   ========================================================================== */
(function () {
  let webhookUrl = '';

  function init() {
    loadConfig();
  }

  function sendAlert(eventName, payload = {}) {
    if (!webhookUrl) return;

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        details: payload
      })
    }).catch(() => {});
  }

  function loadConfig() {
    try {
      const saved = localStorage.getItem('PREMIUM_EMAIL_CONFIG');
      if (saved) {
        webhookUrl = JSON.parse(saved).webhookUrl || '';
      }
    } catch (e) {}
  }

  window.EmailNotifications = {
    init,
    sendAlert,
    setWebhook: (url) => { webhookUrl = url; }
  };
})();

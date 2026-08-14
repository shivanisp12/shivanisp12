/**
 * Celebration Verse - Webhook & Email Notification Dispatcher
 */
class NotificationDispatcher {
  static async send(eventType, payload) {
    const webhookUrl = window.CELEBRATION_CONFIG?.webhookUrl;
    if (!webhookUrl) {
      console.log(`[Notification Simulated]: ${eventType}`, payload);
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventType,
          timestamp: new Date().toISOString(),
          data: payload
        })
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  }
}

window.NotificationDispatcher = NotificationDispatcher;

/* ==========================================================================
   MASTER PREMIUM SUITE ORCHESTRATOR
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (window.PremiumBackground) window.PremiumBackground.init();
  if (window.GuideCharacter) window.GuideCharacter.init();
  if (window.BgMusicLibrary) window.BgMusicLibrary.init();
  if (window.CinematicChapters) window.CinematicChapters.init();
  if (window.GiftBoxEnhancer) window.GiftBoxEnhancer.init();
  if (window.MiniGameEnhancer) window.MiniGameEnhancer.init();
  if (window.EmailNotifications) window.EmailNotifications.init();
  if (window.PremiumSettings) window.PremiumSettings.init();
});

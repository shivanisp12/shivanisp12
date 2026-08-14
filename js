'';
guestbookEntries.forEach(entry => {
 const item = document.createElement('div');
 item.className = 'guestbook-item';
 item.innerHTML = `<strong>${entry.name}:</strong> <span>${entry.msg}</span>`;
 list.appendChild(item);
});
}

function addGuestbookEntry() {
const nameInput = document.getElementById('gbName');
const msgInput = document.getElementById('gbMsg');
const name = nameInput.value.trim();
const msg = msgInput.value.trim();

if (!name || !msg) {
 showToast("Please enter both your name and a wish!");
 return;
}

guestbookEntries.unshift({ name, msg });
renderGuestbook();
nameInput.value = '';
msgInput.value = '';
showToast("Wish posted to guestbook!");
playSoftTone(600, 0.3);
}

function saveTimeCapsule() {
const date = document.getElementById('tcDate').value;
const msg = document.getElementById('tcMsg').value.trim();
const status = document.getElementById('tcStatus');

if (!date || !msg) {
 showToast("Please select a date and enter a message!");
 return;
}

status.innerText = `🔒 Time Capsule Sealed until ${date}!`;
showToast("Time Capsule successfully sealed!");
playSoftTone(523.25, 0.4);
}

function initWishTree() {
const canvas = document.getElementById('treeCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

// Draw stylized trunk
ctx.fillStyle = '#5d4037';
ctx.beginPath();
ctx.moveTo(canvas.width / 2 - 15, canvas.height);
ctx.lineTo(canvas.width / 2 + 15, canvas.height);
ctx.lineTo(canvas.width / 2 + 8, canvas.height - 180);
ctx.lineTo(canvas.width / 2 - 8, canvas.height - 180);
ctx.closePath();
ctx.fill();

// Draw foliage circles
const foliageColors = ['#f472b6', '#ff758f', '#fbcfe8', '#facc15'];
for (let i = 0; i < 35; i++) {
 const x = canvas.width / 2 + (Math.random() - 0.5) * 220;
 const y = canvas.height - 180 + (Math.random() - 0.5) * 140;
 const radius = 20 + Math.random() * 25;
 ctx.fillStyle = foliageColors[i % foliageColors.length];
 ctx.beginPath();
 ctx.arc(x, y, radius, 0, Math.PI * 2);
 ctx.fill();
}
}

/* ======================================================================
 12. SAKURA CANVAS ANIMATION (FEATURE 1)
 ====================================================================== 
*/
let sakuraPetals = [];
function initSakuraCanvas() {
const canvas = document.getElementById('sakuraCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

sakuraPetals = Array.from({ length: 30 }, () => ({
 x: Math.random() * canvas.width,
 y: Math.random() * canvas.height,
 r: 3 + Math.random() * 5,
 dX: -1 + Math.random() * 2,
 dY: 1 + Math.random() * 2.5,
 rot: Math.random() * 360,
 rotSpeed: -2 + Math.random() * 4
}));

function animateSakura() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 sakuraPetals.forEach(p => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rot * Math.PI) / 180);
  ctx.fillStyle = 'rgba(244, 114, 182, 0.7)';
  ctx.beginPath();
  ctx.ellipse(0, 0, p.r, p.r / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  p.x += p.dX;
  p.y += p.dY;
  p.rot += p.rotSpeed;

  if (p.y > canvas.height) {
   p.y = -10;
   p.x = Math.random() * canvas.width;
  }
 });
 requestAnimationFrame(animateSakura);
}
animateSakura();
}

/* ======================================================================
 13. SECRET VAULT & PIN UNLOCK
 ====================================================================== 
*/
function unlockVault() {
const pinInput = document.getElementById('vaultPin');
const cfg = window.CELEBRATION_CONFIG;

if (pinInput.value === cfg.vaultPin) {
 showToast("Vault Unlocked!");
 playSoftTone(880, 0.5);
 triggerConfettiBurst(80);
 alert(`🔓 SECRET MESSAGE:\n\n${cfg.vaultSecretMsg}`);
} else {
 showToast("Incorrect PIN code! Check the hint.");
 playSoftTone(250, 0.4);
}
}

/* ======================================================================
 14. INVITATION RSVP & ICS CALENDAR DOWNLOAD
 ====================================================================== 
*/
function submitRSVP(status) {
const statusEl = document.getElementById('rsvpStatus');
statusEl.innerText = `RSVP Status Recorded: ${status}!`;
playSoftTone(700, 0.3);
showToast(`Thank you for confirming (${status})!`);
}

function downloadICS() {
const cfg = window.CELEBRATION_CONFIG;
const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Celebration Verse//EN
BEGIN:VEVENT
SUMMARY:${cfg.eventTitle}
DESCRIPTION:${cfg.eventDesc}
LOCATION:${cfg.venue}
DTSTART:20261014T190000Z
DTEND:20261014T220000Z
END:VEVENT
END:VCALENDAR`;

const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.setAttribute('download', 'celebration_event.ics');
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
showToast("Calendar event file downloaded!");
}

/* ======================================================================
 15. PROPOSAL QUESTION & FINALE CELEBRATION
 ====================================================================== 
*/
function escapeNoButton() {
if (accMode) return;
const btnNo = document.getElementById('btnNo');
const x = (Math.random() - 0.5) * 260;
const y = (Math.random() - 0.5) * 160;
btnNo.style.transform = `translate(${x}px, ${y}px)`;
playSoftTone(300, 0.1);
}

function toggleAccessibilityMode(checked) {
accMode = checked;
const btnNo = document.getElementById('btnNo');
btnNo.style.transform = 'none';
showToast(accMode ? "Accessibility Mode: Enabled" : "Accessibility Mode: Disabled");
}

function triggerYesCelebration() {
const card = document.getElementById('proposalResultCard');
card.style.display = 'block';
card.scrollIntoView({ behavior: 'smooth', block: 'center' });
playSoftTone(880, 0.8, 'triangle');

const finaleType = window.CELEBRATION_CONFIG.selectedFinale;
if (finaleType === 'confetti' || finaleType === 'flowerStorm') {
 triggerConfettiBurst(150);
} else {
 triggerConfettiBurst(100);
}
}

/* ======================================================================
 16. CANVAS OVERLAY EFFECTS (CONFETTI / FX)
 ====================================================================== 
*/
function triggerConfettiBurst(count = 50) {
const canvas = document.getElementById('fxCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array.from({ length: count }, () => ({
 x: canvas.width / 2,
 y: canvas.height / 2,
 vx: (Math.random() - 0.5) * 18,
 vy: (Math.random() - 0.7) * 18,
 size: Math.random() * 8 + 4,
 color: ['#ff758f', '#ffb703', '#4ade80', '#38bdf8', '#c084fc'][Math.floor(Math.random() * 5)],
 life: 100
}));

function renderFX() {
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 let active = false;
 particles.forEach(p => {
  if (p.life > 0) {
   active = true;
   ctx.fillStyle = p.color;
   ctx.beginPath();
   ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
   ctx.fill();
   p.x += p.vx;
   p.y += p.vy;
   p.vy += 0.25; // gravity
   p.life--;
  }
 });
 if (active) requestAnimationFrame(renderFX);
}
renderFX();
}

/* ======================================================================
 17. OWNER CONTROL CENTER & AUTHENTICATION MODALS
 ====================================================================== 
*/
function openCreatorModal() {
if (!isOwnerAuthenticated) {
 document.getElementById('ownerAuthModal').style.display = 'flex';
} else {
 document.getElementById('creatorModal').style.display = 'flex';
 populateCreatorForm();
}
}

function closeCreatorModal() {
document.getElementById('creatorModal').style.display = 'none';
}

function closeOwnerAuthModal() {
document.getElementById('ownerAuthModal').style.display = 'none';
}

function verifyOwnerAccess() {
const pwd = document.getElementById('ownerPasscodePrompt').value;
if (pwd === window.CELEBRATION_CONFIG.ownerPasscode) {
 isOwnerAuthenticated = true;
 closeOwnerAuthModal();
 document.getElementById('creatorModal').style.display = 'flex';
 populateCreatorForm();
 showToast("Owner Authentication Successful!");
} else {
 showToast("Incorrect Owner Passcode!");
}
}

function switchCreatorTab(tabId) {
document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

event.target.classList.add('active');
document.getElementById(tabId).classList.add('active');
}

function populateCreatorForm() {
const cfg = window.CELEBRATION_CONFIG;
document.getElementById('edtRecipient').value = cfg.recipientName || '';
document.getElementById('edtSender').value = cfg.senderName || '';
document.getElementById('edtOccasion').value = cfg.occasion || '';
document.getElementById('edtIntroHeading').value = cfg.introHeading || '';
document.getElementById('edtMainMessage').value = cfg.mainMessage || '';
document.getElementById('edtGiftTitle').value = cfg.giftTitle || '';
document.getElementById('edtGiftText').value = cfg.giftText || '';
document.getElementById('edtLetterPages').value = JSON.stringify(cfg.letterPages, null, 2);
document.getElementById('edtFlowers').value = JSON.stringify(cfg.flowers, null, 2);
document.getElementById('edtMemories').value = JSON.stringify(cfg.memories, null, 2);
document.getElementById('edtCountdown').value = cfg.countdownTarget || '';
document.getElementById('edtTimeline').value = JSON.stringify(cfg.timeline, null, 2);
document.getElementById('edtEventTitle').value = cfg.eventTitle || '';
document.getElementById('edtEventDate').value = cfg.eventDate || '';
document.getElementById('edtEventTime').value = cfg.eventTime || '';
document.getElementById('edtVenue').value = cfg.venue || '';
document.getElementById('edtPin').value = cfg.vaultPin || '';
document.getElementById('edtSecretMsg').value = cfg.vaultSecretMsg || '';
document.getElementById('edtQuizQuestion').value = cfg.quizQuestion || '';
document.getElementById('edtQuizCorrect').value = cfg.quizCorrect || '';
document.getElementById('edtQuizWrong').value = cfg.quizWrong || '';
document.getElementById('edtFinale').value = cfg.selectedFinale || 'confetti';
document.getElementById('edtOwnerPasscode').value = cfg.ownerPasscode || '';

renderPinterestManagerList();
}

function saveCreatorConfig() {
const cfg = window.CELEBRATION_CONFIG;
cfg.recipientName = document.getElementById('edtRecipient').value;
cfg.senderName = document.getElementById('edtSender').value;
cfg.occasion = document.getElementById('edtOccasion').value;
cfg.introHeading = document.getElementById('edtIntroHeading').value;
cfg.mainMessage = document.getElementById('edtMainMessage').value;
cfg.giftTitle = document.getElementById('edtGiftTitle').value;
cfg.giftText = document.getElementById('edtGiftText').value;

try { cfg.letterPages = JSON.parse(document.getElementById('edtLetterPages').value); } catch (e) {}
try { cfg.flowers = JSON.parse(document.getElementById('edtFlowers').value); } catch (e) {}
try { cfg.memories = JSON.parse(document.getElementById('edtMemories').value); } catch (e) {}
try { cfg.timeline = JSON.parse(document.getElementById('edtTimeline').value); } catch (e) {}

cfg.countdownTarget = document.getElementById('edtCountdown').value;
cfg.eventTitle = document.getElementById('edtEventTitle').value;
cfg.eventDate = document.getElementById('edtEventDate').value;
cfg.eventTime = document.getElementById('edtEventTime').value;
cfg.venue = document.getElementById('edtVenue').value;
cfg.vaultPin = document.getElementById('edtPin').value;
cfg.vaultSecretMsg = document.getElementById('edtSecretMsg').value;
cfg.quizQuestion = document.getElementById('edtQuizQuestion').value;
cfg.quizCorrect = document.getElementById('edtQuizCorrect').value;
cfg.quizWrong = document.getElementById('edtQuizWrong').value;
cfg.selectedFinale = document.getElementById('edtFinale').value;
cfg.ownerPasscode = document.getElementById('edtOwnerPasscode').value;

localStorage.setItem('celebration_cfg', JSON.stringify(cfg));
applyConfigToUI();
closeCreatorModal();
showToast("Settings Saved Successfully!");
}

function resetCreatorConfig() {
if (confirm("Reset configuration to default settings?")) {
 localStorage.removeItem('celebration_cfg');
 location.reload();
}
}

/* ======================================================================
 MEDIA MANAGER HELPERS (PINTEREST & RETRO TV)
 ====================================================================== 
*/
function addPinterestPhotoFromLink() {
const url = document.getElementById('pinPhotoUrl').value.trim();
const caption = document.getElementById('pinPhotoCaption').value.trim();
if (!url) return;
window.CELEBRATION_CONFIG.pinterestPhotos.push({ img: url, caption: caption });
document.getElementById('pinPhotoUrl').value = '';
document.getElementById('pinPhotoCaption').value = '';
renderPinterestBoard();
renderPinterestManagerList();
showToast("Photo link added to Pinterest board!");
}

function uploadPinterestPhoto(event) {
const file = event.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function (e) {
 window.CELEBRATION_CONFIG.pinterestPhotos.push({ img: e.target.result, caption: file.name });
 renderPinterestBoard();
 renderPinterestManagerList();
 showToast("Photo uploaded from device!");
};
reader.readAsDataURL(file);
}

function renderPinterestManagerList() {
const list = document.getElementById('pinterestManagerList');
if (!list) return;
list.innerHTML = '';
const photos = window.CELEBRATION_CONFIG.pinterestPhotos || [];
photos.forEach((p, idx) => {
 const item = document.createElement('div');
 item.style.display = 'flex';
 item.style.justifyContent = 'space-between';
 item.style.alignItems = 'center';
 item.style.padding = '0.3rem 0';
 item.style.borderBottom = '1px solid #eee';
 item.style.fontSize = '0.8rem';
 item.innerHTML = `<span>${p.caption || 'Photo ' + (idx + 1)}</span>
 <button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.75rem;" onclick="removePinterestPhoto(${idx})">Remove</button>`;
 list.appendChild(item);
});
}

function removePinterestPhoto(idx) {
window.CELEBRATION_CONFIG.pinterestPhotos.splice(idx, 1);
renderPinterestBoard();
renderPinterestManagerList();
showToast("Photo removed!");
}

function addRetroVideoFromLink() {
const url = document.getElementById('retroVideoUrl').value.trim();
const title = document.getElementById('retroVideoTitleInput').value.trim() || 'Custom Channel';
if (!url) return;

const isVid = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
window.CELEBRATION_CONFIG.retroTvMedia.push({
 type: isVid ? 'video' : 'image',
 src: url,
 title: title
});

document.getElementById('retroVideoUrl').value = '';
document.getElementById('retroVideoTitleInput').value = '';
initRetroTv();
showToast("Retro TV channel media added!");
}

/* ======================================================================
 BACKGROUND MUSIC (FEATURE 2) IMPLEMENTATION
 ====================================================================== 
*/
let bgAudioPlayer = null;

function toggleMusicSourceInputs(val) {
const groupUpload = document.getElementById('groupMusicUpload');
const groupUrl = document.getElementById('groupMusicUrl');
groupUpload.style.display = (val === 'uploadAudio' || val === 'uploadVideo') ? 'block' : 'none';
groupUrl.style.display = (val === 'audioUrl' || val === 'videoUrl' || val === 'youtubeUrl') ? 'block' : 'none';
}

function handleMusicFileUpload(event) {
const file = event.target.files[0];
if (!file) return;
const url = URL.createObjectURL(file);
playBackgroundMusicSrc(url);
document.getElementById('musicStatusInfo').innerText = `Status: Playing uploaded file (${file.name})`;
}

function previewBackgroundMusic() {
const type = document.getElementById('edtMusicSourceType').value;
const urlInput = document.getElementById('edtMusicUrlInput').value.trim();

if (type === 'audioUrl' || type === 'videoUrl') {
 if (!urlInput) { showToast("Enter a valid URL!"); return; }
 playBackgroundMusicSrc(urlInput);
 document.getElementById('musicStatusInfo').innerText = "Status: Playing media URL";
} else if (type === 'youtubeUrl') {
 if (!urlInput) { showToast("Enter YouTube URL!"); return; }
 const embedContainer = document.getElementById('youtubeEmbedContainer');
 embedContainer.style.display = 'block';
 let ytId = urlInput.split('v=')[1] || urlInput.split('/').pop();
 if (ytId.includes('&')) ytId = ytId.split('&')[0];
 embedContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1" allow="autoplay"></iframe>`;
 document.getElementById('musicStatusInfo').innerText = "Status: YouTube video loaded";
}
}

function playBackgroundMusicSrc(src) {
if (bgAudioPlayer) { bgAudioPlayer.pause(); }
bgAudioPlayer = new Audio(src);
bgAudioPlayer.volume = parseInt(document.getElementById('edtMusicVol').value, 10) / 100;
bgAudioPlayer.loop = document.getElementById('edtMusicLoop').checked;
bgAudioPlayer.play().catch(() => showToast("Autoplay prevented by browser. Click play."));
}

function pauseBackgroundMusic() {
if (bgAudioPlayer) {
 bgAudioPlayer.pause();
 document.getElementById('musicStatusInfo').innerText = "Status: Paused";
}
}

function stopBackgroundMusic() {
if (bgAudioPlayer) {
 bgAudioPlayer.pause();
 bgAudioPlayer.currentTime = 0;
 document.getElementById('musicStatusInfo').innerText = "Status: Stopped";
}
const yt = document.getElementById('youtubeEmbedContainer');
yt.innerHTML = ''; yt.style.display = 'none';
}

function resetMusicSettings() {
stopBackgroundMusic();
document.getElementById('edtMusicSourceType').value = 'none';
toggleMusicSourceInputs('none');
showToast("Music settings reset!");
}

/* ======================================================================
 18. APPLICATION INITIALIZATION & CONFIG APPLY
 ====================================================================== 
*/
function applyConfigToUI() {
const cfg = window.CELEBRATION_CONFIG;
document.getElementById('cfgOccasion').innerText = cfg.occasion;
document.getElementById('cfgIntroHeading').innerHTML = `${cfg.introHeading.replace(cfg.recipientName, `<span class="handwriting" style="color:var(--primary)">${cfg.recipientName}</span>`)}`;
document.getElementById('cfgRecipientName').innerText = cfg.recipientName;
document.getElementById('cfgMainMessage').innerText = cfg.mainMessage;
document.getElementById('cfgGiftTitle').innerText = cfg.giftTitle;
document.getElementById('cfgGiftText').innerText = cfg.giftText;
document.getElementById('cfgSenderSign').innerText = `With all my love, ${cfg.senderName}`;
document.getElementById('cfgEventTitle').innerText = cfg.eventTitle;
document.getElementById('cfgEventDesc').innerText = cfg.eventDesc;
document.getElementById('cfgEventDate').innerText = cfg.eventDate;
document.getElementById('cfgEventTime').innerText = cfg.eventTime;
document.getElementById('cfgVenue').innerText = cfg.venue;
document.getElementById('cfgProposalQuestion').innerText = cfg.proposalQuestion;

if (cfg.theme) {
 document.documentElement.setAttribute('data-theme', cfg.theme);
}

initBouquet();
renderMemory();
initPhotoWall();
renderPinterestBoard();
initRetroTv();
initTimeline();
renderGuestbook();
initWishTree();
initSakuraCanvas();
updateCountdown();
}

window.addEventListener('DOMContentLoaded', () => {
applyConfigToUI();
});
</script>
</body>
</html>

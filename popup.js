// Predefined local images (replace names to match your images/ folder)
const IMAGES = [
  'images/14.jpeg',
  'images/5.jpeg',
  'images/9.jpeg',
  'images/8.jpeg',
  'images/3.jpeg',
  'images/17.jpeg',
  'images/18.jpeg',
  'images/15.jpeg',
  'images/11.jpeg',
  'images/19.jpeg'
];

const QUOTES = [
  "You're my favorite notification.",
  "With you, every moment feels like sunshine.",
  "You + Me = Always.",
  "My heart smiles when you do.",
  "You're my today and all of my tomorrows.",
  "Falling for you, over and over.",
  "You are my happy place.",
  "In case you forgot: you're wonderful.",
  "Home is wherever I’m with you.",
  "I choose you. Always."
];

// Per-image background music tracks (place files in images/)
const BGMS = [
  'images/bgm1.mp3',
  'images/bgm2.mp3',
  'images/bgm3.mp3',
  'images/bgm4.mp3',
  'images/bgm5.mp3',
  'images/bgm6.mp3',
  'images/bgm7.mp3',
  'images/bgm8.mp3',
  'images/bgm9.mp3',
  'images/bgm10.mp3'
];

const state = {
  index: 0
};

const els = {
  main: null,
  prev: null,
  next: null,
  thumbs: null,
  thumbTpl: null,
  heartsLayer: null,
  bgm: null
};

document.addEventListener('DOMContentLoaded', () => {
  els.main = document.getElementById('main-image');
  els.prev = document.getElementById('prev-btn');
  els.next = document.getElementById('next-btn');
  els.thumbs = document.getElementById('thumbnails');
  els.thumbTpl = document.getElementById('thumb-template');
  els.heartsLayer = document.getElementById('hearts-layer');
  els.bgm = document.getElementById('bgm');
  els.caption = document.getElementById('caption');

  buildThumbnails();
  setImage(0);
  wireControls();
  startHearts();
  initBgm();
});

function buildThumbnails() {
  els.thumbs.innerHTML = '';
  IMAGES.forEach((src, i) => {
    const node = els.thumbTpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector('img');
    img.src = src;
    img.alt = `Scene ${i + 1}`;
    img.dataset.index = i.toString();
    node.addEventListener('click', () => setImage(i));
    els.thumbs.appendChild(node);
  });
  updateActiveThumb();
}

function setImage(i) {
  if (!IMAGES.length) return;
  state.index = (i + IMAGES.length) % IMAGES.length;

  // Crossfade by swapping src with a quick opacity tween
  els.main.classList.remove('fade-swap-in');
  void els.main.offsetWidth; // restart animation
  els.main.src = IMAGES[state.index];
  els.main.classList.add('fade-swap-in');

  if (els.caption) {
    els.caption.textContent = QUOTES[state.index] || '';
  }

  // Switch background track to match the current scene
  switchBgm(state.index);

  updateActiveThumb();
}

function nextImage() {
  setImage(state.index + 1);
}

function prevImage() {
  setImage(state.index - 1);
}

function updateActiveThumb() {
  const buttons = els.thumbs.querySelectorAll('.thumb-btn');
  buttons.forEach((btn, idx) => {
    if (idx === state.index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function wireControls() {
  els.next.addEventListener('click', nextImage);
  els.prev.addEventListener('click', prevImage);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

// Decorative floating hearts (gentle, unobtrusive)
function startHearts() {
  setInterval(() => spawnHeart(), 1400);
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnHeart(), i * 300);
  }
}

function spawnHeart() {
  if (!els.heartsLayer) return;
  const heart = document.createElement('div');
  heart.className = 'heart';
  const x = Math.random() * 100;
  const scale = 0.6 + Math.random() * 0.7;
  const duration = 3000 + Math.random() * 2000;

  heart.style.left = `${x}%`;
  heart.style.transform = `translateX(-50%) scale(${scale})`;
  heart.style.animationDuration = `${duration}ms`;
  els.heartsLayer.appendChild(heart);

  heart.addEventListener('animationend', () => {
    heart.remove();
  });
}

// Background music: start muted to pass autoplay policy, unmute on first interaction
function initBgm() {
  const a = els.bgm;
  if (!a) return;
  a.muted = true;
  a.volume = 0.5;
  // Load initial track for first scene if present
  if (BGMS[0]) {
    a.src = BGMS[0];
  }
  // Try to start playback muted
  try { a.play().catch(() => {}); } catch (_) {}

  const unlock = () => {
    a.muted = false;
    // Ensure it plays if it was paused
    try { a.play().catch(() => {}); } catch (_) {}
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('click', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function switchBgm(idx) {
  const a = els.bgm;
  if (!a) return;
  const src = BGMS[idx];
  if (!src) return;
  // If already on this source, do nothing
  try {
    if (a.currentSrc && a.currentSrc.endsWith(src)) return;
  } catch (_) {}
  // Swap source and play
  a.pause();
  a.src = src;
  try { a.play().catch(() => {}); } catch (_) {}
}

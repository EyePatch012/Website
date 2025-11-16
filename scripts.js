const trailCount = 10;
const trailElements = [];

// Helper to get random bright HSL color
function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 80 + Math.random() * 20; // 80-100%
  const lightness = 50 + Math.random() * 30;  // 50-80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Create trail elements and append to body
for (let i = 0; i < trailCount; i++) {
  const div = document.createElement('div');
  div.classList.add('cursor-trail');

  // Initial random color + glow
  const color = getRandomBrightColor();
  div.style.backgroundColor = color;
  div.style.boxShadow = `
    0 0 6px ${color},
    0 0 15px ${color},
    0 0 25px ${color},
    inset 0 0 10px ${color}
  `;

  document.body.appendChild(div);
  trailElements.push(div);
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Positions array for smooth trailing
const positions = Array.from({ length: trailCount }, () => ({ x: mouseX, y: mouseY }));

// Update mouse position on move
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Linear interpolation helper for smooth movement
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function animateTrail() {
  // Smoothly move the first element toward mouse
  positions[0].x = lerp(positions[0].x, mouseX, 0.2);
  positions[0].y = lerp(positions[0].y, mouseY, 0.2);

  // Each subsequent element follows the previous one
  for (let i = 1; i < trailCount; i++) {
    positions[i].x = lerp(positions[i].x, positions[i - 1].x, 0.2);
    positions[i].y = lerp(positions[i].y, positions[i - 1].y, 0.2);
  }

  // Update position and subtle scale pulse of each trail element
  trailElements.forEach((el, index) => {
    const pos = positions[index];
    el.style.left = (pos.x - el.offsetWidth / 2) + 'px';
    el.style.top = (pos.y - el.offsetHeight / 2) + 'px';
    el.style.opacity = (trailCount - index) / trailCount;

    const scale = 0.85 + 0.15 * Math.sin(Date.now() / 500 + index);
    el.style.transform = `scale(${scale})`;
  });

  requestAnimationFrame(animateTrail);
}

// Function to update trail colors randomly with glow
function updateTrailColors() {
  trailElements.forEach(el => {
    const color = getRandomBrightColor();
    el.style.backgroundColor = color;
    el.style.boxShadow = `
      0 0 6px ${color},
      0 0 15px ${color},
      0 0 25px ${color},
      inset 0 0 10px ${color}
    `;
  });
}

// Update colors every 2 seconds smoothly
setInterval(updateTrailColors, 2000);

// Start the animation loop
animateTrail();



// Typewriter effect
const text = "Ray";
const speed = 150;
let index = 0;

function typeWriter() {
  if (index < text.length) {
    document.getElementById("typewriter").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}

window.addEventListener('load', () => {
  const typewriterTarget = document.getElementById('typewriter');
  if (typewriterTarget) {
    typewriterTarget.innerHTML = '';
    typeWriter();
  }
  initRevealAnimations();
  initHeaderScrollEffect();
});


// Scatter images setup
const scatterContainer = document.createElement('div');
scatterContainer.classList.add('background-scatter');
document.body.appendChild(scatterContainer);

const images = ['Images/sc1.png', 'Images/sc2.png', 'Images/sc3.png', 'Images/0.png', 'Images/1.png'];
const numScatters = 20;

function getRandomDropShadow() {
  const x = (Math.random() * 10 - 5).toFixed(1) + 'px';
  const y = (Math.random() * 10 - 5).toFixed(1) + 'px';
  const blur = (5 + Math.random() * 5).toFixed(1) + 'px';
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 30;
  const lightness = 50 + Math.random() * 20;
  const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`;
  return `${x} ${y} ${blur} ${color}`;
}

function applyRandomGlow(el) {
  const glow = getRandomDropShadow();
  el.style.filter = `drop-shadow(${glow})`;
}

// Create and position scatter images with glow
for (let i = 0; i < numScatters; i++) {
  const img = document.createElement('img');
  img.src = images[i % images.length];
  img.classList.add('scatter-img');

  img.style.left = Math.random() * window.innerWidth + 'px';
  img.style.top = Math.random() * window.innerHeight + 'px';
  img.style.animationDelay = (Math.random() * 8) + 's';

  scatterContainer.appendChild(img);

  applyRandomGlow(img);
}

// Update scatter glow every 3 seconds
setInterval(() => {
  document.querySelectorAll('.scatter-img').forEach(img => {
    applyRandomGlow(img);
  });
}, 3000);

function initRevealAnimations() {
  const revealTargets = document.querySelectorAll('.reveal, .reveal-card');
  if (!revealTargets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  revealTargets.forEach(target => observer.observe(target));
}

function initHeaderScrollEffect() {
  const header = document.querySelector('.page-header');
  if (!header) return;

  const toggleHeaderState = () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', toggleHeaderState, { passive: true });
  toggleHeaderState();
}

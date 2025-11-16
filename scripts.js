const trailCount = 10;
const trailElements = [];

function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 80 + Math.random() * 20;
  const lightness = 50 + Math.random() * 30;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

for (let i = 0; i < trailCount; i++) {
  const div = document.createElement('div');
  div.classList.add('cursor-trail');

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
const positions = Array.from({ length: trailCount }, () => ({ x: mouseX, y: mouseY }));

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function animateTrail() {
  positions[0].x = lerp(positions[0].x, mouseX, 0.2);
  positions[0].y = lerp(positions[0].y, mouseY, 0.2);

  for (let i = 1; i < trailCount; i++) {
    positions[i].x = lerp(positions[i].x, positions[i - 1].x, 0.2);
    positions[i].y = lerp(positions[i].y, positions[i - 1].y, 0.2);
  }

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

setInterval(updateTrailColors, 2000);
animateTrail();
function initTypewriter() {
  const typewriterTarget = document.getElementById('typewriter');
  if (!typewriterTarget) return;
  const text = typewriterTarget.dataset.text || typewriterTarget.textContent.trim();
  const speed = 150;
  let index = 0;
  typewriterTarget.textContent = '';

  (function typeWriter() {
    if (index < text.length) {
      typewriterTarget.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, speed);
    }
  })();
}

const scatterImages = ['Images/sc1.png', 'Images/sc2.png', 'Images/sc3.png', 'Images/0.png', 'Images/1.png'];

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

function positionRandomly(el) {
  el.style.left = 5 + Math.random() * 90 + '%';
  el.style.top = 5 + Math.random() * 90 + '%';
  el.style.animationDelay = (Math.random() * 8) + 's';
}

function initAquariumIcons() {
  let aquarium = document.querySelector('.background-scatter');
  if (!aquarium) {
    aquarium = document.createElement('div');
    aquarium.classList.add('background-scatter');
    aquarium.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aquarium);
  }

  if (!aquarium.childElementCount) {
    const numScatters = window.innerWidth < 600 ? 12 : 20;
    for (let i = 0; i < numScatters; i++) {
      const img = document.createElement('img');
      img.src = scatterImages[i % scatterImages.length];
      img.alt = 'Floating decorative icon';
      img.classList.add('scatter-img');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'img');
      positionRandomly(img);
      applyRandomGlow(img);
      aquarium.appendChild(img);
    }
  }

  const fishIcons = Array.from(aquarium.querySelectorAll('.scatter-img'));
  if (!fishIcons.length) return;

  const fishData = fishIcons.map(icon => ({
    el: icon,
    driftSpeed: 0.15 + Math.random() * 0.25,
    driftRange: 12 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2
  }));

  let pointer = { x: 0, y: 0, active: false };

  window.addEventListener('pointermove', event => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });

  function animateFish(time) {
    fishData.forEach(fish => {
      const driftX = Math.cos((time / 1000) * fish.driftSpeed + fish.phase) * fish.driftRange;
      const driftY = Math.sin((time / 1000) * fish.driftSpeed + fish.phase) * fish.driftRange;

      let repelX = 0;
      let repelY = 0;

      if (pointer.active) {
        const rect = fish.el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX - pointer.x;
        const dy = centerY - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 160) {
          const strength = (160 - distance) / 160;
          repelX = dx * strength * 0.8;
          repelY = dy * strength * 0.8;
        }
      }

      fish.el.style.transform = `translate(${driftX + repelX}px, ${driftY + repelY}px) rotate(${driftX * 0.3}deg)`;
    });

    requestAnimationFrame(animateFish);
  }

  requestAnimationFrame(animateFish);

  const dartAway = icon => {
    icon.classList.add('is-darting');
    positionRandomly(icon);
    setTimeout(() => icon.classList.remove('is-darting'), 900);
  };

  fishIcons.forEach(icon => {
    icon.addEventListener('click', () => dartAway(icon));
    icon.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        dartAway(icon);
      }
    });
  });

  setInterval(() => fishIcons.forEach(applyRandomGlow), 4000);
}

window.addEventListener('load', () => {
  initTypewriter();
  initRevealAnimations();
  initHeaderScrollEffect();
  initAquariumIcons();
});

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

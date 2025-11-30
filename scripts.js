const trailCount = 10;
const trailElements = [];

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
});

function getRandomBrightColor() {
  const shade = 170 + Math.random() * 70;
  const value = Math.min(255, Math.round(shade));
  return `rgb(${value}, ${value}, ${value})`;
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
  const tone = 160 + Math.random() * 80;
  const value = Math.min(255, Math.round(tone));
  const color = `rgba(${value}, ${value}, ${value}, 0.7)`;
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
  initMatrixRain();
  initContactToggle();
  initArtGallery();
  initPageTransitions();
});

function initMatrixRain() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-rain';
  canvas.className = 'matrix-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const context = canvas.getContext('2d');
  document.body.prepend(canvas);

  const glyphs = '01ABCDEFGHIJKLMNOPQRSTUVWXYZあエイウエオカキクケコサシスセソ未来雨霧電光影';
  const palette = ['#e7fff0', '#d5f5e1', '#c1e8d3', '#b4ddc6'];

  let columns = [];
  let width = 0;
  let height = 0;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const estimatedFont = 18;
    const columnCount = Math.max(8, Math.floor(width / estimatedFont));
    columns = Array.from({ length: columnCount }, (_, index) => {
      const fontSize = 14 + Math.random() * 8;
      const speed = 0.9 + Math.random() * 1.6;
      return {
        x: index * (width / columnCount),
        y: Math.random() * height,
        fontSize,
        speed,
      };
    });
  };

  const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
  const randomColor = () => palette[Math.floor(Math.random() * palette.length)];

  const draw = () => {
    context.fillStyle = 'rgba(11, 11, 11, 0.08)';
    context.fillRect(0, 0, width, height);

    columns.forEach(column => {
      context.font = `${column.fontSize}px 'Oxanium', monospace`;
      context.fillStyle = randomColor();
      context.fillText(randomGlyph(), column.x, column.y);

      column.y += column.fontSize * column.speed;
      if (column.y > height + column.fontSize && Math.random() > 0.965) {
        column.y = -Math.random() * 50;
        column.fontSize = 14 + Math.random() * 8;
        column.speed = 0.9 + Math.random() * 1.6;
      }
    });

    requestAnimationFrame(draw);
  };

  resizeCanvas();
  draw();
  window.addEventListener('resize', resizeCanvas);
}

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

function initContactToggle() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;

  const toggleButton = contactSection.querySelector('.contact-toggle');
  const panel = contactSection.querySelector('.contact-panel');
  if (!toggleButton || !panel) return;

  const setExpanded = expanded => {
    toggleButton.setAttribute('aria-expanded', expanded);
    panel.setAttribute('aria-hidden', !expanded);
    contactSection.classList.toggle('contact-open', expanded);
    toggleButton.textContent = expanded ? 'Close communication link' : 'Open communication link';
  };

  setExpanded(false);

  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded);
  });

  if (window.location.hash === '#contact') {
    setExpanded(true);
  }

  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', () => setTimeout(() => setExpanded(true), 250));
  });
}

function initArtGallery() {
  const gallery = document.getElementById('art-gallery');
  if (!gallery) return;

  const artFiles = ['piece-1.jpg', 'piece-2.jpg', 'piece-3.jpg', 'piece-4.jpg', 'piece-5.jpg', 'piece-6.jpg', 'piece-7.jpg'];
  const fragment = document.createDocumentFragment();

  const lightbox = createLightbox();
  const openLightbox = (src, alt) => {
    lightbox.image.src = src;
    lightbox.image.alt = alt;
    lightbox.root.classList.add('is-open');
    lightbox.root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightbox.closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.root.classList.remove('is-open');
    lightbox.root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightbox.image.src = '';
  };

  lightbox.closeButton.addEventListener('click', closeLightbox);
  lightbox.root.addEventListener('click', event => {
    if (event.target === lightbox.root) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.root.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  artFiles.forEach((file, index) => {
    const frame = document.createElement('figure');
    frame.className = 'art-frame lift-surface';
    frame.tabIndex = 0;

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = `Artworks/${file}`;
    const altText = `Art piece ${index + 1}`;
    img.alt = altText;
    img.addEventListener('error', () => {
      frame.classList.add('art-missing');
      frame.innerHTML = `<div class="art-placeholder">Add <code>${file}</code> to the artworks folder.</div>`;
    }, { once: true });

    const triggerLightbox = () => openLightbox(img.src, altText);

    frame.addEventListener('click', triggerLightbox);
    frame.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        triggerLightbox();
      }
    });

    frame.appendChild(img);
    fragment.appendChild(frame);
  });

  gallery.appendChild(fragment);
}

function createLightbox() {
  const existing = document.getElementById('art-lightbox');
  if (existing) {
    return {
      root: existing,
      image: existing.querySelector('img'),
      closeButton: existing.querySelector('.lightbox-close'),
    };
  }

  const lightbox = document.createElement('div');
  lightbox.id = 'art-lightbox';
  lightbox.className = 'art-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', 'Close artwork');
  closeButton.textContent = '×';

  const image = document.createElement('img');
  image.alt = '';

  const content = document.createElement('div');
  content.className = 'art-lightbox-content';
  content.setAttribute('role', 'dialog');
  content.setAttribute('aria-modal', 'true');
  content.setAttribute('aria-label', 'Expanded artwork');
  content.appendChild(closeButton);
  content.appendChild(image);

  lightbox.appendChild(content);
  document.body.appendChild(lightbox);

  return { root: lightbox, image, closeButton };
}

function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  const hideOverlay = () => overlay.classList.add('is-hidden');
  const showOverlay = () => overlay.classList.remove('is-hidden');

  setTimeout(hideOverlay, 400);
  window.addEventListener('pageshow', () => hideOverlay());

  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;

    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showOverlay();
      setTimeout(() => {
        window.location.href = url.href;
      }, 450);
    });
  });
}

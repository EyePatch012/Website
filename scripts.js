// ===== Cursor trail setup =====
// This section builds a glowing trail behind the cursor. Increase `trailCount`
// to add more particles or tweak `getRandomBrightColor` for a different palette.
const trailCount = 10;
const trailElements = [];

// Mark the document as JS-enabled to allow progressive enhancement styles.
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
});

// Generates a near-white RGB color used for the glowing dots.
function getRandomBrightColor() {
  const shade = 170 + Math.random() * 70;
  const value = Math.min(255, Math.round(shade));
  return `rgb(${value}, ${value}, ${value})`;
}

// Build the glowing dots that follow the cursor.
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

// Track current mouse coordinates and previous dot positions for smooth movement.
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const positions = Array.from({ length: trailCount }, () => ({ x: mouseX, y: mouseY }));

// Update target coordinates on pointer move.
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Linear interpolation helper; lower `amt` slows the follow speed.
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

  // Re-run each frame for continuous motion.
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

// Change the delay here to adjust how frequently the colors cycle.
setInterval(updateTrailColors, 2000);
animateTrail();

// ===== Typing effect for page titles =====
function initTypewriter() {
  const typewriterTarget = document.getElementById('typewriter');
  if (!typewriterTarget) return;
  const text = typewriterTarget.dataset.text || typewriterTarget.textContent.trim();
  // Lower `speed` for faster typing, higher for slower.
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

// ===== Floating background icons =====
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

  // Each scatter image drifts slowly and responds to the cursor for a playful feel.
  const fishData = fishIcons.map(icon => ({
    el: icon,
    driftSpeed: 0.15 + Math.random() * 0.25,
    driftRange: 12 + Math.random() * 10,
    phase: Math.random() * Math.PI * 2
  }));

  let pointer = { x: 0, y: 0, active: false };

  // Track pointer location so icons can gently repel away.
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

    // Keep the icons moving smoothly.
    requestAnimationFrame(animateFish);
  }

  // Start the loop immediately after paint.
  requestAnimationFrame(animateFish);

  // Small interaction to scatter an icon to a fresh random spot.
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

  // Refresh the glow so scattered icons shimmer over time.
  setInterval(() => fishIcons.forEach(applyRandomGlow), 4000);
}

// Run interactive enhancements once the page has fully loaded assets.
window.addEventListener('load', () => {
  initTypewriter();
  initRevealAnimations();
  initHeaderScrollEffect();
  initAquariumIcons();
  initContactToggle();
  initArtGallery();
  initOrbitRotators();
  initProjectPreviews();
  initPageTransitions();
});

// Fade/slide elements into view when scrolled into the viewport.
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

  // Add a condensed header style after the visitor scrolls a bit.
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

// Expands and collapses the contact form panel.
function initContactToggle() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;

  const toggleButton = contactSection.querySelector('.contact-toggle');
  const panel = contactSection.querySelector('.contact-panel');
  if (!toggleButton || !panel) return;

  // Update aria attributes, button text, and styling when toggling the form.
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

  // Add more filenames here to grow the gallery without editing markup.
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
    frame.className = 'art-frame';
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

// Highlights cards in carousels on mods/project pages; set `data-rotation="projects"`
// to keep a row static.
function initOrbitRotators() {
  const tracks = document.querySelectorAll('.orbit-track');
  if (!tracks.length) return;

  tracks.forEach(track => {
    const cards = Array.from(track.querySelectorAll('.orbit-card'));
    if (cards.length === 0) return;

    const shouldRotate = track.dataset.rotation !== 'projects';
    let index = shouldRotate ? Math.floor(Math.random() * cards.length) : 0;
    const rotationMs = 4200;
    const activate = idx => cards.forEach((card, cardIndex) => card.classList.toggle('is-active', idx === cardIndex));
    activate(index);

    const pickRandom = () => {
      if (!shouldRotate) return;
      let next = Math.floor(Math.random() * cards.length);
      if (cards.length > 1) {
        while (next === index) {
          next = Math.floor(Math.random() * cards.length);
        }
      }
      index = next;
      activate(index);
    };

    let timer = shouldRotate ? setInterval(pickRandom, rotationMs) : null;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      if (!shouldRotate || timer) return;
      timer = setInterval(pickRandom, rotationMs);
    };

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);

    cards.forEach(card => {
      card.addEventListener('focusin', stop);
      card.addEventListener('focusout', start);
    });
  });
}

function initProjectPreviews() {
  const cards = document.querySelectorAll('.work-card[data-preview]');
  if (!cards.length) return;

  const popover = document.createElement('div');
  popover.className = 'preview-popover';
  popover.setAttribute('aria-hidden', 'true');

  const frame = document.createElement('iframe');
  frame.title = 'Project preview';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.setAttribute('allowfullscreen', '');
  popover.appendChild(frame);
  document.body.appendChild(popover);

  let hideTimer;
  let showTimer;
  let activeCard = null;
  let pendingRate = null;

  const sendCommand = (func, args = []) => {
    if (frame.contentWindow) {
      frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    }
  };

  const setPlaybackRate = rate => {
    pendingRate = rate;
    sendCommand('setPlaybackRate', [rate]);
  };

  frame.addEventListener('load', () => {
    if (!activeCard) return;
    sendCommand('playVideo');
    if (pendingRate) {
      setTimeout(() => setPlaybackRate(pendingRate), 60);
    }
  });

  const buildSrc = card => {
    try {
      const url = new URL(card.dataset.preview, window.location.href);
      const videoId = url.pathname.split('/').pop();
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
      url.searchParams.set('controls', '0');
      url.searchParams.set('rel', '0');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('loop', '1');
      url.searchParams.set('enablejsapi', '1');
      if (videoId) {
        url.searchParams.set('playlist', videoId);
      }
      return url.toString();
    } catch (error) {
      return null;
    }
  };

  const positionPopover = card => {
    const rect = card.getBoundingClientRect();
    const viewWidth = document.documentElement.clientWidth;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    const offset = 18;
    const width = popover.offsetWidth || 360;
    const height = popover.offsetHeight || width * 0.56;
    const desiredLeft = scrollX + rect.right + offset;
    const maxLeft = scrollX + viewWidth - width - 12;
    const clampedLeft = Math.max(scrollX + 12, Math.min(desiredLeft, maxLeft));
    const centeredTop = scrollY + rect.top + rect.height / 2 - height / 2;
    const top = Math.max(scrollY + 12, centeredTop);
    popover.style.left = `${clampedLeft}px`;
    popover.style.top = `${top}px`;
  };

  const hidePreview = () => {
    clearTimeout(showTimer);
    hideTimer = setTimeout(() => {
      popover.classList.remove('is-visible');
      popover.setAttribute('aria-hidden', 'true');
      sendCommand('stopVideo');
      frame.src = 'about:blank';
      activeCard = null;
    }, 60);
  };

  const showPreview = card => {
    clearTimeout(hideTimer);
    if (window.innerWidth <= 900) return;
    activeCard = card;
    positionPopover(card);
    popover.classList.add('is-visible');
    popover.setAttribute('aria-hidden', 'false');

    const desiredRate = Number(card.dataset.previewRate) || 2;
    const nextSrc = buildSrc(card);
    if (!nextSrc) return;
    if (frame.src !== nextSrc) {
      frame.src = nextSrc;
    } else {
      sendCommand('playVideo');
      setPlaybackRate(desiredRate);
    }
    setPlaybackRate(desiredRate);
  };

  const handleEnter = event => {
    const card = event.currentTarget;
    clearTimeout(showTimer);
    showTimer = setTimeout(() => showPreview(card), 120);
  };

  cards.forEach(card => {
    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('focusin', handleEnter);
    card.addEventListener('mouseleave', hidePreview);
    card.addEventListener('focusout', hidePreview);
  });

  window.addEventListener('scroll', () => {
    if (activeCard && popover.classList.contains('is-visible')) {
      positionPopover(activeCard);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeCard && popover.classList.contains('is-visible')) {
      positionPopover(activeCard);
    }
  });
}

// Adds a soft overlay when navigating internal links for a smoother transition.
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

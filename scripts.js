// Mark the document as JS-enabled to allow progressive enhancement styles.
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
});

const scatterImages = ['Images/sc1.png', 'Images/sc2.png', 'Images/sc3.png'];

// ===== Subtle background icons =====
function initBackgroundIcons() {
  const background = document.querySelector('.background-scatter');
  if (!background || background.childElementCount) return;

  const numScatters = window.innerWidth < 700 ? 3 : 5;
  for (let i = 0; i < numScatters; i++) {
    const img = document.createElement('img');
    img.src = scatterImages[i % scatterImages.length];
    img.alt = '';
    img.classList.add('scatter-img');
    img.style.left = `${12 + (i * 19) % 76}%`;
    img.style.top = `${14 + (i * 23) % 68}%`;
    background.appendChild(img);
  }
}

// Run interactive enhancements once the page has fully loaded assets.
window.addEventListener('load', () => {
  initRevealAnimations();
  initHeaderScrollEffect();
  initBackgroundIcons();
  initContactToggle();
  initArtGallery();
  initOrbitRotators();
  initProjectPreviews();
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
    toggleButton.textContent = expanded ? 'Close contact form' : 'Open contact form';
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
  closeButton.textContent = 'x';

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

  const parseYouTubeId = url => {
    const host = url.hostname.replace('www.', '');
    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (!host.endsWith('youtube.com')) return null;

    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    if (url.pathname.startsWith('/embed/')) {
      return url.pathname.split('/').pop();
    }

    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/').pop();
    }

    return null;
  };

  const buildSrc = card => {
    try {
      const sourceUrl = new URL(card.dataset.preview, window.location.href);
      const videoId = parseYouTubeId(sourceUrl);
      const url = videoId
        ? new URL(`https://www.youtube.com/embed/${videoId}`)
        : sourceUrl;

      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
      url.searchParams.set('controls', '0');
      url.searchParams.set('rel', '0');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('loop', '1');
      url.searchParams.set('enablejsapi', '1');
      url.searchParams.set('origin', window.location.origin);
      if (videoId) {
        url.searchParams.set('playlist', videoId);
      }
      return url.toString();
    } catch (error) {
      return null;
    }
  };

  const positionPopover = card => {
    const header = document.querySelector('.page-header');
    const headerHeight = header ? header.offsetHeight : 80;
    const viewportHeight = window.innerHeight;
    const popoverHeight = popover.offsetHeight || 202;
    const cardRect = card.getBoundingClientRect();
    const desiredTop = cardRect.top + (cardRect.height / 2) - (popoverHeight / 2);
    const minTop = headerHeight + 14;
    const maxTop = viewportHeight - popoverHeight - 14;
    const clampedTop = Math.max(minTop, Math.min(desiredTop, maxTop));

    popover.style.top = `${clampedTop}px`;
    popover.style.right = '20px';
    popover.style.left = 'auto';
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

  window.addEventListener('resize', () => {
    if (activeCard && popover.classList.contains('is-visible')) {
      positionPopover(activeCard);
    }
  });
}


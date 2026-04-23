document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
});

window.addEventListener('load', () => {
  initTypewriter();
  initRevealAnimations();
  initHeaderScrollEffect();
  initContactToggle();
  initArtGallery();
  initProjectPreviews();
  initPageTransitions();
});

function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const text = target.dataset.text || target.textContent.trim();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    target.textContent = text;
    return;
  }

  let index = 0;
  target.textContent = '';

  const tick = () => {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index += 1;
      setTimeout(tick, 90);
    }
  };

  tick();
}

function initRevealAnimations() {
  const targets = document.querySelectorAll('.reveal, .reveal-card');
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(target => observer.observe(target));
}

function initHeaderScrollEffect() {
  const header = document.querySelector('.page-header');
  if (!header) return;

  const sync = () => header.classList.toggle('header-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initContactToggle() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;

  const button = contactSection.querySelector('.contact-toggle');
  const panel = contactSection.querySelector('.contact-panel');
  if (!button || !panel) return;

  const setExpanded = expanded => {
    button.setAttribute('aria-expanded', String(expanded));
    panel.setAttribute('aria-hidden', String(!expanded));
    contactSection.classList.toggle('contact-open', expanded);
    button.textContent = expanded ? 'Close contact panel' : 'Open contact panel';
  };

  setExpanded(false);

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
  });

  if (window.location.hash === '#contact') {
    setExpanded(true);
  }

  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', () => setTimeout(() => setExpanded(true), 200));
  });
}

function initArtGallery() {
  const gallery = document.getElementById('art-gallery');
  if (!gallery) return;

  const artFiles = ['piece-1.jpg', 'piece-2.jpg', 'piece-3.jpg', 'piece-4.jpg', 'piece-5.jpg', 'piece-6.jpg', 'piece-7.jpg'];
  const fragment = document.createDocumentFragment();
  const lightbox = createLightbox();

  const closeLightbox = () => {
    lightbox.root.classList.remove('is-open');
    lightbox.root.setAttribute('aria-hidden', 'true');
    lightbox.image.src = '';
  };

  const openLightbox = (src, alt) => {
    lightbox.image.src = src;
    lightbox.image.alt = alt;
    lightbox.root.classList.add('is-open');
    lightbox.root.setAttribute('aria-hidden', 'false');
    lightbox.closeButton.focus();
  };

  lightbox.closeButton.addEventListener('click', closeLightbox);
  lightbox.root.addEventListener('click', event => {
    if (event.target === lightbox.root) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.root.classList.contains('is-open')) closeLightbox();
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
      frame.innerHTML = `<div class="art-placeholder">Missing <code>${file}</code> in Artworks.</div>`;
    }, { once: true });

    const open = () => openLightbox(img.src, altText);
    frame.addEventListener('click', open);
    frame.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
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
      closeButton: existing.querySelector('.lightbox-close')
    };
  }

  const root = document.createElement('div');
  root.id = 'art-lightbox';
  root.className = 'art-lightbox';
  root.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'art-lightbox-content';
  content.setAttribute('role', 'dialog');
  content.setAttribute('aria-modal', 'true');
  content.setAttribute('aria-label', 'Expanded artwork view');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', 'Close artwork');
  closeButton.textContent = '×';

  const image = document.createElement('img');
  image.alt = '';

  content.appendChild(closeButton);
  content.appendChild(image);
  root.appendChild(content);
  document.body.appendChild(root);

  return { root, image, closeButton };
}

function initProjectPreviews() {
  const cards = document.querySelectorAll('.work-card[data-preview]');
  if (!cards.length || window.matchMedia('(max-width: 900px)').matches) return;

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

  let activeCard = null;
  let hideTimer = null;

  const positionPopover = card => {
    const rect = card.getBoundingClientRect();
    const top = Math.max(90, Math.min(window.innerHeight - 220, rect.top + rect.height / 2 - 95));
    popover.style.top = `${top}px`;
    popover.style.right = '18px';
  };

  const buildPreviewUrl = raw => {
    try {
      const url = new URL(raw, window.location.href);
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
      url.searchParams.set('controls', '0');
      url.searchParams.set('rel', '0');
      url.searchParams.set('playsinline', '1');
      return url.toString();
    } catch (error) {
      return null;
    }
  };

  const show = card => {
    const src = buildPreviewUrl(card.dataset.preview);
    if (!src) return;
    activeCard = card;
    positionPopover(card);
    if (frame.src !== src) frame.src = src;
    popover.classList.add('is-visible');
    popover.setAttribute('aria-hidden', 'false');
  };

  const hide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      popover.classList.remove('is-visible');
      popover.setAttribute('aria-hidden', 'true');
      frame.src = 'about:blank';
      activeCard = null;
    }, 80);
  };

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => show(card));
    card.addEventListener('focusin', () => show(card));
    card.addEventListener('mouseleave', hide);
    card.addEventListener('focusout', hide);
  });

  window.addEventListener('resize', () => {
    if (activeCard) positionPopover(activeCard);
  });
}

function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  const hide = () => overlay.classList.add('is-hidden');
  const show = () => overlay.classList.remove('is-hidden');

  setTimeout(hide, 260);
  window.addEventListener('pageshow', hide);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show();
      setTimeout(() => {
        window.location.href = url.href;
      }, 260);
    });
  });
}

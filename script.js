const elements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  for (const el of elements) {
    observer.observe(el);
  }
} else {
  for (const el of elements) {
    el.classList.add('is-visible');
  }
}

const copyBibtexBtn = document.getElementById('copy-bibtex');
const bibtexBlock = document.getElementById('bibtex-block');

if (copyBibtexBtn && bibtexBlock) {
  copyBibtexBtn.addEventListener('click', async () => {
    const text = bibtexBlock.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      copyBibtexBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBibtexBtn.textContent = 'Copy BibTeX';
      }, 1400);
    } catch (_error) {
      copyBibtexBtn.textContent = 'Copy failed';
      setTimeout(() => {
        copyBibtexBtn.textContent = 'Copy BibTeX';
      }, 1600);
    }
  });
}

const navButtons = document.querySelectorAll('.nav-pill[data-target]');

for (const btn of navButtons) {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

const resultCards = Array.from(document.querySelectorAll('.result-card'));
const lightbox = document.getElementById('result-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxTip = document.getElementById('lightbox-tip');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentResultIndex = 0;

function readCardData(card) {
  const img = card.querySelector('img');
  const title = card.querySelector('h3');
  const paragraphs = card.querySelectorAll('p');
  const description = paragraphs[0];
  const tip = card.querySelector('.result-tip');

  return {
    src: img ? img.getAttribute('src') || '' : '',
    alt: img ? img.getAttribute('alt') || '' : '',
    title: title ? title.textContent.trim() : '',
    description: description ? description.textContent.trim() : '',
    tip: tip ? tip.textContent.trim() : ''
  };
}

function renderLightbox(index) {
  if (!resultCards.length) return;
  const safeIndex = (index + resultCards.length) % resultCards.length;
  currentResultIndex = safeIndex;
  const data = readCardData(resultCards[safeIndex]);

  if (lightboxImage) {
    lightboxImage.src = data.src;
    lightboxImage.alt = data.alt;
  }
  if (lightboxTitle) lightboxTitle.textContent = data.title;
  if (lightboxDescription) lightboxDescription.textContent = data.description;
  if (lightboxTip) lightboxTip.textContent = data.tip;
}

function openLightbox(index) {
  if (!lightbox) return;
  renderLightbox(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (resultCards.length && lightbox) {
  resultCards.forEach((card, index) => {
    const preview = card.querySelector('.result-preview');
    if (!preview) return;
    preview.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.lightboxClose === 'true') {
      closeLightbox();
    }
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      renderLightbox(currentResultIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      renderLightbox(currentResultIndex + 1);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }

    if (event.key === 'ArrowLeft') {
      renderLightbox(currentResultIndex - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      renderLightbox(currentResultIndex + 1);
    }
  });
}

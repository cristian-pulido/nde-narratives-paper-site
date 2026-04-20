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

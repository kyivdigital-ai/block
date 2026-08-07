// ------------------------------------------------------------
// EASY EDITS
// ------------------------------------------------------------
const CONFIG = {
  siteUrl: 'https://sadgay.com',
  bookUrl: 'https://sadgay.com/#book', // Replace with the final product checkout URL.
};

document.querySelector('.brand').href = CONFIG.siteUrl;
document.querySelector('.panel__link').href = CONFIG.siteUrl;
document.querySelector('#buyButton').href = CONFIG.bookUrl;

const infoPanel = document.querySelector('#infoPanel');
const bookPanel = document.querySelector('#bookPanel');
const label = document.querySelector('#windowLabel');
const hotspots = [...document.querySelectorAll('.window-hotspot')];
const closeButtons = document.querySelectorAll('.panel__close');
const isCoarse = window.matchMedia('(pointer: coarse)').matches;

let activeHotspot = null;
let closeTimer = null;

function panelFor(action) {
  return action === 'book' ? bookPanel : infoPanel;
}

function closePanels() {
  infoPanel.classList.remove('is-open');
  bookPanel.classList.remove('is-open');
  infoPanel.setAttribute('aria-hidden', 'true');
  bookPanel.setAttribute('aria-hidden', 'true');

  if (activeHotspot) activeHotspot.classList.remove('is-active');
  activeHotspot = null;
}

function openPanel(action, hotspot) {
  clearTimeout(closeTimer);

  const target = panelFor(action);
  const other = action === 'book' ? infoPanel : bookPanel;

  other.classList.remove('is-open');
  other.setAttribute('aria-hidden', 'true');
  target.classList.add('is-open');
  target.setAttribute('aria-hidden', 'false');

  hotspots.forEach((item) => item.classList.remove('is-active'));
  hotspot.classList.add('is-active');
  activeHotspot = hotspot;
}

function scheduleClose() {
  if (isCoarse) return;
  clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    if (!document.querySelector('.panel:hover')) closePanels();
  }, 180);
}

function positionLabel(event, hotspot) {
  label.textContent = hotspot.dataset.label;
  label.style.left = `${event.clientX}px`;
  label.style.top = `${event.clientY}px`;
  label.classList.add('is-visible');
}

hotspots.forEach((hotspot) => {
  const action = hotspot.dataset.action;

  hotspot.addEventListener('pointerenter', (event) => {
    if (isCoarse) return;
    openPanel(action, hotspot);
    positionLabel(event, hotspot);
  });

  hotspot.addEventListener('pointermove', (event) => {
    if (isCoarse) return;
    positionLabel(event, hotspot);
  });

  hotspot.addEventListener('pointerleave', () => {
    label.classList.remove('is-visible');
    scheduleClose();
  });

  hotspot.addEventListener('focus', () => {
    if (!isCoarse) openPanel(action, hotspot);
  });

  hotspot.addEventListener('click', (event) => {
    event.preventDefault();

    if (activeHotspot === hotspot && isCoarse) {
      closePanels();
      return;
    }

    openPanel(action, hotspot);
  });
});

[infoPanel, bookPanel].forEach((panel) => {
  panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  panel.addEventListener('pointerleave', scheduleClose);
});

closeButtons.forEach((button) => {
  button.addEventListener('click', closePanels);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePanels();
});

document.addEventListener('pointerdown', (event) => {
  if (!isCoarse || !activeHotspot) return;
  if (event.target.closest('.window-hotspot, .panel')) return;
  closePanels();
});

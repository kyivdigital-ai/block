const CONFIG = {
  siteUrl: 'https://sadgay.com',
  bookUrl: 'https://sadgay.com/#book',
};

const siteLink = document.querySelector('.panel__link');
const buyButton = document.querySelector('#buyButton');
if (siteLink) siteLink.href = CONFIG.siteUrl;
if (buyButton) buyButton.href = CONFIG.bookUrl;

const infoPanel = document.querySelector('#infoPanel');
const bookPanel = document.querySelector('#bookPanel');
const hotspots = [...document.querySelectorAll('.window-hotspot')];
const closeButtons = document.querySelectorAll('.panel__close');
const windowLabel = document.querySelector('#windowLabel');
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
  activeHotspot = hotspot;
}

function scheduleClose() {
  if (isCoarse) return;
  clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    if (!document.querySelector('.panel:hover')) closePanels();
  }, 180);
}

function showWindowLabel(hotspot) {
  if (isCoarse || !windowLabel) return;
  windowLabel.textContent = hotspot.dataset.label || '';
  windowLabel.classList.add('is-visible');
}

function hideWindowLabel() {
  if (!windowLabel) return;
  windowLabel.classList.remove('is-visible');
}

function moveWindowLabel(event) {
  if (isCoarse || !windowLabel) return;
  windowLabel.style.left = `${event.clientX}px`;
  windowLabel.style.top = `${event.clientY}px`;
}

hotspots.forEach((hotspot) => {
  const action = hotspot.dataset.action;

  hotspot.addEventListener('pointerenter', (event) => {
    if (isCoarse) return;
    showWindowLabel(hotspot);
    moveWindowLabel(event);
    openPanel(action, hotspot);
  });

  hotspot.addEventListener('pointermove', moveWindowLabel);

  hotspot.addEventListener('pointerleave', () => {
    hideWindowLabel();
    scheduleClose();
  });

  hotspot.addEventListener('focus', () => {
    if (!isCoarse) openPanel(action, hotspot);
  });

  hotspot.addEventListener('blur', hideWindowLabel);

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
  if (event.key === 'Escape') {
    hideWindowLabel();
    closePanels();
  }
});

document.addEventListener('pointerdown', (event) => {
  if (!isCoarse || !activeHotspot) return;
  if (event.target.closest('.window-hotspot, .panel')) return;
  closePanels();
});

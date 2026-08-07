import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';

// ------------------------------------------------------------
// EASY EDITS
// ------------------------------------------------------------
const CONFIG = {
  siteUrl: 'https://sadgay.com',
  bookUrl: 'https://sadgay.com/#book', // Replace with the final product checkout URL.
  background: 0xbfe8ef,
  activeWindow: 0xff6fae,
};

document.querySelector('.brand').href = CONFIG.siteUrl;
document.querySelector('.panel__link').href = CONFIG.siteUrl;
document.querySelector('#buyButton').href = CONFIG.bookUrl;

const canvas = document.querySelector('#scene');
const infoPanel = document.querySelector('#infoPanel');
const bookPanel = document.querySelector('#bookPanel');
const label = document.querySelector('#windowLabel');
const closeButtons = document.querySelectorAll('.panel__close');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.background);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(9.2, 5.6, 11.5);
camera.lookAt(0, 0.15, 0);

// Lighting
scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa7aa, 2.25));
const key = new THREE.DirectionalLight(0xffffff, 3.4);
key.position.set(-5, 9, 9);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
scene.add(key);

const fill = new THREE.DirectionalLight(0xbde7ff, 1.4);
fill.position.set(8, 2, 4);
scene.add(fill);

// Ground shadow, nearly invisible but helps the building sit in space.
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.12 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -3.02;
ground.receiveShadow = true;
scene.add(ground);

// ------------------------------------------------------------
// BUILDING
// ------------------------------------------------------------
const building = new THREE.Group();
building.rotation.y = -0.24;
building.rotation.x = -0.015;
scene.add(building);

const concrete = new THREE.MeshStandardMaterial({
  color: 0xd5d7d5,
  roughness: 0.92,
  metalness: 0.0,
});
const concreteDark = new THREE.MeshStandardMaterial({
  color: 0x9ea3a2,
  roughness: 0.95,
});
const frameMat = new THREE.MeshStandardMaterial({ color: 0xbfc4c3, roughness: 0.86 });
const glassMat = new THREE.MeshStandardMaterial({
  color: 0x5e696c,
  roughness: 0.35,
  metalness: 0.05,
});
const balconyGlass = new THREE.MeshStandardMaterial({
  color: 0xaeb9ba,
  roughness: 0.55,
  transparent: true,
  opacity: 0.78,
});

const W = 8.9;
const H = 5.9;
const D = 1.75;

const shell = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), concrete);
shell.castShadow = true;
shell.receiveShadow = true;
building.add(shell);

// Roof slab
const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.12, D + 0.12), concreteDark);
roof.position.y = H / 2 + 0.06;
roof.castShadow = true;
building.add(roof);

// Roof utility boxes
for (const x of [-2.55, 2.35]) {
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.72, 0.9), concrete);
  box.position.set(x, H / 2 + 0.42, -0.1);
  box.castShadow = true;
  building.add(box);
}

// Vertical façade seams
for (let i = 1; i < 5; i++) {
  const seam = new THREE.Mesh(new THREE.BoxGeometry(0.025, H - 0.2, 0.025), concreteDark);
  seam.position.set(-W / 2 + (W / 5) * i, 0, D / 2 + 0.016);
  building.add(seam);
}

const interactive = [];
const allWindows = [];

function addWindow(x, y, z, w, h, action = null, labelText = '') {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const outer = new THREE.Mesh(new THREE.BoxGeometry(w + 0.09, h + 0.09, 0.055), frameMat);
  outer.castShadow = true;
  group.add(outer);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.065), glassMat.clone());
  glass.position.z = 0.045;
  glass.userData.action = action;
  glass.userData.label = labelText;
  glass.userData.baseColor = glass.material.color.getHex();
  group.add(glass);

  allWindows.push(glass);
  if (action) interactive.push(glass);
  building.add(group);
  return glass;
}

const floors = 8;
const cols = 12;
const xStep = 0.67;
const yStep = 0.66;
const startX = -3.68;
const startY = -2.28;
const zFront = D / 2 + 0.045;

for (let r = 0; r < floors; r++) {
  for (let c = 0; c < cols; c++) {
    const x = startX + c * xStep;
    const y = startY + r * yStep;
    const isBalconyBand = (c >= 3 && c <= 5) || (c >= 8 && c <= 10);

    let action = null;
    let labelText = '';
    if (r === 5 && c === 2) {
      action = 'info';
      labelText = 'WHAT IS SAD GAY?';
    }
    if (r === 3 && c === 9) {
      action = 'book';
      labelText = 'BUY THE BOOK';
    }

    addWindow(x, y, zFront, isBalconyBand ? 0.48 : 0.39, 0.36, action, labelText);
  }
}

// Horizontal floor seams
for (let r = 1; r < floors; r++) {
  const seam = new THREE.Mesh(new THREE.BoxGeometry(W - 0.15, 0.026, 0.026), concreteDark);
  seam.position.set(0, startY - 0.31 + r * yStep, D / 2 + 0.022);
  building.add(seam);
}

// Balcony strips on front façade
for (let r = 0; r < floors; r++) {
  const y = startY + r * yStep - 0.22;
  for (const cx of [-1.58, 1.8]) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.06, 0.34), concreteDark);
    slab.position.set(cx, y, D / 2 + 0.19);
    slab.castShadow = true;
    building.add(slab);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.26, 0.035), balconyGlass);
    rail.position.set(cx, y + 0.16, D / 2 + 0.35);
    building.add(rail);
  }
}

// Windows on the right side, so the object reads as 3D.
for (let r = 0; r < floors; r++) {
  for (let c = 0; c < 2; c++) {
    const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.40, 0.50), frameMat);
    sideFrame.position.set(W / 2 + 0.03, startY + r * yStep, -0.42 + c * 0.82);
    sideFrame.castShadow = true;
    building.add(sideFrame);

    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.34, 0.43), glassMat);
    sideGlass.position.set(W / 2 + 0.065, startY + r * yStep, -0.42 + c * 0.82);
    building.add(sideGlass);
  }
}

// Base strip
const base = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, 0.16, D + 0.08), concreteDark);
base.position.y = -H / 2 + 0.04;
base.castShadow = true;
building.add(base);

// ------------------------------------------------------------
// INTERACTION
// ------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(99, 99);
let hovered = null;
let targetRotY = building.rotation.y;
let targetRotX = building.rotation.x;
let pointerDown = false;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerDownX = 0;
let pointerDownY = 0;
const isCoarse = window.matchMedia('(pointer: coarse)').matches;

function resetWindow(mesh) {
  if (!mesh) return;
  mesh.material.emissive?.setHex(0x000000);
  mesh.material.emissiveIntensity = 0;
  mesh.scale.set(1, 1, 1);
}

function activateWindow(mesh) {
  if (!mesh) return;
  mesh.material.emissive = new THREE.Color(CONFIG.activeWindow);
  mesh.material.emissiveIntensity = 0.9;
  mesh.scale.set(1.08, 1.08, 1.05);
}

function closePanels() {
  infoPanel.classList.remove('is-open');
  bookPanel.classList.remove('is-open');
  infoPanel.setAttribute('aria-hidden', 'true');
  bookPanel.setAttribute('aria-hidden', 'true');
}

function openPanel(action) {
  closePanels();
  const panel = action === 'book' ? bookPanel : infoPanel;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function setPointerFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

function hitTest() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactive, false);
  return hits[0]?.object || null;
}

canvas.addEventListener('pointermove', (e) => {
  setPointerFromEvent(e);

  // Tiny parallax / rotation. Drag becomes stronger on desktop.
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = (e.clientY / window.innerHeight) * 2 - 1;
  if (!pointerDown) {
    targetRotY = -0.24 + nx * 0.055;
    targetRotX = -0.015 - ny * 0.025;
  } else {
    targetRotY += (e.clientX - pointerStartX) * 0.0024;
    targetRotX += (e.clientY - pointerStartY) * 0.0015;
    targetRotX = THREE.MathUtils.clamp(targetRotX, -0.16, 0.12);
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
  }

  if (isCoarse || pointerDown) return;

  const hit = hitTest();
  if (hit !== hovered) {
    resetWindow(hovered);
    hovered = hit;
    activateWindow(hovered);
  }

  if (hovered) {
    canvas.style.cursor = 'pointer';
    label.textContent = hovered.userData.label;
    label.style.left = `${e.clientX}px`;
    label.style.top = `${e.clientY}px`;
    label.classList.add('is-visible');
    openPanel(hovered.userData.action);
  } else {
    canvas.style.cursor = pointerDown ? 'grabbing' : 'grab';
    label.classList.remove('is-visible');
  }
});

canvas.addEventListener('pointerdown', (e) => {
  pointerDown = true;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
  setPointerFromEvent(e);
  canvas.setPointerCapture?.(e.pointerId);
});

canvas.addEventListener('pointerup', (e) => {
  const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 8;
  pointerDown = false;
  canvas.releasePointerCapture?.(e.pointerId);
  setPointerFromEvent(e);

  if (!moved) {
    const hit = hitTest();
    if (hit) {
      resetWindow(hovered);
      hovered = hit;
      activateWindow(hovered);
      openPanel(hit.userData.action);
    } else {
      resetWindow(hovered);
      hovered = null;
      closePanels();
    }
  }
});

canvas.addEventListener('pointerleave', () => {
  pointerDown = false;
  label.classList.remove('is-visible');
  if (!isCoarse) {
    resetWindow(hovered);
    hovered = null;
  }
});

closeButtons.forEach((button) => button.addEventListener('click', () => {
  resetWindow(hovered);
  hovered = null;
  closePanels();
}));

// ------------------------------------------------------------
// RESPONSIVE CAMERA
// ------------------------------------------------------------
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;

  if (w < 760) {
    camera.fov = 44;
    camera.position.set(8.9, 5.9, 14.2);
  } else if (w < 1100) {
    camera.fov = 39;
    camera.position.set(9.5, 5.7, 12.7);
  } else {
    camera.fov = 34;
    camera.position.set(9.2, 5.6, 11.5);
  }

  camera.lookAt(0, 0.15, 0);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ------------------------------------------------------------
// RENDER LOOP
// ------------------------------------------------------------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate() {
  if (!prefersReducedMotion) {
    building.rotation.y += (targetRotY - building.rotation.y) * 0.045;
    building.rotation.x += (targetRotX - building.rotation.x) * 0.045;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

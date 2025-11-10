// sidepanel/modules/listeners.js

import * as dom from './dom.js';
import { state, DEFAULT_SETTINGS } from './state.js';
import * as actions from './actions.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import * as render from './render.js';
import { loadLogoImage } from './image.js';

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

export function bindEventListeners() {
  
  dom.btnGoSettings.addEventListener('click', () => {
    dom.mainControls.classList.add('hidden');
    dom.settingsControls.classList.remove('hidden');
    dom.appContainer.classList.add('in-settings-view');
    ui.resetCollapsibleState();
  });
  
  dom.btnBackMain.addEventListener('click', () => {
    dom.mainControls.classList.remove('hidden');
    dom.settingsControls.classList.add('hidden');
    dom.appContainer.classList.remove('in-settings-view');
    storage.saveSettings();
    render.scheduleRender();
  });

  document.querySelectorAll('.collapsible-header').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const content = button.nextElementSibling;
      content.classList.toggle('expanded');
    });
  });

  // --- Controles Principales (Toggles Sincronizados) ---
  dom.toggleLogo.addEventListener('change', (e) => {
    ui.setLogoVisibility(e.target.checked); 
  });
  dom.toggleLogoSettings.addEventListener('change', (e) => {
    ui.setLogoVisibility(e.target.checked); 
  });
  dom.toggleFrame.addEventListener('change', (e) => {
    ui.setFrameVisibility(e.target.checked);
  });
  dom.toggleFrameSettings.addEventListener('change', (e) => {
    ui.setFrameVisibility(e.target.checked);
  });

  // --- Controles Principales (Botones de Transformación) ---
  dom.btnRotate.addEventListener('click', () => {
    state.transform.rotation = (state.transform.rotation + 90) % 360;
    render.scheduleRender();
  });
  dom.btnFlipH.addEventListener('click', () => {
    state.transform.flipH = !state.transform.flipH;
    render.scheduleRender();
  });
  dom.btnFlipV.addEventListener('click', () => {
    state.transform.flipV = !state.transform.flipV;
    render.scheduleRender();
  });
  dom.btnResetTransform.addEventListener('click', () => actions.resetTransform(true));

  // --- Interacción con Canvas (Pan y Zoom) ---
  dom.canvas.addEventListener('mousedown', (e) => {
    if (!state.currentImage) return;
    isDragging = true;
    dragStartX = e.clientX; 
    dragStartY = e.clientY;
    dom.canvas.style.cursor = 'grabbing';
  });
  dom.canvas.addEventListener('mouseup', () => {
    isDragging = false;
    dom.canvas.style.cursor = 'grab';
  });
  dom.canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    dom.canvas.style.cursor = 'grab';
  });
  dom.canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !state.currentImage) return;
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    state.transform.x += deltaX;
    state.transform.y += deltaY;
    dragStartX = e.clientX; 
    dragStartY = e.clientY;
    render.scheduleRender();
  });
  dom.canvas.addEventListener('wheel', (e) => {
    if (!state.currentImage) return;
    e.preventDefault();
    const scaleAmount = 1.1;
    const delta = e.deltaY > 0 ? (1 / scaleAmount) : scaleAmount;
    const rect = dom.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - state.transform.x - (dom.canvas.width / 2)) / state.transform.scale;
    const worldY = (mouseY - state.transform.y - (dom.canvas.height / 2)) / state.transform.scale;
    const newScale = state.transform.scale * delta;
    if (newScale < 0.05 || newScale > 50) return;
    state.transform.scale = newScale;
    state.transform.x = mouseX - (worldX * state.transform.scale) - (dom.canvas.width / 2);
    state.transform.y = mouseY - (worldY * state.transform.scale) - (dom.canvas.height / 2);
    render.scheduleRender();
  });

  // --- Controles de Ajustes de Logo ---
  dom.logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      state.settings.logo.src = dataUrl;
      loadLogoImage(dataUrl);
      ui.updateSettingsUI();
      storage.saveSettings();
    };
    reader.readAsDataURL(file);
  });

  dom.logoRestore.addEventListener('click', () => {
    state.settings.logo.src = DEFAULT_SETTINGS.logo.src;
    loadLogoImage(DEFAULT_SETTINGS.logo.src);
    ui.updateSettingsUI();
    dom.logoUpload.value = null;
    storage.saveSettings();
    render.scheduleRender();
  });

  dom.logoOpacity.addEventListener('input', (e) => {
    state.settings.logo.opacity = parseFloat(e.target.value);
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });
  dom.logoSize.addEventListener('input', (e) => {
    state.settings.logo.size = parseFloat(e.target.value);
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });
  dom.logoRotation.addEventListener('input', (e) => {
    state.settings.logo.rotation = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });
  dom.logoPosition.addEventListener('change', (e) => {
    state.settings.logo.position = e.target.value;
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });

  // --- Controles de Ajustes de Marco ---
  dom.frameType.addEventListener('change', (e) => {
    state.settings.frame.type = e.target.value;
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });
  
  // Colores
  dom.frameColorSimple.addEventListener('input', (e) => {
    state.settings.frame.colorSimple = e.target.value;
    render.scheduleRender(); 
  });
  dom.frameColorOuter.addEventListener('input', (e) => {
    state.settings.frame.colorOuter = e.target.value;
    render.scheduleRender(); 
  });
  dom.frameColorInner.addEventListener('input', (e) => {
    state.settings.frame.colorInner = e.target.value;
    render.scheduleRender(); 
  });
  dom.frameColorShadow.addEventListener('input', (e) => {
    state.settings.frame.colorShadow = e.target.value;
    render.scheduleRender(); 
  });
  dom.frameColorVignette.addEventListener('input', (e) => {
    state.settings.frame.colorVignette = e.target.value;
    render.scheduleRender(); 
  });

  // Sliders
  dom.frameSizeSimple.addEventListener('input', (e) => {
    state.settings.frame.sizeSimple = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameSizeDoubleOuter.addEventListener('input', (e) => {
    state.settings.frame.sizeDoubleOuter = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameSizeDoubleInner.addEventListener('input', (e) => {
    state.settings.frame.sizeDoubleInner = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameSizeDoubleSep.addEventListener('input', (e) => {
    state.settings.frame.sizeDoubleSep = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameCornerRadius.addEventListener('input', (e) => {
    state.settings.frame.cornerRadius = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameShadowBlur.addEventListener('input', (e) => {
    state.settings.frame.shadowBlur = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameShadowDistance.addEventListener('input', (e) => {
    state.settings.frame.shadowDistance = parseInt(e.target.value, 10);
    ui.updateSettingsUI();
    render.scheduleRender();
  });
  dom.frameVignetteIntensity.addEventListener('input', (e) => {
    state.settings.frame.vignetteIntensity = parseFloat(e.target.value);
    ui.updateSettingsUI();
    render.scheduleRender(); 
  });

  // --- Acciones Finales ---
  dom.btnResetAll.addEventListener('click', () => {
    if (confirm("¿Está seguro de que desea borrar todos sus ajustes (logo, colores, etc.)?")) {
      state.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      
      loadLogoImage(state.settings.logo.src);
      dom.logoUpload.value = null;
      storage.saveSettings();
      ui.updateSettingsUI();
      ui.setLogoVisibility(true); 
      ui.setFrameVisibility(true);
      render.scheduleRender();
    }
  });

  dom.btnDownload.addEventListener('click', actions.downloadImage);
}
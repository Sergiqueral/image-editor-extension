// sidepanel/modules/storage.js

import { state, DEFAULT_SETTINGS } from './state.js';
import { loadLogoImage } from './image.js';
import { updateSettingsUI } from './ui.js';
import { 
  toggleLogo, 
  toggleLogoSettings, 
  toggleFrame, 
  toggleFrameSettings, 
  selectFormat 
} from './dom.js';

export async function saveSettings() {
  state.settings.output.format = selectFormat.value;
  try {
    await chrome.storage.local.set({ settings: state.settings });
  } catch (error) {
    console.error("Error al guardar los ajustes:", error);
  }
}

export async function loadSettingsFromStorage() {
  let data = {};
  try {
    data = await chrome.storage.local.get('settings');
  } catch (error) {
    console.error("Error al cargar los ajustes:", error);
  }

  state.settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
  state.settings.logo = { ...DEFAULT_SETTINGS.logo, ...(state.settings.logo || {}) };
  
  // --- Lógica de Migración de Ajustes de Marco ---
  const oldSize = data.settings?.frame?.size; 
  const oldColor = data.settings?.frame?.color;
  const oldShadowOffset = data.settings?.frame?.shadowOffset;

  state.settings.frame = { ...DEFAULT_SETTINGS.frame, ...(state.settings.frame || {}) };
  
  if (oldSize) {
      state.settings.frame.sizeSimple = oldSize;
      state.settings.frame.sizeDoubleSep = oldSize;
      delete state.settings.frame.size; 
  }
  if (oldColor) {
      state.settings.frame.colorSimple = oldColor;
      state.settings.frame.colorOuter = oldColor;
      state.settings.frame.colorInner = oldColor;
      state.settings.frame.colorShadow = oldColor;
      state.settings.frame.colorVignette = oldColor;
      delete state.settings.frame.color; 
  }
  // Migra el antiguo 'shadowOffset' al nuevo 'shadowDistance'
  if (oldShadowOffset) {
      state.settings.frame.shadowDistance = oldShadowOffset;
      delete state.settings.frame.shadowOffset;
  }
  // --- Fin de la Migración ---

  state.settings.output = { ...DEFAULT_SETTINGS.output, ...(state.settings.output || {}) };

  loadLogoImage(state.settings.logo.src); 
  updateSettingsUI();
  
  toggleLogo.checked = state.ui.isLogoVisible;
  toggleLogoSettings.checked = state.ui.isLogoVisible;
  toggleFrame.checked = state.ui.isFrameVisible;
  toggleFrameSettings.checked = state.ui.isFrameVisible;
  selectFormat.value = state.settings.output.format;
}
// sidepanel/modules/ui.js

import * as dom from './dom.js';
import { state, DEFAULT_SETTINGS } from './state.js';
import { scheduleRender } from './render.js';

/**
 * Función centralizada para mostrar/ocultar los controles de marco correctos
 * según el tipo de marco seleccionado.
 */
export function updateFrameControlVisibility() {
  // 1. Ocultar todos los controles de marco por defecto
  const allFrameControls = [
    dom.frameColorSimple.parentElement,
    dom.frameSizeSimple.parentElement,
    dom.frameColorOuter.parentElement,
    dom.frameSizeDoubleOuter.parentElement,
    dom.frameColorInner.parentElement,
    dom.frameSizeDoubleInner.parentElement,
    dom.frameSizeDoubleSep.parentElement,
    dom.frameColorShadow.parentElement,
    dom.frameShadowBlur.parentElement,
    dom.frameShadowDistance.parentElement,
    dom.frameColorVignette.parentElement,
    dom.frameVignetteIntensity.parentElement,
    dom.frameCornerRadius.parentElement
  ];

  allFrameControls.forEach(controlRow => {
    if (controlRow) controlRow.classList.add('hidden');
  });

  // 2. Mostrar los correctos según el tipo
  const type = state.settings.frame.type;
  
  if (type === 'simple') {
    dom.frameColorSimple.parentElement.classList.remove('hidden');
    dom.frameSizeSimple.parentElement.classList.remove('hidden');
    dom.frameCornerRadius.parentElement.classList.remove('hidden');
  } else if (type === 'double') {
    dom.frameColorOuter.parentElement.classList.remove('hidden');
    dom.frameSizeDoubleOuter.parentElement.classList.remove('hidden');
    dom.frameColorInner.parentElement.classList.remove('hidden');
    dom.frameSizeDoubleInner.parentElement.classList.remove('hidden');
    dom.frameSizeDoubleSep.parentElement.classList.remove('hidden');
    dom.frameCornerRadius.parentElement.classList.remove('hidden');
  } else if (type === 'shadow') {
    dom.frameColorShadow.parentElement.classList.remove('hidden');
    dom.frameShadowBlur.parentElement.classList.remove('hidden');
    dom.frameShadowDistance.parentElement.classList.remove('hidden');
    dom.frameCornerRadius.parentElement.classList.remove('hidden');
  } else if (type === 'vignette') {
    dom.frameColorVignette.parentElement.classList.remove('hidden');
    dom.frameVignetteIntensity.parentElement.classList.remove('hidden');
  }
}

/**
 * Actualiza toda la UI de Ajustes (sliders, selects, previews)
 * para que coincida con el 'state' actual.
 */
export function updateSettingsUI() {
  // --- Logo ---
  const logoSrc = state.settings.logo.src || DEFAULT_SETTINGS.logo.src;
  dom.logoPreview.src = logoSrc;
  dom.logoPreview.style.display = 'block';
  
  const isCustomLogo = logoSrc.startsWith('data:');
  dom.logoRestore.style.display = isCustomLogo ? 'inline-block' : 'none';
  dom.logoRestore.disabled = !isCustomLogo;
  
  dom.logoOpacity.value = state.settings.logo.opacity;
  dom.logoOpacityVal.textContent = Math.round(state.settings.logo.opacity * 100) + '%';
  dom.logoSize.value = state.settings.logo.size;
  dom.logoSizeVal.textContent = Math.round(state.settings.logo.size * 100);
  dom.logoRotation.value = state.settings.logo.rotation;
  dom.logoRotationVal.textContent = state.settings.logo.rotation + '°';
  dom.logoPosition.value = state.settings.logo.position;

  // --- Marco ---
  dom.frameType.value = state.settings.frame.type;
  
  updateFrameControlVisibility();

  // Actualizar valores de los inputs
  dom.frameColorSimple.value = state.settings.frame.colorSimple;
  dom.frameColorOuter.value = state.settings.frame.colorOuter;
  dom.frameColorInner.value = state.settings.frame.colorInner;
  dom.frameColorShadow.value = state.settings.frame.colorShadow;
  dom.frameColorVignette.value = state.settings.frame.colorVignette;
  
  dom.frameSizeSimple.value = state.settings.frame.sizeSimple;
  dom.frameSizeSimpleVal.textContent = state.settings.frame.sizeSimple + 'px';
  dom.frameSizeDoubleOuter.value = state.settings.frame.sizeDoubleOuter;
  dom.frameSizeDoubleOuterVal.textContent = state.settings.frame.sizeDoubleOuter + 'px';
  dom.frameSizeDoubleInner.value = state.settings.frame.sizeDoubleInner;
  dom.frameSizeDoubleInnerVal.textContent = state.settings.frame.sizeDoubleInner + 'px';
  dom.frameSizeDoubleSep.value = state.settings.frame.sizeDoubleSep;
  dom.frameSizeDoubleSepVal.textContent = state.settings.frame.sizeDoubleSep + 'px';
  
  dom.frameCornerRadius.value = state.settings.frame.cornerRadius;
  dom.frameCornerRadiusVal.textContent = state.settings.frame.cornerRadius + 'px';
  dom.frameShadowBlur.value = state.settings.frame.shadowBlur;
  dom.frameShadowBlurVal.textContent = state.settings.frame.shadowBlur + 'px';
  dom.frameShadowDistance.value = state.settings.frame.shadowDistance;
  dom.frameShadowDistanceVal.textContent = state.settings.frame.shadowDistance + 'px';
  dom.frameVignetteIntensity.value = state.settings.frame.vignetteIntensity;
  dom.frameVignetteIntensityVal.textContent = Math.round(state.settings.frame.vignetteIntensity * 100) + '%';
}

export function setLogoVisibility(isVisible) {
  state.ui.isLogoVisible = isVisible;
  dom.toggleLogo.checked = isVisible;
  dom.toggleLogoSettings.checked = isVisible;
  scheduleRender();
}

export function setFrameVisibility(isVisible) {
  state.ui.isFrameVisible = isVisible;
  dom.toggleFrame.checked = isVisible;
  dom.toggleFrameSettings.checked = isVisible;
  scheduleRender();
}

export function resetCollapsibleState() {
  document.querySelectorAll('#settings-controls .collapsible-header').forEach(header => {
    header.classList.remove('active');
  });
  document.querySelectorAll('#settings-controls .collapsible-content').forEach(content => {
    content.classList.remove('expanded');
  });
}
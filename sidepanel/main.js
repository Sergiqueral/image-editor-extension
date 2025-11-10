// sidepanel/main.js
// El "Entry Point" de la aplicación del panel lateral.

// 1. Importar las funciones necesarias de los módulos
import { loadSettingsFromStorage } from './modules/storage.js';
import { bindEventListeners } from './modules/listeners.js';
import { handleBackgroundMessage } from './modules/actions.js';

/**
 * Función de inicialización principal.
 * Se ejecuta cuando el DOM del panel lateral está listo.
 */
function init() {
  // 1. Conectar con el service worker para que sepa si el panel se cierra
  chrome.runtime.connect({ name: "sidepanel" });

  // 2. Cargar los ajustes guardados (o los por defecto) en el estado
  loadSettingsFromStorage();
  
  // 3. Conectar todos los botones, sliders, y eventos del canvas
  bindEventListeners();
  
  // 4. Escuchar mensajes del service worker (ej. "LOAD_IMAGE")
  chrome.runtime.onMessage.addListener(handleBackgroundMessage);
  
  // 5. Avisar al service worker que la UI está lista para recibir imágenes
  chrome.runtime.sendMessage({ type: "SIDEPANEL_READY" });
}

// Ejecutar la inicialización cuando el HTML esté cargado
document.addEventListener('DOMContentLoaded', init);
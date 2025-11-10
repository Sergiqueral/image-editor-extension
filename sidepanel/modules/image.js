// sidepanel/modules/image.js

// Importaciones necesarias
import { state, DEFAULT_SETTINGS } from './state.js';
import { saveSettings } from './storage.js';
import { updateSettingsUI } from './ui.js';
import { scheduleRender } from './render.js';

/**
 * El objeto Image() global que se usará para dibujar el logo en el canvas.
 * Se exporta para que render.js pueda acceder a él.
 */
export let logoImage = null;

/**
 * Carga una imagen (desde una ruta o data:URL) en el objeto logoImage.
 * Maneja los eventos onload y onerror.
 * @param {string | null} src - La ruta del archivo o la data:URL de la imagen.
 */
export function loadLogoImage(src) {
  // Si el src que llega es null, forzar el default.
  const logoSrcToLoad = src || DEFAULT_SETTINGS.logo.src;

  logoImage = new Image();
  logoImage.src = logoSrcToLoad;
  
  logoImage.onload = () => {
    scheduleRender(); // Re-renderizar cuando el logo esté listo
  };
  
  logoImage.onerror = () => {
    console.error("Error al cargar el logo:", logoSrcToLoad);
    logoImage = null; // Limpiar la imagen rota

    // Si el logo que falló era uno personalizado (data:URL)...
    if (logoSrcToLoad && logoSrcToLoad.startsWith('data:')) {
      // ...revertir al predeterminado.
      state.settings.logo.src = DEFAULT_SETTINGS.logo.src;
      saveSettings(); 
      updateSettingsUI();
      // Volver a llamar para cargar el logo predeterminado
      loadLogoImage(DEFAULT_SETTINGS.logo.src); 
    } else {
      // El logo PREDETERMINADO está roto (error grave de extensión) o el src era null.
      // Dejar de intentar dibujarlo.
      scheduleRender(); 
    }
  };
}
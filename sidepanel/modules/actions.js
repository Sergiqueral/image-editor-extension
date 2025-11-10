// sidepanel/modules/actions.js

// Importar el estado, el DOM, y las funciones de renderizado y guardado
import { state } from './state.js';
import { canvas, emptyState, errorState, btnDownload, errorMessage } from './dom.js';
import { scheduleRender, renderCanvas } from './render.js';
import { saveSettings } from './storage.js';

/**
 * Muestra un mensaje de error en la UI.
 * @param {string} message - El mensaje de error a mostrar.
 */
export function handleLoadError(message) {
    emptyState.classList.add('hidden');
    errorState.classList.remove('hidden');
    errorMessage.textContent = message;
    btnDownload.disabled = true;
    state.currentImage = null; // Limpiar la imagen actual
    scheduleRender(); // Renderizar el canvas vacío
}

/**
 * Maneja los mensajes entrantes del service worker (background.js).
 */
export function handleBackgroundMessage(request, sender, sendResponse) {
  if (request.type === "LOAD_IMAGE") {
    const { src, name } = request.payload;
    
    // Usamos state.currentImage como el objeto de imagen
    state.currentImage = new Image();
    state.currentImage.src = src;
    state.imageName = name;
    
    state.currentImage.onload = () => {
      // Imagen cargada. Ocultar estado vacío/error
      emptyState.classList.add('hidden');
      errorState.classList.add('hidden');
      btnDownload.disabled = false;
      
      // Resetear encuadre para la nueva imagen
      resetTransform(); // Esto llamará a scheduleRender()
    };
    state.currentImage.onerror = () => {
        handleLoadError("No se pudo cargar la imagen seleccionada (data:url inválida).");
    };
  } else if (request.type === "LOAD_ERROR") {
    handleLoadError(request.payload.message);
  }
}

/**
 * Restablece el encuadre (zoom, pan, rotación) de la imagen actual a su estado inicial.
 * @param {boolean} [render=true] - Si es true, agenda un nuevo renderizado.
 */
export function resetTransform(render = true) {
  const img = state.currentImage;
  if (!img) return;

  // Calcular escala inicial para que la imagen quepa ("fit")
  const scaleX = canvas.width / img.width;
  const scaleY = canvas.height / img.height;
  const initialScale = Math.max(scaleX, scaleY); // Usamos max para que llene el canvas 1:1

  state.transform = {
    x: 0,
    y: 0,
    scale: initialScale,
    rotation: 0,
    flipH: false,
    flipV: false
  };

  if (render) scheduleRender();
}

/**
 * Lógica para el botón de descarga.
 * Guarda los ajustes, fuerza un render final y descarga la imagen.
 */
export function downloadImage() {
    // 1. Guardar ajustes finales por si acaso
    saveSettings();
    
    // 2. Forzar un renderizado síncrono final
    // No usamos scheduleRender() para asegurar que el canvas está 100% listo.
    renderCanvas(); 
    
    // 3. Generar nombre de archivo inteligente
    const format = state.settings.output.format;
    const extension = format.split('/')[1];
    
    let nameParts = [state.imageName];
    if (state.ui.isLogoVisible && state.settings.logo.src) nameParts.push("con_logo");
    if (state.ui.isFrameVisible && state.settings.frame.type !== 'none') nameParts.push(`con_marco_${state.settings.frame.type}`);
    
    const finalName = `${nameParts.join('_')}.${extension}`;

    // 4. Crear un blob desde el canvas y usar la API chrome.downloads
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        
        chrome.downloads.download({
          url: url,
          filename: finalName
        }, () => {
          // Limpiar el Object URL después de que la descarga inicie
          URL.revokeObjectURL(url);
        });
      },
      format,
      0.9 // Calidad para JPEG/WEBP
    );
}
// sidepanel/background.js

// --- Constantes y Valores por Defecto ---
// Define los ajustes de fábrica para un nuevo usuario
const DEFAULT_SETTINGS = {
  logo: { 
    src: "/images/logo-default.png",
    opacity: 0.25, 
    size: 0.50, 
    position: 'bottom-right', 
    rotation: -15 
  },
  frame: {
    type: 'simple', 
    colorSimple: '#000000',
    colorOuter: '#000000',
    colorInner: '#000000',
    colorShadow: '#000000',
    colorVignette: '#000000',
    sizeSimple: 10,
    sizeDoubleOuter: 1,
    sizeDoubleInner: 1,
    sizeDoubleSep: 10,
    cornerRadius: 0,
    shadowBlur: 15,
    shadowOffset: 5,
    vignetteIntensity: 0.5
  },
  output: { format: 'image/png' }
};

// --- Variables de estado de comunicación ---
let pendingImageRequest = null; // Almacena la solicitud de imagen si el panel aún no está listo
let activeTabId = null; // La pestaña activa donde se abrió el sidePanel
let isSidePanelReady = false; // ¿Está el panel escuchando?
let readyTabId = null; // ¿Qué pestaña está escuchando?

// --- Lógica del Service Worker ---

// 1. Al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
  // Crea el ítem del menú contextual solo para imágenes
  chrome.contextMenus.create({
    id: "format-product-image",
    title: "Formatear Imagen de Producto...",
    contexts: ["image"]
  });

  // Inicializa los ajustes por defecto en el almacenamiento
  chrome.storage.local.get('settings', (data) => {
    if (!data.settings) {
      chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

// 2. Al hacer clic en el ítem del menú
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "format-product-image") {
    const imageUrl = info.srcUrl;
    activeTabId = tab.id; // Guardamos la tabId de la pestaña activa

    // Abrir el panel lateral
    chrome.sidePanel.open({ tabId: tab.id });

    // Preparar la imagen (esto la pondrá en 'pendingImageRequest')
    prepareImageForPanel(imageUrl);
  }
});

// 3. Al hacer clic en el ícono de la extensión
chrome.action.onClicked.addListener((tab) => {
  activeTabId = tab.id; // Guardamos la tabId de la pestaña activa
  chrome.sidePanel.open({ tabId: tab.id });
});

// 4. Manejar la conexión del SidePanel (PARA SABER CUÁNDO SE CIERRA)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    // Escuchar cuando el panel se cierra
    port.onDisconnect.addListener(() => {
      isSidePanelReady = false; // El panel se ha cerrado
      readyTabId = null;
      activeTabId = null; // Limpiamos la pestaña activa también
    });
  }
});

// 5. Manejar mensajes del SidePanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SIDEPANEL_READY") {
    isSidePanelReady = true; // El panel AHORA está listo

    // Usamos la 'activeTabId' que guardamos en los eventos onClicked
    if (activeTabId) {
        readyTabId = activeTabId;
    } else {
        console.error("SidePanel está READY, pero no hay activeTabId guardada.");
        return;
    }
    
    // Si hay una imagen pendiente PARA ESTA PESTAÑA, la enviamos ahora
    if (pendingImageRequest && activeTabId === readyTabId) {
      sendPendingRequest();
    }
  }
});

/**
 * Función principal para gestionar la imagen de origen y guardarla como pendiente.
 */
async function prepareImageForPanel(srcUrl) {
  let imageDataUrl;
  let imageName = "imagen_producto";

  try {
    const url = new URL(srcUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const nameOnly = fileName.substring(0, fileName.lastIndexOf('.'));
    if (nameOnly) {
      imageName = nameOnly.replace(/[^a-z0-9_]/gi, '-').toLowerCase();
    }
  } catch (e) { /* Ignorar error de URL si es data: o inválida */ }

  if (srcUrl.startsWith('data:')) {
    imageDataUrl = srcUrl;
  } else {
    try {
      // Usamos fetch() para obtener la imagen (evita CORS gracias a host_permissions)
      const response = await fetch(srcUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      imageDataUrl = await blobToDataURL(blob);
      
    } catch (error) {
      console.error("Error fetching image:", error);
      pendingImageRequest = {
        error: true,
        message: "No se pudo cargar la imagen. Puede estar protegida."
      };
      sendPendingRequest(); // Intentar enviar el error si el panel ya está listo
      return;
    }
  }

  // Almacenar la imagen y el nombre como una solicitud pendiente
  pendingImageRequest = {
    src: imageDataUrl,
    name: imageName
  };

  // Intentar enviar la solicitud
  sendPendingRequest();
}

/**
 * Helper para enviar la solicitud pendiente SI el panel está listo.
 */
function sendPendingRequest() {
  // Solo enviar si el panel está listo Y la pestaña activa coincide con la pestaña del panel
  if (isSidePanelReady && activeTabId === readyTabId && pendingImageRequest) {
    
    if (pendingImageRequest.error) {
      chrome.runtime.sendMessage({
        type: "LOAD_ERROR",
        payload: { message: pendingImageRequest.message }
      });
    } else {
      chrome.runtime.sendMessage({
        type: "LOAD_IMAGE",
        payload: pendingImageRequest
      });
    }
    pendingImageRequest = null; // Limpiar
  }
  // Si el panel no está listo, la solicitud PERMANECE en pendingImageRequest
}

// Helper para convertir un Blob a Data URL
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
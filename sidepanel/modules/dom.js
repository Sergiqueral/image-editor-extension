// sidepanel/modules/dom.js

// Contenedores principales y Canvas
export const appContainer = document.getElementById('app-container');
export const canvasWrapper = document.getElementById('canvas-wrapper');
export const canvas = document.getElementById('editor-canvas');
export const ctx = canvas.getContext('2d');

// Estados del Canvas
export const emptyState = document.getElementById('empty-state');
export const errorState = document.getElementById('error-state');
export const errorMessage = document.getElementById('error-message');

// Vistas de Controles
export const mainControls = document.getElementById('main-controls');
export const settingsControls = document.getElementById('settings-controls');

// --- Controles Principales ---
export const toggleLogo = document.getElementById('toggle-logo');
export const toggleFrame = document.getElementById('toggle-frame');
export const btnRotate = document.getElementById('btn-rotate');
export const btnFlipH = document.getElementById('btn-flip-h');
export const btnFlipV = document.getElementById('btn-flip-v');
export const btnResetTransform = document.getElementById('btn-reset-transform');
export const selectFormat = document.getElementById('select-format');
export const btnDownload = document.getElementById('btn-download');
export const btnGoSettings = document.getElementById('btn-go-settings');

// --- Controles de Ajustes (Generales) ---
export const btnBackMain = document.getElementById('btn-back-main');
export const btnResetAll = document.getElementById('btn-reset-all-settings');

// --- Controles de Ajustes de Logo ---
export const toggleLogoSettings = document.getElementById('toggle-logo-settings');
export const logoPosition = document.getElementById('logo-position');
export const logoOpacity = document.getElementById('logo-opacity');
export const logoOpacityVal = document.getElementById('logo-opacity-val');
export const logoSize = document.getElementById('logo-size');
export const logoSizeVal = document.getElementById('logo-size-val');
export const logoRotation = document.getElementById('logo-rotation');
export const logoRotationVal = document.getElementById('logo-rotation-val');
export const logoUpload = document.getElementById('logo-upload');
export const logoRestore = document.getElementById('logo-restore-default');
export const logoPreview = document.getElementById('logo-preview');

// --- Controles de Ajustes de Marco (Generales) ---
export const toggleFrameSettings = document.getElementById('toggle-frame-settings');
export const frameType = document.getElementById('frame-type');
export const frameCornerRadius = document.getElementById('frame-corner-radius');
export const frameCornerRadiusVal = document.getElementById('frame-corner-radius-val');

// Controles de Marco: Simple
export const frameColorSimple = document.getElementById('frame-color-simple');
export const frameSizeSimple = document.getElementById('frame-size-simple');
export const frameSizeSimpleVal = document.getElementById('frame-size-simple-val');

// Controles de Marco: Doble
export const frameColorOuter = document.getElementById('frame-color-double-outer');
export const frameSizeDoubleOuter = document.getElementById('frame-size-double-outer');
export const frameSizeDoubleOuterVal = document.getElementById('frame-size-double-outer-val');
export const frameColorInner = document.getElementById('frame-color-double-inner');
export const frameSizeDoubleInner = document.getElementById('frame-size-double-inner');
export const frameSizeDoubleInnerVal = document.getElementById('frame-size-double-inner-val');
export const frameSizeDoubleSep = document.getElementById('frame-size-double-sep');
export const frameSizeDoubleSepVal = document.getElementById('frame-size-double-sep-val');

// Controles de Marco: Sombra
export const frameColorShadow = document.getElementById('frame-color-shadow');
export const frameShadowBlur = document.getElementById('frame-shadow-blur');
export const frameShadowBlurVal = document.getElementById('frame-shadow-blur-val');
export const frameShadowDistance = document.getElementById('frame-shadow-distance'); // Renombrado
export const frameShadowDistanceVal = document.getElementById('frame-shadow-distance-val'); // Renombrado

// Controles de Marco: Viñeta
export const frameColorVignette = document.getElementById('frame-color-vignette');
export const frameVignetteIntensity = document.getElementById('frame-vignette-intensity');
export const frameVignetteIntensityVal = document.getElementById('frame-vignette-intensity-val');
// sidepanel/modules/state.js

export const state = {
  currentImage: null,
  imageName: 'imagen_producto',
  transform: { x: 0, y: 0, scale: 1, rotation: 0, flipH: false, flipV: false },
  ui: {
    isLogoVisible: true,
    isFrameVisible: true
  },
  settings: {}
};

export const DEFAULT_SETTINGS = {
  logo: {
    src: "/images/logo-default.png",
    opacity: 0.25, size: 0.50,
    position: 'bottom-right', rotation: -15
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
    shadowDistance: 5, // Renombrado
    vignetteIntensity: 0.5
  },
  output: { 
    format: 'image/png' 
  }
};
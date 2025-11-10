// sidepanel/modules/render.js

import * as dom from './dom.js';
import { state } from './state.js';
import { logoImage } from './image.js';

let isRenderScheduled = false;

export function scheduleRender() {
  if (isRenderScheduled) {
    return;
  }
  isRenderScheduled = true;
  requestAnimationFrame(renderCanvas);
}

export function renderCanvas() {
  isRenderScheduled = false; 
  
  const { transform, ui, settings } = state;
  const cw = dom.canvas.width;
  const ch = dom.canvas.height;

  dom.ctx.clearRect(0, 0, cw, ch);
  dom.ctx.fillStyle = '#ffffff';
  dom.ctx.fillRect(0, 0, cw, ch);

  if (!state.currentImage) {
    return;
  }
  
  const img = state.currentImage;

  dom.ctx.save();
  dom.ctx.translate(cw / 2, ch / 2);
  dom.ctx.translate(transform.x, transform.y);
  dom.ctx.rotate(transform.rotation * Math.PI / 180);
  dom.ctx.scale(transform.scale * (transform.flipH ? -1 : 1), transform.scale * (transform.flipV ? -1 : 1));
  dom.ctx.drawImage(img, -img.width / 2, -img.height / 2);
  dom.ctx.restore();

  if (ui.isFrameVisible && settings.frame.type !== 'none') {
    drawFrame(settings.frame);
  }

  if (ui.isLogoVisible && logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    drawLogo(settings.logo); 
  }
}

/**
 * Helper para crear un path de rectángulo redondeado.
 * No dibuja, solo crea el path para que 'clip', 'stroke' o 'fill' puedan usarlo.
 */
function createRoundedRectPath(ctx, x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  
  ctx.beginPath();
  if (radius <= 0) {
    ctx.rect(x, y, width, height);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
  }
  ctx.closePath();
}

export function drawFrame(frame) {
  const { type, colorSimple, colorOuter, colorInner, colorShadow, colorVignette,
          sizeSimple, sizeDoubleOuter, sizeDoubleInner, sizeDoubleSep,
          cornerRadius, shadowBlur, shadowDistance, vignetteIntensity } = frame;
  
  const w = dom.canvas.width;
  const h = dom.canvas.height;
  
  dom.ctx.save();
  
  if (type === 'simple') {
    dom.ctx.strokeStyle = colorSimple;
    dom.ctx.lineWidth = sizeSimple;
    createRoundedRectPath(dom.ctx, 0, 0, w, h, cornerRadius);
    dom.ctx.stroke();
    
  } else if (type === 'double') {
    dom.ctx.strokeStyle = colorOuter;
    dom.ctx.lineWidth = sizeDoubleOuter;
    createRoundedRectPath(dom.ctx, 0, 0, w, h, cornerRadius);
    dom.ctx.stroke();
    
    dom.ctx.strokeStyle = colorInner;
    dom.ctx.lineWidth = sizeDoubleInner;
    const innerPos = sizeDoubleOuter + sizeDoubleSep;
    const innerRadius = Math.max(0, cornerRadius - innerPos);
    createRoundedRectPath(dom.ctx, innerPos, innerPos, w - (innerPos * 2), h - (innerPos * 2), innerRadius);
    dom.ctx.stroke();

  } else if (type === 'shadow') {
    // TÉCNICA DE SOMBRA INTERIOR
    // 1. Dibuja la "ventana" (el rectángulo redondeado)
    createRoundedRectPath(dom.ctx, 0, 0, w, h, cornerRadius);
    // 2. Córtalo del canvas
    dom.ctx.clip();
    // 3. Configura la sombra
    dom.ctx.shadowColor = colorShadow;
    dom.ctx.shadowBlur = shadowBlur;
    dom.ctx.shadowOffsetX = shadowDistance;
    dom.ctx.shadowOffsetY = shadowDistance;
    // 4. Dibuja un "agujero" inverso
    // Esto dibuja en todas partes EXCEPTO en el agujero,
    // proyectando la sombra HACIA ADENTRO.
    dom.ctx.beginPath();
    dom.ctx.rect(0, 0, w, h); // Rect interior
    dom.ctx.rect(-w, -h, w * 3, h * 3); // Rect exterior gigante
    dom.ctx.fillStyle = "black"; // El color no importa
    dom.ctx.fill("evenodd"); // ¡Magia!

  } else if (type === 'vignette') {
    const gradient = dom.ctx.createRadialGradient(w / 2, h / 2, w * (0.5 - vignetteIntensity / 2), w / 2, h / 2, w / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(vignetteIntensity, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, colorVignette);
    
    dom.ctx.fillStyle = gradient;
    dom.ctx.fillRect(0, 0, w, h);
  }
  
  dom.ctx.restore();
  dom.ctx.lineWidth = 1;
}

export function drawLogo(logo) {
  const { opacity, size, position, rotation } = logo;
  const cw = dom.canvas.width;
  const ch = dom.canvas.height;
  const LOGO_MARGIN = 15; 
  const safeWidth = cw - (LOGO_MARGIN * 2);
  const safeHeight = ch - (LOGO_MARGIN * 2);
  let baseWidth, baseHeight;
  const logoAspectRatio = logoImage.width / logoImage.height;
  if (logoAspectRatio >= 1) { 
    baseWidth = safeWidth;
    baseHeight = baseWidth / logoAspectRatio;
  } else {
    baseHeight = safeHeight;
    baseWidth = baseHeight * logoAspectRatio;
  }
  const logoWidth = baseWidth * size;
  const logoHeight = baseHeight * size;
  const rad = rotation * Math.PI / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotatedWidth = logoWidth * cos + logoHeight * sin;
  const rotatedHeight = logoWidth * sin + logoHeight * cos;
  let cx, cy; 
  switch (position) {
    case 'top-left':
      cx = LOGO_MARGIN + (rotatedWidth / 2);
      cy = LOGO_MARGIN + (rotatedHeight / 2);
      break;
    case 'top-right':
      cx = cw - LOGO_MARGIN - (rotatedWidth / 2);
      cy = LOGO_MARGIN + (rotatedHeight / 2);
      break;
    case 'bottom-left':
      cx = LOGO_MARGIN + (rotatedWidth / 2);
      cy = ch - LOGO_MARGIN - (rotatedHeight / 2);
      break;
    case 'center':
      cx = cw / 2;
      cy = ch / 2;
      break;
    case 'bottom-right':
    default:
      cx = cw - LOGO_MARGIN - (rotatedWidth / 2);
      cy = ch - LOGO_MARGIN - (rotatedHeight / 2);
  }
  dom.ctx.save();
  dom.ctx.globalAlpha = opacity;
  dom.ctx.translate(cx, cy);
  dom.ctx.rotate(rad);
  dom.ctx.drawImage(logoImage, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
  dom.ctx.restore();
}
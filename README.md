# Editor de Imágenes de Producto SERVEIX <img>

Una extensión de Chrome (Manifest V3) para capturar y formatear imágenes de producto (cuadradas, con logo y marco) en menos de 10 segundos.

## ✨ Características

* **Captura Rápida:** Añade una opción al menú contextual (clic derecho) sobre cualquier imagen web.
* **Editor en Panel Lateral:** Abre la imagen en un panel lateral (`SidePanel`) para una edición rápida.
* **Anti-CORS:** Utiliza el Service Worker para hacer `fetch()` de imágenes de cualquier dominio.
* **Edición No Destructiva:** Previsualiza cambios de logo y marco en tiempo real sin perder tus ajustes.
* **Controles de Marco Avanzados:** Incluye marcos simples, dobles, sombra interior y viñeta, todos personalizables.
* **Rendimiento:** Optimizado con `requestAnimationFrame` para que los sliders de ajuste sean fluidos.

## 🛡️ Privacidad y Permisos

Esta extensión requiere el permiso `host_permissions` (`<all_urls>`) por una sola razón: permitir que el Service Worker descargue la imagen en la que el usuario ha hecho clic, superando las restricciones de CORS.

**El código es 100% de código abierto, no recopila, almacena ni comparte ningún dato del usuario.**

[Enlace a la Política de Privacidad](URL_DE_TU_GOOGLE_DOC)

## 📦 Instalación (para Desarrolladores)

1.  Clona este repositorio: `git clone ...`
2.  Abre Chrome y ve a `chrome://extensions/`.
3.  Activa el "Modo de desarrollador".
4.  Haz clic en "Cargar descomprimida" y selecciona la carpeta de este repositorio.
# Política de Privacidad para "Editor de Imágenes de Producto"

Fecha de última actualización: 10 de noviembre de 2025

Esta política de privacidad rige el uso de la extensión de Chrome "Editor de Imágenes de Producto" (en adelante, "la Extensión"), desarrollada por Sergiqueral.

## 1. Recopilación y Uso de Datos

La Extensión **no recopila, almacena, ni comparte ningún dato personal o de navegación del usuario**.

Todo el procesamiento de imágenes, la aplicación de logos y marcos ocurre localmente en el navegador del usuario. No se envía ninguna imagen ni información personal a ningún servidor externo.

## 2. Datos Almacenados Localmente (Permiso `storage`)

La Extensión utiliza la API `chrome.storage.local` para guardar la configuración del usuario. Esto incluye:

* El archivo de logo (marca de agua) que el usuario ha subido.
* Los ajustes de opacidad, tamaño, rotación y posición del logo.
* Las preferencias de marcos (tipo, color, grosor).

Estos datos se guardan **únicamente en el ordenador local del usuario** y nunca se transmiten. El propósito es mejorar la experiencia del usuario, evitando que tenga que cargar su logo y configurar sus preferencias cada vez que usa la extensión.

## 3. Justificación de Permisos

La Extensión solicita los siguientes permisos para su funcionamiento exclusivo:

* **`contextMenus`**: Para añadir la opción "Editar imagen" al menú de clic derecho del navegador. Esta es la forma principal de enviar una imagen al editor.
* **`sidePanel`**: Para mostrar la interfaz de usuario del editor en el panel lateral de Chrome.
* **`downloads`**: Para permitir al usuario guardar la imagen editada (con logo y marco) en su carpeta de descargas.
* **`host_permissions (<all_urls>)`**: Este permiso se solicita por una única razón: permitir que el Service Worker descargue la imagen original en la que el usuario ha hecho clic, superando las restricciones de CORS.

**Importante:** La Extensión no utiliza este permiso para leer, alterar o recopilar ningún otro dato de los sitios web que visita el usuario.

## 4. Código Abierto

El código de la Extensión es 100% de código abierto. Cualquiera puede revisar el código fuente completo en el repositorio de GitHub para verificar que esta política de privacidad se cumple.

## 5. Contacto

Si tiene alguna pregunta sobre esta política de privacidad, puede abrir un "issue" en el repositorio de GitHub del proyecto o enviar un correo a info@serveix.me.
# Portfolio profesional de Macarena Musa

Sitio estático en español con secciones en inglés. No requiere compilación ni dependencias locales.

## Abrir en local

Se puede abrir `index.html` directamente. Para probarlo mediante HTTP, ejecutá `py -m http.server 8000 --bind 127.0.0.1` en esta carpeta (en otros sistemas, `python3 -m http.server 8000 --bind 127.0.0.1`) y abrí `http://127.0.0.1:8000/`. Cerrá el servidor con Ctrl+C.

## Actualizar contenido

- `index.html` contiene la navegación, el contenido de las secciones y los metadatos.
- `assets/css/styles.css` contiene los estilos responsive y las animaciones. `assets/js/main.js` controla la entrada, el menú, el visor, el selector de empresas y los efectos de desplazamiento. GitHub está disponible mediante el enlace al perfil.
- Reemplazá el PDF aprobado en `assets/pdf/Macarena_Musa_CV.pdf` para actualizar las dos descargas. La foto, el certificado y el prototipo se guardan en `assets/img/`.
- Si se incorporan proyectos, agregá una sección visible y su enlace al menú. El elemento `project-card-template` sirve para crear tarjetas sin exponer contenido vacío.
- Poppins, Shantell Sans e iconos de Devicon se cargan externamente. La presentación conserva alternativas tipográficas y etiquetas legibles si falla la carga.

## Publicación y versiones

El destino previsto es `macarenamusa48/macarenamusa48.github.io`. En GitHub, seleccioná **Settings → Pages → Deploy from a branch → main → / (root)**. El sitio estático usa `.nojekyll` y no necesita un paso de compilación.

- Revisá los archivos preparados con `git status --short` antes de cada commit. La lista de publicación de `.gitignore` excluye el ZIP de referencia, los duplicados y los archivos locales. Si agregás un recurso para el sitio, incorporá su ruta a esa lista.
- Para actualizar el sitio, hacé los cambios en una rama, probalos en local y luego integrá los commits en `main`. GitHub Pages publica esa rama.
- La primera versión estable se identifica con la etiqueta Git `v1.0.0` y el título de release **Portfolio definitivo**. Para recuperar esa versión, descargá el código desde Releases o consultá la etiqueta con `git switch --detach v1.0.0`.
- Para Search Console, agregá y verificá la propiedad de prefijo `https://macarenamusa48.github.io/`. Enviá `sitemap.xml` y solicitá la indexación de la portada desde **Inspección de URLs** una vez publicado el sitio.
- Si cambia el dominio, actualizá la URL canónica y los metadatos en `index.html`, además de `robots.txt` y `sitemap.xml`.

## Diseño de referencia

El ZIP de referencia se revisó para entender la estructura y el estilo. No contiene un archivo de licencia. El código del portfolio se escribió para esta implementación y los documentos e imágenes personales proceden de los archivos entregados por Macarena.

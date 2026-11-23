# 🚀 Portafolio Web Personal (Frontend & DevOps Ready)

Un sistema de portafolio web personal 100% frontend, moderno, ultra ligero y totalmente responsivo construido con **Bootstrap 5.3**, **Bootstrap Icons**, **Vanilla JavaScript (ES6+)** y **Docker**. Diseñado con una arquitectura desacoplada donde el contenido se gestiona exclusivamente a través de un archivo JSON (`data/portfolio.json`), permitiendo despliegues continuos automáticos (CI/CD) en **Vercel** simplemente haciendo `git push`.

---

## 🌟 Características Principales

- **100% Frontend sin dependencias pesadas:** HTML5 semántico, Bootstrap 5.3 y Bootstrap Icons servidos vía CDN.
- **Carga de Datos Automatizada:** Toda la información del portafolio (perfil, proyectos, habilidades, redes y enlaces) se inyecta dinámicamente con `fetch('./data/portfolio.json')`.
- **Modo Oscuro / Claro Nativo:** Configurado en modo oscuro por defecto (`data-bs-theme="dark"`), con botón en el navbar para alternar y persistencia mediante `localStorage`.
- **Filtro Dinámico de Proyectos:** Filtrado instantáneo por categorías (*Todos, Web, Móvil, DevOps/Otros*) sin recargar la página.
- **Interacciones Modernas:** Botón para copiar el correo al portapapeles con confirmación visual mediante **Toast de Bootstrap 5**.
- **Entorno Dockerizado (DevOps):** Servidor ligero `nginx:alpine` con volumen montado (`./:/usr/share/nginx/html:ro`) para edición en vivo en el IDE.
- **Listo para Vercel:** Estructura con `index.html` en la raíz y `.vercelignore` para excluir archivos de Docker del despliegue.

---

## 📁 Estructura del Proyecto

```text
/
├── index.html              # Punto de entrada HTML5 y estructura semántica
├── css/
│   └── styles.css          # Estilos personalizados (glassmorphism, animaciones, hover)
├── js/
│   └── app.js              # Lógica ES6+ (fetch dinámico, filtros, tema y toast)
├── data/
│   └── portfolio.json      # Base de datos JSON con todos los textos y proyectos
├── assets/                 # SVGs e imágenes vectoriales de proyectos y avatar
├── Dockerfile              # Imagen Nginx Alpine de producción y desarrollo
├── docker-compose.yml      # Orquestación de contenedor con volumen en vivo
├── .dockerignore           # Archivos excluidos en la construcción de la imagen
├── .vercelignore           # Archivos excluidos del despliegue en Vercel
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Documentación y guía de uso
```

---

## 🐳 Levantar Localmente con Docker

Asegúrate de tener instalado [Docker Desktop](https://www.docker.com/).

### 1. Iniciar el contenedor en segundo plano:
```bash
docker compose up -d
```

### 2. Abrir en el navegador:
Ingresa a: **[http://localhost:8080](http://localhost:8080)**

> 💡 **Hot Reloading:** Al tener configurado el volumen `./:/usr/share/nginx/html:ro` en `docker-compose.yml`, cualquier cambio que guardes en `data/portfolio.json`, `index.html`, `css/` o `js/` se reflejará de inmediato al recargar el navegador (`F5`), sin necesidad de reiniciar o reconstruir el contenedor.

### 3. Detener el contenedor:
```bash
docker compose down
```

---

## 💻 Levantar Sin Docker (Alternativas)

Al ser una aplicación web estática, puedes servirla con cualquier servidor HTTP local:

- **VS Code:** Instala la extensión **Live Server** y haz clic en *"Go Live"*.
- **Python:**
  ```bash
  python -m http.server 8080
  ```
- **Node.js (npx):**
  ```bash
  npx serve .
  ```

---

## ⚡ Despliegue Automático en Vercel (CI/CD con GitHub)

El proyecto está 100% optimizado para la infraestructura de Vercel gracias a su estructura en raíz y el archivo `.vercelignore`.

### Pasos para desplegar:
1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

2. **Conectar con Vercel:**
   - Inicia sesión en [Vercel](https://vercel.com/).
   - Selecciona **"Add New..."** ➔ **"Project"**.
   - Importa tu repositorio de GitHub recién creado.
   - Deja las configuraciones por defecto (Framework Preset: *Other*, Root Directory: `./`).
   - Haz clic en **Deploy**.

3. **Automatización CI/CD:**
   - Cada vez que agregues un nuevo proyecto o actualices tu información, solo edita `data/portfolio.json`.
   - Haz un `git push` a `main`.
   - Vercel detectará el commit y compilará automáticamente una nueva versión en cuestión de segundos.

---

## ✏️ ¿Cómo Personalizar tus Datos?

Para personalizar el portafolio con tus datos reales, abre [`data/portfolio.json`](data/portfolio.json) y modifica:

- **`profile`:** Tu nombre, título, bio, correo electrónico, estado de disponibilidad y enlaces a tus perfiles sociales.
- **`projects`:** Arreglo con tus proyectos. Cada uno contiene:
  - `title`: Nombre del proyecto.
  - `category`: `"web"`, `"movil"` o `"otros"` (usado por los botones de filtro).
  - `description`: Breve resumen explicativo.
  - `image`: Ruta a la imagen o mockup.
  - `tags`: Arreglo de tecnologías (ej. `["React", "Node.js", "Docker"]`).
  - `github`: Enlace al repositorio.
  - `demo`: Enlace al despliegue o demo en vivo.
- **`skills`:** Categorías de habilidades con sus respectivos íconos de [Bootstrap Icons](https://icons.getbootstrap.com/) y lista de tecnologías.

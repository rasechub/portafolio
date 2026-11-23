/**
 * ============================================================================
 * PORTAFOLIO WEB PERSONAL - APLICACIÓN PRINCIPAL (ES6+)
 * Carga dinámica desde ./data/portfolio.json, modo oscuro/claro y filtros
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFooterYear();
  initMobileNavAutoClose();
  loadPortfolioData();
});

/* Estado global de la aplicación */
let allProjects = [];
let currentEmail = 'contacto@ejemplo.com';

/**
 * ----------------------------------------------------------------------------
 * 1. GESTIÓN DEL TEMA (Modo Oscuro / Modo Claro)
 * Usa el atributo nativo de Bootstrap 5.3 data-bs-theme y localStorage
 * ----------------------------------------------------------------------------
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  // Modo Oscuro por defecto según especificación
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill text-warning';
        if (themeLabel) themeLabel.textContent = 'Modo Claro';
      } else {
        themeIcon.className = 'bi bi-moon-stars-fill text-body';
        if (themeLabel) themeLabel.textContent = 'Modo Oscuro';
      }
    }
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. CARGA DINÁMICA DE DATOS VÍA FETCH
 * Lee ./data/portfolio.json y renderiza todas las secciones
 * ----------------------------------------------------------------------------
 */
async function loadPortfolioData() {
  try {
    const response = await fetch('./data/portfolio.json');
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} al cargar portfolio.json`);
    }

    const data = await response.json();

    // Renderizar datos del perfil
    if (data.profile) {
      renderProfile(data.profile);
    }

    // Renderizar proyectos iniciales y preparar filtros
    if (Array.isArray(data.projects)) {
      allProjects = data.projects;
      renderProjects(allProjects);
      setupProjectFilters();
    }

    // Renderizar habilidades por categoría
    if (Array.isArray(data.skills)) {
      renderSkills(data.skills);
    }

  } catch (error) {
    console.error('Error al inicializar el portafolio:', error);
    showDataErrorMessage();
  }
}

/**
 * ----------------------------------------------------------------------------
 * 3. RENDERIZADO DEL PERFIL & HERO
 * ----------------------------------------------------------------------------
 */
function renderProfile(profile) {
  // Guardar email para la funcionalidad de copiar
  if (profile.email) {
    currentEmail = profile.email;
  }

  // Nombre y Brand
  const navName = document.getElementById('nav-name');
  const footerName = document.getElementById('footer-name');
  const heroName = document.getElementById('hero-name');
  if (navName) navName.textContent = profile.name || 'Mi Portafolio';
  if (footerName) footerName.textContent = profile.name || 'Desarrollador';
  if (heroName) heroName.textContent = profile.name || 'Desarrollador';

  // Rol y Bio
  const heroRole = document.getElementById('hero-role');
  const heroBio = document.getElementById('hero-bio');
  if (heroRole) heroRole.textContent = profile.role || 'Software Developer';
  if (heroBio) heroBio.textContent = profile.shortBio || '';

  // Avatar
  const heroAvatar = document.getElementById('hero-avatar');
  if (heroAvatar && profile.avatar) {
    heroAvatar.src = profile.avatar;
    heroAvatar.alt = `Foto de perfil de ${profile.name || 'desarrollador'}`;
  }

  // Estado de disponibilidad
  const heroStatus = document.getElementById('hero-status');
  const heroStatusText = document.getElementById('hero-status-text');
  if (heroStatus && heroStatusText) {
    if (profile.availableForWork) {
      heroStatus.classList.remove('d-none');
      heroStatusText.textContent = 'Disponible para nuevos proyectos';
    } else {
      heroStatusText.textContent = 'No disponible actualmente';
    }
  }

  // Redes Sociales en Hero y Contacto
  if (Array.isArray(profile.social)) {
    renderSocialLinks('hero-social', profile.social);
    renderSocialLinks('contact-social', profile.social);
  }

  // Sección de Contacto
  const contactEmail = document.getElementById('contact-email');
  const contactMailto = document.getElementById('contact-mailto-link');
  if (contactEmail) contactEmail.textContent = currentEmail;
  if (contactMailto) contactMailto.href = `mailto:${currentEmail}`;

  // Inicializar botón de copiar email
  setupCopyEmailButton();
}

/**
 * Renderiza los botones de redes sociales
 */
function renderSocialLinks(containerId, socialList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = socialList.map(item => `
    <a href="${escapeHtml(item.url)}" 
       target="_blank" 
       rel="noopener noreferrer" 
       class="btn btn-outline-secondary social-btn" 
       title="${escapeHtml(item.name)}" 
       aria-label="${escapeHtml(item.name)}">
      <i class="bi ${escapeHtml(item.icon)} fs-5"></i>
    </a>
  `).join('');
}

/**
 * ----------------------------------------------------------------------------
 * 4. RENDERIZADO Y FILTRO DE PROYECTOS
 * ----------------------------------------------------------------------------
 */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  const emptyState = document.getElementById('projects-empty');
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');

  grid.innerHTML = projects.map(proj => {
    // Badges de tecnologías
    const tagsHtml = (proj.tags || []).map(tag => `
      <span class="badge text-bg-secondary-subtle border border-secondary-subtle fw-normal me-1 mb-1">
        ${escapeHtml(tag)}
      </span>
    `).join('');

    // Categoría badge
    const categoryLabel = getCategoryLabel(proj.category);

    return `
      <div class="col">
        <div class="card h-100 project-card border shadow-sm">
          <div class="project-img-wrapper">
            <img src="${escapeHtml(proj.image)}" class="card-img-top" alt="${escapeHtml(proj.title)}" loading="lazy">
            <span class="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 backdrop-blur rounded-pill border border-secondary">
              ${escapeHtml(categoryLabel)}
            </span>
          </div>
          <div class="card-body d-flex flex-column">
            <h3 class="h5 card-title fw-bold mb-2">${escapeHtml(proj.title)}</h3>
            <p class="card-text text-body-secondary small flex-grow-1 mb-3">
              ${escapeHtml(proj.description)}
            </p>
            <div class="mb-3 d-flex flex-wrap">
              ${tagsHtml}
            </div>
            <div class="d-flex gap-2 pt-2 border-top">
              ${proj.github ? `
                <a href="${escapeHtml(proj.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-secondary flex-fill d-inline-flex align-items-center justify-content-center gap-1">
                  <i class="bi bi-github"></i> Código
                </a>
              ` : ''}
              ${proj.demo ? `
                <a href="${escapeHtml(proj.demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center gap-1">
                  <i class="bi bi-box-arrow-up-right"></i> Demo
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Configuración de eventos para los botones de filtro
 */
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Activar botón seleccionado
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      if (filterValue === 'all') {
        renderProjects(allProjects);
      } else {
        const filtered = allProjects.filter(p => (p.category || '').toLowerCase() === filterValue.toLowerCase());
        renderProjects(filtered);
      }
    });
  });
}

function getCategoryLabel(category) {
  switch ((category || '').toLowerCase()) {
    case 'web':
      return 'Web App';
    case 'movil':
      return 'Mobile App';
    case 'otros':
      return 'DevOps / CLI';
    default:
      return 'Proyecto';
  }
}

/**
 * ----------------------------------------------------------------------------
 * 5. RENDERIZADO DE HABILIDADES (TECH STACK)
 * ----------------------------------------------------------------------------
 */
function renderSkills(skills) {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = skills.map(group => {
    const itemsHtml = (group.items || []).map(skill => `
      <li class="list-group-item d-flex align-items-center gap-2 border-0 px-0 py-2 bg-transparent">
        <i class="bi bi-check2-circle text-primary"></i>
        <span>${escapeHtml(skill)}</span>
      </li>
    `).join('');

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 skill-card border shadow-sm p-3">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="skill-icon-wrapper">
                <i class="bi ${escapeHtml(group.icon || 'bi-code-slash')}"></i>
              </div>
              <h3 class="h5 fw-bold mb-0">${escapeHtml(group.category)}</h3>
            </div>
            <ul class="list-group list-group-flush">
              ${itemsHtml}
            </ul>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * ----------------------------------------------------------------------------
 * 6. FUNCIONALIDAD COPIAR CORREO CON TOAST DE BOOTSTRAP
 * ----------------------------------------------------------------------------
 */
function setupCopyEmailButton() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnIcon = document.getElementById('copy-btn-icon');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toastElement = document.getElementById('copyToast');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentEmail);
      } else {
        // Fallback clásico
        const tempInput = document.createElement('textarea');
        tempInput.value = currentEmail;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Mostrar Toast de Bootstrap
      if (toastElement && window.bootstrap) {
        const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
        toast.show();
      }

      // Feedback visual momentáneo en el botón
      if (copyBtnIcon && copyBtnText) {
        copyBtnIcon.className = 'bi bi-check-lg';
        copyBtnText.textContent = '¡Copiado!';
        copyBtn.classList.replace('btn-primary', 'btn-success');

        setTimeout(() => {
          copyBtnIcon.className = 'bi bi-clipboard';
          copyBtnText.textContent = 'Copiar correo';
          copyBtn.classList.replace('btn-success', 'btn-primary');
        }, 2500);
      }

    } catch (err) {
      console.error('Error al copiar correo:', err);
      alert(`Correo: ${currentEmail}`);
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 7. UTILIDADES
 * ----------------------------------------------------------------------------
 */
function initFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function initMobileNavAutoClose() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarContent');

  if (navbarCollapse && window.bootstrap) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      });
    });
  }
}

function showDataErrorMessage() {
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-warning d-inline-block" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          No se pudieron cargar los datos de <code>data/portfolio.json</code>. Verifica que el archivo exista o sirve el proyecto mediante un servidor local (Docker, Live Server o Vercel).
        </div>
      </div>
    `;
  }
}

function escapeHtml(string) {
  if (typeof string !== 'string') return '';
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

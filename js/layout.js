export class Layout {
  static getHeader() {
    return `
      <header class="header">
        <div class="header__container">
          <div class="header__logo-section">
            <img src="logo-creio.png" alt="Logo CREIO Belém" class="header__logo" width="60" height="60">
            <div>
              <h1 class="header__title">Biblioteca CREIO</h1>
              <p class="header__subtitle">Assembleia de Deus Belém - Cidade Ademar</p>
            </div>
          </div>
          <button class="header__menu-toggle" aria-label="Abrir menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    `;
  }

  static getNavigation(currentPage = '') {
    const pages = [
      { id: 'index', label: 'Início', href: 'index.html' },
      { id: 'catalog', label: 'Catálogo', href: 'pages/catalog.html' },
      { id: 'categories', label: 'Categorias', href: 'pages/categories.html' },
      { id: 'about', label: 'Sobre', href: 'pages/about.html' },
      { id: 'contact', label: 'Contato', href: 'pages/contact.html' }
    ];

    const navItems = pages.map(page => {
      const isActive = currentPage === page.id ? 'nav__link--active' : '';
      return `<a href="${page.href}" class="nav__link ${isActive}">${page.label}</a>`;
    }).join('');

    return `
      <nav class="nav" role="navigation" aria-label="Menu principal">
        <div class="nav__container">
          ${navItems}
        </div>
      </nav>
    `;
  }

  static getFooter() {
    const currentYear = new Date().getFullYear();
    return `
      <footer class="footer">
        <div class="footer__container">
          <div class="footer__content">
            <div class="footer__section">
              <h3 class="footer__heading">Sobre</h3>
              <p>Biblioteca CREIO é um projeto comunitário para fortalecer a fé e o conhecimento cristão.</p>
            </div>
            <div class="footer__section">
              <h3 class="footer__heading">Links Rápidos</h3>
              <ul class="footer__links">
                <li><a href="index.html">Início</a></li>
                <li><a href="pages/catalog.html">Catálogo</a></li>
                <li><a href="pages/contact.html">Contato</a></li>
              </ul>
            </div>
            <div class="footer__section">
              <h3 class="footer__heading">Contato</h3>
              <p>📍 Cidade Ademar - São Paulo/SP</p>
              <p>📧 contato@bibliotecacreio.org</p>
            </div>
          </div>
          <div class="footer__bottom">
            <p>&copy; ${currentYear} Biblioteca CREIO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }

  static initializeDOM(containerSelector, currentPage = '') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.insertAdjacentHTML('afterbegin', this.getHeader());
    container.insertAdjacentHTML('afterbegin', this.getNavigation(currentPage));
    container.insertAdjacentHTML('beforeend', this.getFooter());

    this.setupMobileMenu();
  }

  static setupMobileMenu() {
    const toggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.nav');

    if (toggle) {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav--mobile-open');
      });
    }

    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle?.setAttribute('aria-expanded', 'false');
        nav?.classList.remove('nav--mobile-open');
      });
    });
  }
}

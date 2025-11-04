import { Layout } from '../layout.js';
import { api } from '../api.js';
import { sanitizeHTML } from '../utils.js';

class CategoriesPage {
  constructor() {
    this.categories = [];
    this.init();
  }

  async init() {
    Layout.initializeDOM('#app', 'categories');
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      const list = document.getElementById('categoriesList');
      list.innerHTML = '<div class="loading-state"><div class="loading-state__spinner"></div></div>';

      this.categories = await api.getCategories();
      this.renderCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.showError('Erro ao carregar categorias. Tente novamente.');
    }
  }

  renderCategories() {
    const list = document.getElementById('categoriesList');

    if (this.categories.length === 0) {
      list.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state__icon">📁</div>
            <h3 class="empty-state__title">Nenhuma categoria encontrada</h3>
          </div>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    this.categories.forEach(category => {
      const card = document.createElement('a');
      card.href = `../pages/catalog.html?category=${encodeURIComponent(category.name)}`;
      card.className = 'category-card';
      card.style.textDecoration = 'none';
      card.style.color = 'inherit';

      const icon = this.getCategoryIcon(category.name);

      card.innerHTML = `
        <div class="category-card__icon">${icon}</div>
        <h3 class="category-card__title">${sanitizeHTML(category.name)}</h3>
        <p class="category-card__count">${category.book_count || 0} livros</p>
      `;

      fragment.appendChild(card);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  getCategoryIcon(categoryName) {
    const icons = {
      'Literatura Cristã': '📖',
      'Devocionais': '🙏',
      'Teologia': '✝️',
      'Infantil': '👶',
      'Biografias': '👤',
      'Comentários Bíblicos': '📚',
      'Espiritual': '✨'
    };

    return icons[categoryName] || '📖';
  }

  showError(message) {
    const list = document.getElementById('categoriesList');
    list.innerHTML = `
      <div style="grid-column: 1 / -1;">
        <div class="alert alert-error">
          ${sanitizeHTML(message)}
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CategoriesPage();
});

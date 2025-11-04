import { Layout } from '../layout.js';
import { api } from '../api.js';
import { sanitizeHTML } from '../utils.js';

class CatalogPage {
  constructor() {
    this.books = [];
    this.filteredBooks = [];
    this.categories = new Set();
    this.init();
  }

  async init() {
    Layout.initializeDOM('#app', 'catalog');
    await this.loadBooks();
    this.setupFilters();
  }

  async loadBooks() {
    try {
      const booksList = document.getElementById('booksList');
      booksList.innerHTML = '<div class="loading-state"><div class="loading-state__spinner"></div></div>';

      this.books = await api.fetchBooks();
      this.filteredBooks = [...this.books];

      this.books.forEach(book => {
        if (book.category) this.categories.add(book.category);
      });

      this.populateCategoryFilter();
      this.renderBooks();
    } catch (error) {
      console.error('Error loading books:', error);
      this.showError('Erro ao carregar catálogo. Tente novamente.');
    }
  }

  populateCategoryFilter() {
    const filterSelect = document.getElementById('categoryFilter');
    const fragment = document.createDocumentFragment();

    Array.from(this.categories).sort().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      fragment.appendChild(option);
    });

    filterSelect.appendChild(fragment);
  }

  setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    searchInput.addEventListener('input', () => this.applyFilters());
    categoryFilter.addEventListener('change', () => this.applyFilters());
    statusFilter.addEventListener('change', () => this.applyFilters());
  }

  applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    this.filteredBooks = this.books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        (book.category && book.category.toLowerCase().includes(search));

      const matchesCategory = !category || book.category === category;

      const isAvailable = book.available === true || String(book.available).toLowerCase() === 'true';
      const matchesStatus =
        !status ||
        (status === 'available' && isAvailable) ||
        (status === 'borrowed' && !isAvailable);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    this.renderBooks();
  }

  renderBooks() {
    const booksList = document.getElementById('booksList');

    if (this.filteredBooks.length === 0) {
      booksList.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state__icon">📚</div>
            <h3 class="empty-state__title">Nenhum livro encontrado</h3>
            <p>Tente ajustar seus filtros de busca.</p>
          </div>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    this.filteredBooks.forEach(book => {
      const card = this.createBookCard(book);
      fragment.appendChild(card);
    });

    booksList.innerHTML = '';
    booksList.appendChild(fragment);
  }

  createBookCard(book) {
    const isAvailable = book.available === true || String(book.available).toLowerCase() === 'true';
    const statusClass = isAvailable ? 'book-card__status--available' : 'book-card__status--borrowed';
    const statusText = isAvailable ? 'Disponível' : 'Alugado';

    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-card__image">
        ${book.cover ? `<img src="${sanitizeHTML(book.cover)}" alt="Capa de ${sanitizeHTML(book.title)}" loading="lazy">` : '📖'}
      </div>
      <div class="book-card__content">
        <h3 class="book-card__title">${sanitizeHTML(book.title)}</h3>
        <p class="book-card__author"><strong>Autor:</strong> ${sanitizeHTML(book.author)}</p>
        ${book.category ? `<p class="book-card__category"><strong>Categoria:</strong> ${sanitizeHTML(book.category)}</p>` : ''}
        <div class="book-card__footer">
          <span class="book-card__status ${statusClass}">${statusText}</span>
          ${isAvailable ? `<a href="../pages/borrow.html" class="btn btn-primary book-card__action">Alugar</a>` : ''}
        </div>
      </div>
    `;

    return card;
  }

  showError(message) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = `
      <div style="grid-column: 1 / -1;">
        <div class="alert alert-error">
          ${sanitizeHTML(message)}
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CatalogPage();
});

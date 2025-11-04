// Local: src/js/pages/catalog.js - Versão CORRIGIDA FINAL

import { Layout } from '../layout.js';
import { api } from '../api.js';
// 🚨 CORRIGIDO: A importação agora está correta.
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

      // ATUALIZADO: Usar o nome da coluna do Sheets: 'Categoria'
      this.books.forEach(book => {
        if (book.Categoria) this.categories.add(book.Categoria); 
      });

      this.populateCategoryFilter();
      this.renderBooks();
    } catch (error) {
      console.error('Error loading books:', error);
      // Aqui a mensagem de erro do Apps Script será exibida
      this.showError(error.message || 'Erro ao carregar catálogo. Tente novamente.');
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
      // ATUALIZADO: Usar Titulo, Autor, Categoria do Sheets
      const matchesSearch =
        (book.Titulo && book.Titulo.toLowerCase().includes(search)) ||
        (book.Autor && book.Autor.toLowerCase().includes(search)) ||
        (book.Categoria && book.Categoria.toLowerCase().includes(search)); 

      const matchesCategory = !category || book.Categoria === category;

      // ATUALIZADO: Lógica de disponibilidade baseada na coluna Status do Sheets
      const isAvailable = book.Status === 'Disponível'; 
      
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
    // ATUALIZADO: Usar Status, Capa, Titulo, ID do Sheets
    const isAvailable = book.Status === 'Disponível'; 
    const statusClass = isAvailable ? 'book-card__status--available' : 'book-card__status--borrowed';
    const statusText = book.Status; 

    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-card__image">
        ${book.Capa ? `<img src="${sanitizeHTML(book.Capa)}" alt="Capa de ${sanitizeHTML(book.Titulo)}" loading="lazy">` : '📖'}
      </div>
      <div class="book-card__content">
        <h3 class="book-card__title">${sanitizeHTML(book.Titulo)}</h3>
        <p class="book-card__author"><strong>Autor:</strong> ${sanitizeHTML(book.Autor)}</p>
        ${book.Categoria ? `<p class="book-card__category"><strong>Categoria:</strong> ${sanitizeHTML(book.Categoria)}</p>` : ''}
        <div class="book-card__footer">
          <span class="book-card__status ${statusClass}">${statusText}</span>
          ${isAvailable ? `<a href="../pages/borrow.html?id=${book.ID}" class="btn btn-primary book-card__action">Alugar</a>` : ''}
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

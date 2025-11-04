import { api } from './api.js';
import { ui } from './ui.js';
import { formatDate, showNotification } from './utils.js';
import { MESSAGES, CONFIG } from './config.js';

class LibraryApp {
  constructor() {
    this.books = [];
    this.elements = {
      catalog: document.getElementById('catalog'),
      bookSelect: document.getElementById('livroSelect'),
      form: document.getElementById('borrowForm'),
      message: document.getElementById('msg'),
      submitButton: null
    };

    this.init();
  }

  init() {
    this.elements.submitButton = this.elements.form.querySelector('button[type="submit"]');
    this.setupEventListeners();
    this.loadBooks();
  }

  setupEventListeners() {
    this.elements.form.addEventListener('submit', (e) => this.handleBorrowSubmit(e));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
  }

  handleSmoothScroll(event) {
    const href = event.currentTarget.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async loadBooks() {
    try {
      ui.showLoading(this.elements.catalog);

      this.books = await api.fetchBooks();

      ui.renderBooks(this.books, this.elements.catalog);
      ui.populateBookSelect(this.books, this.elements.bookSelect);

    } catch (error) {
      console.error('Failed to load books:', error);
      ui.showError(this.elements.catalog, MESSAGES.ERROR_LOADING);
    }
  }

  async handleBorrowSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.elements.form);
    const bookId = this.elements.bookSelect.value;
    const userName = formData.get('nome');
    const days = formData.get('dias');

    if (!bookId || !userName || !days) {
      showNotification(this.elements.message, 'Por favor, preencha todos os campos.', 'error');
      return;
    }

    this.setFormLoading(true);

    try {
      const result = await api.borrowBook(bookId, userName, days);

      if (result.success) {
        const returnDate = formatDate(result.devolucao);
        const successMessage = MESSAGES.SUCCESS_BORROWED.replace('{date}', returnDate);

        showNotification(this.elements.message, successMessage, 'success');

        this.elements.form.reset();
        this.elements.form.querySelector('input[name="dias"]').value = CONFIG.DEFAULT_RENTAL_DAYS;

        await this.loadBooks();
      }
    } catch (error) {
      console.error('Failed to borrow book:', error);
      const errorMessage = error.message || MESSAGES.ERROR_BORROWING;
      showNotification(this.elements.message, errorMessage, 'error');
    } finally {
      this.setFormLoading(false);
    }
  }

  setFormLoading(isLoading) {
    const button = this.elements.submitButton;
    const inputs = this.elements.form.querySelectorAll('input, select');

    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Processando...';
      inputs.forEach(input => input.disabled = true);
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Alugar';
      inputs.forEach(input => input.disabled = false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LibraryApp();
});

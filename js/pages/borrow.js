import { Layout } from '../layout.js';
import { FormValidator } from '../form-validator.js';
import { api } from '../api.js';
import { formatDate } from '../utils.js';

class BorrowPage {
  constructor() {
    this.books = [];
    this.validator = null;
    this.init();
  }

  async init() {
    Layout.initializeDOM('#app', 'borrow');
    this.validator = new FormValidator(document.getElementById('borrowForm'));
    await this.loadAvailableBooks();
    this.setupFormSubmit();
  }

  async loadAvailableBooks() {
    try {
      this.books = await api.fetchBooks();
      this.populateBookSelect();
    } catch (error) {
      console.error('Error loading books:', error);
      this.showErrorMessage('Erro ao carregar livros disponíveis.');
    }
  }

  populateBookSelect() {
    const select = document.getElementById('bookSelect');
    const availableBooks = this.books.filter(book => {
      const isAvailable = book.available === true || String(book.available).toLowerCase() === 'true';
      return isAvailable;
    });

    select.innerHTML = '';

    if (availableBooks.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'Nenhum livro disponível no momento';
      option.disabled = true;
      select.appendChild(option);
      return;
    }

    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um livro...';
    fragment.appendChild(defaultOption);

    availableBooks.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = `${book.title} - ${book.author}`;
      fragment.appendChild(option);
    });

    select.appendChild(fragment);
  }

  setupFormSubmit() {
    const form = document.getElementById('borrowForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!this.validator.validateForm()) {
        this.showErrorMessage('Por favor, corrija os erros no formulário.');
        return;
      }

      const values = this.validator.getValues();

      if (!values.acceptTerms) {
        this.showErrorMessage('Você deve concordar com os termos e condições.');
        return;
      }

      await this.submitBorrow(values);
    });
  }

  async submitBorrow(values) {
    const button = document.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Processando...';

    try {
      const result = await api.borrowBook(
        values.bookSelect,
        values.borrowerName,
        parseInt(values.rentalDays)
      );

      const returnDate = formatDate(result.devolucao);
      this.showSuccessMessage(
        `Livro alugado com sucesso! Devolução prevista para ${returnDate}. Confira seu email para mais detalhes.`
      );

      this.validator.reset();
      await this.loadAvailableBooks();

    } catch (error) {
      console.error('Error borrowing book:', error);
      this.showErrorMessage(error.message || 'Erro ao alugar o livro. Tente novamente.');
    } finally {
      button.disabled = false;
      button.innerHTML = 'Alugar Livro';
    }
  }

  showSuccessMessage(message) {
    const container = document.getElementById('successMessage');
    container.textContent = message;
    container.style.display = 'block';

    setTimeout(() => {
      container.style.display = 'none';
    }, 6000);
  }

  showErrorMessage(message) {
    const container = document.getElementById('errorMessage');
    container.textContent = message;
    container.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BorrowPage();
});

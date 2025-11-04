// Local: src/js/pages/borrow.js - Métodos atualizados para Apps Script

import { Layout } from '../layout.js';
import { FormValidator } from '../form-validator.js';
import { api } from '../api.js';
// ATENÇÃO: formatDate pode não ser mais necessário, mas vamos mantê-lo importado por segurança.
import { formatDate } from '../utils.js'; 

class BorrowPage {
  constructor() {
    this.books = [];
    this.validator = null;
    this.init();
  }
  // ... (init, setupFormSubmit permanecem)

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
    // ATUALIZADO: Filtrar pela coluna Status = 'Disponível' do Sheets
    const availableBooks = this.books.filter(book => {
      return book.Status === 'Disponível';
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

    // ATUALIZADO: Usar Titulo, Autor, ID do Sheets
    availableBooks.forEach(book => {
      const option = document.createElement('option');
      option.value = book.ID; 
      option.textContent = `${book.Titulo} - ${book.Autor}`;
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
      // ATUALIZADO: API do Apps Script só precisa de bookId e userName
      const result = await api.borrowBook( 
        values.bookSelect,
        values.borrowerName,
        // O terceiro parâmetro (dias) é ignorado pelo Apps Script
      );

      // ATUALIZADO: Usamos a mensagem que o Apps Script retornou no campo 'mensagem'
      // O Apps Script não retorna 'result.devolucao' diretamente para formatar
      this.showSuccessMessage(result.mensagem); 

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

  // ... (showSuccessMessage e showErrorMessage permanecem)
}

document.addEventListener('DOMContentLoaded', () => {
  new BorrowPage();
});
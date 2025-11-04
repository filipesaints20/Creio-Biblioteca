import { sanitizeHTML, isBookAvailable } from './utils.js';
import { STATUS, MESSAGES } from './config.js';

export const ui = {
  createBookCard(book) {
    const available = isBookAvailable(book);
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.bookId = book.id;

    const coverImage = book.capa
      ? `<img src="${sanitizeHTML(book.capa)}" alt="Capa de ${sanitizeHTML(book.titulo)}" loading="lazy" onerror="this.style.display='none'"/>`
      : '<div class="book-card__placeholder"></div>';

    const statusIcon = available ? '&#x1F4D7;' : '&#x1F4D5;';
    const statusText = available ? STATUS.AVAILABLE : STATUS.BORROWED;
    const statusClass = available ? 'status--available' : 'status--borrowed';

    card.innerHTML = `
      ${coverImage}
      <h3 class="book-card__title">${sanitizeHTML(book.titulo)}</h3>
      <p class="book-card__author"><strong>Autor:</strong> ${sanitizeHTML(book.autor)}</p>
      <p class="book-card__status ${statusClass}">
        <span class="status-icon">${statusIcon}</span>
        <strong>Status:</strong> ${statusText}
      </p>
    `;

    return card;
  },

  renderBooks(books, catalogElement) {
    if (!books || books.length === 0) {
      catalogElement.innerHTML = '<p class="empty-state">Nenhum livro encontrado no catálogo.</p>';
      return;
    }

    catalogElement.innerHTML = '';
    const fragment = document.createDocumentFragment();

    books.forEach(book => {
      const card = this.createBookCard(book);
      fragment.appendChild(card);
    });

    catalogElement.appendChild(fragment);
  },

  populateBookSelect(books, selectElement) {
    selectElement.innerHTML = '';

    const availableBooks = books.filter(isBookAvailable);

    if (availableBooks.length === 0) {
      const option = document.createElement('option');
      option.textContent = MESSAGES.NO_BOOKS_AVAILABLE;
      option.disabled = true;
      option.selected = true;
      selectElement.appendChild(option);
      selectElement.disabled = true;
      return;
    }

    selectElement.disabled = false;
    const fragment = document.createDocumentFragment();

    availableBooks.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = `${book.id} - ${book.titulo}`;
      fragment.appendChild(option);
    });

    selectElement.appendChild(fragment);
  },

  showLoading(element) {
    element.innerHTML = `
      <div class="loading">
        <div class="loading__spinner"></div>
        <p>${MESSAGES.LOADING}</p>
      </div>
    `;
  },

  showError(element, message) {
    element.innerHTML = `
      <div class="error-state">
        <p class="error-state__message">${sanitizeHTML(message)}</p>
        <button class="btn-retry" onclick="location.reload()">Tentar novamente</button>
      </div>
    `;
  }
};

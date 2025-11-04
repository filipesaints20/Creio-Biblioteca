import { CONFIG } from './config.js';

export function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(CONFIG.LOCALE);
}

export function isBookAvailable(book) {
  return String(book.disponivel).toLowerCase() === 'true';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function showNotification(element, message, type = 'success') {
  element.textContent = message;
  element.className = `notification notification--${type}`;
  element.style.display = 'block';

  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

import { CONFIG } from './config.js';

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

export const api = {
  async fetchBooks() {
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new APIError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  async borrowBook(bookId, userName, days) {
    if (!bookId || !userName || !days) {
      throw new Error('Missing required parameters');
    }

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'borrow',
          id: bookId,
          nome: userName,
          dias: parseInt(days, 10)
        })
      });

      if (!response.ok) {
        throw new APIError(`HTTP error! status: ${response.status}`, response.status);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }

      return result;
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  }
};

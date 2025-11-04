import { Layout } from '../layout.js';
import { FormValidator } from '../form-validator.js';

class ContactPage {
  constructor() {
    this.validator = null;
    this.init();
  }

  init() {
    Layout.initializeDOM('#app', 'contact');
    this.validator = new FormValidator(document.getElementById('contactForm'));
    this.setupFormSubmit();
  }

  setupFormSubmit() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!this.validator.validateForm()) {
        this.showMessage('Por favor, corrija os erros no formulário.', 'error');
        return;
      }

      await this.submitContact();
    });
  }

  async submitContact() {
    const form = document.getElementById('contactForm');
    const button = form.querySelector('button[type="submit"]');
    const values = this.validator.getValues();

    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Enviando...';

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.showMessage(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'success'
      );

      this.validator.reset();

    } catch (error) {
      console.error('Error submitting contact form:', error);
      this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = 'Enviar Mensagem';
    }
  }

  showMessage(message, type) {
    const container = document.getElementById('formMessage');
    container.textContent = message;
    container.className = `alert alert-${type}`;
    container.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ContactPage();
});

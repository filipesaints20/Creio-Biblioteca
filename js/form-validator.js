export class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.errors = new Map();
    this.setupValidation();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (this.errors.has(input.name)) {
          this.validateField(input);
        }
      });
    });

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateField(field) {
    const rules = this.getValidationRules(field);
    const errors = [];

    for (const [rule, options] of Object.entries(rules)) {
      const validator = this.validators[rule];
      if (validator && !validator(field.value, options)) {
        errors.push(options.message);
      }
    }

    if (errors.length > 0) {
      this.errors.set(field.name, errors);
      this.showFieldError(field, errors);
    } else {
      this.errors.delete(field.name);
      this.clearFieldError(field);
    }

    return errors.length === 0;
  }

  getValidationRules(field) {
    const rules = {};

    if (field.hasAttribute('required')) {
      rules.required = { message: `${field.dataset.label || field.name} é obrigatório` };
    }

    if (field.type === 'email') {
      rules.email = { message: 'Email inválido' };
    }

    if (field.type === 'number') {
      const min = field.min;
      const max = field.max;
      if (min) rules.min = { min: parseInt(min), message: `Mínimo é ${min}` };
      if (max) rules.max = { max: parseInt(max), message: `Máximo é ${max}` };
    }

    if (field.dataset.pattern) {
      rules.pattern = { pattern: new RegExp(field.dataset.pattern), message: field.dataset.patternMessage || 'Formato inválido' };
    }

    if (field.minLength) {
      rules.minLength = { minLength: field.minLength, message: `Mínimo ${field.minLength} caracteres` };
    }

    return rules;
  }

  validators = {
    required: (value) => value.trim().length > 0,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    min: (value, { min }) => parseInt(value) >= min,
    max: (value, { max }) => parseInt(value) <= max,
    pattern: (value, { pattern }) => pattern.test(value),
    minLength: (value, { minLength }) => value.length >= minLength
  };

  showFieldError(field, messages) {
    field.classList.add('input--error');
    let errorContainer = field.parentElement.querySelector('.field-error');

    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'field-error';
      field.parentElement.insertAdjacentElement('afterend', errorContainer);
    }

    errorContainer.innerHTML = messages.map(msg => `<span class="field-error__item">${msg}</span>`).join('');
    errorContainer.style.display = 'block';
  }

  clearFieldError(field) {
    field.classList.remove('input--error');
    const errorContainer = field.parentElement.querySelector('.field-error');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  getValues() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  reset() {
    this.form.reset();
    this.errors.clear();
    this.form.querySelectorAll('.field-error').forEach(el => {
      el.style.display = 'none';
    });
    this.form.querySelectorAll('input, select, textarea').forEach(el => {
      el.classList.remove('input--error');
    });
  }
}

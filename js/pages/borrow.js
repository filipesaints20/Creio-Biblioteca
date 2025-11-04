// Local: src/js/pages/borrow.js

import { borrowBook } from '../api.js'; 
import { showNotification } from '../utils.js'; // Assumindo que showNotification está em utils.js
// import { validateForm } from '../form-validator.js'; // Use seu validador aqui

const borrowForm = document.getElementById('borrow-form');

if (borrowForm) {
    borrowForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // 1. Obtenha os dados (ID do livro e nome do usuário)
        const livroId = document.getElementById('book-id').value; // O campo deve estar presente e com o ID
        const nomePessoa = document.getElementById('borrower-name').value;
        
        // 2. Validação (use seu código de validação)
        // if (!validateForm(borrowForm)) return; 

        const dataToSend = {
            livroID: livroId,
            nome: nomePessoa,
        };

        // 3. Envia para o Apps Script
        const resultado = await borrowBook(dataToSend);

        // 4. Feedback ao usuário
        if (resultado.status === 'sucesso') {
            showNotification(resultado.mensagem, 'success');
            borrowForm.reset();
        } else {
            showNotification(resultado.mensagem, 'error');
        }
    });
}

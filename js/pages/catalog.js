// Local: src/js/pages/catalog.js

// Importa a função de API e a função de notificação
import { getCatalog, borrowBook } from '../api.js'; 
import { showNotification } from '../utils.js'; // Assumindo que showNotification está em utils.js

async function renderCatalog() {
    const resultado = await getCatalog(); 

    if (resultado.status === 'sucesso') {
        const livros = resultado.dados;
        const listaLivrosElement = document.getElementById('lista-livros');
        listaLivrosElement.innerHTML = ''; 
        
        livros.forEach(livro => {
            const card = document.createElement('div');
            card.className = `livro-card status-${livro.Status.toLowerCase()}`;
            card.innerHTML = `
                <h2>${livro.Titulo}</h2>
                <p>Autor: ${livro.Autor}</p>
                <p>Status: <strong>${livro.Status}</strong></p>
                <button 
                    data-id="${livro.ID}" 
                    class="btn-alugar" 
                    ${livro.Status === 'Alugado' ? 'disabled' : ''}
                >
                    ${livro.Status === 'Alugado' ? 'Indisponível' : 'Alugar'}
                </button>
            `;
            listaLivrosElement.appendChild(card);
        });

        // Adiciona ouvintes de evento nos novos botões
        document.querySelectorAll('.btn-alugar').forEach(button => {
            button.addEventListener('click', handleAlugarClick);
        });

    } else {
        console.error("Erro ao carregar catálogo:", resultado.mensagem);
        // Exibe erro na interface, se a função estiver disponível
        // showNotification(resultado.mensagem, 'error'); 
    }
}

// Lógica de manipulação do clique no botão "Alugar" (será redirecionado ou modal)
function handleAlugarClick(event) {
    const livroId = event.currentTarget.dataset.id;
    // IDEAL: Redirecionar para a página borrow.html com o livroId na URL, ou abrir um modal.
    // Ex: window.location.href = `/pages/borrow.html?id=${livroId}`;
    console.log(`Livro ID ${livroId} pronto para ser alugado.`);
}

document.addEventListener('DOMContentLoaded', renderCatalog);

// Local: src/js/api.js

// -----------------------------------------------------------
// 🚨 SUA URL DO APPS SCRIPT FOI INSERIDA AQUI!
// -----------------------------------------------------------
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvGfcaaVMlnWfeC50CM11tlfYPaX2QiFQRGkxRWZddPTCf7B-YKhONwOzpX2Tv4l-8RA/exec"; 

class APIError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

// Função utilitária genérica para Apps Script
async function callAppsScript(action, data = null, method = 'GET') {
    let url = APPS_SCRIPT_URL;
    let options = { method: method };

    if (method === 'GET') {
        url += `?action=${action}`;
    } else if (method === 'POST') {
        options.body = JSON.stringify({ action: action, ...data });
        options.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new APIError(`Erro de rede: ${response.status}`, response.status);
        }

        const result = await response.json();
        
        if (result.status !== 'sucesso') {
             // Lança a mensagem de erro que vem do Apps Script
             throw new APIError(result.mensagem || 'Erro desconhecido da API.', 500);
        }
        
        return result;

    } catch (error) {
        console.error("Erro na comunicação com o Apps Script:", error);
        throw error; // Lança o erro para ser pego nos arquivos de página
    }
}


export const api = {
  // Busca todos os livros
  async fetchBooks() {
    const result = await callAppsScript('getLivros', null, 'GET');
    // Retorna a array de dados
    return result.dados; 
  },

  // Registra um empréstimo
  async borrowBook(bookId, userName, days) {
    // Ação: 'alugar'. O Apps Script só precisa de livroID e nome.
    // O retorno será { status: 'sucesso', mensagem: 'Livro alugado...' }
    return await callAppsScript('alugar', { livroID: bookId, nome: userName }, 'POST');
  },
  
  // Busca lista de categorias
  async getCategories() {
    const result = await callAppsScript('getCategorias', null, 'GET');
    // Retorna a array de dados (espera-se que sejam as categorias)
    return result.dados; 
  },
  
  // *DICA: Se você tiver formulário de Contato, pode ser integrado aqui:*
  /*
  async submitContact(data) {
    // Exemplo de como enviar dados de contato para o Apps Script
    return await callAppsScript('contato', data, 'POST');
  }
  */
};
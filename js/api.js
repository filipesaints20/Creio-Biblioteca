// Local: src/js/api.js

// SUBSTITUA ESTA STRING PELA URL COMPLETA DO SEU APP DA WEB APÓS A PUBLICAÇÃO.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYF0K3l6GYNIO21m9wH-sozMXFjEr0iWoq2FenJkRv4mvkr8jvBM9Gy6v04oMIF_OUWA/exec;" 


/**
 * Função genérica para interagir com a API do Google Apps Script.
 * @param {string} action - A ação desejada (ex: 'alugar', 'devolver', 'getLivros').
 * @param {object} [data=null] - Dados a serem enviados no corpo (POST).
 * @param {string} [method='GET'] - Método HTTP (GET ou POST).
 */
export async function callAppsScript(action, data = null, method = 'GET') {
    let url = APPS_SCRIPT_URL;
    let options = { method: method };

    if (method === 'GET') {
        url += `?action=${action}`;
    } else if (method === 'POST') {
        options.body = JSON.stringify({ action: action, ...data });
        options.headers = {
            'Content-Type': 'application/json'
        };
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        return await response.json();

    } catch (error) {
        console.error("Erro na comunicação com o Apps Script:", error);
        return { status: 'erro', mensagem: 'Falha na conexão com o servidor da biblioteca.' };
    }
}

// -----------------------------------------------------------
// Funções de Ação específicas para facilitar o uso no frontend
// -----------------------------------------------------------

export function getCatalog() {
    return callAppsScript('getLivros', null, 'GET');
}

export function borrowBook(data) {
    // data deve conter {livroID, nome}
    return callAppsScript('alugar', data, 'POST');
}

export function returnBook(data) {
    // data deve conter {livroID}
    return callAppsScript('devolver', data, 'POST');
}
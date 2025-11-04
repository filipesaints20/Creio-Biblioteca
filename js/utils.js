// Local: src/js/utils.js

// -----------------------------------------------------------
// 1. Funções de Notificação (Essenciais para dar feedback da API)
// -----------------------------------------------------------

/**
 * Exibe uma notificação flutuante para o usuário.
 * @param {string} message - A mensagem a ser exibida.
 * @param {('success'|'error'|'info')} type - O tipo de notificação (para styling).
 */
export function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    
    // Se o container não existir, crie-o no corpo do documento (body)
    if (!notificationContainer) {
        const newContainer = document.createElement('div');
        newContainer.id = 'notification-container';
        newContainer.style.position = 'fixed';
        newContainer.style.top = '20px';
        newContainer.style.right = '20px';
        newContainer.style.zIndex = '1000';
        document.body.appendChild(newContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Adicione estilos básicos de notificação para melhor visualização (Requer CSS para um visual completo)
    notification.style.padding = '10px 20px';
    notification.style.margin = '5px 0';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.backgroundColor = 
        type === 'success' ? '#4CAF50' : 
        type === 'error' ? '#F44336' : '#2196F3'; 

    notification.textContent = message;

    document.getElementById('notification-container').appendChild(notification);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// -----------------------------------------------------------
// 2. Funções de Debounce (Que você já mencionou)
// -----------------------------------------------------------

let timeout;

/**
 * Garante que uma função só seja executada após um certo tempo sem chamadas.
 * @param {function} func - A função a ser executada.
 * @param {number} wait - O tempo de espera em milissegundos.
 * @returns {function} - A função debounced.
 */
export function debounce(func, wait) {
    // Retorna uma função que receberá os argumentos originais
    return function(...args) {
        const context = this;
        // Limpa o timeout anterior, se houver
        clearTimeout(timeout);
        
        // Configura um novo timeout
        timeout = setTimeout(() => {
            // Executa a função após o tempo de espera
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Alias para debounce (mantendo a nomenclatura que você usa)
 */
export const executeFunctionDebounce = debounce;


// -----------------------------------------------------------
// 3. Outras Funções Utilizáveis
// -----------------------------------------------------------

// ... Mantenha quaisquer outras funções utilitárias que você já possui aqui.
// Ex: formatPrice, isEmailValid, etc.

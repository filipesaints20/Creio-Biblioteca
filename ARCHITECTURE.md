# Arquitetura - Biblioteca CREIO

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                      BIBLIOTECA CREIO                        │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  index.html ──────┐                                          │
│                   ├─→ Layout (header, nav, footer)           │
│  pages/*.html ────┤                                          │
│                   └─→ Conteúdo Específico da Página          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
            ↓ (Renderização via JavaScript)

┌───────────────────────────────────────────────────────────────┐
│                   CAMADA DE LÓGICA (JS)                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │  layout.js       │      │  Lógica das Páginas         │ │
│  │  - initializeDOM │      │  ┌─────────────────────────┐ │ │
│  │  - getHeader     │      │  │ catalog.js              │ │ │
│  │  - getNav        │      │  │ - filtrar livros        │ │ │
│  │  - getFooter     │      │  │ - renderizar cards      │ │ │
│  └──────────────────┘      │  └─────────────────────────┘ │ │
│                             │  ┌─────────────────────────┐ │ │
│  ┌──────────────────┐      │  │ borrow.js               │ │ │
│  │  FormValidator   │      │  │ - validar form          │ │ │
│  │  - validateField │      │  │ - processar empréstimo  │ │ │
│  │  - validateForm  │      │  └─────────────────────────┘ │ │
│  │  - showError     │      │  ┌─────────────────────────┐ │ │
│  └──────────────────┘      │  │ categories.js           │ │ │
│                             │  │ - carregar categorias   │ │ │
│  ┌──────────────────┐      │  └─────────────────────────┘ │ │
│  │  utils.js        │      │  ┌─────────────────────────┐ │ │
│  │  - sanitizeHTML  │      │  │ contact.js              │ │ │
│  │  - formatDate    │      │  │ - enviar mensagem       │ │ │
│  │  - debounce      │      │  └─────────────────────────┘ │ │
│  └──────────────────┘      └──────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
            ↓ (Chamadas HTTP)

┌───────────────────────────────────────────────────────────────┐
│                   CAMADA DE SERVIÇOS (API)                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │  api.js          │      │  supabase-client.js          │ │
│  │  - fetchBooks    │      │  - fetchBooks               │ │
│  │  - borrowBook    │      │  - borrowBook               │ │
│  └──────────────────┘      │  - getCategories            │ │
│                             │  - getBorrowHistory         │ │
│                             └──────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
            ↓ (API Calls)

┌───────────────────────────────────────────────────────────────┐
│                 CAMADA DE DADOS (Backend)                     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │ Google Apps Script  │    │ Supabase (Optional)          │ │
│  │ - GET /exec         │    │ - books table                │ │
│  │ - POST /exec        │    │ - book_loans table           │ │
│  │ - Retorna JSON      │    │ - categories table           │ │
│  └─────────────────────┘    └──────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### 1. Carregamento de Página
```
User acessa index.html
     ↓
DOM carrega
     ↓
JavaScript módulos importados
     ↓
Layout.initializeDOM() chamado
     ↓
Header, Nav, Footer injetados no DOM
     ↓
Lógica da página executada
     ↓
Dados carregados via API
     ↓
UI renderizada com dados
```

### 2. Aluguel de Livro
```
User preenche formulário
     ↓
FormValidator valida em tempo real
     ↓
User clica "Alugar"
     ↓
validateForm() verifica todos campos
     ↓
Se OK: api.borrowBook() chamado
     ↓
POST para Google Apps Script
     ↓
Resposta recebida
     ↓
UI atualizada (sucesso/erro)
     ↓
Catálogo recarregado
```

### 3. Filtro de Catálogo
```
User digita busca
     ↓
Input event listener dispara
     ↓
applyFilters() executado
     ↓
Livros filtrados em memória
     ↓
renderBooks() chamado
     ↓
UI atualizada com resultados
```

## Módulos e Responsabilidades

### layout.js
```javascript
class Layout {
  static getHeader()           // Renderiza header
  static getNavigation(page)   // Renderiza nav com active state
  static getFooter()           // Renderiza footer
  static initializeDOM(selector, page)  // Inicializa layout em qualquer página
  static setupMobileMenu()     // Configura menu responsivo
}
```

### form-validator.js
```javascript
class FormValidator {
  constructor(formElement)    // Inicializa validador
  setupValidation()          // Configura listeners
  validateField(field)       // Valida campo individual
  getValidationRules(field)  // Extrai regras do input
  validateForm()             // Valida formulário completo
  getValues()                // Retorna dados do formulário
  reset()                    // Limpa formulário e erros
}
```

### api.js
```javascript
const api = {
  fetchBooks()               // GET - Lista de livros
  borrowBook(id, nome, dias) // POST - Registrar empréstimo
}
```

### utils.js
```javascript
function sanitizeHTML(str)           // Remove scripts HTML
function formatDate(dateString)      // Formata data pt-BR
function isBookAvailable(book)       // Verifica disponibilidade
function showNotification(el, msg)   // Mostra notificação
function debounce(func, wait)        // Debounce function
```

### home.js
```javascript
// Inicializa página inicial
Layout.initializeDOM('#app', 'index')
```

### pages/*.js
```javascript
// Cada página segue padrão:
class PageName {
  constructor()              // Inicializa
  async init()              // Carrega dados
  async loadData()          // Busca do backend
  setupEventListeners()     // Configura interações
  render()                  // Renderiza UI
}
```

## Estrutura CSS

### components.css (Global)
- CSS variables (cores, espaçamentos)
- Header, Nav, Footer
- Componentes reutilizáveis (btn, card, alert, etc)
- Utilidades (grid, spacing, animations)
- Media queries responsivas

### home.css (Homepage)
- Hero section
- Feature cards
- Category preview cards

### pages.css (Páginas internas)
- Catalog filters
- Book cards
- Category cards
- Form styles

## Fluxo de Navegação

```
┌─────────────────────────────────────────┐
│         index.html (Início)             │
│  ┌─────────────────────────────────────┐│
│  │  Header com Menu Sticky             ││
│  ├─────────────────────────────────────┤│
│  │  Hero Section                       ││
│  │  Recursos                           ││
│  │  Categorias                         ││
│  │  CTA                                ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Footer                             ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
        ↓
        │──→ pages/catalog.html
        │    (Filtros, grade de livros)
        │
        │──→ pages/borrow.html
        │    (Formulário com validação)
        │
        │──→ pages/categories.html
        │    (Grid de categorias)
        │
        │──→ pages/about.html
        │    (Informações)
        │
        └──→ pages/contact.html
             (Formulário de contato)
```

## Padrões Utilizados

### Single Responsibility Principle
- Cada arquivo tem uma responsabilidade clara
- Funções são simples e focadas
- Módulos podem ser testados isoladamente

### Composition Pattern
- Layout é compartilhado via injeção de HTML
- Páginas são compostas de componentes
- Reuso máximo de código

### Event Delegation
- Listeners em elementos pai quando possível
- Reduz número de listeners
- Melhor performance

### Module Pattern
- Cada arquivo é um módulo ES6
- Exports claros
- Imports explícitos

## Performance Considerations

1. **Lazy Loading**
   - Imagens com `loading="lazy"`
   - Dados carregados sob demanda

2. **DOM Manipulation**
   - DocumentFragment para múltiplos elementos
   - Reutilização de elementos
   - Batch updates

3. **CSS**
   - CSS variables para reusabilidade
   - Media queries otimizadas
   - Sem animações em hover críticos

4. **JavaScript**
   - Sem loops pesados
   - Debounce em eventos frequentes
   - Validação eficiente

## Escalabilidade

### Adicionar Nova Página
1. Criar `pages/nova.html`
2. Criar `js/pages/nova.js`
3. Atualizar `js/layout.js`
4. Adicionar estilos em `css/pages.css`

### Trocar Backend
- Modularizar chamadas em `api.js` ou `supabase-client.js`
- Única mudança necessária
- Interface permanece igual

### Adicionar Validação Customizada
- Estender `FormValidator`
- Adicionar novo validador em `validators`
- Configurar no input via data attributes

## Segurança

1. **Sanitização**
   - Todos outputs HTML sanitizados
   - XSS prevention

2. **Validação**
   - Client-side validation
   - Server-side deve ser implementado

3. **Secrets**
   - Nenhum hardcoded no cliente
   - Use `.env` file
   - Nunca commitir chaves

## Testes Recomendados

1. **Unit Tests**
   - FormValidator.validateField()
   - utils.sanitizeHTML()
   - API methods

2. **Integration Tests**
   - Fluxo completo de aluguel
   - Filtros funcionando
   - Navegação entre páginas

3. **E2E Tests**
   - User journey completo
   - Mobile responsiveness
   - Performance

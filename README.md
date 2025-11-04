# Biblioteca CREIO - Sistema de Gestão de Livros

Uma aplicação web moderna para gerenciamento de biblioteca cristã com funcionalidades de catálogo, aluguel de livros, validação de formulários e design responsivo.

## Estrutura do Projeto

```
projeto/
├── index.html                 # Página inicial
├── pages/                     # Páginas da aplicação
│   ├── catalog.html          # Catálogo com filtros
│   ├── categories.html       # Categorias de livros
│   ├── borrow.html           # Formulário de aluguel
│   ├── about.html            # Sobre a biblioteca
│   └── contact.html          # Formulário de contato
├── js/                        # JavaScript modular
│   ├── layout.js             # Componentes de layout (header, nav, footer)
│   ├── form-validator.js     # Validação de formulários
│   ├── supabase-client.js    # Cliente Supabase
│   ├── api.js                # Chamadas à API
│   ├── utils.js              # Funções utilitárias
│   ├── home.js               # Lógica da página inicial
│   └── pages/                # Lógica das páginas
│       ├── catalog.js        # Página de catálogo
│       ├── borrow.js         # Página de aluguel
│       ├── categories.js     # Página de categorias
│       ├── about.js          # Página Sobre
│       └── contact.js        # Página de Contato
└── css/                       # Estilos
    ├── components.css        # Componentes e utilidades globais
    ├── home.css              # Estilos da página inicial
    └── pages.css             # Estilos das páginas internas
```

## Recursos Principais

### 1. Layout Compartilhado
- **Header**: Logo, título e menu responsivo
- **Navegação**: Menu sticky com links para todas as páginas
- **Footer**: Informações de contato e links rápidos
- Implementado em `js/layout.js` - Reutilizável em todas as páginas

### 2. Páginas

#### Página Inicial (`index.html`)
- Hero section com chamada para ação
- Destaques dos recursos
- Categorias principais
- Links para exploração do catálogo

#### Catálogo (`pages/catalog.html`)
- Grade de livros com cards informativos
- **Filtros**: Busca por texto, categoria e status
- Estados: carregamento, vazio, erro
- Cards com status de disponibilidade

#### Aluguel (`pages/borrow.html`)
- Formulário completo com validação em tempo real
- Campos: nome, email, telefone, livro, período
- Checkbox de aceitar termos
- Feedback visual de sucesso/erro

#### Categorias (`pages/categories.html`)
- Grid de categorias com ícones
- Contagem de livros por categoria
- Links para filtrar catálogo

#### Sobre (`pages/about.html`)
- Missão e visão da biblioteca
- Valores e termos de empréstimo
- Política de responsabilidade

#### Contato (`pages/contact.html`)
- Informações de localização e horário
- Formulário de contato com validação
- Links para redes sociais

### 3. Validação de Formulários
Classe `FormValidator` em `js/form-validator.js`:
- Validação em tempo real
- Regras: required, email, min/max, pattern, minLength
- Mensagens de erro customizáveis
- Suporte a data attributes para configuração

### 4. Design Responsivo
- Mobile-first approach
- Breakpoints em 768px
- Menu mobile com hamburger
- Grid fluido com auto-fit
- Sem dependências externas

### 5. Acessibilidade
- ARIA labels para elementos interativos
- Roles semânticas
- Focus states para navegação por teclado
- Suporte a prefers-reduced-motion

### 6. Integração com Supabase
Cliente em `js/supabase-client.js`:
- `fetchBooks()` - Buscar todos os livros
- `borrowBook()` - Registrar aluguel
- `getCategories()` - Buscar categorias
- `getBorrowHistory()` - Histórico de aluguel

## Guia de Uso

### Estrutura de Cores (CSS Variables)
```css
--roxo-creio: #5B2C82       /* Cor primária */
--roxo-claro: #7D4DBA      /* Cor secundária */
--verde: #2ecc71           /* Sucesso */
--vermelho: #e74c3c        /* Erro */
--azul: #3498db            /* Info */
```

### Componentes CSS Reutilizáveis

#### Botões
```html
<button class="btn btn-primary">Primário</button>
<button class="btn btn-secondary">Secundário</button>
<button class="btn btn-success">Sucesso</button>
<button class="btn btn-danger">Perigo</button>
```

#### Cards
```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Título</h3>
  </div>
  <div class="card__body">Conteúdo</div>
  <div class="card__footer">Rodapé</div>
</div>
```

#### Alerts
```html
<div class="alert alert-success">Sucesso!</div>
<div class="alert alert-error">Erro!</div>
<div class="alert alert-warning">Atenção!</div>
<div class="alert alert-info">Informação</div>
```

#### Grids
```html
<div class="grid grid--2col"><!-- 2 colunas --></div>
<div class="grid grid--3col"><!-- 3 colunas --></div>
<div class="grid grid--4col"><!-- 4 colunas --></div>
```

### Adicionar Nova Página

1. **Criar arquivo HTML** em `pages/novo-pagina.html`
2. **Criar arquivo CSS** em `css/` se necessário
3. **Criar arquivo JS** em `js/pages/novo-pagina.js`
4. **Importar Layout**:
```javascript
import { Layout } from '../layout.js';
document.addEventListener('DOMContentLoaded', () => {
  Layout.initializeDOM('#app', 'pagina-id');
});
```
5. **Atualizar navegação** em `js/layout.js`

### Adicionar Validação de Formulário

```javascript
import { FormValidator } from '../form-validator.js';

const validator = new FormValidator(document.getElementById('meuForm'));

document.getElementById('meuForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (validator.validateForm()) {
    const dados = validator.getValues();
    // Enviar dados
  }
});
```

### Usar API

```javascript
import { api } from '../api.js';

// Buscar livros
const livros = await api.fetchBooks();

// Alugar livro
const resultado = await api.borrowBook(livroId, nome, dias);
```

## API do Google Apps Script

A aplicação integra-se com um Google Apps Script que fornece:
- `GET /exec` - Retorna lista de livros
- `POST /exec` - Registra aluguel de livro

**Dados esperados do livro:**
```json
{
  "id": "LIV001",
  "titulo": "Nome do Livro",
  "autor": "Autor",
  "categoria": "Categoria",
  "capa": "URL-da-imagem",
  "disponivel": true/false
}
```

## Desenvolvimento

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor web simples para desenvolvimento local
- Acesso a Supabase (optional, para persistência)

### Iniciar Desenvolvimento
```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx http-server

# Com Live Server (VSCode extension)
# Abrir index.html com Live Server
```

### Estrutura de Commits
- Criar feature branches: `feature/nome-feature`
- Commits descritivos: `feat: adicionar validação de telefone`
- Pull requests com descrição detalhada

## Performance

- **Lazy loading**: Imagens com atributo `loading="lazy"`
- **DocumentFragment**: Para inserção de múltiplos elementos
- **Event delegation**: Para handlers de eventos
- **CSS variables**: Para reusabilidade de estilos

## Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Melhorias Futuras

- [ ] Integração com Supabase para persistência completa
- [ ] Sistema de autenticação de usuários
- [ ] Dashboard de admin
- [ ] Notificações por email
- [ ] Histórico de empréstimos do usuário
- [ ] Sistema de avaliação de livros
- [ ] Dark mode
- [ ] Multilíngue (PT-BR, EN)

## Suporte

Para dúvidas ou problemas, entre em contato:
- Email: contato@bibliotecacreio.org
- Local: Cidade Ademar - São Paulo/SP
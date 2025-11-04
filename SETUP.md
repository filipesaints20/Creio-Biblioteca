# Guia de Configuração - Biblioteca CREIO

## Requisitos Iniciais

- Node.js 16+ (opcional, apenas se usar npm)
- Python 3+ (opcional, para servidor local)
- Um navegador moderno

## Instalação Rápida

### Opção 1: Com Python (Recomendado)
```bash
cd projeto
python -m http.server 8000
```
Depois abra: `http://localhost:8000`

### Opção 2: Com Node.js
```bash
npx http-server
```
Depois abra: `http://localhost:8080`

### Opção 3: Com VSCode
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## Configuração do Supabase

Para usar persistência de dados:

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie suas chaves em `.env`:
   ```
   VITE_SUPABASE_URL=sua-url
   VITE_SUPABASE_SUPABASE_ANON_KEY=sua-chave
   ```

4. Crie as tabelas necessárias:

```sql
-- Tabela de Livros
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  cover TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Empréstimos
CREATE TABLE book_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id),
  borrower_name TEXT NOT NULL,
  borrow_date TIMESTAMP DEFAULT now(),
  return_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  book_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);
```

## Estrutura de Dados Esperada

### Formato de Livro (da API)
```json
{
  "id": "LIV001",
  "title": "Nome do Livro",
  "author": "Autor",
  "category": "Categoria",
  "cover": "https://example.com/image.jpg",
  "available": true
}
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Testando a Aplicação

1. **Página Inicial**: `http://localhost:8000`
2. **Catálogo**: `http://localhost:8000/pages/catalog.html`
3. **Alugar Livro**: `http://localhost:8000/pages/borrow.html`
4. **Categorias**: `http://localhost:8000/pages/categories.html`
5. **Sobre**: `http://localhost:8000/pages/about.html`
6. **Contato**: `http://localhost:8000/pages/contact.html`

## Troubleshooting

### Problema: "Module not found"
- Certifique-se de usar um servidor HTTP (não abrir arquivo diretamente)
- Verifique os paths nos imports

### Problema: Estilos não carregam
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Verifique se os arquivos CSS estão em `css/`

### Problema: API retorna erro
- Verifique a URL da API Google Apps Script
- Teste a URL em um navegador separado
- Verifique se a API está online

### Problema: Validação não funciona
- Abra o console (F12) e procure por erros
- Certifique-se de que o formulário tem os IDs corretos

## Desenvolvimento Local

### Estrutura Recomendada
```
projeto/
├── index.html              # Homepage
├── pages/                  # Páginas internas
├── js/                     # Lógica JavaScript
│   ├── pages/              # Scripts das páginas
│   └── layout.js           # Layout compartilhado
├── css/                    # Estilos
└── README.md               # Documentação
```

### Adicionando Nova Página

1. Crie `pages/nova-pagina.html`
2. Crie `js/pages/nova-pagina.js`
3. Atualize a navegação em `js/layout.js`

### Padrão de Commits
```
feat: adicionar novo recurso
fix: corrigir bug
docs: atualizar documentação
style: melhorar design
refactor: reorganizar código
```

## Performance

- Imagens usam lazy loading
- CSS é otimizado com variables
- JavaScript modular reduz bundle size
- Sem dependências externas

## Suporte

Encontrou um problema? Abra uma issue ou entre em contato:
- Email: contato@bibliotecacreio.org
- Documentação: veja README.md

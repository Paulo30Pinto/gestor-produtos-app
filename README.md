# Gestor de Produtos — Teste Técnico

Aplicação de gestão de produtos desenvolvida como teste técnico. Permite visualizar, criar, editar e remover produtos de uma loja, consumindo uma API externa.

## Stack utilizada

- [Next.js](https://nextjs.org) (App Router, React Server Components e Server Actions)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Funcionalidades

- Listagem de produtos com paginação
- Busca por nome/descrição
- Filtros por estado de estoque e faixa de preço
- Ordenação por coluna (nome, descrição, preço, estoque)
- Criação, edição e remoção de produtos
- Seleção múltipla e remoção em lote
- Interface responsiva (mobile-first)

## Como executar localmente

1. Clona o repositório:
```bash
   git clone <url-do-repositorio>
   cd gestor-produtos-teste
```

2. Instala as dependências:
```bash
   npm install
```

3. Cria um ficheiro `.env.local` na raiz do projeto com as seguintes variáveis:


4. Corre o servidor de desenvolvimento:
```bash
   npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) no browser.


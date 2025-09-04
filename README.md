# lizzy-moda-evangelica
E-commerce oficial da Lizzy Moda Evangélica, desenvolvido em Next.js com API Routes e MongoDB. Funcionalidades incluem catálogo de produtos, carrinho de compras e checkout simplificado.

# Lizzy Moda Evangélica 🛍️

E-commerce oficial da **Lizzy Moda Evangélica**, desenvolvido para a inauguração da loja.  
Feito com **Next.js**, **Tailwind CSS** e **MongoDB**.  

O objetivo é entregar uma plataforma funcional, moderna e simples de usar, com catálogo de produtos, carrinho e checkout básico.

## Tecnologias

- **Front-end:** Next.js, Tailwind CSS, Axios  
- **Back-end:** API Routes do Next.js, MongoDB (via Mongoose)  
- **Banco de dados:** MongoDB Atlas  
- **Autenticação (opcional):** JWT para admin  
- **Hospedagem:** Vercel (recomendado)

## Funcionalidades

- Catálogo de produtos com imagens, preços e descrição  
- Carrinho de compras com adicionar/remover itens  
- Checkout simplificado (simulação de pagamento)  
- Cadastro/Login de clientes (opcional)  
- Dashboard básico para administração de produtos (opcional)

## Como rodar o projeto localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/lizzy-moda-evangelica.git

Instale as dependências:
npm install

Configure seu .env com as variáveis do MongoDB e JWT:
MONGO_URI=seu_mongo_uri
JWT_SECRET=sua_chave_secreta


Rode o projeto:
npm run dev
Abra no navegador: http://localhost:3000
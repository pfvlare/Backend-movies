<h1 align="center">🎥 Backend - Milky Movies API</h1>


<p align="center"><i>API REST construída com Nest.js, MongoDB e amor por cinema 🍿</i></p>

---

## 📌 Sobre o Projeto

Este backend foi desenvolvido com **Nest.js** e **MongoDB** como parte do projeto **Milky Movies**, um catálogo de filmes integrado.

A API é responsável por fornecer os dados dos filmes, usuários, favoritos e informações gerais consumidas pelo app mobile desenvolvido em React Native.

---

## ⚙️ Tecnologias Utilizadas

- ⚡ [Nest.js](https://nestjs.com) — framework Node.js baseado em Express
- 🌐 [Express](https://expressjs.com/)
- 🛢️ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- 🔗 [Mongoose](https://mongoosejs.com/)
- 🔒 Autenticação via JWT
- 📩 Testes com [Postman](https://www.postman.com/)
- ✨ Escrito em TypeScript

---

📂 Estrutura do Projeto
	
 •	src/ — Código-fonte principal
 
  - app.module.ts — Módulo principal da aplicação
  
  - main.ts — Entrypoint do servidor
  
  - modules/ — Agrupamento de módulos
  
    - movies/ — Módulo de filmes
    
    - users/ — Módulo de usuários
    
    - favorites/ — Módulo de favoritos
    
  •	test/ — Testes unitários e de integração (e2e)
 
  •	package.json — Dependências e scripts do projeto
 
  •	.prettierrc — Configuração de formatação de código
 
  •	.eslintrc.mjs — Configuração de linting
 
  •	README.md — Documentação do projeto
---

## 🔌 Conexão com MongoDB

Utiliza conexão com o **MongoDB Atlas**, configurada no `app.module.ts` com `MongooseModule.forRoot()`.

Você pode adicionar sua conexão `.env` com:

---

## 🧪 Testes com Postman

Inclui uma collection Postman para:

- Criar usuários
- Fazer login
- Criar, buscar, editar e deletar filmes
- Gerenciar favoritos

> 💡 **Dica:** Use tokens JWT (se implementado) nos headers `Authorization`.

---

📫 Endpoints principais

🎞️ Filmes
	
 •	GET /movies — Lista todos os filmes
 
 •	GET /movies/:id — Detalhes de um filme específico
 
 •	POST /movies — Adiciona um novo filme
 
 •	PUT /movies/:id — Atualiza um filme existente
 
 •	DELETE /movies/:id — Remove um filme

👤 Usuários

 •	POST /users/signup — Cadastro de usuário
	
 •	POST /users/login — Login do usuário

---

## 🚀 Como rodar o projeto

### Clonando o repositório

```bash
git clone https://github.com/seu-usuario/backend-movies.git
cd backend-movies

# 🎬 Backend - Milky Movies API

> API REST construída com NestJS, PostgreSQL, Prisma e muito amor por cinema 🍿

---

## 📌 Sobre o Projeto

O **Milky Movies** é um aplicativo completo para cinéfilos!  
O app permite que usuários busquem filmes, visualizem trailers direto do YouTube, marquem favoritos e mantenham seu catálogo personalizado.

Este repositório contém o **backend** da aplicação — uma API desenvolvida com **NestJS** — que fornece todos os dados e funcionalidades que alimentam o **frontend mobile em React Native**.

A API gerencia autenticação, cadastro e login de usuários, controle de favoritos, integração com o YouTube para trailers, além do acesso seguro via tokens.

---

## 🧠 O que é o NestJS?

O **[NestJS](https://nestjs.com/)** é um framework Node.js moderno que facilita o desenvolvimento de aplicações escaláveis e organizadas.  
Baseado em TypeScript, ele oferece uma arquitetura modular e suporte nativo a:

- Injeção de dependências
- Controle de rotas com decorators
- Validação de dados
- Middlewares e interceptadores
- Segurança e autenticação
- Testes unitários e e2e

É ideal para construir **APIs robustas e reutilizáveis**, como no Milky Movies.

---

## 💾 O que é o Prisma ORM?

**[Prisma](https://www.prisma.io/)** é uma ferramenta ORM (Object-Relational Mapping) moderna que conecta a aplicação ao banco de dados.

No Milky Movies, ele:

- Define os modelos no arquivo `schema.prisma`
- Gera tipos automáticos com base no banco
- Executa migrações (criação e alteração de tabelas)
- Facilita a leitura e escrita de dados com alta performance

---

## 🛢️ O que é PostgreSQL?

**PostgreSQL** é um sistema de banco de dados relacional altamente confiável, usado em produção por grandes empresas.

Aqui ele é usado para armazenar:

- Usuários
- Filmes
- Favoritos
- Dados de autenticação

Sua combinação com o Prisma oferece velocidade, segurança e escalabilidade.

---

## 🔐 O que é JWT?

**JWT (JSON Web Token)** é um padrão para autenticação baseada em tokens.  
Quando um usuário faz login, ele recebe um token JWT, que deve ser enviado nas próximas requisições.

Esse token contém informações criptografadas que a API usa para verificar a identidade do usuário.  
Sem esse token, o usuário não consegue acessar rotas protegidas (como adicionar favoritos, por exemplo).

---

## 🚦 O que é SGAR?

**SGAR** (Sistema de Gerenciamento de Acesso por Rotas) é usado para controlar **permissões** dentro da API.  
Ele permite limitar quais rotas podem ser acessadas por diferentes perfis de usuários, garantindo segurança e organização.

---

## ⚙️ Tecnologias Utilizadas

- **NestJS** — Framework modular para construção da API REST
- **TypeScript** — Linguagem tipada e moderna para desenvolvimento seguro
- **PostgreSQL** — Banco de dados relacional em produção
- **Prisma ORM** — ORM moderno para banco de dados relacional
- **JWT** — Autenticação baseada em tokens
- **SGAR** — Controle de acesso por rotas e perfis
- **YouTube Integration** — Para trailers de filmes no app

---

## 🗂️ Funcionalidades da API

- 📝 Cadastro de usuários
- 🔐 Login e autenticação com JWT
- 🎬 Cadastro e listagem de filmes
- ⭐ Adição e remoção de favoritos
- 🔍 Busca de trailers via YouTube
- 👤 Perfis personalizados
- 🚦 Proteção de rotas com SGAR
- 🔗 API consumida pelo app em React Native

---

## 🔧 Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/nome_do_banco
JWT_SECRET=sua_chave_secreta_segura


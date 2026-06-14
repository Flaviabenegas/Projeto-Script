# 🐾 Apaixonados por Focinhos

![Status](https://img.shields.io/badge/Status-Em%20andamento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

> Projeto acadêmico desenvolvido por **Flávia Benegas**, aluna do curso de **Análise e Desenvolvimento de Sistemas** da **FATEC Arthur de Azevedo — Mogi Mirim**.

---

## 📋 Sobre o Projeto

Sistema web completo para a loja **Apaixonados por Focinhos**, voltada à venda de plaquinhas de identificação personalizadas para pets. A aplicação conta com vitrine pública, formulário de pedidos, painel administrativo, gerenciamento de usuários, depoimentos e integração com e-mail via Nodemailer e Mailchimp.

---

## 🛠️ Stack Tecnológica

| Camada          | Tecnologia               |
| --------------- | ------------------------ |
| Runtime         | Node.js ≥ 18             |
| Linguagem       | TypeScript 6             |
| Framework web   | Express 5                |
| Template engine | EJS 5                    |
| ORM / Banco     | Sequelize 6 + SQLite 3   |
| Autenticação    | express-session + bcrypt |
| Validação       | Zod 4                    |
| E-mail          | Nodemailer 8             |
| Segurança       | Helmet 8                 |
| Frontend        | Bootstrap 5 + Poppins    |
| Qualidade       | SonarCloud / SonarQube   |
| Execução dev    | tsx (watch mode)         |

---

## 📁 Estrutura de Pastas

```
projeto-script---typescript/
├── src/
│   ├── config/         # Configuração do banco de dados (Sequelize)
│   ├── controllers/    # Lógica de negócio (Auth, Pedido, User, Painel…)
│   ├── middlewares/    # checkAdmin, checkLogin, session, locals
│   ├── models/         # Modelos Sequelize (User, Pedido, Depoimento, PasswordReset)
│   ├── routes/         # Definição de todas as rotas
│   ├── utils/          # errorHandler, mailer
│   └── server.ts       # Ponto de entrada da aplicação
├── views/
│   ├── partials/       # Layouts reutilizáveis (head, header, footer, modal)
│   └── *.ejs           # Páginas da aplicação
├── public/
│   ├── script/         # JavaScript do lado cliente
│   ├── style/          # CSS personalizado
│   └── img/            # Imagens e assets estáticos
├── .env.example        # Modelo de variáveis de ambiente ← copie este arquivo!
├── tsconfig.json
└── package.json
```

---

## 🚀 Como Instalar e Rodar Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão **18 ou superior** → [nodejs.org](https://nodejs.org)
- **npm** (já vem junto com o Node.js)
- **Git** → [git-scm.com](https://git-scm.com)

---

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/Flaviabenegas/Projeto-Script.git
cd Projeto-Script
```

---

### Passo 2 — Instalar as dependências

```bash
npm install
```

---

### Passo 3 — Configurar o arquivo `.env` ⚠️

O projeto utiliza variáveis de ambiente para guardar configurações sensíveis (senhas, chaves de API, etc.). Essas configurações ficam em um arquivo chamado `.env` que **você precisa criar** a partir do modelo `.env.example` já incluído no projeto.

> **O projeto não vai funcionar sem este passo.**

#### No Windows (Prompt de Comando ou PowerShell):

```powershell
copy .env.example .env
```

#### No Linux / macOS (Terminal):

```bash
cp .env.example .env
```

Após copiar, abra o arquivo `.env` em qualquer editor de texto e preencha as variáveis com os seus próprios valores:

```env
# Porta em que o servidor vai escutar (padrão: 3000)
PORT=3000

# Chave secreta para assinar as sessões — use uma string longa e aleatória
SESSION_SECRET='coloque-aqui-uma-chave-secreta-longa'

# E-mail(s) com acesso administrativo (separados por vírgula)
ADMIN_USERS=teste@teste

# Senha do usuário admin criado pelo seed
ADMIN_PASSWORD=teste

# Configurações SMTP para envio de e-mails (reset de senha, etc.)
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seuemail@dominio.com
SMTP_PASS=suasenhasmtp

# URL base da aplicação (usada nos links enviados por e-mail)
APP_URL=http://localhost:3000

# Mailchimp — somente se for usar a funcionalidade de newsletter (opcional)
DATACENTER=us21
LIST_ID=seu_list_id
SUA_API_KEY=sua_api_key_mailchimp
```

> **⚠️ Importante:** nunca envie o arquivo `.env` para o repositório. Ele já está no `.gitignore` justamente por conter dados sensíveis.

---

### Passo 4 — Popular o banco de dados ⚠️

Este passo é **obrigatório** na primeira vez. Ele cria o usuário administrador definido no `.env` e inicializa o banco de dados:

```bash
npm run seed
```

> **Execute este comando apenas uma vez.** Rodá-lo novamente pode duplicar dados no banco.

---

### Passo 5 — Rodar a aplicação

#### Modo desenvolvimento (recomendado para uso local)

O servidor reinicia automaticamente sempre que você salvar um arquivo:

```bash
npm run dev
```

Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Build para Produção

Caso queira compilar e rodar o projeto em modo produção:

```bash
# 1. Compilar o TypeScript
npm run build

# 2. Iniciar o servidor a partir do build
npm start
```

---

## 📦 Scripts Disponíveis

| Comando          | Descrição                                                            |
| ---------------- | -------------------------------------------------------------------- |
| `npm run dev`    | Inicia em modo desenvolvimento com hot-reload (tsx watch)            |
| `npm run build`  | Compila o TypeScript para a pasta `dist/`                            |
| `npm start`      | Executa o servidor a partir do build compilado                       |
| `npm run seed`   | **Cria o usuário admin no banco — obrigatório na primeira execução** |
| `npm run format` | Formata o código com Prettier                                        |

---

## 🗺️ Rotas Principais

| Método | Rota                   | Descrição                               |
| ------ | ---------------------- | --------------------------------------- |
| `GET`  | `/`                    | Página inicial                          |
| `GET`  | `/comprar`             | Página de compra / formulário de pedido |
| `GET`  | `/depoimentos`         | Página de depoimentos                   |
| `GET`  | `/painel`              | Painel administrativo (requer login)    |
| `POST` | `/api/login/`          | Autenticação                            |
| `GET`  | `/api/logout`          | Encerrar sessão                         |
| `POST` | `/api/pedidos`         | Criar novo pedido                       |
| `GET`  | `/api/pedidos`         | Listar pedidos (admin)                  |
| `POST` | `/api/criar`           | Criar novo usuário                      |
| `POST` | `/api/solicitar-reset` | Solicitar reset de senha por e-mail     |
|        |
| `POST` | `/api/subscribe`       | Inscrição na newsletter (Mailchimp)     |
| `POST` | `/api/depoimentos`     | Criar depoimento                        |
| `GET`  | `/api/admin/usuarios`  | Listar usuários (somente admin)         |

---

## 🔒 Variáveis de Ambiente — Referência Completa

| Variável         | Obrigatória     | Descrição                                              |
| ---------------- | --------------- | ------------------------------------------------------ |
| `PORT`           | Não             | Porta do servidor (padrão: `3000`)                     |
| `SESSION_SECRET` | **Sim**         | Segredo da sessão HTTP (use valor longo e aleatório)   |
| `ADMIN_USERS`    | Não             | E-mails separados por vírgula com acesso admin via env |
| `ADMIN_PASSWORD` | Não             | Senha padrão usada no script de seed                   |
| `SMTP_HOST`      | Para e-mails    | Servidor SMTP                                          |
| `SMTP_PORT`      | Para e-mails    | Porta SMTP (geralmente `587` ou `465`)                 |
| `SMTP_USER`      | Para e-mails    | Usuário SMTP                                           |
| `SMTP_PASS`      | Para e-mails    | Senha SMTP                                             |
| `APP_URL`        | Para e-mails    | URL base (ex: `http://localhost:3000`)                 |
| `DATACENTER`     | Para newsletter | Datacenter do Mailchimp (ex: `us21`)                   |
| `LIST_ID`        | Para newsletter | ID da lista no Mailchimp                               |
| `SUA_API_KEY`    | Para newsletter | Chave de API do Mailchimp                              |

---

## 👩‍💻 Autora

**Flávia Benegas**
Aluna do curso de **Análise e Desenvolvimento de Sistemas**
**FATEC Arthur de Azevedo — Mogi Mirim, SP**

- GitHub: [@Flaviabenegas](https://github.com/Flaviabenegas)
- LinkedIn: [Flavia Benegas](https://www.linkedin.com/in/flaviabenegas/)

---

## 📄 Licença

Este projeto está licenciado sob a licença **ISC**. Consulte o arquivo `package.json` para mais detalhes.

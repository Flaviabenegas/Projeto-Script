# 🐾 Apaixonados por Focinhos — Projeto Script

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
├── .env.example        # Modelo de variáveis de ambiente
├── tsconfig.json
└── package.json
```

---

## ⚙️ Configuração do Ambiente

### 1. Pré-requisitos

- **Node.js** versão **18 ou superior** — [nodejs.org](https://nodejs.org)
- **npm** (incluso com o Node.js)

### 2. Clonar o repositório

```bash
git clone https://github.com/Flaviabenegas/Projeto-Script.git
cd Projeto-Script
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Criar o arquivo `.env`

Copie o arquivo de exemplo e preencha com os seus valores:

```bash
cp .env.example .env
```

Abra o `.env` criado e edite cada variável:

```env
# Porta em que o servidor vai escutar
PORT=3000

# Chave secreta para assinar as sessões (use uma string longa e aleatória)
SESSION_SECRET='chave-super-secreta-dos-focinhos'

# Usuário(s) com acesso administrativo via variável de ambiente (separados por vírgula)
ADMIN_USERS=seuemail@exemplo.com

# Senha padrão do admin definido acima (usado somente no seed)
ADMIN_PASSWORD=suasenha

# Configurações do servidor SMTP para envio de e-mails (reset de senha, etc.)
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seuemail@dominio.com
SMTP_PASS=suasenha

# URL base da aplicação (usada no link de reset de senha enviado por e-mail)
APP_URL=http://localhost:3000

# Configurações do Mailchimp (opcional — para inscrição na newsletter)
DATACENTER=us21
LIST_ID=seu_list_id
SUA_API_KEY=sua_api_key
```

> **Atenção:** o arquivo `.env` **nunca** deve ser commitado no repositório. Ele já está listado no `.gitignore`.

---

## 🚀 Rodando a Aplicação

### Modo desenvolvimento (com hot-reload)

Ideal para desenvolvimento local. O servidor reinicia automaticamente ao salvar arquivos.

```bash
npm run dev
```

O servidor estará disponível em: [http://localhost:3000](http://localhost:3000)

---

### Modo produção (build + start)

#### Passo 1 — Compilar o TypeScript

```bash
npm run build
```

Este comando executa o compilador TypeScript (`tsc`) e gera os arquivos JavaScript compilados na pasta `dist/`.

#### Passo 2 — Executar o build compilado

```bash
npm start
```

Este comando inicia o servidor a partir dos arquivos compilados em `dist/`, carregando as variáveis de ambiente do `.env` automaticamente via `--import dotenv/config`.

#### Em resumo (sequência completa para produção local):

```bash
cp .env.example .env   # 1. Configure as variáveis de ambiente
npm install            # 2. Instale as dependências
npm run build          # 3. Compile o TypeScript
npm start              # 4. Inicie o servidor
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

### Popular o banco com dados iniciais (opcional)

Para criar o usuário administrador padrão definido no `.env`:

```bash
npm run seed
```

---

## 📦 Scripts Disponíveis

| Comando         | Descrição                                                 |
| --------------- | --------------------------------------------------------- |
| `npm run dev`   | Inicia em modo desenvolvimento com hot-reload (tsx watch) |
| `npm run build` | Compila o TypeScript para a pasta `dist/`                 |
| `npm start`     | Executa o servidor a partir do build compilado            |

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
| `POST` | `/api/resetar-senha`   | Confirmar nova senha com token          |
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
- LinkedIN: [Flavia Benegas](https://www.linkedin.com/in/flaviabenegas/)

---

## 📄 Licença

Este projeto está licenciado sob a licença **ISC**. Consulte o arquivo `package.json` para mais detalhes.

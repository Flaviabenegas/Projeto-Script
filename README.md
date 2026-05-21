# 🐾 Apaixonados por Focinhos - Identificação Pet

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)

> Plataforma web para a **Apaixonados por Focinhos**, desenvolvida por Flávia Benegas (Fatec de Mogi Mirim). Trata-se de um sistema completo para uma loja especializada em produtos de identificação para cães e gatos.

## 🚀 Sobre o Projeto

Este projeto consiste numa aplicação *full-stack* desenvolvida para apresentar a importância da identificação pet, facilitar a navegação, e processar pedidos de forma segura e eficiente. 
A plataforma evoluiu de uma *landing page* estática para um sistema robusto com *backend* próprio, permitindo a gestão real de encomendas e de utilizadores através de um painel administrativo seguro.

### ✨ Funcionalidades Principais

- **Fluxo de Pedido Completo:** Gestão e processamento de encomendas no *backend*, com armazenamento seguro na base de dados.
- **Formulário de Pedido Dinâmico:** Cálculo do valor total em tempo real no *frontend* com base na quantidade de plaquinhas para cães e gatos.
- **Painel Administrativo Real:** Área restrita para gestão da loja, protegida por sistema de *login* com autenticação de credenciais encriptadas (*bcrypt*) e gestão de sessões.
- **Busca de CEP Automática:** Preenchimento automático da morada através da integração com a [BrasilAPI](https://brasilapi.com.br/).
- **Validação Rigorosa:** Algoritmo de validação de CPF no *frontend* e validação de dados no *backend* (utilizando *Zod*).
- **Templates Dinâmicos:** Renderização de páginas a partir do servidor utilizando a *template engine* EJS.

## 🛠️ Tecnologias Utilizadas

O projeto utiliza tecnologias modernas para garantir uma excelente performance, segurança e interatividade:

**Frontend (Views & Public):**
- HTML5, CSS3 (Variáveis e Custom Properties)
- JavaScript (ES6+)
- Bootstrap 5
- EJS (Embedded JavaScript templating)

**Backend & Base de Dados:**
- Node.js com Express
- TypeScript
- Sequelize (ORM) com SQLite
- Autenticação e Segurança: *bcrypt* e *express-session*
- Validação: *Zod*

## 📁 Estrutura de Ficheiros

```text
/
├── public/                  # Ficheiros estáticos (CSS, scripts JS, imagens)
├── src/                     # Código-fonte do Backend (TypeScript)
│   ├── config/              # Configurações da base de dados
│   ├── controllers/         # Controladores (Auth, Pedidos, Utilizadores, Painel)
│   ├── database/            # Ficheiro SQLite da base de dados
│   ├── middlewares/         # Middlewares (verificação de login, sessões)
│   ├── models/              # Modelos do Sequelize (User, Pedido)
│   ├── routes/              # Definição das rotas da API e da aplicação
│   └── server.ts            # Ponto de entrada do servidor
├── views/                   # Ficheiros EJS (Páginas dinâmicas e componentes/partials)
├── package.json             # Dependências e scripts do projeto
└── tsconfig.json            # Configuração do compilador TypeScript

## ⚙️ Como Executar o Projeto Localmente

**1. Clone o repositório:**
```bash
git clone [https://github.com/Flaviabenegas/Projeto-Script.git](https://github.com/Flaviabenegas/Projeto-Script.git)

**2. Instale as dependências:
Navegue até o diretório do projeto e execute:
```bash
npm install

**3.Inicie o servidor de desenvolvimento:
```bash
npm run dev

***4. Execute a aplicação:
Abra o seu navegador e acesse http://localhost:3000 (ou a porta configurada no seu ambiente).

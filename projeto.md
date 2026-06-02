# 🐾 Apaixonados por Focinhos - Identificação Pet
> Documentação técnica oficial de estrutura, tecnologias e guia de implantação do projeto.

---

## 👩‍🎓 Identificação da Autora
Esta aplicação foi desenvolvida como parte das atividades acadêmicas por:
* **Aluna:** Flávia Benegas
* **Instituição:** FATEC Mogi Mirim (Faculdade de Tecnologia de Mogi Mirim)
* **Curso:** Análise e Desenvolvimento de Sistemas (ou correspondente)

---

## 🚀 Sobre o Projeto
O **Apaixonados por Focinhos** é uma aplicação completa voltada para a comercialização e gerenciamento de plaquinhas de identificação personalizadas para cães e gatos.

A plataforma consiste em uma landing page de alta conversão, um formulário interativo de compras com cálculo dinâmico de valores em tempo real, validação de dados cadastrais (CPF, telefone, CEP com preenchimento automático) e uma **Área Administrativa restrita** para gestão de pedidos e usuários.

A arquitetura foi migrada para o modelo **MVC (Model-View-Controller)** moderno utilizando **Node.js**, **Express**, **TypeScript** e persistência em banco de dados local **SQLite** através do ORM **Sequelize**, garantindo máxima robustez e tipagem estática.

---

## 📂 Árvore de Arquivos do Projeto

Abaixo está a estrutura hierárquica organizada de pastas e arquivos da aplicação (excluindo os arquivos internos de dependências como `node_modules` e `.git`):

```text
Projeto Script/
├── .env                       # Variáveis de ambiente da aplicação (Porta do servidor)
├── .gitignore                 # Arquivos e pastas ignorados pelo controle de versão (Git)
├── netlify.toml               # Configuração de deploys/functions na plataforma Netlify
├── package-lock.json          # Registro exato de versões das dependências instaladas
├── package.json               # Configurações do projeto, scripts npm e dependências
├── tsconfig.json              # Configurações do compilador TypeScript
├── README.md                  # Documentação inicial da landing page (antiga)
├── projeto.md                 # [ESTE ARQUIVO] Guia técnico e arquitetura do projeto
│
├── img/                       # Banco de imagens e assets gráficos gerais do projeto
│   ├── agilidade.webp
│   ├── favicon.webp
│   ├── gato.webp
│   ├── logo.webp
│   ├── lua.webp
│   ├── medalha-cao.webp
│   ├── medalha-gato.webp
│   ├── mkt.webp
│   ├── ok.webp
│   ├── plaquinhas resistentes.webp
│   ├── principal.1.webp
│   ├── principal.webp
│   ├── seguranca.webp
│   ├── simba.webp
│   ├── simbav.webp
│   ├── sol.webp
│   ├── stress.webp
│   └── tristes.webp
│
├── public/                    # Arquivos estáticos servidos diretamente pelo Express
│   ├── script/                # Scripts JavaScript executados no lado do cliente (Browser)
│   │   ├── buscaCep.js        # Consulta automática de endereço via CEP (BrasilAPI)
│   │   ├── criarUsuario.js    # Script de suporte para criação e cadastro de usuários
│   │   ├── email.js           # Integração de newsletter via Netlify Functions (Mailchimp)
│   │   ├── index.js           # Funcionalidades e interações gerais da landing page
│   │   ├── painel.js          # Lógica interativa de filtros, buscas e exclusões no painel
│   │   └── validar.js         # Algoritmos de validação de CPF e cálculo em tempo real de pedidos
│   └── style/                 # Folhas de estilo (CSS)
│       ├── painel.css         # Estilização exclusiva do painel administrativo
│       └── style.css          # Estilo global da plataforma, paleta de cores e tipografia
│
├── src/                       # Código-fonte principal escrito em TypeScript (Back-end)
│   ├── config/                # Configurações de infraestrutura
│   │   └── database.ts        # Conexão e inicialização do Sequelize SQLite
│   ├── controllers/           # Controladores da arquitetura MVC (Regras de negócio)
│   │   ├── AuthController.ts     # Fluxo de login, logout e autenticação de usuários
│   │   ├── painelController.ts   # Renderização e lógica da interface administrativa
│   │   ├── PedidoController.ts   # Criação, listagem e persistência de pedidos
│   │   └── UserController.ts     # CRUD de usuários autorizados no painel
│   ├── database/              # Diretório de armazenamento físico do banco de dados
│   │   └── banco_de_dados.sqlite # Arquivo físico do banco de dados relacional SQLite
│   ├── middlewares/           # Interceptadores de requisições do Express
│   │   ├── checkLogin.ts      # Bloqueia acesso a rotas restritas se o usuário não logou
│   │   ├── handleLogin.ts     # Processa autenticação e valida credenciais criptografadas
│   │   ├── locals.ts          # Injeta dados de sessão diretamente no escopo do EJS
│   │   └── session.ts         # Configuração e inicialização das sessões de usuário
│   ├── models/                # Modelos de dados / Tabelas mapeadas pelo Sequelize
│   │   ├── Pedido.ts          # Definição e regras da tabela de pedidos
│   │   └── User.ts            # Definição da tabela de usuários (Credenciais e Perfis)
│   ├── routes/                # Definição dos endpoints da aplicação
│   │   ├── routes.ts          # Roteamento geral das páginas e APIs locais
│   │   └── users.ts           # Roteamento auxiliar ou legado de usuários
│   └── server.ts              # Arquivo de entrada (Bootstrap) do servidor Express
│
└── views/                     # Templates HTML dinâmicos renderizados com EJS
    ├── 404.ejs                # Página personalizada para erros de rota não encontrada
    ├── comprar.ejs            # Interface de finalização de compra (Formulário e Calculadora)
    ├── depoimentos.ejs        # Página com feedbacks e opiniões de clientes satisfeitos
    ├── erro.ejs               # Página genérica para erros internos do servidor (Erro 500)
    ├── index.ejs              # Landing page principal (Home da plataforma)
    ├── painel.ejs             # Dashboard administrativo seguro (Gestão de Pedidos)
    ├── users.ejs              # Tela de listagem e criação de usuários administradores
    └── partials/              # Componentes de interface reutilizáveis (Templates parciais)
        ├── footer.ejs         # Rodapé unificado do site
        ├── head.ejs           # Cabeçalho HTML (<head>), incluindo meta tags e links CSS/JS
        ├── header.ejs         # Menu de navegação superior responsivo
        └── modal.ejs          # Janelas modais (ex: modal de login da administração)
```

---

## 🛠️ Tecnologias Utilizadas

O projeto combina tecnologias modernas de front-end com um back-end estruturado e resiliente:

### ⚙️ Back-end & Servidor
* **Node.js** (Ambiente de execução Javascript Server-side).
* **Express.js** (Framework minimalista e flexível para criação do servidor web, tratamento de rotas e middlewares).
* **TypeScript** (Superconjunto tipado do JavaScript, que previne erros em tempo de desenvolvimento e adiciona autocompletação profissional).
* **TSX (TypeScript Execute)** (Ferramenta que executa diretamente arquivos `.ts` em ambiente de desenvolvimento com hot reload instantâneo).
* **Express Session** (Gerenciamento de estados e sessões ativas do usuário para segurança do painel administrativo).
* **Bcrypt** (Criptografia forte (Hashing) para garantir o armazenamento seguro das senhas dos usuários).
* **Zod** (Biblioteca de validação e parsing de dados, garantindo que as requisições atendam aos padrões estritos definidos).

### 🗄️ Banco de Dados (Persistência)
* **SQLite3** (Mecanismo de banco de dados SQL serverless, embutido diretamente em um arquivo físico `./src/database/banco_de_dados.sqlite`, eliminando a necessidade de servidores de banco externos).
* **Sequelize ORM** (Object-Relational Mapping para abstração e manipulação do banco de dados usando classes JavaScript/TypeScript).

### 🎨 Front-end & Interface
* **EJS (Embedded JavaScript Templating)** (Motor de visualização para gerar páginas HTML dinamicamente com base em dados do servidor).
* **Bootstrap 5** (Framework CSS para design de alta fidelidade, responsivo, móvel e acessível).
* **Javascript Vanilla (ES6+)** (Scripts dinâmicos no navegador para validação de campos, chamadas à API externa e cálculo interativo).
* **CSS3 Custom Properties** (Uso de variáveis CSS para controle estrito e centralizado da paleta de cores e temas).

---

## 🔌 Guia de Instalação e Execução Totalmente Offline

Como este projeto utiliza o banco de dados embutido **SQLite** e as dependências necessárias já se encontram no diretório `node_modules`, ele pode ser instalado, configurado e executado **sem qualquer conexão com a internet**.

Siga o passo a passo abaixo para rodá-lo localmente de forma offline:

### 1. Pré-requisitos Offline
Você precisará ter o **Node.js** instalado na sua máquina. Caso não tenha, faça o download prévio do instalador offline da versão **LTS** no site oficial:
* [Instalador Node.js LTS (Windows .msi)](https://nodejs.org/en) *(deve ser baixado previamente quando houver acesso à internet).*

### 2. Passo a Passo da Instalação Offline

#### **Cenário A: A pasta `node_modules` já está presente no computador**
Se você copiou a pasta inteira do projeto (incluindo o diretório `node_modules`):
1. **Abra o Terminal** (PowerShell ou Prompt de Comando) na pasta raiz do projeto (`Projeto Script/`).
2. **Inicie o servidor de desenvolvimento** executando:
   ```bash
   npm run dev
   ```
3. O terminal mostrará a seguinte mensagem:
   ```text
   📦 Banco de dados sincronizado.
   🚀 Servidor rodando na porta http://localhost:3000
   ```
4. Abra seu navegador de preferência e digite o endereço:
   [http://localhost:3000](http://localhost:3000)

#### **Cenário B: A pasta `node_modules` NÃO está presente, mas você tem o Cache do NPM**
Caso você tenha baixado o projeto sem a pasta `node_modules`, mas já tenha instalado as dependências desta aplicação em algum momento na mesma máquina (fazendo com que elas estejam salvas no cache global do seu NPM local):
1. **Abra o Terminal** na pasta raiz do projeto.
2. **Instale as dependências puxando exclusivamente do cache interno**:
   ```bash
   npm install --offline
   ```
3. O NPM montará a pasta `node_modules` puxando os arquivos guardados no disco local sem acessar a rede.
4. Rode a aplicação com:
   ```bash
   npm run dev
   ```

#### **Cenário C: Migrando dependências via mídia física (Pendrive / Rede Local)**
Se for necessário levar o projeto para um laboratório offline da faculdade (FATEC):
1. Copie a pasta **`Projeto Script` completa** (garantindo que `node_modules` e `.env` foram incluídos) para um pendrive ou HD Externo.
2. Cole a pasta no computador offline do laboratório.
3. Abra o terminal na pasta e execute diretamente:
   ```bash
   npm run dev
   ```
   *Dica: Como o banco de dados é um arquivo local (`banco_de_dados.sqlite`), todos os usuários e pedidos criados offline serão salvos diretamente nessa mesma pasta.*

---

## 🔒 Acesso ao Painel Administrativo
O projeto conta com controle de sessão. Para acessar o painel de administração em ambiente offline:
1. Acesse `http://localhost:3000/painel`.
2. Se não estiver logado, você será direcionado ou poderá usar o modal de login.
3. As credenciais e usuários criados são salvos diretamente no arquivo SQLite em `src/database/banco_de_dados.sqlite`.

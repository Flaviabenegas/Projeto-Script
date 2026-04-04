# 🐾 Apaixonados por Focinhos - Identificação Pet

![Status](https://img.shields.io/badge/Status-Em%20andamento-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

> Landing page responsiva para a **Apaixonados por Focinhos**, uma loja especializada em produtos de identificação, bandanas e mimos para pets e os seus tutores.

## 🚀 Sobre o Projeto

A página foi desenvolvida para apresentar a importância da identificação pet e facilitar a navegação e a conversão dos clientes através de secções informativas e de um fluxo de pedido simples.
O projeto ainda está em desenvolvimento, faltando o backend do pedido.

### ✨ Funcionalidades Principais

- **Formulário de Pedido Dinâmico:** Cálculo do valor total em tempo real com base na quantidade de plaquinhas para cães e gatos.
- **Busca de CEP Automática:** Preenchimento automático do endereço ao consumidor, utilizando a [BrasilAPI](https://brasilapi.com.br/).
- **Validação de CPF:** Algoritmo rigoroso de validação de CPF no front-end para garantir a autenticidade dos dados do cliente.
- **Newsletter Segura:** Inscrição de e-mail integrada com o Mailchimp, processada de forma segura através de **Netlify Functions** (Serverless).
- **Painel Administrativo:** Área restrita simulada, protegida por um modal de login e validação de credenciais.

## 🛠️ Tecnologias Utilizadas

O projeto utiliza tecnologias modernas para garantir performance, responsividade e interatividade:

* **Front-end:** HTML5, CSS3 (Variáveis e Custom Properties), JavaScript Vanilla (ES6+) e Bootstrap 5.
* **Back-end/Serverless:** Netlify Functions (Node.js).
* **Integrações (APIs):** BrasilAPI (para moradas) e Mailchimp API (para leads).
* **Design:** Fontes do Google Fonts (Poppins) e uma paleta de cores personalizada.

## 📁 Estrutura de Arquivos

```text
/
├── index.html               # Landingpage principal
├── painel.html              # Painel administrativo
├── netlify.toml             # Configurações de deploy do Netlify
├── style/
│   └── style.css            # Estilos globais e paleta de cores
├── script/
│   ├── buscaCep.js          # Lógica da chamada à API de CEP
│   ├── email.js             # Lógica de integração com Netlify Functions
│   ├── painel.js            # Controle de acesso ao painel
│   └── validar.js           # Validações de CPF e soma de valores
├── netlify/
│   └── functions/
│       └── subscribe.js     # Função Serverless para envio ao Mailchimp
└── img/                     # Imagens e logotipos

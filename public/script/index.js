'use strict';

const Sequelize = require('sequelize');
const path = require('node:path');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, '..', 'database.sqlite'),
	logging: false,
});

const Cliente = sequelize.define('Cliente', {
	nome: { type: Sequelize.STRING, allowNull: false },
	email: { type: Sequelize.STRING, allowNull: false, unique: true },
	telefone: { type: Sequelize.STRING },
	cpf: { type: Sequelize.STRING },
});

const Produto = sequelize.define('Produto', {
	nome: { type: Sequelize.STRING, allowNull: false },
	material: { type: Sequelize.STRING },
	preco: { type: Sequelize.FLOAT, allowNull: false },
});

const Endereco = sequelize.define('Endereco', {
	logradouro: { type: Sequelize.STRING },
	numero: { type: Sequelize.STRING },
	complemento: { type: Sequelize.STRING },
	bairro: { type: Sequelize.STRING },
	cidade: { type: Sequelize.STRING },
	estado: { type: Sequelize.STRING(2) },
	cep: { type: Sequelize.STRING(9) },
});

const Pedido = sequelize.define('Pedido', {
	nomePet: { type: Sequelize.STRING, allowNull: false },
	tipoPet: { type: Sequelize.STRING },
	tamanho: { type: Sequelize.STRING },
	textoGravado: { type: Sequelize.TEXT },
	status: {
		type: Sequelize.ENUM('pendente', 'confirmado', 'producao', 'enviado', 'entregue', 'cancelado'),
		defaultValue: 'pendente',
	},
	valorTotal: { type: Sequelize.FLOAT, allowNull: false },
	codigoRastreio: { type: Sequelize.STRING },
});

const HistoricoPedido = sequelize.define('HistoricoPedido', {
	status: { type: Sequelize.STRING, allowNull: false },
	descricao: { type: Sequelize.TEXT },
});

Cliente.hasMany(Pedido);
Pedido.belongsTo(Cliente);

Produto.hasMany(Pedido);
Pedido.belongsTo(Produto);

Endereco.hasOne(Pedido);
Pedido.belongsTo(Endereco);

Pedido.hasMany(HistoricoPedido, { as: 'historico', foreignKey: 'PedidoId' });
HistoricoPedido.belongsTo(Pedido);

sequelize
	.sync({ alter: true })
	.then(() => console.log('[DB] Sincronizado ✔'))
	.catch((err) => console.error('[DB] Erro ao sincronizar:', err));

module.exports = { sequelize, Cliente, Produto, Endereco, Pedido, HistoricoPedido };

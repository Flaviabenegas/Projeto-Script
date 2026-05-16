import { Sequelize, DataTypes, Model } from 'sequelize';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './src/database/banco_de_dados.sqlite',
	logging: false,
});

export class Pedido extends Model {}

Pedido.init(
	{
		nome: { type: DataTypes.STRING, allowNull: false },
		cpf: { type: DataTypes.STRING, allowNull: false },
		telefone: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		cep: { type: DataTypes.STRING, allowNull: false },
		logradouro: { type: DataTypes.STRING, allowNull: false },
		numero: { type: DataTypes.STRING, allowNull: false },
		complemento: { type: DataTypes.STRING, allowNull: true },
		bairro: { type: DataTypes.STRING, allowNull: false },
		cidade: { type: DataTypes.STRING, allowNull: false },
		uf: { type: DataTypes.STRING, allowNull: false },
		qtdCao: { type: DataTypes.INTEGER, allowNull: false },
		qtdGato: { type: DataTypes.INTEGER, allowNull: false },
		valorTotal: { type: DataTypes.STRING, allowNull: false },
		nomePets: { type: DataTypes.STRING, allowNull: false },
		telGravacao: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize,
		modelName: 'Pedido',
		tableName: 'pedidos',
	},
);

export default { sequelize, Pedido };

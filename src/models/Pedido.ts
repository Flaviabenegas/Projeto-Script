import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import fa from 'zod/v4/locales/fa.cjs';

export class Pedido extends Model {}

Pedido.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cpf: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		telefone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cep: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		logradouro: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		numero: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		complemento: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		bairro: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		cidade: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		uf: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		qtdCao: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		qtdGato: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		valorFrete: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		valorTotal: {
			type: DataTypes.NUMBER,
			allowNull: false,
		},
		nomePets: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		telGravacao: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Pedido',
		tableName: 'pedidos',
	},
);

export default Pedido;

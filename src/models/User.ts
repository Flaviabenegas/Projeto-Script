import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

export class User extends Model {
	public id!: number;
	public nome!: string; // Adicionado aqui
	public usuario!: string;
	public senha!: string;
	public isAdmin!: boolean;
}

User.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		nome: { type: DataTypes.STRING, allowNull: true }, // Adicionado no banco
		usuario: { type: DataTypes.STRING, allowNull: false },
		senha: { type: DataTypes.STRING, allowNull: false },
		isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		hooks: {
			beforeCreate: async (user: any) => {
				if (user.senha) user.senha = await bcrypt.hash(user.senha, 10);
			},
			beforeUpdate: async (user: any) => {
				if (user.changed('senha')) user.senha = await bcrypt.hash(user.senha, 10);
			},
		},
	},
);

export default User;

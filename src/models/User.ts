import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

export class User extends Model {
	public id!: number;
	public usuario!: string;
	public senha!: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		usuario: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		senha: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		hooks: {
			beforeCreate: async (user: any) => {
				if (user.senha) {
					user.senha = await bcrypt.hash(user.senha, 10);
				}
			},
			beforeUpdate: async (user: any) => {
				if (user.changed('senha')) {
					user.senha = await bcrypt.hash(user.senha, 10);
				}
			},
		},
	},
);

export default User;

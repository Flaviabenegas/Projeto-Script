import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class PasswordReset extends Model {
	public id!: number;
	public usuario!: string;
	public token!: string;
	public expiresAt!: Date;
	public usado!: boolean;
}

PasswordReset.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		usuario: { type: DataTypes.STRING, allowNull: false },
		token: { type: DataTypes.STRING, allowNull: false },
		expiresAt: { type: DataTypes.DATE, allowNull: false },
		usado: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		sequelize,
		modelName: 'PasswordReset',
		tableName: 'password_resets',
	},
);

export default PasswordReset;

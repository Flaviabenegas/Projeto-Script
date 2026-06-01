import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface DepoimentoAttributes {
	id: number;
	tutor: string;
	pet: string;
	imagem: string;
	alt: string;
	texto: string;
	ativo: boolean;
}

interface DepoimentoCreationAttributes extends Optional<DepoimentoAttributes, 'id' | 'ativo'> {}

class Depoimento
	extends Model<DepoimentoAttributes, DepoimentoCreationAttributes>
	implements DepoimentoAttributes
{
	public id!: number;
	public tutor!: string;
	public pet!: string;
	public imagem!: string;
	public alt!: string;
	public texto!: string;
	public ativo!: boolean;
}

Depoimento.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		tutor: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pet: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		imagem: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		alt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		texto: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ativo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		sequelize,
		tableName: 'depoimentos',
		timestamps: false,
	},
);

export { Depoimento };

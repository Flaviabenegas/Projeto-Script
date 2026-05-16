import { type Request, type Response } from 'express';
import { Pedido } from '../models/Pedido.js';

export const criarPedido = async (req: Request, res: Response): Promise<void> => {
	try {
		const {
			nome,
			cpf,
			telefone,
			'form-email': email,
			cep,
			logradouro,
			numero,
			complemento,
			bairro,
			cidade,
			uf,
			qtdCao,
			qtdGato,
			valorTotal,
			nomePets,
			telGravacao,
		} = req.body;

		const pedido = await Pedido.create({
			nome,
			cpf,
			telefone,
			'form-email': email,
			cep,
			logradouro,
			numero,
			complemento,
			bairro,
			cidade,
			uf,
			qtdCao,
			qtdGato,
			valorTotal,
			nomePets,
			telGravacao,
		});

		res.status(201).json(pedido);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

export default Pedido;

import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { Pedido } from '../models/Pedido.js';
import { handleZodError } from '../utils/errorHandler.js';

declare module 'express-session' {
	interface SessionData {
		usuario: string;
		adminId: number;
	}
}

const createPedidoSchema = z.object({
	nome: z.string().trim().min(1, 'O nome é obrigatório.'),
	cpf: z
		.string()
		.transform((val) => val.replace(/\D/g, ''))
		.refine((val) => val.length === 11, { message: 'O CPF tem de conter exatamente 11 números.' }),
	qtdCao: z.number().int().min(0, 'A quantidade deve ser 0 ou mais.').nonnegative(),
	qtdGato: z.number().int().min(0, 'A quantidade deve ser 0 ou mais.').nonnegative(),
	telefone: z
		.string()
		.min(10, 'O telefone deve conter pelo menos 10 dígitos.')
		.transform((val) => val.replace(/\D/g, '')),
	cep: z
		.string()
		.min(8, 'O CEP deve conter pelo menos 8 caracteres.')
		.transform((val) => val.replace(/\D/g, '')),
	logradouro: z.string().min(1, 'O logradouro é obrigatório.'),
	numero: z.string().min(1, 'O número é obrigatório.'),
	complemento: z.string().optional(),
	bairro: z.string().min(1, 'Bairro é obrigatório'),
	cidade: z.string().min(1, 'Cidade é obrigatória'),
	uf: z.string().length(2, 'A UF deve conter exatamente 2 caracteres'),
	email: z
		.email('O email é inválido.')
		.min(1, 'O email é obrigatório')
		.transform((val) => val.toLowerCase().trim()),
	valorTotal: z.string().min(1, 'O valor total é obrigatório'),
	nomePets: z.string().min(1, 'O nome dos pets é obrigatório'),
	telGravacao: z
		.string()
		.min(10, 'O telefone deve conter pelo menos 10 dígitos.')
		.transform((val) => val.replace(/\D/g, '')),
	valorFrete: z.number().min(0, 'O valor de frete é obrigatório').nonnegative(),
});

export const criarPedido = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const data = createPedidoSchema.parse(req.body);

		const pedido = await Pedido.create(data);

		res.status(201).json({
			sucesso: true,
			mensagem: 'Pedido salvo com sucesso!',
			pedido: pedido,
		});
	} catch (err: any) {
		if (handleZodError(err, res, 'gravação do pedido')) return;
		next(err);
	}
};

export const listarPedidos = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todosPedidos = await Pedido.findAll();
		res.status(200).json({
			sucesso: true,
			quantidade: todosPedidos.length,
			pedidos: todosPedidos,
		});
	} catch (error) {
		console.error('Erro ao buscar os pedidos:', error);
		next(error);
	}
};

export const pedidosUsuario = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	if (!req.session?.usuario) {
		res.status(401).json({ erro: 'Não autenticado' });
		return;
	}

	try {
		let pedidos;

		if (req.session.usuario === 'teste@teste') {
			pedidos = await Pedido.findAll();
		} else {
			pedidos = await Pedido.findAll({
				where: {
					email: req.session.usuario,
				},
			});
		}

		res.json({ pedidos });
	} catch (error) {
		next(error);
	}
};
export default Pedido;

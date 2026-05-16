import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { Pedido } from '../models/Pedido.js';

const createPedidoSchema = z.object({
	nome: z.string().min(1, 'O nome é obrigatório.'),
	cpf: z
		.string()
		.min(11, 'O CPF deve conter 11 caracteres.')
		.max(14, 'O CPF deve conter 14 caracteres.'),
	qtdCao: z
		.number()
		.int()
		.min(0, 'A quantidade de plaquinhas para cães deve ser 0 ou mais.')
		.nonnegative(),
	qtdGato: z
		.number()
		.int()
		.min(0, 'A quantidade de plaquinhas para gatos deve ser 0 ou mais.')
		.nonnegative(),
	telefone: z.string().min(10, 'O telefone deve conter pelo menos 10 dígitos.'),
	cep: z.string().min(8, 'O CEP deve conter pelo menos 8 caracteres.'),
	logradouro: z.string().min(1, 'O logradouro é obrigatório.'),
	numero: z.string().min(1, 'O número é obrigatório.'),
	complemento: z.string().optional(),
	bairro: z.string().min(1, 'Bairro é obrigatório'),
	cidade: z.string().min(1, 'Cidade é obrigatória'),
	uf: z.string().length(2, 'A UF deve conter exatamente 2 caracteres'),
	'form-email': z.email('O email é inválido.').min(1, 'O email é obrigatório'),
	valorTotal: z.string().min(1, 'O valor total é obrigatório'),
	nomePets: z.string().min(1, 'O nome dos pets é obrigatório'),
	telGravacao: z.string().min(10, 'O telefone para gravação deve conter pelo menos 10 dígitos'),
});

export const criarPedido = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const data = createPedidoSchema.parse(req.body);

		const pedido = await Pedido.create(data);

		res.status(201).json(pedido);
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			next(err);
			return;
		}

		next(err);
	}
};

export default Pedido;

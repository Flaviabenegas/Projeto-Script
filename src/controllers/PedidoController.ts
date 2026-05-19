import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { Pedido } from '../models/Pedido.js';

const createPedidoSchema = z.object({
	nome: z.string().trim().min(1, 'O nome é obrigatório.'),
	cpf: z
		.string()
		.transform((val) => val.replace(/\D/g, ''))
		.refine((val) => val.length === 11, { message: 'O CPF tem de conter exatamente 11 números.' }),
	qtdCao: z.number().int().min(0, 'A quantidade deve ser 0 ou mais.').nonnegative(),
	qtdGato: z.number().int().min(0, 'A quantidade deve ser 0 ou mais.').nonnegative(),
	telefone: z.string().min(10, 'O telefone deve conter pelo menos 10 dígitos.'),
	cep: z.string().min(8, 'O CEP deve conter pelo menos 8 caracteres.'),
	logradouro: z.string().min(1, 'O logradouro é obrigatório.'),
	numero: z.string().min(1, 'O número é obrigatório.'),
	complemento: z.string().optional(),
	bairro: z.string().min(1, 'Bairro é obrigatório'),
	cidade: z.string().min(1, 'Cidade é obrigatória'),
	uf: z.string().length(2, 'A UF deve conter exatamente 2 caracteres'),
	email: z.string().email('O email é inválido.').min(1, 'O email é obrigatório'),
	valorTotal: z.string().min(1, 'O valor total é obrigatório'),
	nomePets: z.string().min(1, 'O nome dos pets é obrigatório'),
	telGravacao: z.string().min(10, 'O telefone para gravação deve conter pelo menos 10 dígitos'),
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
		if (err instanceof z.ZodError) {
			console.log('❌ O Zod bloqueou a gravação. Motivo:', err);

			res.status(400).json({
				sucesso: false,
				mensagem: 'Erro de validação dos dados enviados.',
				erros: err,
			});
			return;
		}

		next(err);
	}
};

export default Pedido;

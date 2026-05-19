import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';

const createUserSchema = z.object({
	usuario: z.string().min(1, 'O nome é obrigatório.'),
	senha: z.string().min(6, 'usuário é obrigatorio com 6 digitos'),
});

export const criarUsuario = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const data = createUserSchema.parse(req.body);

		const pedido = await User.create(data);

		res.status(201).json({
			sucesso: true,
			mensagem: 'Pedido salvo com sucesso!',
			usuario: 'usuario',
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

export default User;

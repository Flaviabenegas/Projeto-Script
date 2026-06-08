import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { handleZodError } from '../utils/errorHandler.js';

const createUserSchema = z.object({
	usuario: z.string().min(1, 'O nome é obrigatório.'),
	senha: z.string().min(6, 'usuário é obrigatorio com 6 digitos'),
});

export const criarUsuarioView = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('users');
	} catch (error) {
		next(error);
	}
};

export const criarUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const data = createUserSchema.parse(req.body);

		const usuarioExistente = await User.findOne({ where: { usuario: data.usuario } });
		if (usuarioExistente) {
			res.status(409).json({ sucesso: false, mensagem: 'Usuário já cadastrado.' });
			return;
		}

		const novoUsuario = await User.create(data);

		res.status(201).json({
			sucesso: true,
			mensagem: 'Usuário criado com sucesso!',
			usuario: novoUsuario.usuario,
		});
	} catch (err: any) {
		if (handleZodError(err, res, 'gravação de usuário')) return;
		next(err);
	}
};

export const listarUsuarios = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todosUsuarios = await User.findAll({
			attributes: ['id', 'usuario'],
		});

		res.status(200).json({
			sucesso: true,
			quantidade: todosUsuarios.length,
			usuarios: todosUsuarios,
		});
	} catch (error) {
		console.error('Erro ao buscar os usuarios:', error);
		next(error);
	}
};

export default User;

import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { User } from '../models/User.js';
import { PasswordReset } from '../models/PasswordReset.js';
import { handleZodError } from '../utils/errorHandler.js';
import { sendResetEmail } from '../utils/mailer.js';

const createUserSchema = z.object({
	usuario: z.string().min(1, 'O nome é obrigatório.'),
	senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
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
	} catch (err: unknown) {
		if (err instanceof z.ZodError) {
			res.status(400).json({
				sucesso: false,
				mensagem: 'Dados inválidos.',
				erros: err.issues.map((e: z.ZodIssue) => ({ campo: e.path.join('.'), message: e.message })),
			});
			return;
		}
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

export const solicitarReset = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { usuario } = req.body as { usuario: string };

		const respostaPadrao = {
			sucesso: true,
			mensagem: 'Se o e-mail estiver cadastrado, você receberá as instruções em breve.',
		};

		if (!usuario) {
			res.status(400).json({ sucesso: false, mensagem: 'Informe o e-mail.' });
			return;
		}

		const user = await User.findOne({ where: { usuario } });

		if (!user) {
			res.json(respostaPadrao);
			return;
		}

		await PasswordReset.update({ usado: true }, { where: { usuario, usado: false } });

		const token = crypto.randomBytes(32).toString('hex');
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

		await PasswordReset.create({ usuario, token, expiresAt });

		await sendResetEmail(usuario, token);

		res.json(respostaPadrao);
	} catch (error) {
		console.error('Erro ao solicitar reset:', error);
		next(error);
	}
};

export const resetarSenha = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { token, novaSenha } = req.body as { token: string; novaSenha: string };

		if (!token || !novaSenha || novaSenha.length < 6) {
			res.status(400).json({
				sucesso: false,
				mensagem: 'Dados inválidos. A senha deve ter no mínimo 6 caracteres.',
			});
			return;
		}

		const registro = await PasswordReset.findOne({
			where: { token, usado: false },
		});

		if (!registro || registro.expiresAt < new Date()) {
			res.status(400).json({
				sucesso: false,
				mensagem: 'Link inválido ou expirado. Solicite um novo.',
			});
			return;
		}

		const user = await User.findOne({ where: { usuario: registro.usuario } });

		if (!user) {
			res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
			return;
		}

		user.senha = novaSenha;
		await user.save();

		registro.usado = true;
		await registro.save();

		res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso!' });
	} catch (error) {
		console.error('Erro ao resetar senha:', error);
		next(error);
	}
};

export default User;

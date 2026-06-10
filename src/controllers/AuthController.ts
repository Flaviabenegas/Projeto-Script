import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const handleLogin = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { usuario, senha } = req.body;

		if (!usuario || !senha) {
			res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
			return;
		}

		const user = await User.findOne({ where: { usuario } });

		if (!user) {
			res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
			return;
		}

		const senhaCorreta = await bcrypt.compare(senha, user.senha);

		if (!senhaCorreta) {
			res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
			return;
		}

		(req.session as any).adminId = user.id;
		(req.session as any).usuario = user.usuario;

		res.status(200).json({ sucesso: true, mensagem: 'Autenticado com sucesso!' });
	} catch (error) {
		console.error('Erro ao fazer login:', error);
		next(error);
	}
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
	try {
		req.session.destroy(() => {
			res.redirect('/');
		});
	} catch (error) {
		next(error);
	}
};

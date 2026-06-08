import { type NextFunction, type Request, type Response } from 'express';
import { User } from '../models/User.js';

const ADMINS = new Set(
	(process.env.ADMIN_USERS ?? '')
		.split(',')
		.map((u) => u.trim())
		.filter(Boolean),
);

const checkAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const usuario = req.session.usuario;
		if (!usuario) {
			res.status(401).json({ sucesso: false, mensagem: 'Não autenticado.' });
			return;
		}

		const user = await User.findOne({ where: { usuario } });
		if (user?.isAdmin || ADMINS.has(usuario)) {
			next();
			return;
		}

		res.status(403).json({ sucesso: false, mensagem: 'Acesso negado.' });
	} catch (error) {
		next(error);
	}
};

export default checkAdmin;

import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { usuario, senha } = req.body;

		const user = await User.findOne({ where: { usuario } });

		if (!user) {
			res.status(401).json({ sucesso: false, mensagem: 'Utilizador ou senha incorretos.' });
			return;
		}

		const senhaCorreta = await bcrypt.compare(senha, user.senha);

		if (!senhaCorreta) {
			res.status(401).json({ sucesso: false, mensagem: 'Utilizador ou senha incorretos.' });
			return;
		}

		(req.session as any).adminId = user.id;

		res.status(200).json({ sucesso: true, mensagem: 'Autenticado com sucesso!' });

		res.status(200).json({ sucesso: true, mensagem: 'Autenticado com sucesso!' });
	} catch (erro) {
		next(erro);
	}
};

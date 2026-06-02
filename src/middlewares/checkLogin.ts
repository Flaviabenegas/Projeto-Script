import { type Request, type Response, type NextFunction } from 'express';
import 'express-session';

const verificarLogin = (req: Request, res: Response, next: NextFunction): void => {
	if (!req.session || !(req.session as any).adminId) {
		res.status(401).json({ sucesso: false, mensagem: 'Não autorizado. Por favor, faça login.' });
		return;
	}
	next();
};

export default verificarLogin;

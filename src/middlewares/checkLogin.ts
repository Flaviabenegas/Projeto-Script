import { type Request, type Response, type NextFunction } from 'express';
import 'express-session';

const verificarLogin = (req: Request, res: Response, next: NextFunction): void => {
	if (!req.session || !(req.session as any).adminId) {
		res.redirect('/?abrirLogin=1');
		return;
	}
	next();
};
export default verificarLogin;

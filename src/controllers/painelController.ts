import { type Request, type Response, type NextFunction } from 'express';

export const verificarLogin = (req: Request, res: Response, next: NextFunction) => {
	if (!(req.session as any).adminId) {
	} else {
		next();
	}
};

import { type Request, type Response, type NextFunction } from 'express';

export const injetarLocals = (req: Request, res: Response, next: NextFunction): void => {
	if (req.session) {
		res.locals.logado = !!(req.session as any).adminId;
		res.locals.usuario = (req.session as any).usuario || null;
	} else {
		res.locals.logado = false;
		res.locals.usuario = null;
	}

	next();
};

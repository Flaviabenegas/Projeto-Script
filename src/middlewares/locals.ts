import { type Request, type Response, type NextFunction } from 'express';

export const injetarLocals = (req: Request, res: Response, next: NextFunction): void => {
	res.locals.logado = !!(req.session as any).adminId;
	res.locals.usuario = (req.session as any).usuario || null;
	next();
};

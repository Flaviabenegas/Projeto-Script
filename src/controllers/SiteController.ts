import { type Request, type Response, type NextFunction } from 'express';
import { Depoimento } from '../models/Depoimentos.js';

export const visualizarSite = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('index');
	} catch (error) {
		console.error('Erro ao visualizar o site:', error);
		next(error);
	}
};

export const comprar = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('comprar');
	} catch (error) {
		console.error('Erro ao acessar a página de compra:', error);
		next(error);
	}
};

export const depoimentos = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const listaDepoimentos = await Depoimento.findAll({
			where: { ativo: true },
			limit: 3,
			order: [['id', 'DESC']],
		});
		res.render('depoimentos', { depoimentos: listaDepoimentos });
	} catch (error) {
		console.error('Erro ao acessar a página de depoimentos:', error);
		next(error);
	}
};

export const painel = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('painel');
	} catch (error) {
		console.error('Erro ao acessar o painel:', error);
		next(error);
	}
};

export const criarDepoimentoView = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todosDepoimentos = await Depoimento.findAll({
			order: [['id', 'DESC']],
		});
		res.render('criardepoimento', { depoimentos: todosDepoimentos });
	} catch (error) {
		console.error('Erro ao acessar a página de criação de depoimento:', error);
		next(error);
	}
};

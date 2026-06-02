import { type Request, type Response, type NextFunction } from 'express';
import { Depoimento } from '../models/Depoimentos.js';

export const visualizarSite = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('index');
	} catch (erro) {
		console.error('Erro ao visualizar o site:', erro);
		next(erro);
	}
};

export const comprar = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('comprar');
	} catch (erro) {
		console.error('Erro ao acessar a página de compra:', erro);
		next(erro);
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
	} catch (erro) {
		console.error('Erro ao acessar a página de depoimentos:', erro);
		next(erro);
	}
};

export const painel = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('painel');
	} catch (erro) {
		console.error('Erro ao acessar o painel:', erro);
		next(erro);
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
	} catch (erro) {
		console.error('Erro ao acessar a página de criação de depoimento:', erro);
		next(erro);
	}
};

import { type Request, type Response, type NextFunction } from 'express';
import Pedido from '../controllers/PedidoController.js';

export const visualizarSite = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.render('index');
	} catch (erro) {
		console.error('Erro ao visualizar o site:', erro);
		next(erro);
	}
};

export const comprar = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.render('comprar');
	} catch (erro) {
		console.error('Erro ao acessar a página de compra:', erro);
		next(erro);
	}
};

export const depoimentos = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.render('depoimentos');
	} catch (erro) {
		next(erro);
		console.error('Erro ao acessar a página de depoimentos:', erro);
	}
};

export const painel = (req: Request, res: Response, next: NextFunction) => {
	try {
		res.render('painel');
	} catch (erro) {
		next(erro);
		console.error('Erro ao acessar o painel:', erro);
	}
};

export const listarPedidos = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todosPedidos = await Pedido.findAll();

		res.status(200).json({
			sucesso: true,
			quantidade: todosPedidos.length,
			pedidos: todosPedidos,
		});
	} catch (erro) {
		next(erro);
		console.error('Erro ao buscar os pedidos:', erro);
	}
};

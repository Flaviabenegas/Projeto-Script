import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Pedido from '../controllers/PedidoController.js';
import User from '../models/User.js';

// Estende a sessão para evitar os 'as any'
declare module 'express-session' {
	interface SessionData {
		adminId: number;
	}
}

interface LoginBody {
	usuario: string;
	senha: string;
}

export const visualizarSite = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('index');
	} catch (erro: unknown) {
		console.error('Erro ao visualizar o site:', erro);
		next(erro);
	}
};

export const comprar = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('comprar');
	} catch (erro: unknown) {
		console.error('Erro ao acessar a página de compra:', erro);
		next(erro);
	}
};

export const depoimentos = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('depoimentos');
	} catch (erro: unknown) {
		console.error('Erro ao acessar a página de depoimentos:', erro);
		next(erro);
	}
};

export const painel = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('painel');
	} catch (erro: unknown) {
		console.error('Erro ao acessar o painel:', erro);
		next(erro);
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
	} catch (erro: unknown) {
		console.error('Erro ao buscar os pedidos:', erro);
		next(erro);
	}
};

export const handleLogin = async (
	req: Request<object, object, LoginBody>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { usuario, senha } = req.body;

		if (!usuario || !senha) {
			res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos.' });
			return;
		}

		const user = await User.findOne({ where: { usuario } });

		if (!user) {
			res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
			return;
		}

		const senhaCorreta = await bcrypt.compare(senha, user.senha);

		if (!senhaCorreta) {
			res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' });
			return;
		}

		req.session.adminId = user.id; // sem 'as any' graças ao declare module
		res.status(200).json({ sucesso: true });
	} catch (erro: unknown) {
		console.error('Erro ao fazer login:', erro);
		next(erro);
	}
};

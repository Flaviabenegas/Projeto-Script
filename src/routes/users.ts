import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Pedido from '../controllers/PedidoController.js';
import User from '../models/User.js';
import 'express-session';
import { Depoimento } from '../models/Depoimentos.js';

declare module 'express-session' {
	interface SessionData {
		usuario: string;
	}
}

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
		console.error('Erro ao buscar os pedidos:', erro);
		next(erro);
	}
};

export const handleLogin = async (
	req: Request,
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

		(req.session as any).adminId = user.id;
		res.status(200).json({ sucesso: true });
	} catch (erro) {
		console.error('Erro ao fazer login:', erro);
		next(erro);
	}
};

export const criarUsuario = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('users');
	} catch (erro) {
		next(erro);
	}
};

export const criarUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { usuario, senha } = req.body;
		if (!usuario || !senha) {
			res.status(400).json({ sucesso: false, mensagem: 'Preencha usuário e senha.' });
			return;
		}
		const usuarioExistente = await User.findOne({ where: { usuario: usuario } });
		if (usuarioExistente) {
			res.status(409).json({ sucesso: false, mensagem: 'Usuário já cadastrado.' });
			return;
		}

		const novoUsuario = await User.create({
			usuario: usuario,
			senha,
		});

		res.status(201).json({
			sucesso: true,
			mensagem: 'Usuário criado com sucesso',
		});
	} catch (erro) {
		console.error('Erro ao criar usuário:', erro);
		next(erro);
	}
};

export const listarUsuarios = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const todosUsuarios = await User.findAll({
			attributes: ['id', 'usuario', 'senha'],
		});

		res.status(200).json({
			sucesso: true,
			quantidade: todosUsuarios.length,
			usuarios: todosUsuarios,
		});
	} catch (erro) {
		console.error('Erro ao buscar os usuarios:', erro);
		next(erro);
	}
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
	try {
		req.session.destroy(() => {
			res.redirect('/');
		});
	} catch (erro) {
		next(erro);
	}
};

export const pedidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (!req.session?.usuario) {
		res.status(401).json({ erro: 'Não autenticado' });
		return;
	}

	const todosPedidos = await Pedido.findAll();

	const pedidos =
		req.session.usuario === 'teste@teste'
			? todosPedidos
			: todosPedidos.filter((p: Pedido) => p.getDataValue('email') === req.session.usuario);

	res.json({ pedidos });
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

import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Pedido from '../controllers/PedidoController.js';
import User from '../models/User.js';

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

export const depoimentos = (req: Request, res: Response, next: NextFunction): void => {
	try {
		res.render('depoimentos');
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
		const { nome, senha } = req.body;

		if (!nome || !senha) {
			res.status(400).json({ sucesso: false, mensagem: 'Preencha usuário e senha.' });
			return;
		}
		const usuarioExistente = await User.findOne({ where: { usuario: nome } });
		if (usuarioExistente) {
			res.status(409).json({ sucesso: false, mensagem: 'Usuário já cadastrado.' });
			return;
		}

		const novoUsuario = await User.create({
			usuario: nome,
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

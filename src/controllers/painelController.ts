import { type NextFunction, type Request, type Response } from 'express';
import { User } from '../models/User.js';
import { Pedido } from '../models/Pedido.js';

const ADMINS = new Set(
	(process.env.ADMIN_USERS ?? '')
		.split(',')
		.map((u) => u.trim())
		.filter(Boolean),
);

export const getPainel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const usuario = req.session.usuario;

		if (usuario) {
			const user = await User.findOne({ where: { usuario } });
			res.render('painel', {
				usuario,
				isAdmin: user?.isAdmin || ADMINS.has(usuario), // <-- Aproveite e garanta o || aqui
			});
			return;
		}

		res.redirect('/login');
	} catch (error) {
		next(error);
	}
};

export const listarUsuariosAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const usuarios = await User.findAll({ attributes: ['id', 'nome', 'usuario', 'isAdmin'] });

		const mapUsuarios = new Map();

		for (const user of usuarios) {
			const existente = mapUsuarios.get(user.usuario);

			if (!existente || (!existente.isAdmin && user.isAdmin)) {
				mapUsuarios.set(user.usuario, user);
			}
		}

		const usuariosUnicos = Array.from(mapUsuarios.values());

		const usuariosComNome = await Promise.all(
			usuariosUnicos.map(async (user) => {
				let nomeDoCliente = user.nome;

				if (!nomeDoCliente) {
					const pedido = await Pedido.findOne({
						where: { email: user.usuario },
						order: [['createdAt', 'DESC']],
					});

					if (pedido?.nome) {
						nomeDoCliente = pedido.nome;
						await user.update({ nome: nomeDoCliente });
					}
				}

				return {
					id: user.id,
					nome: nomeDoCliente,
					usuario: user.usuario,
					isAdmin: user.isAdmin,
				};
			}),
		);

		res.status(200).json({ sucesso: true, usuarios: usuariosComNome });
	} catch (error) {
		next(error);
	}
};

export const atualizarNomeUsuario = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const { nome } = req.body;

		if (!nome) {
			res.status(400).json({ sucesso: false, mensagem: 'O novo nome é obrigatório.' });
			return;
		}

		const user = await User.findByPk(Number(id));

		if (!user) {
			res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
			return;
		}

		await user.update({ nome }); // Atualiza apenas o nome

		res.status(200).json({
			sucesso: true,
			mensagem: 'Nome atualizado com sucesso!',
			nome: user.nome,
		});
	} catch (error) {
		next(error);
	}
};

export const deletarUsuario = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(Number(id));

		if (!user) {
			res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
			return;
		}

		if (user.usuario === req.session.usuario) {
			res.status(403).json({ sucesso: false, mensagem: 'Não pode excluir a sua própria conta.' });
			return;
		}

		await user.destroy();

		res.status(200).json({ sucesso: true, mensagem: 'Cadastro removido com sucesso!' });
	} catch (error) {
		next(error);
	}
};

export const definirAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const { isAdmin } = req.body;

		const user = await User.findOne({ where: { id } });
		if (!user) {
			res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
			return;
		}

		await user.update({ isAdmin });
		res.status(200).json({
			sucesso: true,
			mensagem: isAdmin ? 'Utilizador promovido a admin.' : 'Admin removido.',
		});
	} catch (error) {
		next(error);
	}
};

export const adicionarAdministrador = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { nome, usuario, senha, isAdmin } = req.body;

		if (!usuario || !senha) {
			res.status(400).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' });
			return;
		}

		const existente = await User.findOne({ where: { usuario } });
		if (existente) {
			res.status(409).json({ sucesso: false, mensagem: 'Este e-mail já está registado.' });
			return;
		}

		await User.create({
			nome: nome || null,
			usuario,
			senha,
			isAdmin: isAdmin ?? true, // ?? já trata undefined e null, sem negação
		});
		res.status(201).json({
			sucesso: true,
			mensagem: 'Administrador adicionado com sucesso!',
		});
	} catch (error) {
		next(error);
	}
};

export const listarPedidosPainel = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const usuario = req.session.usuario;
		const user = await User.findOne({ where: { usuario } });

		const isAdmin = user?.isAdmin || ADMINS.has(usuario ?? '');

		const where = isAdmin ? {} : { email: usuario };

		const pedidos = await Pedido.findAll({ where, order: [['createdAt', 'DESC']] });

		res.status(200).json({ sucesso: true, pedidos });
	} catch (error) {
		next(error);
	}
};

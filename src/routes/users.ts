import { type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Pedido from '../controllers/PedidoController.js';
import User from '../models/User.js';
import 'express-session';

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

export const depoimentos = (req: Request, res: Response, next: NextFunction): void => {
	const listaDepoimentos = [
		{
			tutor: 'Jessica',
			pet: 'Lua',
			imagem: 'img/lua.webp',
			alt: 'Vira-lata de cor preta usando identificação com nome de Lua',
			texto:
				'Durante um passeio no final de semana, a Lua se assustou com um barulho de escapamento e saiu em disparada para uma área de mata. Foram momentos de pânico  absoluto. Menos de 15 minutos depois, recebi uma notificação no meu celular: alguém tinha lido a identificação dela. Um casal a encontrou e, pelas informações gravadas na plaquinha, já sabiam o nome dela e que ela era medrosa. Eles me ligaram na hora e o reencontro foi emocionante. Hoje eu não saio de casa sem conferir se a medalhinha está no pescoço dela. Salvou a nossa família.',
		},
		{
			tutor: 'Fernanda',
			pet: 'Simba',
			imagem: 'img/simba.webp',
			alt: 'Gato laranja usando identificação',
			texto:
				'O Simba fugiu de casa duas vezes e, em ambas, o desespero durou pouco. Na primeira, ele se perdeu na vizinhança; na segunda, atravessou avenidas e foi parar em outro bairro. O que eu aprendi? Que amor e muros altos não bastam. Se não fosse pela placa de identificação, ele seria apenas mais um gato laranja anônimo na rua. Quem o encontrou não precisou de tecnologia ou postagens em redes sociais: bastou ler o nome dele e o meu telefone gravados ali. A plaquinha deu voz ao Simba quando ele estava perdido e garantiu que ele voltasse para os meus braços em minutos. É o investimento mais barato e vital que já fiz.',
		},
		{
			tutor: 'Vanessa',
			pet: 'Sol',
			imagem: 'img/sol.webp',
			alt: 'Vira-lata caramelo usando identificação com nome de Sol',
			texto:
				'A Sol aproveitou um descuido durante a mudança e saiu para a rua. Foram as duas horas mais desesperadoras da minha vida. Por sorte, ela estava com a medalhinha de identificação. Uma vizinha de dois quarteirões a encontrou e, em segundos, conseguiu acessar meu contato. Se não fosse por essa tecnologia, não sei se ela estaria dormindo no sofá hoje. É um investimento minúsculo perto da paz de espírito que traz.',
		},
	];
	try {
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
		console.log('Body recebido:', req.body);
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

import { type Request, type Response } from 'express';
import { Pedido } from '../config/database.js';

interface UsuarioParams {
	nome: string;
}

export const getUsuario = (req: Request<UsuarioParams>, res: Response) => {
	const { nome } = req.params;

	res.json({
		mensagem: `Bem-vindo, ${nome}!`,
		tipo_usuario: 'visitante',
	});
};

export const statusSite = (req: Request, res: Response) => {
	res.json({
		status: 'online',
		mensagem: 'A API está funcionando perfeitamente.',
		timestamp: new Date(),
	});
};

export const visualizarSite = (req: Request, res: Response) => {
	res.render('index');
};

export const comprar = (req: Request, res: Response) => {
	res.render('comprar');
};

export const depoimentos = (req: Request, res: Response) => {
	res.render('depoimentos');
};

export const painel = (req: Request, res: Response) => {
	res.render('painel');
};

export const pedidos = async (req: Request, res: Response): Promise<void> => {
	try {
		const novoPedido = await Pedido.create(req.body);

		res.status(201).json({
			sucesso: true,
			mensagem: 'Pedido salvo com sucesso!',
			pedido: novoPedido,
		});
	} catch (erro) {
		console.error('Erro ao salvar o pedido:', erro);
		res.status(500).json({ sucesso: false, erro: 'Falha ao processar o pedido.' });
	}
};

export const listarPedidos = async (req: Request, res: Response): Promise<void> => {
	try {
		const todosPedidos = await Pedido.findAll();

		res.status(200).json({
			sucesso: true,
			quantidade: todosPedidos.length,
			pedidos: todosPedidos,
		});
	} catch (erro) {
		console.error('Erro ao buscar os pedidos:', erro);
		res.status(500).json({ sucesso: false, erro: 'Falha ao buscar os pedidos.' });
	}
};

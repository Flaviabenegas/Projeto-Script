import { type Request, type Response } from 'express';

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
	console.log('Compra recebida:', req.body);
	res.json({
		statuscode: 200,
		message: 'Compra realizada com sucesso!',
	});
};

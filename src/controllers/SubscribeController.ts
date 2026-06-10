import { type NextFunction, type Request, type Response } from 'express';

export const subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { email, nome } = req.body;

		if (!email) {
			res.status(400).json({ sucesso: false, mensagem: 'E-mail é obrigatório.' });
			return;
		}

		const DATACENTER = process.env.DATACENTER;
		const LIST_ID = process.env.LIST_ID;
		const API_KEY = process.env.API_KEY;

		if (!DATACENTER || !LIST_ID || !API_KEY) {
			console.error(
				'Variáveis de ambiente do Mailchimp não configuradas (DATACENTER, LIST_ID, API_KEY).',
			);
			res.status(500).json({
				sucesso: false,
				mensagem: 'Serviço de inscrição indisponível. Tente novamente mais tarde.',
			});
			return;
		}

		const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

		const credentials = Buffer.from(`anystring:${API_KEY}`).toString('base64');

		const apiResponse = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${credentials}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email_address: email,
				status: 'subscribed',
				merge_fields: { FNAME: nome ?? '' },
			}),
		});

		if (apiResponse.ok) {
			res.status(200).json({ sucesso: true, mensagem: 'Inscrição realizada com sucesso!' });
			return;
		}

		const errorData = await apiResponse.json();
		console.error('Erro da API Mailchimp:', errorData);
		res
			.status(apiResponse.status)
			.json({ sucesso: false, mensagem: errorData?.detail ?? 'Erro ao realizar inscrição.' });
	} catch (error) {
		next(error);
	}
};

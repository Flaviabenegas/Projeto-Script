import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { Depoimento } from '../models/Depoimentos.js';
import { handleZodError } from '../utils/errorHandler.js';

const depoimentoSchema = z.object({
	tutor: z.string().trim().min(1, 'O nome do tutor é obrigatório.'),
	pet: z.string().trim().min(1, 'O nome do pet é obrigatório.'),
	imagem: z.string().trim().min(1, 'A imagem é obrigatória.'),
	alt: z.string().trim().min(1, 'A descrição da imagem (alt) é obrigatória.'),
	texto: z.string().trim().min(5, 'O depoimento deve conter pelo menos 5 caracteres.'),
});

export const criarDepoimento = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const data = depoimentoSchema.parse(req.body);

		const depoimento = await Depoimento.create(data);

		res.status(201).json({
			sucesso: true,
			mensagem: 'Depoimento salvo com sucesso!',
			depoimento: depoimento,
		});
	} catch (err: any) {
		if (handleZodError(err, res, 'gravação do depoimento')) return;
		next(err);
	}
};

export const atualizarDepoimento = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const data = depoimentoSchema.parse(req.body);

		const depoimento = await Depoimento.findByPk(Number(id));

		if (!depoimento) {
			res.status(404).json({
				sucesso: false,
				mensagem: 'Depoimento não encontrado.',
			});
			return;
		}

		await depoimento.update(data);

		res.status(200).json({
			sucesso: true,
			mensagem: 'Depoimento atualizado com sucesso!',
			depoimento: depoimento,
		});
	} catch (err: any) {
		if (handleZodError(err, res, 'atualização do depoimento')) return;
		next(err);
	}
};

export const alternarStatusDepoimento = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const depoimento = await Depoimento.findByPk(Number(id));

		if (!depoimento) {
			res.status(404).json({
				sucesso: false,
				mensagem: 'Depoimento não encontrado.',
			});
			return;
		}

		const novoStatus = !depoimento.ativo;
		await depoimento.update({ ativo: novoStatus });

		res.status(200).json({
			sucesso: true,
			mensagem: `Depoimento ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`,
			ativo: novoStatus,
		});
	} catch (err: any) {
		next(err);
	}
};

export default Depoimento;

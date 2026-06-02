import { z } from 'zod';
import { type Response } from 'express';

export const handleZodError = (err: any, res: Response, blockName: string): boolean => {
	if (err instanceof z.ZodError) {
		console.log(`❌ O Zod bloqueou a operação em ${blockName}. Motivo:`, err);
		res.status(400).json({
			sucesso: false,
			mensagem: err.issues[0]?.message || 'Erro de validação dos dados enviados.',
			erros: err.issues || err,
		});
		return true; // was handled
	}
	return false; // not a Zod error
};

import express from 'express';
import {
	getUsuario,
	statusSite,
	comprar,
	visualizarSite,
	depoimentos,
	painel,
	pedidos,
	listarPedidos,
} from './users.js';

const router = express.Router();

router.get('/', visualizarSite);
router.get('/api/status', statusSite);
router.get('/api/usuarios/:nome', getUsuario);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/painel', painel);
router.get('/api/pedidos', listarPedidos);

router.post('/api/pedidos', pedidos);

export default router;

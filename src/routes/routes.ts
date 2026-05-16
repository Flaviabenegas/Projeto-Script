import express from 'express';
import { comprar, visualizarSite, depoimentos, painel, pedidos, listarPedidos } from './users.js';

const router = express.Router();

router.get('/', visualizarSite);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/painel', painel);

router.get('/api/pedidos', listarPedidos);
router.post('/api/pedidos', pedidos);

export default router;

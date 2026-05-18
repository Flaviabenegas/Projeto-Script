import express from 'express';
import { comprar, visualizarSite, depoimentos, painel, listarPedidos } from './users.js';
import { criarPedido } from '../controllers/PedidoController.js';
import verficarLogin from '../middlewares/checkLogin.js';
import { handleLogin } from '../middlewares/handleLogin.js';

const router = express.Router();

router.get('/', visualizarSite);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/painel', verficarLogin, painel);

router.get('/api/pedidos', listarPedidos);
router.post('/api/pedidos', criarPedido);
router.post('/api/login/', handleLogin);

export default router;

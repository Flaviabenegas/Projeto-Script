import express from 'express';
import {
	comprar,
	visualizarSite,
	depoimentos,
	painel,
	listarPedidos,
	criarUsuario,
	criarUser,
	listarUsuarios,
	logout,
	pedidos,
} from './users.js';

import { criarPedido } from '../controllers/PedidoController.js';
import verficarLogin from '../middlewares/checkLogin.js';
import { handleLogin } from '../middlewares/handleLogin.js';

const router = express.Router();

router.get('/', visualizarSite);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/users', criarUsuario);
router.get('/painel', verficarLogin, painel);
router.get('/pedidos', pedidos);

router.get('/api/pedidos', listarPedidos);
router.post('/api/criar', criarUser);
router.post('/api/pedidos', criarPedido);
router.post('/api/login/', handleLogin);
router.get('/api/users', listarUsuarios);
router.get('/api/logout', logout);

export default router;

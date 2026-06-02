import express from 'express';

import {
	visualizarSite,
	comprar,
	depoimentos,
	painel,
	criarDepoimentoView,
} from '../controllers/SiteController.js';

import { criarPedido, listarPedidos, pedidosUsuario } from '../controllers/PedidoController.js';

import { criarUsuarioView, criarUser, listarUsuarios } from '../controllers/UserController.js';

import {
	criarDepoimento,
	atualizarDepoimento,
	alternarStatusDepoimento,
} from '../controllers/DepoimentoController.js';

import { handleLogin, logout } from '../controllers/AuthController.js';

import verificarLogin from '../middlewares/checkLogin.js';

const router = express.Router();

router.get('/', visualizarSite);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/users', criarUsuarioView);
router.get('/painel', painel);
router.get('/criardepoimento', criarDepoimentoView);

router.get('/pedidos', pedidosUsuario);
router.get('/api/pedidos', verificarLogin, listarPedidos);
router.post('/api/criar', criarUser);
router.post('/api/pedidos', criarPedido);
router.post('/api/depoimentos', verificarLogin, criarDepoimento);
router.put('/api/depoimentos/:id', atualizarDepoimento);
router.patch('/api/depoimentos/:id/toggle', alternarStatusDepoimento);
router.post('/api/login/', handleLogin);
router.get('/api/users', verificarLogin, listarUsuarios);
router.get('/api/logout', logout);

export default router;

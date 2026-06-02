import express from 'express';

// Site Controller
import {
	visualizarSite,
	comprar,
	depoimentos,
	painel,
	criarDepoimentoView,
} from '../controllers/SiteController.js';

// Pedido Controller
import { criarPedido, listarPedidos, pedidosUsuario } from '../controllers/PedidoController.js';

// User Controller
import { criarUsuarioView, criarUser, listarUsuarios } from '../controllers/UserController.js';

// Depoimento Controller
import {
	criarDepoimento,
	atualizarDepoimento,
	alternarStatusDepoimento,
} from '../controllers/DepoimentoController.js';

// Auth Controller
import { handleLogin, logout } from '../controllers/AuthController.js';

// Middlewares
import verficarLogin from '../middlewares/checkLogin.js';

const router = express.Router();

// Views
router.get('/', visualizarSite);
router.get('/comprar', comprar);
router.get('/depoimentos', depoimentos);
router.get('/users', criarUsuarioView);
router.get('/painel', verficarLogin, painel);
router.get('/criardepoimento', criarDepoimentoView);

// API Endpoints
router.get('/pedidos', pedidosUsuario);
router.get('/api/pedidos', listarPedidos);
router.post('/api/criar', criarUser);
router.post('/api/pedidos', criarPedido);
router.post('/api/depoimentos', criarDepoimento);
router.put('/api/depoimentos/:id', atualizarDepoimento);
router.patch('/api/depoimentos/:id/toggle', alternarStatusDepoimento);
router.post('/api/login/', handleLogin);
router.get('/api/users', listarUsuarios);
router.get('/api/logout', logout);

export default router;

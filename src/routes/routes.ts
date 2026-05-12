import express from 'express';
import { getUsuario, statusSite, comprar, visualizarSite } from './users.js';

const router = express.Router();

router.get('/', visualizarSite);

router.get('/api/status', statusSite);

router.get('/api/usuarios/:nome', getUsuario);

router.post('/api/comprar', comprar);

export default router;

// routes/painel.js
// Adicione este arquivo em routes/ e registre em app.js

const express    = require('express');
const router     = express.Router();
const ctrl       = require('../../public/controllers/painelController');

// Middleware simples de autenticação de sessão
function autenticado(req, res, next) {
  if (req.session && req.session.adminId) return next();
  res.redirect('/?login=1');   // redireciona para o modal de login do site
}

router.use(autenticado);

router.get('/',                         ctrl.index);
router.patch('/pedidos/:id/status',     ctrl.atualizarStatus);
router.get('/exportar',                 ctrl.exportarCSV);

module.exports = router;

// ─── Como registrar em app.js ────────────────────────────────────
//
//   const painelRoutes = require('./routes/painel');
//   app.use('/painel', painelRoutes);

// controllers/painelController.js
// Sequelize 3 + SQLite — Painel de Pedidos "Apaixonados por Focinhos"

const { Op } = require('sequelize');
const { Pedido, Cliente, Produto, Endereco, HistoricoPedido } = require('../models');

const PER_PAGE = 15;

// ─── GET /painel ────────────────────────────────────────────────
exports.index = async (req, res) => {
  try {
    const { busca, status, dataInicio, dataFim, page = 1 } = req.query;

    // ── Monta filtro WHERE ────────────────────────────────────
    const where = {};

    if (status) {
      where.status = status;
    }

    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) where.createdAt[Op.gte] = new Date(dataInicio + 'T00:00:00');
      if (dataFim)    where.createdAt[Op.lte] = new Date(dataFim    + 'T23:59:59');
    }

    // Busca textual em cliente ou nome do pet
    const includeCliente = {
      model: Cliente,
      required: !!busca,
      where: busca
        ? {
            [Op.or]: [
              { nome:  { [Op.like]: `%${busca}%` } },
              { email: { [Op.like]: `%${busca}%` } },
            ],
          }
        : undefined,
    };

    if (busca && !status) {
      // também filtra pelo nome do pet direto no pedido
      where[Op.or] = [
        { nomePet: { [Op.like]: `%${busca}%` } },
        { '$Cliente.nome$': { [Op.like]: `%${busca}%` } },
      ];
    }

    // ── Busca paginada ────────────────────────────────────────
    const offset = (Number(page) - 1) * PER_PAGE;

    const pedidos = await Pedido.findAndCountAll({
      where,
      include: [
        includeCliente,
        { model: Produto,          required: false },
        { model: Endereco,         required: false },
        {
          model: HistoricoPedido,
          as: 'historico',
          required: false,
          order: [['createdAt', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit:  PER_PAGE,
      offset,
      distinct: true,
    });

    const totalPages   = Math.ceil(pedidos.count / PER_PAGE);
    const currentPage  = Number(page);

    // ── Stats (KPI cards) ─────────────────────────────────────
    const [
      total,
      pendentes,
      emProducao,
      enviados,
      entregues,
      receitaResult,
    ] = await Promise.all([
      Pedido.count(),
      Pedido.count({ where: { status: 'pendente'   } }),
      Pedido.count({ where: { status: 'producao'   } }),
      Pedido.count({ where: { status: 'enviado'    } }),
      Pedido.count({ where: { status: 'entregue'   } }),
      Pedido.sum('valorTotal', { where: { status: { [Op.ne]: 'cancelado' } } }),
    ]);

    // Monta queryString sem 'page' para usar na paginação
    const params = new URLSearchParams(req.query);
    params.delete('page');
    const queryString = params.toString();

    res.render('painel', {
      pedidos: {
        rows:        pedidos.rows,
        count:       pedidos.count,
        totalPages,
        currentPage,
      },
      stats: {
        total,
        pendentes,
        emProducao,
        enviados,
        entregues,
        receitaTotal: receitaResult || 0,
      },
      filtros: { busca, status, dataInicio, dataFim },
      queryString,
      adminNome: req.session?.adminNome || 'Admin',
    });
  } catch (err) {
    console.error('[painelController.index]', err);
    res.status(500).render('error', { mensagem: 'Erro ao carregar o painel.' });
  }
};

// ─── PATCH /painel/pedidos/:id/status ───────────────────────────
exports.atualizarStatus = async (req, res) => {
  try {
    const { id }   = req.params;
    const { status, codigoRastreio } = req.body;

    const statusValidos = ['pendente','confirmado','producao','enviado','entregue','cancelado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido.' });
    }

    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });

    const descricaoMap = {
      pendente:   'Pedido registrado e aguardando confirmação',
      confirmado: 'Pagamento confirmado',
      producao:   'Plaquinha em produção',
      enviado:    'Pedido despachado para entrega',
      entregue:   'Pedido entregue com sucesso 🎉',
      cancelado:  'Pedido cancelado',
    };

    // Atualiza campos
    pedido.status = status;
    if (codigoRastreio !== undefined) pedido.codigoRastreio = codigoRastreio || null;
    await pedido.save();

    // Registra no histórico
    await HistoricoPedido.create({
      PedidoId:   pedido.id,
      status,
      descricao:  descricaoMap[status] || status,
    });

    res.json({ ok: true, mensagem: 'Status atualizado com sucesso.' });
  } catch (err) {
    console.error('[painelController.atualizarStatus]', err);
    res.status(500).json({ mensagem: 'Erro interno ao atualizar o status.' });
  }
};

// ─── GET /painel/exportar ────────────────────────────────────────
exports.exportarCSV = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: Cliente }, { model: Produto }, { model: Endereco }],
      order:   [['createdAt', 'DESC']],
    });

    const linhas = [
      ['ID','Cliente','E-mail','Pet','Produto','Status','Data','Valor','Rastreio'].join(';'),
      ...pedidos.map(p => [
        p.id,
        `"${(p.Cliente?.nome  || '').replace(/"/g,'')}"`,
        p.Cliente?.email || '',
        `"${(p.nomePet || '').replace(/"/g,'')}"`,
        `"${(p.Produto?.nome  || '').replace(/"/g,'')}"`,
        p.status,
        new Date(p.createdAt).toLocaleDateString('pt-BR'),
        p.valorTotal.toFixed(2).replace('.',','),
        p.codigoRastreio || '',
      ].join(';')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pedidos_${Date.now()}.csv"`);
    res.send('\uFEFF' + linhas); // BOM para Excel reconhecer UTF-8
  } catch (err) {
    console.error('[painelController.exportarCSV]', err);
    res.status(500).send('Erro ao exportar.');
  }
};

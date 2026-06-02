
const ADMIN_EMAIL = 'teste@teste';

const formLogin = document.getElementById('loginPainel');

if (formLogin) {
    formLogin.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btnLogin = document.getElementById('btn-login');
        const loader = document.getElementById('loader');

        if (btnLogin) btnLogin.disabled = true;
        if (loader) loader.classList.remove('d-none');

        const usuario = document.getElementById('email-login')?.value;
        const senha = document.getElementById('senha')?.value;

        try {
            const resposta = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha }),
            });

            if (resposta.ok) {
                
                sessionStorage.setItem('emailLogado', usuario.toLowerCase().trim());
                window.location.href = '/painel';
            } else {
                const modalErroEl = document.getElementById('modalEmailErro');
                const textoModal = document.getElementById('modalText');
                if (textoModal) textoModal.innerText = 'Usuário ou senha incorretos.';
                if (modalErroEl) new bootstrap.Modal(modalErroEl).show();
            }
        } catch (err) {
            console.error('Erro no login:', err);
        } finally {
            if (btnLogin) btnLogin.disabled = false;
            if (loader) loader.classList.add('d-none');
        }
    });
}

carregarPainel();
async function carregarPainel() {
    if (!document.getElementById('statPedidos')) return;

    try {
        const [resPedidos, resUsuarios] = await Promise.all([
            fetch('/api/pedidos'),
            fetch('/api/users'),
        ]);

        const { pedidos } = await resPedidos.json();
        const { usuarios } = await resUsuarios.json();

        
        const emailLogado = sessionStorage.getItem('emailLogado') || '';
        const isAdmin = emailLogado === ADMIN_EMAIL;

        
        const pedidosFiltrados = isAdmin
            ? pedidos
            : pedidos.filter(p => p.email?.toLowerCase().trim() === emailLogado);

        preencherEstatisticas(pedidosFiltrados);
        preencherTabelaPedidos(pedidosFiltrados);
        preencherClientes(pedidosFiltrados, usuarios);
        ativarFiltro(pedidosFiltrados);

    } catch (err) {
        console.error('Erro ao carregar painel:', err);
    }
}

function preencherEstatisticas(pedidos) {
    const hoje = new Date().toISOString().slice(0, 10);

    const clientesUnicos = new Set(pedidos.map(p => p.email)).size;

    const receita = pedidos.reduce((acc, p) => {
        const valor = parseFloat(String(p.valorTotal).replace(',', '.')) || 0;
        return acc + valor;
    }, 0);

    const pedidosHoje = pedidos.filter(p => p.createdAt?.slice(0, 10) === hoje).length;

    document.getElementById('statPedidos').textContent = pedidos.length;
    document.getElementById('statClientes').textContent = clientesUnicos;
    document.getElementById('statReceita').textContent =
        'R$ ' + receita.toFixed(2).replace('.', ',');
    document.getElementById('statHoje').textContent = pedidosHoje;
}

function linhaTabela(pedido, index) {
    const data = pedido.createdAt
        ? new Date(pedido.createdAt).toLocaleDateString('pt-BR')
        : '—';

    const qtdCao = Number(pedido.qtdCao || 0);
    const qtdGato = Number(pedido.qtdGato || 0);
    const valor = parseFloat(String(pedido.valorTotal).replace(',', '.')) || 0;

    const badges = [
        qtdCao > 0 ? `<span class="badge badge-cao rounded-pill me-1">🐶 ${qtdCao}</span>` : '',
        qtdGato > 0 ? `<span class="badge badge-gato rounded-pill">🐱 ${qtdGato}</span>` : '',
    ].join('');

    return `
        <tr data-email="${pedido.email?.toLowerCase() || ''}">
            <td class="text-secondary small">${index + 1}</td>
            <td class="fw-medium">${pedido.nome || '—'}</td>
            <td class="text-secondary small">${pedido.email || '—'}</td>
            <td class="text-secondary small">${pedido.cidade || '—'} / ${pedido.uf || '—'}</td>
            <td>${pedido.nomePets || '—'}</td>
            <td>${badges || '—'}</td>
            <td class="fw-bold titulos-rosa">R$ ${valor.toFixed(2).replace('.', ',')}</td>
            <td class="text-secondary small">${data}</td>
        </tr>`;
}

function preencherTabelaPedidos(pedidos) {
    const corpo = document.getElementById('corpoTabelaPedidos');

    if (!pedidos.length) {
        corpo.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-4">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    corpo.innerHTML = pedidos.map((p, i) => linhaTabela(p, i)).join('');
}

function preencherClientes(pedidos, usuarios) {
    const lista = document.getElementById('listaClientes');

    const mapa = {};
    pedidos.forEach(p => {
        if (!p.email) return;
        if (!mapa[p.email]) mapa[p.email] = { nome: p.nome, total: 0, pedidos: 0 };
        mapa[p.email].pedidos += 1;
        mapa[p.email].total += parseFloat(String(p.valorTotal).replace(',', '.')) || 0;
    });

    const emails = Object.keys(mapa);

    if (!emails.length) {
        lista.innerHTML = `<div class="col-12 text-secondary text-center py-3">Nenhum cliente encontrado.</div>`;
        return;
    }

    lista.innerHTML = emails.map(email => `
        <div class="col-md-4 col-sm-6">
            <div class="border rounded-4 p-3 bg-light h-100">
                <p class="fw-bold titulos mb-1 text-truncate" title="${mapa[email].nome}">${mapa[email].nome || '—'}</p>
                <p class="text-secondary small mb-2 text-truncate">${email}</p>
                <div class="d-flex gap-3">
                    <span class="small"><strong>${mapa[email].pedidos}</strong> pedido(s)</span>
                    <span class="small titulos-rosa fw-bold">R$ ${mapa[email].total.toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                    class="btn btn-outline-secondary btn-sm rounded-pill mt-2 w-100 btn-filtrar"
                    data-email="${email}">
                    Ver pedidos
                </button>
            </div>
        </div>`).join('');

    document.querySelectorAll('.btn-filtrar').forEach(btn => {
        btn.addEventListener('click', () => {
            const email = btn.dataset.email;
            document.getElementById('searchBar').value = email;
            filtrarTabela(email);
            document.getElementById('tabelaPedidos').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function filtrarTabela(termo) {
    const linhas = document.querySelectorAll('#corpoTabelaPedidos tr[data-email]');
    linhas.forEach(tr => {
        const email = tr.dataset.email || '';
        tr.style.display = email.includes(termo.toLowerCase()) ? '' : 'none';
    });
}

function ativarFiltro(pedidos) {
    document.getElementById('searchBar').addEventListener('input', function () {
        filtrarTabela(this.value.trim());
    });
}
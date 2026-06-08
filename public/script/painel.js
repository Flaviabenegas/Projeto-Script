
const formLogin = document.getElementById('loginPainel');
let modalEditarNomeInstance, modalConfirmarDelecaoInstance, modalSucessoInstance;


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
                globalThis.location.href = '/painel';
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


async function carregarPainel() {
    if (!document.getElementById('statPedidos')) return;

    try {
        const [resPedidos, resUsuarios] = await Promise.all([
            fetch('/api/pedidos'),
            fetch('/api/users'),
        ]);

        const { pedidos } = await resPedidos.json();
        const { usuarios } = await resUsuarios.json();

        globalThis.listaPedidosGlobais = pedidos; 

        preencherEstatisticas(pedidos);
        preencherTabelaPedidos(pedidos);
        preencherClientes(pedidos, usuarios);
        ativarFiltro();
    } catch (err) {
        console.error('Erro ao carregar painel:', err);
    }
}

function preencherEstatisticas(pedidos) {
    const hoje = new Date().toISOString().slice(0, 10);
    const clientesUnicos = new Set(pedidos.map(p => p.email)).size;

    const receita = pedidos.reduce((acc, p) => {
        const valor = Number.parseFloat(String(p.valorTotal).replace(',', '.')) || 0;
        return acc + valor;
    }, 0);

    const pedidosHoje = pedidos.filter(p => p.createdAt?.slice(0, 10) === hoje).length;

    document.getElementById('statPedidos').textContent = pedidos.length;
    document.getElementById('statClientes').textContent = clientesUnicos;
    document.getElementById('statReceita').textContent = 'R$ ' + receita.toFixed(2).replace('.', ',');
    document.getElementById('statHoje').textContent = pedidosHoje;
}

function linhaTabela(pedido, index) {
    const data = pedido.createdAt
        ? new Date(pedido.createdAt).toLocaleDateString('pt-BR')
        : '—';

    const qtdCao = Number(pedido.qtdCao || 0);
    const qtdGato = Number(pedido.qtdGato || 0);
    const valor = Number.parseFloat(String(pedido.valorTotal).replace(',', '.')) || 0;

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
            <td class="text-center">
                <button onclick="abrirDetalhesPedido(${index})" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                    Detalhes
                </button>
            </td>
        </tr>`;
}

function preencherTabelaPedidos(pedidos) {
    const corpo = document.getElementById('corpoTabelaPedidos');

    if (!pedidos.length) {
        corpo.innerHTML = `<tr><td colspan="9" class="text-center text-secondary py-4">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    corpo.innerHTML = pedidos.map((p, i) => linhaTabela(p, i)).join('');
}

function preencherClientes(pedidos, usuarios) {
    const lista = document.getElementById('listaClientes');
    if (!lista) return;

    const mapa = {};
    pedidos.forEach(p => {
        if (!p.email) return;
        if (!mapa[p.email]) mapa[p.email] = { nome: p.nome, total: 0, pedidos: 0 };
        mapa[p.email].pedidos += 1;
        mapa[p.email].total += Number.parseFloat(String(p.valorTotal).replace(',', '.')) || 0;
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

function ativarFiltro() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function () {
            filtrarTabela(this.value.trim());
        });
    }
}

function abrirDetalhesPedido(index) {
   
    const p = globalThis.listaPedidosGlobais[index];
    if (!p) return;

    const valorFrete = Number(p.valorFrete || 0).toFixed(2).replace('.', ',');
    const valorTotal = Number.parseFloat(String(p.valorTotal).replace(',', '.')).toFixed(2).replace('.', ',');

    const modalBody = document.getElementById('conteudoDetalhesPedido');
    
    modalBody.innerHTML = `
        <div class="row g-4">
            <div class="col-md-6">
                <h6 class="fw-bold titulos-rosa mb-3">👤 Dados do Cliente</h6>
                <p class="mb-1 small text-secondary"><strong>Nome:</strong> <span class="text-dark">${p.nome}</span></p>
                <p class="mb-1 small text-secondary"><strong>E-mail:</strong> <span class="text-dark">${p.email}</span></p>
                <p class="mb-1 small text-secondary"><strong>CPF:</strong> <span class="text-dark">${p.cpf}</span></p>
                <p class="mb-1 small text-secondary"><strong>Telefone:</strong> <span class="text-dark">${p.telefone}</span></p>
            </div>
            
            <div class="col-md-6">
                <h6 class="fw-bold titulos-rosa mb-3">📍 Endereço de Entrega</h6>
                <p class="mb-1 small text-secondary"><strong>Logradouro:</strong> <span class="text-dark">${p.logradouro}, ${p.numero} ${p.complemento ? ' - ' + p.complemento : ''}</span></p>
                <p class="mb-1 small text-secondary"><strong>Bairro:</strong> <span class="text-dark">${p.bairro}</span></p>
                <p class="mb-1 small text-secondary"><strong>Cidade/UF:</strong> <span class="text-dark">${p.cidade} - ${p.uf}</span></p>
                <p class="mb-1 small text-secondary"><strong>CEP:</strong> <span class="text-dark">${p.cep}</span></p>
            </div>

            <div class="col-12">
                <h6 class="fw-bold titulos-rosa mb-3">🐾 Detalhes para Gravação (Produção)</h6>
                <div class="bg-light p-3 rounded-3 border">
                    <p class="mb-2 small"><strong>Quantidade:</strong> ${p.qtdCao} Cãozinho(s) | ${p.qtdGato} Gatinho(s)</p>
                    <p class="mb-2 small text-primary"><strong>Nomes para a Frente da Plaquinha:</strong> <br>
                        <span class="fs-6 text-dark">${p.nomePets}</span>
                    </p>
                    <p class="mb-1 small text-primary"><strong>Telefone para o Verso da Plaquinha:</strong> <br>
                        <span class="fs-6 text-dark">${p.telGravacao}</span>
                    </p>
                </div>
            </div>

            <div class="col-12 text-end border-top pt-3 mt-4">
                <p class="mb-1 small text-secondary">Valor do Frete: R$ ${valorFrete}</p>
                <h5 class="fw-bold mb-0 titulos">Total Pago: R$ ${valorTotal}</h5>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesPedido'));
    modal.show();
}


async function carregarUsuarios() {
    try {
        const response = await fetch('/api/admin/usuarios');
        const data = await response.json();
        const tbody = document.getElementById('corpoTabelaUsuarios');
        
        if (data.sucesso && data.usuarios.length > 0) {
            tbody.innerHTML = ''; 
            
            data.usuarios.forEach((user, index) => {
                const tr = document.createElement('tr');
                const adminCheck = user.isAdmin ? 'checked' : '';
                const nomeSeguro = (user.nome && user.nome !== 'null') ? user.nome : '';

                tr.innerHTML = `
                    <td class="text-secondary">${index + 1}</td>
                    <td class="fw-medium">${nomeSeguro || '<span class="text-muted small">Sem nome configurado</span>'}</td>
                    <td class="text-secondary">${user.usuario}</td>
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" onchange="alternarAdmin(${user.id}, this.checked)" ${adminCheck}>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex gap-2 justify-content-center">
                            <button onclick="atualizarNomeUsuario(${user.id}, '${nomeSeguro}')" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                                Editar
                            </button>
                            <button onclick="deletarUsuario(${user.id})" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                                Excluir
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-secondary">Nenhum usuário encontrado.</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao procurar usuários:', error);
    }
}
function mostrarSucesso(mensagem) {
    document.getElementById('textoModalSucesso').innerText = mensagem;
    if (!modalSucessoInstance) {
        modalSucessoInstance = new bootstrap.Modal(document.getElementById('modalSucessoGeral'));
    }
    modalSucessoInstance.show();
}

// === 1. LÓGICA DE EDIÇÃO ===
function atualizarNomeUsuario(id, nomeAtual) {
    if (!modalEditarNomeInstance) {
        modalEditarNomeInstance = new bootstrap.Modal(document.getElementById('modalEditarNome'));
    }
    // Preenche o modal com os dados atuais
    document.getElementById('editAdminId').value = id;
    document.getElementById('editAdminNome').value = nomeAtual || '';
    
    modalEditarNomeInstance.show();
}

async function executarAtualizacaoNome() {
    const id = document.getElementById('editAdminId').value;
    const novoNome = document.getElementById('editAdminNome').value.trim();

    if (!novoNome) {
        const modalErroEl = document.getElementById('modalEmailErro');
        const textoModal = document.getElementById('modalText');
        if (textoModal) textoModal.innerText = 'O nome não pode estar vazio.';
        if (modalErroEl) new bootstrap.Modal(modalErroEl).show();
        return;
    }

    try {
        const response = await fetch(`/api/admin/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: novoNome })
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            modalEditarNomeInstance.hide(); // Fecha o modal de edição
            mostrarSucesso('Nome atualizado com sucesso!'); // Abre o modal verde
            carregarUsuarios(); // Atualiza a tabela
        } else {
            alert(data.mensagem || 'Erro ao atualizar o nome.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao se conectar ao servidor.');
    }
}

// === 2. LÓGICA DE EXCLUSÃO ===
function deletarUsuario(id) {
    if (!modalConfirmarDelecaoInstance) {
        modalConfirmarDelecaoInstance = new bootstrap.Modal(document.getElementById('modalConfirmarDelecao'));
    }
    // Salva o ID no input invisível e abre o modal vermelho
    document.getElementById('deleteAdminId').value = id;
    modalConfirmarDelecaoInstance.show();
}

async function executarDelecaoUsuario() {
    const id = document.getElementById('deleteAdminId').value;

    try {
        const response = await fetch(`/api/admin/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.sucesso) {
            modalConfirmarDelecaoInstance.hide(); // Fecha o modal de alerta vermelho
            mostrarSucesso('Cadastro removido com sucesso!'); // Abre o modal verde
            carregarUsuarios(); // Atualiza a tabela
        } else {
            alert(data.mensagem || 'Erro ao excluir cadastro.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao se conectar ao servidor.');
    }
}

async function alternarAdmin(id, isAdmin) {
    try {
        const response = await fetch(`/api/admin/usuarios/${id}/admin`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAdmin })
        });
        const data = await response.json();
        if(!data.sucesso) {
            alert('Erro ao alterar permissões de administrador.');
            carregarUsuarios();
        }
    } catch(error) {
        console.error(error);
    }
}

async function executarAdicionarAdmin() {
    const nome = document.getElementById('novoAdminNome').value.trim();
    const usuario = document.getElementById('novoAdminEmail').value.trim();
    const senha = document.getElementById('novoAdminSenha').value;
    const isAdmin = document.getElementById('novoAdminIsAdmin').checked;

    if (!usuario || !senha) {
        alert('O E-mail e a palavra-passe são obrigatórios!');
        return;
    }

    if (senha.length < 6) {
        alert('A palavra-passe deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        const response = await fetch('/api/admin/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, usuario, senha, isAdmin })
        });

        const data = await response.json();

        if (data.sucesso) {
            // Fecha o modal de adicionar
            const modalEl = document.getElementById('modalAdicionarAdmin');
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
            
            // Limpa os campos do formulário para a próxima vez
            document.getElementById('formAdicionarAdmin').reset();
            
            // Mostra o sucesso e recarrega a tabela
            mostrarSucesso('Novo administrador adicionado com sucesso!');
            carregarUsuarios();
        } else {
            alert(data.mensagem || 'Erro ao adicionar administrador.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao ligar ao servidor.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarPainel();

    const corpoUsuarios = document.getElementById('corpoTabelaUsuarios');
    if (corpoUsuarios) {
        carregarUsuarios();
    }

    
    document.getElementById('btnSalvarNomeAdmin')?.addEventListener('click', executarAtualizacaoNome);
    document.getElementById('btnConfirmarDelecao')?.addEventListener('click', executarDelecaoUsuario);
    
    
    document.getElementById('btnSalvarNovoAdmin')?.addEventListener('click', executarAdicionarAdmin);
});
const senha = document.getElementById('senha');
const formCriar = document.getElementById('form-criar');
const spinner = document.getElementById('spinner');
const btnCriar = document.getElementById('btn-criar');
const btnText = document.getElementById('btn-text');

const modalSucessoEl = document.getElementById('modalSucessoPainel');
const modalErroEl = document.getElementById('modalEmailErro');
const modalSucesso = modalSucessoEl ? new bootstrap.Modal(modalSucessoEl) : null;
const modalErro = modalErroEl ? new bootstrap.Modal(modalErroEl) : null;



function mostrarModalSucesso(texto) {
    const el = document.getElementById('modalSucessoText');
    if (el) el.innerText = texto;
    modalSucesso?.show();
}

function mostrarModalErro(texto) {
    const el = document.getElementById('modalText');
    if (el) el.innerText = texto;
    modalErro?.show();
}

function setLoading(ativo) {
    btnCriar.disabled = ativo;
    if (btnText) btnText.textContent = ativo ? 'Criando Usuário...' : 'Criar Usuário';
    spinner?.classList.toggle('d-none', !ativo);
}

function extrairMensagemErro(corpo) {
    if (corpo?.erros?.length) {
        return corpo.erros.map((e) => e.message ?? e).join('\n');
    }
    return corpo?.mensagem ?? 'Houve um erro ao processar seu pedido. Tente novamente.';
}



async function handleResposta(resposta) {
    if (resposta.ok) {
        mostrarModalSucesso('Usuário criado com sucesso!');
        formCriar.reset();
        setTimeout(() => { globalThis.location.href = '/'; }, 2000);
        return;
    }

    const corpo = await resposta.json().catch(() => null);

    if (resposta.status === 409) {
        mostrarModalErro('Este usuário já está cadastrado.');
        return;
    }

   
    if (resposta.status === 400) {
        mostrarModalErro(extrairMensagemErro(corpo));
        return;
    }

    throw new Error(corpo?.mensagem ?? 'Erro ao salvar no servidor');
}



async function criarDados() {
    setLoading(true);

    const dadosUsuario = {
        usuario: document.getElementById('usuario').value,
        senha: senha.value,
    };

    try {
        const resposta = await fetch('/api/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario),
        });

        await handleResposta(resposta);
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarModalErro('Houve um erro ao processar seu pedido. Tente novamente.');
    } finally {
        setLoading(false);
    }
}



formCriar.addEventListener('submit', function (event) {
    event.preventDefault();
    criarDados();
});
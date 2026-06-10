const modalEmailSucessoEl = document.getElementById('modalEmailSucesso');
const modalEmailErroEl = document.getElementById('modalEmailErro');
const modalEmailSucesso = modalEmailSucessoEl ? new bootstrap.Modal(modalEmailSucessoEl) : null;
const modalEmailErro = modalEmailErroEl ? new bootstrap.Modal(modalEmailErroEl) : null;

function mostrarModalSucesso(mensagem) {
    const el = document.getElementById('modalEmailSucessoText');
    if (el) el.innerText = mensagem;
    modalEmailSucesso?.show();
}

function mostrarModalErro(mensagem) {
    const el = document.getElementById('modalText');
    if (el) el.innerText = mensagem;
    modalEmailErro?.show();
}

document.getElementById('enviar').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('e-mail').value;
    const botao = document.getElementById('botao');

    botao.innerText = 'Enviando...';
    botao.disabled = true;

    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const corpo = await response.json().catch(() => null);
        const mensagem = corpo?.mensagem ?? (response.ok ? 'Inscrição realizada com sucesso!' : 'Houve um erro. Tente novamente.');

        if (response.ok) {
            mostrarModalSucesso(mensagem);
        } else {
            mostrarModalErro(mensagem);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        mostrarModalErro('Erro de conexão. Tente novamente.');
    } finally {
        botao.innerText = 'Se Inscreva';
        botao.disabled = false;
    }
});
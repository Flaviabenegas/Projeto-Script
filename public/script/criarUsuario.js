const senha = document.getElementById('senha');
const formCriar = document.getElementById('form-criar');
const spinner = document.getElementById('spinner');
const btnCriar = document.getElementById('btn-criar');
const btnText = document.getElementById('btn-text');

const modalSucessoEl = document.getElementById('modalSucessoPainel');
const modalErroEl = document.getElementById('modalEmailErro');
const modalSucesso = modalSucessoEl ? new bootstrap.Modal(modalSucessoEl) : null;
const modalErro = modalErroEl ? new bootstrap.Modal(modalErroEl) : null;

async function criarDados() {
    btnCriar.disabled = true;
    if (btnText) btnText.textContent = 'Criando Usuário...';
    if (spinner) spinner.classList.remove('d-none');

    const dadosUsuario = {
        usuario: document.getElementById('usuario').value,
        senha: senha.value,
    };


    try {
        const resposta = await fetch('/api/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        });

        if (resposta.ok) {
            const textoSucesso = document.getElementById('modalSucessoText');
            if (textoSucesso) textoSucesso.innerText = 'Usuário criado com sucesso!';
            if (modalSucesso) modalSucesso.show();
            formCriar.reset();
            setTimeout(() => {
                globalThis.location.href = '/';
            }, 2000);

        } else if (resposta.status === 409) {
            const textoModal = document.getElementById('modalText');
            if (textoModal) textoModal.innerText = 'Este usuário já está cadastrado.';
            if (modalErro) modalErro.show();

        } else {
            throw new Error('Erro ao salvar no servidor');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        const textoModal = document.getElementById('modalText');
        if (textoModal) textoModal.innerText = 'Houve um erro ao processar seu pedido. Tente novamente.';
        if (modalErro) modalErro.show();
    } finally {
        btnCriar.disabled = false;
        if (btnText) btnText.textContent = 'Criar Usuário';
        if (spinner) spinner.classList.add('d-none');
    }
}

formCriar.addEventListener('submit', function (event) {
    event.preventDefault();
    criarDados();
});
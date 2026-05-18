const login = document.getElementById('btn-login');
const senha = document.getElementById('senha');
const emailform = document.getElementById('email') || document.getElementById('email-login');
const textoErro = document.getElementById('modalText');
const painelLogin = document.getElementById('loginPainel');
const loader = document.getElementById('loader'); 

if (login && emailform && senha) {
    
    const modalEmailErroEl = document.getElementById('modalEmailErro');
    const modalSucessoPainelEl = document.getElementById('modalSucessoPainel');
    
    const modalEmailErro = modalEmailErroEl ? new bootstrap.Modal(modalEmailErroEl) : null;
    const modalSucessoPainel = modalSucessoPainelEl ? new bootstrap.Modal(modalSucessoPainelEl) : null;

    login.addEventListener('click', (e) => {
        e.preventDefault();
        
       const credenciais = {
    usuario: emailform.value.trim(),
    senha: senha.value
};

fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais)
})
.then(resposta => resposta.json()) 
.then(dados => {
    if (dados.sucesso) {
        if (loader) {
            loader.classList.remove('d-none');
            setTimeout(() => loader.classList.add('opacity-100'), 10);
        }
        setTimeout(() => {
            loader.classList.add('d-none');
            modalSucessoPainel?.show();
            painelLogin?.reset();
            setTimeout(() => { window.location.href = '/painel'; }, 2000);
        }, 2000);
    } else {
        textoErro.innerText = dados.mensagem || 'Email ou senha incorretos.';
        modalEmailErro?.show();
    }
})
.catch(erro => {
    console.error('Erro na comunicação:', erro);
    textoErro.innerText = 'Erro ao conectar com o servidor.';
    modalEmailErro?.show();
});
    })}
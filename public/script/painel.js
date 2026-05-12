const spinner = document.getElementById('spinner')
const login = document.getElementById('btn-login')
const senha = document.getElementById('senha')
const emailform = document.getElementById('email')
const textoErro = document.getElementById('modalText')
const modalEmailErro = new bootstrap.Modal(document.getElementById('modalEmailErro'));
const modalSucessoPainel = new bootstrap.Modal(document.getElementById('modalSucessoPainel'));
const painelLogin = document.getElementById('loginPainel');


login.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("Email digitado:", emailform.value);
    console.log("Senha digitada:", senha.value);
    if (emailform.value.trim() === "teste@teste" && senha.value === "teste") {
        login.disabled = true;
        login.innerText = "Aguarde...";
        spinner.classList.remove('d-none');
        setTimeout(() => {
            spinner.classList.remove('opacity-0');
            spinner.classList.add('opacity-100');
        }, 10);
        setTimeout(() => {
            modalSucessoPainel.show();
            painelLogin.reset();
            window.location.href = 'painel.html';

        }, 2500);

    } else {
        textoErro.innerText = "Email ou senha incorretos. Por favor, tente novamente.";
        modalEmailErro.show();
    }
})
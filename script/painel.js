const spinner = document.getElementById('spinner')
const login = document.getElementById('btn-login')
const senha = document.getElementById('senha')
const email = document.getElementById('email')

login.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("Email digitado:", email.value);
    console.log("Senha digitada:", senha.value);
    if (email.value.trim() === "teste@teste.com" && senha.value === "teste") {
        login.disabled = true;
        login.innerText = "Aguarde...";
        spinner.classList.remove('d-none');
        setTimeout(() => {
            spinner.classList.remove('opacity-0');
            spinner.classList.add('opacity-100');
        }, 10);
        setTimeout(() => {
            window.location.href = "painel.html";
        }, 2500);

    } else {
        alert("Dados incorretos!");
    }
})
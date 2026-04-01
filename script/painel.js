const spinner = document.getElementById('spinner')
const login = document.getElementById('btn-login')
const senha = document.getElementById('senha')
const emailform = document.getElementById('email')

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
            window.location.href = "painel.html";
        }, 2500);

    } else {
        alert("Dados incorretos!");
    }
})
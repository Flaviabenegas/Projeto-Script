const login = document.getElementById('btn-login')
const senha = document.getElementById('senha')
const email = document.getElementById('email')

login.addEventListener('click', (e) => {
    e.preventDefault()

    if (email.value === "teste@teste.com" && senha.value === "teste") {
        login.disabled = true;
        login.innerText = "Aguarde...";
        loader.classList.remove('d-none');
        setTimeout(() => {
            loader.classList.remove('opacity-0');
            loader.classList.add('opacity-100');
        }, 10);
        setTimeout(() => {
            window.location.href = "painel.html";
        }, 2500);

    } else {
        alert("Dados incorretos!");
    }
})
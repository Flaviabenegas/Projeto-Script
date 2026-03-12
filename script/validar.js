const comprar = document.getElementById('btn-comprar');
const btnText = document.getElementById('btn-text');
const inputCpf = document.getElementById('cpf');
const loader = document.getElementById('loader');

comprar.addEventListener('click', (e) => {
    e.preventDefault();
    const ehValido = validarCPF(inputCpf.value);

    if (ehValido) {
        comprar.disabled = true;
        btnText.innerText = "Processando...";
        loader.classList.remove('d-none');
        setTimeout(() => {
            alert('Pedido enviado com sucesso! 🎉');
            //inserir lógica do envio de formulário
        }, 2000);

    } else {
        alert('CPF Inválido. Por favor, verifique os dados. ❌');
        inputCpf.focus();
    }
});


function validarCPF(cpfDigitado) {
    const cpfLimpo = String(cpfDigitado).replace(/[^\d]+/g, '');
    if (cpfLimpo.length !== 11 || !!cpfLimpo.match(/(\d)\1{10}/)) return false;
    const cpfsplit = cpfLimpo.split('').map(el => +el);
    const rest = (count) => {
        return (((cpfsplit
            .slice(0, count - 12)
            .reduce((soma, el, index) => (soma + el * (count - index)), 0)
        ) * 10) % 11) % 10;
    };
    return rest(10) === cpfsplit[9] && rest(11) === cpfsplit[10];
}
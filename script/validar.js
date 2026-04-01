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
            //aqui vai a lógica do meu formulário quando for enviar para o backend.
        }, 2000);

    } else {
        alert('CPF Inválido. Por favor, verifique os dados. ❌');
        inputCpf.focus();
    }
});


function validarCPF(cpfDigitado) {

    const cpfLimpo = String(cpfDigitado).replace(/[^\d]+/g, '');
    if (cpfLimpo.length !== 11 || !!cpfLimpo.match(/(\d)\1{10}/)) return false;

    const cpfsplit = cpfLimpo.split('').map(Number);
    const novePrimeiros = cpfsplit.slice(0, 9);

    let somaB1 = 0;
    for (let i = 0; i < 9; i++) {
        somaB1 += novePrimeiros[i] * (i + 1);
    }
    let b1 = somaB1 % 11;
    if (b1 === 10) b1 = 0;
    let somaB2 = 0;
    for (let i = 0; i < 9; i++) {
        somaB2 += novePrimeiros[i] * (9 - i);
    }
    let b2 = somaB2 % 11;
    if (b2 === 10) b2 = 0;
    return b1 === cpfsplit[9] && b2 === cpfsplit[10];
}
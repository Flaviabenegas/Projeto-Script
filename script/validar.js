
const formPedido = document.getElementById('formPedido');
const btnComprar = document.getElementById('btn-comprar');
const btnText = document.getElementById('btn-text');
const inputCpf = document.getElementById('cpf');
const loader = document.getElementById('loader');

const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
const modalErroCep = new bootstrap.Modal(document.getElementById('modalErro'));


document.addEventListener("DOMContentLoaded", () => {

    const inputQtdCao = document.getElementById('qtdCao');
    const inputQtdGato = document.getElementById('qtdGato');
    const inputValorTotal = document.getElementById('valorTotal');
    const precoUnitario = 15.00;
    inputQtdCao.value = 0;
    inputQtdGato.value = 0;
    inputValorTotal.value = (0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function atualizarValorTotal() {

        let qtdCao = parseInt(inputQtdCao.value);
        let qtdGato = parseInt(inputQtdGato.value);

        if (isNaN(qtdCao) || qtdCao < 0) qtdCao = 0;
        if (isNaN(qtdGato) || qtdGato < 0) qtdGato = 0;


        const totalPlacas = qtdCao + qtdGato;


        const valorTotal = totalPlacas * precoUnitario;


        inputValorTotal.value = valorTotal.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    inputQtdCao.addEventListener('input', atualizarValorTotal);
    inputQtdGato.addEventListener('input', atualizarValorTotal);


    const form = document.getElementById('formPedido');
    if (form) {
        form.addEventListener('submit', (event) => {
            let totalPedidos = (parseInt(inputQtdCao.value) || 0) + (parseInt(inputQtdGato.value) || 0);
            if (totalPedidos === 0) {
                event.preventDefault();
                alert('Você precisa pedir pelo menos 1 plaquinha (Cão ou Gato) para continuar!');


                const spinner = document.getElementById('spinner');
                if (spinner && !spinner.classList.contains('d-none')) {
                    spinner.classList.add('d-none');
                }
            }
        });
    }
});




function resetarQuantidade() {
    if (parseInt(inputQuantidade.value) === 2) {
        inputQuantidade.value = 1;
        inputQuantidade.dispatchEvent(new Event('input'));
    }
}


formPedido.addEventListener('submit', (e) => {

    e.preventDefault();

    const ehValido = validarCPF(inputCpf.value);

    if (ehValido) {
        btnComprar.disabled = true;
        btnText.innerText = "Processando...";
        loader.classList.remove('d-none');

        setTimeout(() => {
            loader.classList.add('d-none');
            btnComprar.disabled = false;
            btnText.innerText = "ENVIAR PEDIDO";

            modalSucesso.show();
            formPedido.reset();

        }, 2000);

    } else {
        modalErro.show();
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
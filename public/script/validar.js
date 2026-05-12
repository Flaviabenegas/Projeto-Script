document.addEventListener("DOMContentLoaded", () => {


    const formPedido = document.getElementById('formPedido');
    const btnComprar = document.getElementById('btn-comprar');
    const btnText = document.getElementById('btn-text');
    const inputCpf = document.getElementById('cpf');
    const loader = document.getElementById('loader');
    const textoModal = document.getElementById('modalText');
    const inputQtdCao = document.getElementById('qtdCao');
    const inputQtdGato = document.getElementById('qtdGato');
    const inputValorTotal = document.getElementById('valorTotal');


    const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
    const modalErro = new bootstrap.Modal(document.getElementById('modalErro'));


    const precoUnitario = 15.00;
    inputQtdCao.value = 0;
    inputQtdGato.value = 0;

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

    atualizarValorTotal();

    inputQtdCao.addEventListener('input', atualizarValorTotal);
    inputQtdGato.addEventListener('input', atualizarValorTotal);


    if (formPedido) {
        formPedido.addEventListener('submit', (event) => {
            event.preventDefault();


            let totalPedidos = (parseInt(inputQtdCao.value) || 0) + (parseInt(inputQtdGato.value) || 0);

            if (totalPedidos === 0) {
                textoModal.innerText = "Você precisa pedir pelo menos 1 plaquinha para continuar.";
                modalErro.show();

                const spinner = document.getElementById('spinner');
                if (spinner && !spinner.classList.contains('d-none')) {
                    spinner.classList.add('d-none');
                }
                return;
            }


            const ehValido = validarCPF(inputCpf.value);

            if (!ehValido) {
                textoModal.innerText = "CPF inválido. Por favor, verifique os números digitados.";
                modalErro.show();
                inputCpf.focus();
                return;
            }


            btnComprar.disabled = true;
            btnText.innerText = "Processando...";
            loader.classList.remove('d-none');

            setTimeout(() => {
                loader.classList.add('d-none');
                btnComprar.disabled = false;
                btnText.innerText = "ENVIAR PEDIDO";

                modalSucesso.show();
                formPedido.reset();
                atualizarValorTotal();
            }, 2000);
        });
    }
});


function validarCPF(cpfDigitado) {
    const cpfLimpo = String(cpfDigitado).replace(/[^\d]+/g, '');

    if (cpfLimpo.length !== 11) return false;
    if (!!cpfLimpo.match(/(\d)\1{10}/)) return false;

    const cpfsplit = cpfLimpo.split('').map(Number);

    let somaB1 = 0;
    for (let i = 0; i < 9; i++) {
        somaB1 += cpfsplit[i] * (i + 1);
    }
    let b1 = somaB1 % 11;
    if (b1 === 10) b1 = 0;

    let somaB2 = 0;
    for (let i = 0; i < 9; i++) {
        somaB2 += cpfsplit[i] * (9 - i);
    }
    let b2 = somaB2 % 11;
    if (b2 === 10) b2 = 0;

    return b1 === cpfsplit[9] && b2 === cpfsplit[10];
}
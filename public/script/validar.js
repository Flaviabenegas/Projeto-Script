document.addEventListener("DOMContentLoaded", () => {
    const formPedido = document.getElementById('formPedido');
    const btnComprar = document.getElementById('btn-comprar');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('spinner');
    const inputCpf = document.getElementById('cpf');
    const inputQtdCao = document.getElementById('qtdCao');
    const inputQtdGato = document.getElementById('qtdGato');
    const valorFreteInput = document.getElementById('valorFrete');
    const inputValorTotal = document.getElementById('valorTotal');
    
    const modalSucesso = document.getElementById('modalSucesso') ? new bootstrap.Modal(document.getElementById('modalSucesso')) : null;
    const modalErro = document.getElementById('modalErro') ? new bootstrap.Modal(document.getElementById('modalErro')) : null;

    const precoUnitario = 15.00;
   
    // Zera os inputs iniciais (se eles existirem)
    if (inputQtdCao) inputQtdCao.value = 0; 
    if (inputQtdGato) inputQtdGato.value = 0;
    if (inputValorTotal) inputValorTotal.value = 0;

    // 1. PRIMEIRO DECLARAMOS A FUNÇÃO
    function atualizarValorTotal() {
        let qtdCao = parseInt(inputQtdCao.value) || 0;
        let qtdGato = parseInt(inputQtdGato.value) || 0;

        if (qtdCao < 0) qtdCao = 0;
        if (qtdGato < 0) qtdGato = 0;

        const totalPlacas = qtdCao + qtdGato;
        
        let valorFrete = 0;
        if (valorFreteInput && valorFreteInput.value) {
            valorFrete = parseFloat(valorFreteInput.value.replace(',', '.'));
            if (isNaN(valorFrete)) valorFrete = 0;
        }

        const valorTotal = (totalPlacas * precoUnitario) + valorFrete;

        if (inputValorTotal) {
            inputValorTotal.value = valorTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }
 
    // 2. DEPOIS ADICIONAMOS OS EVENTOS COM SEGURANÇA
    if (inputQtdCao) inputQtdCao.addEventListener('input', atualizarValorTotal);
    if (inputQtdGato) inputQtdGato.addEventListener('input', atualizarValorTotal);
    if (valorFreteInput) {
        valorFreteInput.addEventListener('input', atualizarValorTotal);
        valorFreteInput.addEventListener('change', atualizarValorTotal);
    }

    // 3. FAZEMOS A PRIMEIRA ATUALIZAÇÃO DA TELA
    atualizarValorTotal();

    // 4. LÓGICA DE ENVIO DO FORMULÁRIO
    if (formPedido) {
        formPedido.addEventListener('submit', async (event) => {
            event.preventDefault(); 
    
            let totalPedidos = (parseInt(inputQtdCao.value) || 0) + (parseInt(inputQtdGato.value) || 0);
            if (totalPedidos === 0) {
                const textoModal = document.getElementById('modalText');
                if (textoModal) textoModal.innerText = "Você precisa pedir pelo menos 1 plaquinha para continuar.";
                if (modalErro) modalErro.show();
                return;
            }

            const ehValido = validarCPF(inputCpf.value);
            if (!ehValido) {
                const textoModal = document.getElementById('modalText');
                if (textoModal) textoModal.innerText = "CPF inválido. Por favor, verifique os números digitados.";
                if (modalErro) modalErro.show();
                inputCpf.focus();
                return;
            }

            btnComprar.disabled = true;
            if (btnText) btnText.textContent = 'ENVIANDO...';
            if (spinner) spinner.classList.remove('d-none');

            const dadosDoPedido = {
                nome: document.getElementById('nome').value,
                cpf: inputCpf.value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('form-email').value,
                cep: document.getElementById('cep').value,
                logradouro: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                uf: document.getElementById('uf').value,
                qtdCao: parseInt(inputQtdCao.value),
                qtdGato: parseInt(inputQtdGato.value),
                valorTotal: inputValorTotal.value, // Vai enviar como string (ex: "30,00")
                nomePets: document.getElementById('nomePets').value,
                telGravacao: document.getElementById('telGravacao').value,
                valorFrete: valorFreteInput.value ? parseFloat(valorFreteInput.value.replace(',', '.')) : 0
            };

            try {
                const resposta = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDoPedido)
                });

                if (resposta.ok) {
                    if (modalSucesso) modalSucesso.show();
                    formPedido.reset();     
                    atualizarValorTotal(); 
                } else {
                    throw new Error('Erro ao salvar no servidor');
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                const textoModal = document.getElementById('modalText');
                if (textoModal) textoModal.innerText = "Houve um erro ao processar seu pedido. Tente novamente.";
                if (modalErro) modalErro.show();
            } finally {
                btnComprar.disabled = false;
                if (btnText) btnText.textContent = 'ENVIAR PEDIDO';
                if (spinner) spinner.classList.add('d-none');
            }
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
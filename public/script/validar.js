function validarCPF(cpfDigitado) {
	const cpfLimpo = String(cpfDigitado).replace(/[^\d]+/g, '');

	if (cpfLimpo.length !== 11) return false;
	if (/(\d)\1{10}/.exec(cpfLimpo)) return false;

	const cpfsplit = cpfLimpo.split('').map(Number);

	let somaB1 = 0;
	for (let i = 0; i < 9; i++) somaB1 += cpfsplit[i] * (i + 1);
	let b1 = somaB1 % 11;
	if (b1 === 10) b1 = 0;

	let somaB2 = 0;
	for (let i = 0; i < 9; i++) somaB2 += cpfsplit[i] * (9 - i);
	let b2 = somaB2 % 11;
	if (b2 === 10) b2 = 0;

	return b1 === cpfsplit[9] && b2 === cpfsplit[10];
}

function mostrarErro(modalErro, mensagem) {
	const textoModal = document.getElementById('modalErroTexto');
	if (textoModal) textoModal.innerText = mensagem;
	if (modalErro) modalErro.show();
}

function calcularFrete(valorFreteInput) {
	if (!valorFreteInput?.value) return 0;
	const valor = Number.parseFloat(valorFreteInput.value.replace(',', '.'));
	return Number.isNaN(valor) ? 0 : valor;
}

function coletarDadosPedido(inputQtdCao, inputQtdGato, inputValorTotal, valorFreteInput) {
	return {
		nome: document.getElementById('nome').value,
		cpf: document.getElementById('cpf').value,
		telefone: document.getElementById('telefone').value,
		email: document.getElementById('form-email').value,
		cep: document.getElementById('cep').value,
		logradouro: document.getElementById('logradouro').value,
		numero: document.getElementById('numero').value,
		complemento: document.getElementById('complemento').value,
		bairro: document.getElementById('bairro').value,
		cidade: document.getElementById('cidade').value,
		uf: document.getElementById('uf').value,
		qtdCao: Number.parseInt(inputQtdCao.value),
		qtdGato: Number.parseInt(inputQtdGato.value),
		valorTotal: inputValorTotal.value,
		nomePets: document.getElementById('nomePets').value,
		telGravacao: document.getElementById('telGravacao').value,
		valorFrete: calcularFrete(valorFreteInput),
	};
}

function mostrarSucesso(modalSucesso, formPedido, atualizarValorTotal) {
	const textoModal = document.getElementById('modalSucessoTexto');
	if (textoModal) textoModal.innerText = 'Seu pedido foi enviado com sucesso! Em breve entraremos em contato. 🐾';

	const elModal = document.getElementById('modalSucesso');
	elModal.addEventListener('hidden.bs.modal', () => {
		globalThis.location.href = '/';
	}, { once: true });

	if (modalSucesso) modalSucesso.show();
	formPedido.reset();
	atualizarValorTotal();
}

function setBtnEstado(btnComprar, btnText, spinner, enviando) {
	btnComprar.disabled = enviando;
	if (btnText) btnText.textContent = enviando ? 'ENVIANDO...' : 'ENVIAR PEDIDO';
	if (spinner) spinner.classList.toggle('d-none', !enviando);
}


document.addEventListener('DOMContentLoaded', () => {
	const formPedido = document.getElementById('formPedido');
	const btnComprar = document.getElementById('btn-comprar');
	const btnText = document.getElementById('btn-text');
	const spinner = document.getElementById('spinner');
	const inputCpf = document.getElementById('cpf');
	const inputQtdCao = document.getElementById('qtdCao');
	const inputQtdGato = document.getElementById('qtdGato');
	const valorFreteInput = document.getElementById('valorFrete');
	const inputValorTotal = document.getElementById('valorTotal');

	const modalSucesso = document.getElementById('modalSucesso')
		? new bootstrap.Modal(document.getElementById('modalSucesso'))
		: null;
	const modalErro = document.getElementById('modalErro')
		? new bootstrap.Modal(document.getElementById('modalErro'))
		: null;

	const precoUnitario = 15;

	if (inputQtdCao) inputQtdCao.value = 0;
	if (inputQtdGato) inputQtdGato.value = 0;
	if (inputValorTotal) inputValorTotal.value = 0;

	function atualizarValorTotal() {
		let qtdCao = Number.parseInt(inputQtdCao.value) || 0;
		let qtdGato = Number.parseInt(inputQtdGato.value) || 0;

		if (qtdCao < 0) qtdCao = 0;
		if (qtdGato < 0) qtdGato = 0;

		const totalPlacas = qtdCao + qtdGato;
		const valorFrete = calcularFrete(valorFreteInput);
		const valorTotal = totalPlacas * precoUnitario + valorFrete;

		if (inputValorTotal) {
			inputValorTotal.value = valorTotal.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
	}

	if (inputQtdCao) inputQtdCao.addEventListener('input', atualizarValorTotal);
	if (inputQtdGato) inputQtdGato.addEventListener('input', atualizarValorTotal);
	if (valorFreteInput) {
		valorFreteInput.addEventListener('input', atualizarValorTotal);
		valorFreteInput.addEventListener('change', atualizarValorTotal);
	}

	atualizarValorTotal();

	function validarFormulario() {
		const totalPedidos =
			(Number.parseInt(inputQtdCao.value) || 0) + (Number.parseInt(inputQtdGato.value) || 0);

		if (totalPedidos === 0) {
			mostrarErro(modalErro, 'Você precisa pedir pelo menos 1 plaquinha para continuar.');
			return false;
		}

		if (!validarCPF(inputCpf.value)) {
			mostrarErro(modalErro, 'CPF inválido. Por favor, verifique os números digitados.');
			inputCpf.focus();
			return false;
		}

		return true;
	}

	if (formPedido) {
		formPedido.addEventListener('submit', async (event) => {
			event.preventDefault();

			if (!validarFormulario()) return;

			setBtnEstado(btnComprar, btnText, spinner, true);

			const dadosDoPedido = coletarDadosPedido(inputQtdCao, inputQtdGato, inputValorTotal, valorFreteInput);

			try {
				const resposta = await fetch('/api/pedidos', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(dadosDoPedido),
				});

				if (resposta.ok) {
					mostrarSucesso(modalSucesso, formPedido, atualizarValorTotal);
				} else {
					throw new Error('Erro ao salvar no servidor');
				}
			} catch (error) {
				console.error('Erro na requisição:', error);
				mostrarErro(modalErro, 'Houve um erro ao processar seu pedido. Tente novamente.');
			} finally {
				setBtnEstado(btnComprar, btnText, spinner, false);
			}
		});
	}
});
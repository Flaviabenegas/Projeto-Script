const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const buscarCEPBtn = document.getElementById('buscarCep');
const ufInput = document.getElementById('uf');
const textoModal = document.getElementById('modalText');
const valorFreteInput = document.getElementById('valorFrete');

const modalErro = new bootstrap.Modal(document.getElementById('modalEmailErro'));

buscarCEPBtn.addEventListener('click', async (e) => {
	e.preventDefault();

	const cep = cepInput.value.replace(/\D/g, '');

	if (cep.length !== 8) {
		textoModal.innerText = 'CEP inválido. O CEP deve conter 8 dígitos numéricos.';
		modalErro.show();
		return;
	}

	try {
		buscarCEPBtn.innerText = 'Buscando...';
		buscarCEPBtn.disabled = true;

		const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);

		if (response.status === 404) {
			textoModal.innerText = 'CEP não encontrado. Verifique se o número foi digitado corretamente.';
			modalErro.show();
			limparCamposEndereco();
			cepInput.focus();
			return;
		}

		if (!response.ok) throw new Error('Erro na API');

		const data = await response.json();

		logradouroInput.value = data.street || '';
		bairroInput.value = data.neighborhood || '';
		cidadeInput.value = data.city || '';
		ufInput.value = data.state || '';
		if (data.city != 'Mogi Mirim' && data.city != 'Mogi Guaçu') {
			valorFreteInput.value = Number.parseFloat('25,00'.replace(',', '.')).toFixed(2);
		} else {
			valorFreteInput.value = Number.parseFloat('0,00'.replace(',', '.')).toFixed(2);
		}
	} catch (error) {
		console.error('Erro na requisição:', error);

		textoModal.innerText = 'Houve uma falha ao buscar o CEP. Por favor, tente novamente.';
		modalErro.show();
		limparCamposEndereco();
		cepInput.focus();
	} finally {
		buscarCEPBtn.innerText = 'Buscar CEP';
		buscarCEPBtn.disabled = false;
	}
});

function limparCamposEndereco() {
	logradouroInput.value = '';
	bairroInput.value = '';
	cidadeInput.value = '';
	if (ufInput) ufInput.value = '';
}

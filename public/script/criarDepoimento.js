const formDepoimento = document.getElementById('form-depoimento');
const spinner = document.getElementById('spinner');
const btnEnviar = document.getElementById('btn-enviar');
const btnText = document.getElementById('btn-text');

const formEditarDepoimento = document.getElementById('form-editar-depoimento');
const editSpinner = document.getElementById('edit-spinner');
const btnSalvarEdicao = document.getElementById('btn-salvar-edicao');
const btnEditText = document.getElementById('btn-edit-text');

const modalSucessoEl = document.getElementById('modalSucessoPainel');
const modalErroEl = document.getElementById('modalEmailErro');
const modalEditarEl = document.getElementById('modalEditarDepoimento');

const modalSucesso = modalSucessoEl ? new bootstrap.Modal(modalSucessoEl) : null;
const modalErro = modalErroEl ? new bootstrap.Modal(modalErroEl) : null;
const modalEditar = modalEditarEl ? new bootstrap.Modal(modalEditarEl) : null;


async function enviarDepoimento() {
	btnEnviar.disabled = true;
	if (btnText) btnText.textContent = 'Enviando Depoimento...';
	if (spinner) spinner.classList.remove('d-none');

	const dadosDepoimento = {
		tutor: document.getElementById('tutor').value,
		pet: document.getElementById('pet').value,
		imagem: document.getElementById('imagem').value,
		alt: document.getElementById('alt').value,
		texto: document.getElementById('texto').value,
	};

	try {
		const resposta = await fetch('/api/depoimentos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dadosDepoimento)
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			const textoSucesso = document.getElementById('modalSucessoText');
			if (textoSucesso) textoSucesso.innerText = 'Depoimento enviado com sucesso!';
			if (modalSucesso) modalSucesso.show();
			formDepoimento.reset();
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			const mensagemErro = data.mensagem || 'Erro ao enviar o depoimento. Verifique os dados.';
			const textoModal = document.getElementById('modalText');
			if (textoModal) textoModal.innerText = mensagemErro;
			if (modalErro) modalErro.show();
		}
	} catch (error) {
		console.error('Erro na requisição:', error);
		const textoModal = document.getElementById('modalText');
		if (textoModal) textoModal.innerText = 'Houve um erro ao processar seu depoimento. Tente novamente.';
		if (modalErro) modalErro.show();
	} finally {
		btnEnviar.disabled = false;
		if (btnText) btnText.textContent = 'Enviar Depoimento 🐾';
		if (spinner) spinner.classList.add('d-none');
	}
}

if (formDepoimento) {
	formDepoimento.addEventListener('submit', function (event) {
		event.preventDefault();
		enviarDepoimento();
	});
}


window.abrirModalEdicao = function (id, tutor, pet, imagem, alt, texto) {
	document.getElementById('edit-id').value = id;
	document.getElementById('edit-tutor').value = tutor;
	document.getElementById('edit-pet').value = pet;
	document.getElementById('edit-imagem').value = imagem;
	document.getElementById('edit-alt').value = alt;
	document.getElementById('edit-texto').value = texto;

	if (modalEditar) {
		modalEditar.show();
	}
};


async function salvarEdicao() {
	const id = document.getElementById('edit-id').value;
	btnSalvarEdicao.disabled = true;
	if (btnEditText) btnEditText.textContent = 'Salvando Alterações...';
	if (editSpinner) editSpinner.classList.remove('d-none');

	const dadosEditados = {
		tutor: document.getElementById('edit-tutor').value,
		pet: document.getElementById('edit-pet').value,
		imagem: document.getElementById('edit-imagem').value,
		alt: document.getElementById('edit-alt').value,
		texto: document.getElementById('edit-texto').value,
	};

	try {
		const resposta = await fetch(`/api/depoimentos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dadosEditados)
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			if (modalEditar) modalEditar.hide();
			
			const textoSucesso = document.getElementById('modalSucessoText');
			if (textoSucesso) textoSucesso.innerText = 'Depoimento atualizado com sucesso!';
			if (modalSucesso) modalSucesso.show();

			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			const mensagemErro = data.mensagem || 'Erro ao atualizar o depoimento.';
			const textoModal = document.getElementById('modalText');
			if (textoModal) textoModal.innerText = mensagemErro;
			if (modalErro) modalErro.show();
		}
	} catch (error) {
		console.error('Erro na requisição de edição:', error);
		const textoModal = document.getElementById('modalText');
		if (textoModal) textoModal.innerText = 'Houve um erro ao salvar o depoimento. Tente novamente.';
		if (modalErro) modalErro.show();
	} finally {
		btnSalvarEdicao.disabled = false;
		if (btnEditText) btnEditText.textContent = 'Salvar Alterações 🐾';
		if (editSpinner) editSpinner.classList.add('d-none');
	}
}

if (formEditarDepoimento) {
	formEditarDepoimento.addEventListener('submit', function (event) {
		event.preventDefault();
		salvarEdicao();
	});
}


window.toggleStatus = async function (id) {
	const btnToggle = document.getElementById(`btn-toggle-${id}`);
	if (btnToggle) btnToggle.disabled = true;

	try {
		const resposta = await fetch(`/api/depoimentos/${id}/toggle`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' }
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			const badge = document.getElementById(`status-badge-${id}`);
			const isAtivo = data.ativo;

			
			if (badge) {
				badge.textContent = isAtivo ? 'Ativo' : 'Inativo';
				badge.className = `badge rounded-pill ${isAtivo ? 'bg-success' : 'bg-secondary'}`;
			}

			
			if (btnToggle) {
				btnToggle.className = `btn btn-sm ${isAtivo ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-3`;
				btnToggle.innerHTML = `<i class="bi ${isAtivo ? 'bi-eye-slash' : 'bi-eye'} me-1"></i>${isAtivo ? 'Desativar' : 'Ativar'}`;
			}
		} else {
			const mensagemErro = data.mensagem || 'Erro ao alternar o status do depoimento.';
			const textoModal = document.getElementById('modalText');
			if (textoModal) textoModal.innerText = mensagemErro;
			if (modalErro) modalErro.show();
		}
	} catch (error) {
		console.error('Erro na requisição de toggle:', error);
		const textoModal = document.getElementById('modalText');
		if (textoModal) textoModal.innerText = 'Houve um erro de rede. Tente novamente.';
		if (modalErro) modalErro.show();
	} finally {
		if (btnToggle) btnToggle.disabled = false;
	}
};

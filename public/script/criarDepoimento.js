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



function mostrarErro(mensagem) {
	const textoModal = document.getElementById('modalText');
	if (textoModal) textoModal.innerText = mensagem;
	if (modalErro) modalErro.show();
}

function mostrarSucesso(mensagem) {
	const textoSucesso = document.getElementById('modalSucessoText');
	if (textoSucesso) textoSucesso.innerText = mensagem;
	if (modalSucesso) modalSucesso.show();
}

function recarregarApos(ms = 2000) {
	setTimeout(() => globalThis.location.reload(), ms);
}

function setCarregando(btn, textEl, spinnerEl, textCarregando, label) {
	btn.disabled = true;
	if (textEl) textEl.textContent = textCarregando;
	if (spinnerEl) spinnerEl.classList.remove('d-none');

	return () => {
		btn.disabled = false;
		if (textEl) textEl.textContent = label;
		if (spinnerEl) spinnerEl.classList.add('d-none');
	};
}

function lerFormDepoimento(prefixo = '') {
	const id = (campo) => document.getElementById(`${prefixo}${campo}`)?.value ?? '';
	return {
		tutor: id('tutor'),
		pet: id('pet'),
		imagem: id('imagem'),
		alt: id('alt'),
		texto: id('texto'),
	};
}


async function enviarDepoimento() {
	const restaurar = setCarregando(btnEnviar, btnText, spinner, 'Enviando Depoimento...', 'Enviar Depoimento 🐾');

	try {
		const resposta = await fetch('/api/depoimentos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(lerFormDepoimento()),
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			mostrarSucesso('Depoimento enviado com sucesso!');
			formDepoimento.reset();
			recarregarApos();
		} else {
			mostrarErro(data.mensagem || 'Erro ao enviar o depoimento. Verifique os dados.');
		}
	} catch {
		mostrarErro('Houve um erro ao processar seu depoimento. Tente novamente.');
	} finally {
		restaurar();
	}
}

if (formDepoimento) {
	formDepoimento.addEventListener('submit', (e) => {
		e.preventDefault();
		enviarDepoimento();
	});
}



globalThis.abrirModalEdicao = function (id, tutor, pet, imagem, alt, texto) {
	const campos = { 'edit-id': id, 'edit-tutor': tutor, 'edit-pet': pet, 'edit-imagem': imagem, 'edit-alt': alt, 'edit-texto': texto };
	for (const [campo, valor] of Object.entries(campos)) {
		const el = document.getElementById(campo);
		if (el) el.value = valor;
	}
	if (modalEditar) modalEditar.show();
};


async function salvarEdicao() {
	const id = document.getElementById('edit-id').value;
	const restaurar = setCarregando(btnSalvarEdicao, btnEditText, editSpinner, 'Salvando Alterações...', 'Salvar Alterações 🐾');

	try {
		const resposta = await fetch(`/api/depoimentos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(lerFormDepoimento('edit-')),
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			if (modalEditar) modalEditar.hide();
			mostrarSucesso('Depoimento atualizado com sucesso!');
			recarregarApos();
		} else {
			mostrarErro(data.mensagem || 'Erro ao atualizar o depoimento.');
		}
	} catch {
		mostrarErro('Houve um erro ao salvar o depoimento. Tente novamente.');
	} finally {
		restaurar();
	}
}

if (formEditarDepoimento) {
	formEditarDepoimento.addEventListener('submit', (e) => {
		e.preventDefault();
		salvarEdicao();
	});
}



function atualizarBadge(id, isAtivo) {
	const badge = document.getElementById(`status-badge-${id}`);
	if (badge) {
		badge.textContent = isAtivo ? 'Ativo' : 'Inativo';
		badge.className = `badge rounded-pill ${isAtivo ? 'bg-success' : 'bg-secondary'}`;
	}
}

function atualizarBotaoToggle(btnToggle, isAtivo) {
	btnToggle.className = `btn btn-sm ${isAtivo ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-3`;
	btnToggle.innerHTML = `<i class="bi ${isAtivo ? 'bi-eye-slash' : 'bi-eye'} me-1"></i>${isAtivo ? 'Desativar' : 'Ativar'}`;
}

globalThis.toggleStatus = async function (id) {
	const btnToggle = document.getElementById(`btn-toggle-${id}`);
	if (btnToggle) btnToggle.disabled = true;

	try {
		const resposta = await fetch(`/api/depoimentos/${id}/toggle`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await resposta.json();

		if (resposta.ok && data.sucesso) {
			atualizarBadge(id, data.ativo);
			if (btnToggle) atualizarBotaoToggle(btnToggle, data.ativo);
		} else {
			mostrarErro(data.mensagem || 'Erro ao alternar o status do depoimento.');
		}
	} catch {
		mostrarErro('Houve um erro de rede. Tente novamente.');
	} finally {
		if (btnToggle) btnToggle.disabled = false;
	}
};
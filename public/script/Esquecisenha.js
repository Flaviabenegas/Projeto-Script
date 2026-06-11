document.addEventListener('DOMContentLoaded', () => {
	const modalEsqueciEl = document.getElementById('modalEsqueciSenha');
	const modalConfirmacaoEl = document.getElementById('modalSucesso');

	if (!modalEsqueciEl || !modalConfirmacaoEl) return;

	const formReset = document.getElementById('formEsqueciSenha');
	const btnSolicitar = document.getElementById('btn-solicitar-reset');
	const btnResetText = document.getElementById('btn-reset-text');
	const spinnerReset = document.getElementById('spinner-reset');
	const inputUsuario = document.getElementById('reset-usuario');
	const feedback1 = document.getElementById('reset-feedback-1');

	const modalEsqueci = new bootstrap.Modal(modalEsqueciEl);
	const modalConfirmacao = new bootstrap.Modal(modalConfirmacaoEl);

	let abrirConfirmacao = false;

	function setLoadingReset(ativo) {
		btnSolicitar.disabled = ativo;
		btnResetText.textContent = ativo ? 'Enviando...' : 'Enviar link';
		spinnerReset?.classList.toggle('d-none', !ativo);
	}

	function mostrarFeedback(msg) {
		feedback1.textContent = msg;
		feedback1.classList.remove('d-none');
	}

	function resetarModal() {
		inputUsuario.value = '';
		feedback1.classList.add('d-none');
		feedback1.textContent = '';
		setLoadingReset(false);
	}

	modalEsqueciEl.addEventListener('hidden.bs.modal', () => {
		if (abrirConfirmacao) {
			abrirConfirmacao = false;
			const textoSucesso = document.getElementById('modalSucessoTexto');
			if (textoSucesso)
				textoSucesso.innerText =
					'Um e-mail chegará em instantes se você estiver cadastrado em nosso banco de dados.';
			modalConfirmacao.show();
		}
		resetarModal();
	});

	formReset?.addEventListener('submit', async (event) => {
		event.preventDefault();

		feedback1.classList.add('d-none');

		if (!inputUsuario.checkValidity()) {
			inputUsuario.reportValidity();
			return;
		}

		const usuario = inputUsuario.value.trim();

		setLoadingReset(true);

		try {
			await fetch('/api/solicitar-reset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ usuario }),
			});

			abrirConfirmacao = true;
			modalEsqueci.hide();
		} catch {
			mostrarFeedback('Erro de conexão. Tente novamente.');
		} finally {
			setLoadingReset(false);
		}
	});
});

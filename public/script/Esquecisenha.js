
document.addEventListener('DOMContentLoaded', () => {
	const modalEsqueciEl     = document.getElementById('modalEsqueciSenha');
	const modalConfirmacaoEl = document.getElementById('modalResetEnviado');

	if (!modalEsqueciEl || !modalConfirmacaoEl) return;

	const btnSolicitar = document.getElementById('btn-solicitar-reset');
	const btnResetText = document.getElementById('btn-reset-text');
	const spinnerReset = document.getElementById('spinner-reset');
	const inputUsuario = document.getElementById('reset-usuario');
	const feedback1    = document.getElementById('reset-feedback-1');

	
	const modalEsqueci     = new bootstrap.Modal(modalEsqueciEl);
	const modalConfirmacao = new bootstrap.Modal(modalConfirmacaoEl);

	
	let abrirConfirmacao = false;

	function setLoadingReset(ativo) {
		btnSolicitar.disabled    = ativo;
		btnResetText.textContent = ativo ? 'Enviando...' : 'Enviar link';
		if (spinnerReset) spinnerReset.classList.toggle('d-none', !ativo);
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
			modalConfirmacao.show();
		}
		resetarModal();
	});

	btnSolicitar.addEventListener('click', async () => {
		const usuario = inputUsuario.value.trim();

		feedback1.classList.add('d-none');

		if (!usuario) {
			feedback1.textContent = 'Informe seu e-mail.';
			feedback1.classList.remove('d-none');
			return;
		}

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
			feedback1.textContent = 'Erro de conexão. Tente novamente.';
			feedback1.classList.remove('d-none');
			setLoadingReset(false);
		}
	});
});
document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('reset-container');

	if (!container) return;

	const token = container.dataset.token;
	const btnConfirmar = document.getElementById('btn-confirmar-reset');
	const btnText = document.getElementById('btn-confirmar-text');
	const spinner = document.getElementById('spinner-confirmar');
	const erroEl = document.getElementById('reset-erro');
	const formWrap = document.getElementById('form-reset-wrap');
	const sucessoEl = document.getElementById('reset-sucesso');

	if (!token) {
		erroEl.textContent = 'Link inválido. Solicite um novo.';
		erroEl.classList.remove('d-none');
		if (btnConfirmar) btnConfirmar.disabled = true;
		return;
	}

	function setLoading(ativo) {
		btnConfirmar.disabled = ativo;
		btnText.textContent = ativo ? 'Salvando...' : 'Salvar nova senha';
		spinner.classList.toggle('d-none', !ativo);
	}

	function mostrarErro(msg) {
		erroEl.textContent = msg;
		erroEl.classList.remove('d-none');
	}

	const modalSucessoEl = document.getElementById('modalSucesso');
	if (modalSucessoEl) {
		const instancia = bootstrap.Modal.getInstance(modalSucessoEl);
		instancia?.hide();
	}

	btnConfirmar.addEventListener('click', async () => {
		const novaSenha = document.getElementById('nova-senha').value;
		const confirmarSenha = document.getElementById('confirmar-senha').value;

		erroEl.classList.add('d-none');

		if (novaSenha.length < 6) {
			mostrarErro('A senha deve ter no mínimo 6 caracteres.');
			return;
		}

		if (novaSenha !== confirmarSenha) {
			mostrarErro('As senhas não coincidem.');
			return;
		}

		setLoading(true);

		try {
			const res = await fetch('/api/resetar-senha', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, novaSenha }),
			});

			const data = await res.json();

			if (res.ok) {
				formWrap.classList.add('d-none');
				sucessoEl.classList.remove('d-none');
				setTimeout(() => {
					globalThis.location.href = '/';
				}, 2500);
			} else {
				mostrarErro(data.mensagem ?? 'Erro ao alterar a senha. Tente novamente.');
				setLoading(false);
			}
		} catch {
			mostrarErro('Erro de conexão. Tente novamente.');
			setLoading(false);
		}
	});
});

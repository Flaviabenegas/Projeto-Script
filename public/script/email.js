document.getElementById('enviar').addEventListener('submit', async function (event) {
    event.preventDefault()

    
    const email = document.getElementById('e-mail').value
    const botao = document.getElementById('botao')
    const modalEmailSucesso = new bootstrap.Modal(document.getElementById('modalEmailSucesso'));
    const modalEmailErro = new bootstrap.Modal(document.getElementById('modalEmailErro'));

    botao.innerText = 'Enviando...'

    try {

        const response = await fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {

            modalEmailSucesso.show();
            botao.innerText = 'Se Inscreva'
        } else {

            modalEmailErro.show();
            botao.innerText = 'Se Inscreva'

        }
    } catch (error) {
        console.error('Erro de rede:', error)
        modalEmailErro.show();
        botao.innerText = 'Se Inscreva'
    }
})
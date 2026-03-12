document.getElementById('enviar').addEventListener('submit', async function (event) {
    event.preventDefault()

    //const nome = document.getElementById('nome').value
    const email = document.getElementById('e-mail').value
    const botao = document.getElementById('botao')

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

            window.location.href = '/sucesso.html'
        } else {

            window.location.href = '/falha.html'

        }
    } catch (error) {
        console.error('Erro de rede:', error)
        window.location.href = '/falha.html'
    }
})
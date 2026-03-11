exports.handler = async (event, context) => {
    // A Netlify Function só responde a requisições de API
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // Acessa os dados do corpo da requisição
        const { nome, email } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'E-mail é obrigatório.' }),
            };
        }

        const DATACENTER = process.env.DATACENTER;
        const LIST_ID = process.env.LIST_ID;
        const API_KEY = process.env.API_KEY;

        const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

        const data = {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: nome,
            },
        };

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (apiResponse.ok) {
            // Se a requisição foi bem-sucedida, retorne um sucesso com o código HTTP 200
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Inscrição realizada com sucesso!' }),
            };
        } else {
            // Se houve um erro da API, retorne o erro
            const errorData = await apiResponse.json();
            console.error('Erro da API:', errorData);
            return {
                statusCode: apiResponse.status,
                body: JSON.stringify(errorData),
            };
        }
    } catch (error) {
        console.error('Erro no servidor:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro no servidor. Tente novamente mais tarde.' }),
        };
    }
};
import session from 'express-session';

const sessionMiddleware = session({
	secret: 'chave-super-secreta-dos-focinhos', // Em produção, isto deve vir do ficheiro .env
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, // Coloque 'true' apenas se o seu site já tiver HTTPS (cadeado verde)
		maxAge: 1000 * 60 * 60 * 24, // O cookie dura exatamente 1 dia (em milissegundos)
	},
});

export default sessionMiddleware;

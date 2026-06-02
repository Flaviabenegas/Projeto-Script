import session from 'express-session';

const sessionMiddleware = session({
	secret: 'chave-super-secreta-dos-focinhos', 
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, 
		maxAge: 1000 * 60 * 60 * 24, 
	},
});

export default sessionMiddleware;

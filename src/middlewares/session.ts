import session from 'express-session';

if (!process.env.SESSION_SECRET) {
	throw new Error('CRÍTICO: A variável de ambiente SESSION_SECRET não está definida.');
}

const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 1000 * 60 * 60 * 24,
	},
});

export default sessionMiddleware;

import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import sessionMiddleware from './middlewares/session.js';
import { sequelize } from './config/database.js';
import { injetarLocals } from './middlewares/locals.js';
import rotas from './routes/routes.js';

await sequelize.sync({ alter: true });
console.log('📦 Banco de dados sincronizado.');

const app = express();
app.disable('x-powered-by');

app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
				styleSrc: [
					"'self'",
					'https://cdn.jsdelivr.net',
					'https://fonts.googleapis.com',
					"'unsafe-inline'",
				],
				styleSrcElem: [
					"'self'",
					'https://cdn.jsdelivr.net',
					'https://fonts.googleapis.com',
					"'unsafe-inline'",
				],
				fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
				imgSrc: [
					"'self'",
					'data:',
					'https://www.apaixonadosporfocinhos.com.br',
					'https://apaixonadosporfocinhos.com.br',
					'https://loremflickr.com',
					'https://loremflickr.com/400/600/cat',
				],
				connectSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://brasilapi.com.br'],
				objectSrc: ["'none'"],
				frameSrc: ["'none'"],
				upgradeInsecureRequests: [],
			},
		},
	}),
);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(sessionMiddleware);
app.use(injetarLocals);

app.use(rotas);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).render('erro', {
		url: req.originalUrl,
		status: 404,
		titulo: 'Página Não Encontrada',
		mensagem: 'Ops! A página que você procura não foi encontrada.',
	});
});

app.use((erro: any, req: Request, res: Response, next: NextFunction) => {
	console.error('Erro interno capturado pelo middleware:', erro);
	const status = erro.status || 500;

	res.status(status).render('erro', {
		url: req.originalUrl,
		status,
		titulo: 'Erro Interno',
		mensagem: erro.message || 'Desculpe, ocorreu um erro interno no servidor.',
	});
});
app.listen(process.env.PORT || 3000, () => {
	console.log(`🚀 Servidor rodando na porta http://localhost:${process.env.PORT}`);
});

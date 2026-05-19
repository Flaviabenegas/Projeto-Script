import express, { type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import sessionMiddleware from './middlewares/session.js';
import { sequelize } from './config/database.js';
import rotas from './routes/routes.js';

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
	console.log('📦 Banco de dados sincronizado.');
});

app.use(sessionMiddleware);
app.use(rotas);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).render('404', {
		url: req.originalUrl,
		mensagem: 'Ops! A página que você procura não foi encontrada.',
	});
});

app.use((erro: any, req: Request, res: Response, next: NextFunction) => {
	console.error('Erro interno capturado pelo middleware:', erro);
	const status = erro.status || 500;

	res.status(status).render('erro', {
		url: req.originalUrl,
		status,
		mensagem: erro.message || 'Desculpe, ocorreu um erro interno no servidor.',
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`🚀 Servidor rodando na porta http://localhost:${process.env.PORT}`);
});

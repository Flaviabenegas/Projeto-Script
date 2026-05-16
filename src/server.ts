import express, { type Request, type Response } from 'express';
import cors from 'cors';
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

app.use(rotas);

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});

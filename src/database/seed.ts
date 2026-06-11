import { sequelize } from '../config/database.js';
import { User } from '../models/User.js';
import { Depoimento } from '../models/Depoimentos.js';

async function seed() {
	await sequelize.sync({ force: true });
	console.log('✅ Banco recriado.');

	// Admin
	await User.create(
		{
			nome: 'Administrador',
			usuario: 'teste@teste',
			senha: 'teste',
			isAdmin: true,
		},
		{ hooks: true },
	);
	console.log('✅ Usuário admin criado.');

	// Depoimentos
	await Depoimento.bulkCreate([
		{
			tutor: 'Ana Paula',
			pet: 'Bolinha',
			imagem: '/img/sol.jpg',
			alt: 'Foto da Ana Paula com o Bolinha',
			texto:
				'Meu cachorrinho usou a plaquinha e quando ele se perdeu, foi devolvido rapidinho! Recomendo demais.',
			ativo: true,
		},
		{
			tutor: 'Carlos Eduardo',
			pet: 'Mimi',
			imagem: '/img/sol.webp',
			alt: 'Foto do Carlos com a Mimi',
			texto:
				'A qualidade da plaquinha é excelente, não desbotou nem com chuva. A Mimi usa há meses e continua perfeita.',
			ativo: true,
		},
		{
			tutor: 'Fernanda Lima',
			pet: 'Thor',
			imagem: '/img/simba.webp',
			alt: 'Foto da Fernanda com o Thor',
			texto:
				'Atendimento super atencioso e entrega rápida. O Thor já chegou com a plaquinha no pescoço!',
			ativo: true,
		},
		{
			tutor: 'Roberto Souza',
			pet: 'Mel',
			imagem: '/img/lua.webp',
			alt: 'Foto do Roberto com a Mel',
			texto:
				'Comprei para minha gata e ficou lindinha. As informações são bem legíveis e o material é resistente.',
			ativo: true,
		},
	]);
	console.log('✅ Depoimentos criados.');

	await sequelize.close();
	console.log('🎉 Seed concluído!');
}

seed().catch((err) => {
	console.error('❌ Erro no seed:', err);
	process.exit(1);
});

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
				'A Sol aproveitou um descuido durante a mudança e saiu para a rua. Foram as duas horas mais desesperadoras da minha vida. Por sorte, ela estava com a medalhinha de identificação. Uma vizinha de dois quarteirões a encontrou e, em segundos, conseguiu acessar meu contato. Se não fosse por essa tecnologia, não sei se ela estaria dormindo no sofá hoje. É um investimento minúsculo perto da paz de espírito que traz.',
			ativo: true,
		},
		{
			tutor: 'Fernanda Lima',
			pet: 'Thor',
			imagem: '/img/simba.webp',
			alt: 'Foto da Fernanda com o Thor',
			texto:
				'O Simba fugiu de casa duas vezes e, em ambas, o desespero durou pouco. Na primeira, ele se perdeu na vizinhança; na segunda, atravessou avenidas e foi parar em outro bairro. O que eu aprendi? Que amor e muros altos não bastam. Se não fosse pela placa de identificação, ele seria apenas mais um gato laranja anônimo na rua. Quem o encontrou não precisou de tecnologia ou postagens em redes sociais: bastou ler o nome dele e o meu telefone gravados ali. A plaquinha deu voz ao Simba quando ele estava perdido e garantiu que ele voltasse para os meus braços em minutos. É o investimento mais barato e vital que já fiz.',
			ativo: true,
		},
		{
			tutor: 'Roberto Souza',
			pet: 'Mel',
			imagem: '/img/lua.webp',
			alt: 'Foto do Roberto com a Mel',
			texto:
				'Durante um passeio no final de semana, a Lua se assustou com um barulho de escapamento e saiu em disparada para uma área de mata. Foram momentos de pânico absoluto. Menos de 15 minutos depois, recebi uma notificação no meu celular: alguém tinha lido a identificação dela. Um casal a encontrou e, pelas informações gravadas na plaquinha, já sabiam o nome dela e que ela era medrosa. Eles me ligaram na hora e o reencontro foi emocionante. Hoje eu não saio de casa sem conferir se a medalhinha está no pescoço dela. Salvou a nossa família..',
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

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: Number(process.env.SMTP_PORT) === 465,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendResetEmail(email: string, token: string): Promise<void> {
	const link = `${process.env.APP_URL}/resetar-senha?token=${token}`;

	await transporter.sendMail({
		from: `"Suporte" <${process.env.SMTP_USER}>`,
		to: email,
		subject: 'Redefinição de senha',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
				<h2 style="color: #333;">Redefinição de senha</h2>
				<p>Você solicitou a redefinição da sua senha.</p>
				<p>Clique no botão abaixo para criar uma nova senha:</p>
				<a href="${link}"
				   style="display:inline-block;padding:12px 24px;background:#0d6efd;color:#fff;
				          border-radius:50px;text-decoration:none;font-weight:bold;">
					Redefinir senha
				</a>
				<p style="margin-top:16px;color:#666;">
					Este link expira em <strong>1 hora</strong>.
				</p>
				<p style="color:#666;">
					Se não foi você quem solicitou, ignore este e-mail — sua senha permanece a mesma.
				</p>
			</div>
		`,
	});
}

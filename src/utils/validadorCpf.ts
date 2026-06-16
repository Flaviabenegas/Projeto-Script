export function isValidCPF(cpf: string): boolean {
	const cpfDigits = cpf.replace(/\D/g, '');

	if (cpfDigits.length !== 11) return false;
	if (/^(\d)\1+$/.test(cpfDigits)) return false;

	const digits: number[] = cpfDigits.split('').map(Number);

	
	const d = digits as [number, number, number, number, number, number, number, number, number, number, number];

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += (digits[i] ?? 0) * (10 - i);
	}

	const remainder1 = sum % 11;
	const verifierDigit1 = remainder1 < 2 ? 0 : 11 - remainder1;

	if (d[9] !== verifierDigit1) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += (digits[i] ?? 0) * (11 - i);
	}

	const remainder2 = sum % 11;
	const verifierDigit2 = remainder2 < 2 ? 0 : 11 - remainder2;

	return d[10] === verifierDigit2;
}
import { PrismaInfrastructre } from "./infrastructure/prisma";
import { SUBSTANCE_SEED } from "./configuration/knowledge_base/substances";
import { SubstanceRepository } from "./modules/substance/repository";

async function main() {
	await PrismaInfrastructre.$connect();

	const substanceRepository = new SubstanceRepository();

	for await (const substance of SUBSTANCE_SEED) {
		const saved = await substanceRepository.save(substance);
		console.log(saved);
	}
}

main()
	.then(() => {
		PrismaInfrastructre.$disconnect();
	})
	.catch((error) => {
		console.error(error);
		PrismaInfrastructre.$disconnect();
	});

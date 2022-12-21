import { PrismaInfrastructre } from "./infrastructure/prisma";
import { SUBSTANCE_SEED } from "./configuration/knowledge_base/substances";
import { SubstanceRepository } from "./modules/substance/repository";
import { RegisterUserCommandHandler } from "./modules/user-v2/features/register-user/service";
import { RegisterUserCommand } from "./modules/user-v2/features/register-user/command";
import { SAMPLE_INGESTIONS } from "./configuration/sample-ingestions";
import { IngestSubstanceCommand } from "./modules/ingestion-v2/features/ingest-substance/command";
import { IngestSubstanceCommandHandler } from "./modules/ingestion-v2/features/ingest-substance/service";

async function main() {
	await PrismaInfrastructre.$connect();

	const substanceRepository = new SubstanceRepository();

	for await (const substance of SUBSTANCE_SEED) {
		const saved = await substanceRepository.save(substance);
		console.log(saved);
	}

	const createdUser = await new RegisterUserCommandHandler().execute(
		new RegisterUserCommand({})
	);

	const plainRecoveryKey = createdUser.recoveryKey;

	for await (const ingestion of SAMPLE_INGESTIONS) {
		const command = new IngestSubstanceCommand(ingestion, createdUser);
		await new IngestSubstanceCommandHandler().execute(command);
	}

	console.log("Username:", createdUser.username);
	console.log("Recovery Key:", plainRecoveryKey);
}

main()
	.then(() => {
		PrismaInfrastructre.$disconnect();
	})
	.catch((error) => {
		console.error(error);
		PrismaInfrastructre.$disconnect();
	});

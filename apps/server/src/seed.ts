import { PrismaInfrastructre } from "./infrastructure/prisma";
import { SUBSTANCE_SEED } from "./configuration/knowledge_base/substances";
import { SubstanceRepository } from "./modules/substance/repository";
import { RegisterUserCommandHandler } from "./features/user/register-user/service";
import { RegisterUserCommand } from "./features/user/register-user/command";
import { SAMPLE_INGESTIONS } from "./configuration/sample-ingestions";
import { IngestSubstanceCommand } from "./features/ingestion/ingest-substance/command";
import { IngestSubstanceCommandHandler } from "./features/ingestion/ingest-substance/service";

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

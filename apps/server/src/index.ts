import { HttpApplication } from "./application/http.application";
import logProcessErrors from "log-process-errors";
import { Substance } from "./modules/substance/entity";
import { PsychoactiveClass } from "./modules/substance/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "./modules/substance/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "./modules/substance/entities/route-of-administration-classification.enum";
import { SubstanceRepository } from "./modules/substance/repository";
import { Caffeine } from "./configuration/knowledge_base/substances/stimulants/caffeine.seed";
import { Ingestion } from "./modules/ingestion/entity";
import { Chrono } from "chrono-node";
import ms from "ms";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { User } from "./modules/user/entity";
import { UserRepository } from "./modules/user/repository";
import { IngestionRepository } from "./modules/ingestion/repository";
import { RegisterUserCommandHandler } from "./modules/user/features/register-user/service";
import { RegisterUserCommand } from "./modules/user/features/register-user/command";
import { nanoid } from "nanoid";
logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();

	if (process.env.NODE_ENV === "development") {
		console.log(process.env.DATABASE_URI);
		console.log(process.env.TZ);
	}

	console.log(nanoid(1024));

	const command = new RegisterUserCommand({});
	await new RegisterUserCommandHandler().execute(command);

	const caffeine = Amphetamine;
	await new SubstanceRepository().save(caffeine);

	const caffeineIngestion = new Ingestion({
		substance: caffeine,
		amount: 5000,
		route: RouteOfAdministrationClassification.insufflated,
		date: new Chrono().parseDate("Today at 4:05")!,
		user: User.generateUser(),
	});

	console.log(caffeineIngestion);
	console.log(caffeineIngestion.dosageClassification);
	console.log(caffeineIngestion.getIngestionPhases());
	console.log(caffeineIngestion.getCurrentPhase());

	await new UserRepository().save(caffeineIngestion.user);

	try {
		await new IngestionRepository().save(caffeineIngestion);
	} catch (error) {
		console.log(error);
	}
}

await main();

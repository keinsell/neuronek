import { HttpApplication } from "./application/http.application";
import logProcessErrors from "log-process-errors";
import { Substance } from "./modules/substance-v2/entity";
import { PsychoactiveClass } from "./modules/substance-v2/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "./modules/substance-v2/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "./modules/substance-v2/entities/route-of-administration-classification.enum";
import { SubstanceRepository } from "./modules/substance-v2/repository";
import { Caffeine } from "./configuration/knowledge_base/substances/stimulants/caffeine.seed";
import { Ingestion } from "./modules/ingestion-v2/entity";
import { Chrono } from "chrono-node";
import ms from "ms";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();

	if (process.env.NODE_ENV === "development") {
		console.log(process.env.DATABASE_URI);
	}

	const caffeine = Amphetamine;
	await new SubstanceRepository().save(caffeine);

	const caffeineIngestion = new Ingestion({
		substance: caffeine,
		amount: 10000,
		route: RouteOfAdministrationClassification.insufflated,
		date: new Chrono().parseDate("Today at 21:37")!,
	});

	console.log(caffeineIngestion.getCurrentPhase());
	console.log(caffeineIngestion.dosageClassification);
	console.log(caffeineIngestion.getIngestionPhases());
}

await main();

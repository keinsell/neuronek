import { HttpApplication } from "./application/http.application";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { RouteOfAdministrationType } from "./modules/substances/route-of-administration/entities/route-of-administration.entity";
// eslint-disable-next-line node/file-extension-in-import
import { syncPersonalJournal } from "./personal-journal";
import logProcessErrors from "log-process-errors";
import { IngestionService } from "./modules/ingestion/ingestion.service";
import { SubstanceRepository } from "./modules/substances/substance/repositories/substance.repository";
import { EffectRepository } from "./modules/substances/effect/repositories/effect.repsitory.js";
import { CognitiveEuphoria } from "./configuration/knowledge_base/effects/cognitive/novel/cognitive-euphoria/cognitive-euphoria.js";

logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();
	await new SubstanceRepository().save(Amphetamine);
	await new EffectRepository().save(CognitiveEuphoria);
	console.log(CognitiveEuphoria);
	await syncPersonalJournal();

	const y = await new IngestionService().planIngestion({
		substance: "Amphetamine",
		route: RouteOfAdministrationType.insufflated,
		dosage: 8,
		purity: 1,
	});

	console.log(y);
}

await main();

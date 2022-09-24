import { HttpApplication } from "./application/http.application";
import { RouteOfAdministrationType } from "./modules/substances/route-of-administration/entities/route-of-administration.entity";
// eslint-disable-next-line node/file-extension-in-import
import { syncPersonalJournal } from "./personal-journal";
import logProcessErrors from "log-process-errors";
import { IngestionService } from "./modules/ingestion/ingestion.service";

logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();

	const y = await new IngestionService().planIngestion({
		substance: "Amphetamine",
		route: RouteOfAdministrationType.insufflated,
		dosage: 8,
		purity: 1,
	});

	await syncPersonalJournal();

	console.log(y);
}

await main();

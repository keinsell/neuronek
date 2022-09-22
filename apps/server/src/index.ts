import { HttpApplication } from "./application/http.application";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { RouteOfAdministrationType } from "./modules/substances/route-of-administration/entities/route-of-administration.entity";
import { keinsell, syncPersonalJournal } from "./personal-journal";
import logProcessErrors from "log-process-errors";
import { IngestionService } from "./modules/ingestion/ingestion.service";
import { SubstanceRepository } from "./modules/substances/substance/repositories/substance.repository";

logProcessErrors();

export async function main() {
  new HttpApplication().bootstrap();
  await syncPersonalJournal();

  await new SubstanceRepository().save(Amphetamine);

  const y = await new IngestionService().planIngestion({
    substance: "Amphetamine",
    route: RouteOfAdministrationType.insufflated,
    dosage: 9,
    purity: 1,
  });

  console.log(y);
}

await main();

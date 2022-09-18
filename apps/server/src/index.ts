import { HttpApplication } from "./application/http.application";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { RouteOfAdministrationType } from "./modules/route-of-administration/entities/route-of-administration.entity";
import { keinsell, syncPersonalJournal } from "./personal-journal";
import logProcessErrors from "log-process-errors";

logProcessErrors();

export async function main() {
  new HttpApplication().bootstrap();

  console.log(
    Amphetamine.getPersonalisedDosageForUser(
      keinsell,
      RouteOfAdministrationType.insufflated
    )
  );

  await syncPersonalJournal();
}

await main();

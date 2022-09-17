import { HttpApplication } from "./application/http.application";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { RouteOfAdministrationType } from "./modules/substance/entities/route-of-administration.entity";
import { keinsell, syncPersonalJournal } from "./personal-journal";

export async function main() {
  new HttpApplication().bootstrap();
  await syncPersonalJournal();

  console.log(
    Amphetamine.getPersonalisedDosageForUser(
      keinsell,
      RouteOfAdministrationType.insufflated
    )
  );
}

await main();

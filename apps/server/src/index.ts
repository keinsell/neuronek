import { HttpApplication } from "./application/http.application";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { RouteOfAdministrationType } from "./modules/route-of-administration/entities/route-of-administration.entity";
import { keinsell, syncPersonalJournal } from "./personal-journal";
import logProcessErrors from "log-process-errors";
import { EffectRepository } from "./modules/effects/repositories/effect.repsitory";
import { AnalysisEnhancement } from "./configuration/knowledge_base/effects/cognitive/analysis-enhancement.seed";
import { MotivationEnhancement } from "./configuration/knowledge_base/effects/cognitive/motivation-enhancement.seed";
import { SubstanceRepository } from "./modules/substance/repositories/substance.repository";

logProcessErrors();

export async function main() {
  await new EffectRepository().save(AnalysisEnhancement);
  await new EffectRepository().save(MotivationEnhancement);

  new HttpApplication().bootstrap();
  await syncPersonalJournal();

  console.log(await new SubstanceRepository().save(Amphetamine));

  console.log(
    Amphetamine.getPersonalisedDosageForUser(
      keinsell,
      RouteOfAdministrationType.insufflated
    )
  );
}

await main();

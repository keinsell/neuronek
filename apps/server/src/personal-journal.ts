import ms from "ms";
import * as chrono from "chrono-node";
import { Mescaline } from "./configuration/knowledge_base/substances/psychodelics/mescaline.seed";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { Caffeine } from "./configuration/knowledge_base/substances/stimulants/caffeine.seed";
import { Ingestion } from "./modules/ingestion/entities/ingestion.entity";
import { ingestionService } from "./modules/ingestion/ingestion.service";
import { ingestionRepository } from "./modules/ingestion/repositories/ingestion.repository";
import { Journal } from "./modules/journal/entities/journal.entity";
import { RouteOfAdministrationType } from "./modules/substance/entities/route-of-administration.entity";
import { substanceRepository } from "./modules/substance/repositories/substance.repository";
import { Nicotine } from "./configuration/knowledge_base/substances/stimulants/nicotine.seed";
import { journalMapper } from "./modules/journal/mappers/journal.mapper";
import { journalRepository } from "./modules/journal/repositories/journal.repository";
import { IDRA21 } from "./configuration/knowledge_base/substances/nootropics/IDRA-21.seed";

export async function syncPersonalJournal() {
  const amphetamine = await substanceRepository.save(Amphetamine);
  const mescaline = await substanceRepository.save(Mescaline);
  const caffeine = await substanceRepository.save(Caffeine);
  const nicotine = await substanceRepository.save(Nicotine);
  const idra21 = await substanceRepository.save(IDRA21);

  const ingestions: Ingestion[] = [];

  async function ingestPuff(count: number = 1, date: Date) {
    const ingestion = await ingestionService.ingestSubstance({
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      dosage: count * 0.15,
      date,
    });
    ingestions.push(ingestion);
  }

  // console.log(
  //   await ingestionService.planIngestion({
  //     substance: "Amphetamine",
  //     dosage: 20,
  //     route: RouteOfAdministrationType.insufflated,
  //     date: chrono.parseDate("14 September 2022 12:45"),
  //   })
  // );

  await ingestPuff(4, chrono.parseDate("15 September 2022 1:45"));
  await ingestPuff(10, chrono.parseDate("15 September 2022 00:15"));
  await ingestPuff(1, chrono.parseDate("14 September 2022 23:20"));
  await ingestPuff(2, chrono.parseDate("14 September 2022 23:19"));
  await ingestPuff(9, chrono.parseDate("14 September 2022 21:13"));
  await ingestPuff(3, chrono.parseDate("14 September 2022 19:13"));
  await ingestPuff(4, chrono.parseDate("14 September 2022 18:54"));
  await ingestPuff(7, chrono.parseDate("14 September 2022 18:34"));
  await ingestPuff(3, chrono.parseDate("14 September 2022 16:13"));
  await ingestPuff(9, chrono.parseDate("14 September 2022 16:07"));
  await ingestPuff(4, chrono.parseDate("14 September 2022 15:43"));
  await ingestPuff(2, chrono.parseDate("14 September 2022 15:27"));
  await ingestPuff(3, chrono.parseDate("14 September 2022 14:47"));
  await ingestPuff(4, chrono.parseDate("14 September 2022 14:27"));
  await ingestPuff(1, chrono.parseDate("14 September 2022 14:23"));

  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Caffeine",
      dosage: 60,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 14:43"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Caffeine",
      dosage: 20,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 13:58"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Caffeine",
      dosage: 20,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 12:45"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Caffeine",
      dosage: 60,
      route: RouteOfAdministrationType.oral,
      date: new Date("2022-09-14T05:14:39.175Z"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Caffeine",
      dosage: 80,
      route: RouteOfAdministrationType.oral,
      date: new Date("2022-09-13T12:14:39.175Z"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Fet",
      dosage: 10,
      route: RouteOfAdministrationType.insufflated,
      date: new Date("2022-09-13T11:10:39.175Z"),
    })
  );
  ingestions.push(
    await ingestionService.ingestSubstance({
      substance: "Fet",
      dosage: 10,
      route: RouteOfAdministrationType.insufflated,
      date: new Date("2022-09-12T07:10:39.175Z"),
    })
  );
  ingestions.push(
    new Ingestion(
      {
        substance: caffeine,
        dosage: 80,
        route: RouteOfAdministrationType.oral,
        purpose: "Addiction.",
        setting: "Home",
        date: new Date("2022-09-11T15:16:23.592Z"),
      },
      "cl7xdwugl00706cd5ufxjjb1o"
    )
  );
  ingestions.push(
    new Ingestion(
      {
        substance: mescaline,
        dosage: 40,
        route: RouteOfAdministrationType.oral,
        purpose:
          "Trying to archieve a mild euthymia in order to reduce depression.",
        setting: "Home",
        set: "Extermally bad mood.",
        date: new Date("2022-09-11T11:16:23.592Z"),
      },
      "cl7xd1p080046hpd57k1e71wm"
    )
  );
  ingestions.push(
    new Ingestion(
      {
        substance: amphetamine,
        dosage: 5,
        route: RouteOfAdministrationType.insufflated,
        set: "Extermally tired",
        purpose: "As usual, ignoring body tiredness.",
        setting: "Home",
        date: new Date("2022-09-10T14:09:02.944Z"),
      },
      "cl7xd1p080045hpd5qrrqo6i5"
    )
  );

  for await (const ingestion of ingestions) {
    const savedIngestion = await ingestionRepository.save(ingestion);
    // Update ingestion inside array
    ingestions[ingestions.indexOf(ingestion)] = savedIngestion;
  }

  const journal = new Journal({
    ingestions,
  });

  journal.getProgressionOfActiveIngestions();

  const ingestedSubstances = journal.getIngestedSubstances();

  ingestedSubstances.map((substance) => {
    journal
      .filterIngestions({ substance: substance.name })
      .getAverageDosagePerDay();
  });

  journal.exportJournalToLocalTextFile();
}

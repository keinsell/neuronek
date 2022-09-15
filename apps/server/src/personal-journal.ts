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
import { userRepository } from "./modules/user/repositories/user.repository";
import { Keinsell } from "./configuration/seed/Keinsell.seed";
import { PrismaInstance } from "./infrastructure/prisma.infra";

export const keinsell = await userRepository.save(Keinsell);

export async function syncPersonalJournal() {
  const amphetamine = await substanceRepository.save(Amphetamine);
  const mescaline = await substanceRepository.save(Mescaline);
  const caffeine = await substanceRepository.save(Caffeine);
  const nicotine = await substanceRepository.save(Nicotine);
  const idra21 = await substanceRepository.save(IDRA21);

  await PrismaInstance.ingestion.deleteMany();

  const ingestions: Ingestion[] = [];

  console.log(keinsell);

  async function ingestPuff(count: number = 1, date: Date) {
    const ingestion = await ingestionService.ingestSubstance(
      {
        substance: "Nicotine",
        route: RouteOfAdministrationType.smoked,
        dosage: count * 0.15,
        date,
      },
      keinsell
    );
    ingestions.push(ingestion);
  }

  await ingestPuff(8, chrono.parseDate("15 September 2022 6:15"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:53"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:52"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:51"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:50"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:49"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:48"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:47"));
  await ingestPuff(8, chrono.parseDate("15 September 2022 1:46"));
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
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 60,
        route: RouteOfAdministrationType.oral,
        date: chrono.parseDate("14 September 2022 14:43"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 20,
        route: RouteOfAdministrationType.oral,
        date: chrono.parseDate("14 September 2022 13:58"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 20,
        route: RouteOfAdministrationType.oral,
        date: chrono.parseDate("14 September 2022 12:45"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 60,
        route: RouteOfAdministrationType.oral,
        date: new Date("2022-09-14T05:14:39.175Z"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 80,
        route: RouteOfAdministrationType.oral,
        date: new Date("2022-09-13T12:14:39.175Z"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Fet",
        dosage: 10,
        route: RouteOfAdministrationType.insufflated,
        date: new Date("2022-09-13T11:10:39.175Z"),
      },
      keinsell
    )
  );
  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Fet",
        dosage: 10,
        route: RouteOfAdministrationType.insufflated,
        date: new Date("2022-09-12T07:10:39.175Z"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        dosage: 10,
        route: RouteOfAdministrationType.oral,
        purpose: "Addiction.",
        setting: "Home",
        date: new Date("2022-09-11T15:16:23.592Z"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Mescaline",
        dosage: 10,
        route: RouteOfAdministrationType.oral,
        purpose:
          "Trying to archieve a mild euthymia in order to reduce depression.",
        setting: "Home",
        set: "Extermally bad mood.",
        date: new Date("2022-09-11T11:16:23.592Z"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Amphetamine",
        dosage: 5,
        route: RouteOfAdministrationType.insufflated,
        purpose: "As usual, ignoring body tiredness.",
        setting: "Home",
        set: "Extermally bad mood & tired.",
        date: new Date("2022-09-10T14:09:02.944Z"),
      },
      keinsell
    )
  );

  for await (const ingestion of ingestions) {
    const savedIngestion = await ingestionRepository.save(ingestion);
    // Update ingestion inside array
    ingestions[ingestions.indexOf(ingestion)] = savedIngestion;
  }

  // const dbIngestions = await ingestionRepository.findIngestionsByIngester(
  //   keinsell
  // );

  const journal = new Journal({
    ingestions: ingestions,
  });

  journal.getProgressionOfActiveIngestions();

  const ingestedSubstances = journal.getIngestedSubstances();

  ingestedSubstances.map((substance) => {
    journal
      .filterIngestions({ substance: substance.name })
      .getAverageTimeBetween();
  });

  journal.exportJournalToLocalTextFile();
}

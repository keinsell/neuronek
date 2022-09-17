import ms from "ms";
import * as chrono from "chrono-node";
import { Mescaline } from "./configuration/knowledge_base/substances/psychodelics/mescaline.seed";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { Caffeine } from "./configuration/knowledge_base/substances/stimulants/caffeine.seed";
import { Ingestion } from "./modules/ingestion/entities/ingestion.entity";
import { ingestionService } from "./modules/ingestion/ingestion.service";
import { Journal } from "./modules/journal/entities/journal.entity";
import { RouteOfAdministrationType } from "./modules/substance/entities/route-of-administration.entity";
import { substanceRepository } from "./modules/substance/repositories/substance.repository";
import { Nicotine } from "./configuration/knowledge_base/substances/stimulants/nicotine.seed";
import { userRepository } from "./modules/user/repositories/user.repository";
import { Keinsell } from "./configuration/seed/Keinsell.seed";
import { PrismaInstance } from "./infrastructure/prisma.infra";
import { PsychoactiveClass } from "./modules/substance/entities/psychoactive-class.enum";
import { JournalModule } from "./modules/journal/journal.module";

export const keinsell = await userRepository.save(Keinsell);

export async function syncPersonalJournal() {
  await substanceRepository.save(Amphetamine);
  await substanceRepository.save(Mescaline);
  await substanceRepository.save(Caffeine);
  const nicotine = await substanceRepository.save(Nicotine);

  console.log(`Ingestions: ${await PrismaInstance.ingestion.count()}`);
  // await PrismaInstance.ingestion.deleteMany();

  const ingestions: Ingestion[] = [];

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

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        route: RouteOfAdministrationType.oral,
        dosage: 80,
        purity: 1,
        date: chrono.parseDate("17 September 2022 16:14"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Amphetamine",
        route: RouteOfAdministrationType.insufflated,
        dosage: 7.5,
        purity: 0.89,
        date: chrono.parseDate("17 September 2022 16:14"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Amphetamine",
        route: RouteOfAdministrationType.insufflated,
        dosage: 5,
        purity: 0.89,
        date: chrono.parseDate("17 September 2022 12:27"),
      },
      keinsell
    )
  );

  // As my Nicotine addiction is pretty heavy, it's extremally hard to keep track of it, instead I'll use a estimation method and puff counter on my vape device. Every refill of tank should be noted and puff counter should be read.
  // Puff Counter: 5624
  ingestions.push(
    ...(await ingestionService.autofillPastIngestionsByAmountAndDosages(
      nicotine,
      5,
      chrono.parseDate("17 September 2022 16:15"),
      chrono.parseDate("17 September 2022 12:45"),
      5624 - 5550,
      keinsell
    ))
  );

  // As my Nicotine addiction is pretty heavy, it's extremally hard to keep track of it, instead I'll use a estimation method and puff counter on my vape device. Every refill of tank should be noted and puff counter should be read.
  // Puff Counter: 5550
  ingestions.push(
    ...(await ingestionService.autofillPastIngestionsByAmountAndDosages(
      nicotine,
      5,
      chrono.parseDate("16 September 2022 22:32"),
      chrono.parseDate("17 September 2022 12:45"),
      5550 - 5398,
      keinsell
    ))
  );

  // As my Nicotine addiction is pretty heavy, it's extremally hard to keep track of it, instead I'll use a estimation method and puff counter on my vape device. Every refill of tank should be noted and puff counter should be read.
  // Puff Counter: 5472
  ingestions.push(
    ...(await ingestionService.autofillPastIngestionsByAmountAndDosages(
      nicotine,
      5,
      chrono.parseDate("16 September 2022 19:51"),
      chrono.parseDate("16 September 2022 22:32"),
      5472 - 5398,
      keinsell
    ))
  );

  // As my Nicotine addiction is pretty heavy, it's extremally hard to keep track of it, instead I'll use a estimation method and puff counter on my vape device. Every refill of tank should be noted and puff counter should be read.
  // Puff Counter: 5398
  ingestions.push(
    ...(await ingestionService.autofillPastIngestionsByAmountAndDosages(
      nicotine,
      15,
      chrono.parseDate("16 September 2022 6:29"),
      chrono.parseDate("16 September 2022 19:51"),
      113,
      keinsell
    ))
  );

  // Import of my past amphetamine usage
  // Sadly it's a lot but it's needed to keep track of it.
  ingestions.push(
    ...(await ingestionService.autofillPastIngestionsByAmountAndDosages(
      Amphetamine,
      3_000,
      chrono.parseDate("1 September 2021 0:00"),
      chrono.parseDate("1 August 2022 0:00"),
      undefined,
      keinsell
    ))
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Amphetamine",
        route: RouteOfAdministrationType.insufflated,
        dosage: 5,
        purity: 0.89,
        date: chrono.parseDate("16 September 2022 16:29"),
      },
      keinsell
    )
  );

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Caffeine",
        route: RouteOfAdministrationType.oral,
        dosage: 89,
        purity: 1,
        date: chrono.parseDate("16 September 2022 9:53"),
      },
      keinsell
    )
  );

  await ingestPuff(12, chrono.parseDate("15 September 2022 5:07"));

  ingestions.push(
    await ingestionService.ingestSubstance(
      {
        substance: "Mescaline",
        route: RouteOfAdministrationType.oral,
        dosage: 50,
        purity: 0.87,
        date: chrono.parseDate("16 September 2022 5:17"),
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
        date: chrono.parseDate("15 September 2022 13:43"),
      },
      keinsell
    )
  );

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
        dosage: 50,
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

  let journal = new Journal({
    ingestions: ingestions,
    owner: keinsell,
  });

  journal.getProgressionOfActiveIngestions();

  const filteredJournal = journal.filterIngestions({
    psychoactiveClass: PsychoactiveClass.stimulant,
    timeSince: ms("7d"),
  });

  const ingestedSubstances = filteredJournal.getIngestedSubstances();

  ingestedSubstances.map((substance) => {
    journal
      .filterIngestions({
        substance: substance.name,
        psychoactiveClass: PsychoactiveClass.stimulant,
        timeSince: ms("7d"),
      })
      .getAverageDosagePerDay();
  });

  const importedJournal = await JournalModule.repository.findJournalById(
    "cl866y10j20550dod5k0n2v4yo"
  );

  if (importedJournal) {
    console.log(importedJournal);
  }
}

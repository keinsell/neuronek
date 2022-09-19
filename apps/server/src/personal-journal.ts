import ms from "ms";
import * as chrono from "chrono-node";
import { Mescaline } from "./configuration/knowledge_base/substances/psychodelics/mescaline.seed";
import { Amphetamine } from "./configuration/knowledge_base/substances/stimulants/amphetamine.seed";
import { Caffeine } from "./configuration/knowledge_base/substances/stimulants/caffeine.seed";
import {
  ingestionService,
  IngestSubstanceDTO,
  MassIngestSubstanceDTO,
} from "./modules/ingestion/ingestion.service";
import { Journal } from "./modules/journal/entities/journal.entity";
import { RouteOfAdministrationType } from "./modules/route-of-administration/entities/route-of-administration.entity.js";
import { substanceRepository } from "./modules/substance/repositories/substance.repository";
import { Nicotine } from "./configuration/knowledge_base/substances/stimulants/nicotine.seed";
import { userRepository } from "./modules/user/repositories/user.repository";
import { Keinsell } from "./configuration/seed/Keinsell.seed";
import { ingestionRepository } from "./modules/ingestion/repositories/ingestion.repository";
import fs from "fs";
import { JournalModule } from "./modules/journal/journal.module";
import { PrismaInstance } from "./infrastructure/prisma.infra";

export const keinsell = await userRepository.save(Keinsell);

export async function syncPersonalJournal() {
  await substanceRepository.save(Amphetamine);
  await substanceRepository.save(Mescaline);
  await substanceRepository.save(Caffeine);
  await substanceRepository.save(Nicotine);

  const ingestions: IngestSubstanceDTO[] = [
    {
      substance: "Caffeine",
      route: RouteOfAdministrationType.oral,
      dosage: 60,
      purity: 1,
      date: chrono.parseDate("19 September 2022 3:35"),
      set: "Idk, why I've drinked this shit",
      setting: "Home",
    },
    {
      substance: "Caffeine",
      route: RouteOfAdministrationType.oral,
      dosage: 80,
      purity: 1,
      date: chrono.parseDate("18 September 2022 13:33"),
      set: "Sleepy & Tired",
      setting: "Home",
    },
    {
      substance: "Caffeine",
      route: RouteOfAdministrationType.oral,
      dosage: 80,
      purity: 1,
      date: chrono.parseDate("17 September 2022 16:14"),
    },
    {
      substance: "Amphetamine",
      route: RouteOfAdministrationType.insufflated,
      dosage: 7.5,
      purity: 0.89,
      date: chrono.parseDate("17 September 2022 16:14"),
    },
    {
      substance: "Amphetamine",
      route: RouteOfAdministrationType.insufflated,
      dosage: 5,
      purity: 0.89,
      date: chrono.parseDate("17 September 2022 12:27"),
    },
    {
      substance: "Amphetamine",
      route: RouteOfAdministrationType.insufflated,
      dosage: 5,
      purity: 0.89,
      date: chrono.parseDate("16 September 2022 16:29"),
    },
    {
      substance: "Caffeine",
      route: RouteOfAdministrationType.oral,
      dosage: 89,
      purity: 1,
      date: chrono.parseDate("16 September 2022 9:53"),
    },
    {
      substance: "Mescaline",
      route: RouteOfAdministrationType.oral,
      dosage: 50,
      purity: 0.87,
      date: chrono.parseDate("16 September 2022 5:17"),
    },
    {
      substance: "Caffeine",
      dosage: 80,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("15 September 2022 13:43"),
    },
    {
      substance: "Caffeine",
      dosage: 60,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 14:43"),
    },
    {
      substance: "Caffeine",
      dosage: 20,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 13:58"),
    },
    {
      substance: "Caffeine",
      dosage: 20,
      route: RouteOfAdministrationType.oral,
      date: chrono.parseDate("14 September 2022 12:45"),
    },
    {
      substance: "Caffeine",
      dosage: 60,
      route: RouteOfAdministrationType.oral,
      date: new Date("2022-09-14T05:14:39.175Z"),
    },
    {
      substance: "Caffeine",
      dosage: 80,
      route: RouteOfAdministrationType.oral,
      date: new Date("2022-09-13T12:14:39.175Z"),
    },
    {
      substance: "Fet",
      dosage: 10,
      route: RouteOfAdministrationType.insufflated,
      date: new Date("2022-09-13T11:10:39.175Z"),
    },
    {
      substance: "Fet",
      dosage: 10,
      route: RouteOfAdministrationType.insufflated,
      date: new Date("2022-09-12T07:10:39.175Z"),
    },
    {
      substance: "Caffeine",
      dosage: 10,
      route: RouteOfAdministrationType.oral,
      purpose: "Addiction.",
      setting: "Home",
      date: new Date("2022-09-11T15:16:23.592Z"),
    },
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
    {
      substance: "Amphetamine",
      dosage: 5,
      route: RouteOfAdministrationType.insufflated,
      purpose: "As usual, ignoring body tiredness.",
      setting: "Home",
      set: "Extermally bad mood & tired.",
      date: new Date("2022-09-10T14:09:02.944Z"),
    },
  ];

  // As my Nicotine addiction is pretty heavy, it's extremally hard to keep track of it, instead I'll use a estimation method and puff counter on my vape device. Every refill of tank should be noted and puff counter should be read.
  const massIngestions: MassIngestSubstanceDTO[] = [
    // Puff Counter: 6350
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 10,
      purity: 1,
      // Actual time
      endingDate: chrono.parseDate("18 September 2022 21:47"),
      // Time of last tank refill
      startingDate: chrono.parseDate("18 September 2022 06:53"),
      dosages: 6350 - 6095,
    },
    // Puff Counter: 6095
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 10,
      purity: 1,
      // Actual time
      endingDate: chrono.parseDate("18 September 2022 06:53"),
      // Time of last tank refill
      startingDate: chrono.parseDate("18 September 2022 00:46"),
      dosages: 6095 - 5924,
    },
    // Puff Counter: 5924
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 5,
      purity: 1,
      endingDate: chrono.parseDate("18 September 2022 00:46"),
      startingDate: chrono.parseDate("17 September 2022 16:45"),
      dosages: 5924 - 5624,
    },
    // Puff Counter: 5624
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 5,
      purity: 1,
      endingDate: chrono.parseDate("17 September 2022 16:45"),
      startingDate: chrono.parseDate("17 September 2022 12:45"),
      dosages: 5624 - 5550,
    },
    // Puff Counter: 5550
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 5,
      purity: 1,
      endingDate: chrono.parseDate("17 September 2022 12:45"),
      startingDate: chrono.parseDate("16 September 2022 22:32"),
      dosages: 5550 - 5472,
    },
    // Puff Counter: 5472
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 5,
      purity: 1,
      endingDate: chrono.parseDate("16 September 2022 22:32"),
      startingDate: chrono.parseDate("16 September 2022 19:51"),
      dosages: 5472 - 5398,
    },
    // Puff Counter: 5398
    {
      substance: "Nicotine",
      route: RouteOfAdministrationType.smoked,
      totalDosage: 5,
      purity: 1,
      endingDate: chrono.parseDate("16 September 2022 22:32"),
      startingDate: chrono.parseDate("16 September 2022 19:51"),
      dosages: 5472 - 5398,
    },
    // Past amphetamine addiction
    {
      substance: "Amphetamine",
      route: RouteOfAdministrationType.insufflated,
      totalDosage: 3_000,
      purity: 0.89,
      endingDate: chrono.parseDate("1 August 2022 0:00"),
      startingDate: chrono.parseDate("1 September 2021 0:00"),
    },
  ];

  let journalek: Journal = new Journal({
    ingestions: [],
    owner: keinsell,
  });

  // Check if local file journal.txt exists, if not create it
  if (!fs.existsSync("journal.txt")) {
    fs.writeFileSync("journal.txt", "");
  }

  // Get a first line of file
  const firstLine = fs.readFileSync("journal.txt", "utf-8").split("\n")[0];

  if (firstLine) {
    const doJournalExistsInDatabase =
      await JournalModule.repository.findJournalById(firstLine);

    if (doJournalExistsInDatabase) {
      journalek = doJournalExistsInDatabase;
    }
  } else {
    // Clean up database from past entiers
    await PrismaInstance.journal.deleteMany();
    await PrismaInstance.ingestion.deleteMany();

    // Mass import ingestions
    for (const ingestion of massIngestions) {
      await ingestionService.autofillPastIngestionsByAmountAndDosages(
        ingestion,
        keinsell
      );
    }

    // Ingest defined ingestions
    for await (const ingestion of ingestions) {
      await ingestionService.ingestSubstance(ingestion, keinsell);
    }

    // Create a journal with previously created ingestions
    const importedIngestions =
      await ingestionRepository.findIngestionsByIngester(keinsell);

    const journal = new Journal({
      ingestions: importedIngestions,
      owner: keinsell,
    });

    const savedJournal = await JournalModule.repository.save(journal);

    journalek = savedJournal;

    fs.writeFileSync("journal.txt", savedJournal.id.toString());
  }

  // Dig analisis from jorunal
  journalek.getProgressionOfActiveIngestions();

  const journalOfLast7Days = journalek.filterIngestions({
    timeSince: ms("14d"),
  });

  const substancesIngestedInLast7Days =
    journalOfLast7Days.getIngestedSubstances();

  substancesIngestedInLast7Days.map((substance) => {
    journalek
      .filterIngestions({
        substance: substance.name,
        timeSince: ms("14d"),
      })
      .getAverageDosagePerDay();
  });
}

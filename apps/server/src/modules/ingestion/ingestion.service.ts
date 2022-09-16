import { keinsell } from "../../personal-journal";
import { Journal } from "../journal/entities/journal.entity";
import { RouteOfAdministrationType } from "../substance/entities/route-of-administration.entity";
import { Substance } from "../substance/entities/substance.entity";
import { substanceRepository } from "../substance/repositories/substance.repository";
import { SubstanceService } from "../substance/substance.service";
import { User } from "../user/entities/user.entity";
import { Ingestion } from "./entities/ingestion.entity";
import { IngestedSubstanceEvent } from "./events/ingested-substance.event";
import { ingestionRepository } from "./repositories/ingestion.repository";

export interface IngestSubstanceDTO {
  substance: string;
  dosage: number;
  route: RouteOfAdministrationType;
  purity?: number;
  date?: Date;
  purpose?: string;
  set?: string;
  setting?: string;
}

export class IngestionService {
  ingestionRepository = ingestionRepository;
  substanceService = new SubstanceService();

  async ingestSubstance(ingestion: IngestSubstanceDTO, user: User) {
    const { substance, dosage, purity, date, route, set, setting, purpose } =
      ingestion;

    const substanceEntity = await this.substanceService.findSubstanceByName(
      substance
    );

    if (!substanceEntity) {
      throw new Error("Substance not found.");
    }

    const dedicatedIngestion = new Ingestion({
      substance: substanceEntity,
      route,
      dosage,
      purity,
      set,
      setting,
      purpose,
      date: date || new Date(),
      user: user,
    });

    const created = await this.ingestionRepository.save(dedicatedIngestion);

    new IngestedSubstanceEvent(created);

    return created;
  }

  async planIngestion(ingestion: IngestSubstanceDTO) {
    const { substance, dosage, purity, date, route, set, setting, purpose } =
      ingestion;

    const substanceEntity = await this.substanceService.findSubstanceByName(
      substance
    );

    if (!substanceEntity) {
      throw new Error("Substance not found.");
    }

    const dedicatedIngestion = new Ingestion({
      substance: substanceEntity,
      route,
      dosage,
      purity,
      set,
      setting,
      purpose,
      date: date || new Date(),
      user: keinsell,
    });

    console.log(dedicatedIngestion);

    return dedicatedIngestion.getIngestionProgression();
  }

  async autofillPastIngestionsByAmountAndDosages(
    substance: Substance,
    amount: number,
    startingDate: Date,
    endingDate: Date,
    dosages: number | undefined,
    user: User
  ) {
    const dateDifference = endingDate.getTime() - startingDate.getTime();

    if (!dosages) {
      const differenceInDays = dateDifference / (1000 * 3600 * 24);
      dosages = differenceInDays;
    }

    const interval = dateDifference / dosages;

    const ingestionPromises: Ingestion[] = [];

    for (let i = 0; i < dosages; i++) {
      const ingestionDate = new Date(startingDate.getTime() + interval * i);
      const ingestion = new Ingestion({
        substance,
        route: substance.administrationRoutes[0].route,
        dosage: amount / dosages,
        date: ingestionDate,
        user,
      });

      ingestionPromises.push(ingestion);
    }

    const ingestions: Ingestion[] = [];

    for await (const ing of ingestionPromises) {
      const created = await this.ingestionRepository.save(ing);
      new IngestedSubstanceEvent(created);
      ingestions.push(created);
    }

    return ingestions;
  }
}

export const ingestionService = new IngestionService();

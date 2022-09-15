import { keinsell } from "../../personal-journal";
import { Journal } from "../journal/entities/journal.entity";
import { RouteOfAdministrationType } from "../substance/entities/route-of-administration.entity";
import { substanceRepository } from "../substance/repositories/substance.repository";
import { SubstanceService } from "../substance/substance.service";
import { User } from "../user/entities/user.entity";
import { Ingestion } from "./entities/ingestion.entity";
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

    return dedicatedIngestion.getIngestionProgression();
  }
}

export const ingestionService = new IngestionService();

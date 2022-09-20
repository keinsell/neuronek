import { DosageClassification } from "../../substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../substance/entities/substance.entity";
import { EffectSummaryDTO } from "../../effects/dtos/effect-summary.dto";
import { PhaseType } from "../../substance/entities/phase.entity";

export interface IngestionPlan {
  substance: string;
  route: RouteOfAdministrationType;
  dosage: DosageClassification;
  /** When effects will be most likely noticed. */
  effectsWillStartAt: Date;
  /** When positive effects will be gone. */
  effectsWillWearOffAt: Date;
  /** When aftereffects will be gone. */
  aftereffectsWillWearOffAt: Date;
  /** When substance will be gone from our organism. */
  substanceWillWearOffAt: Date;
  /** Array with information about stages that can occur during ingestion, when they will start, when they will end and most likely what can happen during such stage. */
  stages: [
    {
      stage: PhaseType;
      willStartAt: Date;
      willEndAt: Date;
      description?: string;
      effects?: EffectSummaryDTO;
    }
  ];
  /** Takedowns persents array with strings that extracts core information from colected data and presents it in human-readable lanaguage. */
  takedowns: string[];
  interactions?: [];
}

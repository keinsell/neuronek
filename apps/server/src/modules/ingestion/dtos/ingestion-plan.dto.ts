import { DosageClassification } from "../../substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { EffectSummaryDTO } from "../../effects/dtos/effect-summary.dto";
import { PhaseType } from "../../substance/entities/phase.entity";

export interface IngestionPlan {
  /** Name of substance that you're ingesting */
  substance: string;
  /** Selected route of administration */
  route: RouteOfAdministrationType;
  /** Classification of declated dosage */
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
      /** Classification of stage */
      stage: PhaseType;
      /** When stage will start */
      willStartAt: Date;
      /** When stage will end */
      willEndAt: Date;
      /** Description about the stage (experimental, there is no current way to extract information per-stage) */
      description?: string;
      /** Effects that can occur during selected stage */
      effects?: EffectSummaryDTO;
    }
  ];
  /** Takedowns persents array with strings that extracts core information from colected data and presents it in human-readable lanaguage. */
  takedowns: string[];
  /** Known interactions with other ingested substances */
  interactions?: [];
}

import { DosageClassification } from "../../substances/substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../substances/route-of-administration/entities/route-of-administration.entity";
import { StageInfo } from "./stage-info.dto";

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
  stages: [StageInfo];
  /** Takedowns persents array with strings that extracts core information from colected data and presents it in human-readable lanaguage. */
  takedowns: string[];
  /** Known interactions with other ingested substances */
  interactions?: [];
}

import { EffectSummaryDTO } from "../../substances/effect/dtos/effect-summary.dto";
import { PhaseType } from "../../substances/substance/entities/phase.entity";

export interface StageInfo {
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

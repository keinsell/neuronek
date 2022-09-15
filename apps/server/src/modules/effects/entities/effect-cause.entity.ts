import { DosageClassification } from "../../substance/entities/dosage.entity";
import { PhaseType } from "../../substance/entities/phase.entity";
import { RouteOfAdministrationType } from "../../substance/entities/route-of-administration.entity";
import { Substance } from "../../substance/entities/substance.entity";
import { Effect } from "./effect.entity";

// TODO: This is actually a pretty huge concept as even PsychonautWiki doesn't present such detailed information - I'm not sure if I should even bother with this, but I'll not be myself when I would drop this idea.
// I would like to go there for something like this:
// - You're ingesting a 2C-B by snorting it.
// - As everybody knows it burns as hell

export interface EffectCauseProperties {
  effect: Effect;
  intensivity: "light" | "moderate" | "strong";
  substance?: Substance;
  psychoactiveClass?: string;
  dosage?: DosageClassification;
  phase?: PhaseType;
  route?: RouteOfAdministrationType;
  /** @example "Caffeine improves analitics." */
  description: string;
}

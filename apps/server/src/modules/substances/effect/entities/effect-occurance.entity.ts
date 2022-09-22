import { Entity } from "../../../../common/entity/entity.common";
import { DosageClassification } from "../../substance/entities/dosage.entity";
import { PhaseType } from "../../substance/entities/phase.entity";
import { PsychoactiveClass } from "../../substance/entities/psychoactive-class.enum";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { Effect } from "./effect.entity";

// TODO: This is actually a pretty huge concept as even PsychonautWiki doesn't present such detailed information - I'm not sure if I should even bother with this, but I'll not be myself when I would drop this idea.
// I would like to go there for something like this:
// - You're ingesting a 2C-B by snorting it.
// - As everybody knows it burns as hell

export enum EffectIntensivity {
  mild = "mild",
  moderate = "moderate",
  strong = "strong",
}

export interface EffectOccuranceProperties {
  effect: Effect;
  intensivity?: EffectIntensivity;
  substance?: string;
  psychoactiveClass?: PsychoactiveClass[];
  dosages?: DosageClassification[];
  phases?: PhaseType[];
  routes?: RouteOfAdministrationType[];
  /** @example "Caffeine improves analitics." */
  description?: string;
}

export class EffectOccurance
  extends Entity
  implements EffectOccuranceProperties
{
  effect: Effect;
  intensivity?: EffectIntensivity | undefined;
  substance?: string;
  psychoactiveClass?: PsychoactiveClass[] | undefined;
  dosages?: DosageClassification[] | undefined;
  phases?: PhaseType[] | undefined;
  routes?: RouteOfAdministrationType[] | undefined;
  description?: string | undefined;

  constructor(properties: EffectOccuranceProperties, id?: string | number) {
    super(id);
    this.effect = properties.effect;
    this.intensivity = properties.intensivity;
    this.substance = properties.substance;
    this.psychoactiveClass = properties.psychoactiveClass;
    this.dosages = properties.dosages;
    this.phases = properties.phases;
    this.routes = properties.routes;
    this.description = properties.description;
  }
}

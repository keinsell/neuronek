import { Entity } from "../../../common/entity/entity.common";

export enum EffectType {
  enhancement = "enhancement",
  supression = "supression",
  distortion = "distortion",
  alternation = "alternation",
}

export enum EffectCategory {
  cognitive = "cognitive",
}

export interface EffectProperties {
  name: string;
  type: EffectType;
  category: EffectCategory;
  summary: string;
  description: string;
  /** @deprecated I have no idea how to do this rn */
  cognitingEffects?: Effect[];
  /** @deprecated I have no idea how to do this rn */
  conditingEffectsOnHighDosage?: Effect[];
  /** @deprecated I have no idea how to do this rn */
  conditingEffectsOnLowDosage?: Effect[];
}

export class Effect extends Entity implements EffectProperties {
  name: string;
  type: EffectType;
  category: EffectCategory;
  summary: string;
  description: string;
  conditingEffectsOnHighDosage?: Effect[] | undefined;
  conditingEffectsOnLowDosage?: Effect[] | undefined;

  constructor(properties: EffectProperties, id?: string | number) {
    super(id);
    this.name = properties.name.replace(` `, "-").toLowerCase();
    this.type = properties.type;
    this.category = properties.category;
    this.summary = properties.summary;
    this.description = properties.description;
    this.conditingEffectsOnHighDosage = properties.conditingEffectsOnHighDosage;
    this.conditingEffectsOnLowDosage = properties.conditingEffectsOnLowDosage;
  }
}

import { Entity } from "../../../common/entity/entity.common";

export enum EffectType {
  enhancement = "enhancement",
  supression = "supression",
  distortion = "distortion",
  alternation = "alternation",
}

export enum EffectCategory {
  cognitive = "cognitive",
  physical = "physical",
}

export interface EffectProperties {
  name: string;
  type: EffectType;
  category: EffectCategory;
  summary: string;
  page?: string;
}

export class Effect extends Entity implements EffectProperties {
  name: string;
  type: EffectType;
  category: EffectCategory;
  summary: string;
  page?: string;

  constructor(properties: EffectProperties, id?: string | number) {
    super(id);
    this.name = properties.name;
    this.type = properties.type;
    this.category = properties.category;
    this.summary = properties.summary;
    this.page = properties.page;
  }
}

import { Entity } from "../../../../common/entity/entity.common";

export enum EffectType {
	enhancement = "enhancement",
	supression = "supression",
	distortion = "distortion",
	alternation = "alternation",
	novel = "novel",
	psychological = "psychological",
	hallucinatoryState = "hallucinatory-state",
	geometry = "geometry",
	transpersonal = "transpersonal",
}

export enum EffectCategory {
	cognitive = "cognitive",
	physical = "physical",
	tactile = "tactile",
}

export const EffectTypesConsideredAsNegative = [EffectType.supression];

export interface EffectProperties {
	name: string;
	type: EffectType;
	category: EffectCategory;
	summary: string;
	page?: string;
	externals?: string[];
	references?: string[];
}

export class Effect extends Entity implements EffectProperties {
	name: string;
	type: EffectType;
	category: EffectCategory;
	summary: string;
	page?: string;
	externals?: string[];
	references?: string[];

	constructor(properties: EffectProperties, id?: string | number) {
		super(id);
		this.name = properties.name;
		this.type = properties.type;
		this.category = properties.category;
		this.summary = properties.summary;
		this.page = properties.page;
		this.references = properties.references;
		this.externals = properties.externals;
	}
}

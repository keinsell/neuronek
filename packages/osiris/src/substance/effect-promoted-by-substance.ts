import { Effect, EffectProperties } from '../effect/effect.js'
import { WhenRule } from '../rules/when.rule.js'

export interface EffectPromotedBySubstanceProperties {
	when?: WhenRule
	interaction_description?: string
}

export class EffectPromotedBySubstance extends Effect implements EffectPromotedBySubstanceProperties {
	when?: WhenRule
	interaction_description?: string

	constructor(properties: EffectProperties & EffectPromotedBySubstanceProperties) {
		super(properties)
		Object.assign(this, properties)
	}
}

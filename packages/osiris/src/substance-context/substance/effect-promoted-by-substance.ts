import { Effect, EffectJSON, EffectProperties } from '../../effect/effect.js'
import { WhenRule, WhenRuleProperties } from '../../rules/when.rule.js'

export interface EffectPromotedBySubstanceProperties {
	when?: WhenRule
	interaction_description?: string
}

export interface EffectPromotedBySubstanceJSON extends EffectJSON {
	when: WhenRuleProperties
	interaction_description?: string
}

export class EffectPromotedBySubstance extends Effect implements EffectPromotedBySubstanceProperties {
	when?: WhenRule
	interaction_description?: string

	constructor(properties: EffectProperties & EffectPromotedBySubstanceProperties) {
		super(properties)
		Object.assign(this, properties)
	}

	toJSON(): EffectPromotedBySubstanceJSON {
		return { ...super.toJSON(), when: this.when?.toJSON(), interaction_description: this.interaction_description }
	}

	static fromJSON(json: EffectPromotedBySubstanceJSON): EffectPromotedBySubstance {
		return new EffectPromotedBySubstance({ ...json, when: WhenRule.fromJSON(json.when) })
	}
}

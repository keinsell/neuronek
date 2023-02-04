import slugify from 'slugify'

import { Entity } from '../common/entity/entity.js'
import { EffectCategory } from './effect-category.js'
import { EffectParameter } from './effect-parameter.js'
import { EffectTag } from './effect-tag.js'
import { EffectType } from './effect-type.js'

export interface EffectProperties {
	/**
	 * @example "Jamais vu"
	 */
	name: string
	type?: EffectType
	/**
	 * @example 'Psychological States'
	 */
	category?: EffectCategory
	/**
	 * @example ["cognitive", "psychological_stage"]
	 */
	tags?: EffectTag[]
	parameters?: EffectParameter[]
	/**
	 * @example "Jamais vu can be described as the sudden sensation that a previously known concept or currently-occurring situation is unfamiliar and being experienced for the very first time. This is often triggered despite the fact that during the experience of it, the person is rationally aware that the circumstances of the previous experience have definitely occurred."
	 */
	summary?: string
	/**
	 * Markdown-formatted text.
	 * @example ["# Jamais vu", "**Jamais vu** can be described as the sudden sensation that a previously known concept or currently-occurring situation is unfamiliar and being experienced for the very first time. This is often triggered despite the fact that during the experience of it, the person is rationally aware that the circumstances of the previous experience have definitely occurred.", ...]
	 */
	description?: string[]
	/**
	 * @example "https://effectindex.com/effects/jamais-vu"
	 */
	see_also?: Effect[]

	effectindex?: string
	psychonautwiki?: string
}

// https://effectindex.com/effects/
export class Effect extends Entity<EffectProperties> {
	constructor(properties: EffectProperties) {
		super(properties)
	}

	/**
	 * @example "jamais-vu"
	 */
	get slug() {
		return slugify(this.properties.name, { lower: true })
	}

	static fromJSON(json: EffectProperties): Effect {
		return new Effect(json)
	}

	toJSON(): EffectProperties {
		return { ...this.properties }
	}
}

import slugify from 'slugify'

import { EffectCategory } from './effect-category.js'
import { EffectParameter } from './effect-parameter.js'
import { EffectTag } from './effect-tag.js'

export interface EffectProperties {
	/**
	 * @example "Jamais vu"
	 */
	name: string
	/**
	 * @example "jamais-vu"
	 */
	slug?: string
	/**
	 * @example 'Psychological States'
	 */
	category: EffectCategory
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

export interface EffectJSON {
	name: string
	slug: string
	category: EffectCategory
	tags?: EffectTag[]
	parameters?: EffectParameter[]
	summary?: string
	description?: string[]
	see_also?: Effect[]
	effectindex?: string
	psychonautwiki?: string
}

// https://effectindex.com/effects/
export class Effect implements EffectProperties {
	/**
	 * @example "Jamais vu"
	 */
	name: string
	/**
	 * @example "jamais-vu"
	 */
	slug: string
	/**
	 * @example 'Psychological States'
	 */
	category: EffectCategory
	/**
	 * @example ["cognitive", "psychological_stage"]
	 */
	tags?: EffectTag[]
	parameters?: EffectParameter[]
	/**
	 * @example "Jamais vu can be described as the sudden sensation that a previously known concept or currently-occurring situation is unfamiliar and being experienced for the very first time. This is often triggered despite the fact that during the experience of it, the person is rationally aware that the circumstances of the previous experience have definitely occurred."
	 */
	summary: string
	/**
	 * Markdown-formatted text.
	 * @example ["# Jamais vu", "**Jamais vu** can be described as the sudden sensation that a previously known concept or currently-occurring situation is unfamiliar and being experienced for the very first time. This is often triggered despite the fact that during the experience of it, the person is rationally aware that the circumstances of the previous experience have definitely occurred.", ...]
	 */
	description?: string[]
	/**
	 * @example "https://effectindex.com/effects/jamais-vu"
	 */
	see_also?: Effect[]

	/**  @example "https://effectindex.com/effects/jamais-vu" */
	effectindex?: string
	psychonautwiki?: string

	constructor(properties: EffectProperties) {
		Object.assign(this, properties)
		this.slug = slugify(this.name, { lower: true })
	}

	static fromJSON(json: EffectJSON): Effect {
		return new Effect(json)
	}

	toJSON(): EffectJSON {
		return { ...this }
	}
}

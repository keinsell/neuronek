import {
	EffectParameterOption,
	EffectParameterOptionProperties
} from './effect-parameter-value/effect-parameter-option.js'

/** Effect Parameter is used in complex effects such as "Autonomous entity" where occurance of such effect can be clasified in few different ways.  */
export interface EffectParameterProperties {
	name: string
	description?: string
	options: [EffectParameterOption]
}

export interface EffectParameterJSON {
	name: string
	description?: string
	options: [EffectParameterOptionProperties]
}

export class EffectParameter implements EffectParameterProperties {
	name: string
	description?: string
	options: [EffectParameterOption]

	constructor(properties: EffectParameter) {
		Object.assign(this, properties)
	}

	static fromJSON(object: EffectParameter): EffectParameter {
		return new EffectParameter(object)
	}

	toJSON(): EffectParameterJSON {
		return { ...this }
	}
}

export interface EffectParameterOptionProperties {
	title: string
	description?: string
}

export class EffectParameterOption implements EffectParameterOptionProperties {
	title: string
	description?: string

	constructor(properties: EffectParameterOptionProperties) {
		Object.assign(this, properties)
	}

	static fromJSON(object: EffectParameterOptionProperties): EffectParameterOption {
		return new EffectParameterOption(object)
	}

	toJSON(): EffectParameterOptionProperties {
		return { ...this }
	}
}

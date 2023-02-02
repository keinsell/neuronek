import { ValueObject } from '../../../common/value-object/value-object.js'

export interface ToxicityProperties {
	ld50?: string
	description?: string
}

/** Toxicity Table represents data related to individual toxicity of given substance, such entity provides information about lethal and potentially harmful dosages that are known for given substance. */
export class Toxicity extends ValueObject<ToxicityProperties> {
	constructor(properties: ToxicityProperties) {
		super(properties)
	}
}

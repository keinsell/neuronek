import { ValueObject } from '../../../common/value-object/value-object.js'
import {
	PsychoactiveClass,
	PsychoactiveClassDataset,
	PsychoactiveClassification
} from '../psychoactive-class/psychoactive-class.js'

export interface ClassMembershipProperties {
	/**
	 * Psychoactive class refers to the classification of a chemical compound based on its ability to affect the central nervous system and alter brain function, resulting in changes in perception, mood, consciousness, or behavior.
	 *
	 * @example "Stimulant"
	 */
	psychoactive_class?: PsychoactiveClassification[]
	/**
	 * Chemical class refers to the grouping of chemical compounds that have similar structural or functional characteristics. In chemistry, compounds are often classified based on their chemical makeup, such as their chemical formula, functional groups, or reactivity.
	 *
	 * @example "Phenethylamine"
	 */
	chemical_class?: string
}

/**
 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
 */
export class ClassMembership extends ValueObject<ClassMembershipProperties> {
	constructor(properties: ClassMembershipProperties) {
		super(properties)
	}

	get psychoactive_class(): PsychoactiveClass[] {
		const classes: PsychoactiveClass[] = []

		for (const item of this.properties.psychoactive_class || []) {
			classes.push(PsychoactiveClassDataset.get(item))
		}

		return classes
	}
}

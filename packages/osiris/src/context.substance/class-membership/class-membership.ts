import { PsychoactiveClass } from '../psychoactive-class/psychoactive-class.js'

/**
 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
 */
export class ClassMembership {
	/**
	 * Psychoactive class refers to the classification of a chemical compound based on its ability to affect the central nervous system and alter brain function, resulting in changes in perception, mood, consciousness, or behavior.
	 *
	 * @example "Stimulant"
	 */
	psychoactive_class?: PsychoactiveClass[]
	/**
	 * Chemical class refers to the grouping of chemical compounds that have similar structural or functional characteristics. In chemistry, compounds are often classified based on their chemical makeup, such as their chemical formula, functional groups, or reactivity.
	 *
	 * @example "Phenethylamine"
	 */
	chemical_class?: string

	private constructor(properties: { psychoactive_class?: PsychoactiveClass[]; chemical_class?: string }) {
		this.psychoactive_class = properties.psychoactive_class
		this.chemical_class = properties.chemical_class
	}

	static create(properties: { psychoactive_class?: PsychoactiveClass[]; chemical_class?: string }): ClassMembership {
		return new ClassMembership(properties)
	}
}

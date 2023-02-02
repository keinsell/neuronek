import { Entity } from '../../common/entity/entity.js'
import { Toxicity } from '../toxicity/toxicity.js'
import { ChemicalNomenclature } from './chemical-nomenclature/chemical-nomenclature.js'
import { ClassMembership } from './class-membership/class-membership.js'
import { ExternalReferences } from './external-references/external-references.js'
import { RouteOfAdministration } from './route-of-administration/route-of-administration.js'
import { Tolerance } from './tolerance/tolerance.js'

export interface SubstanceProperites {
	/**
	 * Most popular common name for the substance.
	 * @example "Amphetamine"
	 */
	name: string
	/**
	 * Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds vary depending on the type of compound, but in general, they are based on the type and number of atoms present in the compound, as well as the chemical bonds between them. The most common system of chemical nomenclature is the International Union of Pure and Applied Chemistry (IUPAC) system, which is widely used in scientific literature and in industry.
	 */
	nomenclature?: ChemicalNomenclature
	/**
	 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
	 */
	class_membership: ClassMembership
	/**
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	routes_of_administration: RouteOfAdministration[]
	tolerance?: Tolerance
	toxicity?: Toxicity
	externals?: ExternalReferences

	_subjective_effects?: string[]
	// interactions?: {}
	// pharmacology?: {}
}

/**
 * A psychoactive substance is a chemical substance—other than a nutrient or essential dietary ingredient—that alters brain function to produce temporary changes in sensation, perception, mood, consciousness, cognition, and behavior.
 *
 * Psychoactive substances have been used by humans for a variety of purposes since recorded history. For example, they may be used as medicine, as recreational substances for their euphoric effects and novelty value, as entheogens for ritual or spiritual purposes, or as scientific research probes for studying the brain and mind. The latter two have particular relevance for practitioners of psychonautics.
 */
export class Substance extends Entity<SubstanceProperites> {
	constructor(properties: SubstanceProperites, id?: string) {
		super(properties, id)
	}

	toJSON(): SubstanceProperites {
		return {
			...this.properties
		}
	}

	static fromJSON(json: SubstanceProperites): Substance {
		return new Substance({
			...json
		})
	}
}

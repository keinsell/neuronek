import { PsychoactiveClass } from '../../dataset/psychoactive-class/psychoactive-class.js'
import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table/route-of-administration-table.js'
import { RouteOfAdministration } from '../route-of-administration/route-of-administration.js'

/**
 * A psychoactive substance is a chemical substance—other than a nutrient or essential dietary ingredient—that alters brain function to produce temporary changes in sensation, perception, mood, consciousness, cognition, and behavior.
 *
 * Psychoactive substances have been used by humans for a variety of purposes since recorded history. For example, they may be used as medicine, as recreational substances for their euphoric effects and novelty value, as entheogens for ritual or spiritual purposes, or as scientific research probes for studying the brain and mind. The latter two have particular relevance for practitioners of psychonautics.
 */
export class Substance {
	name: string
	chemical_nomeclature?: {
		/**
		 * ...
		 * @example ["Amphetamine", "Speed", "Adderall", "Pep"]
		 */
		common_names?: string[]
		/**
		 * @example "α-Methylphenethylamine"
		 */
		substitutive_name?: string
		/**
		 * @example "(RS)-1-Phenylpropan-2-amine"
		 */
		systematic_name?: string
	}
	class_membership?: {
		/**
		 * @example "Stimulant"
		 */
		psychoactive_class?: PsychoactiveClass
		/**
		 * @example "Phenethylamine"
		 */
		chemical_class?: string
	}
	routes_of_administration: RouteOfAdministrationTable
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: {}
	toxicity?: {}
	harm_potential?: {}
	experiences?: {}

	constructor(substanceInfomration: {
		name: string
		common_names?: string[]
		substitutive_name?: string
		systematic_name?: string
		psychoactive_class?: PsychoactiveClass
		chemical_class?: string
		routes_of_administration: RouteOfAdministrationTable
		interactions?: {}
		pharmacology?: {}
		subjective_effects?: {}
		toxicity?: {}
		harm_potential?: {}
		experiences?: {}
	}) {
		this.name = substanceInfomration.name
		this.chemical_nomeclature = {
			common_names: substanceInfomration.common_names,
			substitutive_name: substanceInfomration.substitutive_name,
			systematic_name: substanceInfomration.systematic_name
		}
		this.class_membership = {
			psychoactive_class: substanceInfomration.psychoactive_class,
			chemical_class: substanceInfomration.chemical_class
		}
		this.routes_of_administration = substanceInfomration.routes_of_administration
		this.interactions = substanceInfomration.interactions
		this.pharmacology = substanceInfomration.pharmacology
		this.subjective_effects = substanceInfomration.subjective_effects
		this.toxicity = substanceInfomration.toxicity
		this.harm_potential = substanceInfomration.harm_potential
		this.experiences = substanceInfomration.experiences
	}
}

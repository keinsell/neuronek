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
		common_names: string[]
		/**
		 * @example "α-Methylphenethylamine"
		 */
		substitutive_name: string
		/**
		 * @example "(RS)-1-Phenylpropan-2-amine"
		 */
		systematic_name: string
	}
	class_membership?: {
		/**
		 * @example "Stimulant"
		 */
		psychoactive_class: string
		/**
		 * @example "Phenethylamine"
		 */
		chemical_class: string
	}
	routes_of_administration: RouteOfAdministration[]
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: {}
	toxicity?: {}
	harm_potential?: {}
	experiences?: {}
}

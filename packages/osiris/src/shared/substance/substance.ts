import { RouteOfAdministration } from '../route-of-administration/route-of-administration.js'

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

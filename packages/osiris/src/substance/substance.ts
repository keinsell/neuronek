import { PsychoactiveClassification } from '../psychoactive-class/psychoactive-class.js'
import {
	RouteOfAdministrationTable,
	RouteOfAdministrationTableJSON
} from '../route-of-administration/route-of-administration-table/route-of-administration-table.js'
import { Tolerance } from '../tolerance/tolerance.js'
import { ToxicityTable } from '../toxicity-table/toxicity-table.js'
import { ChemicalNomenclature, ChemicalNomenclatureProperties } from './chemical-nomenclature/chemical-nomenclature'
import { EffectPromotedBySubstance, EffectPromotedBySubstanceJSON } from './effect-promoted-by-substance.js'

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
	class_membership?: {
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
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	routes_of_administration?: RouteOfAdministrationTable
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: EffectPromotedBySubstance[]
	tolerance?: Tolerance
	toxicity?: ToxicityTable
	harm_potential?: {}
	experiences?: {}

	externals?: {
		psychonautwiki?: string
		tripsit?: string
		isomerdesign?: string
		bluelight?: string
		hyperreal?: string
		reddit?: string
		drugbank?: string
		wikipedia?: string
		erowid?: string
	}
}

export interface SubstanceJSON {
	/**
	 * Most popular common name for the substance.
	 * @example "Amphetamine"
	 */
	name: string
	/**
	 * Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds vary depending on the type of compound, but in general, they are based on the type and number of atoms present in the compound, as well as the chemical bonds between them. The most common system of chemical nomenclature is the International Union of Pure and Applied Chemistry (IUPAC) system, which is widely used in scientific literature and in industry.
	 */
	chemical_nomeclature?: ChemicalNomenclatureProperties
	/**
	 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
	 */
	class_membership?: {
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
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	routes_of_administration?: RouteOfAdministrationTableJSON
	subjective_effects?: EffectPromotedBySubstanceJSON[]

	externals?: {
		psychonautwiki?: string
		tripsit?: string
		isomerdesign?: string
		bluelight?: string
		hyperreal?: string
		reddit?: string
		drugbank?: string
		wikipedia?: string
		erowid?: string
	}
}

/**
 * A psychoactive substance is a chemical substance—other than a nutrient or essential dietary ingredient—that alters brain function to produce temporary changes in sensation, perception, mood, consciousness, cognition, and behavior.
 *
 * Psychoactive substances have been used by humans for a variety of purposes since recorded history. For example, they may be used as medicine, as recreational substances for their euphoric effects and novelty value, as entheogens for ritual or spiritual purposes, or as scientific research probes for studying the brain and mind. The latter two have particular relevance for practitioners of psychonautics.
 */
export class Substance implements SubstanceProperites {
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
	class_membership?: {
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
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	routes_of_administration?: RouteOfAdministrationTable
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: EffectPromotedBySubstance[]
	tolerance?: Tolerance
	toxicity?: ToxicityTable
	harm_potential?: {}
	experiences?: {}
	externals?: {
		psychonautwiki?: string
		tripsit?: string
		isomerdesign?: string
		bluelight?: string
		hyperreal?: string
		reddit?: string
		drugbank?: string
		wikipedia?: string
		erowid?: string
	}

	constructor(substanceInfomration: SubstanceProperites) {
		Object.assign(this, substanceInfomration)
	}

	toJSON(): SubstanceJSON {
		return {
			...this,
			routes_of_administration: this.routes_of_administration?.toJSON(),
			subjective_effects: this.subjective_effects?.map(effect => effect.toJSON())
		}
	}

	static fromJSON(json: SubstanceJSON): Substance {
		return new Substance({
			...json,
			nomenclature: json.chemical_nomeclature ? new ChemicalNomenclature(json.chemical_nomeclature) : undefined,
			routes_of_administration: RouteOfAdministrationTable.fromJSON(json.routes_of_administration),
			subjective_effects: json.subjective_effects?.map(effect => EffectPromotedBySubstance.fromJSON(effect))
		})
	}
}

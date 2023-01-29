import { Effect } from '../effect/effect.js'
import { PsychoactiveClassification } from '../psychoactive-class/psychoactive-class.js'
import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table/route-of-administration-table.js'
import { Tolerance } from '../tolerance/tolerance.js'
import { ToxicityTable } from '../toxicity-table/toxicity-table.js'
import { EffectPromotedBySubstance } from './effect-promoted-by-substance.js'

interface SubstanceProperites {
	/**
	 * Most popular common name for the substance.
	 * @example "Amphetamine"
	 */
	name: string
	/**
	 * Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds vary depending on the type of compound, but in general, they are based on the type and number of atoms present in the compound, as well as the chemical bonds between them. The most common system of chemical nomenclature is the International Union of Pure and Applied Chemistry (IUPAC) system, which is widely used in scientific literature and in industry.
	 */
	chemical_nomeclature?: {
		/**
		 * Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition.
		 *
		 * @example ["Amphetamine", "Speed", "Adderall", "Pep"]
		 */
		common_names?: string[]
		brand_names?: string[]
		/**
		 * Substitutive name is a type of chemical nomenclature used for organic compounds. In this system, the substitutive name of a compound is based on the name of the parent hydrocarbon, with the functional group (such as an alcohol or a carboxylic acid) indicated by a prefix or suffix.
		 *
		 * @example "α-Methylphenethylamine"
		 */
		substitutive_name?: string
		/**
		 * Systematic name is a type of chemical nomenclature used for both inorganic and organic compounds. In this system, the compound is named based on the type and number of atoms present, as well as the chemical bonds between them.
		 *
		 * The systematic naming of inorganic compounds follows the guidelines of the International Union of Pure and Applied Chemistry (IUPAC) and usually requires the use of oxidation numbers, prefixes and suffixes to indicate the oxidation state and stoichiometry of the compound.
		 *
		 * In the case of organic compounds, the systematic name is based on the parent hydrocarbon chain, with prefixes and suffixes indicating the position and nature of the functional groups present in the compound.
		 *
		 * @example "(RS)-1-Phenylpropan-2-amine"
		 */
		systematic_name?: string
		/**
		 * UNIIs are generated based on scientific identity characteristics using ISO 11238 data elements. UNII availability does not imply any regulatory review or approval. Synonyms and mappings are based on the best public information available at the time of publication. Please report any problems/errors associated with this data to FDA-SRS@fda.hhs.gov.
		 *
		 * @example "CK833KGX7E"
		 */
		unii?: string
		/**	CAS number is a unique numerical identifier assigned to pure substances and mixtures by the Chemical Abstracts Service registry, a division of the American Chemical Society (ACS). The CAS registry number is the de facto standard for the identification of chemical substances in scientific literature.
		 * @example "300-62-9"
		 */
		cas_number?: string
		/** InChI Key is ...
		 * @example "KWTSXDURSIMDCE-UHFFFAOYSA-N"
		 */
		inchi_key?: string
		/**
		 * IUPAC name is a common short-hand name for organic compounds. This name is used as a unique identifier in the Chemical Abstracts Service database, and is often used in lieu of a systematic name as a convenient shorthand for the compound.
		 * @example "1-phenylpropan-2-amine"
		 */
		iupac?: string
		/**
		 * SMILES is a chemical notation for describing the structure of chemical compounds using ASCII characters.
		 * @example "CC(N)CC1=CC=CC=C1"
		 */
		smiles?: string
	}
	/**
	 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
	 */
	class_membership: {
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
	routes_of_administration: RouteOfAdministrationTable
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: EffectPromotedBySubstance[]
	tolerance?: Tolerance
	toxicity?: ToxicityTable
	harm_potential?: {}
	experiences?: {}
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
	chemical_nomeclature?: {
		/**
		 * Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition.
		 *
		 * @example ["Amphetamine", "Speed", "Adderall", "Pep"]
		 */
		common_names?: string[]
		brand_names?: string[]
		/**
		 * Substitutive name is a type of chemical nomenclature used for organic compounds. In this system, the substitutive name of a compound is based on the name of the parent hydrocarbon, with the functional group (such as an alcohol or a carboxylic acid) indicated by a prefix or suffix.
		 *
		 * @example "α-Methylphenethylamine"
		 */
		substitutive_name?: string
		/**
		 * Systematic name is a type of chemical nomenclature used for both inorganic and organic compounds. In this system, the compound is named based on the type and number of atoms present, as well as the chemical bonds between them.
		 *
		 * The systematic naming of inorganic compounds follows the guidelines of the International Union of Pure and Applied Chemistry (IUPAC) and usually requires the use of oxidation numbers, prefixes and suffixes to indicate the oxidation state and stoichiometry of the compound.
		 *
		 * In the case of organic compounds, the systematic name is based on the parent hydrocarbon chain, with prefixes and suffixes indicating the position and nature of the functional groups present in the compound.
		 *
		 * @example "(RS)-1-Phenylpropan-2-amine"
		 */
		systematic_name?: string
		/**
		 * UNIIs are generated based on scientific identity characteristics using ISO 11238 data elements. UNII availability does not imply any regulatory review or approval. Synonyms and mappings are based on the best public information available at the time of publication. Please report any problems/errors associated with this data to FDA-SRS@fda.hhs.gov.
		 *
		 * @example "CK833KGX7E"
		 */
		unii?: string
		/**	CAS number is a unique numerical identifier assigned to pure substances and mixtures by the Chemical Abstracts Service registry, a division of the American Chemical Society (ACS). The CAS registry number is the de facto standard for the identification of chemical substances in scientific literature.
		 * @example "300-62-9"
		 */
		cas_number?: string
		/** InChI Key is ...
		 * @example "KWTSXDURSIMDCE-UHFFFAOYSA-N"
		 */
		inchi_key?: string
		/**
		 * IUPAC name is a common short-hand name for organic compounds. This name is used as a unique identifier in the Chemical Abstracts Service database, and is often used in lieu of a systematic name as a convenient shorthand for the compound.
		 * @example "1-phenylpropan-2-amine"
		 */
		iupac?: string
		/**
		 * SMILES is a chemical notation for describing the structure of chemical compounds using ASCII characters.
		 * @example "CC(N)CC1=CC=CC=C1"
		 */
		smiles?: string
	}
	/**
	 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
	 */
	class_membership: {
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
	routes_of_administration: RouteOfAdministrationTable
	interactions?: {}
	pharmacology?: {}
	subjective_effects?: EffectPromotedBySubstance[]
	tolerance?: Tolerance
	toxicity?: ToxicityTable
	harm_potential?: {}
	experiences?: {}

	constructor(substanceInfomration: SubstanceProperites) {
		Object.assign(this, substanceInfomration)
	}
}

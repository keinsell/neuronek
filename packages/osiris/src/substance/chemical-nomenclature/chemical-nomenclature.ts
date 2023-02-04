/**
 * Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds vary depending on the type of compound, but in general, they are based on the type and number of atoms present in the compound, as well as the chemical bonds between them. The most common system of chemical nomenclature is the International Union of Pure and Applied Chemistry (IUPAC) system, which is widely used in scientific literature and in industry.
 */
export class ChemicalNomenclature {
	/**
	 * Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition.
	 *
	 * @example ["Amphetamine", "Speed", "Adderall", "Pep"]
	 */
	common_names?: string[]
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
	 * IUPAC name is a common shorthand name for organic compounds. This name is used as a unique identifier in the Chemical Abstracts Service database, and is often used in lieu of a systematic name as a convenient shorthand for the compound.
	 * @example "1-phenylpropan-2-amine"
	 */
	iupac?: string
	/** SMILES is a chemical notation for describing the structure of chemical compounds using ASCII characters.
	 * @example "CC(N)CC1=CC=CC=C1" */
	smiles?: string

	private constructor(properties: {
		common_names?: string[]
		substitutive_name?: string
		systematic_name?: string
		unii?: string
		cas_number?: string
		inchi_key?: string
		iupac?: string
		smiles?: string
	}) {
		this.common_names = properties.common_names
		this.substitutive_name = properties.substitutive_name
		this.systematic_name = properties.systematic_name
		this.unii = properties.unii
		this.cas_number = properties.cas_number
		this.inchi_key = properties.inchi_key
		this.iupac = properties.iupac
		this.smiles = properties.smiles
	}

	static create(properties: {
		common_names?: string[]
		substitutive_name?: string
		systematic_name?: string
		unii?: string
		cas_number?: string
		inchi_key?: string
		iupac?: string
		smiles?: string
	}): ChemicalNomenclature {
		return new ChemicalNomenclature(properties)
	}

	/** Returns all possible names for selected compound. */
	get all() {
		return [...this.common_names, this.substitutive_name, this.systematic_name, this.iupac, this.smiles].filter(Boolean)
	}
}

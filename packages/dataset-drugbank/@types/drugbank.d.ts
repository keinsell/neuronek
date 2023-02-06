// To parse this data:
//
//   import { Convert, DrugbankD } from "./file";
//
//   const drugbankD = Convert.toDrugbankD(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DrugbankD {
	drugbank: Drugbank
}

export interface Drugbank {
	'@exported-on': Date
	'@version': string
	'@xmlns': string
	'@xmlns:xsi': string
	'@xsi:schemaLocation': string
	drug: DrugElement[]
}

export interface DrugElement {
	'@created': Date
	'@type': Type
	'@updated': Date
	absorption: null | string
	'affected-organisms': AffectedOrganisms | null
	'ahfs-codes': null
	'atc-codes': AtcCodes | null
	carriers: Carriers | null
	'cas-number': null | string
	categories: Categories | null
	classification?: Classification
	clearance: null | string
	description: null | string
	dosages: Dosages | null
	'drug-interactions': DrugInteractions | null
	'drugbank-id': Array<DrugbankIDClass | string> | DrugbankIDClass
	enzymes: DrugEnzymes | null
	'experimental-properties': Properties | null
	'external-identifiers': DrugExternalIdentifiers | null
	'external-links': ExternalLinks | null
	'food-interactions': FoodInteractions | null
	'general-references': GeneralReferencesClass
	groups: Groups
	'half-life': null | string
	indication: null | string
	'international-brands': InternationalBrands | null
	manufacturers: Manufacturers | null
	'mechanism-of-action': null | string
	metabolism: null | string
	mixtures: Mixtures | null
	name: string
	packagers: Packagers | null
	patents: Patents | null
	pathways: Pathways | null
	'pdb-entries': PdbEntries | null
	pharmacodynamics: null | string
	prices: Prices | null
	products: Products | null
	'protein-binding': null | string
	reactions: Reactions | null
	'route-of-elimination': null | string
	salts: Salts | null
	sequences?: Sequences | null
	'snp-adverse-drug-reactions': SnpAdverseDrugReactions | null
	'snp-effects': SnpEffects | null
	state?: State
	synonyms: DrugSynonyms | null
	'synthesis-reference': null | string
	targets: Targets | null
	toxicity: null | string
	transporters: Transporters | null
	unii: null | string
	'volume-of-distribution': null | string
	'fda-label'?: string
	msds?: string
	'average-mass'?: string
	'calculated-properties'?: Properties | null
	'monoisotopic-mass'?: string
}

export enum Type {
	Biotech = 'biotech',
	SmallMolecule = 'small molecule'
}

export interface AffectedOrganisms {
	'affected-organism': string[] | string
}

export interface AtcCodes {
	'atc-code': AtcCodeElement[] | AtcCodeElement
}

export interface AtcCodeElement {
	'@code': string
	level: Level
}

export interface Level {
	'#text': Text
	'@code': Code
}

export enum Text {
	AlimentaryTractAndMetabolism = 'ALIMENTARY TRACT AND METABOLISM',
	AntiinfectivesForSystemicUse = 'ANTIINFECTIVES FOR SYSTEMIC USE',
	AntineoplasticAndImmunomodulatingAgents = 'ANTINEOPLASTIC AND IMMUNOMODULATING AGENTS',
	AntiparasiticProductsInsecticidesAndRepellents = 'ANTIPARASITIC PRODUCTS, INSECTICIDES AND REPELLENTS',
	BloodAndBloodFormingOrgans = 'BLOOD AND BLOOD FORMING ORGANS',
	CardiovascularSystem = 'CARDIOVASCULAR SYSTEM',
	Dermatologicals = 'DERMATOLOGICALS',
	GenitoUrinarySystemAndSexHormones = 'GENITO URINARY SYSTEM AND SEX HORMONES',
	MusculoSkeletalSystem = 'MUSCULO-SKELETAL SYSTEM',
	NervousSystem = 'NERVOUS SYSTEM',
	RespiratorySystem = 'RESPIRATORY SYSTEM',
	SensoryOrgans = 'SENSORY ORGANS',
	SystemicHormonalPreparationsExclSexHormonesAndInsulins = 'SYSTEMIC HORMONAL PREPARATIONS, EXCL. SEX HORMONES AND INSULINS',
	Various = 'VARIOUS'
}

export enum Code {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	G = 'G',
	H = 'H',
	J = 'J',
	L = 'L',
	M = 'M',
	N = 'N',
	P = 'P',
	R = 'R',
	S = 'S',
	V = 'V'
}

export interface Properties {
	property: PropertyElement[] | PropertyElement
}

export interface PropertyElement {
	kind: Kind
	source: null | string
	value: string
}

export enum Kind {
	Bioavailability = 'Bioavailability',
	BoilingPoint = 'Boiling Point',
	Caco2Permeability = 'caco2 Permeability',
	GhoseFilter = 'Ghose Filter',
	HBondAcceptorCount = 'H Bond Acceptor Count',
	HBondDonorCount = 'H Bond Donor Count',
	Hydrophobicity = 'Hydrophobicity',
	IUPACName = 'IUPAC Name',
	InChI = 'InChI',
	InChIKey = 'InChIKey',
	IsoelectricPoint = 'Isoelectric Point',
	LogP = 'logP',
	LogS = 'logS',
	MDDRLikeRule = 'MDDR-Like Rule',
	MeltingPoint = 'Melting Point',
	MolecularFormula = 'Molecular Formula',
	MolecularWeight = 'Molecular Weight',
	MonoisotopicWeight = 'Monoisotopic Weight',
	NumberOfRings = 'Number of Rings',
	PKa = 'pKa',
	PKaStrongestAcidic = 'pKa (strongest acidic)',
	PKaStrongestBasic = 'pKa (strongest basic)',
	PhysiologicalCharge = 'Physiological Charge',
	PolarSurfaceAreaPSA = 'Polar Surface Area (PSA)',
	Polarizability = 'Polarizability',
	Radioactivity = 'Radioactivity',
	Refractivity = 'Refractivity',
	RotatableBondCount = 'Rotatable Bond Count',
	RuleOfFive = 'Rule of Five',
	Smiles = 'SMILES',
	TraditionalIUPACName = 'Traditional IUPAC Name',
	WaterSolubility = 'Water Solubility'
}

export interface Carriers {
	carrier: CarrierElement[] | PurpleCarrier
}

export interface CarrierElement {
	'@position': string
	actions: Actions | null
	id: string
	'known-action': KnownAction
	name: string
	organism: TransporterOrganism
	polypeptide?: PurplePolypeptide[] | FluffyPolypeptide
	references: CarrierReferences
}

export interface Actions {
	action: ActionElement[] | ActionElement
}

export enum ActionElement {
	Activator = 'activator',
	Adduct = 'adduct',
	Agonist = 'agonist',
	AllostericModulator = 'allosteric modulator',
	Antagonist = 'antagonist',
	Antibody = 'antibody',
	AntisenseOligonucleotide = 'antisense oligonucleotide',
	Binder = 'binder',
	Binding = 'binding',
	Blocker = 'blocker',
	Carrier = 'carrier',
	Chaperone = 'chaperone',
	Chelator = 'chelator',
	Cleavage = 'cleavage',
	Cofactor = 'cofactor',
	ComponentOf = 'component of',
	CrossLinkingAlkylation = 'cross-linking/alkylation',
	Degradation = 'degradation',
	Disruptor = 'disruptor',
	Downregulator = 'downregulator',
	GeneReplacement = 'gene replacement',
	Inactivator = 'inactivator',
	IncorporationIntoAndDestabilization = 'incorporation into and destabilization',
	Inducer = 'inducer',
	InhibitionOfSynthesis = 'inhibition of synthesis',
	Inhibitor = 'inhibitor',
	InhibitoryAllostericModulator = 'inhibitory allosteric modulator',
	InhibitsDownstreamInflammationCascades = 'inhibits downstream inflammation cascades',
	Intercalation = 'intercalation',
	InverseAgonist = 'inverse agonist',
	Ligand = 'ligand',
	Metabolizer = 'metabolizer',
	Modulator = 'modulator',
	Multitarget = 'multitarget',
	NegativeModulator = 'negative modulator',
	Neutralizer = 'neutralizer',
	NucleotideExchangeBlocker = 'nucleotide exchange blocker',
	Other = 'other',
	OtherUnknown = 'other/unknown',
	Oxidizer = 'oxidizer',
	PartialAgonist = 'partial agonist',
	PartialAntagonist = 'partial antagonist',
	PositiveAllostericModulator = 'positive allosteric modulator',
	Potentiator = 'potentiator',
	ProductOf = 'product of',
	Protector = 'protector',
	Reducer = 'reducer',
	Regulator = 'regulator',
	Stabilization = 'stabilization',
	Stimulator = 'stimulator',
	Substrate = 'substrate',
	Suppressor = 'suppressor',
	TranslocationInhibitor = 'translocation inhibitor',
	Transporter = 'transporter',
	Unknown = 'unknown',
	WeakInhibitor = 'weak inhibitor'
}

export enum KnownAction {
	No = 'no',
	Unknown = 'unknown',
	Yes = 'yes'
}

export enum TransporterOrganism {
	EscherichiaColiStrainK12 = 'Escherichia coli (strain K12)',
	Humans = 'Humans',
	Mouse = 'Mouse',
	TrichophytonInterdigitaleStrainMR816 = 'Trichophyton interdigitale (strain MR816)'
}

export interface PurplePolypeptide {
	'@id': string
	'@source': Source
	'amino-acid-sequence': Sequence
	'cellular-location': CellularLocation | null
	'chromosome-location': null | string
	'external-identifiers': PolypeptideExternalIdentifiers
	'gene-name': null | string
	'gene-sequence': Sequence
	'general-function': null | string
	'go-classifiers': PurpleGoClassifiers | null
	locus: null | string
	'molecular-weight': null | string
	name: string
	organism: OrganismClass
	pfams: PurplePfams | null
	'signal-regions': SignalRegions | null
	'specific-function': null | string
	synonyms: PolypeptideSynonyms | null
	'theoretical-pi': null | string
	'transmembrane-regions': null | string
}

export enum Source {
	SwissProt = 'Swiss-Prot',
	TrEMBL = 'TrEMBL'
}

export interface Sequence {
	'#text'?: string
	'@format': Format
}

export enum Format {
	Fasta = 'FASTA'
}

export enum CellularLocation {
	ApicalCellMembrane = 'Apical cell membrane',
	BasalCellMembrane = 'Basal cell membrane',
	BasolateralCellMembrane = 'Basolateral cell membrane',
	CellInnerMembrane = 'Cell inner membrane',
	CellInnerMembraneMultiPassMembraneProtein = 'Cell inner membrane; multi-pass membrane protein',
	CellInnerMembranePeripheralMembraneProtein = 'Cell inner membrane; peripheral membrane protein',
	CellJunction = 'Cell junction',
	CellMembrane = 'Cell membrane',
	CellOuterMembrane = 'Cell outer membrane',
	CellProjection = 'Cell projection',
	CellSurface = 'Cell surface',
	CellularChromatophoreMembrane = 'Cellular chromatophore membrane',
	CellularThylakoidMembrane = 'Cellular thylakoid membrane',
	Chromosome = 'Chromosome',
	Cytoplasm = 'Cytoplasm',
	CytoplasmBySimilarity = 'Cytoplasm (By similarity)',
	Cytoplasmic = 'Cytoplasmic',
	CytoplasmicGranule = 'Cytoplasmic granule',
	CytoplasmicVesicle = 'Cytoplasmic vesicle',
	CytoplasmicVesicleMembrane = 'Cytoplasmic vesicle membrane',
	EarlyEndosome = 'Early endosome',
	EarlyEndosomeMembrane = 'Early endosome membrane',
	EndomembraneSystem = 'Endomembrane system',
	EndoplasmicReticulum = 'Endoplasmic reticulum',
	EndoplasmicReticulumGolgiIntermediateCompartment = 'Endoplasmic reticulum-Golgi intermediate compartment',
	EndoplasmicReticulumGolgiIntermediateCompartmentMembrane = 'Endoplasmic reticulum-Golgi intermediate compartment membrane',
	EndoplasmicReticulumLumen = 'Endoplasmic reticulum lumen',
	EndoplasmicReticulumMembrane = 'Endoplasmic reticulum membrane',
	EndosomeMembrane = 'Endosome membrane',
	Fimbrium = 'Fimbrium',
	Glycosome = 'Glycosome',
	GolgiApparatus = 'Golgi apparatus',
	GolgiApparatusLumen = 'Golgi apparatus lumen',
	GolgiApparatusMembrane = 'Golgi apparatus membrane',
	HostCellMembrane = 'Host cell membrane',
	HostCytoplasm = 'Host cytoplasm',
	HostEndoplasmicReticulumMembrane = 'Host endoplasmic reticulum membrane',
	HostGolgiApparatusMembrane = 'Host Golgi apparatus membrane',
	HostMembrane = 'Host membrane',
	HostNucleus = 'Host nucleus',
	LateEndosomeMembrane = 'Late endosome membrane',
	LateralCellMembrane = 'Lateral cell membrane',
	Lysosome = 'Lysosome',
	LysosomeMembrane = 'Lysosome membrane',
	Melanosome = 'Melanosome',
	MelanosomeMembrane = 'Melanosome membrane',
	Membrane = 'Membrane',
	Microsome = 'Microsome',
	MicrosomeMembrane = 'Microsome membrane',
	Midbody = 'Midbody',
	Mitochondrion = 'Mitochondrion',
	MitochondrionInnerMembrane = 'Mitochondrion inner membrane',
	MitochondrionIntermembraneSpace = 'Mitochondrion intermembrane space',
	MitochondrionMatrix = 'Mitochondrion matrix',
	MitochondrionMembrane = 'Mitochondrion membrane',
	MitochondrionOuterMembrane = 'Mitochondrion outer membrane',
	Nucleus = 'Nucleus',
	NucleusEnvelope = 'Nucleus envelope',
	NucleusInnerMembrane = 'Nucleus inner membrane',
	NucleusMatrix = 'Nucleus matrix',
	NucleusMembrane = 'Nucleus membrane',
	NucleusOuterMembrane = 'Nucleus outer membrane',
	NucleusSpeckle = 'Nucleus speckle',
	ParasitophorousVacuoleMembrane = 'Parasitophorous vacuole membrane',
	Periplasm = 'Periplasm',
	Peroxisome = 'Peroxisome',
	PeroxisomeMembrane = 'Peroxisome membrane',
	Plastid = 'Plastid',
	RecyclingEndosomeMembrane = 'Recycling endosome membrane',
	RoughEndoplasmicReticulum = 'Rough endoplasmic reticulum',
	RoughEndoplasmicReticulumMembrane = 'Rough endoplasmic reticulum membrane',
	SarcoplasmicReticulum = 'Sarcoplasmic reticulum',
	SarcoplasmicReticulumLumen = 'Sarcoplasmic reticulum lumen',
	SarcoplasmicReticulumMembrane = 'Sarcoplasmic reticulum membrane',
	Secreted = 'Secreted',
	Vacuole = 'Vacuole',
	VacuoleMembrane = 'Vacuole membrane',
	Virion = 'Virion',
	VirionMembrane = 'Virion membrane'
}

export interface PolypeptideExternalIdentifiers {
	'external-identifier': ExternalIdentifierElement[]
}

export interface ExternalIdentifierElement {
	identifier: string
	resource: ExternalIdentifierResource
}

export enum ExternalIdentifierResource {
	BindingDB = 'BindingDB',
	ChEBI = 'ChEBI',
	ChEMBL = 'ChEMBL',
	ChemSpider = 'ChemSpider',
	DrugsProductDatabaseDPD = 'Drugs Product Database (DPD)',
	GenAtlas = 'GenAtlas',
	GenBank = 'GenBank',
	GenBankGeneDatabase = 'GenBank Gene Database',
	GenBankProteinDatabase = 'GenBank Protein Database',
	GuideToPharmacology = 'Guide to Pharmacology',
	HUGOGeneNomenclatureCommitteeHGNC = 'HUGO Gene Nomenclature Committee (HGNC)',
	Iuphar = 'IUPHAR',
	KEGGCompound = 'KEGG Compound',
	KEGGDrug = 'KEGG Drug',
	Pdb = 'PDB',
	PharmGKB = 'PharmGKB',
	PubChemCompound = 'PubChem Compound',
	PubChemSubstance = 'PubChem Substance',
	RxCUI = 'RxCUI',
	TherapeuticTargetsDatabase = 'Therapeutic Targets Database',
	UniProtAccession = 'UniProt Accession',
	UniProtKB = 'UniProtKB',
	Wikipedia = 'Wikipedia',
	Zinc = 'ZINC'
}

export interface PurpleGoClassifiers {
	'go-classifier': GoClassifierElement[] | GoClassifierElement
}

export interface GoClassifierElement {
	category: GoClassifierCategory
	description: string
}

export enum GoClassifierCategory {
	Component = 'component',
	Function = 'function',
	Process = 'process'
}

export interface OrganismClass {
	'#text': string
	'@ncbi-taxonomy-id': string
}

export interface PurplePfams {
	pfam: PfamElement[] | PfamElement
}

export interface PfamElement {
	identifier: string
	name: string
}

export enum SignalRegions {
	The1 = '1-',
	The112 = '1-12',
	The113 = '1-13',
	The114 = '1-14',
	The115 = '1-15',
	The116 = '1-16',
	The117 = '1-17',
	The118 = '1-18',
	The119 = '1-19',
	The120 = '1-20',
	The121 = '1-21',
	The122 = '1-22',
	The123 = '1-23',
	The124 = '1-24',
	The125 = '1-25',
	The126 = '1-26',
	The127 = '1-27',
	The128 = '1-28',
	The129 = '1-29',
	The130 = '1-30',
	The131 = '1-31',
	The132 = '1-32',
	The133 = '1-33',
	The134 = '1-34',
	The135 = '1-35',
	The136 = '1-36',
	The137 = '1-37',
	The138 = '1-38',
	The139 = '1-39',
	The1392139 = '1-39\n21-39',
	The140 = '1-40',
	The141 = '1-41',
	The142 = '1-42',
	The143 = '1-43',
	The144 = '1-44',
	The145 = '1-45',
	The146 = '1-46',
	The147 = '1-47',
	The148 = '1-48',
	The149 = '1-49',
	The151 = '1-51',
	The152 = '1-52',
	The155 = '1-55',
	The157 = '1-57',
	The165 = '1-65',
	The18 = '1-8',
	The2 = '2-',
	The265280 = '265-280'
}

export interface PolypeptideSynonyms {
	synonym: string[] | string
}

export interface FluffyPolypeptide {
	'@id': string
	'@source': Source
	'amino-acid-sequence': Sequence
	'cellular-location': CellularLocation | null
	'chromosome-location': null | string
	'external-identifiers': PolypeptideExternalIdentifiers
	'gene-name': null | string
	'gene-sequence': Sequence
	'general-function': null | string
	'go-classifiers': FluffyGoClassifiers
	locus: null | string
	'molecular-weight': string
	name: string
	organism: OrganismClass
	pfams: PurplePfams | null
	'signal-regions': SignalRegions | null
	'specific-function': null | string
	synonyms: PolypeptideSynonyms | null
	'theoretical-pi': null | string
	'transmembrane-regions': null | string
}

export interface FluffyGoClassifiers {
	'go-classifier': GoClassifierElement[]
}

export interface CarrierReferences {
	articles: Articles | null
	attachments: PurpleAttachments | null
	links: Links | null
	textbooks: PurpleTextbooks | null
}

export interface Articles {
	article: ArticleElement[] | ArticleElement
}

export interface ArticleElement {
	citation: string
	'pubmed-id': null | string
	'ref-id': string
}

export interface PurpleAttachments {
	attachment: AttachmentElement
}

export interface AttachmentElement {
	'ref-id': string
	title: string
	url: string
}

export interface Links {
	link: AttachmentElement[] | AttachmentElement
}

export interface PurpleTextbooks {
	textbook: TextbookElement
}

export interface TextbookElement {
	citation: string
	isbn: null | string
	'ref-id': string
}

export interface PurpleCarrier {
	'@position': string
	actions: Actions | null
	id: string
	'known-action': KnownAction
	name: string
	organism: PurpleOrganism
	polypeptide?: FluffyPolypeptide[] | FluffyPolypeptide
	references: CarrierReferences
}

export enum PurpleOrganism {
	Humans = 'Humans',
	Rat = 'Rat'
}

export interface Categories {
	category: CategoryElement[] | CategoryElement
}

export interface CategoryElement {
	category: string
	'mesh-id': null | string
}

export interface Classification {
	class: null | string
	description: null | string
	'direct-parent': string
	kingdom: Kingdom
	subclass: null | string
	superclass: Superclass | null
	'alternative-parent'?: string[] | string
	substituent?: string[] | string
}

export enum Kingdom {
	InorganicCompounds = 'Inorganic compounds',
	KingdomOrganicCompounds = 'Organic compounds',
	OrganicCompounds = 'Organic Compounds'
}

export enum Superclass {
	AlkaloidsAndDerivatives = 'Alkaloids and derivatives',
	Benzenoids = 'Benzenoids',
	HomogeneousMetalCompounds = 'Homogeneous metal compounds',
	HomogeneousNonMetalCompounds = 'Homogeneous non-metal compounds',
	HydrocarbonDerivatives = 'Hydrocarbon derivatives',
	Hydrocarbons = 'Hydrocarbons',
	InorganicSalts = 'Inorganic salts',
	LignansNeolignansAndRelatedCompounds = 'Lignans, neolignans and related compounds',
	LipidsAndLipidLikeMolecules = 'Lipids and lipid-like molecules',
	MixedMetalNonMetalCompounds = 'Mixed metal/non-metal compounds',
	NucleosidesNucleotidesAndAnalogues = 'Nucleosides, nucleotides, and analogues',
	Organic13DipolarCompounds = 'Organic 1,3-dipolar compounds',
	OrganicAcids = 'Organic Acids',
	OrganicAcidsAndDerivatives = 'Organic acids and derivatives',
	OrganicNitrogenCompounds = 'Organic nitrogen compounds',
	OrganicOxygenCompounds = 'Organic oxygen compounds',
	OrganicPolymers = 'Organic Polymers',
	OrganicSalts = 'Organic salts',
	OrganohalogenCompounds = 'Organohalogen compounds',
	OrganoheterocyclicCompounds = 'Organoheterocyclic compounds',
	OrganometallicCompounds = 'Organometallic compounds',
	OrganophosphorusCompounds = 'Organophosphorus compounds',
	OrganosulfurCompounds = 'Organosulfur compounds',
	PhenylpropanoidsAndPolyketides = 'Phenylpropanoids and polyketides'
}

export interface Dosages {
	dosage: DosageElement[] | DosageElement
}

export interface DosageElement {
	form: null | string
	route: null | string
	strength: null | string
}

export interface DrugInteractions {
	'drug-interaction': DrugInteractionElement[] | DrugInteractionElement
}

export interface DrugInteractionElement {
	description: string
	'drugbank-id': string
	name: string
}

export interface DrugbankIDClass {
	'#text': string
	'@primary': string
}

export interface DrugEnzymes {
	enzyme: PurpleEnzyme[] | FluffyEnzyme
}

export interface PurpleEnzyme {
	'@position': string
	actions: Actions | null
	id: string
	'induction-strength': TionStrength | null
	'inhibition-strength': TionStrength | null
	'known-action': KnownAction
	name: string
	organism: null | string
	polypeptide?: FluffyPolypeptide[] | PurplePolypeptide
	references: GeneralReferencesClass
}

export enum TionStrength {
	Moderate = 'moderate',
	Strong = 'strong',
	Unknown = 'unknown',
	Weak = 'weak'
}

export interface GeneralReferencesClass {
	articles: Articles | null
	attachments: GeneralReferencesAttachments | null
	links: Links | null
	textbooks: GeneralReferencesTextbooks | null
}

export interface GeneralReferencesAttachments {
	attachment: AttachmentElement[] | AttachmentElement
}

export interface GeneralReferencesTextbooks {
	textbook: TextbookElement[] | TextbookElement
}

export interface FluffyEnzyme {
	'@position': string
	actions: Actions | null
	id: string
	'induction-strength': TionStrength | null
	'inhibition-strength': TionStrength | null
	'known-action': KnownAction
	name: string
	organism: EnzymeOrganism
	polypeptide?: FluffyPolypeptide[] | PurplePolypeptide
	references: PurpleReferences
}

export enum EnzymeOrganism {
	AlcaligenesSP = 'Alcaligenes sp.',
	BacillusLicheniformis = 'Bacillus licheniformis',
	BacillusSPStrainOY12 = 'Bacillus sp. (strain OY1-2)',
	BacteroidesThetaiotaomicron = 'Bacteroides thetaiotaomicron',
	EnterobacterCloacae = 'Enterobacter cloacae',
	EscherichiaColi = 'Escherichia coli',
	EscherichiaColiO1K1APEC = 'Escherichia coli O1:K1 / APEC',
	Humans = 'Humans',
	MycobacteriumTuberculosis = 'Mycobacterium tuberculosis',
	PseudomonasFluorescens = 'Pseudomonas fluorescens',
	StaphylococcusAureus = 'Staphylococcus aureus',
	TrypanosomaCruzi = 'Trypanosoma cruzi',
	ZymomonasMobilisSubspMobilisStrainATCC31821ZM4CP4 = 'Zymomonas mobilis subsp. mobilis (strain ATCC 31821 / ZM4 / CP4)'
}

export interface PurpleReferences {
	articles: Articles | null
	attachments: GeneralReferencesAttachments | null
	links: Links | null
	textbooks: PurpleTextbooks | null
}

export interface DrugExternalIdentifiers {
	'external-identifier': ExternalIdentifierElement[] | ExternalIdentifierElement
}

export interface ExternalLinks {
	'external-link': ExternalLinkElement[] | ExternalLinkElement
}

export interface ExternalLinkElement {
	resource: ExternalLinkResource
	url: string
}

export enum ExternalLinkResource {
	DrugsCOM = 'Drugs.com',
	PDRhealth = 'PDRhealth',
	RxList = 'RxList'
}

export interface FoodInteractions {
	'food-interaction': string[] | string
}

export interface Groups {
	group: GroupElement[] | GroupElement
}

export enum GroupElement {
	Approved = 'approved',
	Experimental = 'experimental',
	Illicit = 'illicit',
	Investigational = 'investigational',
	Nutraceutical = 'nutraceutical',
	VetApproved = 'vet_approved',
	Withdrawn = 'withdrawn'
}

export interface InternationalBrands {
	'international-brand': InternationalBrandElement[] | InternationalBrandElement
}

export interface InternationalBrandElement {
	company: null | string
	name: string
}

export interface Manufacturers {
	manufacturer: Manufacturer
}

export interface Manufacturer {
	'#text': string
	'@generic': string
	'@url': string
}

export interface Mixtures {
	mixture: MixtureElement[] | MixtureElement
}

export interface MixtureElement {
	ingredients: string
	name: string
}

export interface Packagers {
	packager: PackagerElement[] | PackagerElement
}

export interface PackagerElement {
	name: string
	url: null | string
}

export interface Patents {
	patent: PatentElement[] | PatentElement
}

export interface PatentElement {
	approved: Date
	country: Country
	expires: Date
	number: string
	'pediatric-extension': string
}

export enum Country {
	Canada = 'Canada',
	UnitedStates = 'United States'
}

export interface Pathways {
	pathway: PathwayElement[] | PathwayElement
}

export interface PathwayElement {
	category: PathwayCategory
	drugs: Drugs
	enzymes: PathwayEnzymes | null
	name: string
	'smpdb-id': string
}

export enum PathwayCategory {
	Disease = 'disease',
	DrugAction = 'drug_action',
	DrugMetabolism = 'drug_metabolism',
	Metabolic = 'metabolic',
	Physiological = 'physiological',
	Signaling = 'signaling'
}

export interface Drugs {
	drug: LeftElement[] | LeftElement
}

export interface LeftElement {
	'drugbank-id': string
	name: string
}

export interface PathwayEnzymes {
	'uniprot-id': string[] | string
}

export interface PdbEntries {
	'pdb-entry': string[] | string
}

export interface Prices {
	price: PriceElement[] | PriceElement
}

export interface PriceElement {
	cost: Cost
	description: string
	unit: Unit
}

export interface Cost {
	'#text': string
	'@currency': Currency
}

export enum Currency {
	Usd = 'USD'
}

export enum Unit {
	Ampul = 'ampul',
	Ampule = 'ampule',
	Bottle = 'bottle',
	Box = 'box',
	Can = 'can',
	Caplet = 'caplet',
	Capsule = 'capsule',
	Cartridge = 'cartridge',
	Container = 'container',
	Cup = 'cup',
	Device = 'device',
	Disk = 'disk',
	Disp = 'disp',
	DispersibleTablet = 'dispersible tablet',
	Dose = 'dose',
	Ea = 'ea',
	Each = 'each',
	Enema = 'enema',
	G = 'g',
	Gel = 'gel',
	GelCapsule = 'gel capsule',
	Gm = 'gm',
	Implant = 'implant',
	Inhaler = 'inhaler',
	Insert = 'insert',
	Jar = 'jar',
	Kit = 'kit',
	Liquid = 'liquid',
	Lollipop = 'lollipop',
	Lozenge = 'lozenge',
	MeteredDoseAerosol = 'metered dose aerosol',
	Ml = 'ml',
	Pack = 'pack',
	Package = 'package',
	Packet = 'packet',
	Patch = 'patch',
	Pellet = 'pellet',
	Pen = 'pen',
	Plastic = 'plastic',
	Powder = 'powder',
	Redipen = 'redipen',
	Ring = 'ring',
	SoftgelCapsule = 'softgel capsule',
	SoftgetCapsule = 'softget capsule',
	Solution = 'solution',
	Spray = 'spray',
	Strip = 'strip',
	Suppository = 'suppository',
	Swab = 'swab',
	Syringe = 'syringe',
	Syrup = 'syrup',
	Tab = 'tab',
	Tablet = 'tablet',
	Troche = 'troche',
	Tube = 'tube',
	Vial = 'vial'
}

export interface Products {
	product: { [key: string]: null | string }[] | { [key: string]: null | string }
}

export interface Reactions {
	reaction: PurpleReaction[] | PurpleReaction
}

export interface PurpleReaction {
	enzymes: ReactionEnzymes | null
	'left-element': LeftElement
	'right-element': LeftElement
	sequence: string
}

export interface ReactionEnzymes {
	enzyme: TentacledEnzyme[] | TentacledEnzyme
}

export interface TentacledEnzyme {
	'drugbank-id': string
	name: string
	'uniprot-id': null | string
}

export interface Salts {
	salt: SaltElement[] | SaltElement
}

export interface SaltElement {
	'average-mass'?: string
	'cas-number': null | string
	'drugbank-id': DrugbankIDClass
	inchikey: null | string
	'monoisotopic-mass'?: string
	name: string
	unii: null | string
}

export interface Sequences {
	sequence: Sequence
}

export interface SnpAdverseDrugReactions {
	reaction: EffectElement[] | EffectElement
}

export interface EffectElement {
	'adverse-reaction'?: null | string
	allele: null | string
	description: string
	'gene-symbol': string
	'protein-name': string
	'pubmed-id': null | string
	'rs-id': null | string
	'uniprot-id': string
	'defining-change'?: string
}

export interface SnpEffects {
	effect: EffectElement[] | EffectElement
}

export enum State {
	Gas = 'gas',
	Liquid = 'liquid',
	Solid = 'solid'
}

export interface DrugSynonyms {
	synonym: Synonym
}

export interface Synonym {
	'#text': string
	'@coder': Coder
	'@language': Language
}

export enum Coder {
	Ban = 'ban',
	BanJanUsp = 'ban/jan/usp',
	BanUsan = 'ban/usan',
	BanUsp = 'ban/usp',
	Dcf = 'dcf',
	Dcit = 'dcit',
	Empty = '',
	Inn = 'inn',
	InnBan = 'inn/ban',
	InnBanDcf = 'inn/ban/dcf',
	InnBanJan = 'inn/ban/jan',
	InnBanJanUsan = 'inn/ban/jan/usan',
	InnBanJanUsanUsp = 'inn/ban/jan/usan/usp',
	InnBanUsan = 'inn/ban/usan',
	InnBanUsanUsp = 'inn/ban/usan/usp',
	InnDcit = 'inn/dcit',
	InnJan = 'inn/jan',
	InnJanUsan = 'inn/jan/usan',
	InnJanUsanUsp = 'inn/jan/usan/usp',
	InnJanUsp = 'inn/jan/usp',
	InnUsan = 'inn/usan',
	InnUsanUsp = 'inn/usan/usp',
	InnUsp = 'inn/usp',
	Iupac = 'iupac',
	IupacJanUsp = 'iupac/jan/usp',
	Jan = 'jan',
	JanUsan = 'jan/usan',
	JanUsanUsp = 'jan/usan/usp',
	JanUsp = 'jan/usp',
	Usan = 'usan',
	UsanUsp = 'usan/usp',
	Usp = 'usp'
}

export enum Language {
	Czech = 'czech',
	Dutch = 'dutch',
	English = 'english',
	EnglishFrench = 'english/french',
	EnglishGerman = 'english/german',
	EnglishLatin = 'english/latin',
	EnglishSpanish = 'english/spanish',
	EnglishSpanishFrench = 'english/spanish/french',
	EnglishSpanishFrenchGerman = 'english/spanish/french/german',
	French = 'french',
	German = 'german',
	Italian = 'italian',
	Latin = 'latin',
	Polish = 'polish',
	Spanish = 'spanish',
	SpanishFrenchGerman = 'spanish/french/german'
}

export interface Targets {
	target: TargetElement[] | TargetElement
}

export interface TargetElement {
	'@position': string
	actions: Actions | null
	id: string
	'known-action': KnownAction
	name: string
	organism: null | string
	polypeptide?: PurplePolypeptide[] | PurplePolypeptide
	references: GeneralReferencesClass
}

export interface Transporters {
	transporter: TransporterElement[] | PurpleTransporter
}

export interface TransporterElement {
	'@position': string
	actions: Actions | null
	id: string
	'known-action': KnownAction
	name: string
	organism: string
	polypeptide?: FluffyPolypeptide[] | FluffyPolypeptide
	references: PurpleReferences
}

export interface PurpleTransporter {
	'@position': string
	actions: Actions | null
	id: string
	'known-action': KnownAction
	name: string
	organism: TransporterOrganism
	polypeptide: TentacledPolypeptide[] | FluffyPolypeptide
	references: CarrierReferences
}

export interface TentacledPolypeptide {
	'@id': string
	'@source': Source
	'amino-acid-sequence': Sequence
	'cellular-location': CellularLocation
	'chromosome-location': string
	'external-identifiers': PolypeptideExternalIdentifiers
	'gene-name': string
	'gene-sequence': Sequence
	'general-function': string
	'go-classifiers': FluffyGoClassifiers
	locus: null | string
	'molecular-weight': string
	name: string
	organism: OrganismClass
	pfams: FluffyPfams
	'signal-regions': null
	'specific-function': string
	synonyms: PolypeptideSynonyms
	'theoretical-pi': null
	'transmembrane-regions': string
}

export interface FluffyPfams {
	pfam: PfamElement[]
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
	public static toDrugbankD(json: string): DrugbankD {
		return cast(JSON.parse(json), r('DrugbankD'))
	}

	public static drugbankDToJson(value: DrugbankD): string {
		return JSON.stringify(uncast(value, r('DrugbankD')), null, 2)
	}
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
	const prettyTyp = prettyTypeName(typ)
	const parentText = parent ? ` on ${parent}` : ''
	const keyText = key ? ` for key "${key}"` : ''
	throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`)
}

function prettyTypeName(typ: any): string {
	if (Array.isArray(typ)) {
		if (typ.length === 2 && typ[0] === undefined) {
			return `an optional ${prettyTypeName(typ[1])}`
		} else {
			return `one of [${typ
				.map(a => {
					return prettyTypeName(a)
				})
				.join(', ')}]`
		}
	} else if (typeof typ === 'object' && typ.literal !== undefined) {
		return typ.literal
	} else {
		return typeof typ
	}
}

function jsonToJSProps(typ: any): any {
	if (typ.jsonToJS === undefined) {
		const map: any = {}
		typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
		typ.jsonToJS = map
	}
	return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
	if (typ.jsToJSON === undefined) {
		const map: any = {}
		typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
		typ.jsToJSON = map
	}
	return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
	function transformPrimitive(typ: string, val: any): any {
		if (typeof typ === typeof val) return val
		return invalidValue(typ, val, key, parent)
	}

	function transformUnion(typs: any[], val: any): any {
		// val must validate against one typ in typs
		const l = typs.length
		for (let i = 0; i < l; i++) {
			const typ = typs[i]
			try {
				return transform(val, typ, getProps)
			} catch (_) {}
		}
		return invalidValue(typs, val, key, parent)
	}

	function transformEnum(cases: string[], val: any): any {
		if (cases.indexOf(val) !== -1) return val
		return invalidValue(
			cases.map(a => {
				return l(a)
			}),
			val,
			key,
			parent
		)
	}

	function transformArray(typ: any, val: any): any {
		// val must be an array with no invalid elements
		if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent)
		return val.map(el => transform(el, typ, getProps))
	}

	function transformDate(val: any): any {
		if (val === null) {
			return null
		}
		const d = new Date(val)
		if (isNaN(d.valueOf())) {
			return invalidValue(l('Date'), val, key, parent)
		}
		return d
	}

	function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
		if (val === null || typeof val !== 'object' || Array.isArray(val)) {
			return invalidValue(l(ref || 'object'), val, key, parent)
		}
		const result: any = {}
		Object.getOwnPropertyNames(props).forEach(key => {
			const prop = props[key]
			const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined
			result[prop.key] = transform(v, prop.typ, getProps, key, ref)
		})
		Object.getOwnPropertyNames(val).forEach(key => {
			if (!Object.prototype.hasOwnProperty.call(props, key)) {
				result[key] = transform(val[key], additional, getProps, key, ref)
			}
		})
		return result
	}

	if (typ === 'any') return val
	if (typ === null) {
		if (val === null) return val
		return invalidValue(typ, val, key, parent)
	}
	if (typ === false) return invalidValue(typ, val, key, parent)
	let ref: any = undefined
	while (typeof typ === 'object' && typ.ref !== undefined) {
		ref = typ.ref
		typ = typeMap[typ.ref]
	}
	if (Array.isArray(typ)) return transformEnum(typ, val)
	if (typeof typ === 'object') {
		return typ.hasOwnProperty('unionMembers')
			? transformUnion(typ.unionMembers, val)
			: typ.hasOwnProperty('arrayItems')
			? transformArray(typ.arrayItems, val)
			: typ.hasOwnProperty('props')
			? transformObject(getProps(typ), typ.additional, val)
			: invalidValue(typ, val, key, parent)
	}
	// Numbers can be parsed by Date but shouldn't be.
	if (typ === Date && typeof val !== 'number') return transformDate(val)
	return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
	return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
	return transform(val, typ, jsToJSONProps)
}

function l(typ: any) {
	return { literal: typ }
}

function a(typ: any) {
	return { arrayItems: typ }
}

function u(...typs: any[]) {
	return { unionMembers: typs }
}

function o(props: any[], additional: any) {
	return { props, additional }
}

function m(additional: any) {
	return { props: [], additional }
}

function r(name: string) {
	return { ref: name }
}

const typeMap: any = {
	DrugbankD: o([{ json: 'drugbank', js: 'drugbank', typ: r('Drugbank') }], false),
	Drugbank: o(
		[
			{ json: '@exported-on', js: '@exported-on', typ: Date },
			{ json: '@version', js: '@version', typ: '' },
			{ json: '@xmlns', js: '@xmlns', typ: '' },
			{ json: '@xmlns:xsi', js: '@xmlns:xsi', typ: '' },
			{ json: '@xsi:schemaLocation', js: '@xsi:schemaLocation', typ: '' },
			{ json: 'drug', js: 'drug', typ: a(r('DrugElement')) }
		],
		false
	),
	DrugElement: o(
		[
			{ json: '@created', js: '@created', typ: Date },
			{ json: '@type', js: '@type', typ: r('Type') },
			{ json: '@updated', js: '@updated', typ: Date },
			{ json: 'absorption', js: 'absorption', typ: u(null, '') },
			{ json: 'affected-organisms', js: 'affected-organisms', typ: u(r('AffectedOrganisms'), null) },
			{ json: 'ahfs-codes', js: 'ahfs-codes', typ: null },
			{ json: 'atc-codes', js: 'atc-codes', typ: u(r('AtcCodes'), null) },
			{ json: 'carriers', js: 'carriers', typ: u(r('Carriers'), null) },
			{ json: 'cas-number', js: 'cas-number', typ: u(null, '') },
			{ json: 'categories', js: 'categories', typ: u(r('Categories'), null) },
			{ json: 'classification', js: 'classification', typ: u(undefined, r('Classification')) },
			{ json: 'clearance', js: 'clearance', typ: u(null, '') },
			{ json: 'description', js: 'description', typ: u(null, '') },
			{ json: 'dosages', js: 'dosages', typ: u(r('Dosages'), null) },
			{ json: 'drug-interactions', js: 'drug-interactions', typ: u(r('DrugInteractions'), null) },
			{ json: 'drugbank-id', js: 'drugbank-id', typ: u(a(u(r('DrugbankIDClass'), '')), r('DrugbankIDClass')) },
			{ json: 'enzymes', js: 'enzymes', typ: u(r('DrugEnzymes'), null) },
			{ json: 'experimental-properties', js: 'experimental-properties', typ: u(r('Properties'), null) },
			{ json: 'external-identifiers', js: 'external-identifiers', typ: u(r('DrugExternalIdentifiers'), null) },
			{ json: 'external-links', js: 'external-links', typ: u(r('ExternalLinks'), null) },
			{ json: 'food-interactions', js: 'food-interactions', typ: u(r('FoodInteractions'), null) },
			{ json: 'general-references', js: 'general-references', typ: r('GeneralReferencesClass') },
			{ json: 'groups', js: 'groups', typ: r('Groups') },
			{ json: 'half-life', js: 'half-life', typ: u(null, '') },
			{ json: 'indication', js: 'indication', typ: u(null, '') },
			{ json: 'international-brands', js: 'international-brands', typ: u(r('InternationalBrands'), null) },
			{ json: 'manufacturers', js: 'manufacturers', typ: u(r('Manufacturers'), null) },
			{ json: 'mechanism-of-action', js: 'mechanism-of-action', typ: u(null, '') },
			{ json: 'metabolism', js: 'metabolism', typ: u(null, '') },
			{ json: 'mixtures', js: 'mixtures', typ: u(r('Mixtures'), null) },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'packagers', js: 'packagers', typ: u(r('Packagers'), null) },
			{ json: 'patents', js: 'patents', typ: u(r('Patents'), null) },
			{ json: 'pathways', js: 'pathways', typ: u(r('Pathways'), null) },
			{ json: 'pdb-entries', js: 'pdb-entries', typ: u(r('PdbEntries'), null) },
			{ json: 'pharmacodynamics', js: 'pharmacodynamics', typ: u(null, '') },
			{ json: 'prices', js: 'prices', typ: u(r('Prices'), null) },
			{ json: 'products', js: 'products', typ: u(r('Products'), null) },
			{ json: 'protein-binding', js: 'protein-binding', typ: u(null, '') },
			{ json: 'reactions', js: 'reactions', typ: u(r('Reactions'), null) },
			{ json: 'route-of-elimination', js: 'route-of-elimination', typ: u(null, '') },
			{ json: 'salts', js: 'salts', typ: u(r('Salts'), null) },
			{ json: 'sequences', js: 'sequences', typ: u(undefined, u(r('Sequences'), null)) },
			{
				json: 'snp-adverse-drug-reactions',
				js: 'snp-adverse-drug-reactions',
				typ: u(r('SnpAdverseDrugReactions'), null)
			},
			{ json: 'snp-effects', js: 'snp-effects', typ: u(r('SnpEffects'), null) },
			{ json: 'state', js: 'state', typ: u(undefined, r('State')) },
			{ json: 'synonyms', js: 'synonyms', typ: u(r('DrugSynonyms'), null) },
			{ json: 'synthesis-reference', js: 'synthesis-reference', typ: u(null, '') },
			{ json: 'targets', js: 'targets', typ: u(r('Targets'), null) },
			{ json: 'toxicity', js: 'toxicity', typ: u(null, '') },
			{ json: 'transporters', js: 'transporters', typ: u(r('Transporters'), null) },
			{ json: 'unii', js: 'unii', typ: u(null, '') },
			{ json: 'volume-of-distribution', js: 'volume-of-distribution', typ: u(null, '') },
			{ json: 'fda-label', js: 'fda-label', typ: u(undefined, '') },
			{ json: 'msds', js: 'msds', typ: u(undefined, '') },
			{ json: 'average-mass', js: 'average-mass', typ: u(undefined, '') },
			{ json: 'calculated-properties', js: 'calculated-properties', typ: u(undefined, u(r('Properties'), null)) },
			{ json: 'monoisotopic-mass', js: 'monoisotopic-mass', typ: u(undefined, '') }
		],
		false
	),
	AffectedOrganisms: o([{ json: 'affected-organism', js: 'affected-organism', typ: u(a(''), '') }], false),
	AtcCodes: o([{ json: 'atc-code', js: 'atc-code', typ: u(a(r('AtcCodeElement')), r('AtcCodeElement')) }], false),
	AtcCodeElement: o(
		[
			{ json: '@code', js: '@code', typ: '' },
			{ json: 'level', js: 'level', typ: r('Level') }
		],
		false
	),
	Level: o(
		[
			{ json: '#text', js: '#text', typ: r('Text') },
			{ json: '@code', js: '@code', typ: r('Code') }
		],
		false
	),
	Properties: o([{ json: 'property', js: 'property', typ: u(a(r('PropertyElement')), r('PropertyElement')) }], false),
	PropertyElement: o(
		[
			{ json: 'kind', js: 'kind', typ: r('Kind') },
			{ json: 'source', js: 'source', typ: u(null, '') },
			{ json: 'value', js: 'value', typ: '' }
		],
		false
	),
	Carriers: o([{ json: 'carrier', js: 'carrier', typ: u(a(r('CarrierElement')), r('PurpleCarrier')) }], false),
	CarrierElement: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('TransporterOrganism') },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('PurplePolypeptide')), r('FluffyPolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('CarrierReferences') }
		],
		false
	),
	Actions: o([{ json: 'action', js: 'action', typ: u(a(r('ActionElement')), r('ActionElement')) }], false),
	PurplePolypeptide: o(
		[
			{ json: '@id', js: '@id', typ: '' },
			{ json: '@source', js: '@source', typ: r('Source') },
			{ json: 'amino-acid-sequence', js: 'amino-acid-sequence', typ: r('Sequence') },
			{ json: 'cellular-location', js: 'cellular-location', typ: u(r('CellularLocation'), null) },
			{ json: 'chromosome-location', js: 'chromosome-location', typ: u(null, '') },
			{ json: 'external-identifiers', js: 'external-identifiers', typ: r('PolypeptideExternalIdentifiers') },
			{ json: 'gene-name', js: 'gene-name', typ: u(null, '') },
			{ json: 'gene-sequence', js: 'gene-sequence', typ: r('Sequence') },
			{ json: 'general-function', js: 'general-function', typ: u(null, '') },
			{ json: 'go-classifiers', js: 'go-classifiers', typ: u(r('PurpleGoClassifiers'), null) },
			{ json: 'locus', js: 'locus', typ: u(null, '') },
			{ json: 'molecular-weight', js: 'molecular-weight', typ: u(null, '') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('OrganismClass') },
			{ json: 'pfams', js: 'pfams', typ: u(r('PurplePfams'), null) },
			{ json: 'signal-regions', js: 'signal-regions', typ: u(r('SignalRegions'), null) },
			{ json: 'specific-function', js: 'specific-function', typ: u(null, '') },
			{ json: 'synonyms', js: 'synonyms', typ: u(r('PolypeptideSynonyms'), null) },
			{ json: 'theoretical-pi', js: 'theoretical-pi', typ: u(null, '') },
			{ json: 'transmembrane-regions', js: 'transmembrane-regions', typ: u(null, '') }
		],
		false
	),
	Sequence: o(
		[
			{ json: '#text', js: '#text', typ: u(undefined, '') },
			{ json: '@format', js: '@format', typ: r('Format') }
		],
		false
	),
	PolypeptideExternalIdentifiers: o(
		[{ json: 'external-identifier', js: 'external-identifier', typ: a(r('ExternalIdentifierElement')) }],
		false
	),
	ExternalIdentifierElement: o(
		[
			{ json: 'identifier', js: 'identifier', typ: '' },
			{ json: 'resource', js: 'resource', typ: r('ExternalIdentifierResource') }
		],
		false
	),
	PurpleGoClassifiers: o(
		[{ json: 'go-classifier', js: 'go-classifier', typ: u(a(r('GoClassifierElement')), r('GoClassifierElement')) }],
		false
	),
	GoClassifierElement: o(
		[
			{ json: 'category', js: 'category', typ: r('GoClassifierCategory') },
			{ json: 'description', js: 'description', typ: '' }
		],
		false
	),
	OrganismClass: o(
		[
			{ json: '#text', js: '#text', typ: '' },
			{ json: '@ncbi-taxonomy-id', js: '@ncbi-taxonomy-id', typ: '' }
		],
		false
	),
	PurplePfams: o([{ json: 'pfam', js: 'pfam', typ: u(a(r('PfamElement')), r('PfamElement')) }], false),
	PfamElement: o(
		[
			{ json: 'identifier', js: 'identifier', typ: '' },
			{ json: 'name', js: 'name', typ: '' }
		],
		false
	),
	PolypeptideSynonyms: o([{ json: 'synonym', js: 'synonym', typ: u(a(''), '') }], false),
	FluffyPolypeptide: o(
		[
			{ json: '@id', js: '@id', typ: '' },
			{ json: '@source', js: '@source', typ: r('Source') },
			{ json: 'amino-acid-sequence', js: 'amino-acid-sequence', typ: r('Sequence') },
			{ json: 'cellular-location', js: 'cellular-location', typ: u(r('CellularLocation'), null) },
			{ json: 'chromosome-location', js: 'chromosome-location', typ: u(null, '') },
			{ json: 'external-identifiers', js: 'external-identifiers', typ: r('PolypeptideExternalIdentifiers') },
			{ json: 'gene-name', js: 'gene-name', typ: u(null, '') },
			{ json: 'gene-sequence', js: 'gene-sequence', typ: r('Sequence') },
			{ json: 'general-function', js: 'general-function', typ: u(null, '') },
			{ json: 'go-classifiers', js: 'go-classifiers', typ: r('FluffyGoClassifiers') },
			{ json: 'locus', js: 'locus', typ: u(null, '') },
			{ json: 'molecular-weight', js: 'molecular-weight', typ: '' },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('OrganismClass') },
			{ json: 'pfams', js: 'pfams', typ: u(r('PurplePfams'), null) },
			{ json: 'signal-regions', js: 'signal-regions', typ: u(r('SignalRegions'), null) },
			{ json: 'specific-function', js: 'specific-function', typ: u(null, '') },
			{ json: 'synonyms', js: 'synonyms', typ: u(r('PolypeptideSynonyms'), null) },
			{ json: 'theoretical-pi', js: 'theoretical-pi', typ: u(null, '') },
			{ json: 'transmembrane-regions', js: 'transmembrane-regions', typ: u(null, '') }
		],
		false
	),
	FluffyGoClassifiers: o([{ json: 'go-classifier', js: 'go-classifier', typ: a(r('GoClassifierElement')) }], false),
	CarrierReferences: o(
		[
			{ json: 'articles', js: 'articles', typ: u(r('Articles'), null) },
			{ json: 'attachments', js: 'attachments', typ: u(r('PurpleAttachments'), null) },
			{ json: 'links', js: 'links', typ: u(r('Links'), null) },
			{ json: 'textbooks', js: 'textbooks', typ: u(r('PurpleTextbooks'), null) }
		],
		false
	),
	Articles: o([{ json: 'article', js: 'article', typ: u(a(r('ArticleElement')), r('ArticleElement')) }], false),
	ArticleElement: o(
		[
			{ json: 'citation', js: 'citation', typ: '' },
			{ json: 'pubmed-id', js: 'pubmed-id', typ: u(null, '') },
			{ json: 'ref-id', js: 'ref-id', typ: '' }
		],
		false
	),
	PurpleAttachments: o([{ json: 'attachment', js: 'attachment', typ: r('AttachmentElement') }], false),
	AttachmentElement: o(
		[
			{ json: 'ref-id', js: 'ref-id', typ: '' },
			{ json: 'title', js: 'title', typ: '' },
			{ json: 'url', js: 'url', typ: '' }
		],
		false
	),
	Links: o([{ json: 'link', js: 'link', typ: u(a(r('AttachmentElement')), r('AttachmentElement')) }], false),
	PurpleTextbooks: o([{ json: 'textbook', js: 'textbook', typ: r('TextbookElement') }], false),
	TextbookElement: o(
		[
			{ json: 'citation', js: 'citation', typ: '' },
			{ json: 'isbn', js: 'isbn', typ: u(null, '') },
			{ json: 'ref-id', js: 'ref-id', typ: '' }
		],
		false
	),
	PurpleCarrier: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('PurpleOrganism') },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('FluffyPolypeptide')), r('FluffyPolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('CarrierReferences') }
		],
		false
	),
	Categories: o([{ json: 'category', js: 'category', typ: u(a(r('CategoryElement')), r('CategoryElement')) }], false),
	CategoryElement: o(
		[
			{ json: 'category', js: 'category', typ: '' },
			{ json: 'mesh-id', js: 'mesh-id', typ: u(null, '') }
		],
		false
	),
	Classification: o(
		[
			{ json: 'class', js: 'class', typ: u(null, '') },
			{ json: 'description', js: 'description', typ: u(null, '') },
			{ json: 'direct-parent', js: 'direct-parent', typ: '' },
			{ json: 'kingdom', js: 'kingdom', typ: r('Kingdom') },
			{ json: 'subclass', js: 'subclass', typ: u(null, '') },
			{ json: 'superclass', js: 'superclass', typ: u(r('Superclass'), null) },
			{ json: 'alternative-parent', js: 'alternative-parent', typ: u(undefined, u(a(''), '')) },
			{ json: 'substituent', js: 'substituent', typ: u(undefined, u(a(''), '')) }
		],
		false
	),
	Dosages: o([{ json: 'dosage', js: 'dosage', typ: u(a(r('DosageElement')), r('DosageElement')) }], false),
	DosageElement: o(
		[
			{ json: 'form', js: 'form', typ: u(null, '') },
			{ json: 'route', js: 'route', typ: u(null, '') },
			{ json: 'strength', js: 'strength', typ: u(null, '') }
		],
		false
	),
	DrugInteractions: o(
		[
			{
				json: 'drug-interaction',
				js: 'drug-interaction',
				typ: u(a(r('DrugInteractionElement')), r('DrugInteractionElement'))
			}
		],
		false
	),
	DrugInteractionElement: o(
		[
			{ json: 'description', js: 'description', typ: '' },
			{ json: 'drugbank-id', js: 'drugbank-id', typ: '' },
			{ json: 'name', js: 'name', typ: '' }
		],
		false
	),
	DrugbankIDClass: o(
		[
			{ json: '#text', js: '#text', typ: '' },
			{ json: '@primary', js: '@primary', typ: '' }
		],
		false
	),
	DrugEnzymes: o([{ json: 'enzyme', js: 'enzyme', typ: u(a(r('PurpleEnzyme')), r('FluffyEnzyme')) }], false),
	PurpleEnzyme: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'induction-strength', js: 'induction-strength', typ: u(r('TionStrength'), null) },
			{ json: 'inhibition-strength', js: 'inhibition-strength', typ: u(r('TionStrength'), null) },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: u(null, '') },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('FluffyPolypeptide')), r('PurplePolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('GeneralReferencesClass') }
		],
		false
	),
	GeneralReferencesClass: o(
		[
			{ json: 'articles', js: 'articles', typ: u(r('Articles'), null) },
			{ json: 'attachments', js: 'attachments', typ: u(r('GeneralReferencesAttachments'), null) },
			{ json: 'links', js: 'links', typ: u(r('Links'), null) },
			{ json: 'textbooks', js: 'textbooks', typ: u(r('GeneralReferencesTextbooks'), null) }
		],
		false
	),
	GeneralReferencesAttachments: o(
		[{ json: 'attachment', js: 'attachment', typ: u(a(r('AttachmentElement')), r('AttachmentElement')) }],
		false
	),
	GeneralReferencesTextbooks: o(
		[{ json: 'textbook', js: 'textbook', typ: u(a(r('TextbookElement')), r('TextbookElement')) }],
		false
	),
	FluffyEnzyme: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'induction-strength', js: 'induction-strength', typ: u(r('TionStrength'), null) },
			{ json: 'inhibition-strength', js: 'inhibition-strength', typ: u(r('TionStrength'), null) },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('EnzymeOrganism') },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('FluffyPolypeptide')), r('PurplePolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('PurpleReferences') }
		],
		false
	),
	PurpleReferences: o(
		[
			{ json: 'articles', js: 'articles', typ: u(r('Articles'), null) },
			{ json: 'attachments', js: 'attachments', typ: u(r('GeneralReferencesAttachments'), null) },
			{ json: 'links', js: 'links', typ: u(r('Links'), null) },
			{ json: 'textbooks', js: 'textbooks', typ: u(r('PurpleTextbooks'), null) }
		],
		false
	),
	DrugExternalIdentifiers: o(
		[
			{
				json: 'external-identifier',
				js: 'external-identifier',
				typ: u(a(r('ExternalIdentifierElement')), r('ExternalIdentifierElement'))
			}
		],
		false
	),
	ExternalLinks: o(
		[{ json: 'external-link', js: 'external-link', typ: u(a(r('ExternalLinkElement')), r('ExternalLinkElement')) }],
		false
	),
	ExternalLinkElement: o(
		[
			{ json: 'resource', js: 'resource', typ: r('ExternalLinkResource') },
			{ json: 'url', js: 'url', typ: '' }
		],
		false
	),
	FoodInteractions: o([{ json: 'food-interaction', js: 'food-interaction', typ: u(a(''), '') }], false),
	Groups: o([{ json: 'group', js: 'group', typ: u(a(r('GroupElement')), r('GroupElement')) }], false),
	InternationalBrands: o(
		[
			{
				json: 'international-brand',
				js: 'international-brand',
				typ: u(a(r('InternationalBrandElement')), r('InternationalBrandElement'))
			}
		],
		false
	),
	InternationalBrandElement: o(
		[
			{ json: 'company', js: 'company', typ: u(null, '') },
			{ json: 'name', js: 'name', typ: '' }
		],
		false
	),
	Manufacturers: o([{ json: 'manufacturer', js: 'manufacturer', typ: r('Manufacturer') }], false),
	Manufacturer: o(
		[
			{ json: '#text', js: '#text', typ: '' },
			{ json: '@generic', js: '@generic', typ: '' },
			{ json: '@url', js: '@url', typ: '' }
		],
		false
	),
	Mixtures: o([{ json: 'mixture', js: 'mixture', typ: u(a(r('MixtureElement')), r('MixtureElement')) }], false),
	MixtureElement: o(
		[
			{ json: 'ingredients', js: 'ingredients', typ: '' },
			{ json: 'name', js: 'name', typ: '' }
		],
		false
	),
	Packagers: o([{ json: 'packager', js: 'packager', typ: u(a(r('PackagerElement')), r('PackagerElement')) }], false),
	PackagerElement: o(
		[
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'url', js: 'url', typ: u(null, '') }
		],
		false
	),
	Patents: o([{ json: 'patent', js: 'patent', typ: u(a(r('PatentElement')), r('PatentElement')) }], false),
	PatentElement: o(
		[
			{ json: 'approved', js: 'approved', typ: Date },
			{ json: 'country', js: 'country', typ: r('Country') },
			{ json: 'expires', js: 'expires', typ: Date },
			{ json: 'number', js: 'number', typ: '' },
			{ json: 'pediatric-extension', js: 'pediatric-extension', typ: '' }
		],
		false
	),
	Pathways: o([{ json: 'pathway', js: 'pathway', typ: u(a(r('PathwayElement')), r('PathwayElement')) }], false),
	PathwayElement: o(
		[
			{ json: 'category', js: 'category', typ: r('PathwayCategory') },
			{ json: 'drugs', js: 'drugs', typ: r('Drugs') },
			{ json: 'enzymes', js: 'enzymes', typ: u(r('PathwayEnzymes'), null) },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'smpdb-id', js: 'smpdb-id', typ: '' }
		],
		false
	),
	Drugs: o([{ json: 'drug', js: 'drug', typ: u(a(r('LeftElement')), r('LeftElement')) }], false),
	LeftElement: o(
		[
			{ json: 'drugbank-id', js: 'drugbank-id', typ: '' },
			{ json: 'name', js: 'name', typ: '' }
		],
		false
	),
	PathwayEnzymes: o([{ json: 'uniprot-id', js: 'uniprot-id', typ: u(a(''), '') }], false),
	PdbEntries: o([{ json: 'pdb-entry', js: 'pdb-entry', typ: u(a(''), '') }], false),
	Prices: o([{ json: 'price', js: 'price', typ: u(a(r('PriceElement')), r('PriceElement')) }], false),
	PriceElement: o(
		[
			{ json: 'cost', js: 'cost', typ: r('Cost') },
			{ json: 'description', js: 'description', typ: '' },
			{ json: 'unit', js: 'unit', typ: r('Unit') }
		],
		false
	),
	Cost: o(
		[
			{ json: '#text', js: '#text', typ: '' },
			{ json: '@currency', js: '@currency', typ: r('Currency') }
		],
		false
	),
	Products: o([{ json: 'product', js: 'product', typ: u(a(m(u(null, ''))), m(u(null, ''))) }], false),
	Reactions: o([{ json: 'reaction', js: 'reaction', typ: u(a(r('PurpleReaction')), r('PurpleReaction')) }], false),
	PurpleReaction: o(
		[
			{ json: 'enzymes', js: 'enzymes', typ: u(r('ReactionEnzymes'), null) },
			{ json: 'left-element', js: 'left-element', typ: r('LeftElement') },
			{ json: 'right-element', js: 'right-element', typ: r('LeftElement') },
			{ json: 'sequence', js: 'sequence', typ: '' }
		],
		false
	),
	ReactionEnzymes: o([{ json: 'enzyme', js: 'enzyme', typ: u(a(r('TentacledEnzyme')), r('TentacledEnzyme')) }], false),
	TentacledEnzyme: o(
		[
			{ json: 'drugbank-id', js: 'drugbank-id', typ: '' },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'uniprot-id', js: 'uniprot-id', typ: u(null, '') }
		],
		false
	),
	Salts: o([{ json: 'salt', js: 'salt', typ: u(a(r('SaltElement')), r('SaltElement')) }], false),
	SaltElement: o(
		[
			{ json: 'average-mass', js: 'average-mass', typ: u(undefined, '') },
			{ json: 'cas-number', js: 'cas-number', typ: u(null, '') },
			{ json: 'drugbank-id', js: 'drugbank-id', typ: r('DrugbankIDClass') },
			{ json: 'inchikey', js: 'inchikey', typ: u(null, '') },
			{ json: 'monoisotopic-mass', js: 'monoisotopic-mass', typ: u(undefined, '') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'unii', js: 'unii', typ: u(null, '') }
		],
		false
	),
	Sequences: o([{ json: 'sequence', js: 'sequence', typ: r('Sequence') }], false),
	SnpAdverseDrugReactions: o(
		[{ json: 'reaction', js: 'reaction', typ: u(a(r('EffectElement')), r('EffectElement')) }],
		false
	),
	EffectElement: o(
		[
			{ json: 'adverse-reaction', js: 'adverse-reaction', typ: u(undefined, u(null, '')) },
			{ json: 'allele', js: 'allele', typ: u(null, '') },
			{ json: 'description', js: 'description', typ: '' },
			{ json: 'gene-symbol', js: 'gene-symbol', typ: '' },
			{ json: 'protein-name', js: 'protein-name', typ: '' },
			{ json: 'pubmed-id', js: 'pubmed-id', typ: u(null, '') },
			{ json: 'rs-id', js: 'rs-id', typ: u(null, '') },
			{ json: 'uniprot-id', js: 'uniprot-id', typ: '' },
			{ json: 'defining-change', js: 'defining-change', typ: u(undefined, '') }
		],
		false
	),
	SnpEffects: o([{ json: 'effect', js: 'effect', typ: u(a(r('EffectElement')), r('EffectElement')) }], false),
	DrugSynonyms: o([{ json: 'synonym', js: 'synonym', typ: r('Synonym') }], false),
	Synonym: o(
		[
			{ json: '#text', js: '#text', typ: '' },
			{ json: '@coder', js: '@coder', typ: r('Coder') },
			{ json: '@language', js: '@language', typ: r('Language') }
		],
		false
	),
	Targets: o([{ json: 'target', js: 'target', typ: u(a(r('TargetElement')), r('TargetElement')) }], false),
	TargetElement: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: u(null, '') },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('PurplePolypeptide')), r('PurplePolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('GeneralReferencesClass') }
		],
		false
	),
	Transporters: o(
		[{ json: 'transporter', js: 'transporter', typ: u(a(r('TransporterElement')), r('PurpleTransporter')) }],
		false
	),
	TransporterElement: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: '' },
			{
				json: 'polypeptide',
				js: 'polypeptide',
				typ: u(undefined, u(a(r('FluffyPolypeptide')), r('FluffyPolypeptide')))
			},
			{ json: 'references', js: 'references', typ: r('PurpleReferences') }
		],
		false
	),
	PurpleTransporter: o(
		[
			{ json: '@position', js: '@position', typ: '' },
			{ json: 'actions', js: 'actions', typ: u(r('Actions'), null) },
			{ json: 'id', js: 'id', typ: '' },
			{ json: 'known-action', js: 'known-action', typ: r('KnownAction') },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('TransporterOrganism') },
			{ json: 'polypeptide', js: 'polypeptide', typ: u(a(r('TentacledPolypeptide')), r('FluffyPolypeptide')) },
			{ json: 'references', js: 'references', typ: r('CarrierReferences') }
		],
		false
	),
	TentacledPolypeptide: o(
		[
			{ json: '@id', js: '@id', typ: '' },
			{ json: '@source', js: '@source', typ: r('Source') },
			{ json: 'amino-acid-sequence', js: 'amino-acid-sequence', typ: r('Sequence') },
			{ json: 'cellular-location', js: 'cellular-location', typ: r('CellularLocation') },
			{ json: 'chromosome-location', js: 'chromosome-location', typ: '' },
			{ json: 'external-identifiers', js: 'external-identifiers', typ: r('PolypeptideExternalIdentifiers') },
			{ json: 'gene-name', js: 'gene-name', typ: '' },
			{ json: 'gene-sequence', js: 'gene-sequence', typ: r('Sequence') },
			{ json: 'general-function', js: 'general-function', typ: '' },
			{ json: 'go-classifiers', js: 'go-classifiers', typ: r('FluffyGoClassifiers') },
			{ json: 'locus', js: 'locus', typ: u(null, '') },
			{ json: 'molecular-weight', js: 'molecular-weight', typ: '' },
			{ json: 'name', js: 'name', typ: '' },
			{ json: 'organism', js: 'organism', typ: r('OrganismClass') },
			{ json: 'pfams', js: 'pfams', typ: r('FluffyPfams') },
			{ json: 'signal-regions', js: 'signal-regions', typ: null },
			{ json: 'specific-function', js: 'specific-function', typ: '' },
			{ json: 'synonyms', js: 'synonyms', typ: r('PolypeptideSynonyms') },
			{ json: 'theoretical-pi', js: 'theoretical-pi', typ: null },
			{ json: 'transmembrane-regions', js: 'transmembrane-regions', typ: '' }
		],
		false
	),
	FluffyPfams: o([{ json: 'pfam', js: 'pfam', typ: a(r('PfamElement')) }], false),
	Type: ['biotech', 'small molecule'],
	Text: [
		'ALIMENTARY TRACT AND METABOLISM',
		'ANTIINFECTIVES FOR SYSTEMIC USE',
		'ANTINEOPLASTIC AND IMMUNOMODULATING AGENTS',
		'ANTIPARASITIC PRODUCTS, INSECTICIDES AND REPELLENTS',
		'BLOOD AND BLOOD FORMING ORGANS',
		'CARDIOVASCULAR SYSTEM',
		'DERMATOLOGICALS',
		'GENITO URINARY SYSTEM AND SEX HORMONES',
		'MUSCULO-SKELETAL SYSTEM',
		'NERVOUS SYSTEM',
		'RESPIRATORY SYSTEM',
		'SENSORY ORGANS',
		'SYSTEMIC HORMONAL PREPARATIONS, EXCL. SEX HORMONES AND INSULINS',
		'VARIOUS'
	],
	Code: ['A', 'B', 'C', 'D', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'V'],
	Kind: [
		'Bioavailability',
		'Boiling Point',
		'caco2 Permeability',
		'Ghose Filter',
		'H Bond Acceptor Count',
		'H Bond Donor Count',
		'Hydrophobicity',
		'IUPAC Name',
		'InChI',
		'InChIKey',
		'Isoelectric Point',
		'logP',
		'logS',
		'MDDR-Like Rule',
		'Melting Point',
		'Molecular Formula',
		'Molecular Weight',
		'Monoisotopic Weight',
		'Number of Rings',
		'pKa',
		'pKa (strongest acidic)',
		'pKa (strongest basic)',
		'Physiological Charge',
		'Polar Surface Area (PSA)',
		'Polarizability',
		'Radioactivity',
		'Refractivity',
		'Rotatable Bond Count',
		'Rule of Five',
		'SMILES',
		'Traditional IUPAC Name',
		'Water Solubility'
	],
	ActionElement: [
		'activator',
		'adduct',
		'agonist',
		'allosteric modulator',
		'antagonist',
		'antibody',
		'antisense oligonucleotide',
		'binder',
		'binding',
		'blocker',
		'carrier',
		'chaperone',
		'chelator',
		'cleavage',
		'cofactor',
		'component of',
		'cross-linking/alkylation',
		'degradation',
		'disruptor',
		'downregulator',
		'gene replacement',
		'inactivator',
		'incorporation into and destabilization',
		'inducer',
		'inhibition of synthesis',
		'inhibitor',
		'inhibitory allosteric modulator',
		'inhibits downstream inflammation cascades',
		'intercalation',
		'inverse agonist',
		'ligand',
		'metabolizer',
		'modulator',
		'multitarget',
		'negative modulator',
		'neutralizer',
		'nucleotide exchange blocker',
		'other',
		'other/unknown',
		'oxidizer',
		'partial agonist',
		'partial antagonist',
		'positive allosteric modulator',
		'potentiator',
		'product of',
		'protector',
		'reducer',
		'regulator',
		'stabilization',
		'stimulator',
		'substrate',
		'suppressor',
		'translocation inhibitor',
		'transporter',
		'unknown',
		'weak inhibitor'
	],
	KnownAction: ['no', 'unknown', 'yes'],
	TransporterOrganism: [
		'Escherichia coli (strain K12)',
		'Humans',
		'Mouse',
		'Trichophyton interdigitale (strain MR816)'
	],
	Source: ['Swiss-Prot', 'TrEMBL'],
	Format: ['FASTA'],
	CellularLocation: [
		'Apical cell membrane',
		'Basal cell membrane',
		'Basolateral cell membrane',
		'Cell inner membrane',
		'Cell inner membrane; multi-pass membrane protein',
		'Cell inner membrane; peripheral membrane protein',
		'Cell junction',
		'Cell membrane',
		'Cell outer membrane',
		'Cell projection',
		'Cell surface',
		'Cellular chromatophore membrane',
		'Cellular thylakoid membrane',
		'Chromosome',
		'Cytoplasm',
		'Cytoplasm (By similarity)',
		'Cytoplasmic',
		'Cytoplasmic granule',
		'Cytoplasmic vesicle',
		'Cytoplasmic vesicle membrane',
		'Early endosome',
		'Early endosome membrane',
		'Endomembrane system',
		'Endoplasmic reticulum',
		'Endoplasmic reticulum-Golgi intermediate compartment',
		'Endoplasmic reticulum-Golgi intermediate compartment membrane',
		'Endoplasmic reticulum lumen',
		'Endoplasmic reticulum membrane',
		'Endosome membrane',
		'Fimbrium',
		'Glycosome',
		'Golgi apparatus',
		'Golgi apparatus lumen',
		'Golgi apparatus membrane',
		'Host cell membrane',
		'Host cytoplasm',
		'Host endoplasmic reticulum membrane',
		'Host Golgi apparatus membrane',
		'Host membrane',
		'Host nucleus',
		'Late endosome membrane',
		'Lateral cell membrane',
		'Lysosome',
		'Lysosome membrane',
		'Melanosome',
		'Melanosome membrane',
		'Membrane',
		'Microsome',
		'Microsome membrane',
		'Midbody',
		'Mitochondrion',
		'Mitochondrion inner membrane',
		'Mitochondrion intermembrane space',
		'Mitochondrion matrix',
		'Mitochondrion membrane',
		'Mitochondrion outer membrane',
		'Nucleus',
		'Nucleus envelope',
		'Nucleus inner membrane',
		'Nucleus matrix',
		'Nucleus membrane',
		'Nucleus outer membrane',
		'Nucleus speckle',
		'Parasitophorous vacuole membrane',
		'Periplasm',
		'Peroxisome',
		'Peroxisome membrane',
		'Plastid',
		'Recycling endosome membrane',
		'Rough endoplasmic reticulum',
		'Rough endoplasmic reticulum membrane',
		'Sarcoplasmic reticulum',
		'Sarcoplasmic reticulum lumen',
		'Sarcoplasmic reticulum membrane',
		'Secreted',
		'Vacuole',
		'Vacuole membrane',
		'Virion',
		'Virion membrane'
	],
	ExternalIdentifierResource: [
		'BindingDB',
		'ChEBI',
		'ChEMBL',
		'ChemSpider',
		'Drugs Product Database (DPD)',
		'GenAtlas',
		'GenBank',
		'GenBank Gene Database',
		'GenBank Protein Database',
		'Guide to Pharmacology',
		'HUGO Gene Nomenclature Committee (HGNC)',
		'IUPHAR',
		'KEGG Compound',
		'KEGG Drug',
		'PDB',
		'PharmGKB',
		'PubChem Compound',
		'PubChem Substance',
		'RxCUI',
		'Therapeutic Targets Database',
		'UniProt Accession',
		'UniProtKB',
		'Wikipedia',
		'ZINC'
	],
	GoClassifierCategory: ['component', 'function', 'process'],
	SignalRegions: [
		'1-',
		'1-12',
		'1-13',
		'1-14',
		'1-15',
		'1-16',
		'1-17',
		'1-18',
		'1-19',
		'1-20',
		'1-21',
		'1-22',
		'1-23',
		'1-24',
		'1-25',
		'1-26',
		'1-27',
		'1-28',
		'1-29',
		'1-30',
		'1-31',
		'1-32',
		'1-33',
		'1-34',
		'1-35',
		'1-36',
		'1-37',
		'1-38',
		'1-39',
		'1-39\n21-39',
		'1-40',
		'1-41',
		'1-42',
		'1-43',
		'1-44',
		'1-45',
		'1-46',
		'1-47',
		'1-48',
		'1-49',
		'1-51',
		'1-52',
		'1-55',
		'1-57',
		'1-65',
		'1-8',
		'2-',
		'265-280'
	],
	PurpleOrganism: ['Humans', 'Rat'],
	Kingdom: ['Inorganic compounds', 'Organic compounds', 'Organic Compounds'],
	Superclass: [
		'Alkaloids and derivatives',
		'Benzenoids',
		'Homogeneous metal compounds',
		'Homogeneous non-metal compounds',
		'Hydrocarbon derivatives',
		'Hydrocarbons',
		'Inorganic salts',
		'Lignans, neolignans and related compounds',
		'Lipids and lipid-like molecules',
		'Mixed metal/non-metal compounds',
		'Nucleosides, nucleotides, and analogues',
		'Organic 1,3-dipolar compounds',
		'Organic Acids',
		'Organic acids and derivatives',
		'Organic nitrogen compounds',
		'Organic oxygen compounds',
		'Organic Polymers',
		'Organic salts',
		'Organohalogen compounds',
		'Organoheterocyclic compounds',
		'Organometallic compounds',
		'Organophosphorus compounds',
		'Organosulfur compounds',
		'Phenylpropanoids and polyketides'
	],
	TionStrength: ['moderate', 'strong', 'unknown', 'weak'],
	EnzymeOrganism: [
		'Alcaligenes sp.',
		'Bacillus licheniformis',
		'Bacillus sp. (strain OY1-2)',
		'Bacteroides thetaiotaomicron',
		'Enterobacter cloacae',
		'Escherichia coli',
		'Escherichia coli O1:K1 / APEC',
		'Humans',
		'Mycobacterium tuberculosis',
		'Pseudomonas fluorescens',
		'Staphylococcus aureus',
		'Trypanosoma cruzi',
		'Zymomonas mobilis subsp. mobilis (strain ATCC 31821 / ZM4 / CP4)'
	],
	ExternalLinkResource: ['Drugs.com', 'PDRhealth', 'RxList'],
	GroupElement: [
		'approved',
		'experimental',
		'illicit',
		'investigational',
		'nutraceutical',
		'vet_approved',
		'withdrawn'
	],
	Country: ['Canada', 'United States'],
	PathwayCategory: ['disease', 'drug_action', 'drug_metabolism', 'metabolic', 'physiological', 'signaling'],
	Currency: ['USD'],
	Unit: [
		'ampul',
		'ampule',
		'bottle',
		'box',
		'can',
		'caplet',
		'capsule',
		'cartridge',
		'container',
		'cup',
		'device',
		'disk',
		'disp',
		'dispersible tablet',
		'dose',
		'ea',
		'each',
		'enema',
		'g',
		'gel',
		'gel capsule',
		'gm',
		'implant',
		'inhaler',
		'insert',
		'jar',
		'kit',
		'liquid',
		'lollipop',
		'lozenge',
		'metered dose aerosol',
		'ml',
		'pack',
		'package',
		'packet',
		'patch',
		'pellet',
		'pen',
		'plastic',
		'powder',
		'redipen',
		'ring',
		'softgel capsule',
		'softget capsule',
		'solution',
		'spray',
		'strip',
		'suppository',
		'swab',
		'syringe',
		'syrup',
		'tab',
		'tablet',
		'troche',
		'tube',
		'vial'
	],
	State: ['gas', 'liquid', 'solid'],
	Coder: [
		'ban',
		'ban/jan/usp',
		'ban/usan',
		'ban/usp',
		'dcf',
		'dcit',
		'',
		'inn',
		'inn/ban',
		'inn/ban/dcf',
		'inn/ban/jan',
		'inn/ban/jan/usan',
		'inn/ban/jan/usan/usp',
		'inn/ban/usan',
		'inn/ban/usan/usp',
		'inn/dcit',
		'inn/jan',
		'inn/jan/usan',
		'inn/jan/usan/usp',
		'inn/jan/usp',
		'inn/usan',
		'inn/usan/usp',
		'inn/usp',
		'iupac',
		'iupac/jan/usp',
		'jan',
		'jan/usan',
		'jan/usan/usp',
		'jan/usp',
		'usan',
		'usan/usp',
		'usp'
	],
	Language: [
		'czech',
		'dutch',
		'english',
		'english/french',
		'english/german',
		'english/latin',
		'english/spanish',
		'english/spanish/french',
		'english/spanish/french/german',
		'french',
		'german',
		'italian',
		'latin',
		'polish',
		'spanish',
		'spanish/french/german'
	]
}

declare const drugdata: DrugbankD

export default drugdata

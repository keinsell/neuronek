import { ValueObject } from '../__core/valueobject.js'
import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table.js'
import { ChemicalNomenclature } from './chemical-nomenclature/chemical-nomenclature'
import { ClassMembership } from './class-membership/class-membership.js'
import { ExternalReferenceTable } from './external-reference-table/external-reference-table.js'

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
	class_membership?: ClassMembership
	/**
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	routes_of_administration?: RouteOfAdministrationTable

	externals?: ExternalReferenceTable
}

export class Substance extends ValueObject<SubstanceProperites> {}

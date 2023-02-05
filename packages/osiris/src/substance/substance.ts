import { RouteOfAdministrationTable } from '../route-of-administration/route-of-administration-table.js'
import { ChemicalNomenclature } from './chemical-nomenclature/chemical-nomenclature'
import { ClassMembership } from './class-membership/class-membership.js'
import { ExternalReferenceTable } from './external-reference-table/external-reference-table.js'

export class Substance {
	public readonly id: string
	/**
	 * Most popular common name for the substance.
	 * @example "Amphetamine"
	 */
	public readonly name: string

	/**
	 * Chemical nomenclature is the system of naming chemical compounds. The rules for naming compounds vary depending on the type of compound, but in general, they are based on the type and number of atoms present in the compound, as well as the chemical bonds between them. The most common system of chemical nomenclature is the International Union of Pure and Applied Chemistry (IUPAC) system, which is widely used in scientific literature and in industry.
	 */
	public readonly nomenclature?: ChemicalNomenclature

	/**
	 * Class membership refers to the classification of a chemical compound based on its structural and/or functional properties. In chemistry, compounds are often grouped into classes based on their chemical characteristics, such as their chemical formula, functional groups, or reactivity.
	 */
	public readonly class_membership?: ClassMembership

	/**
	 * Routes of administration refer to the different ways in which a chemical compound or a drug can be taken into the body.
	 */
	public readonly routes_of_administration?: RouteOfAdministrationTable

	public readonly externals?: ExternalReferenceTable

	private constructor(
		payload: {
			name: string
			nomenclature?: ChemicalNomenclature
			class_membership?: ClassMembership
			routes_of_administration?: RouteOfAdministrationTable
			externals?: ExternalReferenceTable
		},
		id?: string
	) {
		this.id = id ?? payload.name
		this.name = payload.name
		this.nomenclature = payload.nomenclature
		this.class_membership = payload.class_membership
		this.routes_of_administration = payload.routes_of_administration
		this.externals = payload.externals
	}

	public static create(payload: {
		id?: string
		name: string
		nomenclature?: ChemicalNomenclature
		class_membership?: ClassMembership
		routes_of_administration?: RouteOfAdministrationTable
		externals?: ExternalReferenceTable
	}): Substance {
		return new Substance(payload, payload.id)
	}
}

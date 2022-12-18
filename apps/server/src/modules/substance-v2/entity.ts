import { Entity } from "../../common/entity/entity.common";
import { ChemcialDetails } from "./entities/chemical-details.vo";
import { PsychoactiveClass } from "./entities/psychoactive-class.enum";
import { RouteOfAdministration } from "./entities/route-of-administration";

export interface SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: {
		common: string[];
		substitutive: string;
		systematic: string;
	};
	chemicalDetails: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: {
		dependence?: {};
		abusePotential?: {};
		tolerance?: {};
		withdrawal?: {};
	};
	legality?: {};
}

export class Substance extends Entity implements SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: {
		common: string[];
		substitutive: string;
		systematic: string;
	};
	chemicalDetails: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: {
		dependence?: {};
		abusePotential?: {};
		tolerance?: {};
		withdrawal?: {};
	};
	legality?: {};

	constructor(properties: SubstanceProperties, id?: string | number) {
		super(id);
		this.name = properties.name;
		this.description = properties.description;
		this.chemicalNomencalture = properties.chemicalNomencalture;
		this.chemicalDetails = properties.chemicalDetails;
		this.chemicalClass = properties.chemicalClass;
		this.psychoactiveClass = properties.psychoactiveClass;
		this.administrationBy = properties.administrationBy;
		this.pharmacology = properties.pharmacology;
		this.toxicity = properties.toxicity;
		this.effects = properties.effects;
		this.addiction = properties.addiction;
		this.legality = properties.legality;
	}
}

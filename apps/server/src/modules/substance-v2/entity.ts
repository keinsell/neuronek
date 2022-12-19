import { Entity } from "../../common/entity/entity.common";
import { NumberRange } from "../../utilities/range.vo";
import { ChemcialDetails } from "./entities/chemical-details.vo";
import { ChemcialNomencalture } from "./entities/chemical-nomencalture.vo";
import { PsychoactiveClass } from "./entities/psychoactive-class.enum";
import { RouteOfAdministration } from "./entities/route-of-administration.entity";
import { SubstanceAddiction } from "./entities/substance-addiction.vo";

export interface SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: ChemcialNomencalture;
	chemicalDetails?: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: SubstanceAddiction;
	legality?: {};
}

export class Substance extends Entity implements SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: ChemcialNomencalture;
	chemicalDetails?: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: SubstanceAddiction;
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

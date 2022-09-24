import { Entity } from "../../../../common/entity/entity.common";

export interface ChemicalNomenclatureProperties {
	commonNames: string[];
	substitutiveName: string;
	systematicName: string;
}

export class ChemicalNomenclature
	extends Entity
	implements ChemicalNomenclatureProperties
{
	commonNames: string[];
	substitutiveName: string;
	systematicName: string;

	constructor(
		properties: ChemicalNomenclatureProperties,
		id?: string | number,
	) {
		super(id);
		this.commonNames = properties.commonNames;
		this.substitutiveName = properties.substitutiveName;
		this.systematicName = properties.systematicName;
	}
}

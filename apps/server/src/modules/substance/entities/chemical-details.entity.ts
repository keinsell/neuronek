import { Entity } from "../../../common/entity/entity.common";

export interface ChemcialDetailsProperties {
  iupac: string;
  formula: string;
  molecularWeight: number;
  inchi: string;
  inchiKey: string;
  smiles: string;
}

export class ChemicalDetails
  extends Entity
  implements ChemcialDetailsProperties
{
  iupac: string;
  formula: string;
  molecularWeight: number;
  inchi: string;
  inchiKey: string;
  smiles: string;

  constructor(properties: ChemcialDetailsProperties, id?: string | number) {
    super(id);
    this.iupac = properties.iupac;
    this.formula = properties.formula;
    this.molecularWeight = properties.molecularWeight;
    this.inchi = properties.inchi;
    this.inchiKey = properties.inchiKey;
    this.smiles = properties.smiles;
  }
}

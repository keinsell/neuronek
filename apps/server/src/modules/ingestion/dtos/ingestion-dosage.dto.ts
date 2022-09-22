import { DosageClassification } from "../../substances/substance/entities/dosage.entity";

export interface IngestionDosage {
  substance: string;
  route: string;
  dosage: number;
  purity?: number;
  classification: DosageClassification | "unknown";
}

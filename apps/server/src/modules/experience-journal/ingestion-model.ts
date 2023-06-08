import { CUID, cuid } from "~foundry/indexing/cuid";
import { Ingestion as IngestionProperties } from "@prisma/client"
import { WriteModel } from "~foundry/cqrs/models/write-model";

export class IngestionModel extends WriteModel<CUID, IngestionProperties> implements IngestionProperties {
  substanceName: string | null;
  routeOfAdministration: string | null;
  dosage_unit: string | null;
  dosage_amount: number | null;
  isEstimatedDosage: boolean | null;
  date: Date | null;
  subject_id: string | null;
}

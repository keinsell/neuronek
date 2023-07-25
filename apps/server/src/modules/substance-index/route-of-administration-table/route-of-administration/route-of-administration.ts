import { Bioavailability } from "./bioavailability/bioavailability";
import { PhaseTable } from "./phase-table/phase-table";
import { RouteOfAdministrationClassification } from "./route-of-administration-classification";

export interface RouteOfAdmnistration {
  readonly classification: RouteOfAdministrationClassification
  readonly bioavailability?: Bioavailability
  readonly dosage: any
  readonly phase: PhaseTable
}

import { Duration } from "src/shared/common/duration";
import { PhaseClassification } from "./phase-classification";

export interface Phase {
  clasification: PhaseClassification
  range: [Duration?, Duration?]
}

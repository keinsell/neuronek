export { RouteOfAdministrationClassification } from "./route-of-administration/classification";
export { DosageClassification } from "./dosage/classification";

import { PhaseClassification } from "./phase/classification.js";
// trunk-ignore(eslint)
import { Substance } from "./types";

export const substances: Substance[] = [
  await import("./substances/stimulants/amphetamine.json"),
];

export { PhaseClassification };

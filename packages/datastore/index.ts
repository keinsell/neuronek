export { RouteOfAdministrationClassification } from "./src/model/route-of-administration/classification";
export { DosageClassification } from "./src/model/dosage/classification";

import { PhaseClassification } from "./src/model/phase/classification.js";
// trunk-ignore(eslint)
import { Substance } from "./types";

export const substances: Substance[] = [
  await import("./substances/stimulants/amphetamine.json"),
];

export { PhaseClassification };

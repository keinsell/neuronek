export { DosageClassification } from "./dosage/classification";

// trunk-ignore(eslint)
import { Substance } from "./types";

export const substances: Substance[] = [
  await import("./substances/stimulants/amphetamine.json"),
];

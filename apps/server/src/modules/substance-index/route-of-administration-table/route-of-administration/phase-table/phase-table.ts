import { Result } from "~foundry/technical/result";
import { PhaseNotFound } from "./phase/errors/phase-not-found";
import { Phase } from "./phase/phase";
import { PhaseClassification } from "./phase/phase-classification";

export interface PhaseTable {
 content: { [phase in PhaseClassification]?: Phase}
 getPhase(phase: PhaseClassification): Result<Phase, PhaseNotFound>
}

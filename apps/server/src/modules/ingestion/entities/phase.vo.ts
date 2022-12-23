import { PhaseClassification } from "../../substance/entities/phase-classification.enum";
import { Ingestion } from "../entity";

export class Phase {
	constructor(
		public ingestion: Ingestion,
		public phase: PhaseClassification
	) {}

	static fromIngestion(
		ingestion: Ingestion,
		phase: PhaseClassification
	): Phase {
		return new Phase(ingestion, phase);
	}

	startsAt(): Date {}
	endsAt(): Date {}
}

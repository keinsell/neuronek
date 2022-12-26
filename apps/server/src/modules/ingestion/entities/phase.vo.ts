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

	startsAt(): Date {
		return this.ingestion.date;
	}
	endsAt(): Date {
		return new Date(
			this.ingestion.date.getTime() +
				this.ingestion.substance
					.getAdministrationRouteOrThrow(this.ingestion.route)
					.getTimeToPhase(this.phase).avg
		);
	}
}

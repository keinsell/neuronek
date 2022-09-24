import {
	DomesticEvent,
	KnownDomainEvents,
} from "../../../common/event/event.common";
import { Ingestion } from "../entities/ingestion.entity";

export class IngestedSubstanceEvent extends DomesticEvent<Ingestion> {
	constructor(ingestion: Ingestion) {
		super(KnownDomainEvents.ingestedSubstance, ingestion);
	}

	override toConsole(): void {
		console.log(
			`IngestedSubstanceEvent(${
				this.data.id
			}): ${this.data.date.toISOString()} - ${this.data.substance.name} - ${
				this.data.dosage
			}mg`,
		);
	}
}

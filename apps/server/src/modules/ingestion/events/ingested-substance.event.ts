import {
	DomesticEvent,
	KnownDomainEvents,
} from "../../../common/event/event.common";
import { Prettylogs } from "../../../utilities/prettylogs.util.js";
import { Ingestion } from "../entities/ingestion.entity";

export class IngestedSubstanceEvent extends DomesticEvent<Ingestion> {
	constructor(ingestion: Ingestion) {
		super(KnownDomainEvents.ingestedSubstance, ingestion);
	}

	override toConsole(): void {
		const message = `User ${Prettylogs.shortenCuid(
			this.data.user.id.toString()
		)} ingested ${this.data.dosage}mg of ${this.data.substance.name} via ${
			this.data.route
		}. (${this.data.id
			.toString()
			.slice(
				this.data.id.toString().length - 8,
				this.data.id.toString().length
			)})`;

		console.log(message);
	}
}

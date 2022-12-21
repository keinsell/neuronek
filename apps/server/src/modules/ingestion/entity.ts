import { Entity } from "../../common/lib/domain/entity";
import { MassUnit } from "../../utilities/mass.vo";
import { DosageClassification } from "../substance/entities/dosage-classification.enum";
import { PhaseClassification } from "../substance/entities/phase-classification.enum";
import { RouteOfAdministrationClassification } from "../substance/entities/route-of-administration-classification.enum";
import { Substance } from "../substance/entity";
import { User } from "../user/entity";

export interface IngestionProperties {
	substance: Substance;
	amount: MassUnit;
	route: RouteOfAdministrationClassification;
	purity?: number;
	date: Date;
	user: User;
	status?: "planned" | "active" | "finished";
}

export class Ingestion extends Entity implements IngestionProperties {
	substance: Substance;
	route: RouteOfAdministrationClassification;
	amount: MassUnit;
	purity?: number;
	date: Date;
	user: User;

	constructor(properties: IngestionProperties, id?: string | number) {
		super(id);
		this.substance = properties.substance;
		this.amount = properties.amount;
		this.purity = properties.purity;
		this.date = properties.date;
		this.user = properties.user;
		this.route = properties.route;
	}

	get status(): "planned" | "active" | "finished" {
		if (this.isActive) {
			return "active";
		} else if (this.isPlanned) {
			return "planned";
		} else {
			return "finished";
		}
	}

	get ingestionEffectsEndsAt(): Date {
		return new Date(
			this.date.getTime() +
				this.substance.getTotalDurationOfEffectsRelativeToRouteOfAdministration(
					this.route
				)
		);
	}

	get isActive(): boolean {
		const now = new Date();
		return now.getTime() < this.ingestionEffectsEndsAt.getTime();
	}

	get isPlanned(): boolean {
		const ingestionStartsAt = new Date(
			this.date.getTime() -
				this.substance.getTotalDurationOfEffectsRelativeToRouteOfAdministration(
					this.route
				)
		);

		const now = new Date();
		return now.getTime() > ingestionStartsAt.getTime();
	}

	get isFinished(): boolean {
		return !(this.isActive || this.isPlanned);
	}

	getActiveIngestionInstance(): ActiveIngestion | null {
		if (this.isActive) {
			return new ActiveIngestion(this, this.id);
		} else {
			return null;
		}
	}

	getPlannedIngestionInstance(): PlannedIngestion | null {
		if (this.isPlanned) {
			return new PlannedIngestion(this, this.id);
		} else {
			return null;
		}
	}

	getTimeSinceIngestion(): number {
		return Date.now() - this.date.getTime();
	}

	getTimeUntilIngestionEnds(): number {
		return this.ingestionEffectsEndsAt.getTime() - Date.now();
	}

	getIngestionPhases() {
		const { date, substance } = this;
		const { administrationBy } = substance;

		const administrationRoute = administrationBy.find(
			(route) => route.classification === this.route
		);

		if (!administrationRoute) {
			throw new Error("No route of administration found");
		}

		const { onset, comeup, peak, offset, aftereffects } =
			administrationRoute.duration;

		let phases = [];

		// Onset

		phases.push({
			phase: PhaseClassification.onset,
			isCompleted: this.getTimeSinceIngestion() > onset,
			startedAt: date,
			endedAt: new Date(date.getTime() + onset),
		});

		// Comeup

		phases.push({
			phase: PhaseClassification.comeup,
			isCompleted: this.getTimeSinceIngestion() > onset + comeup,
			startedAt: new Date(date.getTime() + onset),
			endedAt: new Date(date.getTime() + onset + comeup),
		});

		// Peak

		phases.push({
			phase: PhaseClassification.peak,
			isCompleted: this.getTimeSinceIngestion() > onset + comeup + peak,
			startedAt: new Date(date.getTime() + onset + comeup),
			endedAt: new Date(date.getTime() + onset + comeup + peak),
		});

		// Offset

		phases.push({
			phase: PhaseClassification.offset,
			isCompleted:
				this.getTimeSinceIngestion() > onset + comeup + peak + offset,
			startedAt: new Date(date.getTime() + onset + comeup + peak),
			endedAt: new Date(date.getTime() + onset + comeup + peak + offset),
		});

		// Aftereffects

		phases.push({
			phase: PhaseClassification.aftereffects,
			isCompleted:
				this.getTimeSinceIngestion() >
				onset + comeup + peak + offset + aftereffects,
			startedAt: new Date(
				date.getTime() + onset + comeup + peak + offset
			),
			endedAt: new Date(
				date.getTime() + onset + comeup + peak + offset + aftereffects
			),
		});

		return phases;
	}

	getCurrentPhase(): PhaseClassification | undefined {
		const phases = this.getIngestionPhases();

		const currentPhase = phases.find(
			(phase) => phase.endedAt.getTime() > Date.now()
		);

		if (!currentPhase) {
			return undefined;
		}

		return currentPhase.phase;
	}

	get purityAdjustedDosage(): MassUnit {
		const { amount, purity } = this;
		const dosage = amount.baseScalar * (purity ?? 1);
		return MassUnit.fromBase(dosage);
	}

	get dosageClassification(): DosageClassification {
		const classification = this.substance.getDosageClassification(
			this.purityAdjustedDosage,
			this.route
		);
		return classification;
	}
}

export class ActiveIngestion extends Ingestion {
	constructor(properties: IngestionProperties, id?: string | number) {
		super(properties, id);
	}
}

export class PlannedIngestion extends Ingestion {}

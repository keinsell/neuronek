import ms from "ms";
import { Entity } from "../../../common/entity/entity.common";
import type { DosageClassification } from "../../substances/substance/entities/dosage.entity";
import { PhaseType } from "../../substances/substance/entities/phase.entity";
import type { RouteOfAdministrationType } from "../../substances/route-of-administration/entities/route-of-administration.entity";
import type { Substance } from "../../substances/substance/entities/substance.entity";
import type { User } from "../../user/entities/user.entity";
import type { IngestionDosage } from "../dtos/ingestion-dosage.dto";
import type { IngestionPlan } from "../dtos/ingestion-plan.dto";

export interface IngestionProperties {
	substance: Substance;
	route: RouteOfAdministrationType;
	dosage: number;
	purity?: number;
	date: Date;
	purpose?: string;
	set?: string;
	setting?: string;
	user: User;
}

export class Ingestion extends Entity implements IngestionProperties {
	substance: Substance;
	dosage: number;
	date: Date;
	route: RouteOfAdministrationType;
	purity?: number | undefined;
	purpose?: string | undefined;
	setting?: string | undefined;
	set?: string | undefined;
	user: User;

	constructor(properties: IngestionProperties, id?: string | number) {
		super(id);
		this.substance = properties.substance;
		this.dosage = properties.dosage;
		this.date = properties.date;
		this.route = properties.route;
		this.purity = properties.purity;
		this.purpose = properties.purpose;
		this.setting = properties.setting;
		this.set = properties.set;
		this.user = properties.user;
	}

	getTimeSinceIngestion(): number {
		return Date.now() - this.date.getTime();
	}

	getIngestionStages() {
		const { date, substance, route } = this;
		const { administrationRoutes } = substance;

		const administrationRoute = administrationRoutes.find(
			(v) => v.route === route,
		);

		if (!administrationRoute?.duration) {
			throw new Error("No duration found for route of administration");
		}

		const { onset, comeup, peak, offset, aftereffects } =
			administrationRoute.duration;

		// TODO: Optimize this calculation in loop, I had no idea how to do it.

		const onsetStage = {
			stage: PhaseType.onset,
			isCompleted: this.getTimeSinceIngestion() > onset,
			startedAt: date,
			endedAt: new Date(date.getTime() + onset),
		};

		const comeupStage = {
			stage: PhaseType.comeup,
			isCompleted: this.getTimeSinceIngestion() > onset + comeup,
			startedAt: new Date(date.getTime() + onset),
			endedAt: new Date(date.getTime() + onset + comeup),
		};

		const peakStage = {
			stage: PhaseType.peak,
			isCompleted: this.getTimeSinceIngestion() > onset + comeup + peak,
			startedAt: new Date(date.getTime() + onset + comeup),
			endedAt: new Date(date.getTime() + onset + comeup + peak),
		};

		const offsetStage = {
			stage: PhaseType.offset,
			isCompleted:
				this.getTimeSinceIngestion() > onset + comeup + peak + offset,
			startedAt: new Date(date.getTime() + onset + comeup + peak),
			endedAt: new Date(date.getTime() + onset + comeup + peak + offset),
		};

		const aftereffectsStage = {
			stage: PhaseType.aftereffects,
			isCompleted:
				this.getTimeSinceIngestion() >
				onset + comeup + peak + offset + aftereffects,
			startedAt: new Date(date.getTime() + onset + comeup + peak + offset),
			endedAt: new Date(
				date.getTime() + onset + comeup + peak + offset + aftereffects,
			),
		};

		return [onsetStage, comeupStage, peakStage, offsetStage, aftereffectsStage];
	}

	getIngestionStage() {
		const { substance, route } = this;
		const { administrationRoutes } = substance;

		const administrationRoute = administrationRoutes.find(
			(v) => v.route === route,
		);

		if (!administrationRoute?.duration) {
			throw new Error("No duration found for route of administration");
		}

		const stages = this.getIngestionStages();

		const currentStage = stages.find((v) => !v.isCompleted);

		if (!currentStage) {
			return;
		}

		return currentStage;
	}

	getIngestionProgression() {
		const { substance, route } = this;
		const { administrationRoutes } = substance;

		const administrationRoute = administrationRoutes.find(
			(v) => v.route === route,
		);

		if (!administrationRoute?.duration) {
			throw new Error("No duration found for route of administration");
		}

		const { onset, comeup, peak, offset, aftereffects } =
			administrationRoute.duration;

		const totalTime = onset + comeup + peak + offset + aftereffects;
		const passedTime = this.getTimeSinceIngestion();
		const timeLeft = totalTime - passedTime;
		const progress = passedTime / totalTime;

		if (progress > 1 || progress < 0) {
			return;
		}

		const currentStage = this.getIngestionStage();

		if (!currentStage) {
			return;
		}

		return {
			substance: this.substance.name,
			totalTime: ms(totalTime),
			passedTime: ms(passedTime),
			timeLeft: ms(timeLeft),
			stage: this.getIngestionStage()?.stage,
			nextStageIn: ms(currentStage.endedAt.getTime() - Date.now()),
			progress: `${Number(progress * 100).toFixed(2)}%`,
		};
	}

	getIngestionDosage(): IngestionDosage {
		const { substance, route, dosage, purity } = this;

		let pureDosage = dosage;

		if (purity) {
			pureDosage = dosage * purity;
		}

		const dosageClassification = substance.getDosageClassification(
			pureDosage,
			route,
		);

		if (!dosageClassification) {
			throw new Error("No dosage classification found");
		}

		return {
			substance: substance.name,
			route,
			dosage: pureDosage,
			classification: dosageClassification as DosageClassification,
		};
	}

	isActive() {
		const { substance, route } = this;
		const { administrationRoutes } = substance;

		const administrationRoute = administrationRoutes.find(
			(v) => v.route === route,
		);

		if (!administrationRoute?.duration) {
			throw new Error("No duration found for route of administration");
		}

		const { onset, comeup, peak, offset, aftereffects } =
			administrationRoute.duration;

		const totalTime = onset + comeup + peak + offset + aftereffects;
		const passedTime = this.getTimeSinceIngestion();

		return passedTime < totalTime;
	}

	getIngestionPlan(): IngestionPlan {
		throw new Error("Not implemented");
	}
	//   getIngestionProgression(): number {}
}

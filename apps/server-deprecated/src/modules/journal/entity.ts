/* eslint-disable jsdoc/require-returns */
import { MassUnit } from "../../utilities/mass.vo";
import { Ingestion } from "../ingestion/entity";
import { IngestionRepository } from "../ingestion/repository";
import { PsychoactiveClass } from "../substance/entities/psychoactive-class.enum";
import { Substance } from "../substance/entity";
import { User } from "../user/entity";

export class Journal {
	ownedBy: User;
	constructor(public ingestions: Ingestion[], user: User) {
		this.ingestions = ingestions;
		this.ownedBy = user;
	}

	static async aggregateByUser(
		user: User,
		ingestionRepository: IngestionRepository = new IngestionRepository()
	): Promise<Journal> {
		const userIngestions =
			await ingestionRepository.findAllByIngesterUsername(user.username);

		return new Journal(userIngestions, user);
	}

	public filterBy(filter: {
		substance?: Substance[];
		psychoactiveClass?: PsychoactiveClass[];
	}): Journal {
		const filteredIngestions = this.ingestions.filter((ingestion) => {
			if (filter.substance) {
				return filter.substance.includes(ingestion.substance);
			}
			if (filter.psychoactiveClass) {
				return filter.psychoactiveClass.includes(
					ingestion.substance.psychoactiveClass
				);
			}
			return true;
		});
		return new Journal(filteredIngestions, this.ownedBy);
	}

	getSumDosage() {
		return MassUnit.fromBase(
			this.ingestions.reduce(
				(a, v) => a + v.purityAdjustedDosage.baseScalar,
				0
			)
		);
	}

	getAverageDosage() {
		const totalDosage = this.getSumDosage();
		return MassUnit.fromBase(totalDosage.baseScalar / this.ingestionCount);
	}

	getAverageTimeBetweenIngestions() {}

	getTimeSinceLastIngestion() {}

	/** Get `Date` object of earliest ingestion noticed in Journal. */
	getDateOfFirstIngestion() {
		let oldestIngestionDate: Date | undefined;

		for (const ingestion of this.ingestions) {
			if (!oldestIngestionDate) {
				oldestIngestionDate = ingestion.date;
			}

			if (ingestion.date < oldestIngestionDate) {
				oldestIngestionDate = ingestion.date;
			}
		}

		if (!oldestIngestionDate) {
			throw new Error(
				"Unable to find oldest ingestion date in Journal. This should never happen."
			);
		}

		return oldestIngestionDate;
	}

	getDateOfLastIngestion() {
		let newestIngestionDate: Date | undefined;

		for (const ingestion of this.ingestions) {
			if (!newestIngestionDate) {
				newestIngestionDate = ingestion.date;
			}

			if (ingestion.date > newestIngestionDate) {
				newestIngestionDate = ingestion.date;
			}
		}

		if (!newestIngestionDate) {
			throw new Error(
				"Unable to find newest ingestion date in Journal. This should never happen."
			);
		}

		return newestIngestionDate;
	}

	getHighestDosage() {
		let highestDosage: MassUnit | undefined;

		for (const ingestion of this.ingestions) {
			if (!highestDosage) {
				highestDosage = ingestion.purityAdjustedDosage;
			}

			if (ingestion.purityAdjustedDosage > highestDosage) {
				highestDosage = ingestion.purityAdjustedDosage;
			}
		}

		if (!highestDosage) {
			throw new Error(
				"Unable to find highest dosage in Journal. This should never happen."
			);
		}

		return highestDosage;
	}

	getLowestDosage() {
		let lowestDosage: MassUnit | undefined;

		for (const ingestion of this.ingestions) {
			if (!lowestDosage) {
				lowestDosage = ingestion.purityAdjustedDosage;
			}

			if (ingestion.purityAdjustedDosage < lowestDosage) {
				lowestDosage = ingestion.purityAdjustedDosage;
			}
		}

		if (!lowestDosage) {
			throw new Error(
				"Unable to find lowest dosage in Journal. This should never happen."
			);
		}

		return lowestDosage;
	}

	getAverageDosagePerDay() {
		const totalDosage = this.getSumDosage();
		const daysSinceFirstIngestion = this.getDaysSinceFirstIngestion();
		return MassUnit.fromBase(
			totalDosage.baseScalar / daysSinceFirstIngestion
		);
	}

	getDaysSinceFirstIngestion() {
		const firstIngestionDate = this.getDateOfFirstIngestion();
		const today = new Date();
		return (
			(today.getTime() - firstIngestionDate.getTime()) /
			(1000 * 3600 * 24)
		);
	}

	get ingestionCount(): number {
		return this.ingestions.length;
	}
}
